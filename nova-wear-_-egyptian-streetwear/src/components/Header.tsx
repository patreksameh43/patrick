import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { ShoppingBag, Globe, Menu, X, Shield, PackageCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    t,
    language,
    toggleLanguage,
    cartCount,
    setIsCartOpen,
    activePage,
    setActivePage,
    setSelectedCategory,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const navigateTo = (page: string, category = 'all') => {
    setSelectedCategory(category);
    setActivePage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900">
      {/* Slim Top Announcement Banner */}
      {showAnnouncement && (
        <div className="bg-neutral-900 text-neutral-300 text-[11px] font-medium tracking-widest py-1.5 px-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex-1 text-center truncate">
            <span>{t.announcement}</span>
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="text-neutral-500 hover:text-neutral-200 transition-colors text-xs px-1"
            aria-label="Dismiss banner"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => navigateTo('home')}
          className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase hover:text-neutral-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>NOVA WEAR</span>
          <span className="text-[10px] font-normal tracking-wider text-neutral-500 hidden sm:inline">CAIRO</span>
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-neutral-400">
          <button
            onClick={() => navigateTo('shop', 'all')}
            className={`transition-colors hover:text-white whitespace-nowrap shrink-0 ${
              activePage === 'shop' ? 'text-white underline underline-offset-8 decoration-white decoration-2' : ''
            }`}
          >
            {t.nav.shop}
          </button>
          <button
            onClick={() => navigateTo('shop', 'hoodies')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            {t.nav.hoodies}
          </button>
          <button
            onClick={() => navigateTo('shop', 'tees')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            {t.nav.tees}
          </button>
          <button
            onClick={() => navigateTo('shop', 'cargo')}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            {t.nav.cargo}
          </button>
          <button
            onClick={() => navigateTo('about')}
            className={`transition-colors hover:text-white whitespace-nowrap shrink-0 ${
              activePage === 'about' ? 'text-white underline underline-offset-8 decoration-white decoration-2' : ''
            }`}
          >
            {t.nav.about}
          </button>
          <button
            onClick={() => navigateTo('tracking')}
            className={`transition-colors hover:text-white whitespace-nowrap shrink-0 ${
              activePage === 'tracking' ? 'text-white underline underline-offset-8 decoration-white decoration-2' : ''
            }`}
          >
            {t.nav.trackOrder}
          </button>
        </nav>

        {/* Zone 3: Actions (Language toggle, Admin link, Cart trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors whitespace-nowrap"
            title="Switch Language / تغيير اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span>{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Admin Portal Shortcut */}
          <button
            onClick={() => navigateTo('admin')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 rounded transition-colors whitespace-nowrap"
            title="Admin Portal"
          >
            <Shield className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden lg:inline">{t.nav.admin}</span>
          </button>

          {/* Cart Bag Primary Action */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2.5 bg-white text-black hover:bg-neutral-200 rounded font-medium transition-colors whitespace-nowrap shrink-0 shadow-sm"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="ml-1.5 text-xs font-bold tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white bg-neutral-900 rounded"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 text-sm font-semibold tracking-wider uppercase text-neutral-300">
            <button
              onClick={() => navigateTo('shop', 'all')}
              className="text-left rtl:text-right py-2 hover:text-white border-b border-neutral-900"
            >
              {t.nav.shop}
            </button>
            <button
              onClick={() => navigateTo('shop', 'hoodies')}
              className="text-left rtl:text-right py-2 hover:text-white border-b border-neutral-900"
            >
              {t.nav.hoodies}
            </button>
            <button
              onClick={() => navigateTo('shop', 'tees')}
              className="text-left rtl:text-right py-2 hover:text-white border-b border-neutral-900"
            >
              {t.nav.tees}
            </button>
            <button
              onClick={() => navigateTo('shop', 'cargo')}
              className="text-left rtl:text-right py-2 hover:text-white border-b border-neutral-900"
            >
              {t.nav.cargo}
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="text-left rtl:text-right py-2 hover:text-white border-b border-neutral-900"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => navigateTo('tracking')}
              className="text-left rtl:text-right py-2 hover:text-white border-b border-neutral-900 flex items-center justify-between"
            >
              <span>{t.nav.trackOrder}</span>
              <PackageCheck className="w-4 h-4 text-neutral-500" />
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className="text-left rtl:text-right py-2 text-neutral-400 hover:text-white flex items-center justify-between"
            >
              <span>{t.nav.admin}</span>
              <Shield className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
