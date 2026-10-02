'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheckIcon, RouterIcon, WalletIcon, ClockIcon, ZapIcon } from '@/components/ui/Icons';
import { CommandPalette } from '@/components/admin/CommandPalette';

interface AdminLayoutProps {
  children: React.ReactNode;
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-white">المدير العام (Owner)</span>
          </div>

          <Link
            href="/"
            className="text-xs text-[#cbbae7] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            عرض المتجر ↗
          </Link>
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

          {/* Bottom Sidebar Info */}
          <div className="p-3 bg-[#140626] rounded-2xl border border-[#2A1250] text-[11px] text-[#8E8A9F] space-y-1 mt-6 mb-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">إصدار النظام:</span>
              <span className="font-mono text-[#B9F03C]">v1.0-prod</span>
            </div>
            <p className="text-[10px] leading-tight">
              جلسة عمل مؤمنة ببروتوكول HTTPS وسجلات التدقيق الرقابي نشطة.
            </p>
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
