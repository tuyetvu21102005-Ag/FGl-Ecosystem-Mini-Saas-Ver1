'use client';

/**
 * Header — Top navigation bar cho dashboard
 * Breadcrumb, notifications, user menu
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, ChevronDown, LogOut, Settings, User,
  Search, Command,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { TierBadge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { UserWithProfile } from '@/types';

interface HeaderProps {
  user: UserWithProfile;
  title?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
}

// Mock notifications — sẽ kết nối Supabase realtime sau
const mockNotifications = [
  { id: '1', title: 'Lead mới từ Quiz', desc: 'Nguyễn Thị A quan tâm dịch vụ massage', time: new Date(Date.now() - 300000).toISOString(), read: false },
  { id: '2', title: 'Đặt lịch mới', desc: 'Trần Văn B đặt lịch ngày mai 10:00', time: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: '3', title: 'Chat session', desc: 'Khách hàng chờ phản hồi từ 5 phút trước', time: new Date(Date.now() - 600000).toISOString(), read: true },
];

export const Header: React.FC<HeaderProps> = ({ user, title, breadcrumb }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm flex-shrink-0">
      {/* Left: Breadcrumb / Title */}
      <div className="flex items-center gap-2 min-w-0">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumb.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-white/20 mx-1">/</span>}
                {item.href ? (
                  <Link href={item.href} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[var(--text-primary)] font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : (
          <h1 className="text-lg font-semibold text-white">{title ?? 'Dashboard'}</h1>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search hint */}
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[var(--text-muted)] text-sm hover:bg-white/[0.08] transition-colors">
          <Search size={14} />
          <span>Tìm kiếm</span>
          <span className="flex items-center gap-0.5 text-[10px] bg-white/10 px-1 py-0.5 rounded">
            <Command size={10} /> K
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-white/[0.08] hover:text-white transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-fgl-purple-500 ring-2 ring-[var(--bg-base)]" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-[#1a0f3e] border border-white/[0.08] shadow-glass overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Thông báo</span>
                  {unreadCount > 0 && (
                    <span className="text-xs text-fgl-purple-400">{unreadCount} chưa đọc</span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {mockNotifications.map(notif => (
                    <div
                      key={notif.id}
                      className={cn(
                        'px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer',
                        !notif.read && 'border-l-2 border-l-fgl-purple-500'
                      )}
                    >
                      <p className={cn('text-sm', notif.read ? 'text-[var(--text-muted)]' : 'text-white font-medium')}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{notif.desc}</p>
                      <p className="text-[10px] text-[var(--text-muted)]/60 mt-1">
                        {formatRelativeTime(notif.time)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 text-center">
                  <button className="text-xs text-fgl-purple-400 hover:text-fgl-purple-300">
                    Xem tất cả thông báo
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            id="user-menu-btn"
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/[0.08] transition-all"
          >
            <Avatar name={user.profile.full_name} src={user.profile.avatar_url} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white leading-tight">{user.profile.full_name}</p>
              <TierBadge tier={user.tenant.tier} className="scale-90 origin-left" />
            </div>
            <ChevronDown size={14} className={cn('text-[var(--text-muted)] transition-transform', showUserMenu && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#1a0f3e] border border-white/[0.08] shadow-glass overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-medium text-white">{user.profile.full_name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{user.tenant.name}</p>
                </div>
                <div className="py-1">
                  {[
                    { label: 'Hồ sơ', icon: User, href: '/dashboard/settings' },
                    { label: 'Cài đặt', icon: Settings, href: '/dashboard/settings' },
                  ].map(item => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:bg-white/[0.05] hover:text-white transition-colors"
                    >
                      <item.icon size={15} />
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-white/[0.06] py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={15} />
                    Đăng xuất
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside handler */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowNotifications(false); setShowUserMenu(false); }}
        />
      )}
    </header>
  );
};
