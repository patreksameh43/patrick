import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { Order, OrderStatus } from '../types/index.js';
import { Search, Package, CheckCircle2, Clock, Truck, Home, AlertCircle } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { language, t, formatPrice } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsLoading(true);
    setLookupError('');
    setTrackedOrder(null);

    const term = searchInput.trim();

    try {
      // If it looks like a phone number (all digits)
      if (/^\d+$/.test(term)) {
        const res = await fetch(`/api/orders/lookup/by-phone?phone=${encodeURIComponent(term)}`);
        const data = await res.json();
        if (data.success && data.orders?.length > 0) {
          setTrackedOrder(data.orders[0]); // most recent order
        } else {
          setLookupError(
            language === 'ar'
              ? `لم يتم العثور على أي طلبات مسجلة برقم الهاتف ${term}.`
              : `No orders found registered with phone number ${term}.`
          );
        }
      } else {
        // Assume Order Reference ID
        const res = await fetch(`/api/orders/${encodeURIComponent(term)}`);
        const data = await res.json();
        if (data.success && data.order) {
          setTrackedOrder(data.order);
        } else {
          setLookupError(t.tracking.orderNotFound.replace('{id}', term));
        }
      }
    } catch {
      setLookupError('Failed to communicate with tracking service.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusSteps: { key: OrderStatus; icon: any }[] = [
    { key: 'pending', icon: Clock },
    { key: 'confirmed', icon: CheckCircle2 },
    { key: 'processing', icon: Package },
    { key: 'shipped', icon: Truck },
    { key: 'delivered', icon: Home },
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled' || status === 'returned') return -1;
    return statusSteps.findIndex(s => s.key === status);
  };

  const currentStepIndex = trackedOrder ? getStepIndex(trackedOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          {t.tracking.title}
        </h1>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          {t.tracking.subtitle}
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required
            value={searchInput}
            onChange={e => setSearchInput(e.target.value.toUpperCase())}
            placeholder={t.tracking.searchPlaceholder}
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-2.5 text-xs text-white placeholder-neutral-500 font-mono focus:outline-hidden focus:border-neutral-500 uppercase"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute top-3 right-3 rtl:right-auto rtl:left-3" />
        </div>
        <button
          type="submit"
          disabled={isLoading || !searchInput.trim()}
          className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {isLoading ? '...' : t.tracking.trackBtn}
        </button>
      </form>

      {/* Quick Demo Pre-fill Links */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-500 font-mono">
        <span>{language === 'ar' ? 'أمثلة لطلبات تجريبية سريعة:' : 'Quick Demo Test IDs:'}</span>
        {['NV-1001', 'NV-1002', 'NV-1003', 'NV-1004'].map(demoId => (
          <button
            key={demoId}
            onClick={() => {
              setSearchInput(demoId);
              fetch(`/api/orders/${demoId}`)
                .then(r => r.json())
                .then(d => {
                  if (d.order) {
                    setTrackedOrder(d.order);
                    setLookupError('');
                  }
                });
            }}
            className="underline hover:text-white transition-colors"
          >
            {demoId}
          </button>
        ))}
      </div>

      {lookupError && (
        <div className="max-w-md mx-auto p-4 bg-red-950/40 border border-red-800/80 rounded flex items-center gap-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{lookupError}</span>
        </div>
      )}

      {/* Tracked Order Details */}
      {trackedOrder && (
        <div className="bg-neutral-950 border border-neutral-850 rounded-lg p-6 sm:p-8 space-y-8 shadow-xl">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
            <div>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block">
                {t.orderSuccess.referenceLabel}
              </span>
              <h2 className="text-2xl font-black font-mono text-white mt-1">
                {trackedOrder.id}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {language === 'ar' ? 'تاريخ الطلب:' : 'Placed on:'}{' '}
                {new Date(trackedOrder.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="text-left sm:text-right rtl:sm:text-left">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block">
                {t.orderSuccess.orderStatus}
              </span>
              <span className="inline-block mt-1 px-3 py-1 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-800">
                {t.tracking.statuses[trackedOrder.status] || trackedOrder.status}
              </span>
              {trackedOrder.carrier && (
                <p className="text-xs text-neutral-400 mt-1 font-mono">
                  {trackedOrder.carrier} · {trackedOrder.trackingNumber || 'Pending AWB'}
                </p>
              )}
            </div>
          </div>

          {/* Timeline Visualizer */}
          {trackedOrder.status !== 'cancelled' && trackedOrder.status !== 'returned' ? (
            <div className="py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-8">
                {t.tracking.timeline}
              </h3>
              <div className="relative flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-900 z-0" />
                <div
                  className="absolute left-0 rtl:left-auto rtl:right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white transition-all duration-500 z-0"
                  style={{
                    width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%`,
                  }}
                />

                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-white text-black ring-4 ring-neutral-800'
                            : isCompleted
                            ? 'bg-neutral-800 text-white'
                            : 'bg-neutral-900 text-neutral-600 border border-neutral-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-2.5 text-center max-w-20 ${
                          isCurrent ? 'text-white' : isCompleted ? 'text-neutral-300' : 'text-neutral-600'
                        }`}
                      >
                        {t.tracking.statuses[step.key]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status explanation */}
              <div className="mt-8 p-4 bg-neutral-900/40 rounded border border-neutral-850 text-xs text-neutral-300">
                <p className="font-semibold text-white mb-0.5">
                  {t.tracking.statuses[trackedOrder.status]}
                </p>
                <p className="text-neutral-400">
                  {t.tracking.statusDescriptions[trackedOrder.status]}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-950/30 border border-red-900/60 rounded text-xs text-red-300">
              <span className="font-bold block uppercase mb-1">{t.tracking.statuses[trackedOrder.status]}</span>
              <span>{t.tracking.statusDescriptions[trackedOrder.status]}</span>
            </div>
          )}

          {/* Shipment History Log */}
          {trackedOrder.statusHistory?.length > 0 && (
            <div className="border-t border-neutral-900 pt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {language === 'ar' ? 'سجل العمليات والتحركات' : 'Activity Log'}
              </h4>
              <div className="space-y-2">
                {trackedOrder.statusHistory.map((hist, i) => (
                  <div key={i} className="flex items-start justify-between text-xs p-2.5 rounded bg-neutral-900/30">
                    <div>
                      <span className="font-semibold text-white uppercase mr-2 rtl:mr-0 rtl:ml-2">
                        {t.tracking.statuses[hist.status] || hist.status}
                      </span>
                      {hist.note && <span className="text-neutral-400">{hist.note}</span>}
                    </div>
                    <span className="font-mono text-neutral-500 text-[11px] shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                      {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Items Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-900 text-xs">
            <div>
              <span className="font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
                {t.orderSuccess.deliveryAddress}
              </span>
              <p className="font-semibold text-white">{trackedOrder.customer.fullName}</p>
              <p className="text-neutral-400 font-mono mt-0.5">{trackedOrder.customer.phone}</p>
              <p className="text-neutral-400 mt-1">
                {trackedOrder.shippingAddress.streetAddress}, {trackedOrder.shippingAddress.city},{' '}
                {trackedOrder.shippingAddress.governorate}
              </p>
            </div>

            <div>
              <span className="font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
                {language === 'ar' ? 'ملخص الدفع والقطع' : 'Order & Payment Summary'}
              </span>
              <p className="text-neutral-300">
                {trackedOrder.items.length} {language === 'ar' ? 'قطع' : 'pieces'} · Total:{' '}
                <span className="font-bold font-mono text-white tabular-nums">
                  {formatPrice(trackedOrder.total)}
                </span>
              </p>
              <p className="text-neutral-400 mt-0.5 uppercase">
                {trackedOrder.paymentMethod === 'cod' ? t.checkout.paymentMethods.cod : t.checkout.paymentMethods.cardDemo}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
