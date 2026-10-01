'use client';

import React from 'react';
import { PlanTier, QuotaUnit } from '@/types/database';
import { TIER_THEMES } from '@/lib/constants';

interface GBGaugeProps {
  quotaValue: number;
  quotaUnit: QuotaUnit;
  tier?: PlanTier;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  progressPercent?: number; // 0 to 100
  animated?: boolean;
  className?: string;
  showUnit?: boolean;
  customCenterText?: React.ReactNode;
}

const SIZE_MAP = {
  sm: { dimension: 72, strokeWidth: 5, fontSize: 'text-lg', unitSize: 'text-[10px]' },
  md: { dimension: 130, strokeWidth: 8, fontSize: 'text-3xl', unitSize: 'text-xs' },
  lg: { dimension: 180, strokeWidth: 10, fontSize: 'text-4xl', unitSize: 'text-sm' },
  hero: { dimension: 260, strokeWidth: 14, fontSize: 'text-6xl', unitSize: 'text-base' },
};

export const GBGauge: React.FC<GBGaugeProps> = ({
  quotaValue,
  quotaUnit,
  tier = 'Super',
  size = 'md',
  progressPercent,
  animated = true,
  className = '',
  showUnit = true,
  customCenterText,
}) => {
  const config = SIZE_MAP[size];
  const theme = TIER_THEMES[tier] || TIER_THEMES.Super;

  const radius = (config.dimension - config.strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  // Aesthetic sweep: calculate default progress based on quota if not explicitly passed
  let fillPercent = progressPercent;
  if (fillPercent === undefined) {
    if (quotaUnit === 'TB') {
      fillPercent = Math.min(95, 75 + (quotaValue / 18) * 20);
    } else {
      fillPercent = Math.min(90, 45 + (quotaValue / 1500) * 45);
    }
  }

  const strokeDashoffset = circumference - (fillPercent / 100) * circumference;
  const uniqueId = `gauge-grad-${tier.toLowerCase().replace(/\s+/g, '-')}-${size}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: config.dimension, height: config.dimension }}
      dir="ltr" // Kept LTR so SVG circular sweep and Latin figures render naturally
    >
      <svg
        width={config.dimension}
        height={config.dimension}
        viewBox={`0 0 ${config.dimension} ${config.dimension}`}
        className="transform -rotate-90 origin-center transition-transform duration-700"
      >
        <defs>
          <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.primary} />
            <stop offset="70%" stopColor={theme.secondary} />
            <stop offset="100%" stopColor={theme.energyGlow} />
          </linearGradient>

          <filter id={`glow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Track Ring */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          stroke="rgba(92, 45, 145, 0.08)"
          strokeWidth={config.strokeWidth}
        />

        {/* Subtle Decorative Tick Marks / Outer Border */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius + config.strokeWidth / 1.6}
          fill="none"
          stroke="rgba(92, 45, 145, 0.12)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />

        {/* Active Energy Progress Ring */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          stroke={`url(#${uniqueId})`}
          strokeWidth={config.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter={`url(#glow-${uniqueId})`}
          className={animated ? 'transition-all duration-1000 ease-out' : ''}
        />
      </svg>

      {/* Hero Center Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
        {customCenterText ? (
          customCenterText
        ) : (
          <>
            <span
              className={`font-heading font-extrabold tabular-nums tracking-tight leading-none text-[#14101F] ${config.fontSize}`}
            >
              {quotaValue}
            </span>
            {showUnit && (
              <span
                className={`font-heading font-semibold tracking-wider text-[#5C2D91] uppercase mt-0.5 ${config.unitSize}`}
              >
                {quotaUnit}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
