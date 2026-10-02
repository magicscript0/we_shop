/**
 * Central Content Registry & CMS Service (Phase D - Change 5)
 *
 * Provides single-source-of-truth management for all store copy, announcement bars,
 * hero sections, step-by-step guides, trust pillars, and FAQs.
 *
 * Supports:
 * - Structured typed keys
 * - Draft vs Published states
 * - Immediate browser reactivity (LocalStorage sync + custom events)
 * - Safe fallback to canonical defaults (SSG & offline safe)
 */

export interface FaqItem {
  id: string;
  category: 'general' | 'payment' | 'technical';
  question: string;
  answer: string;
  isPublished: boolean;
  sortOrder: number;
}

export interface CmsRegistry {
  // 1. Announcement Bar
  'announcement.is_active': boolean;
  'announcement.badge': string;
  'announcement.title': string;
  'announcement.cap_note': string;
  'announcement.cta_text': string;
  'announcement.cta_link': string;

  // 2. Hero Section
  'hero.badge': string;
  'hero.title': string;
  'hero.subtitle': string;
  'hero.cta_primary': string;
  'hero.cta_secondary': string;
  'hero.seal_active': boolean;
  'hero.seal_tag': string;

  // 3. How It Works (4 Steps)
  'steps.1.title': string;
  'steps.1.desc': string;
  'steps.2.title': string;
  'steps.2.desc': string;
  'steps.3.title': string;
  'steps.3.desc': string;
  'steps.4.title': string;
  'steps.4.desc': string;

  // 4. Why Us (4 Trust Pillars)
  'why_us.1.title': string;
  'why_us.1.desc': string;
  'why_us.2.title': string;
  'why_us.2.desc': string;
  'why_us.3.title': string;
  'why_us.3.desc': string;
  'why_us.4.title': string;
  'why_us.4.desc': string;

  // 5. Official Support Channels (Tickets & Email)
  'support.email': string;
  'support.phone': string;
  'support.hours': string;
  'support.ticket_response_time': string;

  // 6. Legal & Policy Summaries
  'legal.terms_summary': string;
  'legal.privacy_summary': string;
  'legal.refund_summary': string;

  // 7. Dynamic FAQs
  faqs: FaqItem[];
}

export const DEFAULT_CMS_REGISTRY: CmsRegistry = {
  // Announcement Bar
  'announcement.is_active': true,
  'announcement.badge': 'عرض ترحيبي عام للجميع',
  'announcement.title': 'خصم 50% لأول شهر على باقات الإنترنت المنزلي',
  'announcement.cap_note': '(وفر حتى 350 ج.م)',
  'announcement.cta_text': 'اختر باقتك الآن',
  'announcement.cta_link': '/#plans',

  // Hero Section
  'hero.badge': 'الوكيل المعتمد لخدمات الإنترنت المنزلي من WE',
  'hero.title': 'باقات WE للإنترنت المنزلي بشحن فوري ودفع محلي معتمد',
  'hero.subtitle':
    'اشترك وجدد باقات الإنترنت المنزلي لسعات تبدأ من 200 جيجابايت حتى 18 تيرابايت. تفعيل مباشر على خطك الأرضي بدون كروت ائتمان.',
  'hero.cta_primary': 'تصفح الباقات والأسعار',
  'hero.cta_secondary': 'تجديد باقة سريعة',
  'hero.seal_active': true,
  'hero.seal_tag': 'خصم 50% لأول شهر',

  // How It Works (4 Steps)
  'steps.1.title': 'اختر الباقة المناسبة',
  'steps.1.desc':
    'اختر سعة التحميل الشهرية أو السنوية المناسبة لاستهلاك منزلك من 33 باقة رسمية معتمدة.',
  'steps.2.title': 'أدخل رقم التليفون الأرضي',
  'steps.2.desc':
    'اكتب رقم خطك الأرضي مسبوقاً بكود المحافظة مع تأكيد الرقم لضمان دقة الشحن.',
  'steps.3.title': 'سدد بالتحويل المحلي',
  'steps.3.desc':
    'حوّل القيمة عبر فودافون كاش أو إنستاباي أو المحافظ الإلكترونية خلال مهلة 60 دقيقة.',
  'steps.4.title': 'تفعيل فوري على خطك',
  'steps.4.desc':
    'يتم مراجعة التحويل فورياً وشحن الباقة على خطك الأرضي وإشعارك برسالة فورية.',

  // Why Us (4 Trust Pillars)
  'why_us.1.title': 'شحن مباشر معتمد',
  'why_us.1.desc':
    'شحن رسمي ومعتمد على رقم خطك الأرضي مباشرة لدى الشركة المصرية للاتصالات.',
  'why_us.2.title': 'دفع محلي فوري',
  'why_us.2.desc':
    'سداد سهل ومجاني عبر إنستاباي، فودافون كاش، أورنج كاش، إي آند كاش، ووي باي.',
  'why_us.3.title': 'شفافية تامة وحماية 100%',
  'why_us.3.desc':
    'أسعار معلنة بوضوح شاملة ضريبة القيمة المضافة 14%، مع عداد 60 دقيقة لحجز السعر.',
  'why_us.4.title': 'دعم فني وتذاكر مباشرة',
  'why_us.4.desc':
    'فريق دعم ومتابعة على مدار ساعات العمل عبر البريد الرسمي ونظام التذاكر المباشر.',

  // Official Support Channels
  'support.email': 'support@westore-eg.com',
  'support.phone': '19777',
  'support.hours': 'يومياً من 9:00 صباحاً حتى 11:00 مساءً (توقيت القاهرة)',
  'support.ticket_response_time': 'خلال 15 دقيقة في أوقات العمل الرسمية',

  // Legal Summaries
  'legal.terms_summary':
    'يلتزم المتجر بتوفير شحن رسمي لباقات WE مع مهلة سداد مدتها 60 دقيقة لحجز السعر.',
  'legal.privacy_summary':
    'بيانات الخط ورقم الهاتف مشفرة وتستخدم حصراً لتأكيد ومتابعة شحن الباقة.',
  'legal.refund_summary':
    'استرداد كامل خلال 24 ساعة في حال تعذر شحن الخط لأي سبب فني خارج عن إرادة العميل.',

  // Dynamic FAQs
  faqs: [
    {
      id: 'faq-1',
      category: 'general',
      question: 'كيف يتم تفعيل وشحن الباقة على خطي الأرضي بعد التحويل؟',
      answer:
        'بعد اختيار باقتك وإدخال رقم التليفون الأرضي وإتمام التحويل وإرسال إثبات السداد، يراجع فريق العمل التحويل ويقوم بشحن الباقة رسمياً على خطك عبر المنظومة المعتمدة.',
      isPublished: true,
      sortOrder: 1,
    },
    {
      id: 'faq-2',
      category: 'general',
      question: 'هل باقات الإنترنت المنزلي من WE غير محدودة التحميل؟',
      answer:
        'لا، طبقاً للوائح الرسمية الصادرة عن الجهاز القومي لتنظيم الاتصالات وشركة WE، فإن جميع باقات الإنترنت المنزلي محددة بسعات تحميل شهرية أو سنوية صريحة (جيجابايت أو تيرابايت)، وعند انتهاء السعة تنخفض السرعة لحين التجديد أو شراء باقة إضافية.',
      isPublished: true,
      sortOrder: 2,
    },
    {
      id: 'faq-3',
      category: 'payment',
      question: 'ما هي مهلة الـ 60 دقيقة المحددة لإتمام التحويل؟',
      answer:
        'عند تأكيد طلبك يتم حجز الباقة وتثبيت سعرها لمدة 60 دقيقة كاملة بعداد تنازلي نشط، لتتيح لك وقتاً كافياً للتحويل وإرفاق رقم المعاملة أو لقطة الشاشة دون تغير السعر.',
      isPublished: true,
      sortOrder: 3,
    },
    {
      id: 'faq-4',
      category: 'payment',
      question: 'هل أحتاج لبطاقة ائتمان دولية (Credit Card) للشراء؟',
      answer:
        'أبداً! يعتمد متجرنا بنسبة 100% على وسائل الدفع المحلية المفضلة في مصر: إنستاباي (InstaPay)، محفظة فودافون كاش، أورنج كاش، إي آند كاش، ومحفظة وي باي.',
      isPublished: true,
      sortOrder: 4,
    },
    {
      id: 'faq-5',
      category: 'technical',
      question: 'ماذا أفعل إذا أدخلت رقم خط أرضي غير صحيح؟',
      answer:
        'لحمايتك، يلزمك المتجر بتأكيد رقم الخط مرتين في صفحة إنهاء الطلب. وإذا حدث خطأ قبل التحويل يمكنك إلغاء الطلب وإنشاء طلب برقم صحيح. وإذا تم التحويل يرجى التواصل فوراً مع الدعم الفني عبر نظام التذاكر والبريد الرسمي قبل اكتمال الشحن.',
      isPublished: true,
      sortOrder: 5,
    },
  ],
};

const STORAGE_KEY = 'we_store_cms_published';
const DRAFT_KEY = 'we_store_cms_draft';
export const CMS_UPDATED_EVENT = 'we_store_cms_updated';

/**
 * Read the current published CMS registry.
 * On browser: checks localStorage, falls back to canonical default.
 * On server / SSG: returns canonical default.
 */
export function getPublishedCms(): CmsRegistry {
  if (typeof window === 'undefined') {
    return DEFAULT_CMS_REGISTRY;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CMS_REGISTRY;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CMS_REGISTRY, ...parsed };
  } catch {
    return DEFAULT_CMS_REGISTRY;
  }
}

/**
 * Read current draft CMS registry (admin edit mode).
 */
export function getDraftCms(): CmsRegistry {
  if (typeof window === 'undefined') {
    return DEFAULT_CMS_REGISTRY;
  }

  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return getPublishedCms();
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CMS_REGISTRY, ...parsed };
  } catch {
    return getPublishedCms();
  }
}

/**
 * Save draft CMS changes (admin editing).
 */
export function saveDraftCms(updates: Partial<CmsRegistry>): void {
  if (typeof window === 'undefined') return;
  const current = getDraftCms();
  const merged = { ...current, ...updates };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
}

/**
 * Publish draft CMS changes live to the entire store.
 */
export function publishCms(registry?: CmsRegistry): CmsRegistry {
  if (typeof window === 'undefined') return DEFAULT_CMS_REGISTRY;

  const toPublish = registry || getDraftCms();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toPublish));
  // Sync draft to published
  localStorage.setItem(DRAFT_KEY, JSON.stringify(toPublish));

  // Dispatch custom event to notify all active UI components
  window.dispatchEvent(new CustomEvent(CMS_UPDATED_EVENT, { detail: toPublish }));

  return toPublish;
}

/**
 * Reset CMS registry to the canonical defaults.
 */
export function resetCmsToDefault(): CmsRegistry {
  if (typeof window === 'undefined') return DEFAULT_CMS_REGISTRY;

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DRAFT_KEY);

  window.dispatchEvent(
    new CustomEvent(CMS_UPDATED_EVENT, { detail: DEFAULT_CMS_REGISTRY })
  );

  return DEFAULT_CMS_REGISTRY;
}
