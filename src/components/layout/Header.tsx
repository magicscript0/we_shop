'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ShieldCheckIcon, RouterIcon } from '@/components/ui/Icons';
import { AnnouncementBar } from '@/components/offer/AnnouncementBar';
import { OfferTermsModal } from '@/components/offer/OfferTermsModal';
import { MobileStickyOfferBar } from '@/components/offer/MobileStickyOfferBar';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

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
          <Link
            href="/plans"
            className="hover:text-[#5C2D91] transition-colors py-2"
          >
            باقات الإنترنت المنزلي
          </Link>
          <Link
            href="/renew"
            className="hover:text-[#5C2D91] transition-colors py-2"
          >
            تجديد باقة
          </Link>
          <Link
            href="/track"
            className="hover:text-[#5C2D91] transition-colors py-2"
          >
            تتبع طلبك
          </Link>
          <Link
            href="/support"
            className="hover:text-[#5C2D91] transition-colors py-2"
          >
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
          <Link href="/auth/login" className="hidden sm:inline-block">
            <Button variant="ghost" size="sm">
              تسجيل الدخول
            </Button>
          </Link>
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
