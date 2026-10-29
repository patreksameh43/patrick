import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { ProductCard } from '../components/ProductCard.js';
import {
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Share2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    language,
    t,
    formatPrice,
    addToCart,
    setIsSizeGuideOpen,
    setActivePage,
    products,
    showToast,
  } = useStore();

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-neutral-400 mb-4">No product selected.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded"
        >
          {t.cart.exploreBtn}
        </button>
      </div>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(selectedProduct.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const variantKey = `${selectedSize}_${selectedColor?.value}`;
  const variantStock = selectedProduct.inventory[variantKey] ?? 0;
  const isVariantOutOfStock = variantStock <= 0;
  const isVariantLowStock = variantStock > 0 && variantStock <= 5;

  const relatedProducts = products
    .filter(p => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.isFeatured))
    .slice(0, 3);

  const handleAddToCart = () => {
    if (!selectedColor || isVariantOutOfStock) return;
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(
      language === 'ar' ? 'تم نسخ رابط القطعة إلى الحافظة' : 'Product link copied to clipboard',
      'info'
    );
  };

  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back Button */}
      <div>
        <button
          onClick={() => setActivePage('shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          <BackIcon className="w-4 h-4" />
          <span>{language === 'ar' ? 'العودة للكتالوج' : 'Back to Catalog'}</span>
        </button>
      </div>

      {/* Main Contiguous Purchase Module Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Sticky Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="aspect-4/3 sm:aspect-1/1 w-full bg-neutral-900 rounded-lg overflow-hidden border border-neutral-850 relative">
            <img
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.name[language]}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {selectedProduct.isNewArrival && (
              <span className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-xs font-mono font-bold tracking-wider uppercase text-white bg-neutral-900/80 px-2.5 py-1 rounded backdrop-blur-xs">
                {language === 'ar' ? 'أرشيف جديد' : 'New Drop'}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {selectedProduct.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 rounded overflow-hidden border-2 transition-all shrink-0 bg-neutral-900 ${
                    activeImageIndex === idx
                      ? 'border-white opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono tracking-wider uppercase text-neutral-400">
                  {selectedProduct.category} · {selectedProduct.sku}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                  {selectedProduct.name[language]}
                </h1>
              </div>
              <button
                onClick={handleShare}
                className="p-2 text-neutral-400 hover:text-white rounded bg-neutral-900 transition-colors"
                title={t.product.share}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Price Display */}
            <div className="mt-4 flex items-baseline gap-3 font-mono tabular-nums">
              <span className="text-2xl font-bold text-white">
                {formatPrice(selectedProduct.price)}
              </span>
              {selectedProduct.compareAtPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(selectedProduct.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Product Narrative */}
            <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {selectedProduct.description[language]}
            </p>

            {/* Color Swatch Picker */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">
                  {t.product.selectColor}:
                </span>
                <span className="text-white font-medium">
                  {selectedColor?.name[language]}
                </span>
              </div>
              <div className="flex gap-2">
                {selectedProduct.colors.map(col => (
                  <button
                    key={col.value}
                    onClick={() => setSelectedColor(col)}
                    className={`flex items-center gap-2 px-3 py-2 rounded border text-xs transition-colors ${
                      selectedColor?.value === col.value
                        ? 'bg-neutral-850 border-white text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-neutral-700"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name[language]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Picker & Size Guide Modal Trigger */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">
                  {t.product.selectSize}:
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-neutral-300 hover:text-white underline underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{t.product.sizeGuide}</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {selectedProduct.sizes.map(size => {
                  const sKey = `${size}_${selectedColor?.value}`;
                  const stock = selectedProduct.inventory[sKey] ?? 0;
                  const disabled = stock <= 0;

                  return (
                    <button
                      key={size}
                      disabled={disabled}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                      }}
                      className={`py-3 text-xs font-mono font-bold rounded border transition-all relative ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : disabled
                          ? 'bg-neutral-900 text-neutral-600 border-neutral-850 opacity-40 cursor-not-allowed line-through'
                          : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock Availability Indicator */}
            <div className="mt-4 text-xs font-mono">
              {isVariantOutOfStock ? (
                <span className="text-red-400 font-semibold">
                  {t.product.outOfStock} ({selectedSize})
                </span>
              ) : isVariantLowStock ? (
                <span className="text-orange-400 font-semibold">
                  {t.product.lowStock} ({variantStock} {language === 'ar' ? 'قطع متبقية' : 'units left'})
                </span>
              ) : (
                <span className="text-emerald-400">
                  {t.product.inStock} ({variantStock} {language === 'ar' ? 'قطعة متوفرة' : 'units available'})
                </span>
              )}
            </div>

            {/* Quantity Selector & Primary CTA Button */}
            <div className="mt-6 flex gap-3">
              <div className="flex items-center border border-neutral-800 rounded bg-neutral-900 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isVariantOutOfStock}
                  className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold tabular-nums text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(variantStock, quantity + 1))}
                  disabled={quantity >= variantStock || isVariantOutOfStock}
                  className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isVariantOutOfStock}
                className="flex-1 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                {isVariantOutOfStock ? t.product.outOfStock : t.product.addToCart}
              </button>
            </div>
          </div>

          {/* Technical Specifications Accordion / Boxes */}
          <div className="space-y-3 pt-6 border-t border-neutral-900 text-xs text-neutral-300">
            <div className="p-3 bg-neutral-900/60 rounded border border-neutral-850 space-y-1">
              <span className="font-semibold text-white uppercase tracking-wider block">
                {t.product.fabricDetails}
              </span>
              <p className="text-neutral-400">{selectedProduct.fabric[language]}</p>
            </div>

            <div className="p-3 bg-neutral-900/60 rounded border border-neutral-850 space-y-1">
              <span className="font-semibold text-white uppercase tracking-wider block">
                {t.product.fitSpecs}
              </span>
              <p className="text-neutral-400">{selectedProduct.fit[language]}</p>
            </div>

            <div className="p-3 bg-neutral-900/60 rounded border border-neutral-850 space-y-1">
              <span className="font-semibold text-white uppercase tracking-wider block">
                {t.product.careInstructions}
              </span>
              <p className="text-neutral-400">{selectedProduct.care[language]}</p>
            </div>
          </div>

          {/* Egyptian Service Guarantees */}
          <div className="pt-4 border-t border-neutral-900 grid grid-cols-3 gap-2 text-center text-[11px] text-neutral-400">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-neutral-300" />
              <span>{language === 'ar' ? 'شحن فوري' : 'Fast Cairo Dispatch'}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-neutral-300" />
              <span>{language === 'ar' ? 'استبدال ١٤ يوم' : '14-Day Exchange'}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-neutral-300" />
              <span>{language === 'ar' ? 'قطن مصري أصيل' : 'Pure Cotton'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete the look / Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-neutral-900 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            {t.product.relatedPieces}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Buy Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-neutral-950/95 border-t border-neutral-800 p-3 px-4 flex items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <span className="text-[11px] text-neutral-400 block line-clamp-1">{selectedProduct.name[language]}</span>
          <span className="text-sm font-bold font-mono text-white tabular-nums">{formatPrice(selectedProduct.price)}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isVariantOutOfStock}
          className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors disabled:opacity-40"
        >
          {isVariantOutOfStock ? t.product.outOfStock : t.product.addToCart}
        </button>
      </div>
    </div>
  );
};
