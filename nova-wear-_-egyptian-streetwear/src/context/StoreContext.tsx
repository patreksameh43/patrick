import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Language, ColorVariant } from '../types/index.js';
import { translations } from '../i18n/translations.js';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations['en'];
  currency: string;
  formatPrice: (amount: number) => string;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, size: string, color: ColorVariant, quantity?: number) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  freeShippingThreshold: number;
  openProductModal: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nova_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2000);

  // Sync document direction and language tag
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('nova_lang', language);
  }, [language]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('nova_cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch products from server
  const refreshProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
    // Also fetch shipping threshold
    fetch('/api/shipping-rates')
      .then(r => r.json())
      .then(d => {
        if (d.settings?.freeShippingThreshold) {
          setFreeShippingThreshold(d.settings.freeShippingThreshold);
        }
      })
      .catch(() => {});
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const formatPrice = (amount: number): string => {
    const formatted = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(amount);
    return language === 'ar' ? `${formatted} ج.م` : `${formatted} EGP`;
  };

  const addToCart = (product: Product, size: string, color: ColorVariant, quantity = 1) => {
    const variantKey = `${size}_${color.value}`;
    const maxStock = product.inventory[variantKey] ?? 0;

    if (maxStock <= 0) {
      showToast(
        language === 'ar'
          ? 'عذراً، هذا المقاس غير متوفر بالمخزون حالياً.'
          : 'Sorry, this size variant is out of stock.',
        'error'
      );
      return;
    }

    const cartItemId = `${product.id}_${size}_${color.value}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQty, maxStock } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          size,
          colorName: color.name,
          colorHex: color.hex,
          image: product.images[0] || '/src/assets/images/hoodie_anubis_black_1793126087782.jpg',
          quantity: Math.min(quantity, maxStock),
          maxStock,
          sku: `${product.sku}-${size}`,
        },
      ];
    });

    showToast(
      language === 'ar'
        ? `تمت إضافة "${product.name.ar}" (${size}) إلى حقيبتك`
        : `Added "${product.name.en}" (${size}) to your bag`,
      'success'
    );
    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const clampedQty = Math.min(quantity, item.maxStock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast(
      language === 'ar' ? 'تمت إزالة القطعة من حقيبتك' : 'Item removed from bag',
      'info'
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = translations[language];

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        currency: 'EGP',
        formatPrice,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        products,
        isLoadingProducts,
        refreshProducts,
        selectedProduct,
        setSelectedProduct,
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        lastOrder,
        setLastOrder,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        toasts,
        showToast,
        freeShippingThreshold,
        openProductModal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
