import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext.js';
import { useAuth } from '../context/AuthContext.js';
import {
  ShieldCheck,
  Truck,
  Banknote,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { GovernorateRate } from '../types/index.js';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    clearCart,
    formatPrice,
    language,
    t,
    setActivePage,
    setLastOrder,
    freeShippingThreshold,
    showToast,
  } = useStore();

  const { customerUser, loginCustomer } = useAuth();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      setActivePage('shop');
    }
  }, [cart, setActivePage]);

  // Form State
  const [fullName, setFullName] = useState(customerUser?.fullName || '');
  const [phone, setPhone] = useState(customerUser?.phone || '');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [governorate, setGovernorate] = useState('Cairo');
  const [cityDistrict, setCityDistrict] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [buildingFloor, setBuildingFloor] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card_demo'>('cod');
  const [saveAsAccount, setSaveAsAccount] = useState(false);

  // Discount code state
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Shipping Rates
  const [shippingRates, setShippingRates] = useState<GovernorateRate[]>([]);
  const [shippingFee, setShippingFee] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // Fetch governorates rates
  useEffect(() => {
    fetch('/api/shipping-rates')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.rates)) {
          setShippingRates(data.rates);
        }
      })
      .catch(() => {});
  }, []);

  // Update shipping fee when governorate or subtotal changes
  useEffect(() => {
    if (cartSubtotal >= freeShippingThreshold) {
      setShippingFee(0);
      return;
    }

    if (shippingRates.length > 0) {
      let matchedFee = 60;
      for (const rateGroup of shippingRates) {
        if (rateGroup.governorates.some(g => g.toLowerCase() === governorate.toLowerCase())) {
          matchedFee = rateGroup.cost;
          break;
        }
      }
      setShippingFee(matchedFee);
    } else {
      // Default fallback
      if (governorate === 'Cairo' || governorate === 'Giza') setShippingFee(50);
      else if (governorate === 'Alexandria') setShippingFee(65);
      else setShippingFee(75);
    }
  }, [governorate, cartSubtotal, shippingRates, freeShippingThreshold]);

  const governoratesList = [
    { id: 'Cairo', name: { en: 'Cairo (Greater Cairo)', ar: 'القاهرة (القاهرة الكبرى)' } },
    { id: 'Giza', name: { en: 'Giza / 6th October / Sheikh Zayed', ar: 'الجيزة / ٦ أكتوبر / الشيخ زايد' } },
    { id: 'Alexandria', name: { en: 'Alexandria', ar: 'الإسكندرية' } },
    { id: 'Qalyubia', name: { en: 'Qalyubia', ar: 'القليوبية' } },
    { id: 'Sharqia', name: { en: 'Sharqia (Zagazig, 10th of Ramadan)', ar: 'الشرقية (الزقازيق، العاشر من رمضان)' } },
    { id: 'Dakahlia', name: { en: 'Dakahlia (Mansoura)', ar: 'الدقهلية (المنصورة)' } },
    { id: 'Gharbia', name: { en: 'Gharbia (Tanta, Mahalla)', ar: 'الغربية (طنطا، المحلة الكبرى)' } },
    { id: 'Monufia', name: { en: 'Monufia', ar: 'المنوفية' } },
    { id: 'Beheira', name: { en: 'Beheira (Damanhour)', ar: 'البحيرة (دمنهور)' } },
    { id: 'Kafr El Sheikh', name: { en: 'Kafr El Sheikh', ar: 'كفر الشيخ' } },
    { id: 'Damietta', name: { en: 'Damietta', ar: 'دمياط' } },
    { id: 'Port Said', name: { en: 'Port Said', ar: 'بورسعيد' } },
    { id: 'Ismailia', name: { en: 'Ismailia', ar: 'الإسماعيلية' } },
    { id: 'Suez', name: { en: 'Suez', ar: 'السويس' } },
    { id: 'Fayoum', name: { en: 'Fayoum', ar: 'الفيوم' } },
    { id: 'Beni Suef', name: { en: 'Beni Suef', ar: 'بني سويف' } },
    { id: 'Minya', name: { en: 'Minya', ar: 'المنيا' } },
    { id: 'Asyut', name: { en: 'Asyut', ar: 'أسيوط' } },
    { id: 'Sohag', name: { en: 'Sohag', ar: 'سوهاج' } },
    { id: 'Qena', name: { en: 'Qena', ar: 'قنا' } },
    { id: 'Luxor', name: { en: 'Luxor', ar: 'الأقصر' } },
    { id: 'Aswan', name: { en: 'Aswan', ar: 'أسوان' } },
    { id: 'Red Sea', name: { en: 'Red Sea (Hurghada, El Gouna)', ar: 'البحر الأحمر (الغردقة، الجونة)' } },
    { id: 'South Sinai', name: { en: 'South Sinai (Sharm El Sheikh, Dahab)', ar: 'جنوب سيناء (شرم الشيخ، دهب)' } },
  ];

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    try {
      const res = await fetch(`/api/discounts/validate?code=${encodeURIComponent(promoCode.trim())}&subtotal=${cartSubtotal}`);
      const data = await res.json();
      if (data.valid && data.discountAmount !== undefined) {
        setAppliedDiscount({ code: data.discount.code, amount: data.discountAmount });
        setPromoMessage({ text: t.cart.couponApplied, isError: false });
      } else {
        setPromoMessage({ text: data.error || t.cart.invalidCoupon, isError: true });
      }
    } catch {
      setPromoMessage({ text: 'Error verifying discount', isError: true });
    }
  };

  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const orderTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');

    // Egyptian phone validation: standard Egyptian numbers start with 01 and have 11 digits
    const cleanedPhone = phone.replace(/[\s-+]/g, '');
    if (!/^01[0125][0-9]{8}$/.test(cleanedPhone) && !/^\+?201[0125][0-9]{8}$/.test(phone.trim())) {
      setSubmissionError(
        language === 'ar'
          ? 'يرجى إدخال رقم موبايل مصري صحيح مكون من ١١ رقماً يبدأ بـ 01 (مثال: 01012345678)'
          : 'Please enter a valid 11-digit Egyptian mobile number starting with 01 (e.g. 01012345678)'
      );
      return;
    }

    if (!fullName.trim() || !streetAddress.trim() || !cityDistrict.trim()) {
      setSubmissionError(
        language === 'ar'
          ? 'يرجى استكمال جميع بيانات العنوان الإلزامية'
          : 'Please complete all required address fields.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || `${cleanedPhone}@customer.novawear.eg`,
        },
        shippingAddress: {
          governorate,
          city: cityDistrict.trim(),
          streetAddress: streetAddress.trim(),
          buildingFloorApt: buildingFloor.trim(),
          deliveryNotes: deliveryNotes.trim(),
        },
        items: cart.map(item => ({
          productId: item.productId,
          size: item.size,
          color: item.colorName.en,
          colorValue: item.id.split('_')[2],
          quantity: item.quantity,
        })),
        discountCode: appliedDiscount?.code,
        paymentMethod,
        notes: deliveryNotes.trim(),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.order) {
        if (saveAsAccount) {
          loginCustomer(fullName.trim(), phone.trim(), email.trim());
        }
        clearCart();
        setLastOrder(data.order);
        showToast(
          language === 'ar' ? 'تم تأكيد طلبك بنجاح!' : 'Order placed successfully!',
          'success'
        );
        setActivePage('order-success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmissionError(data.error || 'Failed to place order. Please check item stock.');
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Cart */}
      <button
        onClick={() => setActivePage('shop')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white uppercase tracking-wider mb-8 transition-colors"
      >
        <BackIcon className="w-4 h-4" />
        <span>{t.checkout.backToCart}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Customer Details & Shipping (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-8">
            {/* Step 1: Customer Contact */}
            <div className="p-6 bg-neutral-900/40 rounded-lg border border-neutral-850 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>{t.checkout.contactInfo}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300">
                    {t.checkout.fullName} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Youssef Mansour"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-neutral-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    {t.checkout.phone} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder={t.checkout.phonePlaceholder}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white font-mono focus:outline-hidden focus:border-neutral-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    {t.checkout.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-neutral-500"
                  />
                </div>
              </div>

              {/* Optional Registration checkbox */}
              <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={saveAsAccount}
                  onChange={e => setSaveAsAccount(e.target.checked)}
                  className="rounded bg-neutral-950 border-neutral-700 text-white accent-white"
                />
                <span>{language === 'ar' ? 'حفظ البيانات لإنشاء ملف عميل ومتابعة الطلبات السابقة' : 'Save details for faster future checkout and order history'}</span>
              </label>
            </div>

            {/* Step 2: Egyptian Delivery Address */}
            <div className="p-6 bg-neutral-900/40 rounded-lg border border-neutral-850 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>{t.checkout.shippingInfo}</span>
              </h2>

              <div className="space-y-4">
                {/* Governorate Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    {t.checkout.governorate} <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={governorate}
                    onChange={e => setGovernorate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white font-medium focus:outline-hidden focus:border-neutral-500"
                  >
                    {governoratesList.map(gov => (
                      <option key={gov.id} value={gov.id}>
                        {gov.name[language]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City / District */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    {t.checkout.cityDistrict} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cityDistrict}
                    onChange={e => setCityDistrict(e.target.value)}
                    placeholder="e.g. New Cairo, Fifth Settlement / Zamalek / Smouha"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-neutral-500"
                  />
                </div>

                {/* Street Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    {t.checkout.streetAddress} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={e => setStreetAddress(e.target.value)}
                    placeholder="Street name, landmark, near..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-neutral-500"
                  />
                </div>

                {/* Building / Floor / Apt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    {t.checkout.buildingFloor}
                  </label>
                  <input
                    type="text"
                    value={buildingFloor}
                    onChange={e => setBuildingFloor(e.target.value)}
                    placeholder="Building #, Floor #, Apartment #"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-neutral-500"
                  />
                </div>

                {/* Delivery Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    {t.checkout.deliveryNotes}
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryNotes}
                    onChange={e => setDeliveryNotes(e.target.value)}
                    placeholder={t.checkout.deliveryNotesPlaceholder}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-neutral-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-6 bg-neutral-900/40 rounded-lg border border-neutral-850 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                {t.checkout.paymentInfo}
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery (Standard Egyptian Retail) */}
                <label
                  className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'bg-neutral-900 border-white'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-white"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {t.checkout.paymentMethods.cod}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {t.checkout.paymentMethods.codDesc}
                    </p>
                  </div>
                </label>

                {/* Online Payment / Instapay / ValU (Clearly Labeled Demo Mode) */}
                <label
                  className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-colors ${
                    paymentMethod === 'card_demo'
                      ? 'bg-neutral-900 border-white'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card_demo"
                    checked={paymentMethod === 'card_demo'}
                    onChange={() => setPaymentMethod('card_demo')}
                    className="mt-1 accent-white"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {t.checkout.paymentMethods.cardDemo}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                        {t.checkout.paymentMethods.demoBadge}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {t.checkout.paymentMethods.cardDemoDesc}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {submissionError && (
              <div className="p-4 bg-red-950/40 border border-red-800/80 rounded flex items-center gap-3 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{submissionError}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right: Order Summary Sticky Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-neutral-900/50 border border-neutral-850 rounded-lg p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-3">
              {t.checkout.orderSummary} ({cart.length})
            </h3>

            {/* Itemized List */}
            <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-neutral-850">
              {cart.map(item => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="w-14 h-16 object-cover rounded bg-neutral-900 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-semibold text-white leading-tight">
                        {item.name[language]}
                      </h4>
                      <p className="text-neutral-400 text-[11px] mt-0.5">
                        {item.size} · {item.colorName[language]} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono tabular-nums text-neutral-200">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code box */}
            <div className="pt-4 border-t border-neutral-850">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  placeholder={t.cart.couponPlaceholder}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white uppercase font-mono focus:outline-hidden focus:border-neutral-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-neutral-800 text-white hover:bg-neutral-700 text-xs font-semibold rounded transition-colors"
                >
                  {t.cart.applyCoupon}
                </button>
              </form>
              {promoMessage && (
                <p className={`text-xs mt-2 flex items-center gap-1.5 ${promoMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {promoMessage.isError ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{promoMessage.text}</span>
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-t border-neutral-850 pt-4 text-neutral-400">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span className="font-mono tabular-nums text-white">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              {appliedDiscount && (
                <div className="flex justify-between text-emerald-400">
                  <span>{t.cart.discount} ({appliedDiscount.code})</span>
                  <span className="font-mono tabular-nums">
                    -{formatPrice(appliedDiscount.amount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t.cart.shipping} ({governorate})</span>
                <span className="font-mono tabular-nums text-white">
                  {shippingFee === 0 ? (language === 'ar' ? 'مجاني' : 'FREE') : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-white border-t border-neutral-800 pt-3">
                <span>{t.cart.total}</span>
                <span className="font-mono tabular-nums">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? t.checkout.placingOrder : t.checkout.placeOrder}</span>
            </button>

            {/* Delivery Terms Guarantee */}
            <div className="pt-2 text-[11px] text-neutral-500 leading-relaxed space-y-2">
              <div className="flex items-start gap-2">
                <Truck className="w-3.5 h-3.5 shrink-0 text-neutral-400 mt-0.5" />
                <span>{t.checkout.shippingNotice}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-neutral-400 mt-0.5" />
                <span>{t.checkout.termsAgreement}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
