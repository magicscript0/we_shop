'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input, Button } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setIsSent(true);
      }
    } catch {
      setIsSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-8 space-y-5 text-right">
            <div className="space-y-1">
              <h1 className="text-xl font-bold font-heading text-[#14101F]">
                استعادة كلمة المرور
              </h1>
              <p className="text-xs text-[#5E5873]">
                أدخل بريدك الإلكتروني المسجل وسنرسل لك رابط إعادة تعيين كلمة المرور.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold leading-relaxed">
                {errorMsg}
              </div>
            )}

            {isSent ? (
              <div className="p-5 bg-[#F6F2FC] rounded-2xl border border-[#CBBAE7] text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#5C2D91] text-[#B9F03C] flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <h3 className="font-heading font-bold text-sm text-[#14101F]">
                  تم إرسال رابط الاستعادة
                </h3>
                <p className="text-xs text-[#5E5873]">
                  تفقد صندوق الوارد في بريدك الإلكتروني ({email}) واتبع التعليمات لتعيين كلمة مرور جديدة.
                </p>
                <Link href="/auth/login" className="inline-block pt-2">
                  <Button variant="ghost" size="sm">
                    العودة لصفحة الدخول ↗
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                >
                  إرسال رابط إعادة التعيين
                </Button>

                <div className="text-center pt-2 text-xs">
                  <Link href="/auth/login" className="text-[#5C2D91] hover:underline font-semibold">
                    تذكرت كلمة المرور؟ تسجيل الدخول ↗
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
