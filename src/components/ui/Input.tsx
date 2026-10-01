import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixAddon?: React.ReactNode;
  suffixAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      prefixAddon,
      suffixAddon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full text-right" dir="rtl">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[#14101F] mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center rounded-xl border border-[#E2E8F0] bg-white transition-all duration-200 focus-within:border-[#5C2D91] focus-within:ring-2 focus-within:ring-[#E9E0F5]">
          {prefixAddon && (
            <div className="px-3 py-2.5 bg-[#F4F5F7] border-l border-[#E2E8F0] rounded-r-xl text-sm font-bold text-[#4A2480] tabular-nums select-none flex items-center justify-center shrink-0">
              {prefixAddon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'w-full bg-transparent px-4 py-3 text-sm text-[#14101F] placeholder:text-[#8E8A9F] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F4F5F7]',
              prefixAddon && 'pr-3',
              suffixAddon && 'pl-3',
              error && 'border-rose-500 focus-within:ring-rose-100',
              className
            )}
            {...props}
          />

          {suffixAddon && (
            <div className="px-3 py-2.5 text-sm text-[#5E5873] select-none flex items-center justify-center shrink-0">
              {suffixAddon}
            </div>
          )}
        </div>

        {error && <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-[#5E5873]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
