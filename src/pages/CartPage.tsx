import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  MapPin,
  Smartphone,
  ChevronLeft
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalKES,
    activePromo,
    applyPromoCode,
    navigateTo
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedTown, setSelectedTown] = useState('Eldoret Town');

  const shippingRates: Record<string, number> = {
    'Eldoret Town': cartSubtotalKES >= 3000 ? 0 : 200,
    'Nairobi': 350,
    'Kisumu': 300,
    'Nakuru': 300,
    'Mombasa': 450,
    'Other Kenya Location': 400
  };

  const estimatedShippingFeeKES = shippingRates[selectedTown] || 300;
  const discountAmountKES = activePromo
    ? Math.round((cartSubtotalKES * activePromo.percent) / 100)
    : 0;
  const totalAmountKES = Math.max(0, cartSubtotalKES + estimatedShippingFeeKES - discountAmountKES);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    setPromoMsg(applyPromoCode(promoInput));
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F0EB] text-[#C5A059]">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="font-serif-display text-3xl font-semibold text-[#1A1412] uppercase">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Explore the Amiri Diva collection of velvet lip elixirs, golden face oils, and luxury perfumes crafted in Kenya.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-[#1A1412] text-[#FAF8F5] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors inline-flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-[#E8D8CE] pb-4 flex items-center justify-between">
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1A1412] uppercase">
          Your Shopping Bag
        </h1>
        <button
          onClick={() => navigateTo('shop')}
          className="text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:underline flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Shop</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Item List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#E8D8CE]/60 divide-y divide-[#E8D8CE]/40">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-20 object-cover bg-[#F5F0EB] shrink-0"
                  />
                  <div>
                    <h3 className="font-serif-display text-lg font-bold text-[#1A1412]">
                      {item.product.name}
                    </h3>
                    {item.selectedShade && (
                      <p className="text-xs text-[#C5A059] font-medium">
                        Shade: {item.selectedShade}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      KES {item.product.priceKES.toLocaleString()} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5F0EB]">
                  {/* Quantity Controller */}
                  <div className="flex items-center border border-[#E8D8CE] bg-[#FAF8F5]">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-xs hover:bg-[#E8D8CE]"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-mono text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-xs hover:bg-[#E8D8CE]"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-mono text-base font-bold text-[#1A1412]">
                    KES {(item.product.priceKES * item.quantity).toLocaleString()}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Location Estimator */}
          <div className="p-6 bg-[#F5F0EB] border border-[#E8D8CE] space-y-3">
            <h3 className="font-serif-display text-sm font-bold uppercase text-[#1A1412] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C5A059]" />
              Estimate Delivery Fee in Kenya
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedTown}
                onChange={(e) => setSelectedTown(e.target.value)}
                className="bg-white border border-[#E8D8CE] px-3 py-2 text-xs text-[#1A1412] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="Eldoret Town">Eldoret Town (Same-Day / Store Pickup)</option>
                <option value="Nairobi">Nairobi Metropolitan</option>
                <option value="Kisumu">Kisumu City</option>
                <option value="Nakuru">Nakuru City</option>
                <option value="Mombasa">Mombasa Coast</option>
                <option value="Other Kenya Location">Other Kenya Counties</option>
              </select>
              <span className="text-xs font-mono font-bold text-[#1A1412] flex items-center">
                Estimated Shipping: {estimatedShippingFeeKES === 0 ? <strong className="text-emerald-700">FREE</strong> : `KES ${estimatedShippingFeeKES}`}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary & Checkout Sidebar */}
        <div className="bg-white p-6 border border-[#E8D8CE] space-y-6 shadow-sm">
          <h2 className="font-serif-display text-xl font-bold uppercase text-[#1A1412] border-b border-[#E8D8CE] pb-3">
            Order Summary
          </h2>

          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-gray-500">Discount Code</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full bg-[#FAF8F5] pl-9 pr-3 py-2 text-xs border border-[#E8D8CE] uppercase focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1A1412] text-[#FAF8F5] px-4 py-2 text-xs font-bold uppercase hover:bg-[#C5A059] hover:text-[#1A1412]"
              >
                Apply
              </button>
            </div>
            {promoMsg && (
              <p className={`text-[11px] font-medium ${promoMsg.success ? 'text-emerald-700' : 'text-red-600'}`}>
                {promoMsg.message}
              </p>
            )}
          </form>

          <div className="space-y-3 pt-3 border-t border-[#F5F0EB] text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-mono font-semibold text-[#1A1412]">
                KES {cartSubtotalKES.toLocaleString()}
              </span>
            </div>

            {activePromo && (
              <div className="flex justify-between text-emerald-800 bg-emerald-50 p-2 border border-emerald-200">
                <span>Promo ({activePromo.code})</span>
                <span className="font-mono font-bold">- KES {discountAmountKES.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Estimated Shipping ({selectedTown})</span>
              <span className="font-mono font-semibold text-[#1A1412]">
                {estimatedShippingFeeKES === 0 ? 'FREE' : `KES ${estimatedShippingFeeKES}`}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#1A1412] pt-3 border-t border-[#E8D8CE]">
              <span>Total Payable</span>
              <span className="font-mono text-xl text-[#1A1412]">
                KES {totalAmountKES.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Notice Box */}
          <div className="p-4 bg-[#1A1412] text-[#FAF8F5] border border-[#C5A059]/40 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059]">
              <Smartphone className="h-4 w-4" />
              <span>Manual Payment: Pochi la Biashara</span>
            </div>
            <p className="text-[11px] text-[#E8D8CE]/80 font-light">
              Pay via Lipa na M-Pesa &rarr; Pochi la Biashara &rarr; <strong className="text-[#C5A059] font-mono">07417758</strong>. Submit your M-Pesa code at checkout to lock order stock.
            </p>
          </div>

          <button
            onClick={() => navigateTo('checkout')}
            className="w-full bg-[#1A1412] text-[#FAF8F5] py-4 px-6 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors flex items-center justify-center gap-2 shadow-xl"
            id="cart-checkout-btn"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>Store Manager Order & Stock Guarantee</span>
          </div>

        </div>

      </div>

    </div>
  );
};
