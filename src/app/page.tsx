'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroVisual } from '@/components/hero/HeroVisual';
import { QuickActions } from '@/components/home/QuickActions';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import { PlanCard } from '@/components/plans/PlanCard';
import { Button, Tabs, Badge } from '@/components/ui';
import { SEED_PLANS } from '@/lib/constants';
import { BillingPeriod } from '@/types/database';
import {
  ShieldCheckIcon,
  ZapIcon,
  ClockIcon,
  WalletIcon,
  ArrowLeftRTL,
  GiftIcon,
  CheckIcon,
  RouterIcon,
} from '@/components/ui/Icons';

export default function Home() {
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('monthly');

  // Featured plans filter for homepage (curated selection from seed)
  const filteredPlans = SEED_PLANS.filter((plan) => {
    const matchesFamily =
      selectedFamily === 'all' || plan.tier.toLowerCase().includes(selectedFamily.toLowerCase());
    const matchesPeriod =
      plan.billing_period === selectedPeriod ||
      (plan.billing_period === 'other' && selectedPeriod === 'monthly');
    return matchesFamily && matchesPeriod;
  }).slice(0, 8); // Display top 8 on home with button to view all 34

  const familyTabs = [
    { id: 'all', label: 'كافة العائلات' },
    { id: 'super', label: 'سوبر (Super)' },
    { id: 'mega', label: 'ميجا (Mega)' },
    { id: 'ultra', label: 'ألترا (Ultra)' },
    { id: 'max', label: 'ماكس (Max)' },
    { id: 'elite', label: 'إليت (Elite)' },
  ];

  const periodTabs = [
    { id: 'monthly' as BillingPeriod, label: 'باقات شهرية' },
    { id: 'yearly' as BillingPeriod, label: 'باقات سنوية (خصم أكبر)' },
  ];

  const faqItems = [
    {
      question: 'كيف يتم تفعيل وشحن الباقة على خطي بعد الدفع؟',
      answer:
        'بعد اختيار باقتك وإدخال رقم التليفون الأرضي وإتمام التحويل عبر وسيلة الدفع المفضلة، يقوم فريق التحقق بمراجعة العملية وتفعيل الباقة مباشرة على خطك عبر الأنظمة المعتمدة وتصلك رسالة وإشعار فوري باكتمال الشحن.',
    },
    {
      question: 'هل باقات الإنترنت المنزلي من WE غير محدودة؟',
      answer:
        'لا، جميع باقات الإنترنت المنزلي في مصر محددة بسعة تحميل صريحة (جيجابايت أو تيرابايت) وفقاً للوائح الرسمية الصادرة عن الشركة المصرية للاتصالات والجهاز القومي لتنظيم الاتصالات. بعد نفاد السعة تنخفض السرعة للحد الأدنى حتى موعد التجديد أو شحن سعة إضافية.',
    },
    {
      question: 'ما هي مهلة العداد التنازلي لإرسال إثبات الدفع؟',
      answer:
        'فور إنشاء الطلب يبدأ عداد تنازلي مدته 60 دقيقة محسوب على الخادم يضمن لك حجز الباقة بسعرها الحالي. المهلة مخصصة لإتمام التحويل ورفع لقطة الشاشة ورقم العملية، وبمجرد رفع الإثبات يتوقف العداد وتبدأ مرحلة المراجعة.',
    },
    {
      question: 'ما هي وسائل الدفع المقبولة في المتجر؟',
      answer:
        'نقبل جميع وسائل الدفع الإلكترونية المحلية في مصر: محفظة فودافون كاش (01034027398)، تطبيق InstaPay للتحويل اللحظي المجاني، محفظة اتصالات كاش، ومحفظة أورنج كاش.',
    },
    {
      question: 'ما هي الشروط المطبقة على هدية التسجيل لأول مرة؟',
      answer:
        'الهدية الترحيبية مخصصة للعملاء الجدد عند إنشاء أول حساب، وتطبق تلقائياً على الطلب الأول فقط لمرة واحدة لكل خط تليفون أرضي ورقم هاتف موثق، وتظل صالحة لمدة 7 أيام من تاريخ التسجيل.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section with 3D/Orbit Scene */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#2A1250] via-[#3A1C6E] to-[#5C2D91] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
          {/* Background Ambient Glow & Grid */}
          <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#B9F03C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Right Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 bg-[#B9F03C] text-[#1B0A33] px-3.5 py-1.5 rounded-full text-xs font-bold font-heading shadow-md">
                <ShieldCheckIcon size={16} />
                <span>وكيل ووسيط معتمد لخدمات المصرية للاتصالات WE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-[1.15]">
                باقات <span className="text-[#B9F03C]">WE</span> للإنترنت المنزلي
                <br />
                بشحن موثوق ودفع محلي
              </h1>

              <p className="text-base sm:text-lg text-[#cbbae7] max-w-2xl leading-relaxed">
                اشترك وجدد باقات الإنترنت المنزلي لسعات تبدأ من 50 جيجابايت حتى 18 تيرابايت. ادفع فورياً عبر فودافون كاش وتطبيق إنستاباي مع متابعة حية لحالة الشحن على خطك.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/plans">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowLeftRTL size={20} />}
                  >
                    اختر باقتك الآن
                  </Button>
                </Link>

                <Link href="/track">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-white border-white/30 hover:bg-white/10"
                    rightIcon={<ClockIcon size={18} />}
                  >
                    تتبع طلبك الحالي
                  </Button>
                </Link>
              </div>

              {/* Key Trust Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2 text-[#E9E0F5]">
                  <CheckIcon size={16} className="text-[#B9F03C] shrink-0" />
                  <span>سعات دقيقة ومعلنة</span>
                </div>
                <div className="flex items-center gap-2 text-[#E9E0F5]">
                  <CheckIcon size={16} className="text-[#B9F03C] shrink-0" />
                  <span>دفع بدون كروت بنكية</span>
                </div>
                <div className="flex items-center gap-2 text-[#E9E0F5]">
                  <CheckIcon size={16} className="text-[#B9F03C] shrink-0" />
                  <span>دعم مباشر واتساب</span>
                </div>
              </div>
            </div>

            {/* Left Column: The 3D / Orbit Visual */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* 2. Quick Actions Bar */}
        <QuickActions />

        {/* 3. The Surprise Teaser Section (Section 9: Hidden until sign-up) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2A1250] to-[#4A2480] text-white p-8 sm:p-10 border border-[#A98BD6]/30 shadow-xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF7A1A]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#FF7A1A] text-white flex items-center justify-center shadow-lg shadow-[#FF7A1A]/30 shrink-0">
                  <GiftIcon size={34} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF7A1A]/20 text-[#FF7A1A] text-xs font-bold mb-1.5">
                    <span>مفاجأة خاصة بالعملاء الجدد</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading">
                    هدية استثنائية بانتظارك بمجرد إنشاء حسابك!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#cbbae7] mt-1 max-w-xl">
                    سجل حسابك الآن لتكتشف العرض الحصري المطبق تلقائياً على أول اشتراك لك لمرة واحدة لكل خط أرضي.
                  </p>
                </div>
              </div>

              <Link href="/auth/signup" className="shrink-0">
                <Button
                  variant="discount"
                  size="lg"
                  rightIcon={<ArrowLeftRTL size={18} />}
                >
                  سجل واكتشف المفاجأة
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Featured Plans Catalog */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-[#5C2D91]" />
                <span className="text-xs font-bold text-[#5C2D91] uppercase tracking-wider">
                  باقات الإنترنت المنزلي
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#14101F]">
                اختر الباقة المناسبة لاستخدامك
              </h2>
              <p className="text-sm text-[#5E5873] mt-1">
                سعات تبدأ من 50 جيجابايت حتى 18 تيرابايت لجميع الاستخدامات المنزلية.
              </p>
            </div>

            {/* Period Switcher */}
            <Tabs
              variant="period"
              items={periodTabs}
              activeId={selectedPeriod}
              onChange={(id) => setSelectedPeriod(id as BillingPeriod)}
            />
          </div>

          {/* Family Filter Tabs */}
          <div className="mb-8">
            <Tabs
              items={familyTabs}
              activeId={selectedFamily}
              onChange={(id) => setSelectedFamily(id)}
            />
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={() => {
                  window.location.href = `/plans/${plan.slug}`;
                }}
              />
            ))}
          </div>

          {/* View All Plans CTA */}
          <div className="mt-12 text-center">
            <Link href="/plans">
              <Button variant="outline" size="lg" rightIcon={<ArrowLeftRTL size={18} />}>
                عرض كافة الباقات (34 باقة معتمدة)
              </Button>
            </Link>
          </div>
        </section>

        {/* 5. How You Buy (4 Steps) */}
        <section className="bg-[#F6F2FC] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#CBBAE7]/40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#5C2D91] uppercase tracking-wider">
                خطوات سهلة ومباشرة
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F] mt-2">
                كيف تشتري وتفعل باقتك في 4 خطوات؟
              </h2>
              <p className="text-sm text-[#5E5873] mt-2">
                نظام ميسر يضمن لك تأكيد الدفع وشحن خطك بدون تعقيدات أو بطاقات ائتمانية.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm relative">
                <div className="w-10 h-10 rounded-xl bg-[#5C2D91] text-white flex items-center justify-center font-heading font-extrabold text-lg mb-4">
                  1
                </div>
                <h3 className="font-heading font-bold text-base text-[#14101F] mb-1">
                  اختر باقتك
                </h3>
                <p className="text-xs text-[#5E5873] leading-relaxed">
                  تصفح باقات سوبر وميجا وألترا وماكس واختر السعة المناسبة لاحتياجك.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm relative">
                <div className="w-10 h-10 rounded-xl bg-[#4A2480] text-white flex items-center justify-center font-heading font-extrabold text-lg mb-4">
                  2
                </div>
                <h3 className="font-heading font-bold text-base text-[#14101F] mb-1">
                  أدخل رقم الخط الأرضي
                </h3>
                <p className="text-xs text-[#5E5873] leading-relaxed">
                  اكتب رقم التليفون الأرضي لخط الإنترنت الخاص بك وتأكد من صحة كود المحافظة.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm relative">
                <div className="w-10 h-10 rounded-xl bg-[#3A1C6E] text-white flex items-center justify-center font-heading font-extrabold text-lg mb-4">
                  3
                </div>
                <h3 className="font-heading font-bold text-base text-[#14101F] mb-1">
                  حوّل المبلغ وارفع الإيصال
                </h3>
                <p className="text-xs text-[#5E5873] leading-relaxed">
                  سدد عبر فودافون كاش أو إنستاباي خلال عداد 60 دقيقة وارفع لقطة الشاشة.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-6 border border-[#B9F03C] shadow-sm relative bg-gradient-to-b from-white to-[#F4F5F7]">
                <div className="w-10 h-10 rounded-xl bg-[#B9F03C] text-[#1B0A33] flex items-center justify-center font-heading font-extrabold text-lg mb-4">
                  4
                </div>
                <h3 className="font-heading font-bold text-base text-[#14101F] mb-1">
                  التحقق والشحن
                </h3>
                <p className="text-xs text-[#5E5873] leading-relaxed">
                  يتحقق فريق المراجعة من التحويل ويتم شحن الباقة على خطك وإشعارك فورياً.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Why Buy From Us (Real Points Only) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#5C2D91] uppercase tracking-wider">
              المصداقية والأمان أولاً
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F] mt-2">
              لماذا تشتري عبر منصتنا؟
            </h2>
            <p className="text-sm text-[#5E5873] mt-2">
              نلتزم بالشفافية الكاملة وتوفير تجربة سريعة وآمنة بدون وعود زائفة أو إحصائيات مفبركة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5C2D91] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center mb-4">
                <ShieldCheckIcon size={26} />
              </div>
              <h3 className="font-heading font-bold text-base text-[#14101F] mb-2">
                وكيل وموزع معتمد
              </h3>
              <p className="text-xs text-[#5E5873] leading-relaxed">
                نعمل كوسيط معتمد لخدمات المصرية للاتصالات WE وفق العقود واللوائح الرسمية.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5C2D91] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center mb-4">
                <WalletIcon size={26} />
              </div>
              <h3 className="font-heading font-bold text-base text-[#14101F] mb-2">
                طرق دفع محلية ميسرة
              </h3>
              <p className="text-xs text-[#5E5873] leading-relaxed">
                ادفع من محفظتك على الموبايل (فودافون، اتصالات، أورنج) أو عبر تطبيق إنستاباي اللحظي.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5C2D91] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center mb-4">
                <ClockIcon size={26} />
              </div>
              <h3 className="font-heading font-bold text-base text-[#14101F] mb-2">
                تتبع فوري للطلب
              </h3>
              <p className="text-xs text-[#5E5873] leading-relaxed">
                شاهد مراحل مراجعة إيصالك وتأكيده وبدء التفعيل مباشرة وبشكل لحظي بدون الحاجة لتحديث الصفحة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5C2D91] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center mb-4">
                <ZapIcon size={26} />
              </div>
              <h3 className="font-heading font-bold text-base text-[#14101F] mb-2">
                دعم فني عبر واتساب
              </h3>
              <p className="text-xs text-[#5E5873] leading-relaxed">
                فريق خدمة عملاء متواجد يومياً لمساعدتك والإجابة على أي استفسارات تخص خطك.
              </p>
            </div>
          </div>
        </section>

        {/* 7. FAQ Section */}
        <section className="bg-[#F4F5F7] py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#5C2D91] uppercase tracking-wider">
                الأسئلة الشائعة
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F] mt-2">
                كل ما تحتاج معرفته عن باقات WE وطرق الشحن
              </h2>
            </div>

            <FaqAccordion items={faqItems} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
