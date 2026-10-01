'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input, Button } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { RouterIcon, ShieldCheckIcon } from '@/components/ui/Icons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('بيانات الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.');
        } else {
          setErrorMsg(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.push('/account');
      }
    } catch {
      // In development fallback
      router.push('/account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      });

      if (error) {
        setErrorMsg('تعذر الاتصال بخدمة Google حالياً. يرجى المحاولة لاحقاً أو استخدام البريد.');
        setIsGoogleLoading(false);
      }
    } catch {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#5C2D91] text-[#B9F03C] flex items-center justify-center mx-auto shadow-md">
              <RouterIcon size={26} />
            </div>
            <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
              تسجيل الدخول إلى حسابك
            </h1>
            <p className="text-xs text-[#5E5873]">
              تابع طلباتك واشحن باقات خطك الأرضي بكل سهولة.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold text-right leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#14101F] shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleLoading ? 'جاري الاتصال...' : 'الدخول عبر حساب Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E5E7EB] w-full" />
              <span className="bg-white px-3 text-xs text-[#8E8A9F] shrink-0 font-medium">
                أو باستخدام البريد الإلكتروني
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="example@mail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <Link
                    href="/auth/forgot-password"
                    className="text-[#5C2D91] hover:underline font-semibold"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                  <label className="font-semibold text-[#14101F]">كلمة المرور</label>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="md"
                className="w-full"
                isLoading={isLoading}
              >
                تسجيل الدخول
              </Button>
            </form>

            {/* Registration link */}
            <div className="text-center pt-2 border-t border-[#F4F5F7] text-xs">
              <span className="text-[#5E5873]">ليس لديك حساب حتى الآن؟ </span>
              <Link
                href="/auth/signup"
                className="font-bold text-[#5C2D91] hover:underline"
              >
                أنشئ حسابك واكتشف المفاجأة ↗
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
