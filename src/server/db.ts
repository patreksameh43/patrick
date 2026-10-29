import fs from 'fs';
import path from 'path';
import type {
  Product,
  Order,
  DiscountCode,
  GovernorateRate,
  CustomerInquiry,
  AuditLog,
  StoreSettings,
  OrderStatus,
} from '../types/index.ts';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  discounts: DiscountCode[];
  shippingRates: GovernorateRate[];
  inquiries: CustomerInquiry[];
  auditLogs: AuditLog[];
  settings: StoreSettings;
  adminPassword?: string;
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'store.json');

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'NV-HD-001',
    name: {
      en: 'Heavyweight Anubis Hoodie',
      ar: 'هودي أنوبيس ثقيل الوزن',
    },
    description: {
      en: 'Structured boxy silhouette cut from 480 GSM Egyptian combed cotton French terry. Features double-layered hood without drawstrings, raw finished cuffs, and subtle tonal back embroidery.',
      ar: 'قصة بوكسي مميزة مصنوعة من قطن مصري ممشط فاخر ٤٨٠ جرام مع بطانة فرينش تيري. كابيشون مزدوج بدون حبال، أطراف متينة وتطريز خلفي ناعم مستوحى من التراث المصري.',
    },
    category: 'hoodies',
    price: 1850,
    compareAtPrice: 2200,
    images: [
      '/src/assets/images/hoodie_anubis_black_1793126087782.jpg',
      '/src/assets/images/hero_banner_editorial_1793126087849.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: { en: 'Onyx Black', ar: 'أسود فحمي' }, hex: '#121212', value: 'onyx-black' },
      { name: { en: 'Concrete Gray', ar: 'رمادي خرساني' }, hex: '#373737', value: 'concrete-gray' },
    ],
    inventory: {
      'S_onyx-black': 8,
      'M_onyx-black': 14,
      'L_onyx-black': 12,
      'XL_onyx-black': 6,
      'XXL_onyx-black': 3,
      'S_concrete-gray': 5,
      'M_concrete-gray': 9,
      'L_concrete-gray': 7,
      'XL_concrete-gray': 4,
      'XXL_concrete-gray': 2,
    },
    totalStock: 70,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    fabric: {
      en: '100% Ultra-Heavy Egyptian Combed Cotton (480 GSM)',
      ar: '١٠٠٪ قطن مصري ممشط فائق الثقل (٤٨٠ جرام/م²)',
    },
    care: {
      en: 'Cold machine wash inside out. Do not tumble dry. Iron on reverse.',
      ar: 'غسيل آلي بماء بارد على الوجه المقلوب. تجنب التجفيف الآلي. كوي على الظهر.',
    },
    fit: {
      en: 'Extreme Oversized Boxy Streetwear Cut',
      ar: 'قصة أوفرسايز بوكسي عريضة مستوحاة من أزياء الشارع',
    },
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-25T14:30:00.000Z',
  },
  {
    id: 'prod-002',
    sku: 'NV-PT-002',
    name: {
      en: 'Sandstone Tactical Cargo Pants',
      ar: 'بنطلون كارجو تكتيكي رملي',
    },
    description: {
      en: 'Engineered utility pants featuring 8 articulated 3D pockets, reinforced knee darting, adjustable nylon webbing strap system, and matte silver carabiner hardware. Cut from heavy Egyptian cotton drill.',
      ar: 'بنطلون عملي مجهز بـ ٨ جيوب تكتيكية بارزة، خياطة ركبة مدعمة، أربطة نايلون قابلة للضبط وإكسسوارات معدنية غير لامعة. مصنوع من قماش الدريل القطني المصري القوي.',
    },
    category: 'pants',
    price: 1950,
    compareAtPrice: 2350,
    images: [
      '/src/assets/images/cargo_pants_sand_1793126088834.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: { en: 'Sandstone Beige', ar: 'بيج رملي' }, hex: '#D2B48C', value: 'sandstone' },
      { name: { en: 'Tactical Black', ar: 'أسود تكتيكي' }, hex: '#18181B', value: 'tactical-black' },
    ],
    inventory: {
      'S_sandstone': 6,
      'M_sandstone': 11,
      'L_sandstone': 9,
      'XL_sandstone': 4,
      'S_tactical-black': 7,
      'M_tactical-black': 12,
      'L_tactical-black': 8,
      'XL_tactical-black': 5,
    },
    totalStock: 62,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    fabric: {
      en: '100% Heavy Egyptian Cotton Drill Twill (360 GSM)',
      ar: '١٠٠٪ تويل دريل قطن مصري ثقيل (٣٦٠ جرام/م²)',
    },
    care: {
      en: 'Machine wash warm with like colors. Hang dry in shade.',
      ar: 'غسيل آلي بماء دافئ مع الألوان المماثلة. تجفيف في الظل.',
    },
    fit: {
      en: 'Relaxed Wide-Leg with Adjustable Ankle Bungees',
      ar: 'رجل عريضة مريحة مع حبال مطاطية سفلية قابلة للتحكم',
    },
    createdAt: '2026-10-05T12:00:00.000Z',
    updatedAt: '2026-10-26T09:15:00.000Z',
  },
  {
    id: 'prod-003',
    sku: 'NV-TE-003',
    name: {
      en: 'Brutalist Drop-Shoulder Tee',
      ar: 'تيشيرت دروب شولدر بروتاليست',
    },
    description: {
      en: 'Ultra-dense 280 GSM single jersey cotton tee. Cut with drastic drop shoulders, thick 1.25" ribbed collar that stays rigid after washing, and minimalist high-density tonal chest silicone branding.',
      ar: 'تيشيرت قطني فائق الكثافة ٢٨٠ جرام. قصة أكتاف ساقطة مميزة، ياقة مضلعة سميكة تحتفظ بقوامها بعد الغسيل المتكرر، وطباعة سيليكون حرارية ناعمة على الصدر.',
    },
    category: 'tees',
    price: 950,
    compareAtPrice: 1150,
    images: [
      '/src/assets/images/oversized_tee_white_1793126088680.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: { en: 'Chalk White', ar: 'أبيض طباشيري' }, hex: '#F4F4F5', value: 'chalk-white' },
      { name: { en: 'Washed Charcoal', ar: 'رمادي مغسول' }, hex: '#27272A', value: 'washed-charcoal' },
    ],
    inventory: {
      'S_chalk-white': 15,
      'M_chalk-white': 25,
      'L_chalk-white': 20,
      'XL_chalk-white': 12,
      'XXL_chalk-white': 6,
      'S_washed-charcoal': 10,
      'M_washed-charcoal': 18,
      'L_washed-charcoal': 15,
      'XL_washed-charcoal': 8,
      'XXL_washed-charcoal': 4,
    },
    totalStock: 133,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    fabric: {
      en: '100% Giza Long-Staple Combed Cotton (280 GSM)',
      ar: '١٠٠٪ قطن جيزة طويل التيلة ممشط (٢٨٠ جرام/م²)',
    },
    care: {
      en: 'Machine wash cold. Do not bleach. Lay flat to dry.',
      ar: 'غسيل بماء بارد. ممنوع استخدام المبيض. يجفف مفروداً.',
    },
    fit: {
      en: 'Boxy Drop-Shoulder Relaxed Fit',
      ar: 'قصة بوكسي مريحة بأكتاف ساقطة',
    },
    createdAt: '2026-10-08T14:00:00.000Z',
    updatedAt: '2026-10-24T18:00:00.000Z',
  },
  {
    id: 'prod-004',
    sku: 'NV-JK-004',
    name: {
      en: 'Nile Delta Bomber Jacket',
      ar: 'جاكيت بومبر دلتا النيل التقني',
    },
    description: {
      en: 'Cropped technical streetwear bomber constructed with matte waterproof shell and heavy satin thermal lining. Features heavy gauge YKK two-way gunmetal zip, 3D sleeve utility pocket, and ribbed wool hem.',
      ar: 'جاكيت بومبر تقني قصير مقاوم لرذاذ الماء مع بطانة ستان حرارية دافئة. سحاب معدني ثنائي الاتجاه من YKK فائق المتانة، جيب كم ثلاثي الأبعاد وأساور صوفية مضلعة.',
    },
    category: 'jackets',
    price: 2650,
    compareAtPrice: 3200,
    images: [
      '/src/assets/images/bomber_jacket_olive_1793126089413.jpg',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: { en: 'Egyptian Olive', ar: 'زيتي مصري' }, hex: '#4A533E', value: 'egyptian-olive' },
      { name: { en: 'Stealth Black', ar: 'أسود غير لامع' }, hex: '#1C1917', value: 'stealth-black' },
    ],
    inventory: {
      'M_egyptian-olive': 8,
      'L_egyptian-olive': 10,
      'XL_egyptian-olive': 5,
      'M_stealth-black': 9,
      'L_stealth-black': 11,
      'XL_stealth-black': 6,
    },
    totalStock: 49,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    fabric: {
      en: 'Water-Repellent Technical Nylon-Cotton Shell with Thermolite Fill',
      ar: 'قماش خارجي تقني من القطن والنايلون المقاوم للماء مع حشوة عازلة',
    },
    care: {
      en: 'Professional dry clean only.',
      ar: 'تنظيف جاف متخصص فقط.',
    },
    fit: {
      en: 'Cropped Body with Oversized Articulated Sleeves',
      ar: 'طول قصير مع أكمام فضفاضة مقوسة بحرفية',
    },
    createdAt: '2026-10-12T16:00:00.000Z',
    updatedAt: '2026-10-27T08:00:00.000Z',
  },
  {
    id: 'prod-005',
    sku: 'NV-HD-005',
    name: {
      en: 'Cairo Archive Heritage Hoodie',
      ar: 'هودي أرشيف القاهرة التراثي',
    },
    description: {
      en: 'Celebrating the raw concrete and urban heartbeat of downtown Cairo. Acid-washed finish gives unique vintage patina. Arabic & English typographic screenprint with raised puff ink details.',
      ar: 'تصميم يحتفي بجمال عمارة وسط البلد الخرسانية ونبض شوارع القاهرة. غسيل أسيد يعطي تأثيراً فينتاج فريداً مع طباعة عربية وإنجليزية بحبر بارز عالي الجودة.',
    },
    category: 'hoodies',
    price: 1950,
    compareAtPrice: 2400,
    images: [
      '/src/assets/images/hero_banner_editorial_1793126087849.jpg',
      '/src/assets/images/hoodie_anubis_black_1793126087782.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: { en: 'Vintage Black', ar: 'أسود معتق' }, hex: '#1C1917', value: 'vintage-black' },
    ],
    inventory: {
      'S_vintage-black': 6,
      'M_vintage-black': 14,
      'L_vintage-black': 10,
      'XL_vintage-black': 4,
    },
    totalStock: 34,
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    fabric: {
      en: '500 GSM Heavyweight Terry Brushed Cotton',
      ar: '٥٠٠ جرام تيري قطن مصري مبطن فائق الثقل',
    },
    care: {
      en: 'Wash inside out with cold water. Iron low avoiding print.',
      ar: 'غسيل على الوجه المقلوب بماء بارد. كوي بحرارة منخفضة بعيداً عن الطباعة.',
    },
    fit: {
      en: 'Signature Archival Oversized',
      ar: 'قصة أرشيفية أوفرسايز رحبة',
    },
    createdAt: '2026-10-15T09:00:00.000Z',
    updatedAt: '2026-10-27T07:40:00.000Z',
  },
  {
    id: 'prod-006',
    sku: 'NV-TE-006',
    name: {
      en: 'Hieroglyph Cybernetic Tee',
      ar: 'تيشيرت الرموز السيبرانية',
    },
    description: {
      en: 'Futuristic streetwear graphic blending ancient Egyptian iconography with cyber-brutalist typography. Relaxed drop shoulder silhouette in heavyweight 300 GSM pure cotton.',
      ar: 'رسومات عصرية تدمج الرموز المصرية العريقة مع خطوط مستقبلية جريئة. قصة أكتاف ساقطة مريحة من القطن الخالص بوزن ٣٠٠ جرام.',
    },
    category: 'tees',
    price: 980,
    compareAtPrice: 1200,
    images: [
      '/src/assets/images/oversized_tee_white_1793126088680.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: { en: 'Raw Chalk', ar: 'طباشيري نقي' }, hex: '#E5E5E5', value: 'raw-chalk' },
      { name: { en: 'Jet Black', ar: 'أسود حالك' }, hex: '#0A0A0A', value: 'jet-black' },
    ],
    inventory: {
      'S_raw-chalk': 8,
      'M_raw-chalk': 12,
      'L_raw-chalk': 10,
      'XL_raw-chalk': 5,
      'S_jet-black': 9,
      'M_jet-black': 15,
      'L_jet-black': 11,
      'XL_jet-black': 4,
    },
    totalStock: 74,
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    fabric: {
      en: '100% Ring-Spun Egyptian Cotton (300 GSM)',
      ar: '١٠٠٪ قطن مصري مغزول حلقياً (٣٠٠ جرام)',
    },
    care: {
      en: 'Gentle cycle, hang dry.',
      ar: 'دورة غسيل هادئة، تجفيف بالتعليق.',
    },
    fit: {
      en: 'Boxy Heavyweight Cut',
      ar: 'قصة بوكسي ثقيلة متوازنة',
    },
    createdAt: '2026-10-18T11:00:00.000Z',
    updatedAt: '2026-10-26T16:00:00.000Z',
  },
];

const INITIAL_SHIPPING_RATES: GovernorateRate[] = [
  {
    id: 'rate-cairo-giza',
    name: {
      en: 'Greater Cairo & Giza',
      ar: 'القاهرة الكبرى والجيزة',
    },
    cost: 50,
    deliveryDays: {
      en: '24 - 48 Hours',
      ar: 'خلال ٢٤ - ٤٨ ساعة',
    },
    governorates: ['Cairo', 'Giza'],
  },
  {
    id: 'rate-alexandria',
    name: {
      en: 'Alexandria',
      ar: 'الإسكندرية',
    },
    cost: 65,
    deliveryDays: {
      en: '48 Hours',
      ar: 'خلال ٤٨ ساعة',
    },
    governorates: ['Alexandria'],
  },
  {
    id: 'rate-delta-canal',
    name: {
      en: 'Delta & Suez Canal',
      ar: 'محافظات الدلتا والقناة',
    },
    cost: 75,
    deliveryDays: {
      en: '2 - 3 Business Days',
      ar: 'خلال ٢ - ٣ أيام عمل',
    },
    governorates: [
      'Qalyubia',
      'Sharqia',
      'Dakahlia',
      'Gharbia',
      'Monufia',
      'Beheira',
      'Kafr El Sheikh',
      'Damietta',
      'Port Said',
      'Ismailia',
      'Suez',
    ],
  },
  {
    id: 'rate-upper-egypt',
    name: {
      en: 'Upper Egypt',
      ar: 'صعيد مصر',
    },
    cost: 90,
    deliveryDays: {
      en: '3 - 4 Business Days',
      ar: 'خلال ٣ - ٤ أيام عمل',
    },
    governorates: [
      'Fayoum',
      'Beni Suef',
      'Minya',
      'Asyut',
      'Sohag',
      'Qena',
      'Luxor',
      'Aswan',
    ],
  },
  {
    id: 'rate-frontier',
    name: {
      en: 'Red Sea & Border Governorates',
      ar: 'البحر الأحمر والمحافظات الحدودية',
    },
    cost: 110,
    deliveryDays: {
      en: '4 - 5 Business Days',
      ar: 'خلال ٤ - ٥ أيام عمل',
    },
    governorates: [
      'Red Sea',
      'South Sinai',
      'North Sinai',
      'Matrouh',
      'New Valley',
    ],
  },
];

const INITIAL_DISCOUNTS: DiscountCode[] = [
  {
    id: 'disc-001',
    code: 'NOVA10',
    discountType: 'percentage',
    value: 10,
    minOrderAmount: 1000,
    isActive: true,
    usageCount: 42,
    maxUses: 500,
    description: {
      en: '10% off on all streetwear orders over 1,000 EGP',
      ar: 'خصم ١٠٪ على جميع الطلبات الأكثر من ١,٠٠٠ ج.م',
    },
  },
  {
    id: 'disc-002',
    code: 'CAIRO20',
    discountType: 'percentage',
    value: 20,
    minOrderAmount: 2500,
    isActive: true,
    usageCount: 18,
    maxUses: 200,
    description: {
      en: '20% VIP archive discount on orders over 2,500 EGP',
      ar: 'خصم ٢٠٪ لكبار مقتني الأرشيف للطلبات فوق ٢,٥٠٠ ج.م',
    },
  },
  {
    id: 'disc-003',
    code: 'FIRSTDROP',
    discountType: 'fixed',
    value: 150,
    minOrderAmount: 1200,
    isActive: true,
    usageCount: 65,
    maxUses: 1000,
    description: {
      en: '150 EGP instant rebate on your first order over 1,200 EGP',
      ar: 'خصم فوري ١٥٠ ج.م على طلبك الأول فوق ١,٢٠٠ ج.م',
    },
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'NV-1001',
    customer: {
      fullName: 'Youssef Mansour',
      phone: '01098765432',
      email: 'youssef.mansour@gmail.com',
    },
    shippingAddress: {
      governorate: 'Cairo',
      city: 'Zamalek',
      streetAddress: '14 Brazil Street, 3rd Floor, Apt 8',
      buildingFloorApt: 'Building 14, Apt 8',
      deliveryNotes: 'Near Gezira Club gate 3',
    },
    items: [
      {
        productId: 'prod-001',
        name: { en: 'Heavyweight Anubis Hoodie', ar: 'هودي أنوبيس ثقيل الوزن' },
        size: 'L',
        color: 'Onyx Black',
        quantity: 1,
        price: 1850,
        image: '/src/assets/images/hoodie_anubis_black_1793126087782.jpg',
        sku: 'NV-HD-001-L-BLK',
      },
      {
        productId: 'prod-003',
        name: { en: 'Brutalist Drop-Shoulder Tee', ar: 'تيشيرت دروب شولدر بروتاليست' },
        size: 'L',
        color: 'Chalk White',
        quantity: 1,
        price: 950,
        image: '/src/assets/images/oversized_tee_white_1793126088680.jpg',
        sku: 'NV-TE-003-L-WHT',
      },
    ],
    subtotal: 2800,
    shippingFee: 0, // Unlocked free shipping (> 2000)
    discountAmount: 280,
    discountCodeApplied: 'NOVA10',
    total: 2520,
    currency: 'EGP',
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    status: 'delivered',
    trackingNumber: 'EGY-CAI-99201',
    carrier: 'Bosta Logistics Egypt',
    statusHistory: [
      { status: 'pending', timestamp: '2026-10-22T10:15:00Z', note: 'Order placed by customer via Cash on Delivery' },
      { status: 'confirmed', timestamp: '2026-10-22T11:00:00Z', note: 'Phone confirmation completed with customer' },
      { status: 'processing', timestamp: '2026-10-22T14:30:00Z', note: 'Picked and packed at Cairo Hub' },
      { status: 'shipped', timestamp: '2026-10-23T08:30:00Z', note: 'Dispatched with courier' },
      { status: 'delivered', timestamp: '2026-10-23T16:45:00Z', note: 'Delivered and cash collected' },
    ],
    createdAt: '2026-10-22T10:15:00.000Z',
    updatedAt: '2026-10-23T16:45:00.000Z',
  },
  {
    id: 'NV-1002',
    customer: {
      fullName: 'Nour El-Din Sherif',
      phone: '01223456789',
      email: 'nour.sherif@alexu.edu.eg',
    },
    shippingAddress: {
      governorate: 'Alexandria',
      city: 'Smouha',
      streetAddress: 'Albert Al Awal Street, Palm Towers, Block B',
      deliveryNotes: 'Call 15 minutes before arrival',
    },
    items: [
      {
        productId: 'prod-002',
        name: { en: 'Sandstone Tactical Cargo Pants', ar: 'بنطلون كارجو تكتيكي رملي' },
        size: 'M',
        color: 'Sandstone Beige',
        quantity: 1,
        price: 1950,
        image: '/src/assets/images/cargo_pants_sand_1793126088834.jpg',
        sku: 'NV-PT-002-M-SND',
      },
    ],
    subtotal: 1950,
    shippingFee: 65,
    discountAmount: 0,
    total: 2015,
    currency: 'EGP',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'shipped',
    trackingNumber: 'EGY-ALX-48190',
    carrier: 'Mylerz Express',
    statusHistory: [
      { status: 'pending', timestamp: '2026-10-25T13:20:00Z', note: 'Order created' },
      { status: 'confirmed', timestamp: '2026-10-25T14:00:00Z', note: 'Confirmed with customer' },
      { status: 'processing', timestamp: '2026-10-26T09:00:00Z', note: 'Quality check passed and packed' },
      { status: 'shipped', timestamp: '2026-10-27T08:00:00Z', note: 'Out for Alexandria regional transit' },
    ],
    createdAt: '2026-10-25T13:20:00.000Z',
    updatedAt: '2026-10-27T08:00:00.000Z',
  },
  {
    id: 'NV-1003',
    customer: {
      fullName: 'Malak Tarek',
      phone: '01155667788',
      email: 'malak.tarek@gmail.com',
    },
    shippingAddress: {
      governorate: 'Giza',
      city: 'Sheikh Zayed',
      streetAddress: 'Beverly Hills Compound, Phase 2, Villa 410',
      deliveryNotes: 'Leave with compound security if absent',
    },
    items: [
      {
        productId: 'prod-004',
        name: { en: 'Nile Delta Bomber Jacket', ar: 'جاكيت بومبر دلتا النيل التقني' },
        size: 'L',
        color: 'Egyptian Olive',
        quantity: 1,
        price: 2650,
        image: '/src/assets/images/bomber_jacket_olive_1793126089413.jpg',
        sku: 'NV-JK-004-L-OLV',
      },
    ],
    subtotal: 2650,
    shippingFee: 0,
    discountAmount: 265,
    discountCodeApplied: 'NOVA10',
    total: 2385,
    currency: 'EGP',
    paymentMethod: 'card_demo',
    paymentStatus: 'paid',
    status: 'processing',
    statusHistory: [
      { status: 'pending', timestamp: '2026-10-26T19:00:00Z', note: 'Order placed via Demo Card Gateway' },
      { status: 'confirmed', timestamp: '2026-10-26T19:30:00Z', note: 'Automated authorization verified' },
      { status: 'processing', timestamp: '2026-10-27T09:00:00Z', note: 'Preparing garments for transit' },
    ],
    createdAt: '2026-10-26T19:00:00.000Z',
    updatedAt: '2026-10-27T09:00:00.000Z',
  },
  {
    id: 'NV-1004',
    customer: {
      fullName: 'Omar Farouk',
      phone: '01011223344',
      email: 'omar.farouk@outlook.com',
    },
    shippingAddress: {
      governorate: 'Dakahlia',
      city: 'Mansoura',
      streetAddress: 'Gomhoria Street, Near Mansoura University',
      deliveryNotes: 'Building above Banque Misr',
    },
    items: [
      {
        productId: 'prod-003',
        name: { en: 'Brutalist Drop-Shoulder Tee', ar: 'تيشيرت دروب شولدر بروتاليست' },
        size: 'M',
        color: 'Chalk White',
        quantity: 2,
        price: 950,
        image: '/src/assets/images/oversized_tee_white_1793126088680.jpg',
        sku: 'NV-TE-003-M-WHT',
      },
    ],
    subtotal: 1900,
    shippingFee: 75,
    discountAmount: 0,
    total: 1975,
    currency: 'EGP',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'confirmed',
    statusHistory: [
      { status: 'pending', timestamp: '2026-10-27T07:15:00Z', note: 'Customer order placed' },
      { status: 'confirmed', timestamp: '2026-10-27T08:30:00Z', note: 'Order confirmed by operations team' },
    ],
    createdAt: '2026-10-27T07:15:00.000Z',
    updatedAt: '2026-10-27T08:30:00.000Z',
  },
  {
    id: 'NV-1005',
    customer: {
      fullName: 'Farida Hassan',
      phone: '01066778899',
      email: 'farida.hassan@yahoo.com',
    },
    shippingAddress: {
      governorate: 'Cairo',
      city: 'Maadi',
      streetAddress: 'Road 9, Degla Maadi, Building 22',
      deliveryNotes: 'Ring doorbell 4',
    },
    items: [
      {
        productId: 'prod-001',
        name: { en: 'Heavyweight Anubis Hoodie', ar: 'هودي أنوبيس ثقيل الوزن' },
        size: 'M',
        color: 'Concrete Gray',
        quantity: 1,
        price: 1850,
        image: '/src/assets/images/hoodie_anubis_black_1793126087782.jpg',
        sku: 'NV-HD-001-M-GRY',
      },
    ],
    subtotal: 1850,
    shippingFee: 50,
    discountAmount: 150,
    discountCodeApplied: 'FIRSTDROP',
    total: 1750,
    currency: 'EGP',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'pending',
    statusHistory: [
      { status: 'pending', timestamp: '2026-10-27T10:45:00Z', note: 'Order submitted by customer' },
    ],
    createdAt: '2026-10-27T10:45:00.000Z',
    updatedAt: '2026-10-27T10:45:00.000Z',
  },
];

const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-001',
    name: 'Karim Zaki',
    email: 'karim.zaki@gmail.com',
    phone: '01099887766',
    subject: 'Size fit advice for 182cm height',
    message: 'Hello, I want to order the Heavyweight Anubis Hoodie. I am 182cm and 78kg. Would you recommend size L or XL for an authentic oversized streetwear fit?',
    status: 'read',
    createdAt: '2026-10-26T15:20:00.000Z',
  },
  {
    id: 'inq-002',
    name: 'Aya Mostafa',
    email: 'aya.mostafa@outlook.com',
    phone: '01233445566',
    subject: 'Exchange request inquiry',
    message: 'Can I exchange my cargo pants for size S if the waist is slightly loose? What is the timeframe in Cairo?',
    status: 'unread',
    createdAt: '2026-10-27T09:10:00.000Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    action: 'ORDER_STATUS_UPDATE',
    targetType: 'order',
    targetId: 'NV-1002',
    details: 'Status changed from processing to shipped (Carrier: Mylerz Express, Tracking: EGY-ALX-48190)',
    adminEmail: 'operations@novawear.eg',
    timestamp: '2026-10-27T08:00:00.000Z',
  },
  {
    id: 'aud-002',
    action: 'ORDER_STATUS_UPDATE',
    targetType: 'order',
    targetId: 'NV-1004',
    details: 'Status changed from pending to confirmed',
    adminEmail: 'operations@novawear.eg',
    timestamp: '2026-10-27T08:30:00.000Z',
  },
  {
    id: 'aud-003',
    action: 'INVENTORY_ADJUSTMENT',
    targetType: 'product',
    targetId: 'prod-004',
    details: 'Stock verified for Nile Delta Bomber Jacket across M, L, XL sizes',
    adminEmail: 'inventory@novawear.eg',
    timestamp: '2026-10-27T07:45:00.000Z',
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  freeShippingThreshold: 2000,
  supportPhone: '+20 100 892 4410',
  supportEmail: 'care@novawear.eg',
  instagramHandle: '@novawear.cairo',
  storeAnnouncement: {
    en: 'FREE EXPRESS SHIPPING ACROSS ALL EGYPTIAN GOVERNORATES ON ORDERS OVER 2,000 EGP',
    ar: 'شحن سريع مجاني لجميع محافظات مصر للطلبات الأكثر من ٢٠٠٠ ج.م',
    enabled: true,
  },
  codFee: 0,
  adminPassword: '123456',
};

class StoreDatabase {
  private data: DatabaseSchema;
  private isSaving = false;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.adminPassword) {
          parsed.adminPassword = parsed.settings?.adminPassword || '123456';
        }
        return parsed;
      }
    } catch (err) {
      console.error('Error reading database file, initializing with seed data:', err);
    }

    const initialData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      discounts: INITIAL_DISCOUNTS,
      shippingRates: INITIAL_SHIPPING_RATES,
      inquiries: INITIAL_INQUIRIES,
      auditLogs: INITIAL_AUDIT_LOGS,
      settings: INITIAL_SETTINGS,
      adminPassword: '123456',
    };

    this.saveDataSync(initialData);
    return initialData;
  }

  private saveDataSync(data: DatabaseSchema) {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private persist() {
    if (this.isSaving) return;
    this.isSaving = true;
    try {
      this.saveDataSync(this.data);
    } finally {
      this.isSaving = false;
    }
  }

  // --- PRODUCTS ---
  public getProducts(filter?: { category?: string; status?: string; search?: string }): Product[] {
    let result = [...this.data.products];
    if (filter?.status) {
      result = result.filter(p => p.status === filter.status);
    } else {
      // Default to non-archived for public storefront
      result = result.filter(p => p.status !== 'archived');
    }
    if (filter?.category && filter.category !== 'all') {
      result = result.filter(p => p.category === filter.category);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.en.toLowerCase().includes(q) ||
          p.name.ar.includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getAllProductsAdmin(): Product[] {
    return [...this.data.products];
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, adminEmail: string): Product {
    const newId = `prod-${String(Date.now()).slice(-6)}`;
    const now = new Date().toISOString();
    const product: Product = {
      ...productData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    this.data.products.unshift(product);
    this.logAudit({
      action: 'PRODUCT_CREATED',
      targetType: 'product',
      targetId: newId,
      details: `Created product "${product.name.en}" (SKU: ${product.sku}) with ${product.totalStock} units`,
      adminEmail,
    });
    this.persist();
    return product;
  }

  public updateProduct(id: string, updates: Partial<Product>, adminEmail: string): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = this.data.products[index];
    const updated: Product = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Calculate total stock if inventory updated
    if (updates.inventory) {
      updated.totalStock = Object.values(updates.inventory).reduce((sum, val) => sum + val, 0);
    }

    this.data.products[index] = updated;
    this.logAudit({
      action: 'PRODUCT_UPDATED',
      targetType: 'product',
      targetId: id,
      details: `Updated product fields: ${Object.keys(updates).join(', ')}`,
      adminEmail,
    });
    this.persist();
    return updated;
  }

  public deleteProduct(id: string, adminEmail: string): boolean {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    const prod = this.data.products[index];
    this.data.products.splice(index, 1);
    this.logAudit({
      action: 'PRODUCT_DELETED',
      targetType: 'product',
      targetId: id,
      details: `Deleted product "${prod.name.en}" (SKU: ${prod.sku})`,
      adminEmail,
    });
    this.persist();
    return true;
  }

  // --- ORDERS ---
  public getOrders(filter?: { status?: string; search?: string }): Order[] {
    let result = [...this.data.orders];
    if (filter?.status && filter.status !== 'all') {
      result = result.filter(o => o.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.customer.email.toLowerCase().includes(q) ||
          o.shippingAddress.governorate.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id.toLowerCase() === id.toLowerCase());
  }

  public getOrdersByCustomerPhone(phone: string): Order[] {
    const cleanPhone = phone.replace(/\s+/g, '');
    return this.data.orders.filter(o => o.customer.phone.replace(/\s+/g, '') === cleanPhone);
  }

  public createOrder(orderInput: {
    customer: Order['customer'];
    shippingAddress: Order['shippingAddress'];
    items: { productId: string; size: string; color: string; colorValue: string; quantity: number }[];
    discountCode?: string;
    paymentMethod: 'cod' | 'card_demo';
    notes?: string;
  }): { success: boolean; order?: Order; error?: string } {
    // 1. Validate customer & address
    if (!orderInput.customer.fullName?.trim() || !orderInput.customer.phone?.trim()) {
      return { success: false, error: 'Full name and valid mobile number are required.' };
    }
    if (!orderInput.shippingAddress.governorate || !orderInput.shippingAddress.streetAddress?.trim()) {
      return { success: false, error: 'Governorate and street address are required.' };
    }
    if (!orderInput.items || orderInput.items.length === 0) {
      return { success: false, error: 'Order must contain at least one piece.' };
    }

    // 2. Server-side stock verification & inventory lock
    const verifiedItems: Order['items'] = [];
    let subtotal = 0;

    for (const reqItem of orderInput.items) {
      const product = this.data.products.find(p => p.id === reqItem.productId);
      if (!product) {
        return { success: false, error: `Product ID "${reqItem.productId}" not found.` };
      }
      if (product.status !== 'active') {
        return { success: false, error: `Product "${product.name.en}" is currently unavailable.` };
      }

      const variantKey = `${reqItem.size}_${reqItem.colorValue}`;
      const availableStock = product.inventory[variantKey] ?? 0;

      if (availableStock < reqItem.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${product.name.en}" (${reqItem.size} / ${reqItem.color}). Available: ${availableStock}, Requested: ${reqItem.quantity}.`,
        };
      }

      const itemTotal = product.price * reqItem.quantity;
      subtotal += itemTotal;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        size: reqItem.size,
        color: reqItem.color,
        quantity: reqItem.quantity,
        price: product.price,
        image: product.images[0] || '/src/assets/images/hoodie_anubis_black_1793126087782.jpg',
        sku: `${product.sku}-${reqItem.size}`,
      });
    }

    // 3. Calculate shipping based on governorate & store threshold
    let shippingFee = 60; // default fallback
    for (const rateGroup of this.data.shippingRates) {
      if (rateGroup.governorates.some(gov => gov.toLowerCase() === orderInput.shippingAddress.governorate.toLowerCase())) {
        shippingFee = rateGroup.cost;
        break;
      }
    }
    if (subtotal >= this.data.settings.freeShippingThreshold) {
      shippingFee = 0;
    }

    // 4. Calculate discount if applied
    let discountAmount = 0;
    let appliedCode: string | undefined;

    if (orderInput.discountCode) {
      const codeRecord = this.data.discounts.find(
        d => d.code.toUpperCase() === orderInput.discountCode?.toUpperCase() && d.isActive
      );
      if (codeRecord) {
        if (subtotal >= codeRecord.minOrderAmount) {
          if (codeRecord.discountType === 'percentage') {
            discountAmount = Math.round((subtotal * codeRecord.value) / 100);
          } else {
            discountAmount = Math.min(codeRecord.value, subtotal);
          }
          codeRecord.usageCount += 1;
          appliedCode = codeRecord.code;
        }
      }
    }

    const total = Math.max(0, subtotal + shippingFee - discountAmount);

    // 5. Decrement inventory atomically
    for (const reqItem of orderInput.items) {
      const product = this.data.products.find(p => p.id === reqItem.productId)!;
      const variantKey = `${reqItem.size}_${reqItem.colorValue}`;
      product.inventory[variantKey] = Math.max(0, (product.inventory[variantKey] || 0) - reqItem.quantity);
      product.totalStock = Object.values(product.inventory).reduce((sum, v) => sum + v, 0);
    }

    // 6. Generate order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `NV-${randomSuffix}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      customer: orderInput.customer,
      shippingAddress: orderInput.shippingAddress,
      items: verifiedItems,
      subtotal,
      shippingFee,
      discountAmount,
      discountCodeApplied: appliedCode,
      total,
      currency: 'EGP',
      paymentMethod: orderInput.paymentMethod,
      paymentStatus: orderInput.paymentMethod === 'card_demo' ? 'paid' : 'pending',
      status: 'pending',
      notes: orderInput.notes,
      statusHistory: [
        {
          status: 'pending',
          timestamp: now,
          note: `Order received via ${orderInput.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Simulated Card Gateway'}`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.data.orders.unshift(newOrder);
    this.logAudit({
      action: 'ORDER_PLACED',
      targetType: 'order',
      targetId: orderId,
      details: `New order placed by ${newOrder.customer.fullName} for ${newOrder.total} EGP (${newOrder.items.length} items)`,
      adminEmail: 'system',
    });

    this.persist();
    return { success: true, order: newOrder };
  }

  public updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    adminEmail: string,
    note?: string,
    carrier?: string,
    trackingNumber?: string
  ): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    const oldStatus = order.status;
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    if (carrier) order.carrier = carrier;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    if (newStatus === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }

    // Replenish stock if order is cancelled or returned
    if ((newStatus === 'cancelled' || newStatus === 'returned') && oldStatus !== 'cancelled' && oldStatus !== 'returned') {
      for (const item of order.items) {
        const product = this.data.products.find(p => p.id === item.productId);
        if (product) {
          // Attempt to find matching variant
          for (const color of product.colors) {
            const key = `${item.size}_${color.value}`;
            if (product.inventory[key] !== undefined) {
              product.inventory[key] += item.quantity;
              break;
            }
          }
          product.totalStock = Object.values(product.inventory).reduce((sum, v) => sum + v, 0);
        }
      }
    }

    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated from ${oldStatus} to ${newStatus}`,
      adminEmail,
    });

    this.logAudit({
      action: 'ORDER_STATUS_UPDATE',
      targetType: 'order',
      targetId: orderId,
      details: `Status updated from ${oldStatus} to ${newStatus}${note ? `: ${note}` : ''}`,
      adminEmail,
    });

    this.persist();
    return order;
  }

  // --- DISCOUNTS ---
  public getDiscounts(): DiscountCode[] {
    return [...this.data.discounts];
  }

  public validateDiscount(code: string, subtotal: number): { valid: boolean; discount?: DiscountCode; discountAmount?: number; error?: string } {
    const found = this.data.discounts.find(
      d => d.code.toUpperCase() === code.trim().toUpperCase() && d.isActive
    );
    if (!found) {
      return { valid: false, error: 'Invalid or expired promo code.' };
    }
    if (found.maxUses !== null && found.usageCount >= found.maxUses) {
      return { valid: false, error: 'This promo code has reached its maximum usage limit.' };
    }
    if (subtotal < found.minOrderAmount) {
      return {
        valid: false,
        error: `Minimum order of ${found.minOrderAmount} EGP required to apply this coupon.`,
      };
    }

    const discountAmount =
      found.discountType === 'percentage'
        ? Math.round((subtotal * found.value) / 100)
        : Math.min(found.value, subtotal);

    return { valid: true, discount: found, discountAmount };
  }

  public createDiscount(discountData: Omit<DiscountCode, 'id' | 'usageCount'>, adminEmail: string): DiscountCode {
    const newId = `disc-${Date.now()}`;
    const code: DiscountCode = {
      ...discountData,
      id: newId,
      code: discountData.code.toUpperCase().trim(),
      usageCount: 0,
    };
    this.data.discounts.push(code);
    this.logAudit({
      action: 'DISCOUNT_CREATED',
      targetType: 'discount',
      targetId: newId,
      details: `Created coupon code ${code.code} (${code.value}${code.discountType === 'percentage' ? '%' : ' EGP'} off)`,
      adminEmail,
    });
    this.persist();
    return code;
  }

  public toggleDiscount(id: string, adminEmail: string): DiscountCode | null {
    const discount = this.data.discounts.find(d => d.id === id);
    if (!discount) return null;
    discount.isActive = !discount.isActive;
    this.logAudit({
      action: 'DISCOUNT_TOGGLED',
      targetType: 'discount',
      targetId: id,
      details: `Coupon ${discount.code} toggled to ${discount.isActive ? 'ACTIVE' : 'INACTIVE'}`,
      adminEmail,
    });
    this.persist();
    return discount;
  }

  // --- SHIPPING ---
  public getShippingRates(): GovernorateRate[] {
    return [...this.data.shippingRates];
  }

  public updateShippingRate(id: string, cost: number, adminEmail: string): GovernorateRate | null {
    const rate = this.data.shippingRates.find(r => r.id === id);
    if (!rate) return null;
    const oldCost = rate.cost;
    rate.cost = cost;
    this.logAudit({
      action: 'SHIPPING_RATE_UPDATED',
      targetType: 'shipping',
      targetId: id,
      details: `Updated shipping rate for ${rate.name.en} from ${oldCost} EGP to ${cost} EGP`,
      adminEmail,
    });
    this.persist();
    return rate;
  }

  // --- INQUIRIES ---
  public getInquiries(): CustomerInquiry[] {
    return [...this.data.inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public createInquiry(input: Omit<CustomerInquiry, 'id' | 'status' | 'createdAt'>): CustomerInquiry {
    const inquiry: CustomerInquiry = {
      ...input,
      id: `inq-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    this.data.inquiries.unshift(inquiry);
    this.persist();
    return inquiry;
  }

  public updateInquiryStatus(id: string, status: 'unread' | 'read' | 'resolved'): CustomerInquiry | null {
    const inq = this.data.inquiries.find(i => i.id === id);
    if (!inq) return null;
    inq.status = status;
    this.persist();
    return inq;
  }

  // --- SETTINGS ---
  public getSettings(): StoreSettings {
    const settings = { ...this.data.settings };
    delete settings.adminPassword;
    return settings;
  }

  public updateSettings(settings: Partial<StoreSettings>, _adminOperator = 'Admin'): StoreSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    delete this.data.settings.adminPassword;
    this.logAudit({
      action: 'SETTINGS_UPDATED',
      targetType: 'settings',
      targetId: 'store_settings',
      details: 'Store settings updated',
      adminEmail: 'Admin',
    });
    this.persist();
    const result = { ...this.data.settings };
    delete result.adminPassword;
    return result;
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    return [...this.data.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
    const log: AuditLog = {
      ...entry,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs.pop();
    }
  }

  // --- ANALYTICS OVERVIEW ---
  public getAnalytics() {
    const orders = this.data.orders;
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const pendingShipments = orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length;
    const lowStockCount = this.data.products.filter(p => p.totalStock <= 15).length;

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    orders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    // Governorate sales breakdown
    const governorateCounts: Record<string, number> = {};
    orders.forEach(o => {
      const gov = o.shippingAddress.governorate || 'Other';
      governorateCounts[gov] = (governorateCounts[gov] || 0) + 1;
    });

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      pendingShipments,
      lowStockCount,
      activeProductsCount: this.data.products.filter(p => p.status === 'active').length,
      statusCounts,
      governorateCounts,
    };
  }

  // --- ADMIN AUTH & PASSWORD MANAGEMENT ---
  public getAdminPassword(): string {
    return this.data.adminPassword || this.data.settings?.adminPassword || '123456';
  }

  public verifyAdminPassword(password: string): boolean {
    const current = this.getAdminPassword();
    return password.trim() === current.trim();
  }

  public changeAdminPassword(
    currentPassword: string,
    newPassword: string,
    _adminOperator = 'Admin'
  ): { success: boolean; error?: string } {
    if (!this.verifyAdminPassword(currentPassword)) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, error: 'New password must be at least 4 characters.' };
    }

    const trimmedNew = newPassword.trim();
    this.data.adminPassword = trimmedNew;
    if (this.data.settings) {
      this.data.settings.adminPassword = trimmedNew;
    }

    this.logAudit({
      action: 'ADMIN_PASSWORD_CHANGED',
      targetType: 'auth',
      targetId: 'admin_credentials',
      details: 'Admin master password updated successfully',
      adminEmail: 'Admin',
    });

    this.persist();
    return { success: true };
  }
}

export const db = new StoreDatabase();
