'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SEED_PLANS } from '@/lib/constants';
import { Plan } from '@/types/database';
import { calculatePlanPricing } from '@/lib/services/pricing';
import { formatEgp } from '@/lib/utils';
import { Button, Badge } from '@/components/ui';
import { ShieldCheckIcon, CheckIcon, ZapIcon, RouterIcon, ArrowLeftRTL } from '@/components/ui/Icons';

type HouseholdSize = 1 | 2 | 3; // 1-2 users, 3-4 users, 5+ users
type UsageType = 'light' | 'streaming' | 'gaming' | 'work';
type BillingPreference = 'monthly' | 'yearly';

export interface PlanRecommendation {
  plan: Plan;
  headline: string;
  rationale: string;
  speedDesc: string;
  estimatedMonthlyUsage: string;
}

export function recommendPlan(
  household: HouseholdSize,
  usage: UsageType,
  billing: BillingPreference
): PlanRecommendation {
  let targetSlug = 'super-monthly-250gb';
  let rationale = 'سعة متوازنة تكفي الاستخدام اليومي المعتاد بسرعة مستقرة.';
  let speedDesc = 'سرعة سوبر تصل حتى 30 ميجابت/ث';
  let estimatedMonthlyUsage = '~200-250 جيجابايت شهرياً';

  if (billing === 'yearly') {
    if (household === 1) {
      targetSlug = 'super-yearly-1800gb';
      rationale = 'اشتراك سنوي اقتصادي يعطيك 1,800 جيجابايت سنوياً (معدل 150 جيجابايت شهرياً) بأقل تكلفة.';
      speedDesc = 'سرعة سوبر حتى 30 ميجابت/ث';
      estimatedMonthlyUsage = '150 جيجابايت شهرياً في المتوسط';
    } else if (household === 2) {
      if (usage === 'gaming' || usage === 'work') {
        targetSlug = 'mega-yearly-3000gb';
        rationale = 'باقة سنوية فائقة السرعة تمنح عائلتك 3,000 جيجابايت مع أداء قوي للألعاب والبث.';
        speedDesc = 'سرعة ميجا تصل حتى 70 ميجابت/ث';
        estimatedMonthlyUsage = '250 جيجابايت شهرياً';
      } else {
        targetSlug = 'super-yearly-3000gb';
        rationale = '3,000 جيجابايت سنوياً تكفي تماماً احتياجات الأسرة مع راحة البال من التجديد الشهري.';
        speedDesc = 'سرعة سوبر حتى 30 ميجابت/ث';
        estimatedMonthlyUsage = '250 جيجابايت شهرياً';
      }
    } else {
      // household === 3
      if (usage === 'gaming' || usage === 'work') {
        targetSlug = 'ultra-yearly-6000gb';
        rationale = 'سعة ضخمة 6,000 جيجابايت على مدار العام مع أعلى فئة سرعة للأسر الكبيرة والاستخدام المكثف.';
        speedDesc = 'سرعة ألترا تصل حتى 100 ميجابت/ث';
        estimatedMonthlyUsage = '500 جيجابايت شهرياً';
      } else {
        targetSlug = 'super-yearly-6000gb';
        rationale = '6,000 جيجابايت سنوياً لتغطية كافة أجهزة العائلة والتلفزيونات الذكية دون انقطاع.';
        speedDesc = 'سرعة سوبر حتى 30 ميجابت/ث';
        estimatedMonthlyUsage = '500 جيجابايت شهرياً';
      }
    }
  } else {
    // Monthly
    if (household === 1) {
      if (usage === 'light') {
        targetSlug = 'super-monthly-200gb';
        rationale = 'خيار اقتصادي مثالي للاستخدام الشخصي الخفيف والمتابعة اليومية بأقل تكلفة.';
        speedDesc = 'سرعة سوبر حتى 30 ميجابت/ث';
        estimatedMonthlyUsage = '200 جيجابايت شهرياً';
      } else if (usage === 'streaming') {
        targetSlug = 'super-monthly-250gb';
        rationale = '250 جيجابايت تضمن لك مشاهدة سلسة للمسلسلات واليوتيوب بدقة عالية بدون قلق من انتهاء السعة.';
        speedDesc = 'سرعة سوبر حتى 30 ميجابت/ث';
        estimatedMonthlyUsage = '250 جيجابايت شهرياً';
      } else {
        targetSlug = 'mega-monthly-250gb';
        rationale = 'سرعة ميجا الفائقة لتقليل زمن الاستجابة (Ping) في الألعاب والاجتماعات مع سعة 250 جيجابايت.';
        speedDesc = 'سرعة ميجا تصل حتى 70 ميجابت/ث';
        estimatedMonthlyUsage = '250 جيجابايت شهرياً';
      }
    } else if (household === 2) {
      if (usage === 'light') {
        targetSlug = 'super-monthly-250gb';
        rationale = 'سعة 250 جيجابايت كافية جداً لأسرة صغيرة لتصفح السوشيال ميديا والتطبيقات الأساسية.';
        speedDesc = 'سرعة سوبر حتى 30 ميجابت/ث';
        estimatedMonthlyUsage = '250 جيجابايت شهرياً';
      } else if (usage === 'streaming') {
        targetSlug = 'super-monthly-300gb';
        rationale = '300 جيجابايت تلبي مشاهدة متزامنة لأكثر من شاشة ذكية في وقت واحد بجودة ممتازة.';
        speedDesc = 'سرعة سوبر حتى 30 ميجابت/ث';
        estimatedMonthlyUsage = '300 جيجابايت شهرياً';
      } else if (usage === 'gaming') {
        targetSlug = 'mega-monthly-500gb';
        rationale = 'باقة متطورة تجمع بين سرعة ميجا العالية وسعة 500 جيجابايت لتحميل الألعاب والتحديثات الدورية.';
        speedDesc = 'سرعة ميجا تصل حتى 70 ميجابت/ث';
        estimatedMonthlyUsage = '500 جيجابايت شهرياً';
      } else {
        targetSlug = 'ultra-monthly-500gb';
        rationale = 'سرعة ألترا القوية (100 ميجابت/ث) مخصصة للعمل من المنزل والاجتماعات المتزامنة وسعة 500 جيجابايت.';
        speedDesc = 'سرعة ألترا تصل حتى 100 ميجابت/ث';
        estimatedMonthlyUsage = '500 جيجابايت شهرياً';
      }
    } else {
      // household === 3
      if (usage === 'light' || usage === 'streaming') {
        targetSlug = 'super-monthly-500gb';
        rationale = '500 جيجابايت تضمن استمرار الإنترنت لجميع أفراد المنزل طوال الشهر دون بطء.';
        speedDesc = 'سرعة سوبر حتى 30 ميجابت/ث';
        estimatedMonthlyUsage = '500 جيجابايت شهرياً';
      } else if (usage === 'gaming') {
        targetSlug = 'mega-monthly-750gb';
        rationale = 'سعة ضخمة 750 جيجابايت مع سرعة 70 ميجابت/ث لتفادي أي لاج أو هبوط في الأداء.';
        speedDesc = 'سرعة ميجا تصل حتى 70 ميجابت/ث';
        estimatedMonthlyUsage = '750 جيجابايت شهرياً';
      } else {
        targetSlug = 'ultra-monthly-750gb';
        rationale = 'أقصى أداء مع سرعة 100 ميجابت/ث وسعة 750 جيجابايت لتحمل كافة أجهزة المنزل والمهام الثقيلة.';
        speedDesc = 'سرعة ألترا تصل حتى 100 ميجابت/ث';
        estimatedMonthlyUsage = '750 جيجابايت شهرياً';
      }
    }
  }

  const found = SEED_PLANS.find((p) => p.slug === targetSlug) || SEED_PLANS[0];

  return {
    plan: found,
    headline: `الباقة الأنسب لك: ${found.tier_label_ar} ${found.quota_value} ${found.quota_unit}`,
    rationale,
    speedDesc,
    estimatedMonthlyUsage,
  };
}

export const PlanFinder: React.FC<{ onSelectPlan?: (plan: Plan) => void }> = ({ onSelectPlan }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [household, setHousehold] = useState<HouseholdSize>(2);
  const [usage, setUsage] = useState<UsageType>('streaming');
  const [billing, setBilling] = useState<BillingPreference>('monthly');

  const recommendation = recommendPlan(household, usage, billing);
  const pricing = calculatePlanPricing(recommendation.plan.price_egp);

  const resetWizard = () => {
    setStep(1);
    setHousehold(2);
    setUsage('streaming');
    setBilling('monthly');
  };

  return (
    <div
      className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-8 space-y-6 text-right font-body"
      dir="rtl"
    >
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4F5F7] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0F5] text-[#5C2D91] text-xs font-bold mb-1">
            <ZapIcon size={14} />
            <span>مساعد الاختيار الذكي (3 خطوات)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-heading text-[#14101F]">
            أداة ترشيح الباقة المنزلية المناسبة
          </h3>
          <p className="text-xs text-[#5E5873] mt-0.5">
            أجب عن 3 أسئلة سريعة لنرشح لك الباقة الأكثر توفيراً وتوافقاً مع استخدامك الفعلي.
          </p>
        </div>

        {step <= 3 && (
          <div className="flex items-center gap-1.5 text-xs text-[#8E8A9F] font-mono">
            <span>الخطوة {step} من 3</span>
          </div>
        )}
      </div>

      {/* Step 1: Household size */}
      {step === 1 && (
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-base text-[#14101F]">
            1. كم عدد الأشخاص أو الأجهزة المتصلة بالراوتر يومياً؟
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 1, title: '1 - 2 مستخدمين', desc: 'استخدام شخصي أو هادئ (1-3 أجهزة)' },
              { id: 2, title: '3 - 4 مستخدمين', desc: 'عائلة متوسطة وشاشات ذكية (4-7 أجهزة)' },
              { id: 3, title: '5 مستخدمين فأكثر', desc: 'منزل مزدحم أو ألعاب وبث متزامن (8+ أجهزة)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setHousehold(opt.id as HouseholdSize)}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                  household === opt.id
                    ? 'border-[#5C2D91] bg-[#F6F2FC] ring-2 ring-[#5C2D91]/20'
                    : 'border-[#E5E7EB] bg-white hover:bg-[#F8F9FA]'
                }`}
              >
                <div className="font-bold text-sm text-[#14101F]">{opt.title}</div>
                <div className="text-xs text-[#5E5873] mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="md" onClick={() => setStep(2)}>
              التالي (طبيعة الاستخدام) ←
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Usage Type */}
      {step === 2 && (
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-base text-[#14101F]">
            2. ما هو الاستخدام الأكثر استهلاكاً للإنترنت في منزلك؟
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'light',
                title: 'تصفح خفيف وتواصل',
                desc: 'تطبيقات المحادثة، شبكات التواصل الاجتماعي، قراءة الأخبار، تصفح بريد (استهلاك خفيف)',
              },
              {
                id: 'streaming',
                title: 'مشاهدة فيديوهات ومنصات بث',
                desc: 'يوتيوب بجودة عالية، نتفلكس، شاهد، وتلفزيونات ذكية (استهلاك متوسط إلى عالٍ)',
              },
              {
                id: 'gaming',
                title: 'ألعاب أونلاين وتحميلات كبيرة',
                desc: 'PlayStation / Xbox، تحديثات ضخمة، وحاجة لبينج منخفض واستقرار (استهلاك مكثف)',
              },
              {
                id: 'work',
                title: 'عمل ودراسة عن بُعد',
                desc: 'اجتماعات زووم و Teams، رفع ملفات مستمر، وفصول تعليمية يومية',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setUsage(opt.id as UsageType)}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                  usage === opt.id
                    ? 'border-[#5C2D91] bg-[#F6F2FC] ring-2 ring-[#5C2D91]/20'
                    : 'border-[#E5E7EB] bg-white hover:bg-[#F8F9FA]'
                }`}
              >
                <div className="font-bold text-sm text-[#14101F]">{opt.title}</div>
                <div className="text-xs text-[#5E5873] mt-1 leading-relaxed">{opt.desc}</div>
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => setStep(1)}>
              → السابق
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(3)}>
              التالي (نوع الاشتراك) ←
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Billing Preference */}
      {step === 3 && (
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-base text-[#14101F]">
            3. ما هو نظام الشحن والتجديد الذي تفضله؟
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'monthly',
                title: 'تجديد شهري مرن',
                badge: 'الأكثر شعبية',
                desc: 'دفع الرصيد كل 30 يوماً مع إمكانية التغيير أو شحن باقات إضافية عند الحاجة.',
              },
              {
                id: 'yearly',
                title: 'اشتراك سنوي مع خصم توفيري',
                badge: 'توفير يصل لـ 20%',
                desc: 'سداد لمرة واحدة طوال العام وراحة بال تامة من متابعة الشحن الشهري.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setBilling(opt.id as BillingPreference)}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                  billing === opt.id
                    ? 'border-[#5C2D91] bg-[#F6F2FC] ring-2 ring-[#5C2D91]/20'
                    : 'border-[#E5E7EB] bg-white hover:bg-[#F8F9FA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-[#14101F]">{opt.title}</div>
                  <span className="text-[10px] font-bold text-[#5C2D91] bg-[#E9E0F5] px-2 py-0.5 rounded-full">
                    {opt.badge}
                  </span>
                </div>
                <div className="text-xs text-[#5E5873] mt-1.5 leading-relaxed">{opt.desc}</div>
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => setStep(2)}>
              → السابق
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(4)}>
              عرض الباقة المرشحة لك 🎯
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Results Screen */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-r from-[#2A1250] to-[#5C2D91] text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-[#B9F03C] bg-white/10 px-3 py-1 rounded-full">
                🎯 النتيجة المرشحة بناءً على إجاباتك
              </span>
              <span className="text-xs text-[#CBBAE7]">
                {recommendation.plan.billing_period === 'yearly' ? 'اشتراك سنوي' : 'اشتراك شهري'}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
                باقة {recommendation.plan.tier_label_ar} {recommendation.plan.quota_value}{' '}
                {recommendation.plan.quota_unit}
              </h3>
              <p className="text-xs sm:text-sm text-[#CBBAE7]">{recommendation.speedDesc}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 space-y-1.5 text-xs text-[#E9E0F5]">
              <span className="font-bold text-[#B9F03C] block">لماذا هذه الباقة هي الأنسب لك؟</span>
              <p className="leading-relaxed">{recommendation.rationale}</p>
              <div className="text-[11px] text-white/70 pt-1">
                المعدل التقديري: {recommendation.estimatedMonthlyUsage}
              </div>
            </div>

            {/* Price with VAT transparency */}
            <div className="pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-white/80 block">الإجمالي شامل ضريبة القيمة المضافة (14%):</span>
                <div className="text-3xl font-black font-heading text-[#B9F03C] font-mono mt-0.5">
                  {formatEgp(pricing.total_due)}
                </div>
                <div className="text-[11px] text-[#CBBAE7] mt-0.5">
                  (السعر الأساسي: {formatEgp(pricing.base_price)} + الضريبة: {formatEgp(pricing.vat_amount)})
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/checkout?planId=${encodeURIComponent(recommendation.plan.slug)}`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto font-black shadow-lg"
                  >
                    شحن هذه الباقة الآن ⚡
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={resetWizard} className="text-white hover:text-[#B9F03C]">
                  إعادة الاختبار ↺
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
