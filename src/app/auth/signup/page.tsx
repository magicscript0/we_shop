'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input, Button } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { GiftIcon, RouterIcon } from '@/components/ui/Icons';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMsg('يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية للاستمرار.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/welcome-gift`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      // Automatically route to the welcome gift surprise reveal screen
      router.push('/auth/welcome-gift');
    } catch {
      router.push('/auth/welcome-gift');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/welcome-gift`,
        },
      });

      if (error) {
        setErrorMsg('تعذر الاتصال بـ Google. يرجى المحاولة لاحقاً.');
        setIsGoogleLoading(false);
      }
    } catch {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Surprise Gift Teaser Top Box */}
          <div className="bg-gradient-to-r from-[#2A1250] to-[#5C2D91] text-white p-4 rounded-2xl flex items-center gap-3.5 shadow-md border border-[#A98BD6]/30">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A1A] text-white flex items-center justify-center shrink-0">
              <GiftIcon size={22} />
            </div>
            <div className="text-right">
              <span className="font-heading font-bold text-xs text-[#B9F03C] block">
                مفاجأة تنتظرك فور التسجيل!
              </span>
              <p className="text-[11px] text-[#cbbae7]">
                أنشئ حسابك لاكتشاف العرض الترحيبي الحصري على أول باقة.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
                إنشاء حساب جديد
              </h1>
              <p className="text-xs text-[#5E5873]">
                خطوة واحدة فقط تفصلك عن شحن باقتك واستلام هديتك.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold text-right leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
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
              <span>{isGoogleLoading ? 'جاري الاتصال...' : 'التسجيل السريع بحساب Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E5E7EB] w-full" />
              <span className="bg-white px-3 text-xs text-[#8E8A9F] shrink-0 font-medium">
                أو بالتسجيل التقليدي
              </span>
            </div>

            {/* Email Registration Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                label="الاسم بالكامل"
                placeholder="أدخل اسمك الثلاثي"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="كلمة المرور (8 خانات على الأقل)"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex items-start gap-2 pt-1 text-right" dir="rtl">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#5C2D91] focus:ring-[#5C2D91] cursor-pointer"
                />
                <label htmlFor="agree" className="text-xs text-[#5E5873] leading-relaxed cursor-pointer select-none">
                  أوافق على{' '}
                  <Link href="/terms" className="text-[#5C2D91] font-semibold hover:underline">
                    الشروط والأحكام
                  </Link>{' '}
                  و{' '}
                  <Link href="/privacy" className="text-[#5C2D91] font-semibold hover:underline">
                    سياسة الخصوصية
                  </Link>
                  .
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                إنشاء الحساب واكتشاف الهدية
              </Button>
            </form>

            <div className="text-center pt-2 border-t border-[#F4F5F7] text-xs">
              <span className="text-[#5E5873]">لديك حساب بالفعل؟ </span>
              <Link href="/auth/login" className="font-bold text-[#5C2D91] hover:underline">
                تسجيل الدخول ↗
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
