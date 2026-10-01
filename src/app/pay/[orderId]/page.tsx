'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input, Button, Badge } from '@/components/ui';
import { SEED_PAYMENT_METHODS } from '@/lib/constants';
import { formatEgp } from '@/lib/utils';
import {
  ClockIcon,
  CopyIcon,
  CheckIcon,
  UploadIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  WalletIcon,
} from '@/components/ui/Icons';
import { Order, PaymentMethod } from '@/types/database';

export default function PaymentGatewayPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.orderId as string) || '';

  // Order & Payment Method State
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(SEED_PAYMENT_METHODS[0]);

  // Server-Synced Countdown State (Section 10.2)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(60 * 60); // 60 mins default
  const [isExpired, setIsExpired] = useState<boolean>(false);

  // Copy Feedback State
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Proof Submission Form State
  const [senderRef, setSenderRef] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [amountSent, setAmountSent] = useState<string>('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load Order Data
  useEffect(() => {
    // 1. Try to load from session storage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`order_${orderId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Order;
          setOrder(parsed);
          setAmountSent(String(parsed.price_final));

          // Set matching payment method
          if (parsed.payment_method_id) {
            const method = SEED_PAYMENT_METHODS.find((m) => m.id === parsed.payment_method_id);
            if (method) setPaymentMethod(method);
          }

          // Calculate initial remaining seconds based on server expires_at
          const expiryTime = new Date(parsed.expires_at).getTime();
          const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
          setTimeLeftSeconds(remaining);
          if (remaining <= 0) setIsExpired(true);

          return;
        } catch {
          // ignore
        }
      }
    }

    // Fallback Mock Order for demonstration
    const expiry = new Date(Date.now() + 59 * 60 * 1000 + 45 * 1000);
    const mock: Order = {
      id: orderId,
      order_number: `WE-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-4821`,
      user_id: 'guest',
      plan_id: 'plan-super-500',
      status: 'awaiting_payment',
      we_line_number: '3214567',
      line_governorate_code: '013',
      customer_phone: '01034027398',
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
      expires_at: expiry.toISOString(),
      payment_method_id: SEED_PAYMENT_METHODS[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOrder(mock);
    setAmountSent(String(mock.price_final));
  }, [orderId]);

  // Live Server-Clock Synchronized Countdown Timer
  useEffect(() => {
    if (isExpired) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpired]);

  // Format MM:SS for the circular timer
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Copy with animation feedback
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Image Upload and Validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size <= 5MB (Section 10.1 & 14)
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 5 ميجابايت.');
      return;
    }

    setProofFile(file);
    setSubmitError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit Proof Form
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) {
      setSubmitError('انتهت مهلة الـ 60 دقيقة المحددة للطلب. يرجى التواصل مع الدعم لمراجعة الحوالة المتأخرة.');
      return;
    }

    if (!senderRef.trim()) {
      setSubmitError('يرجى كتابة رقم الهاتف أو المحفظة التي قمت بالتحويل منها.');
      return;
    }

    if (!transactionRef.trim()) {
      setSubmitError('يرجى كتابة رقم العملية (Transaction ID) المذكور في رسالة نجاح التحويل.');
      return;
    }

    if (!proofFile) {
      setSubmitError('يرجى إرفاق صورة أو لقطة شاشة لإشعار التحويل.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/orders/submit-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          orderNumber: order?.order_number,
          senderRef: senderRef.trim(),
          transactionRef: transactionRef.trim(),
          amountSent: Number(amountSent),
          filePath: proofFile.name,
          fileSizeBytes: proofFile.size,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setSubmitError(data.error || 'تعذر إرسال الإثبات.');
        setIsSubmitting(false);
        return;
      }

      // Update local order status
      if (order && typeof window !== 'undefined') {
        const updated = { ...order, status: 'proof_submitted' as const };
        sessionStorage.setItem(`order_${orderId}`, JSON.stringify(updated));
      }

      // Stop countdown and redirect to order tracking review screen
      router.push(`/orders/${orderId}`);
    } catch {
      setSubmitError('حدث خطأ في الاتصال. يرجى المحاولة مجدداً.');
      setIsSubmitting(false);
    }
  };

  const isUrgent = timeLeftSeconds <= 2 * 60; // 2 minutes left
  const isWarning = timeLeftSeconds <= 10 * 60 && !isUrgent; // 10 minutes left

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Order ID & Security Notice Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#5E5873]">رقم الطلب:</span>
              <span className="font-mono font-bold text-sm text-[#14101F]">
                {order?.order_number || 'WE-261001-4821'}
              </span>
              <Badge variant="status" statusKey="awaiting_payment" />
            </div>

            <div className="flex items-center gap-1.5 text-[#5C2D91] font-semibold">
              <ShieldCheckIcon size={16} />
              <span>بوابة دفع مؤمنة ومعتمدة - سداد مباشر</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Right Column: Instructions, Copy Numbers, & Countdown */}
            <div className="md:col-span-6 space-y-6">
              {/* Circular Countdown Timer Widget (Section 10.1 & 10.2) */}
              <div
                className={`p-6 rounded-3xl border shadow-md text-center transition-all ${
                  isExpired
                    ? 'bg-rose-50 border-rose-300'
                    : isUrgent
                    ? 'bg-rose-50 border-rose-400 animate-pulse'
                    : isWarning
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2 text-xs font-bold">
                  <ClockIcon
                    size={16}
                    className={isExpired || isUrgent ? 'text-rose-600' : 'text-[#5C2D91]'}
                  />
                  <span
                    className={
                      isExpired || isUrgent
                        ? 'text-rose-700'
                        : isWarning
                        ? 'text-amber-800'
                        : 'text-[#5C2D91]'
                    }
                  >
                    {isExpired
                      ? 'انتهت مهلة الـ 60 دقيقة المحددة لحجز الباقة'
                      : isUrgent
                      ? 'تنبيه عاجل: متبقي أقل من دقيقتين!'
                      : isWarning
                      ? 'تنبيه: متبقي أقل من 10 دقائق على انتهاء الحجز'
                      : 'مهلة إتمام التحويل ورفع الإيصال (60 دقيقة):'}
                  </span>
                </div>

                {/* Big Countdown Digits */}
                <div
                  className={`font-mono text-4xl sm:text-5xl font-extrabold tracking-widest tabular-nums my-1 ${
                    isExpired ? 'text-rose-600' : isUrgent ? 'text-rose-600' : 'text-[#14101F]'
                  }`}
                  dir="ltr"
                >
                  {formattedTime}
                </div>

                <p className="text-[11px] text-[#5E5873] mt-2 leading-relaxed">
                  العداد مخصص لرفع إيصال الدفع فقط. بمجرد رفع الإثبات يتوقف العداد فورياً وتبدأ مرحلة المراجعة.
                </p>

                {isExpired && (
                  <div className="mt-4 pt-3 border-t border-rose-200 text-xs text-rose-800">
                    <span>هل قمت بالتحويل بالفعل ولكن الوقت انتهى؟ </span>
                    <a
                      href={`https://wa.me/201034027398?text=${encodeURIComponent(
                        `مرحباً، قمت بالتحويل لطلبي رقم ${order?.order_number} ولكن انتهى وقت العداد التنازلي.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-rose-900"
                    >
                      تواصل معنا لإرفاق الإيصال متأخراً (Late Proof) ↗
                    </a>
                  </div>
                )}
              </div>

              {/* Exact Amount Due Box with Copy Button */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 space-y-4 text-right">
                <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
                  <span className="text-xs font-bold text-[#5E5873]">المبلغ المطلوب تحويله بدقة:</span>
                  <Badge variant="family" tier={order?.plan_snapshot?.tier as any || 'Super'}>
                    {order?.plan_snapshot?.tier_label_ar} {order?.plan_snapshot?.quota_value} {order?.plan_snapshot?.quota_unit}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F6F2FC] border border-[#CBBAE7]/50">
                  <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#5C2D91] tabular-nums">
                    {formatEgp(order?.price_final || 330)}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(String(order?.price_final || 330), 'amount')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#CBBAE7] text-xs font-bold text-[#5C2D91] hover:bg-[#F6F2FC] transition-colors cursor-pointer"
                  >
                    {copiedField === 'amount' ? (
                      <>
                        <CheckIcon size={14} className="text-emerald-600" />
                        <span className="text-emerald-700">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon size={14} />
                        <span>نسخ المبلغ</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Transfer Fee Note (Section 10.1 & 10.4) */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                  <AlertTriangleIcon size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>تنبيه هام:</strong> {paymentMethod.fee_note}
                  </span>
                </div>
              </div>

              {/* Receiving Account Box with Copy Button */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 space-y-4 text-right">
                <div className="flex items-center justify-between pb-2 border-b border-[#F4F5F7]">
                  <h3 className="font-heading font-bold text-sm text-[#14101F]">
                    بيانات التحويل ({paymentMethod.label_ar})
                  </h3>
                  <span className="text-xs text-[#5C2D91] font-bold">حساب معتمد</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#5E5873]">الرقم / العنوان المستلم:</span>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E2E8F0]">
                    <span className="font-mono font-bold text-base sm:text-lg text-[#14101F]" dir="ltr">
                      {paymentMethod.account_value}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(paymentMethod.account_value, 'account')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] text-xs font-bold text-[#14101F] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                    >
                      {copiedField === 'account' ? (
                        <>
                          <CheckIcon size={14} className="text-emerald-600" />
                          <span className="text-emerald-700">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon size={14} />
                          <span>نسخ الرقم</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Transfer Steps */}
                <div className="pt-2 text-xs text-[#5E5873] space-y-1.5 leading-relaxed">
                  <span className="font-bold text-[#14101F] block mb-1">خطوات التحويل:</span>
                  <div className="whitespace-pre-line bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB]">
                    {paymentMethod.instructions_md}
                  </div>
                </div>
              </div>
            </div>

            {/* Left Column: Proof Upload Form */}
            <div className="md:col-span-6 space-y-6">
              <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-8 space-y-5 text-right">
                <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
                  <h2 className="font-heading font-bold text-base text-[#14101F]">
                    رفع إثبات التحويل (Proof of Payment)
                  </h2>
                  <span className="text-[11px] text-[#5C2D91] font-bold">خطوة التحقق</span>
                </div>

                {submitError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold leading-relaxed flex items-center gap-2">
                    <AlertTriangleIcon size={16} className="shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitProof} className="space-y-4">
                  <Input
                    label="رقم المحفظة / الحساب الذي قمت بالتحويل منه"
                    placeholder="مثال: 01012345678"
                    required
                    disabled={isExpired || isSubmitting}
                    value={senderRef}
                    onChange={(e) => setSenderRef(e.target.value)}
                    helperText="سنطابق هذا الرقم مع بيان الحوالة الواردة إلينا."
                  />

                  <Input
                    label="رقم العملية (Transaction ID)"
                    placeholder="مثال: 489201938"
                    required
                    disabled={isExpired || isSubmitting}
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    helperText="موجود في رسالة التأكيد النصية من فودافون كاش أو تطبيق إنستاباي."
                  />

                  <Input
                    label="المبلغ المحول بالفعل (ج.م)"
                    type="number"
                    required
                    disabled={isExpired || isSubmitting}
                    value={amountSent}
                    onChange={(e) => setAmountSent(e.target.value)}
                  />

                  {/* Screenshot Upload with Live Preview */}
                  <div className="space-y-2 text-right">
                    <label className="block text-sm font-semibold text-[#14101F]">
                      صورة إيصال التحويل أو لقطة الشاشة
                    </label>

                    <div className="border-2 border-dashed border-[#CBBAE7] hover:border-[#5C2D91] rounded-2xl p-4 text-center transition-colors bg-[#F6F2FC]/30 cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isExpired || isSubmitting}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />

                      {previewUrl ? (
                        <div className="space-y-2">
                          <img
                            src={previewUrl}
                            alt="معاينة إيصال التحويل"
                            className="max-h-48 mx-auto rounded-xl object-contain shadow-sm border border-[#E5E7EB]"
                          />
                          <span className="text-xs font-semibold text-[#5C2D91] block">
                            اضغط لتغيير الصورة المحددة
                          </span>
                        </div>
                      ) : (
                        <div className="py-4 space-y-2">
                          <div className="w-12 h-12 rounded-full bg-[#E9E0F5] text-[#5C2D91] flex items-center justify-center mx-auto">
                            <UploadIcon size={24} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#14101F] block">
                              اضغط لاختيار صورة الإيصال أو اسحبها هنا
                            </span>
                            <span className="text-[11px] text-[#5E5873]">
                              JPG، PNG، WebP حتى 5 ميجابايت كحد أقصى
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Proof Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full mt-4 justify-between"
                    isLoading={isSubmitting}
                    disabled={isExpired || !proofFile || !transactionRef.trim() || isSubmitting}
                    rightIcon={<CheckIcon size={20} />}
                  >
                    تأكيد وإرسال إثبات التحويل للمراجعة
                  </Button>
                </form>

                <div className="pt-2 text-center text-xs text-[#5E5873]">
                  <span>بمجرد الإرسال سيتوقف العداد التنازلي وتبدأ مراجعة وتفعيل خطك.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
