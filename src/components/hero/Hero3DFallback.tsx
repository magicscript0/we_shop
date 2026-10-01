'use client';

import React from 'react';
import { GBGauge } from '@/components/ui/GBGauge';

export const Hero3DFallback: React.FC = () => {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-square flex items-center justify-center select-none" dir="ltr">
      {/* Outer ambient glow rings */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#5C2D91]/20 via-[#B9F03C]/10 to-transparent blur-3xl" />
      
      {/* Animated Orbiting SVG Rings */}
      <svg
        className="absolute inset-0 w-full h-full animate-[spin_40s_linear_infinite]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle
          cx="200"
          cy="200"
          r="170"
          stroke="rgba(92, 45, 145, 0.2)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
        <circle
          cx="200"
          cy="200"
          r="140"
          stroke="rgba(185, 240, 60, 0.25)"
          strokeWidth="1"
          strokeDasharray="6 12"
        />
        {/* Orbiting Neon Marker Dot */}
        <circle cx="370" cy="200" r="5" fill="#B9F03C" filter="drop-shadow(0 0 6px #B9F03C)" />
        <circle cx="60" cy="200" r="4" fill="#A98BD6" />
      </svg>

      {/* Hero GB Gauge in Center */}
      <div className="relative z-10 p-6 rounded-3xl bg-[#170828]/90 border border-[#A98BD6]/30 shadow-[0_20px_50px_rgba(42,18,80,0.5)] backdrop-blur-md flex flex-col items-center">
        <GBGauge
          quotaValue={500}
          quotaUnit="GB"
          tier="Super"
          size="hero"
          animated={true}
        />
        <div className="mt-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B9F03C] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">
            سعة فائقة وسرعة مستقرة
          </span>
        </div>
      </div>
    </div>
  );
};
