'use client';

/**
 * LoadingSpinner — FGL branded loading indicator
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
};

export const LoadingSpinner: React.FC<SpinnerProps> = ({ size = 'md', className, label }) => (
  <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
    <div
      className={cn(
        'rounded-full border-transparent',
        'border-t-fgl-purple-500 border-r-fgl-purple-400/50',
        'animate-spin',
        sizes[size]
      )}
      role="status"
      aria-label={label ?? 'Đang tải...'}
    />
    {label && (
      <p className="text-sm text-[var(--text-muted)] animate-pulse">{label}</p>
    )}
  </div>
);

/** Full page loading overlay */
export const PageLoader: React.FC<{ label?: string }> = ({ label = 'Đang tải...' }) => (
  <div className="fixed inset-0 bg-[var(--bg-base)] flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-6">
      {/* FGL Logo animation */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fgl-purple-600 to-fgl-purple-800 flex items-center justify-center shadow-fgl">
          <span className="text-2xl font-bold text-white font-display">F</span>
        </div>
        <div className="absolute -inset-2 rounded-2xl border-2 border-fgl-purple-500/30 animate-ping" />
      </div>
      <LoadingSpinner size="lg" label={label} />
    </div>
  </div>
);

/** Skeleton loading placeholder */
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'rounded-lg bg-white/[0.05]',
      'animate-pulse',
      className
    )}
  />
);
