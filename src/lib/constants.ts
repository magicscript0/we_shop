import { Plan, PaymentMethod, PlanTier } from '@/types/database';

export const COLORS = {
  purple: {
    900: '#2A1250',
    800: '#3A1C6E',
    700: '#4A2480',
    500: '#5C2D91', // Primary WE Purple
    300: '#A98BD6',
    100: '#E9E0F5',
    50: '#F6F2FC',
  },
  cta: {
    neon: '#B9F03C', // Verified contrast >= 4.5:1 with #1B0A33 (13.7:1 actual)
    text: '#1B0A33',
  },
  accent: {
    orange: '#FF7A1A', // Reserved for discounts and gifts ONLY
  },
  surface: {
    white: '#FFFFFF',
    lightGray: '#F4F5F7',
    subtle: '#F8F9FA',
    border: '#E2E8F0',
  },
  text: {
    primary: '#14101F',
    secondary: '#5E5873',
    muted: '#8E8A9F',
  },
} as const;

export const TIER_THEMES: Record<
  PlanTier,
  {
    primary: string;
    secondary: string;
    border: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
    energyGlow: string;
  }
> = {
  Super: {
    primary: '#5C2D91',
    secondary: '#7339B3',
    border: '#D4C4EB',
    glow: 'rgba(92, 45, 145, 0.25)',
    badgeBg: '#F3EEFA',
    badgeText: '#5C2D91',
    energyGlow: '#8C52FF',
  },
  Mega: {
    primary: '#4A2480',
    secondary: '#5C2D91',
    border: '#C0AADB',
    glow: 'rgba(74, 36, 128, 0.25)',
    badgeBg: '#EDE6F7',
    badgeText: '#4A2480',
    energyGlow: '#9E6BFF',
  },
  Ultra: {
    primary: '#3A1C6E',
    secondary: '#4A2480',
    border: '#AD90CC',
    glow: 'rgba(58, 28, 110, 0.28)',
    badgeBg: '#E6DCF4',
    badgeText: '#3A1C6E',
    energyGlow: '#B282FF',
  },
  Max: {
    primary: '#2A1250',
    secondary: '#3A1C6E',
    border: '#9B74BE',
    glow: 'rgba(42, 18, 80, 0.32)',
    badgeBg: '#DFD1F0',
    badgeText: '#2A1250',
    energyGlow: '#C299FF',
  },
  'Max Plus': {
    primary: '#230E44',
    secondary: '#331562',
    border: '#8E64B4',
    glow: 'rgba(35, 14, 68, 0.35)',
    badgeBg: '#D8C6ED',
    badgeText: '#230E44',
    energyGlow: '#CFADFF',
  },
  Elite: {
    primary: '#170828',
    secondary: '#280F42',
    border: '#CBB26A', // Metallic gold-bronze subtle touch
    glow: 'rgba(203, 178, 106, 0.25)',
    badgeBg: '#280F42',
    badgeText: '#F7DF94',
    energyGlow: '#F3D276',
  },
};

export const ORDER_STATUS_LABELS: Record<string, { labelAr: string; colorClass: string }> = {
  awaiting_payment: {
    labelAr: 'في انتظار الدفع',
    colorClass: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  proof_submitted: {
    labelAr: 'جاري التحقق',
    colorClass: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  payment_verified: {
    labelAr: 'تم تأكيد الدفع',
    colorClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  },
  processing: {
    labelAr: 'جاري الشحن',
    colorClass: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  completed: {
    labelAr: 'تم الشحن بنجاح',
    colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  rejected: {
    labelAr: 'مرفوض',
    colorClass: 'bg-rose-100 text-rose-900 border-rose-300',
  },
  needs_info: {
    labelAr: 'مطلوب استكمال بيانات',
    colorClass: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  expired: {
    labelAr: 'منتهي الصلاحية',
    colorClass: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  cancelled: {
    labelAr: 'ملغي',
    colorClass: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  refunded: {
    labelAr: 'مسترد',
    colorClass: 'bg-teal-100 text-teal-900 border-teal-300',
  },
};

export const GOVERNORATE_CODES: Record<string, string> = {
  '013': 'القليوبية (بنها وشبرا الخيمة وطوخ)',
  '02': 'القاهرة الكبرى والجيزة',
  '03': 'الإسكندرية',
  '045': 'البحيرة',
  '040': 'الغربية (طنطا والمحلة)',
  '048': 'المنوفية',
  '050': 'الدقهلية (المنصورة)',
  '055': 'الشرقية (الزقازيق)',
};

// Official Plans from Section 7 for static rendering and offline fallback
export const SEED_PLANS: Plan[] = [
  // Super Monthly
  { id: '1', slug: 'super-monthly-50gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 50, quota_unit: 'GB', price_egp: 150, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 1, price_includes_tax: false },
  { id: '2', slug: 'super-monthly-200gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 200, quota_unit: 'GB', price_egp: 330, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 2, price_includes_tax: false },
  { id: '3', slug: 'super-monthly-250gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 250, quota_unit: 'GB', price_egp: 395, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 3, price_includes_tax: false },
  { id: '4', slug: 'super-monthly-300gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 300, quota_unit: 'GB', price_egp: 460, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 4, price_includes_tax: false },
  { id: '5', slug: 'super-monthly-400gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 400, quota_unit: 'GB', price_egp: 580, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 5, price_includes_tax: false },
  { id: '6', slug: 'super-monthly-500gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 500, quota_unit: 'GB', price_egp: 660, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 6, price_includes_tax: false },
  { id: '7', slug: 'super-monthly-750gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 750, quota_unit: 'GB', price_egp: 925, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 7, price_includes_tax: false },
  { id: '8', slug: 'super-monthly-1500gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 1650, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 8, price_includes_tax: false },

  // Super Yearly
  { id: '9', slug: 'super-yearly-1800gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 1800, quota_unit: 'GB', price_egp: 3120, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 9, price_includes_tax: false },
  { id: '10', slug: 'super-yearly-2400gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 2400, quota_unit: 'GB', price_egp: 3960, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 10, price_includes_tax: false },
  { id: '11', slug: 'super-yearly-3000gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 3000, quota_unit: 'GB', price_egp: 4345, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 11, price_includes_tax: false },
  { id: '12', slug: 'super-yearly-3600gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 3600, quota_unit: 'GB', price_egp: 5060, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 12, price_includes_tax: false },
  { id: '13', slug: 'super-yearly-4800gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 4800, quota_unit: 'GB', price_egp: 6380, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 13, price_includes_tax: false },
  { id: '14', slug: 'super-yearly-6000gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 6000, quota_unit: 'GB', price_egp: 6930, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 14, price_includes_tax: false },
  { id: '15', slug: 'super-yearly-9000gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 9000, quota_unit: 'GB', price_egp: 9715, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 15, price_includes_tax: false },
  { id: '16', slug: 'super-yearly-18tb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 18, quota_unit: 'TB', price_egp: 16500, speed_mbps: null, tier_note_raw: '3', badge: null, is_active: true, sort_order: 16, price_includes_tax: false },

  // Mega Monthly
  { id: '17', slug: 'mega-monthly-250gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'monthly', quota_value: 250, quota_unit: 'GB', price_egp: 590, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 17, price_includes_tax: false },
  { id: '18', slug: 'mega-monthly-500gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'monthly', quota_value: 500, quota_unit: 'GB', price_egp: 900, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 18, price_includes_tax: false },
  { id: '19', slug: 'mega-monthly-750gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'monthly', quota_value: 750, quota_unit: 'GB', price_egp: 1175, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 19, price_includes_tax: false },
  { id: '20', slug: 'mega-monthly-1500gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 2000, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 20, price_includes_tax: false },

  // Mega Yearly
  { id: '21', slug: 'mega-yearly-3000gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'yearly', quota_value: 3000, quota_unit: 'GB', price_egp: 6490, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 21, price_includes_tax: false },
  { id: '22', slug: 'mega-yearly-6000gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'yearly', quota_value: 6000, quota_unit: 'GB', price_egp: 9450, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 22, price_includes_tax: false },
  { id: '23', slug: 'mega-yearly-9000gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'yearly', quota_value: 9000, quota_unit: 'GB', price_egp: 12340, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 23, price_includes_tax: false },
  { id: '24', slug: 'mega-yearly-18tb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'yearly', quota_value: 18, quota_unit: 'TB', price_egp: 20000, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 24, price_includes_tax: false },

  // Ultra Monthly
  { id: '25', slug: 'ultra-monthly-250gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'monthly', quota_value: 250, quota_unit: 'GB', price_egp: 785, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 25, price_includes_tax: false },
  { id: '26', slug: 'ultra-monthly-500gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'monthly', quota_value: 500, quota_unit: 'GB', price_egp: 1150, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 26, price_includes_tax: false },
  { id: '27', slug: 'ultra-monthly-750gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'monthly', quota_value: 750, quota_unit: 'GB', price_egp: 1425, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 27, price_includes_tax: false },

  // Ultra Yearly
  { id: '28', slug: 'ultra-yearly-3000gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'yearly', quota_value: 3000, quota_unit: 'GB', price_egp: 8635, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 28, price_includes_tax: false },
  { id: '29', slug: 'ultra-yearly-6000gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'yearly', quota_value: 6000, quota_unit: 'GB', price_egp: 12075, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 29, price_includes_tax: false },
  { id: '30', slug: 'ultra-yearly-9000gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'yearly', quota_value: 9000, quota_unit: 'GB', price_egp: 14965, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 30, price_includes_tax: false },

  // Max Monthly
  { id: '31', slug: 'max-monthly-1500gb', tier: 'Max', tier_label_ar: 'ماكس', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 2350, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 31, price_includes_tax: false },
  { id: '32', slug: 'max-plus-monthly-1500gb', tier: 'Max Plus', tier_label_ar: 'ماكس بلس', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 2700, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 32, price_includes_tax: false },

  // Max Yearly
  { id: '33', slug: 'max-yearly-18tb', tier: 'Max', tier_label_ar: 'ماكس', billing_period: 'yearly', quota_value: 18, quota_unit: 'TB', price_egp: 23500, speed_mbps: null, tier_note_raw: '2', badge: null, is_active: true, sort_order: 33, price_includes_tax: false },

  // Elite (Period other / n/a)
  { id: '34', slug: 'elite-3tb', tier: 'Elite', tier_label_ar: 'إليت', billing_period: 'other', quota_value: 3, quota_unit: 'TB', price_egp: 3500, speed_mbps: null, tier_note_raw: '3 TB', badge: null, is_active: true, sort_order: 34, price_includes_tax: false },
];

export const SEED_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-vodafone-cash',
    key: 'vodafone_cash',
    label_ar: 'فودافون كاش',
    account_value: '01034027398',
    account_holder_name: 'حساب محفظة فودافون كاش المعتمد',
    instructions_md: 'اطلب #المبلغ*01034027398*7*9* أو استخدم تطبيق أنا فودافون، ثم احتفظ بلقطة شاشة للرسالة.',
    fee_note: 'يرجى تحويل المبلغ الصافي كاملاً شامل رسوم تحويل محفظتك.',
    min_amount: 50,
    max_amount: 30000,
    is_enabled: true,
    sort_order: 1,
  },
  {
    id: 'pm-instapay',
    key: 'instapay',
    label_ar: 'إنستاباي (InstaPay)',
    account_value: 'we-orders@instapay',
    account_holder_name: 'عنوان الدفع اللحظي الرسمي',
    instructions_md: 'افتح تطبيق إنستاباي، اختر إرسال نقود إلى عنوان الدفع، وأرفق إيصال العملية.',
    fee_note: 'التحويل عبر إنستاباي فوري ومجاني.',
    min_amount: 50,
    max_amount: 50000,
    is_enabled: true,
    sort_order: 2,
  },
  {
    id: 'pm-etisalat-cash',
    key: 'etisalat_cash',
    label_ar: 'اتصالات كاش',
    account_value: '01100000000',
    account_holder_name: 'محفظة اتصالات كاش المعتمدة',
    instructions_md: 'اطلب *777# أو استخدم تطبيق My Etisalat للتحويل المباشر.',
    fee_note: 'يرجى التأكد من تحويل المبلغ الصافي بالكامل.',
    min_amount: 50,
    max_amount: 30000,
    is_enabled: true,
    sort_order: 3,
  },
  {
    id: 'pm-orange-cash',
    key: 'orange_cash',
    label_ar: 'أورنج كاش',
    account_value: '01200000000',
    account_holder_name: 'محفظة أورنج كاش المعتمدة',
    instructions_md: 'اطلب #115# أو استخدم تطبيق Orange Cash وأدخل الرقم والمبلغ بدقة.',
    fee_note: 'يرجى التأكد من تحويل المبلغ الصافي بالكامل.',
    min_amount: 50,
    max_amount: 30000,
    is_enabled: true,
    sort_order: 4,
  },
];
