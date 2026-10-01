import React from 'react';
import { cn } from '@/lib/utils';
import { PlanTier } from '@/types/database';
import { TIER_THEMES, ORDER_STATUS_LABELS } from '@/lib/constants';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'family' | 'period' | 'discount' | 'status' | 'neutral' | 'agent';
  tier?: PlanTier;
  period?: 'monthly' | 'yearly' | 'other';
  statusKey?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  tier,
  period,
  statusKey,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg font-semibold',
    lg: 'text-sm px-3 py-1.5 rounded-xl font-bold',
  };

  let content = children;
  let customStyle: React.CSSProperties = {};
  let variantClass = 'bg-[#F4F5F7] text-[#14101F] border border-[#E5E7EB]';

  if (variant === 'family' && tier) {
    const theme = TIER_THEMES[tier] || TIER_THEMES.Super;
    customStyle = {
      backgroundColor: theme.badgeBg,
      color: theme.badgeText,
      borderColor: theme.border,
    };
    variantClass = 'border';
  } else if (variant === 'period' && period) {
    if (period === 'monthly') {
      variantClass = 'bg-[#E9E0F5] text-[#4A2480] border border-[#CBBAE7]';
      if (!children) content = 'شهري';
    } else if (period === 'yearly') {
      variantClass = 'bg-[#2A1250] text-[#B9F03C] border border-[#3A1C6E]';
      if (!children) content = 'سنوي';
    } else {
      variantClass = 'bg-[#F4F5F7] text-[#5E5873] border border-[#E5E7EB]';
      if (!children) content = 'مخصص';
    }
  } else if (variant === 'discount') {
    // Reserved warm orange #FF7A1A for discount/gift only
    variantClass = 'bg-[#FFF2EA] text-[#FF7A1A] border border-[#FFD2B3] font-bold';
  } else if (variant === 'status' && statusKey) {
    const statusMeta = ORDER_STATUS_LABELS[statusKey];
    if (statusMeta) {
      variantClass = `${statusMeta.colorClass} border font-medium`;
      if (!children) content = statusMeta.labelAr;
    }
  } else if (variant === 'agent') {
    variantClass = 'bg-[#2A1250] text-white border border-[#4A2480] font-semibold';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center tracking-normal select-none',
        sizeClasses[size],
        variantClass,
        className
      )}
      style={customStyle}
      {...props}
    >
      {content}
    </span>
  );
};
