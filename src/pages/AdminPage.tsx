import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, PaymentStatus } from '../types';
import { CATEGORIES } from '../data/mockProducts';
import { getLocalAuditLogs } from '../services/supabase';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Package,
  Clock,
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Search,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    orders,
    products,
    managerVerifyPayment,
    managerUpdateStatus,
    managerSaveProduct,
    managerDeleteProduct,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'audit'>('orders');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED' | 'PROCESSING'>('SUBMITTED');
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Product Editing modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const auditLogs = getLocalAuditLogs();

  // Metrics
  const totalRevenueKES = orders
    .filter((o) => o.paymentStatus === 'VERIFIED')
    .reduce((sum, o) => sum + o.totalAmountKES, 0);

  const pendingVerificationCount = orders.filter((o) => o.paymentStatus === 'SUBMITTED').length;
  const lowStockCount = products.filter((p) => p.stockQuantity <= 5).length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    if (orderFilter === 'PROCESSING') return o.orderStatus === 'PROCESSING';
    return o.paymentStatus === orderFilter;
  });

  // Handle Payment Verification
  const handleApprovePayment = async (orderId: string) => {
    await managerVerifyPayment(orderId, true);
  };

  const handleRejectPayment = async () => {
    if (!rejectModalOrder) return;
    await managerVerifyPayment(rejectModalOrder.id, false, rejectReason || 'Mismatched transaction reference');
    setRejectModalOrder(null);
    setRejectReason('');
  };

  // Product Modal Submit
  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.priceKES) return;

    const fullProduct: Product = {
      id: editingProduct.id || `ad-prod-${Date.now()}`,
      slug: editingProduct.slug || editingProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
      name: editingProduct.name,
      category: (editingProduct.category as any) || 'skincare',
      subtitle: editingProduct.subtitle || 'Luxury Beauty Essential',
      priceKES: Number(editingProduct.priceKES),
      originalPriceKES: editingProduct.originalPriceKES ? Number(editingProduct.originalPriceKES) : undefined,
      rating: editingProduct.rating || 5.0,
      reviewCount: editingProduct.reviewCount || 1,
      image: editingProduct.image || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
      description: editingProduct.description || 'Amiri Diva luxury formulation.',
      ingredients: editingProduct.ingredients || 'Organic Botanicals, Vitamin E, Shea Butter.',
      howToUse: editingProduct.howToUse || 'Apply as desired.',
      stockQuantity: Number(editingProduct.stockQuantity || 10),
      isBestSeller: editingProduct.isBestSeller || false,
      isNewArrival: editingProduct.isNewArrival || false,
      isFeatured: editingProduct.isFeatured || false,
      volumeOrWeight: editingProduct.volumeOrWeight || '30ml'
    };

    managerSaveProduct(fullProduct);
    setShowProductModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-[#1A1412] text-[#FAF8F5] p-6 sm:p-8 border border-[#C5A059]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Store Portal • Eldoret, Kenya</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold uppercase">
            Manager Control Dashboard
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border ${
              activeTab === 'orders'
                ? 'bg-[#C5A059] text-[#1A1412] border-[#C5A059]'
                : 'bg-white/10 text-white border-white/20 hover:border-[#C5A059]'
            }`}
          >
            Orders Queue ({pendingVerificationCount})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border ${
              activeTab === 'inventory'
                ? 'bg-[#C5A059] text-[#1A1412] border-[#C5A059]'
                : 'bg-white/10 text-white border-white/20 hover:border-[#C5A059]'
            }`}
          >
            Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border ${
              activeTab === 'audit'
                ? 'bg-[#C5A059] text-[#1A1412] border-[#C5A059]'
                : 'bg-white/10 text-white border-white/20 hover:border-[#C5A059]'
            }`}
          >
            Security Audit
          </button>
        </div>
      </div>

      {/* Analytics KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-[#E8D8CE] shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-gray-400">Total Verified Revenue</span>
          <p className="font-mono text-2xl font-bold text-[#1A1412]">KES {totalRevenueKES.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Pochi la Biashara Verified</span>
        </div>

        <div className="bg-white p-5 border border-[#E8D8CE] shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-gray-400">Pending Code Approvals</span>
          <p className="font-mono text-2xl font-bold text-amber-600">{pendingVerificationCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">Requires Manager Review</span>
        </div>

        <div className="bg-white p-5 border border-[#E8D8CE] shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-gray-400">Total Store Orders</span>
          <p className="font-mono text-2xl font-bold text-[#1A1412]">{orders.length}</p>
          <span className="text-[10px] text-gray-500 font-medium">In Database & Local Sync</span>
        </div>

        <div className="bg-white p-5 border border-[#E8D8CE] shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-gray-400">Low Stock Alerts</span>
          <p className="font-mono text-2xl font-bold text-red-600">{lowStockCount}</p>
          <span className="text-[10px] text-red-600 font-medium">Under 5 Units in Eldoret</span>
        </div>
      </div>

      {/* TAB 1: ORDERS QUEUE */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 border border-[#E8D8CE]">
            <h2 className="font-serif-display text-lg font-bold uppercase text-[#1A1412]">
              Order Verification Queue
            </h2>

            <div className="flex gap-2 text-xs font-semibold uppercase">
              {(['SUBMITTED', 'VERIFIED', 'REJECTED', 'PROCESSING', 'ALL'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 border transition-all ${
                    orderFilter === st
                      ? 'bg-[#1A1412] text-[#FAF8F5] border-[#1A1412]'
                      : 'bg-[#FAF8F5] text-gray-600 border-[#E8D8CE] hover:border-[#C5A059]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <p className="text-xs text-gray-500 py-12 text-center bg-white border border-[#E8D8CE]">
                No orders matching status "{orderFilter}".
              </p>
            ) : (
              filteredOrders.map((ord) => (
                <div key={ord.id} className="bg-white p-6 border border-[#E8D8CE] shadow-sm space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8D8CE] pb-3 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#C5A059] block">
                        Placed: {new Date(ord.createdAt).toLocaleString()}
                      </span>
                      <h3 className="font-serif-display text-xl font-bold uppercase text-[#1A1412]">
                        Order #{ord.orderNumber}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        ord.paymentStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : ord.paymentStatus === 'SUBMITTED'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}>
                        Payment: {ord.paymentStatus}
                      </span>

                      <select
                        value={ord.orderStatus}
                        onChange={(e) => managerUpdateStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#FAF8F5] border border-[#E8D8CE] text-xs font-bold uppercase p-1.5 focus:outline-none"
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-light">
                    <div className="p-3 bg-[#FAF8F5] border border-[#E8D8CE]">
                      <p className="font-bold uppercase text-[#1A1412]">Customer</p>
                      <p className="font-semibold text-[#1A1412]">{ord.customerName}</p>
                      <p>{ord.customerEmail}</p>
                      <p className="font-mono">Phone: {ord.customerPhone}</p>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] border border-[#E8D8CE]">
                      <p className="font-bold uppercase text-[#1A1412]">Destination</p>
                      <p>{ord.deliveryAddress}</p>
                      <p>{ord.deliveryTown}, {ord.deliveryCounty}</p>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] border border-[#E8D8CE] space-y-1">
                      <p className="font-bold uppercase text-[#1A1412]">M-Pesa Reference</p>
                      <p className="font-mono text-base font-extrabold text-[#C5A059] uppercase">
                        {ord.mpesaReference || 'NO CODE SUBMITTED'}
                      </p>
                      <p className="text-[10px] text-gray-500">Pochi la Biashara 07417758</p>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-gray-500 uppercase text-[10px]">Items:</p>
                    <p className="text-gray-700">
                      {ord.items.map((i) => `${i.productName} (${i.selectedShade || 'Default'}) x${i.quantity}`).join(', ')}
                    </p>
                    <p className="font-mono font-bold text-sm text-[#1A1412] pt-1">
                      Total: KES {ord.totalAmountKES.toLocaleString()}
                    </p>
                  </div>

                  {/* Verification Actions */}
                  {ord.paymentStatus === 'SUBMITTED' && (
                    <div className="p-4 bg-amber-50 border border-amber-300 flex flex-wrap items-center justify-between gap-4">
                      <div className="text-xs text-amber-900 space-y-0.5">
                        <p className="font-bold">Pending Manager Review</p>
                        <p className="font-light">Verify code <strong>{ord.mpesaReference}</strong> against Pochi la Biashara 07417758 statement.</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setRejectModalOrder(ord)}
                          className="bg-red-700 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-800 transition-colors flex items-center gap-1.5"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject Payment</span>
                        </button>
                        <button
                          onClick={() => handleApprovePayment(ord.id)}
                          className="bg-emerald-700 text-white px-5 py-2 text-xs font-bold uppercase hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-md"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Approve & Verify Payment</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 border border-[#E8D8CE]">
            <h2 className="font-serif-display text-lg font-bold uppercase text-[#1A1412]">
              Eldoret Store Catalog ({products.length} Products)
            </h2>
            <button
              onClick={() => {
                setEditingProduct({});
                setShowProductModal(true);
              }}
              className="bg-[#1A1412] text-[#FAF8F5] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#1A1412] flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white border border-[#E8D8CE] divide-y divide-[#E8D8CE]">
            {products.map((prod) => (
              <div key={prod.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={prod.image} alt="" className="h-14 w-14 object-cover bg-[#F5F0EB]" />
                  <div>
                    <h3 className="font-serif-display text-base font-bold text-[#1A1412]">{prod.name}</h3>
                    <p className="text-xs text-gray-500 uppercase">{prod.category} • {prod.subtitle}</p>
                    <p className="text-xs font-mono font-bold text-[#1A1412] mt-0.5">
                      KES {prod.priceKES.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block uppercase">Eldoret Stock:</span>
                    <span className={`font-mono font-bold text-sm ${prod.stockQuantity <= 5 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {prod.stockQuantity} units
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setShowProductModal(true);
                      }}
                      className="p-2 bg-[#FAF8F5] text-[#1A1412] border border-[#E8D8CE] hover:border-[#C5A059]"
                      title="Edit Product"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${prod.name} from catalog?`)) {
                          managerDeleteProduct(prod.id);
                        }
                      }}
                      className="p-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="font-serif-display text-lg font-bold uppercase text-[#1A1412]">
            Security Audit Trail
          </h2>
          <div className="bg-white p-6 border border-[#E8D8CE] space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-[#FAF8F5] border border-[#E8D8CE]/60 text-xs space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>Actor: {log.actor}</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="font-bold text-[#1A1412]">{log.action}</p>
                <p className="text-gray-600 font-light">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectModalOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 max-w-md w-full border border-[#E8D8CE] space-y-4">
            <h3 className="font-serif-display text-lg font-bold text-red-900 uppercase">
              Reject Payment for #{rejectModalOrder.orderNumber}
            </h3>
            <p className="text-xs text-gray-600">
              Please enter the reason for rejection (e.g. invalid code, incorrect amount sent, or missing Pochi transaction):
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Transaction code not found on Pochi la Biashara 07417758 statement..."
              className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-red-600"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalOrder(null)}
                className="px-4 py-2 text-xs uppercase border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPayment}
                className="bg-red-700 text-white px-5 py-2 text-xs font-bold uppercase hover:bg-red-800"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 max-w-xl w-full border border-[#E8D8CE] space-y-4 my-8">
            <h3 className="font-serif-display text-xl font-bold uppercase text-[#1A1412] border-b border-[#E8D8CE] pb-2">
              {editingProduct.id ? 'Edit Cosmetics Product' : 'Add New Cosmetics Product'}
            </h3>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1 uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-[#FAF8F5] p-2.5 border border-[#E8D8CE]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 uppercase">Category</label>
                  <select
                    value={editingProduct.category || 'skincare'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-[#FAF8F5] p-2.5 border border-[#E8D8CE]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 uppercase">Subtitle / Short Description</label>
                <input
                  type="text"
                  value={editingProduct.subtitle || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  className="w-full bg-[#FAF8F5] p-2.5 border border-[#E8D8CE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1 uppercase">Price (KES Integer)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.priceKES || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceKES: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F5] p-2.5 border border-[#E8D8CE]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 uppercase">Stock Quantity in Eldoret</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stockQuantity ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F5] p-2.5 border border-[#E8D8CE]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 uppercase">Image URL</label>
                <input
                  type="url"
                  required
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full bg-[#FAF8F5] p-2.5 border border-[#E8D8CE]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 uppercase">Full Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#FAF8F5] p-2.5 border border-[#E8D8CE]"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isBestSeller)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isNewArrival)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8D8CE]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1A1412] text-[#FAF8F5] px-6 py-2 font-bold uppercase hover:bg-[#C5A059] hover:text-[#1A1412]"
                >
                  Save Product
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
