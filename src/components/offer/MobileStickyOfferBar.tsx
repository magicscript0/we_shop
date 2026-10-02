'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GiftIcon, ArrowLeftRTL } from '@/components/ui/Icons';

export const MobileStickyOfferBar: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(true);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('we_mobile_offer_dismissed');
      if (!dismissed) {
        setIsDismissed(false);
      }
    } catch {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    try {
      sessionStorage.setItem('we_mobile_offer_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (isDismissed) return null;

  return (
    <aside
      aria-label="عرض الترحيب للعملاء الجدد"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B0A33]/95 backdrop-blur-md border-t border-[#B9F03C]/40 px-4 py-2.5 shadow-2xl text-white text-right"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Info */}
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <div className="w-8 h-8 rounded-full bg-[#B9F03C] text-[#1B0A33] flex items-center justify-center shrink-0 font-bold shadow-sm">
            <GiftIcon size={16} />
          </div>
          <div className="leading-tight truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">خصم 50% للعملاء الجدد</span>
              <span className="text-[10px] bg-[#FF7A1A] text-white px-1.5 py-0.2 rounded font-extrabold">
                سقف 350 ج.م
              </span>
            </div>
            <p className="text-[11px] text-[#cbbae7] truncate mt-0.5">
              يطبق تلقائياً لأول اشتراك شهري
            </p>
          </div>
        </div>

        {/* Action Button & Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/plans"
            className="inline-flex items-center gap-1 bg-[#B9F03C] hover:bg-[#a6dc32] text-[#1B0A33] font-extrabold text-xs px-3 py-2 rounded-xl shadow-md"
          >
            <span>اختر باقتك</span>
            <ArrowLeftRTL size={12} />
          </Link>

          <button
            onClick={handleDismiss}
            aria-label="إغلاق الشريط"
            className="text-white/60 hover:text-white p-1 rounded-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};
