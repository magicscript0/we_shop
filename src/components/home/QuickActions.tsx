'use client';

import React from 'react';
import Link from 'next/link';
import { RouterIcon, ZapIcon, ArrowLeftRTL } from '@/components/ui/Icons';

export const QuickActions: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_12px_30px_-5px_rgba(92,45,145,0.08)] p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Action 1: Renew Plan */}
        <Link
          href="/renew"
          className="flex items-center justify-between p-4 rounded-2xl bg-[#F6F2FC] hover:bg-[#E9E0F5] transition-all group border border-[#CBBAE7]/50"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#5C2D91] text-[#B9F03C] flex items-center justify-center shadow-sm shrink-0">
              <RouterIcon size={24} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-[#14101F] group-hover:text-[#5C2D91] transition-colors">
                تجديد باقة حالية
              </h3>
              <p className="text-xs text-[#5E5873] mt-0.5">
                جدد باقتك الحالية مباشرة على خطك الأرضي
              </p>
            </div>
          </div>
          <ArrowLeftRTL size={20} className="text-[#5C2D91] group-hover:-translate-x-1 transition-transform shrink-0" />
        </Link>

        {/* Action 2: Top up / Extra Quota */}
        <Link
          href="/plans"
          className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F5F7] hover:bg-[#E9E0F5]/50 transition-all group border border-[#E5E7EB]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#2A1250] text-[#B9F03C] flex items-center justify-center shadow-sm shrink-0">
              <ZapIcon size={24} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-[#14101F] group-hover:text-[#5C2D91] transition-colors">
                شحن سعة إضافية
              </h3>
              <p className="text-xs text-[#5E5873] mt-0.5">
                تصفح الباقات والشحنات الإضافية
              </p>
            </div>
          </div>
          <ArrowLeftRTL size={20} className="text-[#5C2D91] group-hover:-translate-x-1 transition-transform shrink-0" />
        </Link>

        {/* Action 3: Check Usage (Official WE Link, Section 1 & 5) */}
        <a
          href="https://te.eg"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#F4F5F7] transition-all group border border-[#E5E7EB]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#F4F5F7] text-[#5C2D91] flex items-center justify-center shadow-sm shrink-0 group-hover:bg-[#E9E0F5]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-bold text-sm sm:text-base text-[#14101F]">
                  الاستعلام عن استهلاكك
                </h3>
                <span className="text-[10px] bg-[#E9E0F5] text-[#5C2D91] px-1.5 py-0.5 rounded font-bold">
                  موقع WE
                </span>
              </div>
              <p className="text-xs text-[#5E5873] mt-0.5">
                معرفة رصيدك المتبقي عبر منصة المصرية للاتصالات
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#5E5873] group-hover:text-[#5C2D91] shrink-0">
            فتح ↗
          </span>
        </a>
      </div>
    </div>
  );
};
