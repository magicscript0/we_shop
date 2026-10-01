'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { PlanTier } from '@/types/database';
import { TIER_THEMES } from '@/lib/constants';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tier?: PlanTier;
  enableTilt?: boolean;
  isPopular?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  tier,
  enableTilt = true,
  isPopular = false,
  className,
  children,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState(false);

  const theme = tier ? TIER_THEMES[tier] : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg tilt
    const rotateY = ((x - centerX) / centerX) * 5;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        borderColor: theme ? theme.border : undefined,
      }}
      className={cn(
        'relative bg-white rounded-2xl border border-[#E5E7EB] p-6 transition-shadow duration-300',
        'shadow-[0_4px_20px_-2px_rgba(92,45,145,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(92,45,145,0.18)]',
        isPopular && 'ring-2 ring-[#B9F03C]',
        className
      )}
      {...props}
    >
      {/* Subtle purple gradient glow line on top edge */}
      {theme && (
        <div
          className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.energyGlow})`,
          }}
        />
      )}
      {children}
    </div>
  );
};
