import React from 'react';
import { useStore } from '../context/StoreContext.js';
import { CheckCircle, PackageCheck, Printer, ArrowRight, ArrowLeft } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { lastOrder, language, t, formatPrice, setActivePage } = useStore();

  if (!lastOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold uppercase text-white mb-4">No active order to display</h2>
        <button
          onClick={() => setActivePage('shop')}
          className="px-6 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded"
        >
          {t.cart.exploreBtn}
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Banner */}
      <div className="text-center space-y-3 pb-6 border-b border-neutral-900">
        <div className="inline-flex p-3 bg-emerald-950/60 text-emerald-400 rounded-full border border-emerald-800/80 mb-2">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          {t.orderSuccess.title}
        </h1>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          {t.orderSuccess.subtitle}
        </p>
      </div>

      {/* Reference Code Card */}
      <div className="p-6 bg-neutral-900/60 rounded-lg border border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left rtl:sm:text-right">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            {t.orderSuccess.referenceLabel}
          </span>
          <div className="text-2xl font-black font-mono text-white tracking-wider mt-1">
            {lastOrder.id}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            {t.orderSuccess.keepSafe}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('tracking')}
            className="px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <PackageCheck className="w-4 h-4" />
            <span>{t.orderSuccess.trackOrderBtn}</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-2.5 text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-800 rounded transition-colors"
            title={t.orderSuccess.printReceipt}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Order Summary Details */}
      <div className="p-6 bg-neutral-950 rounded-lg border border-neutral-900 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-neutral-900 pb-6">
          <div>
            <span className="text-neutral-500 uppercase tracking-wider font-semibold block mb-1">
              {t.orderSuccess.deliveryAddress}
            </span>
            <p className="font-semibold text-white">{lastOrder.customer.fullName}</p>
            <p className="text-neutral-400 font-mono mt-0.5">{lastOrder.customer.phone}</p>
            <p className="text-neutral-400 mt-1">
              {lastOrder.shippingAddress.streetAddress}, {lastOrder.shippingAddress.city},{' '}
              {lastOrder.shippingAddress.governorate}
            </p>
            {lastOrder.shippingAddress.deliveryNotes && (
              <p className="text-neutral-500 italic mt-1">
                Note: {lastOrder.shippingAddress.deliveryNotes}
              </p>
            )}
          </div>

          <div>
            <span className="text-neutral-500 uppercase tracking-wider font-semibold block mb-1">
              {t.orderSuccess.paymentMethod}
            </span>
            <p className="font-semibold text-white uppercase">
              {lastOrder.paymentMethod === 'cod' ? t.checkout.paymentMethods.cod : t.checkout.paymentMethods.cardDemo}
            </p>
            <span className="inline-block mt-2 text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
              {language === 'ar' ? 'حالة الدفع:' : 'Payment Status:'} {lastOrder.paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Itemized List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            {language === 'ar' ? 'القطع المطلوبة' : 'Ordered Pieces'}
          </h3>
          <div className="divide-y divide-neutral-900">
            {lastOrder.items.map((item, idx) => (
              <div key={idx} className="py-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="w-12 h-14 object-cover rounded bg-neutral-900 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{item.name[language]}</h4>
                    <span className="text-neutral-500 text-[11px]">
                      {item.size} · {item.color} · Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-mono tabular-nums text-white font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Recap */}
        <div className="border-t border-neutral-900 pt-4 space-y-2 text-xs text-neutral-400">
          <div className="flex justify-between">
            <span>{t.cart.subtotal}</span>
            <span className="font-mono tabular-nums text-white">{formatPrice(lastOrder.subtotal)}</span>
          </div>
          {lastOrder.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>{t.cart.discount} ({lastOrder.discountCodeApplied})</span>
              <span className="font-mono tabular-nums">-{formatPrice(lastOrder.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>{t.cart.shipping}</span>
            <span className="font-mono tabular-nums text-white">
              {lastOrder.shippingFee === 0 ? (language === 'ar' ? 'مجاني' : 'FREE') : formatPrice(lastOrder.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold text-white border-t border-neutral-900 pt-3">
            <span>{t.cart.total}</span>
            <span className="font-mono tabular-nums">{formatPrice(lastOrder.total)}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => setActivePage('shop')}
          className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
        >
          <span>{t.orderSuccess.continueShopping}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
