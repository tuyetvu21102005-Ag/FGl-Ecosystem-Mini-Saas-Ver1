'use client';

/**
 * Card Component — FGL Design System
 * Glassmorphism card với gradient border và hover effects
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'metric';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const cardVariants = {
  default:  'bg-white/[0.04] border border-white/[0.08]',
  elevated: 'bg-white/[0.07] border border-fgl-purple-600/20 shadow-card',
  bordered: 'bg-white/[0.04] border border-fgl-purple-600/30',
  metric:   'bg-white/[0.04] border border-white/[0.08] overflow-hidden',
};

const paddingSizes = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = true, padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl backdrop-blur-sm transition-all duration-300',
          cardVariants[variant],
          paddingSizes[padding],
          hover && 'hover:bg-white/[0.07] hover:border-fgl-purple-600/30 hover:-translate-y-0.5 hover:shadow-fgl-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub-components
export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <h3 className={cn('text-lg font-semibold text-[var(--text-primary)]', className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <p className={cn('text-sm text-[var(--text-muted)] mt-1', className)}>{children}</p>
);

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => <div className={cn(className)}>{children}</div>;

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn('mt-4 pt-4 border-t border-white/[0.06] flex items-center', className)}>
    {children}
  </div>
);
