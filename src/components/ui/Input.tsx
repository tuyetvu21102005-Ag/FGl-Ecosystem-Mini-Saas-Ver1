'use client';

/**
 * Input Component — FGL Design System
 * Hỗ trợ label, error message, icon trái/phải, disabled state
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, onRightIconClick, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full py-2.5 text-sm',
              'bg-white/[0.05] border border-white/[0.1]',
              'rounded-xl text-[var(--text-primary)]',
              'placeholder:text-[var(--text-muted)]',
              'transition-all duration-200 outline-none',
              'focus:border-fgl-purple-500 focus:bg-white/[0.07]',
              'focus:ring-2 focus:ring-fgl-purple-500/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon  ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              error && 'border-red-500/70 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                'absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)]',
                onRightIconClick && 'cursor-pointer hover:text-[var(--text-secondary)] transition-colors'
              )}
              onClick={onRightIconClick}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1 animate-fade-in">
            <span>⚠</span> {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-xs text-[var(--text-muted)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ── Textarea ─────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--text-secondary)]">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 text-sm min-h-[100px] resize-y',
            'bg-white/[0.05] border border-white/[0.1]',
            'rounded-xl text-[var(--text-primary)]',
            'placeholder:text-[var(--text-muted)]',
            'transition-all duration-200 outline-none',
            'focus:border-fgl-purple-500 focus:bg-white/[0.07]',
            'focus:ring-2 focus:ring-fgl-purple-500/20',
            error && 'border-red-500/70',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
