'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheckIcon, RouterIcon, WalletIcon, ClockIcon, ZapIcon } from '@/components/ui/Icons';
import { CommandPalette } from '@/components/admin/CommandPalette';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminUser {
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'super_admin' | 'verifier' | 'support' | 'auditor';
}

const NAV_ITEMS = [
  { href: '/admin', label: 'لوحة المؤشرات العامة', icon: '📊', exact: true },
  { href: '/admin/verification', label: 'طابور مراجعة المدفوعات', icon: '⚡', badge: '3' },
  { href: '/admin/orders', label: 'كافة الطلبات', icon: '📦' },
  { href: '/admin/plans', label: 'إدارة الباقات والأسعار', icon: '🏷️' },
  { href: '/admin/customers', label: 'العملاء والخطوط', icon: '👥' },
  { href: '/admin/campaigns', label: 'الحملات والخصومات', icon: '🎁' },
  { href: '/admin/payment-methods', label: 'وسائل الدفع والمحافظ', icon: '💳' },
  { href: '/admin/content', label: 'محتوى المتجر والأسئلة', icon: '📝' },
  { href: '/admin/settings', label: 'إعدادات المتجر العامة', icon: '⚙️' },
  { href: '/admin/health', label: 'جاهزية الإطلاق وحارس الأمان', icon: '🛡️', badge: '100%' },
  { href: '/admin/team', label: 'فريق العمل والصلاحيات', icon: '👥' },
  { href: '/admin/audit-logs', label: 'سجل التدقيق الرقابي', icon: '📜' },
  { href: '/admin/reports', label: 'التقارير والإحصائيات', icon: '📈' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication & Security State
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Do not wrap the login page in the admin shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setAuthState('authenticated');
      return;
    }

    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check' }),
        });

        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.authenticated && data.user) {
          setAdminUser(data.user);
          setAuthState('authenticated');
        } else {
          setAuthState('unauthenticated');
          const redirectUrl = `/admin/login?next=${encodeURIComponent(pathname || '/admin')}`;
          router.replace(redirectUrl);
        }
      } catch {
        if (!isMounted) return;
        setAuthState('unauthenticated');
        router.replace(`/admin/login?next=${encodeURIComponent(pathname || '/admin')}`);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {
      // ignore
    }
    router.replace('/admin/login');
  };

  // If this is the admin login route, render standalone without shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading Shield Screen while verifying security token
  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#0E041E] flex flex-col items-center justify-center text-white font-body px-4 text-center" dir="rtl">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3A1C6E] to-[#5C2D91] flex items-center justify-center text-[#B9F03C] shadow-xl shadow-purple-950/60 animate-pulse">
            <RouterIcon size={32} />
          </div>
          <div className="absolute -inset-1 rounded-2xl border-2 border-[#B9F03C]/40 animate-ping pointer-events-none" />
        </div>
        <h2 className="text-lg font-heading font-extrabold text-white mb-1.5">
          حارس الأمان والتحقق من الهوية
        </h2>
        <p className="text-xs text-[#A98BD6] max-w-sm leading-relaxed mb-4">
          جاري التحقق من التصريح الأمني وصلاحيات الحساب للوصول إلى لوحة الإدارة...
        </p>
        <div className="w-48 h-1 bg-[#1F0A3D] rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#B9F03C] origin-right animate-pulse" />
        </div>
      </div>
    );
  }

  // Unauthenticated fallback while redirecting
  if (authState === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#0E041E] flex flex-col items-center justify-center text-white font-body px-4 text-center" dir="rtl">
        <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-500/30 text-red-400 flex items-center justify-center mb-4 text-xl">
          🔒
        </div>
        <h2 className="text-base font-heading font-bold text-white mb-1">
          منطقة محمية وغير مصرح بالدخول
        </h2>
        <p className="text-xs text-[#A98BD6] mb-4">
          جاري تحويلك إلى صفحة تسجيل الدخول...
        </p>
      </div>
    );
  }

  const roleLabel =
    adminUser?.role === 'owner'
      ? 'المالك (Owner)'
      : adminUser?.role === 'admin' || adminUser?.role === 'super_admin'
      ? 'المدير العام (Admin)'
      : adminUser?.role === 'verifier'
      ? 'مدقق مدفوعات (Verifier)'
      : adminUser?.role === 'support'
      ? 'خدمة عملاء (Support)'
      : 'عضو فريق';

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#14101F] flex flex-col font-body" dir="rtl">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#170828] text-white border-b border-[#2A1250] px-4 sm:px-6 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label="القائمة الجانبية"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3A1C6E] to-[#5C2D91] flex items-center justify-center text-[#B9F03C] shadow-sm font-bold">
              <RouterIcon size={20} />
            </div>
            <div>
              <span className="font-heading font-extrabold text-sm sm:text-base text-white tracking-tight">
                لوحة إدارة متجر باقات WE
              </span>
              <span className="text-[10px] text-[#A98BD6] block font-mono">
                Admin Control Center • 2FA Active
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right Header Info */}
        <div className="flex items-center gap-3">
          {/* Global Command Palette (Ctrl+K) */}
          <CommandPalette />

          {/* Quick link to verification queue */}
          <Link
            href="/admin/verification"
            className="hidden sm:flex items-center gap-2 bg-[#2A1250] hover:bg-[#3A1C6E] border border-[#A98BD6]/30 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#B9F03C] animate-pulse" />
            <span>3 طلبات بانتظار المراجعة</span>
          </Link>

          {/* Admin User Badge */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-white">
              {adminUser?.name || 'المدير العام'} ({roleLabel})
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="text-xs text-[#cbbae7] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
          >
            عرض المتجر ↗
          </Link>

          {/* Logout Action Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="تسجيل الخروج من لوحة الإدارة"
            className="flex items-center gap-1.5 text-xs text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-500/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold disabled:opacity-50"
          >
            <span>🚪</span>
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 right-0 z-30 w-64 bg-[#1B0A33] text-[#E9E0F5] border-l border-[#2A1250] pt-20 lg:pt-4 px-3 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-[#8E8A9F] uppercase tracking-wider">
              أقسام الإدارة والتشغيل
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#5C2D91] text-white shadow-md'
                        : 'text-[#cbbae7] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[#B9F03C] text-[#1B0A33]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Info & Logout */}
          <div className="space-y-2 mt-6 mb-4">
            <div className="p-3 bg-[#140626] rounded-2xl border border-[#2A1250] text-[11px] text-[#8E8A9F] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">إصدار النظام:</span>
                <span className="font-mono text-[#B9F03C]">v1.0-prod</span>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>جلسة إدارية مشفرة ومؤمنة</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-red-950/50 text-[#8E8A9F] hover:text-red-300 border border-white/5 hover:border-red-500/20 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🚪</span>
              <span>تسجيل خروج المدير</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Admin Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
