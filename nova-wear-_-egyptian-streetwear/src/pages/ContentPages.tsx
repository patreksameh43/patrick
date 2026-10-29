import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-mono font-semibold tracking-widest text-neutral-400 uppercase">
          {language === 'ar' ? 'فلسفة العلامة' : 'Our Design Ethos'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          {language === 'ar' ? 'نوفا وير: أصالة الشارع القاهري' : 'NOVA WEAR: Cairo Streetwear Culture'}
        </h1>
        <p className="text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'ar'
            ? 'تأسست نوفا وير في القاهرة لإعادة صياغة أزياء الشارع المعاصرة بلمسة مصرية أصيلة وبأعلى معايير الجودة العالمية.'
            : 'Founded in Cairo, NOVA WEAR is an independent contemporary fashion imprint uniting high-density Egyptian cotton craftsmanship with brutalist, architectural streetwear silhouettes.'}
        </p>
      </div>

      <div className="aspect-16/9 rounded-lg overflow-hidden border border-neutral-850">
        <img
          src="/src/assets/images/hero_banner_editorial_1793126087849.jpg"
          alt="Cairo Streetwear Archive"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-neutral-300 leading-relaxed">
        <div className="p-6 bg-neutral-900/40 rounded border border-neutral-850 space-y-3">
          <h3 className="text-sm font-bold uppercase text-white tracking-wider">
            {language === 'ar' ? '١. القطن المصري فائق الكثافة (450–500 GSM)' : '1. High-Density Egyptian Combed Cotton'}
          </h3>
          <p>
            {language === 'ar'
              ? 'نستخدم خيوط قطن الجيزة طويل التيلة بنسبة ١٠٠٪، المحبوكة بكثافة فائقة تتراوح بين ٤٥٠ و٥٠٠ جرام. هذه الكثافة تمنح الهوديز والتيشيرتات قواماً صلباً وأنيقاً يبرز تفاصيل القصة دون ترهل.'
              : 'We exclusively source 100% Giza long-staple combed yarns knitted at an unprecedented 450–500 GSM. This structural density gives our hoodies and drop-shoulder silhouettes a rigid, commanding architectural drape that retains shape for years.'}
          </p>
        </div>

        <div className="p-6 bg-neutral-900/40 rounded border border-neutral-850 space-y-3">
          <h3 className="text-sm font-bold uppercase text-white tracking-wider">
            {language === 'ar' ? '٢. تصنيع وتشطيب محلي بالكامل' : '2. 100% Local Cairo Craftsmanship'}
          </h3>
          <p>
            {language === 'ar'
              ? 'كل قطعة من قطع نوفا وير يتم قصها، خياطتها، وغسلها يدوياً في مشاغلنا بالقاهرة. نحن ندعم حرفيي النسيج المصريين ونفخر بوضع علامة "صُنع في مصر" على كل قطعة.'
              : 'Every single garment is patterned, cut, stitched, and acid-washed locally in Cairo workshops. We champion generational Egyptian garment masters and take pride in proving that Egyptian streetwear stands head-to-head with top global labels.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { language, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        showToast(
          language === 'ar' ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Message sent successfully!',
          'success'
        );
      } else {
        setErrorMsg(data.error || 'Failed to submit message.');
      }
    } catch {
      setErrorMsg('Network error submitting message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          {language === 'ar' ? 'تواصل معنا وصالة العرض' : 'Contact & Showroom'}
        </h1>
        <p className="text-xs text-neutral-400">
          {language === 'ar' ? 'فريق خدمة عملاء نوفا وير جاهز لمساعدتك يومياً' : 'We are here to assist with sizing, styling, and order status.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Info Column (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 bg-neutral-900/40 rounded-lg border border-neutral-850 space-y-4 text-xs">
            <h3 className="text-sm font-bold uppercase text-white tracking-wider">
              {language === 'ar' ? 'صالة العرض والمقر الرئيسي' : 'Cairo Flagship & Studio'}
            </h3>

            <div className="flex items-start gap-3 text-neutral-300">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <span>18 Brazil Street, Zamalek, Cairo, Egypt</span>
            </div>

            <div className="flex items-center gap-3 text-neutral-300">
              <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
              <span className="font-mono">+20 100 892 4410</span>
            </div>

            <div className="flex items-center gap-3 text-neutral-300">
              <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>care@novawear.eg</span>
            </div>

            <div className="flex items-start gap-3 text-neutral-300 pt-2 border-t border-neutral-850">
              <Clock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">{language === 'ar' ? 'مواعيد العمل:' : 'Opening Hours:'}</p>
                <p className="text-neutral-400 mt-0.5">
                  {language === 'ar' ? 'السبت - الخميس: ١٢ ظهراً حتى ١١ مساءً' : 'Sat – Thu: 12:00 PM – 11:00 PM'}
                </p>
                <p className="text-neutral-400">
                  {language === 'ar' ? 'الجمعة: ٢ ظهراً حتى ١١ مساءً' : 'Fri: 2:00 PM – 11:00 PM'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form (7 cols) */}
        <div className="md:col-span-7">
          <div className="p-6 bg-neutral-950 rounded-lg border border-neutral-850">
            <h3 className="text-sm font-bold uppercase text-white tracking-wider mb-4">
              {language === 'ar' ? 'أرسل لنا استفسارك' : 'Send An Inquiry'}
            </h3>

            {isSuccess ? (
              <div className="p-6 text-center space-y-3 bg-neutral-900/40 rounded border border-neutral-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white uppercase">
                  {language === 'ar' ? 'تم استلام رسالتك!' : 'Message Received!'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {language === 'ar'
                    ? 'شكراً لتواصلك معنا. سنرد على استفسارك خلال ساعات العمل الرسمية.'
                    : 'Our customer support team in Cairo will respond to your inquiry promptly.'}
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-3 px-4 py-2 bg-neutral-800 text-white text-xs font-semibold rounded hover:bg-neutral-700"
                >
                  {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300">
                    {language === 'ar' ? 'الاسم' : 'Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-hidden focus:border-neutral-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-300">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-hidden focus:border-neutral-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-300">
                      {language === 'ar' ? 'الموبايل' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white font-mono focus:outline-hidden focus:border-neutral-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300">
                    {language === 'ar' ? 'الموضوع' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Sizing Advice / Exchange"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-hidden focus:border-neutral-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300">
                    {language === 'ar' ? 'الرسالة' : 'Message'} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-hidden focus:border-neutral-500"
                  />
                </div>

                {errorMsg && (
                  <p className="text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMsg}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? '...' : language === 'ar' ? 'إرسال الرسالة' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const { language } = useStore();

  const faqs = [
    {
      q: language === 'ar' ? 'ما هي مواعيد الشحن لمحافظات مصر؟' : 'What are the delivery timeframes across Egypt?',
      a: language === 'ar'
        ? 'نوفر التوصيل السريع خلال ٢٤-٤٨ ساعة للقاهرة الكبرى والجيزة والإسكندرية. باقي محافظات الدلتا والقناة تستغرق ٢-٣ أيام عمل، ومحافظات الصعيد والبحر الأحمر ٣-٤ أيام عمل.'
        : 'Deliveries to Greater Cairo, Giza, and Alexandria arrive within 24 to 48 hours. Delta and Canal governorates take 2–3 business days, while Upper Egypt and Red Sea take 3–4 business days.',
    },
    {
      q: language === 'ar' ? 'هل يمكنني معاينة وقياس القطع قبل الدفع للمندوب؟' : 'Can I inspect the pieces upon courier arrival before paying?',
      a: language === 'ar'
        ? 'نعم، يتيح لك مندوب الشحن فحص جودة القطع ومطابقتها لطلبك قبل سداد قيمة الطلب في خيار الدفع عند الاستلام.'
        : 'Yes, our courier partners allow you to inspect the garments and confirm size and condition before paying when opting for Cash on Delivery (COD).',
    },
    {
      q: language === 'ar' ? 'كيف أختار المقاس المناسب في قصة الستريت وير الأوفرسايز؟' : 'How do I choose the right size for the oversized cut?',
      a: language === 'ar'
        ? 'جميع قطعنا مقصوصة بنمط "Boxy Oversized" بأكتاف ساقطة. للحصول على القصة الفضفاضة الأرشيفية، اطلب مقاسك المعتاد. إذا أردت مقاساً عادياً وأقل اتساعاً، اختر مقاساً أصغر بنمرة واحدة.'
        : 'All garments are intentionally cut with a generous drop-shoulder boxy drape. To achieve the signature oversized aesthetic, order your true size. If you prefer a closer fit, order one size down.',
    },
    {
      q: language === 'ar' ? 'ما هي تعليمات غسيل القطن الثقيل ٤٨٠ جرام؟' : 'How do I care for 480 GSM heavy French Terry?',
      a: language === 'ar'
        ? 'اغسل القطع دائماً على الوجه المقلوب بماء بارد (٣٠ درجة مئوية). تجنب المجفف الآلي (Tumble Dryer) ودع القطعة تجف بشكل مفرود في الظل للحفاظ على ألياف القطن والطباعة.'
        : 'Always wash garments inside-out in cold water (max 30°C). Do not tumble dry; lay flat in the shade to preserve the high-density cotton fibers and tonal graphics.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-xs text-neutral-400">
          {language === 'ar' ? 'إجابات واضحة لكل ما يخص المقاسات، الشحن وسياسة الاستبدال' : 'Everything you need to know about our fits, ordering, and Egyptian delivery.'}
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="p-5 bg-neutral-900/40 rounded-lg border border-neutral-850 space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              {faq.q}
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ShippingPolicyPage: React.FC = () => {
  const { language, formatPrice, freeShippingThreshold } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-xs text-neutral-300 leading-relaxed">
      <div className="text-center space-y-2 pb-4 border-b border-neutral-900">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          {language === 'ar' ? 'سياسة الشحن والتوصيل' : 'Shipping & Logistics Policy'}
        </h1>
        <p className="text-neutral-400">
          {language === 'ar' ? 'تغطية شاملة لجميع محافظات جمهورية مصر العربية' : 'Comprehensive express shipping across all Egyptian governorates.'}
        </p>
      </div>

      <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded flex items-center gap-3">
        <Truck className="w-5 h-5 text-white shrink-0" />
        <div>
          <span className="font-bold text-white block uppercase">
            {language === 'ar' ? 'عرض الشحن المجاني' : 'Free Shipping Offer'}
          </span>
          <span className="text-neutral-400">
            {language === 'ar'
              ? `احصل على شحن سريع مجاني لجميع المحافظات عند وصول طلبك إلى ${formatPrice(freeShippingThreshold)} فأكثر.`
              : `Unlock FREE express courier shipping across Egypt on all orders of ${formatPrice(freeShippingThreshold)} and above.`}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase text-white tracking-wider">
          {language === 'ar' ? 'جدول أسعار ومواعيد الشحن' : 'Shipping Rates & Transit Timelines'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 font-mono uppercase text-neutral-400">
                <th className="py-2.5 px-3">{language === 'ar' ? 'المنطقة والمحافظات' : 'Region & Governorates'}</th>
                <th className="py-2.5 px-3">{language === 'ar' ? 'التكلفة' : 'Standard Rate'}</th>
                <th className="py-2.5 px-3">{language === 'ar' ? 'مدة التوصيل' : 'Transit Time'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 font-mono tabular-nums">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Cairo & Giza</td>
                <td className="py-2.5 px-3">50 EGP</td>
                <td className="py-2.5 px-3 text-neutral-400">24 – 48 Hours</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Alexandria</td>
                <td className="py-2.5 px-3">65 EGP</td>
                <td className="py-2.5 px-3 text-neutral-400">48 Hours</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Delta & Suez Canal</td>
                <td className="py-2.5 px-3">75 EGP</td>
                <td className="py-2.5 px-3 text-neutral-400">2 – 3 Business Days</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Upper Egypt (Beni Suef to Aswan)</td>
                <td className="py-2.5 px-3">90 EGP</td>
                <td className="py-2.5 px-3 text-neutral-400">3 – 4 Business Days</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Red Sea & Border Governorates</td>
                <td className="py-2.5 px-3">110 EGP</td>
                <td className="py-2.5 px-3 text-neutral-400">4 – 5 Business Days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const ReturnsPolicyPage: React.FC = () => {
  const { language } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-xs text-neutral-300 leading-relaxed">
      <div className="text-center space-y-2 pb-4 border-b border-neutral-900">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          {language === 'ar' ? 'سياسة الاستبدال والاسترجاع' : 'Returns & Exchange Policy'}
        </h1>
        <p className="text-neutral-400">
          {language === 'ar' ? '١٤ يوماً وفقاً لقانون حماية المستهلك المصري' : '14-Day Hassle-Free Returns under Egyptian Consumer Protection Law.'}
        </p>
      </div>

      <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded flex items-center gap-3">
        <RotateCcw className="w-5 h-5 text-white shrink-0" />
        <div>
          <span className="font-bold text-white block uppercase">
            {language === 'ar' ? 'ضمان الرضا الكامل' : 'Satisfaction Guarantee'}
          </span>
          <span className="text-neutral-400">
            {language === 'ar'
              ? 'يمكنك استبدال المقاس أو استرجاع المنتج خلال ١٤ يوماً من استلام الشحنة، شريطة سلامة التيكت والغلاف الأصلي.'
              : 'Exchange sizes or return garments within 14 days of receipt, provided items are unworn with original archival tags intact.'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase text-white tracking-wider">
          {language === 'ar' ? 'شروط الاستبدال والاسترجاع' : 'Return Conditions'}
        </h3>
        <ul className="list-disc pl-5 rtl:pl-0 rtl:pr-5 space-y-2 text-neutral-300">
          <li>{language === 'ar' ? 'يجب أن تكون القطعة بحالتها الأصلية غير مغسولة أو ملبوسة.' : 'Garments must be in pristine, unworn, unwashed condition.'}</li>
          <li>{language === 'ar' ? 'وجود تيكت العلامة الورقي وكيس التغليف الأصلي.' : 'All original tags, labels, and packaging bags must be attached.'}</li>
          <li>{language === 'ar' ? 'في حال وجود عيب صناعة، تتحمل نوفا وير كامل مصاريف الشحن.' : 'In the rare case of a manufacturing defect, NOVA WEAR covers 100% of return shipping costs.'}</li>
          <li>{language === 'ar' ? 'في حال الاستبدال لتغيير المقاس، يتم التنسيق مع مندوب الشحن لتبديل القطعة عند باب منزلك.' : 'For size exchanges, our courier delivers the new size and picks up the old piece in one door-to-door visit.'}</li>
        </ul>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-xs text-neutral-300 leading-relaxed">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-6">
        Privacy & Data Protection Policy
      </h1>
      <p>
        At NOVA WEAR Cairo, we value the trust of our community. This Privacy Policy details how we handle and protect customer contact, address, and purchase information.
      </p>
      <h3 className="text-sm font-bold uppercase text-white tracking-wider mt-4">Information Collected</h3>
      <p>
        We collect customer name, mobile phone number, delivery address, and order history strictly for the fulfillment of orders and shipping logistics within Egyptian governorates.
      </p>
      <h3 className="text-sm font-bold uppercase text-white tracking-wider mt-4">Logistics Partners</h3>
      <p>
        Customer delivery address and mobile contact are shared only with our licensed courier partners (such as Bosta Logistics, Mylerz) solely for doorstep delivery and COD payment collection.
      </p>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-xs text-neutral-300 leading-relaxed">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-6">
        Terms of Service
      </h1>
      <p>
        Welcome to NOVA WEAR. By accessing our catalog and placing orders, you agree to our terms of service and sales policies.
      </p>
      <h3 className="text-sm font-bold uppercase text-white tracking-wider mt-4">Order Pricing & Currency</h3>
      <p>
        All prices are listed in Egyptian Pounds (EGP) and are inclusive of local value taxes where applicable. Shipping fees are itemized clearly prior to order placement.
      </p>
      <h3 className="text-sm font-bold uppercase text-white tracking-wider mt-4">Cash on Delivery Policy</h3>
      <p>
        For COD orders, customers agree to be reachable at the provided mobile phone number to confirm the shipment schedule with our Cairo fulfillment center.
      </p>
    </div>
  );
};
