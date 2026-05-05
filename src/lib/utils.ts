/**
 * Utility functions cho FGL Ecosystem
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TenantTier } from '@/types';

/** Merge Tailwind classes an toàn */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format tiền VNĐ */
export function formatVND(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M₫`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K₫`;
  }
  return `${amount}₫`;
}

/** Format số với dấu chấm phân cách */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/** Format ngày giờ tiếng Việt */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** Format thời gian tương đối (vd: "5 phút trước") */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(d);
}

/** Tên hiển thị cho tier */
export function getTierName(tier: TenantTier): string {
  const names: Record<TenantTier, string> = {
    regular: 'Regular',
    vip: 'VIP',
    vip_pro: 'VIP Pro',
  };
  return names[tier];
}

/** Màu badge theo tier */
export function getTierClass(tier: TenantTier): string {
  const classes: Record<TenantTier, string> = {
    regular: 'badge-regular',
    vip: 'badge-vip',
    vip_pro: 'badge-vip-pro',
  };
  return classes[tier];
}

/** Kiểm tra user có quyền truy cập feature không */
export function canAccess(userTier: TenantTier, requiredTier: TenantTier): boolean {
  const order: TenantTier[] = ['regular', 'vip', 'vip_pro'];
  return order.indexOf(userTier) >= order.indexOf(requiredTier);
}

/** Generate initials từ tên */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Truncate text */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/** Validate số điện thoại Việt Nam */
export function isValidVietnamesePhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return /^(0|\+84)(3[2-9]|5[6-9]|7[0-9]|8[0-9]|9[0-9])\d{7}$/.test(cleaned);
}

/** Format SĐT hiển thị */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  return phone;
}
