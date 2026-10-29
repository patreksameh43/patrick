import React from 'react';
import { Product } from '../types/index.js';
import { useStore } from '../context/StoreContext.js';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, formatPrice, openProductModal, addToCart } = useStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first available size and color
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0];
    if (defaultColor) {
      addToCart(product, defaultSize, defaultColor, 1);
    } else {
      openProductModal(product);
    }
  };

  const isLowStock = product.totalStock > 0 && product.totalStock <= 15;
  const isSoldOut = product.totalStock === 0;

  return (
    <div
      onClick={() => openProductModal(product)}
      className="group cursor-pointer flex flex-col bg-neutral-950 rounded-lg overflow-hidden border border-neutral-900 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container with 4:3 Aspect Ratio */}
      <div className="relative aspect-4/3 w-full bg-neutral-900 overflow-hidden">
        <img
          src={product.images[0] || '/src/assets/images/hoodie_anubis_black_1793126087782.jpg'}
          alt={product.name[language]}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Minimal Unboxed Status Tag */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider">
          {product.isNewArrival && !isSoldOut && (
            <span className="text-white drop-shadow-md">
              {language === 'ar' ? 'إصدار حديث' : 'New Drop'}
            </span>
          )}
          {product.compareAtPrice && !isSoldOut && (
            <span className="text-amber-300 font-mono drop-shadow-md">
              {language === 'ar' ? 'سعر خاص' : 'Archive Offer'}
            </span>
          )}
          {isLowStock && (
            <span className="text-orange-400 drop-shadow-md">
              {language === 'ar' ? 'قطع محدودة' : 'Low Stock'}
            </span>
          )}
          {isSoldOut && (
            <span className="text-neutral-400 drop-shadow-md">
              {language === 'ar' ? 'نفد المخزون' : 'Sold Out'}
            </span>
          )}
        </div>

        {/* Quick Add Button Overlay */}
        {!isSoldOut && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 p-2.5 bg-neutral-900/90 hover:bg-white text-white hover:text-black rounded transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-xs"
            title={language === 'ar' ? 'إضافة سريعة للحقيبة' : 'Quick add to bag'}
            aria-label="Quick add"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Card Metadata */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-2">
        <div>
          <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
            {product.category} · {product.sku}
          </span>
          <h3 className="text-sm font-semibold text-white tracking-tight mt-1 line-clamp-1 group-hover:text-neutral-200 transition-colors">
            {product.name[language]}
          </h3>
        </div>

        {/* Price & Colors preview */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-sm font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Color Dots */}
          <div className="flex items-center gap-1.5">
            {product.colors.map(col => (
              <span
                key={col.value}
                className="w-2.5 h-2.5 rounded-full border border-neutral-700"
                style={{ backgroundColor: col.hex }}
                title={col.name[language]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
