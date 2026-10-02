'use client';

import React, { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { formatEgp } from '@/lib/utils';
import { ShieldCheckIcon, ClockIcon, CheckIcon, AlertTriangleIcon } from '@/components/ui/Icons';

interface FunnelStep {
  id: string;
  stepNumber: number;
  label: string;
  count: number;
  dropOffCount: number;
  dropOffRate: string;
  conversionFromPrev: string;
  overallRate: string;
  color: string;
  notes: string;
}

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const methodStats = [
    { method: 'فودافون كاش', total: 64200, count: 82, share: 57 },
    { method: 'إنستاباي (InstaPay)', total: 38100, count: 34, share: 34 },
    { method: 'اتصالات كاش', total: 6500, count: 6, share: 6 },
    { method: 'أورنج كاش', total: 4000, count: 4, share: 3 },
  ];

  const rateMetrics = {
    totalOrders: 126,
    completed: 121,
    rejected: 3,
    expired: 2,
    completionRate: '96.0%',
    rejectionRate: '2.4%',
    expiryRate: '1.6%',
    avgReviewTime: '4.2 دقيقة',
  };

  // Funnel Analytics Data (مسار التحويل والشراء)
  const funnelSteps: FunnelStep[] = [
    {
      id: 'catalog',
      stepNumber: 1,
      label: 'استعراض الكتالوج والباقات',
      count: 10420,
      dropOffCount: 6570,
      dropOffRate: '63.0%',
      conversionFromPrev: '100%',
      overallRate: '100%',
      color: 'from-purple-900 to-indigo-800',
      notes: 'زيارات صفحات /plans وتصفح الباقات المختلفة',
    },
    {
      id: 'line_entry',
      stepNumber: 2,
      label: 'إدخال وتأكيد الخط الأرضي',
      count: 3850,
      dropOffCount: 1730,
      dropOffRate: '44.9%',
      conversionFromPrev: '36.9%',
      overallRate: '36.9%',
      color: 'from-indigo-800 to-blue-700',
      notes: 'التحقق من كود المحافظة وصحة رقم التليفون الأرضي',
    },
    {
      id: 'gateway',
      stepNumber: 3,
      label: 'حجز الحساب وتأمين البوابة (60 دقيقة)',
      count: 2120,
      dropOffCount: 280,
      dropOffRate: '13.2%',
      conversionFromPrev: '55.1%',
      overallRate: '20.3%',
      color: 'from-blue-700 to-cyan-600',
      notes: 'تخصيص محفظة سداد نشطة وبدء عداد الحجز',
    },
    {
      id: 'proof_submitted',
      stepNumber: 4,
      label: 'رفع إثبات التحويل ورقم العملية',
      count: 1840,
      dropOffCount: 50,
      dropOffRate: '2.7%',
      conversionFromPrev: '86.8%',
      overallRate: '17.7%',
      color: 'from-cyan-600 to-emerald-600',
      notes: 'إرفاق لقطة شاشة وبيانات رقم المحفظة المرسلة',
    },
    {
      id: 'verified',
      stepNumber: 5,
      label: 'التحقق والشحن المعتمد بنجاح',
      count: 1790,
      dropOffCount: 0,
      dropOffRate: '0.0%',
      conversionFromPrev: '97.3%',
      overallRate: '17.2%',
      color: 'from-emerald-600 to-emerald-500',
      notes: 'مطابقة الحوالة وشحن رصيد الخط رسمياً وإصدار الفاتورة',
    },
  ];

  const handleExportReport = () => {
    alert('جاري إعداد وتحميل تقرير الأداء المالي والتشغيلي الشامل بصيغة PDF / Excel...');
  };

  return (
    <div className="space-y-8 text-right font-body" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            التقارير ومسار الشراء والتحويل (Funnel Analytics)
          </h1>
          <p className="text-xs text-[#5E5873]">
            متابعة دقيقة لمراحل الشراء، ونسب التسرب بين الخطوات، وتوزيع المبيعات بحسب وسائل الدفع.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-xl border border-[#E5E7EB] p-1 text-xs">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                  timeRange === r
                    ? 'bg-[#5C2D91] text-white shadow-xs'
                    : 'text-[#5E5873] hover:text-[#14101F]'
                }`}
              >
                {r === '7d' ? 'آخر 7 أيام' : r === '30d' ? 'آخر 30 يوماً' : 'آخر ربع سنوي'}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={handleExportReport}>
            تصدير التقرير ⤓
          </Button>
        </div>
      </div>

      {/* Operational Efficiency Rates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-1">
          <span className="text-xs text-[#5E5873]">معدل التحويل الكلي (End-to-End):</span>
          <div className="text-2xl font-extrabold font-heading text-emerald-600">
            17.2%
          </div>
          <span className="text-[11px] text-[#8E8A9F] block">1,790 تفعيل ناجح من 10,420 زيارة</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-1">
          <span className="text-xs text-[#5E5873]">متوسط وقت المراجعة والاعتماد:</span>
          <div className="text-2xl font-extrabold font-heading text-[#5C2D91]">
            {rateMetrics.avgReviewTime}
          </div>
          <span className="text-[11px] text-[#8E8A9F] block">من رفع الإيصال حتى التفعيل</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-1">
          <span className="text-xs text-[#5E5873]">معدل رفض الإيصالات (Rejection):</span>
          <div className="text-2xl font-extrabold font-heading text-rose-600">
            {rateMetrics.rejectionRate}
          </div>
          <span className="text-[11px] text-[#8E8A9F] block">{rateMetrics.rejected} طلبات مرفوضة مع ذكر السبب</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-1">
          <span className="text-xs text-[#5E5873]">معدل انقضاء العداد (Expiry):</span>
          <div className="text-2xl font-extrabold font-heading text-amber-600">
            {rateMetrics.expiryRate}
          </div>
          <span className="text-[11px] text-[#8E8A9F] block">{rateMetrics.expired} طلبات لم يتم رفع إيصال لها</span>
        </div>
      </div>

      {/* Visual Conversion Funnel (مسار الشراء) */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F4F5F7]">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-[#14101F]">
              مسار الشراء والتحويل المباشر (Conversion Funnel)
            </h2>
            <p className="text-xs text-[#5E5873] mt-0.5">
              متابعة تدفق العملاء خطوة بخطوة وتحديد نقاط التسرب وفرص تحسين تجربة المستخدم.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              نسبة اكتمال الإيصالات: 97.3%
            </span>
          </div>
        </div>

        {/* Funnel Visual Stack */}
        <div className="space-y-4">
          {funnelSteps.map((step, idx) => {
            const widthPercent = Math.max(18, Math.round((step.count / funnelSteps[0].count) * 100));

            return (
              <div key={step.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2A1250] text-[#B9F03C] flex items-center justify-center font-bold text-[10px]">
                      {step.stepNumber}
                    </span>
                    <strong className="text-[#14101F] text-sm">{step.label}</strong>
                    <span className="text-[#8E8A9F] text-[11px]">({step.notes})</span>
                  </div>

                  <div className="flex items-center gap-4 text-left font-mono">
                    <span className="font-bold text-[#14101F] text-sm tabular-nums">
                      {step.count.toLocaleString()} مستخدم
                    </span>
                    <span className="text-xs text-[#5C2D91] font-bold bg-[#F6F2FC] px-2 py-0.5 rounded">
                      {step.overallRate} من الإجمالي
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-[#F4F5F7] h-7 rounded-xl overflow-hidden p-0.5 flex items-center">
                  <div
                    className={`h-full rounded-lg bg-gradient-to-r ${step.color} transition-all duration-500 flex items-center justify-between px-3 text-white text-[11px] font-bold`}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span>{widthPercent}%</span>
                    {idx > 0 && (
                      <span className="text-[10px] text-white/90">
                        تحويل من السابقة: {step.conversionFromPrev}
                      </span>
                    )}
                  </div>
                </div>

                {/* Drop-off Note if not final step */}
                {step.dropOffCount > 0 && (
                  <div className="flex items-center gap-2 text-[11px] text-rose-700 pr-7">
                    <span>تسرب في هذه المرحلة:</span>
                    <strong className="font-mono">{step.dropOffCount.toLocaleString()}</strong>
                    <span>({step.dropOffRate})</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Funnel Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#F4F5F7] text-xs">
          <div className="p-4 rounded-2xl bg-[#F6F2FC] border border-[#CBBAE7]/50 space-y-1">
            <span className="font-bold text-[#5C2D91] block">💡 أعلى نقطة تسرب (Drop-off):</span>
            <p className="text-[#5E5873] leading-relaxed">
              بين تصفح الكتالوج وإدخال رقم الخط الأرضي (63.0%). يرجع ذلك لزوار المقارنة السريعة قبل إحضار رقم الخط.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-800 block">⚡ أعلى نسبة تحويل (Conversion):</span>
            <p className="text-emerald-700 leading-relaxed">
              من رفع إثبات التحويل إلى الاعتماد والشحن (97.3%). يعكس وضوح التعليمات وتطابق أرقام المحافظ المحجوزة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="font-bold text-amber-800 block">⏱️ كفاءة نافذة الحجز (60 دقيقة):</span>
            <p className="text-amber-700 leading-relaxed">
              انقضاء المهلة لم يتجاوز 1.6% فقط من الحجوزات، ما يؤكد كفاية مهلة الـ 60 دقيقة لإتمام التحويل.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method Share Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
          توزيع المبيعات بحسب وسيلة الدفع (Payment Method Share)
        </h2>

        <div className="divide-y divide-[#F4F5F7]">
          {methodStats.map((item) => (
            <div key={item.method} className="py-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-sm font-bold text-[#14101F]">{item.method}</span>
                <span className="font-bold text-[#5C2D91] tabular-nums text-sm">
                  {formatEgp(item.total)} ({item.count} عملية • {item.share}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#F4F5F7] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2A1250] to-[#5C2D91] rounded-full"
                  style={{ width: `${item.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
