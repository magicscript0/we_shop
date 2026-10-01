'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, Badge } from '@/components/ui';
import { GiftIcon, ArrowLeftRTL, CheckIcon, ShieldCheckIcon } from '@/components/ui/Icons';

export default function WelcomeGiftPage() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-[#2A1250] via-[#3A1C6E] to-[#14101F] text-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#FF7A1A]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#B9F03C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-xl text-center space-y-8 relative z-10">
          {!isOpened ? (
            /* Unopened Gift State */
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 animate-in zoom-in-95 duration-500">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#FF7A1A] to-[#ff9843] text-white flex items-center justify-center shadow-[0_0_40px_rgba(255,122,26,0.6)] animate-bounce">
                  <GiftIcon size={56} />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  وصلتك هدية تسجيل خاصة!
                </h1>
                <p className="text-xs sm:text-sm text-[#cbbae7] max-w-md mx-auto leading-relaxed">
                  شكراً لانضمامك إلى منصة باقات WE. اضغط بالأسفل لفتح صندوق المفاجأة ومعاينة هديتك الترحيبية الحصرية.
                </p>
              </div>

              <Button
                variant="discount"
                size="xl"
                className="w-full sm:w-auto px-10 cursor-pointer text-base font-bold shadow-xl hover:scale-105"
                onClick={() => setIsOpened(true)}
              >
                افتح هديتك الترحيبية الآن 🎁
              </Button>
            </div>
          ) : (
            /* Revealed 50% Welcome Discount Celebration */
            <div className="bg-white/10 backdrop-blur-xl border border-[#FF7A1A]/40 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(255,122,26,0.3)] space-y-6 animate-in zoom-in duration-500">
              {/* Confetti & Sparkles Top Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF7A1A] text-white text-xs font-bold font-heading shadow-md">
                <span>مبروك! تم تفعيل هديتك بنجاح</span>
              </div>

              {/* The Hero Discount Reveal Number */}
              <div className="space-y-2">
                <div className="text-6xl sm:text-7xl font-extrabold font-heading text-[#B9F03C] tracking-tight tabular-nums drop-shadow-[0_0_25px_rgba(185,240,60,0.5)]">
                  خصم 50%
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  على اشتراكك في أول باقة إنترنت منزلي
                </h2>
                <p className="text-xs sm:text-sm text-[#cbbae7] max-w-md mx-auto leading-relaxed">
                  تم إضافة الخصم إلى حسابك وسيتم تطبيقه تلقائياً عند إتمام أول طلب لشحن خطك الأرضي.
                </p>
              </div>

              {/* Conditions Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-right space-y-2 text-[#E9E0F5]">
                <div className="flex items-center gap-2">
                  <CheckIcon size={16} className="text-[#B9F03C] shrink-0" />
                  <span><strong>فترة الصلاحية:</strong> الهدية صالحة لمدة 7 أيام من تاريخ التسجيل.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon size={16} className="text-[#B9F03C] shrink-0" />
                  <span><strong>شرط الاستخدام:</strong> يطبق على أول طلب فقط لمرة واحدة لكل خط أرضي ورقم محمول.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon size={16} className="text-[#B9F03C] shrink-0" />
                  <span><strong>التطبيق:</strong> يخصم نصف السعر تلقائياً في صفحة الدفع وتأكيد الحساب.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link href="/plans" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto px-8"
                    rightIcon={<ArrowLeftRTL size={20} />}
                  >
                    استخدم الخصم وتصفح الباقات
                  </Button>
                </Link>

                <Link href="/account" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10"
                  >
                    عرض حسابي والخطوط المحفوظة
                  </Button>
                </Link>
              </div>

              <p className="text-[11px] text-[#8E8A9F]">
                * تطبق الشروط والأحكام الخاصة بمنع الاحتيال وتعدد الحسابات لنفس الخط.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
