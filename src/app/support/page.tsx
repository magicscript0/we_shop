'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input, Button } from '@/components/ui';
import { ShieldCheckIcon, ClockIcon } from '@/components/ui/Icons';
import { RealTrustMetrics } from '@/components/common/RealTrustMetrics';

export default function SupportPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#5C2D91] uppercase tracking-wider">
              فريق المساعدة وخدمة العملاء
            </span>
            <h1 className="text-3xl font-extrabold font-heading text-[#14101F]">
              الدعم الفني وخدمة العملاء
            </h1>
            <p className="text-sm text-[#5E5873]">
              فريقنا متواجد يومياً لمساعدتك في استفسارات الباقات، تأكيد التحويلات، وحل أي معوقات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Official Support Info Box */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#2A1250] to-[#5C2D91] text-white rounded-3xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#B9F03C] text-[#1B0A33] flex items-center justify-center font-bold">
                  WE
                </div>
                <h2 className="text-xl font-bold font-heading text-white">
                  مركز المساعدة المعتمد
                </h2>
                <p className="text-xs text-[#cbbae7] leading-relaxed">
                  فريق دعم فني متخصص للرد الفوري على استفسارات باقات الإنترنت المنزلي وتأكيد عمليات الشحن ومتابعة التجديد.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <ClockIcon size={16} className="text-[#B9F03C]" />
                  <span>مواعيد العمل: يومياً من 9:00 ص حتى 11:00 م</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon size={16} className="text-[#B9F03C]" />
                  <span>البريد المعتمد: support@westore-eg.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon size={16} className="text-[#B9F03C]" />
                  <span>متوسط سرعة الاستجابة: أقل من 15 دقيقة</span>
                </div>

                <div className="pt-2">
                  <a href="/track" className="block">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full text-center"
                    >
                      تتبع حالة طلبك برقم الطلب ↗
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Support Ticket Form */}
            <div className="md:col-span-7 bg-white rounded-3xl border border-[#E5E7EB] shadow-md p-6 sm:p-8">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#E9E0F5] text-[#5C2D91] flex items-center justify-center mx-auto text-2xl">
                    ✓
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#14101F]">
                    تم استلام رسالتك بنجاح
                  </h3>
                  <p className="text-xs text-[#5E5873]">
                    سيتواصل معك أحد مسؤولي الدعم عبر رقم الهاتف المرفق في أقرب وقت.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-right">
                  <h3 className="font-heading font-bold text-lg text-[#14101F] mb-2">
                    إرسال طلب استفسار أو مساعدة
                  </h3>

                  <Input
                    label="الاسم بالكامل"
                    placeholder="اكتب اسمك الثلاثي"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Input
                    label="رقم الهاتف للتواصل (المحمول)"
                    placeholder="010XXXXXXXX"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <Input
                    label="رقم الطلب (إن وجد)"
                    placeholder="WE-XXXXXX-XXXX"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                  />

                  <div>
                    <label className="block text-sm font-semibold text-[#14101F] mb-1.5">
                      تفاصيل الاستفسار أو المشكلة:
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="اشرح استفسارك بوضوح لنتمكن من مساعدتك..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl p-3.5 text-sm text-[#14101F] focus:outline-none focus:border-[#5C2D91] focus:ring-2 focus:ring-[#E9E0F5]"
                    />
                  </div>

                  <Button type="submit" variant="secondary" size="md" className="w-full mt-2">
                    إرسال الطلب لفريق الدعم
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Real Trust Metrics Compact Bar */}
          <RealTrustMetrics variant="compact" className="pt-2" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
