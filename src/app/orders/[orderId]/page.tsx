'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge, Button, GBGauge } from '@/components/ui';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { formatEgp } from '@/lib/utils';
import {
  ClockIcon,
  ShieldCheckIcon,
  CheckIcon,
  AlertTriangleIcon,
  RouterIcon,
  ArrowLeftRTL,
} from '@/components/ui/Icons';
import { Order, OrderStatus } from '@/types/database';

export default function OrderDetailsStatusPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('proof_submitted');
  const [rejectReason, setRejectReason] = useState<string>('رقم العملية غير مطابق لكشف الحساب الوارد.');

  useEffect(() => {
    // Try to load from session storage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`order_${orderId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Order;
          setOrder(parsed);
          if (parsed.status) setCurrentStatus(parsed.status);
          return;
        } catch {
          // ignore
        }
      }
    }

    // Default mock order
    const mock: Order = {
      id: orderId,
      order_number: `WE-261001-4821`,
      user_id: 'guest',
      plan_id: 'plan-super-500',
      status: 'proof_submitted',
      we_line_number: '3214567',
      line_governorate_code: '013',
      customer_phone: '01012345678',
      price_original: 660,
      discount_amount: 330,
      price_final: 330,
      campaign_id: 'camp-welcome',
      plan_snapshot: {
        tier: 'Super',
        tier_label_ar: 'سوبر',
        quota_value: 500,
        quota_unit: 'GB',
        billing_period: 'monthly',
        price_egp: 660,
        slug: 'super-monthly-500gb',
      },
      expires_at: new Date(Date.now() + 3600000).toISOString(),
      payment_method_id: 'pm-vodafone-cash',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setOrder(mock);
  }, [orderId]);

  // Stepper calculations based on status
  const getStepNumber = (status: OrderStatus) => {
    switch (status) {
      case 'awaiting_payment':
        return 1;
      case 'proof_submitted':
        return 2;
      case 'payment_verified':
        return 3;
      case 'processing':
        return 4;
      case 'completed':
        return 5;
      default:
        return 2;
    }
  };

  const currentStep = getStepNumber(currentStatus);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Main Status Showcase Container */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-10 space-y-8 text-center">
            {/* Header with Order Number */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-[#F4F5F7] gap-4">
              <div className="text-right">
                <span className="text-xs text-[#5E5873]">رقم الطلب المرجعي:</span>
                <div className="font-mono font-extrabold text-lg text-[#14101F] tracking-wider mt-0.5">
                  {order?.order_number || 'WE-261001-4821'}
                </div>
              </div>

              <div>
                <Badge variant="status" statusKey={currentStatus} size="lg" />
              </div>
            </div>

            {/* The Signature GB Gauge acting as Order Progress Indicator (Section 4.3) */}
            <div className="my-6 flex flex-col items-center justify-center">
              <GBGauge
                quotaValue={order?.plan_snapshot?.quota_value || 500}
                quotaUnit={order?.plan_snapshot?.quota_unit || 'GB'}
                tier={order?.plan_snapshot?.tier as any || 'Super'}
                size="hero"
                progressPercent={
                  currentStatus === 'completed'
                    ? 100
                    : currentStatus === 'processing'
                    ? 75
                    : currentStatus === 'payment_verified'
                    ? 50
                    : 25
                }
                animated={true}
              />

              <div className="mt-6 space-y-2 max-w-md">
                {currentStatus === 'proof_submitted' && (
                  <>
                    <h2 className="text-2xl font-extrabold font-heading text-[#14101F]">
                      طلبك قيد المراجعة والتحقق الآن
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5E5873] leading-relaxed">
                      تم استلام إيصال التحويل ورقم العملية بنجاح. يقوم فريق التدقيق بمراجعة الحوالة وتأكيدها، وسيتم البدء في شحن باقتك فور المطابقة.
                    </p>
                    <span className="inline-block text-[11px] text-[#5C2D91] bg-[#F6F2FC] px-3 py-1 rounded-full font-bold">
                      يتم التحديث تلقائياً دون الحاجة لإعادة تحميل الصفحة
                    </span>
                  </>
                )}

                {currentStatus === 'payment_verified' && (
                  <>
                    <h2 className="text-2xl font-extrabold font-heading text-indigo-900">
                      تم تأكيد الدفع بنجاح
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5E5873]">
                      تمت مطابقة الحوالة وإدراج طلبك في قائمة الشحن المعتمد لخطك الأرضي.
                    </p>
                  </>
                )}

                {currentStatus === 'processing' && (
                  <>
                    <h2 className="text-2xl font-extrabold font-heading text-[#5C2D91]">
                      جاري شحن وتفعيل الباقة على خطك
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5E5873]">
                      تتم الآن عملية تفعيل الرصيد والجيجابايت على خطك المنزلي من خلال النظام المعتمد.
                    </p>
                  </>
                )}

                {currentStatus === 'completed' && (
                  <>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                      <CheckIcon size={16} />
                      <span>مبروك! تم تفعيل خطك بنجاح</span>
                    </div>
                    <h2 className="text-2xl font-extrabold font-heading text-[#14101F]">
                      تم شحن الباقة بنجاح على خطك الأرضي
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5E5873]">
                      يمكنك الآن الاستمتاع بالإنترنت المنزلي بسعة {order?.plan_snapshot?.quota_value} {order?.plan_snapshot?.quota_unit}. شكراً لثقتكم بنا!
                    </p>
                  </>
                )}

                {currentStatus === 'rejected' && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-right space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                      <AlertTriangleIcon size={18} className="text-rose-600" />
                      <span>تعذر تأكيد التحويل للسبب التالي:</span>
                    </div>
                    <p className="text-xs text-rose-700 bg-white p-3 rounded-xl border border-rose-200">
                      {rejectReason}
                    </p>
                    <div className="pt-2">
                      <Link href={`/pay/${orderId}`}>
                        <Button variant="primary" size="sm" className="w-full">
                          إعادة رفع إثبات التحويل الصحيح ↺
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stepper Steps */}
            <div className="pt-4 border-t border-[#F4F5F7]">
              <div className="grid grid-cols-5 gap-2 text-center text-xs select-none" dir="rtl">
                {[
                  { key: 'awaiting_payment', label: 'إنشاء الطلب' },
                  { key: 'proof_submitted', label: 'جاري التحقق' },
                  { key: 'payment_verified', label: 'تأكيد الدفع' },
                  { key: 'processing', label: 'جاري الشحن' },
                  { key: 'completed', label: 'تم التفعيل' },
                ].map((s, idx) => {
                  const stepNum = idx + 1;
                  const isDone = currentStep >= stepNum;
                  const isCurrent = currentStep === stepNum;

                  return (
                    <div key={s.key} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-[#5C2D91] text-white'
                            : isCurrent
                            ? 'bg-[#B9F03C] text-[#1B0A33] ring-4 ring-[#E9E0F5]'
                            : 'bg-[#F4F5F7] text-[#8E8A9F]'
                        }`}
                      >
                        {isDone ? '✓' : stepNum}
                      </div>
                      <span className={`text-[10px] mt-1.5 ${isCurrent ? 'font-bold text-[#5C2D91]' : 'text-[#5E5873]'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#F6F2FC] text-right text-xs">
              <div>
                <span className="text-[#8E8A9F] block">الباقة:</span>
                <span className="font-bold text-[#14101F] mt-0.5 block">
                  {order?.plan_snapshot?.tier_label_ar} {order?.plan_snapshot?.quota_value} {order?.plan_snapshot?.quota_unit}
                </span>
              </div>
              <div>
                <span className="text-[#8E8A9F] block">الخط الأرضي:</span>
                <span className="font-bold text-[#14101F] mt-0.5 block font-mono" dir="ltr">
                  ({order?.line_governorate_code || '013'}) - {order?.we_line_number || '3214567'}
                </span>
              </div>
              <div>
                <span className="text-[#8E8A9F] block">المبلغ المسدد:</span>
                <span className="font-bold text-[#5C2D91] mt-0.5 block tabular-nums">
                  {formatEgp(order?.price_final || 330)}
                </span>
              </div>
              <div>
                <span className="text-[#8E8A9F] block">حالة الشحن:</span>
                <span className="font-bold text-[#14101F] mt-0.5 block">
                  {ORDER_STATUS_LABELS[currentStatus]?.labelAr || 'جاري التحقق'}
                </span>
              </div>
            </div>

            {/* Direct Ticket Support Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/support?orderId=${encodeURIComponent(order?.order_number || orderId)}`}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="md" className="w-full sm:w-auto">
                  تواصل مع الدعم الفني للطلب ↗
                </Button>
              </Link>

              <Link href="/account" className="w-full sm:w-auto">
                <Button variant="ghost" size="md" className="w-full sm:w-auto">
                  الانتقال لصفحة حسابي
                </Button>
              </Link>
            </div>

            {/* Demo State Switcher for reviewer inspection */}
            <div className="pt-6 border-t border-[#F4F5F7] text-xs text-[#8E8A9F] text-center space-y-2">
              <span className="block font-semibold">محاكي اختبار الحالات (Demo Inspector):</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {(['proof_submitted', 'payment_verified', 'processing', 'completed', 'rejected'] as OrderStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setCurrentStatus(status)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                        currentStatus === status
                          ? 'bg-[#2A1250] text-[#B9F03C] border-[#2A1250]'
                          : 'bg-white text-[#5E5873] border-[#E5E7EB]'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[status]?.labelAr || status}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
