'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PlanCard } from '@/components/plans/PlanCard';
import { GBGauge, Button, Tabs, Badge, Input, Card } from '@/components/ui';
import { SEED_PLANS } from '@/lib/constants';
import { PlanTier, Plan, BillingPeriod } from '@/types/database';
import { ShieldCheckIcon, ZapIcon, ClockIcon, WalletIcon } from '@/components/ui/Icons';
import { isValidWeLineNumber } from '@/lib/utils';

export default function Home() {
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('monthly');
  const [demoDiscountActive, setDemoDiscountActive] = useState<boolean>(true);
  const [testLineNumber, setTestLineNumber] = useState<string>('1234567');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<Plan | null>(null);

  // Filter plans according to selected family and billing period
  const filteredPlans = SEED_PLANS.filter((plan) => {
    const matchesFamily =
      selectedFamily === 'all' || plan.tier.toLowerCase().includes(selectedFamily.toLowerCase());
    
    // Elite has billing_period 'other', keep it visible when 'all' or in monthly view
    const matchesPeriod =
      plan.billing_period === selectedPeriod ||
      (plan.billing_period === 'other' && selectedPeriod === 'monthly');

    return matchesFamily && matchesPeriod;
  });

  const familyTabs = [
    { id: 'all', label: 'كافة الباقات' },
    { id: 'super', label: 'سوبر (Super)' },
    { id: 'mega', label: 'ميجا (Mega)' },
    { id: 'ultra', label: 'ألترا (Ultra)' },
    { id: 'max', label: 'ماكس (Max)' },
    { id: 'elite', label: 'إليت (Elite)' },
  ];

  const periodTabs = [
    { id: 'monthly' as BillingPeriod, label: 'باقات شهرية' },
    { id: 'yearly' as BillingPeriod, label: 'باقات سنوية (أوفر)' },
  ];

  const lineValidation = isValidWeLineNumber(testLineNumber, '013');

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1">
        {/* Phase 1 Verification Header Banner */}
        <section className="bg-gradient-to-r from-[#2A1250] via-[#4A2480] to-[#5C2D91] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#3A1C6E]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4 text-right">
              <div className="inline-flex items-center gap-2 bg-[#B9F03C] text-[#1B0A33] px-3 py-1 rounded-full text-xs font-bold font-heading">
                <span>المرحلة الأولى: الأساس والمنظومة البصرية (Phase 1 Complete)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight">
                منظومة باقات WE للإنترنت المنزلي
              </h1>
              <p className="text-sm sm:text-base text-[#cbbae7] leading-relaxed">
                تم تأسيس بنية المشروع المتكاملة: نظام التصميم والهوية البصرية RTL، خطوط Readex Pro و IBM Plex Sans Arabic، عداد الجيجابايت المبتكر (GB Gauge)، قاعدة البيانات الموثقة بـ 34 باقة رسمية، وصلاحيات الأمان RLS.
              </p>
            </div>

            {/* Signature GB Gauge Showcase Widget */}
            <div className="bg-[#170828]/80 backdrop-blur-md p-6 rounded-3xl border border-[#A98BD6]/30 flex flex-col items-center justify-center shadow-2xl shrink-0">
              <span className="text-xs text-[#cbbae7] font-semibold mb-3">
                البصمة التصميمية: عداد الجيجابايت (GB Gauge)
              </span>
              <GBGauge
                quotaValue={500}
                quotaUnit="GB"
                tier="Super"
                size="lg"
                animated={true}
              />
              <span className="text-xs font-bold text-[#B9F03C] mt-3">
                سوبر 500 جيجابايت
              </span>
            </div>
          </div>
        </section>

        {/* Phase 1 Verification Checklist Box */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center shrink-0">
                <ShieldCheckIcon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold font-heading">قاعدة البيانات و RLS</h4>
                <p className="text-xs text-[#5E5873]">15 جدولاً مكتملة بالهجرة وسياسات الأمان ومنع الاحتيال.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center shrink-0">
                <ZapIcon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold font-heading">34 باقة معتمدة</h4>
                <p className="text-xs text-[#5E5873]">بيانات دقيقة 100% من البند 7 بلا أي أرقام أو باقات وهمية.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center shrink-0">
                <ClockIcon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold font-heading">حساب الـ 60 دقيقة خادمي</h4>
                <p className="text-xs text-[#5E5873]">حساب التنازلي على السيرفر ومزامنة ساعة العميل بدقة.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center shrink-0">
                <WalletIcon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold font-heading">بوابة الدفع اليدوية</h4>
                <p className="text-xs text-[#5E5873]">فودافون كاش (01034027398)، إنستاباي، اتصالات وأورنج كاش.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Catalog Explorer */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-[#5C2D91]" />
                <span className="text-xs font-bold text-[#5C2D91] uppercase tracking-wider">
                  كتالوج باقات WE المعتمد
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F]">
                اختر الباقة المناسبة لاستهلاكك المنزلي
              </h2>
              <p className="text-sm text-[#5E5873] mt-1">
                جميع الباقات محددة بسعة تحميل صريحة، والأسعار معتمدة ومطابقة للبند رقم 7.
              </p>
            </div>

            {/* Controls: Billing Period Switcher & Welcome Discount Demo Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <Tabs
                variant="period"
                items={periodTabs}
                activeId={selectedPeriod}
                onChange={(id) => setSelectedPeriod(id as BillingPeriod)}
              />

              <button
                type="button"
                onClick={() => setDemoDiscountActive(!demoDiscountActive)}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  demoDiscountActive
                    ? 'bg-[#FFF2EA] text-[#FF7A1A] border-[#FFD2B3]'
                    : 'bg-white text-[#5E5873] border-[#E5E7EB]'
                }`}
              >
                <span>معاينة خصم 50%</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                  {demoDiscountActive ? 'مفعّل' : 'معطل'}
                </span>
              </button>
            </div>
          </div>

          {/* Family Category Filter Tabs */}
          <div className="mb-8">
            <Tabs
              items={familyTabs}
              activeId={selectedFamily}
              onChange={(id) => setSelectedFamily(id)}
            />
          </div>

          {/* Grid of Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isDiscountEligible={demoDiscountActive}
                discountPercent={50}
                onSelect={(p) => setSelectedPlanForModal(p)}
              />
            ))}
          </div>

          {filteredPlans.length === 0 && (
            <div className="text-center py-16 bg-[#F4F5F7] rounded-2xl border border-dashed border-[#CBBAE7]">
              <p className="text-sm font-semibold text-[#5E5873]">
                لا توجد باقات متطابقة مع هذا الفلتر حالياً.
              </p>
            </div>
          )}
        </section>

        {/* Landline Validation & Interactive RTL Component Test */}
        <section className="bg-[#F4F5F7] py-14 px-4 sm:px-6 lg:px-8 border-t border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h3 className="text-xl font-bold font-heading text-[#14101F]">
                فحص التحقق من رقم التليفون الأرضي (013 القليوبية)
              </h3>
              <p className="text-xs text-[#5E5873] mt-1">
                اختبار عملي لمدخلات النموذج والتحقق التلقائي من كود المحافظة وطول الخط الأرضي وفقاً للضوابط في البند 10.1.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <Input
                label="رقم التليفون الأرضي لخط الإنترنت"
                prefixAddon="013"
                value={testLineNumber}
                onChange={(e) => setTestLineNumber(e.target.value)}
                placeholder="أدخل 7 أرقام بدون الكود"
                error={lineValidation.isValid ? undefined : lineValidation.errorAr}
                helperText={
                  lineValidation.isValid
                    ? '✓ الرقم مطابق لمواصفات الخطوط الأرضية لمحافظة القليوبية.'
                    : undefined
                }
              />

              <div className="pt-2 flex justify-center">
                <Button
                  variant="primary"
                  size="md"
                  disabled={!lineValidation.isValid}
                >
                  تأكيد رقم الخط والاستمرار
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
