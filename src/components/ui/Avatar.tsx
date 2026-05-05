'use client';

/**
 * Avatar Component — FGL Design System
 * Hiển thị ảnh đại diện với tier indicator
 */

import React from 'react';
import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';
import { TenantTier } from '@/types';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tier?: TenantTier;
  className?: string;
  showTier?: boolean;
}

const avatarSizes = {
  xs: { container: 'w-6 h-6',   text: 'text-[10px]', tier: 'w-2.5 h-2.5 border' },
  sm: { container: 'w-8 h-8',   text: 'text-xs',     tier: 'w-3 h-3 border' },
  md: { container: 'w-10 h-10', text: 'text-sm',     tier: 'w-3.5 h-3.5 border' },
  lg: { container: 'w-12 h-12', text: 'text-base',   tier: 'w-4 h-4 border-2' },
  xl: { container: 'w-16 h-16', text: 'text-xl',     tier: 'w-5 h-5 border-2' },
};

const tierColors: Record<TenantTier, string> = {
  regular: 'bg-blue-500',
  vip:     'bg-fgl-purple-500',
  vip_pro: 'bg-fgl-gold-500',
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  tier,
  className,
  showTier = false,
}) => {
  const sizeConfig = avatarSizes[size];
  const initials = getInitials(name);

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center overflow-hidden',
          'bg-gradient-to-br from-fgl-purple-600 to-fgl-purple-800',
          'border border-fgl-purple-500/30',
          sizeConfig.container
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 40px, 40px"
          />
        ) : (
          <span className={cn('font-semibold text-white', sizeConfig.text)}>
            {initials}
          </span>
        )}
      </div>

      {/* Tier indicator dot */}
      {showTier && tier && (
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full',
            'border-[var(--bg-base)]',
            sizeConfig.tier,
            tierColors[tier]
          )}
        />
      )}
    </div>
  );
};

/** Avatar Group — hiển thị nhiều avatar xếp chồng */
interface AvatarGroupProps {
  users: Array<{ name: string; src?: string | null }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, max = 4, size = 'sm' }) => {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <Avatar
          key={i}
          name={user.name}
          src={user.src}
          size={size}
          className="ring-2 ring-[var(--bg-base)]"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full',
            'bg-white/10 border border-white/20 ring-2 ring-[var(--bg-base)]',
            'text-xs font-medium text-[var(--text-muted)]',
            avatarSizes[size].container
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
