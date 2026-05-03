'use client';

/**
 * Badge Component — FGL Design System
 * Dùng cho tier, trạng thái, và label
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { TenantTier, LeadStatus, BookingStatus } from '@/types';

// ── Tier Badge ───────────────────────────────────────────────

interface TierBadgeProps {
  tier: TenantTier;
  className?: string;
}

const tierConfig: Record<TenantTier, { label: string; className: string }> = {
  free:    { label: 'Miễn phí', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  regular: { label: 'Regular',  className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  vip:     { label: 'VIP',      className: 'bg-fgl-purple-600/20 text-fgl-purple-300 border-fgl-purple-600/40' },
  vip_pro: { label: '⭐ VIP Pro', className: 'bg-fgl-gold-500/15 text-fgl-gold-400 border-fgl-gold-500/40' },
};

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, className }) => {
  const config = tierConfig[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

// ── Status Badge ─────────────────────────────────────────────

interface StatusBadgeProps {
  status: LeadStatus | BookingStatus | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  // Lead statuses
  new:         { label: 'Mới',         className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',    dot: 'bg-blue-400' },
  contacted:   { label: 'Đã liên hệ', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  qualified:   { label: 'Tiềm năng',   className: 'bg-purple-500/15 text-purple-400 border-purple-500/30', dot: 'bg-purple-400' },
  booked:      { label: 'Đã đặt lịch', className: 'bg-green-500/15 text-green-400 border-green-500/30',  dot: 'bg-green-400' },
  closed:      { label: 'Đã chốt',     className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  lost:        { label: 'Mất lead',    className: 'bg-red-500/15 text-red-400 border-red-500/30',       dot: 'bg-red-400' },
  // Booking statuses
  pending:     { label: 'Chờ xác nhận', className: 'bg-orange-500/15 text-orange-400 border-orange-500/30', dot: 'bg-orange-400' },
  confirmed:   { label: 'Đã xác nhận', className: 'bg-green-500/15 text-green-400 border-green-500/30',  dot: 'bg-green-400' },
  completed:   { label: 'Hoàn thành',  className: 'bg-fgl-purple-600/15 text-fgl-purple-300 border-fgl-purple-600/30', dot: 'bg-fgl-purple-400' },
  cancelled:   { label: 'Đã hủy',      className: 'bg-red-500/15 text-red-400 border-red-500/30',       dot: 'bg-red-400' },
  no_show:     { label: 'Không đến',   className: 'bg-gray-500/15 text-gray-400 border-gray-500/30',    dot: 'bg-gray-400' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    dot: 'bg-gray-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
};

// ── Generic Badge ────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'gold' | 'green' | 'red' | 'blue' | 'gray';
  className?: string;
}

const badgeVariants = {
  purple: 'bg-fgl-purple-600/20 text-fgl-purple-300 border-fgl-purple-600/40',
  gold:   'bg-fgl-gold-500/15 text-fgl-gold-400 border-fgl-gold-500/40',
  green:  'bg-green-500/15 text-green-400 border-green-500/30',
  red:    'bg-red-500/15 text-red-400 border-red-500/30',
  blue:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  gray:   'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'purple', className }) => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      badgeVariants[variant],
      className
    )}
  >
    {children}
  </span>
);
