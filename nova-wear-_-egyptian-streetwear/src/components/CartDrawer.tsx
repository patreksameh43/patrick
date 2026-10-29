import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { X, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, Check, AlertCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    formatPrice,
    language,
    t,
    setActivePage,
    freeShippingThreshold,
    showToast,
  } = useStore();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; amount: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    setIsValidatingPromo(true);
    setPromoError('');

    try {
      const res = await fetch(
        `/api/discounts/validate?code=${encodeURIComponent(promoCodeInput.trim())}&subtotal=${cartSubtotal}`
      );
      const data = await res.json();

      if (data.valid && data.discountAmount !== undefined) {
        setAppliedPromo({
          code: data.discount.code,
          amount: data.discountAmount,
        });
        showToast(
          language === 'ar' ? 'تم تطبيق كود الخصم بنجاح' : 'Promo code applied successfully!',
          'success'
        );
      } else {
        setPromoError(data.error || (language === 'ar' ? 'كود الخصم غير صحيح' : 'Invalid promo code'));
      }
    } catch {
      setPromoError(language === 'ar' ? 'حدث خطأ في التحقق من الكود' : 'Error checking promo code');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError('');
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const discountAmount = appliedPromo ? appliedPromo.amount : 0;
  const estimatedTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-neutral-950 border-l rtl:border-l-0 rtl:border-r border-neutral-800 shadow-2xl flex flex-col text-neutral-100">
          {/* Header */}
          <div className="p-5 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                {t.cart.title}
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                ({cartCount})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-900 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-neutral-900/60 border-b border-neutral-900 text-xs">
            <div className="flex justify-between items-center mb-1.5 font-medium">
              <span className="text-neutral-300">
                {remainingForFreeShipping > 0
                  ? t.cart.freeShippingProgress.replace('{amount}', formatPrice(remainingForFreeShipping))
                  : t.cart.freeShippingQualified}
              </span>
              <span className="font-mono text-neutral-400 tabular-nums">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  remainingForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-white'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-900">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <p className="text-neutral-400 text-sm mb-6">
                  {t.cart.empty}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('shop');
                  }}
                  className="px-6 py-2.5 bg-white text-black font-semibold text-xs tracking-wider uppercase rounded hover:bg-neutral-200 transition-colors"
                >
                  {t.cart.exploreBtn}
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Item Image */}
                  <div className="w-20 h-24 bg-neutral-900 rounded overflow-hidden shrink-0 border border-neutral-850">
                    <img
                      src={item.image}
                      alt={item.name[language]}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold text-white leading-tight">
                          {item.name[language]}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                          title={t.cart.remove}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
                        <span>{language === 'ar' ? 'المقاس:' : 'Size:'} {item.size}</span>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-neutral-700"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span>{item.colorName[language]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-800 rounded bg-neutral-900">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2 text-neutral-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium tabular-nums text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 px-2 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <span className="text-sm font-semibold font-mono tabular-nums text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-900 bg-neutral-950 space-y-4">
              {/* Promo Code Input */}
              {!appliedPromo ? (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
                      placeholder={t.cart.couponPlaceholder}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white placeholder-neutral-500 uppercase font-mono focus:outline-hidden focus:border-neutral-500"
                    />
                    <Tag className="w-3.5 h-3.5 text-neutral-500 absolute top-2.5 right-3 rtl:right-auto rtl:left-3" />
                  </div>
                  <button
                    type="submit"
                    disabled={isValidatingPromo || !promoCodeInput.trim()}
                    className="px-4 py-2 bg-neutral-800 text-white hover:bg-neutral-700 text-xs font-semibold rounded disabled:opacity-50 transition-colors"
                  >
                    {isValidatingPromo ? '...' : t.cart.applyCoupon}
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-neutral-900/80 border border-neutral-800 rounded text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                    <Check className="w-4 h-4" />
                    <span>{appliedPromo.code} (-{formatPrice(appliedPromo.amount)})</span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{promoError}</span>
                </p>
              )}

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-400 border-t border-neutral-900 pt-3">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-mono tabular-nums text-white">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400">
                    <span>{t.cart.discount} ({appliedPromo.code})</span>
                    <span className="font-mono tabular-nums">
                      -{formatPrice(appliedPromo.amount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t.cart.shipping}</span>
                  <span className="text-neutral-400 italic">
                    {remainingForFreeShipping === 0
                      ? (language === 'ar' ? 'مجاني' : 'FREE')
                      : t.cart.calculatedAtCheckout}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-900">
                  <span>{t.cart.total}</span>
                  <span className="font-mono tabular-nums">
                    {formatPrice(estimatedTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>{t.cart.checkoutBtn}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
