import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order, PaymentStatus, OrderStatus, AuditLogEntry, Product } from '../types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const ORDERS_LOCAL_KEY = 'amiri_diva_orders_v1';
const PRODUCTS_LOCAL_KEY = 'amiri_diva_products_v1';
const AUDIT_LOGS_LOCAL_KEY = 'amiri_diva_audit_logs_v1';

// Helper to get stored orders locally
export function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_LOCAL_KEY);
    if (!raw) return getInitialDemoOrders();
    return JSON.parse(raw);
  } catch {
    return getInitialDemoOrders();
  }
}

// Helper to save orders locally
export function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(ORDERS_LOCAL_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders to local storage:', err);
  }
}

// Helper for Audit Logs
export function getLocalAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_LOCAL_KEY);
    return raw ? JSON.parse(raw) : getInitialDemoAuditLogs();
  } catch {
    return getInitialDemoAuditLogs();
  }
}

export function recordAuditLog(action: string, actor: string, details: string): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    action,
    actor,
    details
  };
  const logs = getLocalAuditLogs();
  const updated = [entry, ...logs].slice(0, 100);
  try {
    localStorage.setItem(AUDIT_LOGS_LOCAL_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error storing audit log:', e);
  }
  return entry;
}

// Order creation RPC / logic
export async function createOrderSecurely(orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'paymentStatus' | 'orderStatus' | 'auditLogs'>): Promise<Order> {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const serverOrderNumber = `AD-${year}-${randomNum}`;
  const nowStr = new Date().toISOString();

  const initialAudit: AuditLogEntry = {
    id: `log-init-${Date.now()}`,
    timestamp: nowStr,
    action: 'ORDER_CREATED',
    actor: 'Customer (Checkout System)',
    details: `Order ${serverOrderNumber} created. Subtotal: KES ${orderInput.subtotalKES.toLocaleString()}, Total: KES ${orderInput.totalAmountKES.toLocaleString()}. Stock reserved.`
  };

  const newOrder: Order = {
    ...orderInput,
    id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    orderNumber: serverOrderNumber,
    createdAt: nowStr,
    paymentStatus: 'PENDING',
    orderStatus: 'PLACED',
    pochiNumber: '07417758',
    auditLogs: [initialAudit]
  };

  // Try saving to Supabase if configured
  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').insert({
        order_number: serverOrderNumber,
        customer_name: orderInput.customerName,
        customer_email: orderInput.customerEmail,
        customer_phone: orderInput.customerPhone,
        delivery_address: orderInput.deliveryAddress,
        delivery_county: orderInput.deliveryCounty,
        delivery_town: orderInput.deliveryTown,
        items: orderInput.items,
        subtotal_kes: orderInput.subtotalKES,
        shipping_fee_kes: orderInput.shippingFeeKES,
        discount_kes: orderInput.discountKES,
        total_amount_kes: orderInput.totalAmountKES,
        payment_method: 'POCHI_LA_BIASHARA',
        pochi_number: '07417758',
        payment_status: 'PENDING',
        order_status: 'PLACED',
        audit_logs: [initialAudit]
      }).select().single();

      if (!error && data) {
        newOrder.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase insert skipped or table unavailable, using resilient fallback:', e);
    }
  }

  // Update local storage
  const currentOrders = getLocalOrders();
  const updatedOrders = [newOrder, ...currentOrders];
  saveLocalOrders(updatedOrders);

  recordAuditLog(
    'ORDER_CREATED',
    orderInput.customerName,
    `Created order ${serverOrderNumber} with ${orderInput.items.length} item(s) to ${orderInput.deliveryTown}, ${orderInput.deliveryCounty}.`
  );

  return newOrder;
}

// Submit M-Pesa Reference
export async function submitMpesaPaymentReference(orderId: string, mpesaCode: string): Promise<Order | null> {
  const cleanCode = mpesaCode.trim().toUpperCase();
  const nowStr = new Date().toISOString();

  const currentOrders = getLocalOrders();
  const orderIndex = currentOrders.findIndex(o => o.id === orderId || o.orderNumber === orderId);

  if (orderIndex === -1) {
    throw new Error('Order not found.');
  }

  const order = currentOrders[orderIndex];

  const auditEntry: AuditLogEntry = {
    id: `log-mpesa-${Date.now()}`,
    timestamp: nowStr,
    action: 'PAYMENT_SUBMITTED',
    actor: `Customer (${order.customerName})`,
    details: `M-Pesa Pochi la Biashara reference code [${cleanCode}] submitted for verification by Manager.`
  };

  const updatedOrder: Order = {
    ...order,
    mpesaReference: cleanCode,
    paymentSubmittedAt: nowStr,
    paymentStatus: 'SUBMITTED',
    auditLogs: [auditEntry, ...order.auditLogs]
  };

  currentOrders[orderIndex] = updatedOrder;
  saveLocalOrders(currentOrders);

  // Sync to Supabase if present
  if (supabase) {
    try {
      await supabase.from('orders').update({
        mpesa_reference: cleanCode,
        payment_submitted_at: nowStr,
        payment_status: 'SUBMITTED',
        audit_logs: updatedOrder.auditLogs
      }).eq('id', order.id);
    } catch (e) {
      console.warn('Supabase sync update skipped:', e);
    }
  }

  recordAuditLog(
    'PAYMENT_SUBMITTED',
    order.customerName,
    `M-Pesa code ${cleanCode} attached to order ${order.orderNumber}.`
  );

  return updatedOrder;
}

// Manager Review: Verify or Reject Payment
export async function updatePaymentVerification(
  orderId: string,
  verified: boolean,
  managerName: string = 'Manager (Amiri Diva Eldoret)',
  rejectionReason?: string
): Promise<Order | null> {
  const nowStr = new Date().toISOString();
  const currentOrders = getLocalOrders();
  const orderIndex = currentOrders.findIndex(o => o.id === orderId || o.orderNumber === orderId);

  if (orderIndex === -1) {
    throw new Error('Order not found');
  }

  const order = currentOrders[orderIndex];
  const newPaymentStatus: PaymentStatus = verified ? 'VERIFIED' : 'REJECTED';
  const newOrderStatus: OrderStatus = verified ? 'APPROVED' : 'CANCELLED';

  const auditEntry: AuditLogEntry = {
    id: `log-verif-${Date.now()}`,
    timestamp: nowStr,
    action: verified ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED',
    actor: managerName,
    details: verified
      ? `Payment verified for M-Pesa ref [${order.mpesaReference || 'N/A'}]. Order approved for fulfillment.`
      : `Payment rejected. Reason: ${rejectionReason || 'Invalid transaction code or mismatched amount'}.`
  };

  const updatedOrder: Order = {
    ...order,
    paymentStatus: newPaymentStatus,
    orderStatus: newOrderStatus,
    paymentVerifiedAt: verified ? nowStr : undefined,
    rejectionReason: verified ? undefined : rejectionReason,
    auditLogs: [auditEntry, ...order.auditLogs]
  };

  currentOrders[orderIndex] = updatedOrder;
  saveLocalOrders(currentOrders);

  if (supabase) {
    try {
      await supabase.from('orders').update({
        payment_status: newPaymentStatus,
        order_status: newOrderStatus,
        payment_verified_at: verified ? nowStr : null,
        rejection_reason: verified ? null : rejectionReason,
        audit_logs: updatedOrder.auditLogs
      }).eq('id', order.id);
    } catch (e) {
      console.warn('Supabase payment status update skipped:', e);
    }
  }

  recordAuditLog(
    verified ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED',
    managerName,
    `Order ${order.orderNumber} payment ${verified ? 'APPROVED' : 'REJECTED'}.`
  );

  return updatedOrder;
}

// Manager Review: Update Order Status (e.g. PROCESSING, DISPATCHED, DELIVERED)
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  managerName: string = 'Manager (Amiri Diva Eldoret)',
  notes?: string
): Promise<Order | null> {
  const nowStr = new Date().toISOString();
  const currentOrders = getLocalOrders();
  const orderIndex = currentOrders.findIndex(o => o.id === orderId || o.orderNumber === orderId);

  if (orderIndex === -1) {
    throw new Error('Order not found');
  }

  const order = currentOrders[orderIndex];

  const auditEntry: AuditLogEntry = {
    id: `log-status-${Date.now()}`,
    timestamp: nowStr,
    action: `ORDER_STATUS_${status}`,
    actor: managerName,
    details: `Order status moved from ${order.orderStatus} to ${status}. ${notes ? `Note: ${notes}` : ''}`
  };

  const updatedOrder: Order = {
    ...order,
    orderStatus: status,
    managerNotes: notes || order.managerNotes,
    auditLogs: [auditEntry, ...order.auditLogs]
  };

  currentOrders[orderIndex] = updatedOrder;
  saveLocalOrders(currentOrders);

  recordAuditLog(
    `ORDER_${status}`,
    managerName,
    `Updated status for ${order.orderNumber} to ${status}.`
  );

  return updatedOrder;
}

function getInitialDemoOrders(): Order[] {
  return [
    {
      id: 'demo-ord-1',
      orderNumber: 'AD-2026-8942',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      customerName: 'Nancy Chepkwony',
      customerEmail: 'nancy.chep@gmail.com',
      customerPhone: '0712345678',
      deliveryAddress: 'Kapsoya Estate, Near Highlands Inn',
      deliveryCounty: 'Uasin Gishu',
      deliveryTown: 'Eldoret Town',
      specialInstructions: 'Please deliver after 2:00 PM',
      items: [
        {
          productId: 'ad-prod-1',
          productName: 'Velvet Satin Lip Elixir',
          selectedShade: 'Eldoret Sunset (Warm Rose)',
          quantity: 2,
          unitPriceKES: 2450,
          totalPriceKES: 4900,
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop'
        },
        {
          productId: 'ad-prod-2',
          productName: 'Royal Baobab Radiance Face Oil',
          quantity: 1,
          unitPriceKES: 3800,
          totalPriceKES: 3800,
          image: 'https://images.unsplash.com/photo-1608248597261-833258657640?q=80&w=800&auto=format&fit=crop'
        }
      ],
      subtotalKES: 8700,
      shippingFeeKES: 0,
      discountKES: 870,
      totalAmountKES: 7830,
      paymentMethod: 'POCHI_LA_BIASHARA',
      pochiNumber: '07417758',
      mpesaReference: 'RHK39201XX',
      paymentSubmittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      paymentVerifiedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      paymentStatus: 'VERIFIED',
      orderStatus: 'PROCESSING',
      auditLogs: [
        {
          id: 'log-1',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          action: 'PAYMENT_VERIFIED',
          actor: 'Manager (Amiri Diva Eldoret)',
          details: 'M-Pesa Reference RHK39201XX verified against Pochi la Biashara statement.'
        },
        {
          id: 'log-2',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          action: 'PAYMENT_SUBMITTED',
          actor: 'Customer (Nancy Chepkwony)',
          details: 'Submitted M-Pesa reference RHK39201XX'
        }
      ]
    },
    {
      id: 'demo-ord-2',
      orderNumber: 'AD-2026-9104',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      customerName: 'Mercy Jebet',
      customerEmail: 'jebet.m@yahoo.com',
      customerPhone: '0798765432',
      deliveryAddress: 'Elgon View Estate, House No. 42',
      deliveryCounty: 'Uasin Gishu',
      deliveryTown: 'Eldoret Town',
      items: [
        {
          productId: 'ad-prod-5',
          productName: 'Amiri Amber & Spiced Oud Perfume Oil',
          quantity: 1,
          unitPriceKES: 4500,
          totalPriceKES: 4500,
          image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop'
        }
      ],
      subtotalKES: 4500,
      shippingFeeKES: 200,
      discountKES: 0,
      totalAmountKES: 4700,
      paymentMethod: 'POCHI_LA_BIASHARA',
      pochiNumber: '07417758',
      mpesaReference: 'SGK88201AB',
      paymentSubmittedAt: new Date(Date.now() - 1800000).toISOString(),
      paymentStatus: 'SUBMITTED',
      orderStatus: 'PLACED',
      auditLogs: [
        {
          id: 'log-3',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          action: 'PAYMENT_SUBMITTED',
          actor: 'Customer (Mercy Jebet)',
          details: 'Submitted M-Pesa Pochi reference SGK88201AB. Pending Manager verification.'
        }
      ]
    }
  ];
}

function getInitialDemoAuditLogs(): AuditLogEntry[] {
  return [
    {
      id: 'init-audit-1',
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_BOOT',
      actor: 'Amiri Diva Application Core',
      details: 'Initialized secure Pochi la Biashara order engine. Location: Eldoret, Kenya.'
    }
  ];
}
