import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Check
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalKES,
    activePromo,
    applyPromoCode,
    navigateTo
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 3000;
  const progressPercent = Math.min(100, Math.round((cartSubtotalKES / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotalKES);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg(res);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const handleViewCartPage = () => {
    setIsCartOpen(false);
    navigateTo('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl border-l border-[#E8D8CE]/60 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8D8CE] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#C5A059]" />
              <h2 className="font-serif-display text-xl font-bold tracking-wider text-[#1A1412] uppercase">
                Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-500 hover:text-[#1A1412] transition-colors"
              aria-label="Close bag"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-[#F5F0EB] p-4 border-b border-[#E8D8CE]">
            <div className="flex justify-between text-xs font-medium text-[#1A1412] mb-1.5">
              {amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#C5A059] font-bold">KES {amountNeededForFreeShipping.toLocaleString()}</strong> for Free Eldoret Town Delivery
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  You unlocked Free Eldoret Delivery!
                </span>
              )}
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#E8D8CE] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C5A059] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items Scrollable List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F0EB] text-[#C5A059]">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="font-serif-display text-lg text-[#1A1412] font-semibold">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our curated Eldoret collection of velvet lip elixirs, radiance face oils, and luxury fragrances.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="mt-4 bg-[#1A1412] text-[#FAF8F5] px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white border border-[#E8D8CE]/40 shadow-sm transition-all"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-20 object-cover bg-[#F5F0EB] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif-display text-base font-semibold text-[#1A1412] leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {item.selectedShade && (
                        <p className="text-[11px] text-[#C5A059] font-medium mt-0.5">
                          Shade: {item.selectedShade}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-500 font-light mt-0.5">
                        KES {item.product.priceKES.toLocaleString()} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-[#E8D8CE] bg-[#FAF8F5]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-[#1A1412] hover:bg-[#E8D8CE]"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold font-mono text-[#1A1412]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-[#1A1412] hover:bg-[#E8D8CE]"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-sm font-bold text-[#1A1412]">
                        KES {(item.product.priceKES * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8D8CE] space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. WELCOME10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full bg-[#FAF8F5] pl-9 pr-3 py-2 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059] uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1A1412] text-[#FAF8F5] px-4 py-2 text-xs font-semibold uppercase hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoMsg && (
                <p className={`text-[11px] font-medium ${promoMsg.success ? 'text-emerald-700' : 'text-red-600'}`}>
                  {promoMsg.message}
                </p>
              )}

              {activePromo && (
                <div className="flex justify-between text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 border border-emerald-200">
                  <span>Discount ({activePromo.code} - {activePromo.percent}%)</span>
                  <span className="font-mono font-bold">- KES {Math.round((cartSubtotalKES * activePromo.percent) / 100).toLocaleString()}</span>
                </div>
              )}

              {/* Subtotal */}
              <div className="space-y-1.5 pt-2 border-t border-[#F5F0EB]">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-[#1A1412]">
                    KES {cartSubtotalKES.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Manual Payment Method</span>
                  <span className="text-[#C5A059] font-medium">Pochi la Biashara (07417758)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1A1412] pt-2 border-t border-[#E8D8CE]">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg text-[#1A1412]">
                    KES {
                      (
                        cartSubtotalKES -
                        (activePromo ? Math.round((cartSubtotalKES * activePromo.percent) / 100) : 0)
                      ).toLocaleString()
                    }
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleViewCartPage}
                  className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider border border-[#1A1412] text-[#1A1412] hover:bg-[#F5F0EB] transition-colors"
                >
                  View Full Cart
                </button>
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider bg-[#1A1412] text-[#FAF8F5] hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
                <span>Pochi la Biashara Secured Order Reservation</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
