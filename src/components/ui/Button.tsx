'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'discount';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-9 px-3.5 text-xs font-semibold rounded-lg gap-1.5',
      md: 'h-11 px-5 text-sm font-semibold rounded-xl gap-2',
      lg: 'h-13 px-7 text-base font-bold rounded-xl gap-2.5',
      xl: 'h-14 px-8 text-lg font-bold rounded-2xl gap-3 shadow-lg',
    };

    const variantClasses = {
      // Primary: Neon green #B9F03C + dark purple #1B0A33 (Contrast 13.7:1)
      primary:
        'bg-[#B9F03C] text-[#1B0A33] hover:bg-[#aee634] active:scale-[0.98] shadow-sm hover:shadow-[0_0_20px_rgba(185,240,60,0.4)] border border-[#a6dd32]',
      // Secondary: WE purple #5C2D91 + white
      secondary:
        'bg-[#5C2D91] text-white hover:bg-[#4A2480] active:scale-[0.98] shadow-sm hover:shadow-[0_8px_20px_-4px_rgba(92,45,145,0.3)]',
      // Outline: Subtle border with purple text
      outline:
        'bg-transparent text-[#5C2D91] border border-[#CBBAE7] hover:bg-[#F6F2FC] active:scale-[0.98]',
      // Ghost
      ghost:
        'bg-transparent text-[#14101F] hover:bg-[#F4F5F7] hover:text-[#5C2D91]',
      // Discount Orange (Used strictly for special gift claims)
      discount:
        'bg-[#FF7A1A] text-white hover:bg-[#e86a0f] active:scale-[0.98] shadow-sm hover:shadow-[0_0_20px_rgba(255,122,26,0.35)]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-heading transition-all duration-200 select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2D91] focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        <span>{children}</span>
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
