export type Language = 'en' | 'ar';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface ColorVariant {
  name: LocalizedString;
  hex: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: LocalizedString;
  description: LocalizedString;
  category: 'hoodies' | 'tees' | 'pants' | 'jackets' | 'accessories';
  price: number;
  compareAtPrice: number | null;
  images: string[];
  sizes: string[];
  colors: ColorVariant[];
  inventory: Record<string, number>; // variantKey: 'size_colorvalue' -> count
  totalStock: number;
  status: 'active' | 'draft' | 'archived';
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  fabric: LocalizedString;
  care: LocalizedString;
  fit: LocalizedString;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // unique item id: productId_size_color
  productId: string;
  name: LocalizedString;
  price: number;
  size: string;
  colorName: LocalizedString;
  colorHex: string;
  image: string;
  quantity: number;
  maxStock: number;
  sku: string;
}

export interface GovernorateRate {
  id: string;
  name: LocalizedString;
  cost: number;
  deliveryDays: LocalizedString;
  governorates: string[];
}

export interface DiscountCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  isActive: boolean;
  usageCount: number;
  maxUses: number | null;
  description: LocalizedString;
}

export interface OrderItem {
  productId: string;
  name: LocalizedString;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
  sku: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  adminEmail?: string;
}

export interface Order {
  id: string; // e.g. NV-10492
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    governorate: string;
    city: string;
    streetAddress: string;
    buildingFloorApt?: string;
    deliveryNotes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  discountCodeApplied?: string;
  total: number;
  currency: 'EGP';
  paymentMethod: 'cod' | 'card_demo';
  paymentStatus: 'pending' | 'paid' | 'unpaid';
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  statusHistory: OrderStatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  targetType: 'order' | 'product' | 'discount' | 'shipping' | 'settings' | 'auth';
  targetId: string;
  details: string;
  adminEmail: string;
  timestamp: string;
}

export interface StoreSettings {
  freeShippingThreshold: number;
  supportPhone: string;
  supportEmail: string;
  instagramHandle: string;
  storeAnnouncement: {
    en: string;
    ar: string;
    enabled: boolean;
  };
  codFee: number;
  adminPassword?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  fullName: string;
  phone?: string;
  savedAddresses?: {
    governorate: string;
    city: string;
    streetAddress: string;
  }[];
}
