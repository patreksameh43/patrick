import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, language, t, setActivePage, setSelectedCategory } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden border-b border-neutral-900">
        {/* Background Editorial Image with Measured Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_banner_editorial_1793126087849.jpg"
            alt="NOVA WEAR Cairo Streetwear Lookbook"
            className="w-full h-full object-cover object-top opacity-65"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
          <div className="absolute inset-0 bg-neutral-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest text-neutral-400 uppercase">
            <span>{t.hero.badge}</span>
            <span>·</span>
            <span>{t.brandOrigin}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase text-balance leading-tight max-w-4xl mx-auto">
            {t.hero.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActivePage('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{t.hero.shopNow}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActivePage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900/80 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-widest rounded transition-all border border-neutral-700 backdrop-blur-xs"
            >
              {t.hero.viewLookbook}
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tabular-nums">450-500 GSM</span>
              <span>{language === 'ar' ? 'قطن مصري ثقيل' : 'Heavy Cotton'}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tabular-nums">24-48H</span>
              <span>{language === 'ar' ? 'توصيل القاهرة' : 'Cairo Delivery'}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tabular-nums">14 DAYS</span>
              <span>{language === 'ar' ? 'استبدال مجاني' : 'Free Exchange'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              {t.sections.featuredDrops}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {t.sections.featuredSubtitle}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>{t.sections.exploreShop}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Category Spotlight Strips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hoodies Card */}
          <div
            onClick={() => {
              setSelectedCategory('hoodies');
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer relative h-80 rounded-lg overflow-hidden border border-neutral-900 bg-neutral-900"
          >
            <img
              src="/src/assets/images/hoodie_anubis_black_1793126087782.jpg"
              alt="Hoodies"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            <div className="absolute bottom-5 left-5 rtl:left-auto rtl:right-5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase">ARCHIVE 01</span>
              <h3 className="text-lg font-bold uppercase text-white mt-0.5">{t.categories.hoodies}</h3>
              <p className="text-xs text-neutral-300 mt-1">{language === 'ar' ? 'قطن ٤٨٠ جرام فائق النعومة' : '480 GSM French Terry'}</p>
            </div>
          </div>

          {/* Cargo Pants Card */}
          <div
            onClick={() => {
              setSelectedCategory('pants');
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer relative h-80 rounded-lg overflow-hidden border border-neutral-900 bg-neutral-900"
          >
            <img
              src="/src/assets/images/cargo_pants_sand_1793126088834.jpg"
              alt="Tactical Cargo Pants"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            <div className="absolute bottom-5 left-5 rtl:left-auto rtl:right-5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase">ARCHIVE 02</span>
              <h3 className="text-lg font-bold uppercase text-white mt-0.5">{t.categories.pants}</h3>
              <p className="text-xs text-neutral-300 mt-1">{language === 'ar' ? 'جيوب تكتيكية متعددة وخامات قوية' : 'Modular Pockets & Hardware'}</p>
            </div>
          </div>

          {/* Tees Card */}
          <div
            onClick={() => {
              setSelectedCategory('tees');
              setActivePage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer relative h-80 rounded-lg overflow-hidden border border-neutral-900 bg-neutral-900"
          >
            <img
              src="/src/assets/images/oversized_tee_white_1793126088680.jpg"
              alt="Oversized Boxy Tees"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            <div className="absolute bottom-5 left-5 rtl:left-auto rtl:right-5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase">ARCHIVE 03</span>
              <h3 className="text-lg font-bold uppercase text-white mt-0.5">{t.categories.tees}</h3>
              <p className="text-xs text-neutral-300 mt-1">{language === 'ar' ? 'أكتاف ساقطة وقماش ممشط ٢٨٠ جرام' : '280 GSM Heavy Drop-Shoulder'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Freshly Cut Archive (New Arrivals) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              {t.sections.newArrivals}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {language === 'ar' ? 'أحدث الإضافات لخط إنتاج القاهرة شتاء ٢٠٢٦' : 'Recently added to our Cairo winter manufacturing run'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Craftsmanship & Cairo Street Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900/60 border border-neutral-850 rounded-2xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                {language === 'ar' ? 'حرفية النسيج المصري' : 'Egyptian Textile Heritage'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                {t.sections.craftsmanshipTitle}
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {t.sections.craftsmanshipText}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 text-xs">
                <div>
                  <h4 className="font-bold text-white uppercase">{language === 'ar' ? 'قطن جيزة الفاخر' : 'Giza Long-Staple'}</h4>
                  <p className="text-neutral-400 text-[11px] mt-0.5">{language === 'ar' ? 'ألياف ناعمة ومتينة تدوم طويلاً' : 'Ultra-durable, zero pilling guarantee'}</p>
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase">{language === 'ar' ? 'غسيل متخصص' : 'Garment Acid Wash'}</h4>
                  <p className="text-neutral-400 text-[11px] mt-0.5">{language === 'ar' ? 'ملمس ناعم وطابع فينتاج مميز' : 'Pre-shrunk authentic vintage patina'}</p>
                </div>
              </div>
            </div>

            <div className="aspect-4/3 rounded-lg overflow-hidden border border-neutral-800">
              <img
                src="/src/assets/images/bomber_jacket_olive_1793126089413.jpg"
                alt="NOVA WEAR Craftsmanship"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VIP Drop Newsletter */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>{t.sections.newsletterTitle}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold uppercase text-white">
          {language === 'ar' ? 'كن أول من يحصل على الإصدارات القادمة' : 'Never Miss an Archival Drop'}
        </h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          {t.sections.newsletterSubtitle}
        </p>

        {subscribed ? (
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.sections.subscribedMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني...' : 'Enter your email address...'}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-neutral-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors whitespace-nowrap"
            >
              {t.sections.subscribe}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
