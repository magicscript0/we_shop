'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input, Button, Badge, GBGauge } from '@/components/ui';
import { SEED_PLANS, GOVERNORATE_CODES } from '@/lib/constants';
import { isValidWeLineNumber, formatEgp } from '@/lib/utils';
import { calculatePlanPricing } from '@/lib/services/pricing';
import {
  RouterIcon,
  ArrowLeftRTL,
  ShieldCheckIcon,
  ClockIcon,
  CheckIcon,
  ZapIcon,
} from '@/components/ui/Icons';
import { Plan } from '@/types/database';

export interface SavedLine {
  id: string;
  lineNumber: string;
  governorateCode: string;
  label?: string;
  lastPlanId: string;
  lastRechargedAt: string; // ISO date
}

const SAVED_LINES_STORAGE_KEY = 'we_saved_lines';

export default function RenewPage() {
  const router = useRouter();

  // Saved Lines State
  const [savedLines, setSavedLines] = useState<SavedLine[]>([]);
  const [saveCurrentLine, setSaveCurrentLine] = useState(true);
  const [lineLabel, setLineLabel] = useState('');

  // Form State
  const [governorateCode, setGovernorateCode] = useState('013');
  const [lineNumber, setLineNumber] = useState<string>('');
  const [confirmLineNumber, setConfirmLineNumber] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(SEED_PLANS[0].id);

  // Load saved lines on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_LINES_STORAGE_KEY);
      if (stored) {
        setSavedLines(JSON.parse(stored));
      } else {
        // Initial sample saved line for demonstration
        const defaultSample: SavedLine[] = [
          {
            id: 'line-home-1',
            lineNumber: '3214567',
            governorateCode: '013',
            label: 'إنترنت المنزل (القليوبية)',
            lastPlanId: '1', // Super 200GB
            lastRechargedAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(), // 27 days ago
          },
        ];
        setSavedLines(defaultSample);
        localStorage.setItem(SAVED_LINES_STORAGE_KEY, JSON.stringify(defaultSample));
      }
    } catch {
      // ignore
    }
  }, []);

  const validation = isValidWeLineNumber(lineNumber, governorateCode);
  const isMatch = lineNumber.trim() === confirmLineNumber.trim() && lineNumber.trim().length > 0;
  const selectedPlan: Plan =
    SEED_PLANS.find((p) => p.id === selectedPlanId) || SEED_PLANS[0];

  // Pricing with 14% VAT
  const pricing = calculatePlanPricing(selectedPlan.price_egp, null);

  const handleQuickRenew = (line: SavedLine) => {
    router.push(
      `/checkout?planId=${line.lastPlanId}&line=${line.lineNumber}&code=${line.governorateCode}`
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid || !isMatch) return;

    if (saveCurrentLine) {
      const newLine: SavedLine = {
        id: `line-${Date.now()}`,
        lineNumber: lineNumber.trim(),
        governorateCode,
        label: lineLabel.trim() || `خط أرضي (${governorateCode})`,
        lastPlanId: selectedPlan.id,
        lastRechargedAt: new Date().toISOString(),
      };

      const updated = [newLine, ...savedLines.filter((l) => l.lineNumber !== lineNumber.trim())];
      setSavedLines(updated);
      try {
        localStorage.setItem(SAVED_LINES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    router.push(
      `/checkout?planId=${selectedPlan.id}&line=${lineNumber.trim()}&code=${governorateCode}`
    );
  };

  const handleDeleteSavedLine = (id: string) => {
    const updated = savedLines.filter((l) => l.id !== id);
    setSavedLines(updated);
    try {
      localStorage.setItem(SAVED_LINES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F] font-body">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-right space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0F5] text-[#5C2D91] text-xs font-semibold">
              <ZapIcon size={14} />
              <span>التجديد الذكي بنقرة واحدة (Smart 1-Click Renewal)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#14101F]">
              تجديد باقة الإنترنت المنزلي لخطك
            </h1>
            <p className="text-xs sm:text-sm text-[#5E5873]">
              جدد باقتك فورياً دون إعادة إدخال البيانات في كل مرة، مع تتبع مواعيد انتهاء السعة الشهرية.
            </p>
          </div>

          {/* Section 1: Saved Lines with Expiry Estimation */}
          {savedLines.length > 0 && (
            <div className="space-y-4 text-right">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-base text-[#14101F] flex items-center gap-2">
                  <RouterIcon size={18} className="text-[#5C2D91]" />
                  <span>خطوطك المحفوظة للتجديد السريع</span>
                </h2>
                <span className="text-xs text-[#5E5873]">
                  {savedLines.length} خط مسجل في المتصفح
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedLines.map((line) => {
                  const linePlan = SEED_PLANS.find((p) => p.id === line.lastPlanId) || SEED_PLANS[0];
                  const linePricing = calculatePlanPricing(linePlan.price_egp, null);

                  // Calculate estimated days since recharge (30-day billing cycle)
                  const rechargeTime = new Date(line.lastRechargedAt).getTime();
                  const daysPassed = Math.floor((Date.now() - rechargeTime) / (1000 * 60 * 60 * 24));
                  const daysLeft = Math.max(0, 30 - daysPassed);
                  const isExpiringSoon = daysLeft <= 3 && daysLeft > 0;
                  const isExpired = daysLeft === 0;

                  return (
                    <div
                      key={line.id}
                      className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-[#5C2D91] p-5 space-y-4 shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#5C2D91] block">
                            {line.label || 'خط إنترنت منزلي'}
                          </span>
                          <div className="font-mono font-extrabold text-lg text-[#14101F] tracking-wider mt-0.5" dir="ltr">
                            ({line.governorateCode}) {line.lineNumber}
                          </div>
                        </div>

                        {/* Expiry Estimation Badge */}
                        {isExpired ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            انتهت الباقة الشهرية
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                            متبقي {daysLeft} أيام فقط
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            نشط • متبقي {daysLeft} يوماً
                          </span>
                        )}
                      </div>

                      <div className="p-3 rounded-2xl bg-[#F6F2FC] border border-[#CBBAE7]/40 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[#5E5873] block text-[11px]">الباقة المعتادة:</span>
                          <span className="font-bold text-[#14101F]">
                            {linePlan.tier_label_ar} {linePlan.quota_value} {linePlan.quota_unit}
                          </span>
                        </div>
                        <div className="text-left font-mono font-bold text-[#5C2D91]">
                          {linePricing.formatted_total_due}
                          <span className="text-[10px] text-[#8E8A9F] block font-normal">شامل 14% ضريبة</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedLine(line.id)}
                          className="text-[11px] text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          إزالة الخط
                        </button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleQuickRenew(line)}
                          rightIcon={<ArrowLeftRTL size={16} />}
                          className="shadow-sm"
                        >
                          تجديد الآن بنقرة واحدة
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Enter or Renew another line */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-8 space-y-6 text-right">
            <h2 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
              تجديد خط أرضي جديد أو باقة مختلفة
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#14101F]">
                    كود المحافظة التابع لها الخط:
                  </label>
                  <select
                    value={governorateCode}
                    onChange={(e) => setGovernorateCode(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#14101F] cursor-pointer"
                  >
                    {Object.entries(GOVERNORATE_CODES).map(([code, label]) => (
                      <option key={code} value={code}>
                        ({code}) {label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="تسمية الخط (اختياري)"
                  placeholder="مثال: إنترنت البيت، المكتب، الوالد..."
                  value={lineLabel}
                  onChange={(e) => setLineLabel(e.target.value)}
                />
              </div>

              {/* Landline Number & Confirmation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="رقم التليفون الأرضي (7 أرقام)"
                  prefixAddon={governorateCode}
                  placeholder="أدخل أرقام الخط"
                  required
                  value={lineNumber}
                  onChange={(e) => setLineNumber(e.target.value)}
                  error={lineNumber.length > 0 && !validation.isValid ? validation.errorAr : undefined}
                />

                <Input
                  label="تأكيد رقم الخط الأرضي ثانية"
                  prefixAddon={governorateCode}
                  placeholder="أعد كتابة الرقم للتأكيد"
                  required
                  value={confirmLineNumber}
                  onChange={(e) => setConfirmLineNumber(e.target.value)}
                  error={
                    confirmLineNumber.length > 0 && !isMatch
                      ? 'رقما الخط الأرضي غير متطابقين.'
                      : undefined
                  }
                />
              </div>

              {/* Plan Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#14101F]">
                  اختر الباقة المراد تجديدها:
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl px-4 py-3.5 text-xs sm:text-sm font-bold text-[#14101F] cursor-pointer"
                >
                  {SEED_PLANS.map((p) => {
                    const planP = calculatePlanPricing(p.price_egp, null);
                    return (
                      <option key={p.id} value={p.id}>
                        {p.tier_label_ar} - {p.quota_value} {p.quota_unit} ({p.billing_period === 'yearly' ? 'سنوي' : 'شهري'}) — {planP.formatted_total_due} (شامل 14% ضريبة)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Pricing Breakdown Card */}
              <div className="p-4 rounded-2xl bg-[#F6F2FC] border border-[#CBBAE7]/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#5E5873] block">المبلغ المطلوب سداده:</span>
                  <div className="text-2xl font-heading font-extrabold text-[#5C2D91] tabular-nums mt-0.5">
                    {pricing.formatted_total_due}
                  </div>
                  <span className="text-[11px] text-[#8E8A9F]">
                    يشمل {pricing.formatted_base} أساسي + {pricing.formatted_vat} ضريبة (14%)
                  </span>
                </div>

                <Badge variant="family" tier={selectedPlan.tier}>
                  {selectedPlan.tier_label_ar} {selectedPlan.quota_value} {selectedPlan.quota_unit}
                </Badge>
              </div>

              {/* Save line checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#14101F] font-semibold select-none">
                <input
                  type="checkbox"
                  checked={saveCurrentLine}
                  onChange={(e) => setSaveCurrentLine(e.target.checked)}
                  className="h-4 w-4 text-[#5C2D91] rounded"
                />
                <span>حفظ هذا الخط للتجديد السريع والمتابعة بنقرة واحدة مستقبلاً</span>
              </label>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-between shadow-md"
                disabled={!validation.isValid || !isMatch}
                rightIcon={<ArrowLeftRTL size={20} />}
              >
                متابعة لتأكيد التجديد والسداد
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
