'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Hero3DFallback } from './Hero3DFallback';

// Lazy load Three.js 3D scene in a separate chunk after first paint
const Hero3DScene = dynamic(
  () => import('./Hero3DScene').then((mod) => mod.Hero3DScene),
  {
    ssr: false,
    loading: () => <Hero3DFallback />,
  }
);

export const HeroVisual: React.FC = () => {
  const [useFallback, setUseFallback] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // Check conditions for automatic lightweight fallback (Section 4.6):
    // 1. User prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Data saver mode enabled in browser
    // @ts-expect-error Connection API types vary across browsers
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSaveData = connection?.saveData === true;
    const isSlowConnection = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';

    // 3. Hardware concurrency (weak device check: <= 4 cores)
    const isLowEndDevice = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;

    if (prefersReducedMotion || isSaveData || isSlowConnection || isLowEndDevice) {
      setUseFallback(true);
    } else {
      setUseFallback(false);
    }
  }, []);

  if (!mounted) {
    return <Hero3DFallback />;
  }

  return (
    <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
      {useFallback ? (
        <Hero3DFallback />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <Hero3DScene />
          {/* Overlay GB Gauge in the middle of the 3D orbit */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Hero3DFallback />
          </div>
        </div>
      )}
    </div>
  );
};
