import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useStore } from '../context/StoreContext.js';
import {
  Product,
  Order,
  OrderStatus,
  DiscountCode,
  GovernorateRate,
  CustomerInquiry,
  AuditLog,
  StoreSettings,
} from '../types/index.js';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  LogOut,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  Truck,
  Tag,
  MessageSquare,
  ShieldAlert,
  Settings,
  X,
  Key,
  KeyRound,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isAdminLoggedIn, adminUser, loginAdmin, logoutAdmin } = useAuth();
  const { formatPrice, language, showToast, refreshProducts: storeRefreshProducts } = useStore();

  // Admin login form states
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [currentTab, setCurrentTab] = useState<
    'overview' | 'orders' | 'products' | 'discounts' | 'shipping' | 'inquiries' | 'audit' | 'security'
  >('overview');

  // Change Password States
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [shippingRates, setShippingRates] = useState<GovernorateRate[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Orders filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('pending');
  const [orderNote, setOrderNote] = useState('');
  const [orderCarrier, setOrderCarrier] = useState('');
  const [orderTrackingNo, setOrderTrackingNo] = useState('');

  // Product editor modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    sku: '',
    nameEn: '',
    nameAr: '',
    category: 'hoodies',
    price: 1500,
    compareAtPrice: 0,
    descriptionEn: '',
    descriptionAr: '',
    sizes: 'S, M, L, XL',
    colorsEn: 'Onyx Black, Concrete Gray',
    colorsAr: 'أسود فحمي, رمادي خرساني',
    colorsHex: '#121212, #373737',
    stockPerVariant: 10,
    status: 'active' as 'active' | 'draft' | 'archived',
    imageUrl: '/src/assets/images/hoodie_anubis_black_1793126087782.jpg',
  });

  // Discount creator modal
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    minOrder: 1000,
    descEn: '',
    descAr: '',
  });

  // Load Admin Data
  const fetchAllAdminData = async () => {
    setIsLoadingData(true);
    try {
      const [
        analyticsRes,
        ordersRes,
        productsRes,
        discountsRes,
        shippingRes,
        inquiriesRes,
        auditRes,
      ] = await Promise.all([
        fetch('/api/admin/analytics').then(r => r.json()),
        fetch('/api/admin/orders').then(r => r.json()),
        fetch('/api/admin/products').then(r => r.json()),
        fetch('/api/admin/discounts').then(r => r.json()),
        fetch('/api/shipping-rates').then(r => r.json()),
        fetch('/api/admin/inquiries').then(r => r.json()),
        fetch('/api/admin/audit-logs').then(r => r.json()),
      ]);

      if (analyticsRes.analytics) setAnalytics(analyticsRes.analytics);
      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (productsRes.products) setProducts(productsRes.products);
      if (discountsRes.discounts) setDiscounts(discountsRes.discounts);
      if (shippingRes.rates) setShippingRates(shippingRes.rates);
      if (shippingRes.settings) setSettings(shippingRes.settings);
      if (inquiriesRes.inquiries) setInquiries(inquiriesRes.inquiries);
      if (auditRes.auditLogs) setAuditLogs(auditRes.auditLogs);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAllAdminData();
    }
  }, [isAdminLoggedIn]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    const res = await loginAdmin(passwordInput);
    if (!res.success) {
      setLoginError(res.error || 'Invalid password. Please check and try again.');
    }
    setIsLoggingIn(false);
  };

  // Order Status Update
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newOrderStatus,
          note: orderNote,
          carrier: orderCarrier || selectedOrder.carrier,
          trackingNumber: orderTrackingNo || selectedOrder.trackingNumber,
          adminOperator: 'Admin',
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setSelectedOrder(data.order);
        setOrders(prev => prev.map(o => (o.id === data.order.id ? data.order : o)));
        showToast(`Order ${data.order.id} status updated to ${newOrderStatus.toUpperCase()}`, 'success');
        setOrderNote('');
        fetchAllAdminData();
      }
    } catch {
      showToast('Failed to update order status', 'error');
    }
  };

  // Export Orders as CSV
  const handleExportCsv = () => {
    if (orders.length === 0) return;

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Customer Phone',
      'Customer Email',
      'Governorate',
      'City / Street',
      'Total (EGP)',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Items Count',
      'Carrier',
      'Tracking Number',
    ];

    const rows = orders.map(o => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.customer.fullName.replace(/"/g, '""')}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.email}"`,
      `"${o.shippingAddress.governorate}"`,
      `"${(o.shippingAddress.streetAddress + ', ' + o.shippingAddress.city).replace(/"/g, '""')}"`,
      o.total,
      `"${o.paymentMethod.toUpperCase()}"`,
      `"${o.paymentStatus.toUpperCase()}"`,
      `"${o.status.toUpperCase()}"`,
      o.items.reduce((s, i) => s + i.quantity, 0),
      `"${o.carrier || ''}"`,
      `"${o.trackingNumber || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NOVA_WEAR_ORDERS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Product Modal for New / Edit
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      sku: `NV-DROP-${Math.floor(100 + Math.random() * 900)}`,
      nameEn: '',
      nameAr: '',
      category: 'hoodies',
      price: 1850,
      compareAtPrice: 2200,
      descriptionEn: '',
      descriptionAr: '',
      sizes: 'S, M, L, XL',
      colorsEn: 'Onyx Black, Concrete Gray',
      colorsAr: 'أسود فحمي, رمادي خرساني',
      colorsHex: '#121212, #373737',
      stockPerVariant: 10,
      status: 'active',
      imageUrl: '/src/assets/images/hoodie_anubis_black_1793126087782.jpg',
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      sku: prod.sku,
      nameEn: prod.name.en,
      nameAr: prod.name.ar,
      category: prod.category,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice || 0,
      descriptionEn: prod.description.en,
      descriptionAr: prod.description.ar,
      sizes: prod.sizes.join(', '),
      colorsEn: prod.colors.map(c => c.name.en).join(', '),
      colorsAr: prod.colors.map(c => c.name.ar).join(', '),
      colorsHex: prod.colors.map(c => c.hex).join(', '),
      stockPerVariant: 10,
      status: prod.status,
      imageUrl: prod.images[0] || '/src/assets/images/hoodie_anubis_black_1793126087782.jpg',
    });
    setIsProductModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.nameEn.trim() || !productForm.sku.trim()) return;

    const sizesArr = productForm.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsEnArr = productForm.colorsEn.split(',').map(c => c.trim()).filter(Boolean);
    const colorsArArr = productForm.colorsAr.split(',').map(c => c.trim()).filter(Boolean);
    const colorsHexArr = productForm.colorsHex.split(',').map(c => c.trim()).filter(Boolean);

    const colorsObj = colorsEnArr.map((enName, idx) => ({
      name: { en: enName, ar: colorsArArr[idx] || enName },
      hex: colorsHexArr[idx] || '#222222',
      value: enName.toLowerCase().replace(/\s+/g, '-'),
    }));

    // Generate inventory keys
    const inventory: Record<string, number> = {};
    sizesArr.forEach(size => {
      colorsObj.forEach(col => {
        const key = `${size}_${col.value}`;
        inventory[key] = editingProduct?.inventory[key] ?? productForm.stockPerVariant;
      });
    });

    const totalStock = Object.values(inventory).reduce((s, v) => s + v, 0);

    const payload = {
      sku: productForm.sku,
      name: { en: productForm.nameEn, ar: productForm.nameAr || productForm.nameEn },
      description: { en: productForm.descriptionEn, ar: productForm.descriptionAr || productForm.descriptionEn },
      category: productForm.category,
      price: Number(productForm.price),
      compareAtPrice: Number(productForm.compareAtPrice) || null,
      images: [productForm.imageUrl],
      sizes: sizesArr,
      colors: colorsObj,
      inventory,
      totalStock,
      status: productForm.status,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      fabric: { en: '100% Heavyweight Egyptian Cotton (450 GSM)', ar: '١٠٠٪ قطن مصري ثقيل ٤٥٠ جرام' },
      care: { en: 'Cold wash inside out', ar: 'غسيل بماء بارد على المقلوب' },
      fit: { en: 'Boxy Oversized Fit', ar: 'قصة بوكسي أوفرسايز' },
    };

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates: payload, adminOperator: 'Admin' }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Product "${productForm.nameEn}" updated successfully`, 'success');
        }
      } else {
        // Create
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product: payload, adminOperator: 'Admin' }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Product "${productForm.nameEn}" created successfully`, 'success');
        }
      }
      setIsProductModalOpen(false);
      fetchAllAdminData();
      storeRefreshProducts();
    } catch {
      showToast('Error saving product', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Product "${name}" deleted.`, 'info');
        fetchAllAdminData();
        storeRefreshProducts();
      }
    } catch {
      showToast('Error deleting product', 'error');
    }
  };

  // Create Discount
  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountForm.code.trim()) return;

    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discount: {
            code: discountForm.code,
            discountType: discountForm.type,
            value: Number(discountForm.value),
            minOrderAmount: Number(discountForm.minOrder),
            isActive: true,
            maxUses: 500,
            description: {
              en: discountForm.descEn || `${discountForm.value}${discountForm.type === 'percentage' ? '%' : ' EGP'} off`,
              ar: discountForm.descAr || `خصم ${discountForm.value}`,
            },
          },
          adminOperator: 'Admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Promo code ${discountForm.code} created!`, 'success');
        setIsDiscountModalOpen(false);
        fetchAllAdminData();
      }
    } catch {
      showToast('Failed to create discount', 'error');
    }
  };

  // Toggle Discount Active
  const handleToggleDiscount = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/discounts/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminOperator: 'Admin' }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscounts(prev => prev.map(d => (d.id === id ? data.discount : d)));
        showToast(`Discount ${data.discount.code} toggled`, 'info');
      }
    } catch {
      showToast('Error toggling coupon', 'error');
    }
  };

  // Update Shipping Rate
  const handleUpdateShippingRate = async (id: string, newCost: number) => {
    try {
      const res = await fetch(`/api/admin/shipping-rates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cost: newCost, adminOperator: 'Admin' }),
      });
      const data = await res.json();
      if (data.success) {
        setShippingRates(prev => prev.map(r => (r.id === id ? data.rate : r)));
        showToast('Shipping rate updated successfully', 'success');
      }
    } catch {
      showToast('Error updating shipping rate', 'error');
    }
  };

  // Change Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('New passwords do not match. Please re-enter.');
      return;
    }
    if (newPasswordInput.length < 4) {
      setPasswordChangeError('New password must be at least 4 characters.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordChangeSuccess('Admin password updated successfully! Please use this new password next time you sign in.');
        showToast('Password updated successfully!', 'success');
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        fetchAllAdminData();
      } else {
        setPasswordChangeError(data.error || 'Failed to update admin password.');
      }
    } catch {
      setPasswordChangeError('Network error while updating password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // If Not Logged In: Render Login View
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-neutral-900 border border-neutral-800 rounded-full text-white mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-white">
              NOVA WEAR Operations
            </h1>
            <p className="text-xs text-neutral-400">
              Sign in to access inventory, orders, and store operations
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-300">Admin Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3.5 py-2.5 text-white font-mono focus:outline-hidden focus:border-neutral-500"
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{loginError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Operations'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Orders for the Table
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.shippingAddress.governorate.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            Operations & Logistics Suite
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-0.5">
            NOVA WEAR HQ Cairo
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Operations & Logistics Control Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('security')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded border transition-colors ${
              currentTab === 'security'
                ? 'bg-white text-black border-white'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
            }`}
            title="Change Admin Password"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Change Password</span>
          </button>
          <button
            onClick={fetchAllAdminData}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded border border-neutral-800 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold rounded border border-neutral-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-900 text-xs font-semibold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'discounts', label: `Discounts (${discounts.length})`, icon: Tag },
          { id: 'shipping', label: 'Shipping & Regions', icon: Truck },
          { id: 'inquiries', label: `Messages (${inquiries.filter(i => i.status === 'unread').length})`, icon: MessageSquare },
          { id: 'audit', label: 'Audit Log', icon: ShieldAlert },
          { id: 'security', label: 'Password & Security', icon: Key },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {currentTab === 'overview' && analytics && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-neutral-950 rounded-lg border border-neutral-850">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="text-2xl font-black font-mono text-white mt-1 tabular-nums">
                {formatPrice(analytics.totalRevenue)}
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 block">
                From {analytics.totalOrders} total orders
              </span>
            </div>

            <div className="p-5 bg-neutral-950 rounded-lg border border-neutral-850">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Avg. Order Value (AOV)
              </span>
              <div className="text-2xl font-black font-mono text-white mt-1 tabular-nums">
                {formatPrice(analytics.avgOrderValue)}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Basket size metric
              </span>
            </div>

            <div className="p-5 bg-neutral-950 rounded-lg border border-neutral-850">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Pending Shipments
              </span>
              <div className="text-2xl font-black font-mono text-amber-300 mt-1 tabular-nums">
                {analytics.pendingShipments}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Require picking / dispatch
              </span>
            </div>

            <div className="p-5 bg-neutral-950 rounded-lg border border-neutral-850">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Low Stock Alerts
              </span>
              <div className="text-2xl font-black font-mono text-orange-400 mt-1 tabular-nums">
                {analytics.lowStockCount}
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Items with &le; 15 units left
              </span>
            </div>
          </div>

          {/* Regional Sales Breakdown & Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-neutral-950 rounded-lg border border-neutral-850 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Orders by Egyptian Governorate
              </h3>
              <div className="space-y-2.5 text-xs font-mono">
                {Object.entries(analytics.governorateCounts || {}).map(([gov, count]: [string, any]) => (
                  <div key={gov} className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-neutral-300">{gov}</span>
                    <span className="text-white font-bold tabular-nums">{count} orders</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-neutral-950 rounded-lg border border-neutral-850 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Order Status Distribution
              </h3>
              <div className="space-y-2.5 text-xs font-mono">
                {Object.entries(analytics.statusCounts || {}).map(([status, count]: [string, any]) => (
                  <div key={status} className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-neutral-300 uppercase">{status}</span>
                    <span className="text-white font-bold tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {currentTab === 'orders' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  placeholder="Search Order ID, customer, phone..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white pl-8 placeholder-neutral-500 focus:outline-hidden focus:border-neutral-500"
                />
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute top-2.5 left-2.5" />
              </div>

              {/* Status Filter */}
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded px-3 py-2 focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>

            {/* CSV Export Button */}
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded border border-neutral-800 transition-colors flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Orders Table */}
          <div className="bg-neutral-950 border border-neutral-850 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 font-mono uppercase tracking-wider text-neutral-400 bg-neutral-900/40">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Governorate</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-neutral-500">
                      No orders match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white">{order.id}</td>
                      <td className="py-3 px-4 text-neutral-400 font-mono">
                        {new Date(order.createdAt).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{order.customer.fullName}</p>
                        <p className="text-neutral-500 font-mono text-[11px]">{order.customer.phone}</p>
                      </td>
                      <td className="py-3 px-4 text-neutral-300">{order.shippingAddress.governorate}</td>
                      <td className="py-3 px-4 text-neutral-400">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} pcs
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="uppercase text-[11px] font-mono text-neutral-400">
                          {order.paymentMethod === 'cod' ? 'COD' : 'DEMO CARD'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : order.status === 'processing'
                              ? 'bg-purple-950 text-purple-400 border border-purple-800'
                              : order.status === 'confirmed'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-neutral-900 text-neutral-300 border border-neutral-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewOrderStatus(order.status);
                            setOrderCarrier(order.carrier || '');
                            setOrderTrackingNo(order.trackingNumber || '');
                          }}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded transition-colors"
                          title="Manage Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS & INVENTORY */}
      {currentTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Catalog & Variant Inventory
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Manage streetwear models, pricing, sizes, and stock limits
              </p>
            </div>
            <button
              onClick={openNewProductModal}
              className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Streetwear Piece</span>
            </button>
          </div>

          <div className="bg-neutral-950 border border-neutral-850 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 font-mono uppercase tracking-wider text-neutral-400 bg-neutral-900/40">
                  <th className="py-3 px-4">Piece</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Sizes</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name.en}
                        className="w-10 h-12 object-cover rounded bg-neutral-900"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-semibold text-white">{product.name.en}</p>
                        <p className="text-neutral-500 text-[11px]">{product.name.ar}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-300">{product.sku}</td>
                    <td className="py-3 px-4 uppercase text-neutral-400 font-mono">{product.category}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-400">
                      {product.sizes.join(', ')}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <span
                        className={`font-bold ${
                          product.totalStock <= 15 ? 'text-orange-400' : 'text-emerald-400'
                        }`}
                      >
                        {product.totalStock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase text-[11px] font-mono font-semibold text-neutral-300">
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProductModal(product)}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded"
                          title="Edit Piece"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name.en)}
                          className="p-1.5 bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 rounded"
                          title="Delete Piece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DISCOUNTS MANAGEMENT */}
      {currentTab === 'discounts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Promotional Discount Codes
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Create campaigns and manage promotional codes
              </p>
            </div>
            <button
              onClick={() => setIsDiscountModalOpen(true)}
              className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discounts.map(disc => (
              <div
                key={disc.id}
                className="p-5 bg-neutral-950 border border-neutral-850 rounded-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black font-mono text-white tracking-wider">
                    {disc.code}
                  </span>
                  <button
                    onClick={() => handleToggleDiscount(disc.id)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
                      disc.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                    }`}
                  >
                    {disc.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="space-y-1 text-xs text-neutral-300">
                  <p>
                    Discount: <span className="font-bold text-white font-mono">{disc.value}{disc.discountType === 'percentage' ? '%' : ' EGP'}</span>
                  </p>
                  <p>
                    Min Order: <span className="font-mono">{formatPrice(disc.minOrderAmount)}</span>
                  </p>
                  <p className="text-neutral-500 font-mono">
                    Redeemed: {disc.usageCount} times
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SHIPPING RATES & REGIONS */}
      {currentTab === 'shipping' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Egyptian Regional Shipping Configuration
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Configure courier delivery fees across all 27 governorates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shippingRates.map(rate => (
              <div
                key={rate.id}
                className="p-5 bg-neutral-950 border border-neutral-850 rounded-lg space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white uppercase text-sm">
                    {rate.name.en}
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={rate.cost}
                      onBlur={e => handleUpdateShippingRate(rate.id, Number(e.target.value))}
                      className="w-20 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs font-mono font-bold text-white text-right"
                    />
                    <span className="font-mono text-neutral-400">EGP</span>
                  </div>
                </div>

                <p className="text-neutral-400">
                  Delivery SLA: <span className="text-white font-medium">{rate.deliveryDays.en}</span>
                </p>

                <div className="pt-2 border-t border-neutral-900">
                  <span className="text-[11px] text-neutral-500 uppercase font-mono block mb-1">
                    Governorates Covered:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {rate.governorates.map(gov => (
                      <span
                        key={gov}
                        className="px-2 py-0.5 bg-neutral-900 text-neutral-300 rounded text-[10px] font-mono"
                      >
                        {gov}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOMER INQUIRIES */}
      {currentTab === 'inquiries' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Customer Contact Inquiries
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Messages submitted from the website Contact page
            </p>
          </div>

          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-xs">
                No customer messages currently in queue.
              </div>
            ) : (
              inquiries.map(inq => (
                <div
                  key={inq.id}
                  className="p-5 bg-neutral-950 border border-neutral-850 rounded-lg space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{inq.subject || 'General Inquiry'}</span>
                    <span className="font-mono text-neutral-500 text-[11px]">
                      {new Date(inq.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-neutral-400 font-mono">
                    <span>From: {inq.name}</span>
                    {inq.phone && <span>Phone: {inq.phone}</span>}
                    {inq.email && <span>Email: {inq.email}</span>}
                  </div>
                  <p className="text-neutral-300 pt-2 border-t border-neutral-900 leading-relaxed">
                    {inq.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOG */}
      {currentTab === 'audit' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Security & Operations Audit Trail
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Chronological log of administrative state changes and order activities
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-850 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 font-mono uppercase tracking-wider text-neutral-400 bg-neutral-900/40">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target</th>
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 font-mono">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-neutral-900/40">
                    <td className="py-2.5 px-4 text-neutral-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-white">{log.action}</td>
                    <td className="py-2.5 px-4 text-neutral-300">{log.targetId}</td>
                    <td className="py-2.5 px-4 text-neutral-400">Admin</td>
                    <td className="py-2.5 px-4 text-neutral-300 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: SECURITY & PASSWORD */}
      {currentTab === 'security' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Administrator Password & Security
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Change the master password used to unlock this operations panel
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
              <KeyRound className="w-5 h-5 text-neutral-300 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-white block">Security & Access Control</span>
                <span className="text-neutral-400">
                  Enter your current password to set a new custom master password (min. 4 characters).
                </span>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-300">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPasswordInput}
                    onChange={e => setCurrentPasswordInput(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3.5 py-2.5 text-white font-mono focus:outline-hidden focus:border-neutral-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-300">
                  New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPasswordInput}
                    onChange={e => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password (min. 4 characters)"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3.5 py-2.5 text-white font-mono focus:outline-hidden focus:border-neutral-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-300">
                  Confirm New Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={e => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3.5 py-2.5 text-white font-mono focus:outline-hidden focus:border-neutral-500"
                />
              </div>

              {passwordChangeError && (
                <div className="p-3 bg-red-950/40 border border-red-800/80 rounded flex items-center gap-2 text-red-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{passwordChangeError}</span>
                </div>
              )}

              {passwordChangeSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded flex items-center gap-2 text-emerald-300">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{passwordChangeSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 shadow-md"
              >
                {isChangingPassword ? 'Updating Password...' : 'Save & Update Admin Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-neutral-950 border border-neutral-800 rounded-lg max-w-2xl w-full p-6 text-neutral-100 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Manage Order</span>
                <h3 className="text-xl font-black font-mono text-white">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-900/40 p-4 rounded border border-neutral-850">
              <div>
                <span className="font-semibold text-neutral-400 uppercase block mb-1">Customer</span>
                <p className="font-bold text-white">{selectedOrder.customer.fullName}</p>
                <p className="text-neutral-300 font-mono">{selectedOrder.customer.phone}</p>
                <p className="text-neutral-400">{selectedOrder.customer.email}</p>
              </div>

              <div>
                <span className="font-semibold text-neutral-400 uppercase block mb-1">Address</span>
                <p className="text-white">
                  {selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.city},{' '}
                  {selectedOrder.shippingAddress.governorate}
                </p>
                {selectedOrder.shippingAddress.deliveryNotes && (
                  <p className="text-neutral-400 italic mt-1">
                    Landmark: {selectedOrder.shippingAddress.deliveryNotes}
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-neutral-400 uppercase block">Items ({selectedOrder.items.length})</span>
              <div className="divide-y divide-neutral-900 border border-neutral-850 rounded p-2 bg-neutral-900/20">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="py-2 first:pt-0 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{item.name.en}</p>
                      <span className="text-neutral-500 font-mono text-[11px]">
                        {item.size} · {item.color} · Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-mono text-white font-bold tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Change Form */}
            <div className="p-4 bg-neutral-900/50 rounded border border-neutral-850 space-y-4 text-xs">
              <span className="font-bold uppercase text-white block">Update Order Status</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400">Order Status</label>
                  <select
                    value={newOrderStatus}
                    onChange={e => setNewOrderStatus(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400">Courier Partner</label>
                  <input
                    type="text"
                    value={orderCarrier}
                    onChange={e => setOrderCarrier(e.target.value)}
                    placeholder="e.g. Bosta / Mylerz"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-400">Courier Tracking Number (AWB)</label>
                  <input
                    type="text"
                    value={orderTrackingNo}
                    onChange={e => setOrderTrackingNo(e.target.value)}
                    placeholder="e.g. EGY-CAI-99201"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-400">Internal Audit Note</label>
                  <input
                    type="text"
                    value={orderNote}
                    onChange={e => setOrderNote(e.target.value)}
                    placeholder="e.g. Verified stock and handed to morning dispatch batch"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-300 text-xs font-semibold rounded hover:bg-neutral-800"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUpdateOrderStatus}
                  className="px-5 py-2 bg-white text-black text-xs font-bold uppercase rounded hover:bg-neutral-200"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Create / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            onClick={() => setIsProductModalOpen(false)}
          />
          <div className="relative bg-neutral-950 border border-neutral-800 rounded-lg max-w-2xl w-full p-6 text-neutral-100 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
              <h3 className="text-base font-bold uppercase tracking-wider text-white">
                {editingProduct ? 'Edit Streetwear Piece' : 'Add New Streetwear Piece'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">SKU</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Category</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                  >
                    <option value="hoodies">Hoodies</option>
                    <option value="tees">Oversized Tees</option>
                    <option value="pants">Pants & Cargo</option>
                    <option value="jackets">Outerwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">English Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameEn}
                    onChange={e => setProductForm({ ...productForm, nameEn: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Arabic Name</label>
                  <input
                    type="text"
                    value={productForm.nameAr}
                    onChange={e => setProductForm({ ...productForm, nameAr: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Price (EGP)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Compare At Price (EGP)</label>
                  <input
                    type="number"
                    value={productForm.compareAtPrice}
                    onChange={e => setProductForm({ ...productForm, compareAtPrice: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-300 font-semibold">Product Image URL / Asset</label>
                  <input
                    type="text"
                    value={productForm.imageUrl}
                    onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-300 font-semibold">Available Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={productForm.sizes}
                    onChange={e => setProductForm({ ...productForm, sizes: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-300 font-semibold">Color Names (comma separated)</label>
                  <input
                    type="text"
                    value={productForm.colorsEn}
                    onChange={e => setProductForm({ ...productForm, colorsEn: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-neutral-300 font-semibold">English Description</label>
                  <textarea
                    rows={2}
                    value={productForm.descriptionEn}
                    onChange={e => setProductForm({ ...productForm, descriptionEn: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-300 text-xs font-semibold rounded hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black text-xs font-bold uppercase rounded hover:bg-neutral-200"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discount Creator Modal */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            onClick={() => setIsDiscountModalOpen(false)}
          />
          <div className="relative bg-neutral-950 border border-neutral-800 rounded-lg max-w-md w-full p-6 text-neutral-100 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Create Promo Code</h3>
              <button onClick={() => setIsDiscountModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDiscount} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold">Code Name (e.g. SUMMER15)</label>
                <input
                  type="text"
                  required
                  value={discountForm.code}
                  onChange={e => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Type</label>
                  <select
                    value={discountForm.type}
                    onChange={e => setDiscountForm({ ...discountForm, type: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (EGP)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Value</label>
                  <input
                    type="number"
                    required
                    value={discountForm.value}
                    onChange={e => setDiscountForm({ ...discountForm, value: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold">Minimum Order Spend (EGP)</label>
                <input
                  type="number"
                  value={discountForm.minOrder}
                  onChange={e => setDiscountForm({ ...discountForm, minOrder: Number(e.target.value) })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-300 text-xs font-semibold rounded hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black text-xs font-bold uppercase rounded hover:bg-neutral-200"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
