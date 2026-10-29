import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    language,
    t,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [sortBy, setSortBy] = useState<'newest' | 'priceLow' | 'priceHigh' | 'popular'>('newest');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categories = [
    { id: 'all', label: t.categories.all },
    { id: 'hoodies', label: t.categories.hoodies },
    { id: 'tees', label: t.categories.tees },
    { id: 'pants', label: t.categories.pants },
    { id: 'jackets', label: t.categories.jackets },
  ];

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const availableColors = [
    { id: 'all', name: { en: 'All Colors', ar: 'جميع الألوان' }, hex: '' },
    { id: 'onyx-black', name: { en: 'Onyx Black', ar: 'أسود فحمي' }, hex: '#121212' },
    { id: 'concrete-gray', name: { en: 'Concrete Gray', ar: 'رمادي خرساني' }, hex: '#373737' },
    { id: 'sandstone', name: { en: 'Sandstone', ar: 'بيج رملي' }, hex: '#D2B48C' },
    { id: 'chalk-white', name: { en: 'Chalk White', ar: 'أبيض طباشيري' }, hex: '#F4F4F5' },
    { id: 'egyptian-olive', name: { en: 'Egyptian Olive', ar: 'زيتي مصري' }, hex: '#4A533E' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.en.toLowerCase().includes(q) || product.name.ar.includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCategory) return false;
      }

      // Size filter
      if (selectedSize !== 'all') {
        if (!product.sizes.includes(selectedSize)) return false;
      }

      // Color filter
      if (selectedColor !== 'all') {
        const hasColor = product.colors.some(c => c.value === selectedColor);
        if (!hasColor) return false;
      }

      // Price filter
      if (product.price > maxPrice) return false;

      // In-stock only
      if (inStockOnly && product.totalStock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'popular') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedCategory, searchQuery, selectedSize, selectedColor, maxPrice, inStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(3500);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    maxPrice < 3500 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {t.shop.title}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {t.shop.showingResults.replace('{count}', String(filteredProducts.length))}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.shop.searchPlaceholder}
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white placeholder-neutral-500 pl-9 rtl:pl-3 rtl:pr-9 focus:outline-hidden focus:border-neutral-500"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute top-2.5 left-3 rtl:left-auto rtl:right-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-2.5 right-3 rtl:right-auto rtl:left-3 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Category Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900/80 rounded-lg border border-neutral-850">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Controls & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 hidden sm:inline">{t.shop.sortBy}:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded px-2.5 py-1.5 text-xs font-medium focus:outline-hidden focus:border-neutral-600"
            >
              <option value="newest">{t.shop.sortOptions.newest}</option>
              <option value="popular">{t.shop.sortOptions.popular}</option>
              <option value="priceLow">{t.shop.sortOptions.priceLow}</option>
              <option value="priceHigh">{t.shop.sortOptions.priceHigh}</option>
            </select>
          </div>

          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs font-semibold text-neutral-300"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t.shop.filters}</span>
          </button>
        </div>
      </div>

      {/* Main Grid + Filter Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside
          className={`space-y-6 md:block ${
            isMobileFiltersOpen ? 'block' : 'hidden'
          } bg-neutral-950 md:bg-transparent p-4 md:p-0 rounded border md:border-0 border-neutral-800`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {t.shop.filters}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-neutral-500 hover:text-white transition-colors"
              >
                {t.shop.clearFilters}
              </button>
            )}
          </div>

          {/* Size Filter */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              {t.shop.size}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                  selectedSize === 'all'
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'الكل' : 'All'}
              </button>
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? 'all' : size)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                    selectedSize === size
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              {t.shop.color}
            </h4>
            <div className="space-y-1.5">
              {availableColors.map(col => (
                <button
                  key={col.id}
                  onClick={() => setSelectedColor(col.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                    selectedColor === col.id
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {col.hex && (
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-700"
                        style={{ backgroundColor: col.hex }}
                      />
                    )}
                    <span>{col.name[language]}</span>
                  </div>
                  {selectedColor === col.id && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-neutral-300 uppercase tracking-wider">
                {t.shop.priceRange}
              </span>
              <span className="font-mono text-white tabular-nums">
                {maxPrice} EGP
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="3500"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-white bg-neutral-800 cursor-pointer h-1.5 rounded-lg"
            />
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t border-neutral-900">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-white accent-white cursor-pointer"
              />
              <span>{t.shop.inStockOnly}</span>
            </label>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900/30 rounded-lg border border-neutral-900 p-8">
              <p className="text-sm text-neutral-400 mb-4">{t.shop.noProducts}</p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2 bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider rounded hover:bg-neutral-700 transition-colors"
              >
                {t.shop.clearFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
