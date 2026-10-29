import React from 'react';
import { useStore } from '../context/StoreContext.js';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, setActivePage, setSelectedCategory } = useStore();

  const handleNav = (page: string, category = 'all') => {
    setSelectedCategory(category);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-xs">
      {/* Trust Markers Bar */}
      <div className="border-b border-neutral-900 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left rtl:md:text-right">
          <div className="flex items-center justify-center md:justify-start rtl:md:justify-start gap-3">
            <Truck className="w-5 h-5 text-neutral-300 shrink-0" />
            <div>
              <p className="font-semibold text-white tracking-wide uppercase">
                {language === 'ar' ? 'شحن سريع لكافة محافظات مصر' : 'Express All-Egypt Delivery'}
              </p>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                {language === 'ar' ? '٢٤-٤٨ ساعة للقاهرة والإسكندرية' : '24-48h in Greater Cairo & Alexandria'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start rtl:md:justify-start gap-3">
            <RotateCcw className="w-5 h-5 text-neutral-300 shrink-0" />
            <div>
              <p className="font-semibold text-white tracking-wide uppercase">
                {language === 'ar' ? 'استبدال واسترجاع خلال ١٤ يوم' : '14-Day Free Exchange Policy'}
              </p>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                {language === 'ar' ? 'معاينة الشحنة قبل الاستلام' : 'Inspect package upon delivery with courier'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start rtl:md:justify-start gap-3">
            <ShieldCheck className="w-5 h-5 text-neutral-300 shrink-0" />
            <div>
              <p className="font-semibold text-white tracking-wide uppercase">
                {language === 'ar' ? 'قطن مصري ممشط ١٠٠٪' : '100% Heavy Egyptian Cotton'}
              </p>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                {language === 'ar' ? 'حياكة وتشطيب محلي فاخر بالقاهرة' : 'High density 450–500 GSM craftsmanship'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <h3 className="text-lg font-black tracking-tighter text-white uppercase">
              NOVA WEAR
            </h3>
            <p className="text-neutral-400 leading-relaxed text-xs">
              {t.footer.aboutText}
            </p>
            <div className="pt-2 text-neutral-300 font-medium text-[11px]">
              {t.footer.egyptProud}
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNav('shop', 'all')}
                  className="hover:text-white transition-colors"
                >
                  {t.categories.all}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'hoodies')}
                  className="hover:text-white transition-colors"
                >
                  {t.categories.hoodies}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'tees')}
                  className="hover:text-white transition-colors"
                >
                  {t.categories.tees}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'pants')}
                  className="hover:text-white transition-colors"
                >
                  {t.categories.pants}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'jackets')}
                  className="hover:text-white transition-colors"
                >
                  {t.categories.jackets}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.customerCare}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNav('tracking')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.trackOrder}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shipping')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.shippingPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('returns')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.returnsPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.faq}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.contactUs}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Operations Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.privacyPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('terms')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.termsOfService}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {t.nav.admin}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Portfolio Demo Notice & Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-900 text-center space-y-3">
          <p className="text-[11px] text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            {t.footer.demoDisclaimer}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 pt-2">
            <span>© {new Date().getFullYear()} NOVA WEAR Cairo. {t.footer.rights}</span>
            <div className="flex items-center gap-4">
              <span>Cash on Delivery (COD)</span>
              <span>·</span>
              <span>Instapay (Demo)</span>
              <span>·</span>
              <span>ValU (Demo)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
