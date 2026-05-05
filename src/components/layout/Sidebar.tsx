'use client';

/**
 * Sidebar Component — Dashboard Navigation
 * Collapsible, role-based menu với tier-gating
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Calendar, FileText, BarChart3,
  Settings, ChevronLeft, ChevronRight, Sparkles, MessageSquare,
  Zap, Lock, Crown, Menu, X,
} from 'lucide-react';
import { cn, canAccess } from '@/lib/utils';
import { TierBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { NavItem, TenantTier, UserWithProfile } from '@/types';

// ── Navigation config ────────────────────────────────────────

const navItems: NavItem[] = [
  {
    label: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
    tier: ['regular', 'vip', 'vip_pro'],
  },
  {
    label: 'Khách hàng',
    href: '/dashboard/leads',
    icon: Users,
    tier: ['regular', 'vip', 'vip_pro'],
  },
  {
    label: 'Đặt lịch',
    href: '/dashboard/booking',
    icon: Calendar,
    tier: ['regular', 'vip', 'vip_pro'],
  },
  {
    label: 'AI Chat Widget',
    href: '/dashboard/chat',
    icon: MessageSquare,
    tier: ['regular', 'vip', 'vip_pro'],
  },
  {
    label: 'Nội dung AI',
    href: '/dashboard/content',
    icon: FileText,
    tier: ['vip', 'vip_pro'],
  },
  {
    label: 'Marketing',
    href: '/dashboard/marketing',
    icon: Sparkles,
    tier: ['vip', 'vip_pro'],
  },
  {
    label: 'Báo cáo',
    href: '/dashboard/analytics',
    icon: BarChart3,
    tier: ['vip', 'vip_pro'],
  },
  {
    label: 'Automation',
    href: '/dashboard/automation',
    icon: Zap,
    tier: ['vip_pro'],
  },
];

const bottomNavItems: NavItem[] = [
  {
    label: 'Cài đặt',
    href: '/dashboard/settings',
    icon: Settings,
    tier: ['regular', 'vip', 'vip_pro'],
  },
];

// ── Component ────────────────────────────────────────────────

interface SidebarProps {
  user: UserWithProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const userTier = user.tenant.tier;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]',
        collapsed && 'justify-center px-3'
      )}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fgl-purple-600 to-fgl-purple-800 flex items-center justify-center flex-shrink-0 shadow-fgl-sm">
          <span className="text-base font-bold text-white font-display">F</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-bold text-white whitespace-nowrap">Feel Great Life</p>
              <p className="text-[10px] text-[var(--text-muted)] whitespace-nowrap truncate max-w-[120px]">
                {user.tenant.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scroll-hidden">
        {navItems.map((item) => {
          const hasAccess = canAccess(userTier, item.tier?.[0] ?? 'regular');
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <NavItemComponent
              key={item.href}
              item={item}
              isActive={isActive}
              hasAccess={hasAccess}
              collapsed={collapsed}
              Icon={Icon}
              userTier={userTier}
            />
          );
        })}
      </nav>

      {/* Upgrade CTA — chỉ hiện khi không phải VIP Pro */}
      {!collapsed && userTier !== 'vip_pro' && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-fgl-purple-600/20 to-fgl-gold-500/10 border border-fgl-purple-600/30">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={14} className="text-fgl-gold-400" />
            <span className="text-xs font-semibold text-fgl-gold-400">Nâng cấp VIP Pro</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mb-2">
            Mở khóa toàn bộ 8 công cụ AI
          </p>
          <Link
            href="/dashboard/upgrade"
            className="block text-center text-[11px] font-semibold py-1.5 rounded-lg bg-gradient-to-r from-fgl-gold-500 to-fgl-gold-600 text-fgl-dark-50 hover:shadow-fgl-gold transition-all"
          >
            Xem gói 999K/tháng
          </Link>
        </div>
      )}

      {/* Bottom nav */}
      <div className="border-t border-white/[0.06] px-2 py-3 space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <NavItemComponent
              key={item.href}
              item={item}
              isActive={isActive}
              hasAccess={true}
              collapsed={collapsed}
              Icon={Icon}
              userTier={userTier}
            />
          );
        })}
      </div>

      {/* User profile */}
      <div className={cn(
        'border-t border-white/[0.06] p-3',
        collapsed ? 'flex justify-center' : 'flex items-center gap-3'
      )}>
        <Avatar
          name={user.profile.full_name}
          src={user.profile.avatar_url}
          size="sm"
          tier={userTier}
          showTier
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 min-w-0 overflow-hidden"
            >
              <p className="text-sm font-medium text-white truncate">{user.profile.full_name}</p>
              <TierBadge tier={userTier} className="mt-0.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col relative flex-shrink-0 h-full bg-white/[0.02] border-r border-white/[0.06] overflow-hidden"
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-6 -right-3 w-6 h-6 rounded-full bg-fgl-purple-600 border border-fgl-purple-500/50 flex items-center justify-center text-white shadow-fgl-sm hover:bg-fgl-purple-500 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl bg-fgl-purple-600/80 backdrop-blur-sm border border-fgl-purple-500/30 flex items-center justify-center text-white"
      >
        <Menu size={18} />
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50 bg-[#150c33] border-r border-white/[0.08] flex flex-col"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20"
              >
                <X size={16} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ── NavItem sub-component ────────────────────────────────────

interface NavItemComponentProps {
  item: NavItem;
  isActive: boolean;
  hasAccess: boolean;
  collapsed: boolean;
  Icon: NavItem['icon'];
  userTier: TenantTier;
}

const NavItemComponent: React.FC<NavItemComponentProps> = ({
  item, isActive, hasAccess, collapsed, Icon
}) => {
  if (!hasAccess) {
    // Hiện menu bị khóa với lock icon
    return (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl',
          'text-[var(--text-muted)] opacity-50 cursor-not-allowed',
          collapsed && 'justify-center'
        )}
        title={`Cần nâng cấp để dùng tính năng này`}
      >
        <Icon size={18} className="flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="text-sm flex-1">{item.label}</span>
            <Lock size={12} />
          </>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
        'text-sm font-medium group',
        isActive
          ? 'bg-fgl-purple-600/20 text-white border border-fgl-purple-500/30'
          : 'text-[var(--text-muted)] hover:bg-white/[0.05] hover:text-[var(--text-secondary)]',
        collapsed && 'justify-center px-2.5'
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon
        size={18}
        className={cn(
          'flex-shrink-0 transition-colors',
          isActive ? 'text-fgl-purple-400' : 'group-hover:text-fgl-purple-400'
        )}
      />
      {!collapsed && (
        <span className="flex-1">{item.label}</span>
      )}
      {!collapsed && item.badge && (
        <span className="text-[10px] bg-fgl-purple-600 text-white px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
};
