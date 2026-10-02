'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PlanCard } from '@/components/plans/PlanCard';
import { Button, Input, Badge } from '@/components/ui';
import { SEED_PLANS, getCheapestActivePlan } from '@/lib/constants';
import { PlanTier, BillingPeriod, Plan } from '@/types/database';
import { ArrowLeftRTL, ZapIcon } from '@/components/ui/Icons';
import { RealTrustMetrics } from '@/components/common/RealTrustMetrics';
import { PlanFinder } from '@/components/plans/PlanFinder';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'quota-desc' | 'quota-asc';

export default function PlansPage() {
  const cheapestPlan = getCheapestActivePlan();
  const [showPlanFinder, setShowPlanFinder] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedQuotaFilter, setSelectedQuotaFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const filteredAndSortedPlans = useMemo(() => {
    return SEED_PLANS.filter((plan) => {
      // 1. Text search match (matches family, quota number, unit, arabic tier label)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTier = plan.tier.toLowerCase().includes(query);
        const matchesTierAr = plan.tier_label_ar.includes(query);
        const matchesQuota = String(plan.quota_value).includes(query);
        const matchesPrice = String(plan.price_egp).includes(query);
        const matchesUnit = plan.quota_unit.toLowerCase().includes(query);

        if (!matchesTier && !matchesTierAr && !matchesQuota && !matchesPrice && !matchesUnit) {
          return false;
        }
      }

      // 2. Family match
      if (selectedFamily !== 'all') {
        if (!plan.tier.toLowerCase().includes(selectedFamily.toLowerCase())) {
          return false;
        }
      }

      // 3. Period match
      if (selectedPeriod !== 'all') {
        if (plan.billing_period !== selectedPeriod) {
          return false;
        }
      }

      // 4. Quota range match
      if (selectedQuotaFilter === 'small') {
        // Under 500 GB
        if (plan.quota_unit === 'TB' || plan.quota_value >= 500) return false;
      } else if (selectedQuotaFilter === 'medium') {
        // 500 GB to 1500 GB
        if (plan.quota_unit === 'TB' || plan.quota_value < 500 || plan.quota_value > 1500) return false;
      } else if (selectedQuotaFilter === 'large') {
        // Over 1500 GB (including yearly 1800GB - 9000GB)
        if (plan.quota_unit === 'TB' || plan.quota_value <= 1500) return false;
      } else if (selectedQuotaFilter === 'tb') {
        // Terabyte plans
        if (plan.quota_unit !== 'TB') return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price_egp - b.price_egp;
      if (sortBy === 'price-desc') return b.price_egp - a.price_egp;
      if (sortBy === 'quota-desc') {
        const valA = a.quota_unit === 'TB' ? a.quota_value * 1024 : a.quota_value;
        const valB = b.quota_unit === 'TB' ? b.quota_value * 1024 : b.quota_value;
        return valB - valA;
      }
      if (sortBy === 'quota-asc') {
        const valA = a.quota_unit === 'TB' ? a.quota_value * 1024 : a.quota_value;
        const valB = b.quota_unit === 'TB' ? b.quota_value * 1024 : b.quota_value;
        return valA - valB;
      }
      return a.sort_order - b.sort_order;
    });
  }, [searchQuery, selectedFamily, selectedPeriod, selectedQuotaFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFamily('all');
    setSelectedPeriod('all');
    setSelectedQuotaFilter('all');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] pb-20">
        {/* Page Banner */}
        <section className="bg-gradient-to-b from-[#2A1250] to-[#3A1C6E] text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-right space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C2D91] text-[#E9E0F5] text-xs font-semibold">
              <ZapIcon size={14} className="text-[#B9F03C]" />
              <span>الكتالوج الرسمي الكامل</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
              باقات WE للإنترنت المنزلي
            </h1>
            <p className="text-xs sm:text-sm text-[#cbbae7] max-w-2xl leading-relaxed">
              تصفح وقارن بين كافة الباقات المعتمدة ({SEED_PLANS.length} باقة رسمية) لسعات تبدأ من {cheapestPlan.quota_value} جيجابايت حتى 18 تيرابايت.
            </p>
          </div>
        </section>

        {/* Plan Finder Interactive Recommendation Tool */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F6F2FC] border border-[#CBBAE7]/60 p-4 sm:p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5C2D91] text-[#B9F03C] flex items-center justify-center font-bold text-lg shrink-0">
                🎯
              </div>
              <div className="text-right">
                <strong className="text-sm font-heading font-extrabold text-[#2A1250] block">
                  محتار ومش عارف تختار الباقة الأنسب لاستهلاك بيتك؟
                </strong>
                <span className="text-xs text-[#5E5873]">
                  أجب عن 3 أسئلة في 30 ثانية وسنرشح لك الباقة الأكثر توفيراً وتوافقاً مع سرعتك.
                </span>
              </div>
            </div>

            <Button
              variant={showPlanFinder ? 'outline' : 'primary'}
              size="sm"
              onClick={() => setShowPlanFinder(!showPlanFinder)}
              className="shrink-0 font-bold"
            >
              {showPlanFinder ? 'إخفاء أداة الترشيح ▲' : 'تشغيل مساعد الاختيار 🎯'}
            </Button>
          </div>

          {showPlanFinder && (
            <div className="mt-4 animate-in fade-in duration-200">
              <PlanFinder />
            </div>
          )}
        </section>

        {/* Filter & Control Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-md p-5 space-y-5">
            {/* Top row: Search input & Sorting */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8">
                <Input
                  placeholder="ابحث برقم السعة (مثلاً 500) أو اسم العائلة (سوبر، ميجا، ألترا)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefixAddon="بحث"
                />
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-2 text-right">
                <label className="text-xs font-semibold text-[#5E5873] whitespace-nowrap">
                  الترتيب:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full bg-[#F4F5F7] border border-[#E5E7EB] text-xs font-semibold text-[#14101F] rounded-xl px-3 py-3 focus:outline-none focus:border-[#5C2D91] cursor-pointer"
                >
                  <option value="default">الترتيب الرسمي الموصى به</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                  <option value="quota-desc">السعة: من الأكبر للأصغر</option>
                  <option value="quota-asc">السعة: من الأصغر للأكبر</option>
                </select>
              </div>
            </div>

            {/* Bottom row: Filter Chips */}
            <div className="pt-3 border-t border-[#F4F5F7] space-y-3">
              {/* Family Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="font-bold text-[#5E5873] shrink-0">العائلة:</span>
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'super', label: 'سوبر' },
                  { id: 'mega', label: 'ميجا' },
                  { id: 'ultra', label: 'ألترا' },
                  { id: 'max', label: 'ماكس' },
                  { id: 'elite', label: 'إليت' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFamily(f.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 border ${
                      selectedFamily === f.id
                        ? 'bg-[#5C2D91] text-white border-[#5C2D91]'
                        : 'bg-white text-[#5E5873] border-[#E5E7EB] hover:bg-[#F4F5F7]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Period & Quota Range Chips */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#5E5873] shrink-0">الفترة:</span>
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'monthly', label: 'شهري' },
                    { id: 'yearly', label: 'سنوي' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPeriod(p.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer border ${
                        selectedPeriod === p.id
                          ? 'bg-[#2A1250] text-[#B9F03C] border-[#2A1250]'
                          : 'bg-white text-[#5E5873] border-[#E5E7EB] hover:bg-[#F4F5F7]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#5E5873] shrink-0">السعة:</span>
                  {[
                    { id: 'all', label: 'كافة السعات' },
                    { id: 'small', label: 'أقل من 500 GB' },
                    { id: 'medium', label: '500 - 1500 GB' },
                    { id: 'large', label: 'أكثر من 1500 GB' },
                    { id: 'tb', label: 'باقات التيرا (TB)' },
                  ].map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuotaFilter(q.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer border ${
                        selectedQuotaFilter === q.id
                          ? 'bg-[#4A2480] text-white border-[#4A2480]'
                          : 'bg-white text-[#5E5873] border-[#E5E7EB] hover:bg-[#F4F5F7]'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Counter Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex items-center justify-between text-xs text-[#5E5873]">
            <div className="flex items-center gap-2">
              <span>عرض</span>
              <span className="font-bold text-[#14101F] tabular-nums text-sm">
                {filteredAndSortedPlans.length}
              </span>
              <span>باقة متطابقة</span>
            </div>

            {(searchQuery ||
              selectedFamily !== 'all' ||
              selectedPeriod !== 'all' ||
              selectedQuotaFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-[#5C2D91] hover:underline font-bold cursor-pointer"
              >
                إعادة ضبط الفلاتر ↺
              </button>
            )}
          </div>
        </section>

        {/* Catalog Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {filteredAndSortedPlans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={() => {
                    window.location.href = `/plans/${plan.slug}`;
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#CBBAE7] p-8 max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-lg text-[#14101F]">
                لا توجد باقات متطابقة مع هذا البحث
              </h3>
              <p className="text-xs text-[#5E5873]">
                جرب تغيير خيارات الفلترة أو كتابة رقم سعة مختلف مثل (500 أو 250 أو 18).
              </p>
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                إلغاء الفلاتر وعرض الكل
              </Button>
            </div>
          )}
        </section>

        {/* Real Trust Metrics Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
          <RealTrustMetrics variant="banner" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
