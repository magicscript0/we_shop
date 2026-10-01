'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input, Button, Tabs, Badge } from '@/components/ui';
import { SEED_PLANS } from '@/lib/constants';
import { isValidWeLineNumber, formatEgp } from '@/lib/utils';
import { RouterIcon, ArrowLeftRTL, ShieldCheckIcon } from '@/components/ui/Icons';
import { Plan } from '@/types/database';

export default function RenewPage() {
  const [lineNumber, setLineNumber] = useState<string>('');
  const [confirmLineNumber, setConfirmLineNumber] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(SEED_PLANS[5].id); // default 500GB

  const validation = isValidWeLineNumber(lineNumber, '013');
  const isMatch = lineNumber === confirmLineNumber && lineNumber.length > 0;
  const selectedPlan = SEED_PLANS.find((p) => p.id === selectedPlanId) || SEED_PLANS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0F5] text-[#5C2D91] text-xs font-semibold">
              <RouterIcon size={14} />
              <span>تجديد مباشر ومعتمد</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F]">
              تجديد باقة الإنترنت المنزلي
            </h1>
            <p className="text-xs sm:text-sm text-[#5E5873]">
              أدخل رقم خطك الأرضي بدقة واختر الباقة المطلوبة للتجديد الفوري.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-8 space-y-6">
            {/* Landline Number & Confirmation */}
            <div className="space-y-4">
              <Input
                label="رقم التليفون الأرضي لخط الإنترنت"
                prefixAddon="013"
                placeholder="أدخل 7 أرقام الخط بدون الكود"
                value={lineNumber}
                onChange={(e) => setLineNumber(e.target.value)}
                error={lineNumber.length > 0 && !validation.isValid ? validation.errorAr : undefined}
                helperText="كود محافظة القليوبية الافتراضي: 013"
              />

              <Input
                label="تأكيد رقم التليفون الأرضي مرة ثانية"
                prefixAddon="013"
                placeholder="أعد كتابة الـ 7 أرقام للتأكيد"
                value={confirmLineNumber}
                onChange={(e) => setConfirmLineNumber(e.target.value)}
                error={
                  confirmLineNumber.length > 0 && lineNumber !== confirmLineNumber
                    ? 'الأرقام المدخلة غير متطابقة. يرجى التأكد لتجنب شحن خط آخر بالخطأ.'
                    : undefined
                }
              />
            </div>

            {/* Plan Selector */}
            <div className="space-y-2 text-right">
              <label className="block text-sm font-semibold text-[#14101F]">
                اختر الباقة المراد تجديدها:
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl px-4 py-3.5 text-sm font-bold text-[#14101F] focus:outline-none focus:border-[#5C2D91] cursor-pointer"
              >
                {SEED_PLANS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.tier_label_ar} - {p.quota_value} {p.quota_unit} ({p.billing_period === 'yearly' ? 'سنوي' : 'شهري'}) - {formatEgp(p.price_egp)}
                  </option>
                ))}
              </select>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-[#F6F2FC] border border-[#CBBAE7]/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#5E5873]">إجمالي قيمة الباقة:</span>
                <div className="text-xl font-heading font-extrabold text-[#14101F] tabular-nums mt-0.5">
                  {formatEgp(selectedPlan.price_egp)}
                </div>
              </div>
              <Badge variant="family" tier={selectedPlan.tier}>
                {selectedPlan.tier_label_ar} {selectedPlan.quota_value} {selectedPlan.quota_unit}
              </Badge>
            </div>

            {/* Submit Action */}
            <Link
              href={
                validation.isValid && isMatch
                  ? `/checkout?planId=${selectedPlan.id}&line=${lineNumber}&code=013`
                  : '#'
              }
              className={validation.isValid && isMatch ? '' : 'pointer-events-none opacity-50'}
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-between mt-2"
                disabled={!validation.isValid || !isMatch}
                rightIcon={<ArrowLeftRTL size={20} />}
              >
                متابعة للدفع وتأكيد التجديد
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-[#5E5873] pt-2">
              <ShieldCheckIcon size={14} className="text-[#5C2D91]" />
              <span>يتم مراجعة وتفعيل التجديد على خطك فور تأكيد التحويل</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
