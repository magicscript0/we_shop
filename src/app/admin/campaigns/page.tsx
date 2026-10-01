'use client';

import React, { useState } from 'react';
import { Button, Input, Badge } from '@/components/ui';
import { AlertTriangleIcon, CheckIcon, GiftIcon } from '@/components/ui/Icons';
import { formatEgp } from '@/lib/utils';

export default function AdminCampaignsPage() {
  const [isActive, setIsActive] = useState(true);
  const [percent, setPercent] = useState<number>(50);
  const [maxCap, setMaxCap] = useState<string>(''); // empty by default
  const [claimDays, setClaimDays] = useState<number>(7);
  const [excludeYearly, setExcludeYearly] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const campaignStats = {
    totalRedemptions: 24,
    totalDiscountEgp: 8250,
    activeEligibleUsers: 14,
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const isCapEmpty = !maxCap.trim();

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            إدارة الحملات والخصم الترحيبي
          </h1>
          <p className="text-xs text-[#5E5873]">
            التحكم في نسبة خصم الترحيب (50%)، سقف الخصم، مدة الصلاحية، ومراقبة تكلفة الحملة.
          </p>
        </div>

        <span className="text-xs font-bold text-[#FF7A1A] bg-[#FFF2EA] px-3 py-1.5 rounded-xl border border-[#FFD2B3]">
          حملة العملاء الجدد
        </span>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold animate-in fade-in">
          ✓ تم حفظ إعدادات الحملة الترويجية وتطبيقها فورياً على الخادم.
        </div>
      )}

      {/* Mandatory Warning when Cap is Empty (Section 9 & 12.6) */}
      {isCapEmpty && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 leading-relaxed flex items-start gap-3">
          <AlertTriangleIcon size={20} className="text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm mb-0.5">تنبيه مالي وإداري هام:</strong>
            سقف الخصم الأقصى غير محدد حالياً (فارغ). تطبيق خصم 50% بدون سقف أعلى قد يتسبب في خسائر مالية فادحة على الباقات السنوية والباهظة (مثل باقة ماكس السنوية 18 TB بقيمة 23,500 ج.م حيث سيصل الخصم إلى 11,750 ج.م). يُنصح بتحديد سقف (مثلاً 500 أو 1000 ج.م).
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Campaign Settings Form */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
            <h2 className="font-heading font-bold text-base text-[#14101F]">
              إعدادات خصم الترحيب (Welcome 50%)
            </h2>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {isActive ? 'الحملة مفعلة' : 'الحملة معطلة'}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="نسبة الخصم (%)"
              type="number"
              required
              min={1}
              max={100}
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              helperText="النسبة الافتراضية المعتمدة: 50% على أول طلب."
            />

            <Input
              label="سقف الخصم الأقصى بالجنيه (Max Discount Cap)"
              type="number"
              placeholder="اتركه فارغاً إذا كنت لا ترغب في وضع حد أقصى"
              value={maxCap}
              onChange={(e) => setMaxCap(e.target.value)}
              helperText="مثال: إذا حددت 1000 ج.م، فلن يتجاوز الخصم هذا المبلغ حتى لو كانت الباقة بـ 20,000 ج.م."
            />

            <Input
              label="فترة صلاحية الهدية بعد التسجيل (بالأيام)"
              type="number"
              required
              min={1}
              max={30}
              value={claimDays}
              onChange={(e) => setClaimDays(Number(e.target.value))}
              helperText="المهلة المحددة في النظام: 7 أيام من تاريخ إنشاء العميل لحسابه."
            />

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#14101F] font-semibold">
                <input
                  type="checkbox"
                  checked={excludeYearly}
                  onChange={(e) => setExcludeYearly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#5C2D91] focus:ring-[#5C2D91]"
                />
                <span>استثناء الباقات السنوية من الخصم (قصر الخصم على الباقات الشهرية فقط)</span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="md" className="mt-4">
              حفظ إعدادات الحملة فورياً
            </Button>
          </form>
        </div>

        {/* Campaign Cost Report Widget */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F4F5F7]">
            <GiftIcon size={20} className="text-[#FF7A1A]" />
            <h3 className="font-heading font-bold text-sm text-[#14101F]">
              تقرير تكلفة الحملة الترويجية
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FFF2EA] border border-[#FFD2B3] text-right space-y-1">
              <span className="text-[#8E8A9F] block">إجمالي تكلفة الخصم الممنوح:</span>
              <div className="text-2xl font-heading font-extrabold text-[#FF7A1A] tabular-nums">
                {formatEgp(campaignStats.totalDiscountEgp)}
              </div>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
              <span className="text-[#5E5873]">الطلبات المستفيدة:</span>
              <span className="font-bold text-[#14101F] font-mono">{campaignStats.totalRedemptions} طلب</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
              <span className="text-[#5E5873]">عملاء جدد مؤهلين حالياً:</span>
              <span className="font-bold text-[#5C2D91] font-mono">{campaignStats.activeEligibleUsers} عميل</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
