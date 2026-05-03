'use client';

/**
 * Button Component — FGL Design System
 * Variants: primary (tím), gold, outline, ghost, danger
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-gradient-to-r from-fgl-purple-600 to-fgl-purple-500 text-white hover:shadow-fgl hover:shadow-fgl-sm border-transparent',
  gold:    'bg-gradient-to-r from-fgl-gold-500 to-fgl-gold-600 text-fgl-dark-50 font-bold hover:shadow-fgl-gold border-transparent',
  outline: 'bg-transparent border border-fgl-purple-600/50 text-fgl-purple-300 hover:border-fgl-purple-500 hover:bg-fgl-purple-600/10',
  ghost:   'bg-transparent border-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]',
  danger:  'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-semibold',
          'border transition-all duration-200 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fgl-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          'active:scale-[0.98]',
          // Variants & sizes
          variants[variant],
          sizes[size],
          // States
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="animate-spin" />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}

        {children}

        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
