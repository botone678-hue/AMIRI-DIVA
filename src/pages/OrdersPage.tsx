import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus, PaymentStatus } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Smartphone,
  ShieldCheck,
  Package,
  MapPin,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders, routeSlug, submitMpesaCode, showToast } = useStore();

  const [lookupQuery, setLookupQuery] = useState(routeSlug || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    if (routeSlug) {
      return orders.find((o) => o.orderNumber === routeSlug || o.id === routeSlug) || orders[0] || null;
    }
    return orders[0] || null;
  });

  const [mpesaInput, setMpesaInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Search/Lookup Filter
  const searchedOrders = lookupQuery.trim() === ''
    ? orders
    : orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(lookupQuery.toLowerCase()) ||
          o.customerPhone.includes(lookupQuery) ||
          o.customerName.toLowerCase().includes(lookupQuery.toLowerCase())
      );

  const handleMpesaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !mpesaInput) return;
    setSubmitting(true);
    try {
      const updated = await submitMpesaCode(selectedOrder.id, mpesaInput);
      if (updated) setSelectedOrder(updated);
      setMpesaInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit M-Pesa code.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStepIndex = (paymentStatus: PaymentStatus, orderStatus: OrderStatus) => {
    if (orderStatus === 'DELIVERED') return 5;
    if (orderStatus === 'DISPATCHED') return 4;
    if (orderStatus === 'PROCESSING') return 3;
    if (paymentStatus === 'VERIFIED' || orderStatus === 'APPROVED') return 2;
    if (paymentStatus === 'SUBMITTED') return 1;
    return 0; // Order Placed
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="border-b border-[#E8D8CE] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Order Self-Service & Status
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1A1412] uppercase">
            Track Your Order
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Order # or Phone..."
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            className="w-full bg-white pl-9 pr-3 py-2 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left List of Orders */}
        <div className="space-y-4 no-print">
          <h2 className="font-serif-display text-lg font-bold uppercase text-[#1A1412]">
            Recent Orders ({searchedOrders.length})
          </h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {searchedOrders.length === 0 ? (
              <p className="text-xs text-gray-500 py-8 text-center italic bg-white p-4 border border-[#E8D8CE]">
                No orders found matching "{lookupQuery}".
              </p>
            ) : (
              searchedOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 bg-white border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'border-[#C5A059] ring-1 ring-[#C5A059] shadow-md'
                        : 'border-[#E8D8CE]/60 hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-[#1A1412]">{ord.orderNumber}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                        ord.paymentStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.paymentStatus === 'SUBMITTED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 font-light flex justify-between">
                      <span>{ord.customerName} ({ord.deliveryTown})</span>
                      <span className="font-mono font-bold text-[#1A1412]">KES {ord.totalAmountKES.toLocaleString()}</span>
                    </div>

                    <p className="text-[10px] text-gray-400 font-mono">
                      Placed: {new Date(ord.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        {selectedOrder ? (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Card Header */}
            <div className="bg-white p-6 sm:p-8 border border-[#E8D8CE] shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8D8CE] pb-4 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#C5A059] block">Order Tracking Record</span>
                  <h2 className="font-serif-display text-2xl font-bold uppercase text-[#1A1412]">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="no-print bg-[#FAF8F5] text-[#1A1412] border border-[#E8D8CE] px-3.5 py-1.5 text-xs font-bold uppercase hover:bg-[#E8D8CE] flex items-center gap-1.5"
                  >
                    <Printer className="h-4 w-4 text-[#C5A059]" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Step Timeline Indicator */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase text-[#1A1412] tracking-wider">
                  Live Order Lifecycle Tracker:
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-bold uppercase tracking-wider">
                  {[
                    { label: '1. Order Placed', desc: 'Stock Reserved' },
                    { label: '2. M-Pesa Code', desc: selectedOrder.mpesaReference ? `Code: ${selectedOrder.mpesaReference}` : 'Pending Code' },
                    { label: '3. Manager Review', desc: selectedOrder.paymentStatus === 'VERIFIED' ? 'Verified' : 'In Review' },
                    { label: '4. Processing', desc: 'Eldoret Store' },
                    { label: '5. Dispatched', desc: 'In Courier Transit' }
                  ].map((step, idx) => {
                    const currentStep = getStepIndex(selectedOrder.paymentStatus, selectedOrder.orderStatus);
                    const isActive = idx <= currentStep;
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 border transition-all ${
                          isActive
                            ? 'bg-[#1A1412] text-[#FAF8F5] border-[#C5A059]'
                            : 'bg-[#FAF8F5] text-gray-400 border-[#E8D8CE]'
                        }`}
                      >
                        <p className={isActive ? 'text-[#C5A059]' : ''}>{step.label}</p>
                        <p className="text-[9px] font-light opacity-80 normal-case">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Code Submission Warning / Notice */}
              {selectedOrder.paymentStatus === 'PENDING' && (
                <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <AlertTriangle className="h-4 w-4 text-amber-700" />
                    <span>M-Pesa Payment Code Required</span>
                  </div>
                  <p className="text-xs font-light">
                    Pay KES {selectedOrder.totalAmountKES.toLocaleString()} to Pochi la Biashara <strong>07417758</strong> and submit your M-Pesa reference below:
                  </p>
                  <form onSubmit={handleMpesaSubmit} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. RHK39201XX"
                      value={mpesaInput}
                      onChange={(e) => setMpesaInput(e.target.value.toUpperCase())}
                      className="bg-white px-3 py-2 text-xs border border-amber-400 font-mono uppercase flex-1"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#1A1412] text-[#FAF8F5] px-4 py-2 text-xs font-bold uppercase hover:bg-[#C5A059] hover:text-[#1A1412]"
                    >
                      {submitting ? 'Submitting...' : 'Submit Code'}
                    </button>
                  </form>
                </div>
              )}

              {/* Order Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-light">
                <div className="p-4 bg-[#FAF8F5] border border-[#E8D8CE] space-y-1">
                  <p className="font-bold uppercase text-[#1A1412]">Customer Details</p>
                  <p>{selectedOrder.customerName}</p>
                  <p>{selectedOrder.customerEmail}</p>
                  <p>Phone: <strong className="font-mono">{selectedOrder.customerPhone}</strong></p>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#E8D8CE] space-y-1">
                  <p className="font-bold uppercase text-[#1A1412]">Delivery Address</p>
                  <p>{selectedOrder.deliveryAddress}</p>
                  <p>{selectedOrder.deliveryTown}, {selectedOrder.deliveryCounty}</p>
                  {selectedOrder.specialInstructions && (
                    <p className="text-gray-500 italic">Notes: "{selectedOrder.specialInstructions}"</p>
                  )}
                </div>
              </div>

              {/* Item Table */}
              <div className="space-y-3 pt-2">
                <h3 className="font-serif-display text-base font-bold uppercase text-[#1A1412] border-b border-[#E8D8CE] pb-2">
                  Purchased Items
                </h3>

                <div className="divide-y divide-[#F5F0EB]">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="h-10 w-10 object-cover bg-[#F5F0EB]" />
                        <div>
                          <p className="font-bold text-[#1A1412]">{item.productName}</p>
                          {item.selectedShade && <p className="text-[10px] text-[#C5A059]">Shade: {item.selectedShade}</p>}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#1A1412]">
                        Qty {item.quantity} = KES {item.totalPriceKES.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8D8CE] pt-3 flex justify-between text-sm font-bold font-mono">
                  <span>Total Order Value:</span>
                  <span>KES {selectedOrder.totalAmountKES.toLocaleString()}</span>
                </div>
              </div>

              {/* Audit Log Timeline */}
              <div className="space-y-3 pt-4 border-t border-[#E8D8CE] no-print">
                <h3 className="text-xs font-bold uppercase text-[#1A1412] flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#C5A059]" />
                  Activity History & Verification Log
                </h3>
                <div className="space-y-2">
                  {selectedOrder.auditLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-[#FAF8F5] border border-[#E8D8CE]/60 text-xs">
                      <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                        <span>{log.actor}</span>
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="font-bold text-[#1A1412]">{log.action}</p>
                      <p className="text-gray-600 font-light">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="lg:col-span-2 bg-white p-12 text-center border border-[#E8D8CE]">
            <p className="text-gray-500 text-xs">Select an order from the list to view live tracking status.</p>
          </div>
        )}

      </div>

    </div>
  );
};
