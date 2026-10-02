'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GiftIcon, ArrowLeftRTL, ShieldCheckIcon } from '@/components/ui/Icons';
import { useCms } from '@/lib/hooks/useCms';

interface AnnouncementBarProps {
  onOpenTerms?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenTerms }) => {
  const cms = useCms();
  const [isDismissed, setIsDismissed] = useState<boolean>(true);

  useEffect(() => {
    // Check sessionStorage
    try {
      const dismissed = sessionStorage.getItem('we_welcome_bar_dismissed');
      if (!dismissed) {
        setIsDismissed(false);
      }
    } catch {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('we_welcome_bar_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (isDismissed || !cms['announcement.is_active']) return null;

  return (
    <div className="bg-gradient-to-r from-[#2A1250] via-[#5C2D91] to-[#2A1250] text-white px-3 sm:px-6 py-2.5 text-xs font-medium border-b border-[#B9F03C]/30 relative z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Offer Tag & Main Message */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 overflow-hidden">
          <span className="inline-flex items-center gap-1 bg-[#B9F03C] text-[#1B0A33] px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shrink-0 shadow-sm animate-pulse">
            <GiftIcon size={13} />
            <span>{cms['announcement.badge']}</span>
          </span>

          <p className="truncate text-white text-[11px] sm:text-xs font-semibold">
            {cms['announcement.title']} {cms['announcement.cap_note']}
          </p>
        </div>

        {/* Action Buttons & Close */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onOpenTerms && (
            <button
              onClick={onOpenTerms}
              className="hidden md:inline-flex text-[#cbbae7] hover:text-white underline text-[11px] font-medium cursor-pointer"
            >
              الشروط والأحكام
            </button>
          )}

          <Link
            href={cms['announcement.cta_link'] || '/plans'}
            className="inline-flex items-center gap-1 bg-white text-[#5C2D91] hover:bg-[#E9E0F5] px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm shrink-0"
          >
            <span>{cms['announcement.cta_text']}</span>
            <ArrowLeftRTL size={12} />
          </Link>

          <button
            onClick={handleDismiss}
            aria-label="إغلاق شريط الإعلان"
            className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
