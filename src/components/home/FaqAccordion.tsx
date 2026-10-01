'use client';

import React, { useState } from 'react';
import { FAQItem } from '@/types/database';

interface FaqAccordionProps {
  items: Array<{ question: string; answer: string }>;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3" dir="rtl">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full p-5 text-right flex items-center justify-between gap-4 font-heading font-bold text-base text-[#14101F] hover:text-[#5C2D91] transition-colors cursor-pointer"
            >
              <span>{item.question}</span>
              <span
                className={`w-7 h-7 rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#5C2D91] shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-[#E9E0F5]' : ''
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm text-[#5E5873] leading-relaxed border-t border-[#F4F5F7] animate-in fade-in duration-200">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
