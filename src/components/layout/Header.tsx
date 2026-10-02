'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { ShieldCheckIcon, RouterIcon } from '@/components/ui/Icons';
import { AnnouncementBar } from '@/components/offer/AnnouncementBar';
import { OfferTermsModal } from '@/components/offer/OfferTermsModal';
import { MobileStickyOfferBar } from '@/components/offer/MobileStickyOfferBar';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export const Header: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Check active session immediately on mount
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });

    // 2. Listen to real-time auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'حسابي';

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <>
      {/* Skip to Main Content Link (a11y) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-50 focus:bg-[#5C2D91] focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#B9F03C] text-xs font-bold font-heading"
      >
        تخطي إلى المحتوى الرئيسي
      </a>

      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        {/* Top Dismissible Announcement Bar (Change 3) */}
        <AnnouncementBar onOpenTerms={() => setTermsModalOpen(true)} />
        {/* Top Authorized Agent Notice Bar */}
        <div className="bg-[#2A1250] text-white py-1 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheckIcon size={14} className="text-[#B9F03C]" />
              <span>وكيل وموزع معتمد لخدمات المصرية للاتصالات (WE)</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[#cbbae7]">
              <Link href="/support" className="hover:text-white transition-colors">
                الدعم الفني وخدمة العملاء
              </Link>
              <span>|</span>
              <span>ساعات العمل: 9:00 ص - 11:00 م</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand Name (Right side in RTL) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2A1250] to-[#5C2D91] flex items-center justify-center text-[#B9F03C] shadow-sm group-hover:shadow-[0_0_15px_rgba(92,45,145,0.3)] transition-all">
              <RouterIcon size={22} />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg text-[#14101F] tracking-tight leading-none">
                متجر باقات <span className="text-[#5C2D91]">WE</span>
              </span>
              <span className="text-[11px] text-[#5E5873] font-medium mt-0.5">
                خدمات الإنترنت المنزلي المعتمدة
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#14101F]">
            <Link href="/plans" className="hover:text-[#5C2D91] transition-colors py-2">
              باقات الإنترنت المنزلي
            </Link>
            <Link href="/renew" className="hover:text-[#5C2D91] transition-colors py-2">
              تجديد باقة
            </Link>
            <Link href="/track" className="hover:text-[#5C2D91] transition-colors py-2">
              تتبع طلبك
            </Link>
            <Link href="/support" className="hover:text-[#5C2D91] transition-colors py-2">
              الدعم الفني
            </Link>
            <a
              href="https://te.eg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#5E5873] bg-[#F4F5F7] px-2.5 py-1 rounded-md hover:bg-[#E9E0F5] hover:text-[#5C2D91] transition-colors"
            >
              الاستعلام عن الرصيد (موقع WE الرسمي) ↗
            </a>
          </nav>

          {/* Action Buttons (Left side in RTL) */}
          <div className="flex items-center gap-3">
            {user ? (
              /* User is Logged In */
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F4F5F7] hover:bg-[#E9E0F5] border border-[#E5E7EB] transition-colors text-xs font-bold text-[#14101F]"
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-6 h-6 rounded-full object-cover border border-[#5C2D91]/30"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#5C2D91] text-[#B9F03C] flex items-center justify-center text-[11px] font-extrabold">
                      {displayName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate hidden sm:inline">{displayName}</span>
                  <span className="text-[10px] text-[#5C2D91] font-mono hidden sm:inline">(حسابي)</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  title="تسجيل الخروج"
                  className="hidden sm:flex text-xs text-[#5E5873] hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  خروج
                </button>
              </div>
            ) : (
              /* User is Guest / Logged Out */
              <Link href="/auth/login" className="hidden sm:inline-block">
                <Button variant="ghost" size="sm">
                  تسجيل الدخول
                </Button>
              </Link>
            )}

            <Link href="/plans">
              <Button variant="primary" size="sm">
                اختر باقتك
              </Button>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#14101F] hover:bg-[#F4F5F7]"
              aria-label="القائمة"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 pt-3 pb-6 space-y-3">
            {user && (
              <div className="p-3 bg-[#F4F5F7] rounded-xl flex items-center justify-between border border-[#E5E7EB] mb-2">
                <Link
                  href="/account"
                  className="flex items-center gap-2.5 flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover border border-[#5C2D91]/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#5C2D91] text-[#B9F03C] flex items-center justify-center text-xs font-bold">
                      {displayName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="block text-xs font-bold text-[#14101F]">{displayName}</span>
                    <span className="text-[10px] text-[#5C2D91]">عرض لوحة حسابي والخطوط ↗</span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="text-xs text-red-600 font-bold px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                >
                  خروج
                </button>
              </div>
            )}

            {!user && (
              <Link
                href="/auth/login"
                className="block text-sm font-bold text-[#5C2D91] py-2 bg-[#F8F9FA] px-3 rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                تسجيل الدخول / إنشاء حساب
              </Link>
            )}

            <Link
              href="/plans"
              className="block text-sm font-semibold text-[#14101F] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              باقات الإنترنت المنزلي
            </Link>
            <Link
              href="/renew"
              className="block text-sm font-semibold text-[#14101F] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              تجديد باقة
            </Link>
            <Link
              href="/track"
              className="block text-sm font-semibold text-[#14101F] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              تتبع طلبك
            </Link>
            <Link
              href="/support"
              className="block text-sm font-semibold text-[#14101F] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              الدعم الفني
            </Link>
            <a
              href="https://te.eg"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-[#5E5873] bg-[#F4F5F7] p-2.5 rounded-lg"
            >
              الاستعلام عن الرصيد (موقع WE الرسمي) ↗
            </a>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Offer Bar (Change 3) */}
      <MobileStickyOfferBar />

      {/* Transparent Offer Terms Modal (Change 3) */}
      <OfferTermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
    </>
  );
};
