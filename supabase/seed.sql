-- =============================================================================
-- Seed Data: supabase/seed.sql
-- Description: Official WE Home Internet Plans (Section 7) & Default Store Configuration
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SEED PLANS (34 Official Plans strictly from Section 7)
-- -----------------------------------------------------------------------------

INSERT INTO public.plans (
    slug, tier, tier_label_ar, billing_period, quota_value, quota_unit, price_egp, speed_mbps, tier_note_raw, sort_order, price_includes_tax
) VALUES
    -- سوبر (Super) - Monthly
    ('super-monthly-200gb', 'Super', 'سوبر', 'monthly', 200, 'GB', 330, NULL, '3', 1, FALSE),
    ('super-monthly-250gb', 'Super', 'سوبر', 'monthly', 250, 'GB', 395, NULL, '3', 2, FALSE),
    ('super-monthly-300gb', 'Super', 'سوبر', 'monthly', 300, 'GB', 460, NULL, '3', 3, FALSE),
    ('super-monthly-400gb', 'Super', 'سوبر', 'monthly', 400, 'GB', 580, NULL, '3', 4, FALSE),
    ('super-monthly-500gb', 'Super', 'سوبر', 'monthly', 500, 'GB', 660, NULL, '3', 5, FALSE),
    ('super-monthly-750gb', 'Super', 'سوبر', 'monthly', 750, 'GB', 925, NULL, '3', 6, FALSE),
    ('super-monthly-1500gb', 'Super', 'سوبر', 'monthly', 1500, 'GB', 1650, NULL, '3', 7, FALSE),
    
    -- سوبر (Super) - Yearly
    ('super-yearly-1800gb', 'Super', 'سوبر', 'yearly', 1800, 'GB', 3120, NULL, '3', 8, FALSE),
    ('super-yearly-2400gb', 'Super', 'سوبر', 'yearly', 2400, 'GB', 3960, NULL, '3', 9, FALSE),
    ('super-yearly-3000gb', 'Super', 'سوبر', 'yearly', 3000, 'GB', 4345, NULL, '3', 10, FALSE),
    ('super-yearly-3600gb', 'Super', 'سوبر', 'yearly', 3600, 'GB', 5060, NULL, '3', 11, FALSE),
    ('super-yearly-4800gb', 'Super', 'سوبر', 'yearly', 4800, 'GB', 6380, NULL, '3', 12, FALSE),
    ('super-yearly-6000gb', 'Super', 'سوبر', 'yearly', 6000, 'GB', 6930, NULL, '3', 13, FALSE),
    ('super-yearly-9000gb', 'Super', 'سوبر', 'yearly', 9000, 'GB', 9715, NULL, '3', 14, FALSE),
    ('super-yearly-18tb', 'Super', 'سوبر', 'yearly', 18, 'TB', 16500, NULL, '3', 15, FALSE),

    -- ميجا (Mega) - Monthly
    ('mega-monthly-250gb', 'Mega', 'ميجا', 'monthly', 250, 'GB', 590, NULL, '2', 16, FALSE),
    ('mega-monthly-500gb', 'Mega', 'ميجا', 'monthly', 500, 'GB', 900, NULL, '2', 17, FALSE),
    ('mega-monthly-750gb', 'Mega', 'ميجا', 'monthly', 750, 'GB', 1175, NULL, '2', 18, FALSE),
    ('mega-monthly-1500gb', 'Mega', 'ميجا', 'monthly', 1500, 'GB', 2000, NULL, '2', 19, FALSE),

    -- ميجا (Mega) - Yearly
    ('mega-yearly-3000gb', 'Mega', 'ميجا', 'yearly', 3000, 'GB', 6490, NULL, '2', 20, FALSE),
    ('mega-yearly-6000gb', 'Mega', 'ميجا', 'yearly', 6000, 'GB', 9450, NULL, '2', 21, FALSE),
    ('mega-yearly-9000gb', 'Mega', 'ميجا', 'yearly', 9000, 'GB', 12340, NULL, '2', 22, FALSE),
    ('mega-yearly-18tb', 'Mega', 'ميجا', 'yearly', 18, 'TB', 20000, NULL, '2', 23, FALSE),

    -- ألترا (Ultra) - Monthly
    ('ultra-monthly-250gb', 'Ultra', 'ألترا', 'monthly', 250, 'GB', 785, NULL, '2', 24, FALSE),
    ('ultra-monthly-500gb', 'Ultra', 'ألترا', 'monthly', 500, 'GB', 1150, NULL, '2', 25, FALSE),
    ('ultra-monthly-750gb', 'Ultra', 'ألترا', 'monthly', 750, 'GB', 1425, NULL, '2', 26, FALSE),

    -- ألترا (Ultra) - Yearly
    ('ultra-yearly-3000gb', 'Ultra', 'ألترا', 'yearly', 3000, 'GB', 8635, NULL, '2', 27, FALSE),
    ('ultra-yearly-6000gb', 'Ultra', 'ألترا', 'yearly', 6000, 'GB', 12075, NULL, '2', 28, FALSE),
    ('ultra-yearly-9000gb', 'Ultra', 'ألترا', 'yearly', 9000, 'GB', 14965, NULL, '2', 29, FALSE),

    -- ماكس و ماكس بلس (Max & Max Plus) - Monthly
    ('max-monthly-1500gb', 'Max', 'ماكس', 'monthly', 1500, 'GB', 2350, NULL, '2', 30, FALSE),
    ('max-plus-monthly-1500gb', 'Max Plus', 'ماكس بلس', 'monthly', 1500, 'GB', 2700, NULL, '2', 31, FALSE),

    -- ماكس (Max) - Yearly
    ('max-yearly-18tb', 'Max', 'ماكس', 'yearly', 18, 'TB', 23500, NULL, '2', 32, FALSE),

    -- إليت (Elite) - n/a (Period: other)
    ('elite-3tb', 'Elite', 'إليت', 'other', 3, 'TB', 3500, NULL, '3 TB', 33, FALSE)
ON CONFLICT (slug) DO UPDATE SET
    tier = EXCLUDED.tier,
    tier_label_ar = EXCLUDED.tier_label_ar,
    billing_period = EXCLUDED.billing_period,
    quota_value = EXCLUDED.quota_value,
    quota_unit = EXCLUDED.quota_unit,
    price_egp = EXCLUDED.price_egp,
    tier_note_raw = EXCLUDED.tier_note_raw,
    sort_order = EXCLUDED.sort_order;

-- -----------------------------------------------------------------------------
-- 2. SEED PAYMENT METHODS (Section 10.4)
-- -----------------------------------------------------------------------------

INSERT INTO public.payment_methods (
    key, label_ar, account_value, account_holder_name, instructions_md, fee_note, min_amount, max_amount, is_enabled, sort_order
) VALUES
    (
        'vodafone_cash',
        'فودافون كاش',
        '01034027398',
        'حساب المحفظة المعتمد',
        '1. افتح لوحة الاتصال واطلب *9*7*رقم_المحفظة*المبلغ# أو استخدم تطبيق أنا فودافون.\n2. تأكد من إدخال الرقم بدقة كما يظهر في صفحة تأكيد طلبك.\n3. بعد نجاح التحويل، احتفظ بلقطة شاشة للرسالة وتأكد من وضوح رقم العملية.',
        'يرجى التأكد من تحويل المبلغ الصافي المطلوب بالكامل مع مراعاة أي رسوم تحويل تخص شبكتك.',
        50.00,
        30000.00,
        TRUE,
        1
    ),
    (
        'instapay',
        'إنستاباي (InstaPay)',
        'we-orders@instapay',
        'حساب التحويل الفوري',
        '1. افتح تطبيق InstaPay واختر إرسال نقود.\n2. أدخل عنوان الدفع (IPA) أو رقم الحساب.\n3. أتمم التحويل واحتفظ ببيان العملية أو صورة الإيصال.',
        'التحويل عبر إنستاباي فوري ومجاني بدون رسوم إضافية.',
        50.00,
        50000.00,
        TRUE,
        2
    ),
    (
        'etisalat_cash',
        'اتصالات كاش',
        '01100000000',
        'محفظة اتصالات كاش المعتمدة',
        '1. اطلب *777# أو استخدم تطبيق My Etisalat.\n2. حول المبلغ بدقة إلى الرقم الموضح أعلاه.\n3. احتفظ بنص رسالة التأكيد لرفعها مع الطلب.',
        'يرجى التأكد من تحويل المبلغ الصافي المطلوب بالكامل.',
        50.00,
        30000.00,
        TRUE,
        3
    ),
    (
        'orange_cash',
        'أورنج كاش',
        '01200000000',
        'محفظة أورنج كاش المعتمدة',
        '1. اطلب #115# أو استخدم تطبيق Orange Cash.\n2. اختر تحويل أموال وأدخل رقم المحفظة والمبلغ.\n3. احتفظ بلقطة شاشة لرسالة نجاح العملية.',
        'يرجى التأكد من تحويل المبلغ الصافي المطلوب بالكامل.',
        50.00,
        30000.00,
        TRUE,
        4
    )
ON CONFLICT (key) DO UPDATE SET
    label_ar = EXCLUDED.label_ar,
    account_value = EXCLUDED.account_value,
    account_holder_name = EXCLUDED.account_holder_name,
    instructions_md = EXCLUDED.instructions_md,
    fee_note = EXCLUDED.fee_note,
    sort_order = EXCLUDED.sort_order;

-- -----------------------------------------------------------------------------
-- 3. SEED WELCOME CAMPAIGN (Section 9)
-- -----------------------------------------------------------------------------

INSERT INTO public.campaigns (
    slug, name_ar, percent, max_discount_amount, claim_window_days, is_active, exclude_yearly
) VALUES (
    'welcome-50-percent',
    'خصم الترحيب 50% على أول طلب للعملاء الجدد',
    50.00,
    NULL, -- Leave empty/NULL as specified; triggers owner cap reminder
    7,
    TRUE,
    FALSE
)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. SEED SITE SETTINGS (Section 12.9)
-- -----------------------------------------------------------------------------

INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES
    ('store_name', '"متجر وي لخدمات باقات الإنترنت المنزلي"', 'الاسم الرسمي للمتجر في الواجهة'),
    ('allowed_governorate_codes', '["013"]', 'أكواد المحافظات المقبولة لأرقام الإنترنت المنزلي (الافتراضي 013 القليوبية)'),
    ('order_expiry_minutes', '60', 'مدة العداد التنازلي لرفع إثبات الدفع بالدقائق'),
    ('support_email', '"support@westore-eg.com"', 'البريد الإلكتروني المعتمد لخدمة العملاء والدعم الفني'),
    ('tax_notice', '{"included": false, "rate_percent": 14, "display_text": "الأسعار غير شاملة ضريبة القيمة المضافة (14%)"}', 'إعدادات وإشعار ضريبة القيمة المضافة'),
    ('working_hours', '{"from": "09:00", "to": "23:00", "timezone": "Africa/Cairo", "days": "السبت - الخميس"}', 'ساعات العمل والمراجعة اليومية'),
    ('maintenance_mode', 'false', 'تفعيل وضع الصيانة المؤقت للمتجر')
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    updated_at = timezone('utc'::text, now());

-- -----------------------------------------------------------------------------
-- 5. SEED FAQS (Section 5)
-- -----------------------------------------------------------------------------

INSERT INTO public.faqs (question_ar, answer_ar, category, sort_order, is_published)
VALUES
    (
        'كيف يتم تفعيل الباقة بعد الدفع؟',
        'بعد اختيار باقتك وإدخال رقم التليفون الأرضي وإتمام التحويل عبر وسيلة الدفع المفضلة، يقوم فريق المراجعة بالتحقق من عملية التحويل وشحن الباقة يدوياً على خطك عبر النظام المعتمد وتصلك رسالة وإشعار فور اكتمال التفعيل.',
        'activation',
        1,
        TRUE
    ),
    (
        'هل باقات الإنترنت المنزلي غير محدودة؟',
        'كافة باقات الإنترنت المنزلي في مصر محددة بسعة تحميل محددة (جيجابايت أو تيرابايت) وفقاً للوائح الرسمية لشركة WE، ولا توجد باقات مفتوحة بلا حدود. بعد انتهاء السعة تنخفض السرعة وفق سياسة الاستخدام العادل أو يمكنك التجديد المبكر.',
        'plans',
        2,
        TRUE
    ),
    (
        'ما هي المدة المتاحة لتحويل المبلغ ورفع إيصال الدفع؟',
        'يتوفر لك عداد تنازلي مدته 60 دقيقة من لحظة إنشاء الطلب لحجز الباقة بالسعر الحالي، وخلال هذه الساعة يمكنك التحويل ورفع لقطة الشاشة ورقم العملية. بمجرد رفع الإثبات يتوقف العداد وتبدأ مرحلة المراجعة.',
        'orders',
        3,
        TRUE
    ),
    (
        'ما هي شروط خصم الـ 50% الترحيبي؟',
        'الخصم متاح حصرياً للمستخدمين الجدد عند التسجيل، ويطبق تلقائياً على أول طلب فقط لمرة واحدة لكل حساب ولكل خط إنترنت منزلي ورقم هاتف موثق، وصالح للاستخدام خلال 7 أيام من تاريخ التسجيل.',
        'discounts',
        4,
        TRUE
    ),
    (
        'كيف يمكنني متابعة حالة طلبي؟',
        'يمكنك متابعة حالة الطلب لحظياً من خلال صفحة "تتبع طلبك" برقم الطلب، أو عبر حسابك الشخصي في المتجر لمشاهدة مراحل المراجعة والتأكيد والتفعيل مع إشعارات فورية.',
        'orders',
        5,
        TRUE
    );

-- -----------------------------------------------------------------------------
-- 6. SEED HERO BANNER (Section 5)
-- -----------------------------------------------------------------------------

INSERT INTO public.banners (title_ar, subtitle_ar, badge_ar, link_url, button_text_ar, sort_order, is_active)
VALUES (
    'اشترك في باقات WE للإنترنت المنزلي بسهولة وسرعة',
    'اختر باقتك الشهرية أو السنوية المناسبة وادفع عبر المحافظ الإلكترونية وإنستاباي مع تفعيل موثوق ودعم متواصل.',
    'وكيل معتمد',
    '/plans',
    'تصفح الباقات',
    1,
    TRUE
);
