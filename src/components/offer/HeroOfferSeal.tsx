'use client';

import React from 'react';
import Link from 'next/link';
import { GiftIcon, ShieldCheckIcon, ArrowLeftRTL, ZapIcon } from '@/components/ui/Icons';
import { useCms } from '@/lib/hooks/useCms';

interface HeroOfferSealProps {
  onOpenTerms?: () => void;
}

export const HeroOfferSeal: React.FC<HeroOfferSealProps> = ({ onOpenTerms }) => {
  const cms = useCms();

  if (!cms['hero.seal_active']) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2A1250] via-[#3A1C6E] to-[#1B0A33] border-2 border-[#B9F03C]/40 p-6 sm:p-7 text-white shadow-[0_10px_35px_-5px_rgba(185,240,60,0.15)] text-right">
      {/* Background Accent Glow */}
      <div className="absolute top-0 -left-10 w-44 h-44 bg-[#B9F03C]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 -right-10 w-44 h-44 bg-[#FF7A1A]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Seal Header Pill */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9F03C] text-[#1B0A33] text-xs font-black font-heading shadow-md">
            <GiftIcon size={14} />
            <span>{cms['hero.seal_tag'] || 'عرض الترحيب الحصري'}</span>
          </div>

          <span className="text-[11px] font-semibold text-[#cbbae7]">
            سقف التوفير 350 ج.م
          </span>
        </div>

        {/* Big Offer Headline */}
        <div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            خصم <span className="text-[#B9F03C]">50%</span> فوري لأول اشتراك
          </h3>
          <p className="text-xs sm:text-sm text-[#E9E0F5] mt-1 leading-relaxed">
            مخصص للعملاء الجدد عند طلب أي باقة شهرية، يطبق تلقائياً في خطوة الدفع لمرة واحدة لكل خط أرضي.
          </p>
        </div>

        {/* Real Examples Breakdown Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
          {/* Example 1: 200 GB */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span className="text-white">باقة سوبر 200 GB</span>
              <span className="text-[#B9F03C] font-mono text-sm">188 ج.م</span>
            </div>
            <p className="text-[11px] text-[#cbbae7]">
              بدلاً من <span className="line-through text-white/60">376 ج.م</span> شامل الضريبة (توفير 165 ج.م)
            </p>
          </div>

          {/* Example 2: 500 GB */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/15 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span className="text-white">باقة سوبر 500 GB</span>
              <span className="text-[#B9F03C] font-mono text-sm">376 ج.م</span>
            </div>
            <p className="text-[11px] text-[#cbbae7]">
              بدلاً من <span className="line-through text-white/60">752 ج.م</span> شامل الضريبة (توفير 330 ج.م)
            </p>
          </div>
        </div>

        {/* Micro-terms & CTA */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-white/10">
          <div className="flex items-center gap-1.5 text-[#cbbae7] text-[11px]">
            <ShieldCheckIcon size={14} className="text-[#B9F03C] shrink-0" />
            <span>صالح 7 أيام من التسجيل · باقات شهرية فقط</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenTerms && (
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-white/80 hover:text-white underline text-[11px] cursor-pointer"
              >
                الشروط والضوابط
              </button>
            )}

            <Link
              href="/plans"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#1B0A33] bg-[#B9F03C] hover:bg-[#a6dc32] px-3 py-1.5 rounded-lg shadow-sm transition-transform active:scale-95"
            >
              <span>اختر باقتك بالخصم</span>
              <ArrowLeftRTL size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
