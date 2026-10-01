'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import {
  ClockIcon,
  ShieldCheckIcon,
  ZapIcon,
  WalletIcon,
  ArrowLeftRTL,
  CheckIcon,
} from '@/components/ui/Icons';
import { formatEgp } from '@/lib/utils';

export default function AdminOverviewPage() {
  const metrics = {
    pendingOrdersCount: 3,
    salesToday: 4290,
    salesWeek: 28450,
    salesMonth: 112800,
    ordersTodayCount: 11,
    avgReviewTimeMinutes: 4.2,
    discountCostMonth: 8250,
    completionRate: 96.4,
  };

  const familyDistribution = [
    { name: 'سوبر (Super)', percent: 55, count: 68, color: '#5C2D91' },
    { name: 'ميجا (Mega)', percent: 25, count: 31, color: '#4A2480' },
    { name: 'ألترا (Ultra)', percent: 12, count: 15, color: '#3A1C6E' },
    { name: 'ماكس (Max)', percent: 6, count: 7, color: '#2A1250' },
    { name: 'إليت (Elite)', percent: 2, count: 2, color: '#CBB26A' },
  ];

  const weeklySalesData = [
    { day: 'السبت', amount: 3100, height: '45%' },
    { day: 'الأحد', amount: 4200, height: '60%' },
    { day: 'الاثنين', amount: 3800, height: '52%' },
    { day: 'الثلاثاء', amount: 5600, height: '80%' },
    { day: 'الأربعاء', amount: 4900, height: '70%' },
    { day: 'الخميس', amount: 6850, height: '100%' },
    { day: 'الجمعة', amount: 4290, height: '62%' },
  ];

  return (
    <div className="space-y-8 text-right">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F]">
            لوحة المؤشرات والعمليات العامة
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5873] mt-0.5">
            متابعة حية للمبيعات، إيصالات التحويل، وسرعة تفعيل باقات الإنترنت المنزلي.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/verification">
            <Button variant="primary" size="md" rightIcon={<ZapIcon size={18} />}>
              فتح طابور التحقق ({metrics.pendingOrdersCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Metric 1: Pending Orders Alert Banner (Most Prominent) */}
      <div className="bg-gradient-to-r from-[#2A1250] to-[#5C2D91] text-white p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#A98BD6]/30">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#B9F03C] text-[#1B0A33] flex items-center justify-center font-heading font-extrabold text-3xl shadow-lg shrink-0">
            {metrics.pendingOrdersCount}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B9F03C]/20 text-[#B9F03C] text-xs font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-[#B9F03C] animate-pulse" />
              <span>مطلوب مراجعة واعتماد الحوالات فورياً</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading">
              طابور مراجعة إيصالات الدفع (Payment Verification Queue)
            </h2>
            <p className="text-xs text-[#cbbae7] mt-0.5 max-w-xl">
              يوجد حالياً {metrics.pendingOrdersCount} طلبات قام العملاء برفع إيصالات تحويلها وبانتظار المطابقة وتفعيل الخطوط.
            </p>
          </div>
        </div>

        <Link href="/admin/verification" className="shrink-0 w-full md:w-auto">
          <Button variant="primary" size="lg" className="w-full md:w-auto px-6">
            بدء المراجعة والاعتماد ↗
          </Button>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Sales Today */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5E5873]">
            <span className="font-bold">مبيعات اليوم:</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              {metrics.ordersTodayCount} طلبات
            </span>
          </div>
          <div className="text-2xl font-extrabold font-heading text-[#14101F] tabular-nums">
            {formatEgp(metrics.salesToday)}
          </div>
          <span className="text-[11px] text-[#8E8A9F] block">محدث لحظياً عبر Realtime</span>
        </div>

        {/* Sales This Week */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#5E5873] block">مبيعات الأسبوع الحالي:</span>
          <div className="text-2xl font-extrabold font-heading text-[#14101F] tabular-nums">
            {formatEgp(metrics.salesWeek)}
          </div>
          <span className="text-[11px] text-[#5C2D91] font-semibold block">إجمالي 7 أيام متتالية</span>
        </div>

        {/* Sales This Month */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-2">
          <span className="text-xs font-bold text-[#5E5873] block">إجمالي مبيعات الشهر:</span>
          <div className="text-2xl font-extrabold font-heading text-[#14101F] tabular-nums">
            {formatEgp(metrics.salesMonth)}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block">معدل نمو مستقر</span>
        </div>

        {/* Avg Review Time & Completion */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5E5873]">
            <span className="font-bold">متوسط وقت المراجعة:</span>
            <span className="text-xs font-mono font-bold text-[#5C2D91]">
              {metrics.avgReviewTimeMinutes} دقيقة
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-[#5E5873]">نسبة إنجاز الطلبات:</span>
            <span className="text-xl font-heading font-extrabold text-emerald-600 tabular-nums">
              {metrics.completionRate}%
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs pt-1 border-t border-[#F4F5F7]">
            <span className="text-[#8E8A9F]">تكلفة خصم الترحيب (الشهر):</span>
            <span className="font-bold text-[#FF7A1A] tabular-nums">
              {formatEgp(metrics.discountCostMonth)}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart 1: Daily Sales Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
            <div>
              <h3 className="font-heading font-bold text-base text-[#14101F]">
                حركة المبيعات اليومية خلال الأسبوع
              </h3>
              <p className="text-xs text-[#5E5873] mt-0.5">
                توزيع إجمالي التحويلات المؤكدة بالجنيه المصري لكل يوم.
              </p>
            </div>
            <span className="text-xs font-bold text-[#5C2D91] bg-[#F6F2FC] px-2.5 py-1 rounded-lg">
              آخر 7 أيام
            </span>
          </div>

          {/* Pure CSS Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2" dir="rtl">
            {weeklySalesData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-[#5C2D91] opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  {item.amount} ج.م
                </span>
                <div
                  className="w-full max-w-[42px] bg-gradient-to-t from-[#2A1250] to-[#5C2D91] group-hover:to-[#B9F03C] rounded-t-xl transition-all duration-300"
                  style={{ height: item.height }}
                />
                <span className="text-xs font-semibold text-[#5E5873] mt-1">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Family Distribution Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-6">
          <div className="pb-3 border-b border-[#F4F5F7]">
            <h3 className="font-heading font-bold text-base text-[#14101F]">
              توزيع الطلبات حسب العائلة
            </h3>
            <p className="text-xs text-[#5E5873] mt-0.5">
              نسبة الإقبال على عائلات الباقات المختلفة.
            </p>
          </div>

          <div className="space-y-4">
            {familyDistribution.map((fam) => (
              <div key={fam.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: fam.color }}
                    />
                    <span>{fam.name}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[#14101F]">
                    {fam.percent}% ({fam.count} طلب)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F4F5F7] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${fam.percent}%`,
                      backgroundColor: fam.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#F4F5F7] text-center">
            <Link
              href="/admin/plans"
              className="text-xs font-bold text-[#5C2D91] hover:underline"
            >
              إدارة وتعديل أسعار الباقات ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
