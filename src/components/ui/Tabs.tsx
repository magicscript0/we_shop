'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  badge?: string | number;
}

interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  variant?: 'pill' | 'underline' | 'period';
  className?: string;
}

export function Tabs<T extends string = string>({
  items,
  activeId,
  onChange,
  variant = 'pill',
  className,
}: TabsProps<T>) {
  if (variant === 'period') {
    return (
      <div
        className={cn(
          'inline-flex p-1 bg-[#F4F5F7] rounded-xl border border-[#E2E8F0] select-none',
          className
        )}
        dir="rtl"
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer',
                isActive
                  ? 'bg-[#5C2D91] text-white shadow-sm'
                  : 'text-[#5E5873] hover:text-[#14101F]'
              )}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'mr-1.5 px-1.5 py-0.5 text-xs rounded-full',
                    isActive ? 'bg-[#B9F03C] text-[#1B0A33]' : 'bg-[#E5E7EB] text-[#5E5873]'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none',
        className
      )}
      dir="rtl"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-heading font-semibold rounded-xl transition-all duration-200 shrink-0 cursor-pointer border',
              isActive
                ? 'bg-[#2A1250] text-[#B9F03C] border-[#2A1250] shadow-sm'
                : 'bg-white text-[#5E5873] border-[#E5E7EB] hover:bg-[#F4F5F7] hover:text-[#14101F]'
            )}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  'mr-2 px-2 py-0.5 text-xs rounded-full font-bold tabular-nums',
                  isActive ? 'bg-[#B9F03C] text-[#1B0A33]' : 'bg-[#F4F5F7] text-[#5C2D91]'
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
