'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { RouterIcon, ShieldCheckIcon, ZapIcon } from '@/components/ui/Icons';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get('next') || '/admin';

  const [activeTab, setActiveTab] = useState<'accessCode' | 'credentials'>('accessCode');
  
  // Form states
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload =
        activeTab === 'accessCode'
          ? { action: 'login', mode: 'accessCode', accessCode: accessCode.trim() }
          : { action: 'login', mode: 'credentials', email: email.trim(), password };

      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'تعذر تسجيل الدخول. يرجى التحقق من البيانات.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg('تم التحقق بنجاح! جاري تحويلك إلى لوحة الإدارة...');
      
      // Short delay to give visual feedback then redirect
      setTimeout(() => {
        router.replace(nextUrl);
        router.refresh();
      }, 600);
    } catch {
      setErrorMsg('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0317] text-white flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-body" dir="rtl">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#5C2D91]/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#B9F03C]/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-[#3A1C6E]/20 rounded-full blur-[130px]" />
      </div>

      {/* Top Bar Link */}
      <div className="max-w-md w-full mx-auto relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs text-[#A98BD6] hover:text-white transition-colors flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl hover:bg-white/10"
        >
          <span>←</span>
          <span>العودة إلى المتجر الرئيسي</span>
        </Link>
        <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          SSL 256-Bit Encrypted
        </span>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto relative z-10 my-auto">
        <div className="bg-[#150727]/90 backdrop-blur-xl border border-[#2D1452] rounded-3xl p-7 sm:p-9 shadow-2xl shadow-purple-950/50">
          {/* Logo & Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#3A1C6E] to-[#5C2D91] flex items-center justify-center text-[#B9F03C] shadow-lg shadow-purple-900/40 border border-white/10">
              <RouterIcon size={28} />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
                بوابة الإدارة المركزية
              </h1>
              <p className="text-xs text-[#A98BD6] mt-1">
                منطقة محمية مخصصة لإدارة مبيعات وتفعيلات باقات WE
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0F041D] rounded-2xl border border-[#2A1250] mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('accessCode');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'accessCode'
                  ? 'bg-gradient-to-r from-[#5C2D91] to-[#4A2480] text-white shadow-sm'
                  : 'text-[#8E8A9F] hover:text-white'
              }`}
            >
              <span>🔑</span>
              <span>رمز المرور الإداري</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('credentials');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'credentials'
                  ? 'bg-gradient-to-r from-[#5C2D91] to-[#4A2480] text-white shadow-sm'
                  : 'text-[#8E8A9F] hover:text-white'
              }`}
            >
              <span>✉️</span>
              <span>حساب المشرف</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/30 rounded-2xl text-red-200 text-xs flex items-start gap-2.5 animate-shake">
              <span className="text-red-400 text-base leading-none">⚠️</span>
              <p className="flex-1 leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-6 p-3.5 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl text-emerald-200 text-xs flex items-center gap-2.5">
              <span className="text-emerald-400 text-base">✓</span>
              <p className="flex-1 font-bold">{successMsg}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'accessCode' ? (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#E9E0F5]">
                  رمز الأمان الإداري (Master Security PIN)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    required
                    placeholder="أدخل رمز المرور الإداري"
                    className="w-full bg-[#0E031E] border border-[#2D1452] focus:border-[#B9F03C] focus:ring-1 focus:ring-[#B9F03C] text-white placeholder-[#5E5873] px-4 py-3 rounded-xl text-sm transition-all outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8E8A9F] hover:text-white cursor-pointer px-1 py-0.5"
                  >
                    {showPassword ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
                <p className="text-[11px] text-[#8E8A9F]">
                  مفتاح الدخول السريع للمالك والمدير العام لإدارة النظام.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#E9E0F5]">
                    البريد الإلكتروني الإداري
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@store.com"
                    className="w-full bg-[#0E031E] border border-[#2D1452] focus:border-[#B9F03C] focus:ring-1 focus:ring-[#B9F03C] text-white placeholder-[#5E5873] px-4 py-3 rounded-xl text-sm transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#E9E0F5]">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-[#0E031E] border border-[#2D1452] focus:border-[#B9F03C] focus:ring-1 focus:ring-[#B9F03C] text-white placeholder-[#5E5873] px-4 py-3 rounded-xl text-sm transition-all outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8E8A9F] hover:text-white cursor-pointer px-1 py-0.5"
                    >
                      {showPassword ? 'إخفاء' : 'إظهار'}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading || Boolean(successMsg)}
              className="w-full mt-2 py-3.5 px-4 rounded-xl font-heading font-extrabold text-sm text-[#140626] bg-[#B9F03C] hover:bg-[#cbf562] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-lg shadow-[#B9F03C]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#140626] border-t-transparent rounded-full animate-spin" />
                  <span>جاري التحقق من التصريح...</span>
                </>
              ) : (
                <>
                  <ShieldCheckIcon size={18} />
                  <span>تسجيل الدخول إلى لوحة الإدارة</span>
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 pt-5 border-t border-[#2A1250] text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A98BD6]">
              <ZapIcon size={12} className="text-[#B9F03C]" />
              <span>نظام الرقابة وسجلات التدقيق الرقابي نشطة</span>
            </div>
            <p className="text-[10px] text-[#6F6984] leading-relaxed">
              يتم تسجيل جميع محاولات الدخول وعناوين IP تلقائياً لأغراض الحماية والأمان.
            </p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center relative z-10 text-[11px] text-[#6F6984]">
        نظام إدارة متجر باقات WE • إصدار الإنتاج المعتمد
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0C0317] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-[#B9F03C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
