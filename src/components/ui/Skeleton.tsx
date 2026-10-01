import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text' | 'gauge';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rect',
  ...props
}) => {
  const variantStyles = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded-md h-4 w-3/4',
    gauge: 'rounded-full w-32 h-32 border-4 border-[#E9E0F5]',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-[#F4F5F7] via-[#E9E0F5]/50 to-[#F4F5F7] bg-[length:200%_100%]',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};
