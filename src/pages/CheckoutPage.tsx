import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import {
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotalKES,
    activePromo,
    createOrder,
    submitMpesaCode,
    navigateTo,
    showToast
  } = useStore();

  // Step 1: Customer Form Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCounty, setDeliveryCounty] = useState('Uasin Gishu (Eldoret)');
  const [deliveryTown, setDeliveryTown] = useState('Eldoret Town');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Step 2 & 3 State
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [mpesaCodeInput, setMpesaCodeInput] = useState('');
  const [submittingCode, setSubmittingCode] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const discountAmountKES = activePromo
    ? Math.round((cartSubtotalKES * activePromo.percent) / 100)
    : 0;

  const shippingFees: Record<string, number> = {
    'Uasin Gishu (Eldoret)': cartSubtotalKES >= 3000 ? 0 : 200,
    'Nairobi': 350,
    'Kisumu': 300,
    'Nakuru': 300,
    'Mombasa': 450,
    'Other County': 400
  };

  const currentShippingFeeKES = shippingFees[deliveryCounty] || 300;
  const totalAmountKES = Math.max(0, cartSubtotalKES + currentShippingFeeKES - discountAmountKES);

  // Handle Order Placement
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
      alert('Please fill in all required customer and delivery address fields.');
      return;
    }

    const order = await createOrder(
      {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: deliveryAddress,
        county: deliveryCounty,
        town: deliveryTown,
        instructions: specialInstructions
      },
      currentShippingFeeKES
    );

    setPlacedOrder(order);
    showToast(`Order ${order.orderNumber} placed! Stock reserved.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle M-Pesa Code Submission
  const handleMpesaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placedOrder || !mpesaCodeInput) return;

    if (mpesaCodeInput.trim().length < 6) {
      alert('Please enter a valid 10-character M-Pesa reference code (e.g. RHK39201XX).');
      return;
    }

    setSubmittingCode(true);
    try {
      const updated = await submitMpesaCode(placedOrder.id, mpesaCodeInput);
      if (updated) {
        setPlacedOrder(updated);
        setCodeSubmitted(true);
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting M-Pesa reference.');
    } finally {
      setSubmittingCode(false);
    }
  };

  const handleCopyPochiNumber = () => {
    navigator.clipboard.writeText('07417758');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // IF NO CART AND NO PLACED ORDER
  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-display text-2xl font-bold uppercase text-[#1A1412]">
          No Items in Cart for Checkout
        </h2>
        <p className="text-xs text-gray-500">
          Please add beauty products to your bag before checking out.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-[#1A1412] text-[#FAF8F5] px-6 py-3 text-xs font-bold uppercase hover:bg-[#C5A059] hover:text-[#1A1412]"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Step Header */}
      <div className="border-b border-[#E8D8CE] pb-4 text-center space-y-2 no-print">
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
          AMIRI DIVA • SECURE CHECKOUT
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1A1412] uppercase">
          {placedOrder ? 'Order Payment & Receipt' : 'Customer & Delivery Details'}
        </h1>
      </div>

      {/* FORM STEP 1: CUSTOMER DETAILS BEFORE ORDER CREATION */}
      {!placedOrder && (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Customer Delivery Fields */}
          <div className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 border border-[#E8D8CE]/60">
            <h2 className="font-serif-display text-xl font-bold uppercase text-[#1A1412] border-b border-[#E8D8CE] pb-3">
              1. Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chebet Chepkwony"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                  Phone Number (M-Pesa) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0741775878"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. chebet@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                  Delivery County <span className="text-red-500">*</span>
                </label>
                <select
                  value={deliveryCounty}
                  onChange={(e) => setDeliveryCounty(e.target.value)}
                  className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Uasin Gishu (Eldoret)">Uasin Gishu (Eldoret Town)</option>
                  <option value="Nairobi">Nairobi Metropolitan</option>
                  <option value="Kisumu">Kisumu County</option>
                  <option value="Nakuru">Nakuru County</option>
                  <option value="Mombasa">Mombasa County</option>
                  <option value="Other County">Other County in Kenya</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                  Town / City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eldoret Town / Kapsoya"
                  value={deliveryTown}
                  onChange={(e) => setDeliveryTown(e.target.value)}
                  className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                  Street Address / Estate / House No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elgon View, House 14 near Highlands"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                Delivery Notes or Special Request (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Call upon arrival or leave at Kapsoya reception..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="p-4 bg-[#F5F0EB] border border-[#E8D8CE] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A1412]">
                <Smartphone className="h-4 w-4 text-[#C5A059]" />
                <span>Next Step: Pochi la Biashara Payment</span>
              </div>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Submitting this step will place your order and reserve stock. You will then receive a server-generated Order Number and proceed to pay via Pochi la Biashara <strong>07417758</strong>.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1412] text-[#FAF8F5] py-4 px-6 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors flex items-center justify-center gap-2 shadow-xl"
            >
              <span>Confirm & Reserve Stock</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right Column Summary */}
          <div className="bg-white p-6 border border-[#E8D8CE] space-y-6 self-start shadow-sm">
            <h2 className="font-serif-display text-lg font-bold uppercase text-[#1A1412] border-b border-[#E8D8CE] pb-3">
              Order Items ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img src={item.product.image} alt="" className="h-12 w-12 object-cover bg-[#F5F0EB]" />
                  <div className="flex-1">
                    <p className="font-bold text-[#1A1412] line-clamp-1">{item.product.name}</p>
                    {item.selectedShade && <p className="text-[10px] text-[#C5A059]">Shade: {item.selectedShade}</p>}
                    <p className="text-[10px] text-gray-500 font-mono">Qty: {item.quantity} × KES {item.product.priceKES.toLocaleString()}</p>
                  </div>
                  <span className="font-mono font-bold text-[#1A1412]">
                    KES {(item.product.priceKES * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-[#E8D8CE] text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-mono text-[#1A1412]">KES {cartSubtotalKES.toLocaleString()}</span>
              </div>
              {activePromo && (
                <div className="flex justify-between text-emerald-800 bg-emerald-50 p-1.5 border border-emerald-200">
                  <span>Promo ({activePromo.code})</span>
                  <span className="font-mono font-bold">- KES {discountAmountKES.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping ({deliveryCounty})</span>
                <span className="font-mono text-[#1A1412]">{currentShippingFeeKES === 0 ? 'FREE' : `KES ${currentShippingFeeKES}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1A1412] pt-2 border-t border-[#E8D8CE]">
                <span>Total Amount</span>
                <span className="font-mono text-xl text-[#1A1412]">KES {totalAmountKES.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="h-4 w-4 text-[#C5A059]" />
              <span>Manager Verified Order System</span>
            </div>
          </div>

        </form>
      )}

      {/* STEP 2 & 3: PLACED ORDER - POCHI LA BIASHARA PAYMENT & RECEIPT */}
      {placedOrder && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Order Banner */}
          <div className="bg-[#1A1412] text-[#FAF8F5] p-6 sm:p-8 border border-[#C5A059]/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5A059]/30 pb-4">
              <div>
                <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Order Placed • Stock Reserved</span>
                </div>
                <h2 className="font-serif-display text-2xl sm:text-3xl font-bold uppercase">
                  Order #{placedOrder.orderNumber}
                </h2>
              </div>
              
              <div className="text-right sm:text-right">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Status:</span>
                <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  placedOrder.paymentStatus === 'VERIFIED'
                    ? 'bg-emerald-900 text-emerald-200'
                    : placedOrder.paymentStatus === 'SUBMITTED'
                    ? 'bg-amber-900 text-amber-200'
                    : 'bg-red-900 text-red-200'
                }`}>
                  {placedOrder.paymentStatus === 'VERIFIED'
                    ? 'Payment Verified & Approved'
                    : placedOrder.paymentStatus === 'SUBMITTED'
                    ? 'Payment Code Submitted (Under Review)'
                    : 'Payment Required'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-light text-[#E8D8CE]">
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">Customer:</span>
                <strong className="text-[#FAF8F5]">{placedOrder.customerName}</strong> ({placedOrder.customerPhone})
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">Delivery Destination:</span>
                <strong className="text-[#FAF8F5]">{placedOrder.deliveryTown}, {placedOrder.deliveryCounty}</strong>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">Total Payable:</span>
                <strong className="text-[#C5A059] font-mono text-base font-bold">KES {placedOrder.totalAmountKES.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* POCHI LA BIASHARA PAYMENT INSTRUCTION CARD */}
          <div className="bg-white p-6 sm:p-8 border border-[#E8D8CE] space-y-6 shadow-md">
            
            <div className="flex items-center justify-between border-b border-[#E8D8CE] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1A1412] text-[#C5A059]">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif-display text-xl font-bold uppercase text-[#1A1412]">
                    Pochi la Biashara Payment Guide
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    Complete your M-Pesa transfer using the manual Pochi option below.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePrintReceipt}
                className="no-print bg-[#FAF8F5] text-[#1A1412] border border-[#E8D8CE] px-4 py-2 text-xs font-bold uppercase hover:bg-[#E8D8CE] transition-colors flex items-center gap-2"
              >
                <Printer className="h-4 w-4 text-[#C5A059]" />
                <span>Print Receipt</span>
              </button>
            </div>

            {/* Pochi Number Highlights */}
            <div className="bg-[#FAF8F5] p-6 border-2 border-[#C5A059] text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1A1412]">
                Pochi la Biashara Phone Number
              </p>
              
              <div className="inline-flex items-center gap-3 bg-white px-6 py-3 border border-[#E8D8CE] shadow-inner">
                <span className="font-mono text-3xl font-extrabold text-[#1A1412] tracking-widest">
                  07417758
                </span>
                <button
                  onClick={handleCopyPochiNumber}
                  className="p-2 bg-[#1A1412] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors"
                  title="Copy Pochi Number"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              {copySuccess && (
                <p className="text-xs text-emerald-700 font-bold">
                  Copied 07417758 to clipboard!
                </p>
              )}

              <p className="text-xs text-gray-600 font-light">
                Account Name: <strong className="text-[#1A1412]">AMIRI DIVA COSMETICS (Eldoret Store)</strong>
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h4 className="font-serif-display text-sm font-bold uppercase text-[#1A1412]">
                  How to Pay on Your Phone:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-gray-700 font-light leading-relaxed">
                  <li>Open M-Pesa menu or SIM Toolkit on your phone.</li>
                  <li>Select <strong>Lipa na M-Pesa</strong>.</li>
                  <li>Select <strong>Pochi la Biashara</strong>.</li>
                  <li>Enter Phone Number: <strong className="text-[#1A1412] font-mono">07417758</strong>.</li>
                  <li>Enter Amount: <strong className="text-[#C5A059] font-mono font-bold">KES {placedOrder.totalAmountKES.toLocaleString()}</strong>.</li>
                  <li>Enter your M-Pesa PIN and confirm transaction.</li>
                </ol>
              </div>

              {/* M-Pesa Code Submission Form */}
              <div className="bg-[#F5F0EB] p-5 border border-[#E8D8CE] space-y-4">
                <h4 className="font-serif-display text-sm font-bold uppercase text-[#1A1412] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C5A059]" />
                  Submit M-Pesa Reference Code
                </h4>

                {placedOrder.mpesaReference ? (
                  <div className="bg-emerald-50 border border-emerald-300 p-4 space-y-2 text-xs text-emerald-900">
                    <p className="font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      M-Pesa Reference Received: <span className="font-mono tracking-widest text-base uppercase">{placedOrder.mpesaReference}</span>
                    </p>
                    <p className="font-light text-emerald-800">
                      Your payment code is currently under review by our Eldoret Store Manager. Once verified, your order status will automatically update to <strong>APPROVED</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleMpesaSubmit} className="space-y-3">
                    <p className="text-xs text-gray-600 font-light">
                      Paste or enter the 10-character M-Pesa transaction code from your SMS receipt (e.g. <strong>RHK39201XX</strong>):
                    </p>
                    <div className="space-y-1">
                      <input
                        type="text"
                        required
                        maxLength={12}
                        placeholder="e.g. RHK39201XX"
                        value={mpesaCodeInput}
                        onChange={(e) => setMpesaCodeInput(e.target.value.toUpperCase())}
                        className="w-full bg-white p-3 text-sm font-mono tracking-widest text-[#1A1412] uppercase border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingCode}
                      className="w-full bg-[#1A1412] text-[#FAF8F5] py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors"
                    >
                      {submittingCode ? 'Submitting Code...' : 'Submit Payment Reference'}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* Printable Invoice & Order Item Details */}
          <div className="bg-white p-6 sm:p-8 border border-[#E8D8CE] space-y-6">
            <h3 className="font-serif-display text-xl font-bold uppercase text-[#1A1412] border-b border-[#E8D8CE] pb-3">
              Order Invoice Items
            </h3>

            <div className="divide-y divide-[#F5F0EB]">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="h-12 w-12 object-cover bg-[#F5F0EB]" />
                    <div>
                      <p className="font-bold text-[#1A1412]">{item.productName}</p>
                      {item.selectedShade && <p className="text-[10px] text-[#C5A059]">Shade: {item.selectedShade}</p>}
                      <p className="text-[10px] text-gray-500 font-mono">Qty: {item.quantity} × KES {item.unitPriceKES.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#1A1412]">
                    KES {item.totalPriceKES.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E8D8CE] pt-4 flex flex-col items-end text-xs space-y-1 font-mono">
              <p className="text-gray-600">Subtotal: KES {placedOrder.subtotalKES.toLocaleString()}</p>
              {placedOrder.discountKES > 0 && <p className="text-emerald-700">Discount: - KES {placedOrder.discountKES.toLocaleString()}</p>}
              <p className="text-gray-600">Delivery Fee: KES {placedOrder.shippingFeeKES.toLocaleString()}</p>
              <p className="text-base font-bold text-[#1A1412] pt-2 border-t border-[#E8D8CE]">Total Paid/Payable: KES {placedOrder.totalAmountKES.toLocaleString()}</p>
            </div>
          </div>

          {/* Audit Log Timeline */}
          <div className="bg-[#FAF8F5] p-6 border border-[#E8D8CE] space-y-4 no-print">
            <h3 className="font-serif-display text-base font-bold uppercase text-[#1A1412] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#C5A059]" />
              Order Security & Audit History
            </h3>

            <div className="space-y-3">
              {placedOrder.auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-white border border-[#E8D8CE]/50 text-xs space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>{log.actor}</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="font-semibold text-[#1A1412]">{log.action}</p>
                  <p className="text-gray-600 font-light">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4 no-print space-x-4">
            <button
              onClick={() => navigateTo('orders', placedOrder.orderNumber)}
              className="bg-[#1A1412] text-[#FAF8F5] px-6 py-3 text-xs font-bold uppercase hover:bg-[#C5A059] hover:text-[#1A1412]"
            >
              Track Order Live
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="border border-[#1A1412] text-[#1A1412] px-6 py-3 text-xs font-bold uppercase hover:bg-[#F5F0EB]"
            >
              Continue Shopping
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
