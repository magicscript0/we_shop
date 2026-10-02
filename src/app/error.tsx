'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AlertTriangleIcon, ShieldCheckIcon } from '@/components/ui/Icons';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors securely without leaking PII
    console.error('Unhandled runtime error in page:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F] font-body" dir="rtl">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E7EB] shadow-lg">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangleIcon size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F]">
              عذراً، حدث خطأ غير متوقع
            </h1>
            <p className="text-sm text-[#5E5873] leading-relaxed max-w-md mx-auto">
              نعتذر عن هذا الخطأ المؤقت. تم تسجيل تفاصيل المشكلة وتأمين بياناتك. يمكنك إعادة المحاولة الآن أو العودة للرئيسية.
            </p>
          </div>

          {error.digest && (
            <div className="font-mono text-xs text-[#8E8A9F] bg-[#F8F9FA] py-1.5 px-3 rounded-lg border border-[#E5E7EB] inline-block">
              رمز الخطأ: {error.digest}
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => reset()}
              className="w-full sm:w-auto font-bold"
            >
              إعادة المحاولة ↺
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                العودة للرئيسية 🏠
              </Button>
            </Link>

            <Link href="/support" className="w-full sm:w-auto">
              <Button variant="ghost" size="md" className="w-full sm:w-auto">
                التواصل مع الدعم 💬
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-[#F4F5F7] text-[11px] text-[#8E8A9F] flex items-center justify-center gap-1.5">
            <ShieldCheckIcon size={14} className="text-emerald-600" />
            <span>بيانات طلباتك وحساباتك مشفرة ومحمية ببروتوكول آمن</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
