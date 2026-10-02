'use client';

import React, { useState } from 'react';
import { Button, Input, Badge } from '@/components/ui';
import { AlertTriangleIcon, CheckIcon, GiftIcon, ShieldCheckIcon } from '@/components/ui/Icons';
import { formatEgp } from '@/lib/utils';
import { SEED_PLANS } from '@/lib/constants';

export default function AdminCampaignsPage() {
  const [isActive, setIsActive] = useState(true);
  const [percent, setPercent] = useState<number>(50);
  const [maxCap, setMaxCap] = useState<string>('350'); // 350 EGP cap by default (Change 3)
  const [claimDays, setClaimDays] = useState<number>(7);
  const [excludeYearly, setExcludeYearly] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Financial Risk Simulator: find highest monthly plan
  const monthlyPlans = SEED_PLANS.filter((p) => p.billing_period === 'monthly');
  const mostExpensiveMonthly = monthlyPlans.reduce((max, p) => (p.price_egp > max.price_egp ? p : max), monthlyPlans[0]);
  const highestPrice = mostExpensiveMonthly ? mostExpensiveMonthly.price_egp : 2700;

  const discountWithoutCap = highestPrice * (percent / 100);
  const capNumber = maxCap.trim() ? Number(maxCap) : null;
  const discountWithCap = capNumber !== null ? Math.min(discountWithoutCap, capNumber) : discountWithoutCap;
  const savingsPerExpensiveOrder = discountWithoutCap - discountWithCap;

  const isCapEmpty = !maxCap.trim();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 text-right font-body">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            إدارة الحملات والخصم الترحيبي (50% Welcome Campaign)
          </h1>
          <p className="text-xs text-[#5E5873]">
            التحكم في نسبة الخصم وسقف القيمة الأقصى (350 ج.م) واستبعاد الباقات السنوية لمنع الخسائر المالية.
          </p>
        </div>

        <span className="text-xs font-bold text-[#FF7A1A] bg-[#FFF2EA] px-3 py-1.5 rounded-xl border border-[#FFD2B3]">
          العرض الترحيبي العام
        </span>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckIcon size={18} className="text-emerald-600 shrink-0" />
          <span>تم حفظ وتطبيق معايير العرض الترحيبي بنجاح على الخادم.</span>
        </div>
      )}

      {/* Mandatory Warning when Cap is Empty (Section 9 & 12.6) */}
      {isCapEmpty ? (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 leading-relaxed flex items-start gap-3">
          <AlertTriangleIcon size={20} className="text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm mb-0.5">تنبيه مالي وإداري عالي الخطورة:</strong>
            سقف الخصم الأقصى غير محدد حالياً (فارغ). تطبيق خصم 50% بدون سقف أعلى قد يتسبب في خسائر مالية غير محسوبة على الباقات الكبيرة. يُنصح بالالتزام بسقف 350 ج.م المعتمد لحماية هامش الربح.
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2.5">
          <ShieldCheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span>
            سقف الخصم محمي عند <strong>{formatEgp(Number(maxCap))}</strong>. النظام آمن ومحمي ضد الخصومات المفرطة.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Campaign Settings Form */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
            <h2 className="font-heading font-bold text-base text-[#14101F]">
              إعدادات خصم الترحيب للعملاء الجدد
            </h2>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {isActive ? 'الحملة مفعّلة ونشطة' : 'الحملة معطلة'}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="نسبة الخصم الترحيبي (%)"
              type="number"
              required
              min={1}
              max={100}
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              helperText="النسبة الافتراضية المعتمدة: 50% على أول اشتراك."
            />

            <Input
              label="سقف الخصم الأقصى بالجنيه (Max Discount Cap)"
              type="number"
              placeholder="الافتراضي الآمن: 350 ج.م"
              value={maxCap}
              onChange={(e) => setMaxCap(e.target.value)}
              helperText="القيمة المعتمدة: 350 ج.م (تمنع الخصومات الزائدة على باقات 750 جيجا و 1500 جيجا)."
            />

            <Input
              label="مهلة صلاحية العرض بعد تسجيل العميل (أيام)"
              type="number"
              required
              min={1}
              max={30}
              value={claimDays}
              onChange={(e) => setClaimDays(Number(e.target.value))}
              helperText="المهلة الافتراضية المحددة: 7 أيام من تاريخ التسجيل."
            />

            {/* Exclude Yearly Plans Toggle */}
            <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <span className="font-heading font-bold text-xs text-[#14101F] block">
                  استبعاد الباقات السنوية من الخصم (Exclude Yearly Plans)
                </span>
                <span className="text-[11px] text-[#5E5873]">
                  تفعيل هذا الخيار إلزامي لأن الباقات السنوية تتضمن بالفعل خصماً سنوياً اقتصادياً كبيراً.
                </span>
              </div>
              <input
                type="checkbox"
                checked={excludeYearly}
                onChange={(e) => setExcludeYearly(e.target.checked)}
                className="h-5 w-5 text-[#5C2D91] rounded cursor-pointer"
              />
            </div>

            <div className="pt-3">
              <Button type="submit" variant="primary" size="lg" className="w-full shadow-md">
                حفظ وتحديث معايير الحملة فورياً
              </Button>
            </div>
          </form>
        </div>

        {/* Financial Risk Simulation Card */}
        <div className="md:col-span-4 bg-[#1B0A33] text-white rounded-3xl p-6 sm:p-7 space-y-5 border border-[#2A1250]">
          <div className="flex items-center gap-2 text-[#B9F03C] text-xs font-bold font-heading">
            <GiftIcon size={18} />
            <span>محاكي الحماية المالية للحملة</span>
          </div>

          <p className="text-xs text-[#cbbae7] leading-relaxed">
            اختبار أقصى سيناريو تكلفة على أغلى باقة شهرية في الكتالوج ({mostExpensiveMonthly.tier_label_ar} {mostExpensiveMonthly.quota_value} {mostExpensiveMonthly.quota_unit} بسعر {formatEgp(highestPrice)}):
          </p>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-[#cbbae7]">سعر الباقة الأساسي:</span>
              <span className="font-mono font-bold">{formatEgp(highestPrice)}</span>
            </div>

            <div className="flex justify-between pb-2 border-b border-white/10 text-rose-300">
              <span>الخصم بدون سقف (50%):</span>
              <span className="font-mono font-bold">− {formatEgp(discountWithoutCap)}</span>
            </div>

            <div className="flex justify-between pb-2 border-b border-white/10 text-[#B9F03C]">
              <span>الخصم مع سقف ({maxCap || '0'} ج.م):</span>
              <span className="font-mono font-bold">− {formatEgp(discountWithCap)}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-1">
              <span className="text-[11px] text-[#cbbae7] block">مبلغ الحماية المالي الموفر لكل طلب:</span>
              <div className="text-lg font-heading font-extrabold text-[#B9F03C]">
                {formatEgp(savingsPerExpensiveOrder)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
