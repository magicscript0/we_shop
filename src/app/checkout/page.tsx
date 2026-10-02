'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input, Button, Badge, GBGauge } from '@/components/ui';
import { SEED_PLANS, SEED_PAYMENT_METHODS, GOVERNORATE_CODES } from '@/lib/constants';
import { isValidWeLineNumber, isValidEgyptianMobile, formatEgp } from '@/lib/utils';
import { calculateServerDiscount } from '@/lib/services/discount';
import { calculatePlanPricing, formatPriceEgp } from '@/lib/services/pricing';
import { ShieldCheckIcon, WalletIcon, ArrowLeftRTL, CheckIcon, AlertTriangleIcon, GiftIcon } from '@/components/ui/Icons';
import { OfferTermsModal } from '@/components/offer/OfferTermsModal';
import { Plan } from '@/types/database';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planIdParam = searchParams.get('planId') || searchParams.get('plan') || SEED_PLANS[5].id;
  const initialLineParam = searchParams.get('line') || '';
  const initialCodeParam = searchParams.get('code') || '013';

  // Find selected plan
  const selectedPlan: Plan =
    SEED_PLANS.find((p) => p.id === planIdParam || p.slug === planIdParam) || SEED_PLANS[5];

  // Form State
  const [governorateCode, setGovernorateCode] = useState(initialCodeParam);
  const [lineNumber, setLineNumber] = useState(initialLineParam);
  const [confirmLineNumber, setConfirmLineNumber] = useState(initialLineParam);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedMethodKey, setSelectedMethodKey] = useState('vodafone_cash');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation
  const lineValidation = isValidWeLineNumber(lineNumber, governorateCode);
  const linesMatch = lineNumber.trim() === confirmLineNumber.trim() && lineNumber.trim().length > 0;
  const phoneValid = isValidEgyptianMobile(customerPhone);

  // Server discount calculation preview (50% welcome discount for new customer)
  const discountCalculation = calculateServerDiscount({
    weLineNumber: lineNumber,
    customerPhone,
    plan: selectedPlan,
  });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!lineValidation.isValid) {
      setErrorMessage(lineValidation.errorAr || 'رقم الخط الأرضي غير صحيح');
      return;
    }

    if (!linesMatch) {
      setErrorMessage('رقما التليفون الأرضي غير متطابقين في الحقلين.');
      return;
    }

    if (!phoneValid) {
      setErrorMessage('رقم الهاتف المحمول غير صحيح. يجب أن يتكون من 11 رقماً.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('يجب الموافقة على الشروط وسياسة التحويل للاستمرار.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          weLineNumber: lineNumber.trim(),
          confirmWeLineNumber: confirmLineNumber.trim(),
          governorateCode,
          customerPhone: customerPhone.trim(),
          customerName: customerName.trim(),
          paymentMethodKey: selectedMethodKey,
          isNewCustomer: true,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'حدث خطأ أثناء إنشاء الطلب.');
        setIsLoading(false);
        return;
      }

      // Save order snapshot locally for instant payment gateway access
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`order_${data.orderId}`, JSON.stringify(data.order));
      }

      // Redirect directly to the 60-minute Payment Gateway page
      router.push(`/pay/${data.orderId}`);
    } catch {
      setErrorMessage('تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-right space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0F5] text-[#5C2D91] text-xs font-semibold">
          <ShieldCheckIcon size={14} />
          <span>إنهاء الطلب وحجز الباقة</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F]">
          تأكيد بيانات الخط واختيار وسيلة الدفع
        </h1>
        <p className="text-xs sm:text-sm text-[#5E5873]">
          يرجى مراجعة تفاصيل الباقة ورقم الخط الأرضي بدقة قبل الانتقال إلى بوابة الدفع.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 font-semibold text-right flex items-center gap-2">
          <AlertTriangleIcon size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Right Column: Line details & Payment methods */}
        <div className="md:col-span-7 space-y-6">
          {/* Box 1: Landline Details */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-5 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
              <h2 className="font-heading font-bold text-base text-[#14101F]">
                1. بيانات خط الإنترنت المنزلي (WE)
              </h2>
              <span className="text-[11px] font-bold text-[#5C2D91] bg-[#F6F2FC] px-2 py-0.5 rounded">
                إلزامي
              </span>
            </div>

            {/* Governorate code */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#14101F]">
                كود المحافظة التابع لها الخط الأرضي:
              </label>
              <select
                value={governorateCode}
                onChange={(e) => setGovernorateCode(e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#14101F] focus:outline-none focus:border-[#5C2D91] cursor-pointer"
              >
                {Object.entries(GOVERNORATE_CODES).map(([code, label]) => (
                  <option key={code} value={code}>
                    ({code}) {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Line Number Input */}
            <Input
              label="رقم التليفون الأرضي (بدون كود المحافظة)"
              prefixAddon={governorateCode}
              placeholder="أدخل 7 أرقام الخط"
              value={lineNumber}
              onChange={(e) => setLineNumber(e.target.value)}
              error={lineNumber.length > 0 && !lineValidation.isValid ? lineValidation.errorAr : undefined}
            />

            {/* Confirm Line Number Input (Section 10.1 requirement: Ask twice) */}
            <Input
              label="تأكيد رقم التليفون الأرضي مرة ثانية"
              prefixAddon={governorateCode}
              placeholder="أعد كتابة الرقم للتأكيد والتطابق"
              value={confirmLineNumber}
              onChange={(e) => setConfirmLineNumber(e.target.value)}
              error={
                confirmLineNumber.length > 0 && !linesMatch
                  ? 'رقما الخط الأرضي غير متطابقين.'
                  : undefined
              }
            />

            {/* Interactive Preview Box: "Is this your number?" (Section 10.1) */}
            {linesMatch && lineValidation.isValid && (
              <div className="p-4 rounded-2xl bg-[#E9E0F5]/50 border border-[#CBBAE7] text-right space-y-1 animate-in fade-in duration-200">
                <span className="text-xs font-bold text-[#5C2D91] block">
                  ✓ معاينة رقم الخط الأرضي المراد شحنه:
                </span>
                <div className="font-mono font-extrabold text-lg text-[#14101F] tracking-widest" dir="ltr">
                  ({governorateCode}) - {lineNumber.trim()}
                </div>
                <p className="text-[11px] text-[#5E5873]">
                  هل هذا هو رقم خطك الأرضي بالتأكيد؟ سيتم شحن الباقة على هذا الرقم مباشرة.
                </p>
              </div>
            )}

            {/* Customer mobile for updates */}
            <Input
              label="رقم هاتفك المحمول للتواصل وتأكيد الحوالة"
              placeholder="010XXXXXXXX"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              helperText="سنرسل لك إشعاراً فورياً على هذا الرقم عند اكتمال شحن وتفعيل الباقة."
            />
          </div>

          {/* Box 2: Payment Method Choice */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-5 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
              <h2 className="font-heading font-bold text-base text-[#14101F]">
                2. اختر وسيلة الدفع بالتحويل
              </h2>
              <span className="text-[11px] text-[#5E5873]">تحويل فوري بدون كروت</span>
            </div>

            <div className="space-y-3">
              {SEED_PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethodKey === method.key;
                return (
                  <label
                    key={method.key}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#5C2D91] bg-[#F6F2FC] ring-2 ring-[#5C2D91]/20'
                        : 'border-[#E5E7EB] bg-white hover:bg-[#F8F9FA]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.key}
                        checked={isSelected}
                        onChange={() => setSelectedMethodKey(method.key)}
                        className="h-4 w-4 text-[#5C2D91] focus:ring-[#5C2D91] cursor-pointer"
                      />
                      <div>
                        <span className="font-heading font-bold text-sm text-[#14101F] block">
                          {method.label_ar}
                        </span>
                        <span className="text-xs text-[#5E5873] block mt-0.5">
                          {method.sub_label || (method.key === 'instapay' ? 'تحويل لحظي مجاني' : 'محفظة إلكترونية')}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-[#5C2D91] bg-white px-2.5 py-1 rounded-lg border border-[#CBBAE7]">
                      {method.sub_label || (method.key === 'instapay' ? 'فوري مجاني' : 'محفظة إلكترونية')}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Left Column: Plan Summary, Pricing & Submit */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-7 space-y-6 sticky top-24 text-right">
            <h2 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
              ملخص الباقة والحساب
            </h2>

            {/* Plan Info Card */}
            <div className="p-4 rounded-2xl bg-[#F6F2FC] border border-[#CBBAE7]/50 flex items-center justify-between">
              <div>
                <Badge variant="family" tier={selectedPlan.tier}>
                  {selectedPlan.tier_label_ar}
                </Badge>
                <div className="font-heading font-extrabold text-lg text-[#14101F] mt-1">
                  {selectedPlan.quota_value} {selectedPlan.quota_unit}
                </div>
                <span className="text-xs text-[#5E5873]">
                  باقة {selectedPlan.billing_period === 'yearly' ? 'سنوية' : 'شهرية'}
                </span>
              </div>

              <GBGauge
                quotaValue={selectedPlan.quota_value}
                quotaUnit={selectedPlan.quota_unit}
                tier={selectedPlan.tier}
                size="sm"
              />
            </div>

            {/* Welcome Offer Reservation Banner (Change 3) */}
            {discountCalculation.isEligible ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-[#F6F2FC] to-purple-50 border border-emerald-200/80 shadow-sm text-right space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    تم تطبيق العرض الترحيبي (خصم 50%)
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                    وفر حتى 350 ج.م
                  </span>
                </div>
                <p className="text-[11px] text-[#5E5873] leading-relaxed">
                  هذا العرض الترحيبي محجوز لطلبك لمدة <strong>60 دقيقة</strong> من لحظة الانتقال لبوابة الدفع.
                </p>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-[11px] text-[#5C2D91] underline font-semibold hover:text-[#4A2475] inline-flex items-center gap-1 cursor-pointer"
                >
                  <GiftIcon size={12} />
                  <span>اطّلع على الشروط والأحكام الكاملة للخصم</span>
                </button>
              </div>
            ) : selectedPlan.billing_period === 'yearly' ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-right space-y-1 text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangleIcon size={15} className="text-amber-600 shrink-0" />
                  <span>الباقات السنوية غير مشمولة في خصم الترحيب (50%)</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  هذه الباقة سنوية وتتضمن بالفعل وفراً وخصماً سنوياً مدمجاً. يسري الخصم الترحيبي 50% على الباقات الشهرية فقط.
                </p>
              </div>
            ) : discountCalculation.reasonAr ? (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-right text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangleIcon size={14} className="text-rose-600 shrink-0" />
                  <span>تنبيه بشأن الخصم الترحيبي:</span>
                </div>
                <p className="text-[11px] text-rose-700">{discountCalculation.reasonAr}</p>
              </div>
            ) : null}

            {/* Price Calculations Breakdown (Change 2 & Change 3) */}
            {(() => {
              const pricing = calculatePlanPricing(
                selectedPlan.price_egp,
                discountCalculation.isEligible
                  ? {
                      percent: discountCalculation.percent,
                      max_discount_amount: 350,
                      is_eligible: true,
                      name_ar: 'خصم الترحيب 50%',
                    }
                  : null
              );

              return (
                <div className="space-y-3 pt-2 text-xs border-t border-[#F4F5F7]">
                  <div className="flex items-center justify-between text-[#5E5873]">
                    <span>سعر الباقة الأساسي قبل الضريبة:</span>
                    <span className="font-bold tabular-nums text-[#14101F] text-sm">
                      {pricing.formatted_base}
                    </span>
                  </div>

                  {pricing.has_offer && (
                    <div className="flex items-center justify-between text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-1.5">
                        <span>خصم الترحيب للعملاء الجدد (50%):</span>
                        {pricing.discount_amount >= 350 && (
                          <span className="text-[10px] text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                            الحد الأقصى (350 ج.م)
                          </span>
                        )}
                      </div>
                      <span className="font-bold tabular-nums text-sm text-emerald-800">
                        − {pricing.formatted_discount}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#5E5873] pt-1">
                    <span>ضريبة القيمة المضافة (14%):</span>
                    <span className="font-semibold tabular-nums text-[#14101F]">
                      + {pricing.formatted_vat}
                    </span>
                  </div>

                  {pricing.rounding_adjustment !== 0 && (
                    <div className="flex items-center justify-between text-xs text-[#8E8A9F]">
                      <span>تقريب لأقرب جنيه:</span>
                      <span className="tabular-nums">{pricing.formatted_rounding}</span>
                    </div>
                  )}

                  {/* Total Due */}
                  <div className="pt-3 border-t-2 border-[#5C2D91]/20 bg-[#F3EEFA] p-3 rounded-xl flex items-baseline justify-between">
                    <div>
                      <span className="font-heading font-bold text-sm text-[#2A1250] block">
                        المبلغ الإجمالي المستحق للدفع:
                      </span>
                      <span className="text-[10px] text-[#5E5873]">
                        المبلغ الإجمالي النهائي شامل الضريبة (14%)
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#5C2D91] tabular-nums">
                      {pricing.formatted_total_due}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Agreement to terms */}
            <div className="pt-2 text-right">
              <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-[#5E5873] leading-relaxed">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#5C2D91] focus:ring-[#5C2D91] cursor-pointer"
                />
                <span>
                  أؤكد صحة رقم الخط الأرضي المذكور أعلاه وأوافق على{' '}
                  <Link href="/terms" className="text-[#5C2D91] underline font-bold" target="_blank">
                    شروط السداد ومهلة الـ 60 دقيقة
                  </Link>
                  .
                </span>
              </label>
            </div>

            {/* Pay Now Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-between shadow-md"
              isLoading={isLoading}
              disabled={!linesMatch || !lineValidation.isValid || !phoneValid || !agreeTerms}
              rightIcon={<ArrowLeftRTL size={20} />}
            >
              تأكيد الطلب والانتقال للدفع
            </Button>

            <p className="text-[11px] text-[#8E8A9F] text-center">
              بمجرد الضغط، سيبدأ عداد تنازلي مدته 60 دقيقة لحجز الباقة بالسعر الحالي.
            </p>
          </div>
        </div>
      </form>

      {/* Transparent Terms Modal */}
      <OfferTermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />
      <main className="flex-1 bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-20">جاري تحميل بيانات الباقة...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
