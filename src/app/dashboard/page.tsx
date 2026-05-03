/**
 * Dashboard Home Page — Tổng quan
 * Overview cards, activity feed, biểu đồ leads 7 ngày
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Calendar, TrendingUp, MessageSquare,
  ArrowUpRight, ArrowDownRight, Plus, ChevronRight,
  Sparkles, Star, Crown, Zap,
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
// import { Skeleton } from '@/components/ui/LoadingSpinner';
import { formatRelativeTime, formatVND } from '@/lib/utils';

// ── Mock Data ────────────────────────────────────────────────

const chartData = [
  { date: '25/4', leads: 4, bookings: 2 },
  { date: '26/4', leads: 7, bookings: 3 },
  { date: '27/4', leads: 5, bookings: 4 },
  { date: '28/4', leads: 9, bookings: 5 },
  { date: '29/4', leads: 12, bookings: 6 },
  { date: '30/4', leads: 8, bookings: 7 },
  { date: '01/5', leads: 15, bookings: 8 },
];

const recentActivity = [
  { id: '1', type: 'lead_new', name: 'Nguyễn Thị Hương', action: 'Điền Quiz "Loại da của bạn"', time: new Date(Date.now() - 120000).toISOString(), avatar: null },
  { id: '2', type: 'booking_new', name: 'Trần Văn Minh', action: 'Đặt lịch Massage thư giãn — 10:00 ngày mai', time: new Date(Date.now() - 600000).toISOString(), avatar: null },
  { id: '3', type: 'chat_session', name: 'Lê Thị Lan', action: 'Bắt đầu chat widget — hỏi về dịch vụ facial', time: new Date(Date.now() - 1800000).toISOString(), avatar: null },
  { id: '4', type: 'lead_qualified', name: 'Phạm Quốc Tuấn', action: 'Chuyển trạng thái → Tiềm năng cao (score 85)', time: new Date(Date.now() - 3600000).toISOString(), avatar: null },
  { id: '5', type: 'booking_confirmed', name: 'Vũ Thị Mai', action: 'Xác nhận lịch hẹn 14:00 hôm nay', time: new Date(Date.now() - 7200000).toISOString(), avatar: null },
];

const pendingBookings = [
  { id: '1', name: 'Nguyễn Thị Hoa', service: 'Chăm sóc da mặt', time: '09:00', date: '02/05', phone: '0901234567' },
  { id: '2', name: 'Trần Minh Tú', service: 'Massage body toàn thân', time: '11:00', date: '02/05', phone: '0912345678' },
  { id: '3', name: 'Phạm Lan Anh', service: 'Tẩy tế bào chết', time: '14:30', date: '02/05', phone: '0923456789' },
];

const activityIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  lead_new:          { icon: <Users size={14} />,     color: 'bg-blue-500/20 text-blue-400' },
  booking_new:       { icon: <Calendar size={14} />,  color: 'bg-green-500/20 text-green-400' },
  chat_session:      { icon: <MessageSquare size={14} />, color: 'bg-purple-500/20 text-purple-400' },
  lead_qualified:    { icon: <Star size={14} />,      color: 'bg-yellow-500/20 text-yellow-400' },
  booking_confirmed: { icon: <Zap size={14} />,       color: 'bg-emerald-500/20 text-emerald-400' },
};

// ── Metric Card ──────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card variant="metric" className="relative overflow-hidden">
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl ${color}`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(change)}%
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-[var(--text-muted)]">{title}</p>
      </div>
    </Card>
  </motion.div>
);

// ── Custom Chart Tooltip ─────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; [key: string]: unknown }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a0f3e] border border-white/10 rounded-xl px-3 py-2 shadow-glass text-xs">
        <p className="text-[var(--text-muted)] mb-1">{label}</p>
        <p className="text-blue-400">Lead mới: <strong>{payload[0]?.value}</strong></p>
        <p className="text-green-400">Đặt lịch: <strong>{payload[1]?.value}</strong></p>
      </div>
    );
  }
  return null;
};

// ── Main Dashboard Page ──────────────────────────────────────

export default function DashboardPage() {
  return (
    <DashboardLayout title="Tổng quan" breadcrumb={[{ label: 'Tổng quan' }]}>
      <div className="space-y-8">

        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-white">
              Chào buổi sáng, <span className="text-gradient">Hoa</span> 👋
            </h2>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Hôm nay bạn có 3 lịch hẹn và 5 lead mới đang chờ. Hãy bắt đầu nào!
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" leftIcon={<Plus size={14} />}>
              Thêm lead
            </Button>
            <Button size="sm" leftIcon={<Calendar size={14} />}>
              Tạo lịch hẹn
            </Button>
          </div>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Tổng leads tháng này"
            value="47"
            change={23}
            icon={<Users size={18} className="text-blue-400" />}
            color="bg-blue-500"
            delay={0}
          />
          <MetricCard
            title="Đặt lịch chờ xác nhận"
            value="8"
            change={-5}
            icon={<Calendar size={18} className="text-green-400" />}
            color="bg-green-500"
            delay={0.05}
          />
          <MetricCard
            title="Chat sessions hôm nay"
            value="23"
            change={45}
            icon={<MessageSquare size={18} className="text-purple-400" />}
            color="bg-purple-500"
            delay={0.1}
          />
          <MetricCard
            title="Doanh thu ước tính"
            value={formatVND(12400000)}
            change={18}
            icon={<TrendingUp size={18} className="text-fgl-gold-400" />}
            color="bg-fgl-gold-500"
            delay={0.15}
          />
        </div>

        {/* Charts + Activity */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Leads & Booking — 7 ngày qua</CardTitle>
                  <span className="text-xs text-[var(--text-muted)] bg-white/[0.05] px-2 py-1 rounded-lg">
                    25/4 — 01/5
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#7c6fa0', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#7c6fa0', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="leads"    stroke="#7c3aed" fill="url(#colorLeads)"    strokeWidth={2} dot={{ fill: '#7c3aed', r: 4 }} />
                    <Area type="monotone" dataKey="bookings" stroke="#10b981" fill="url(#colorBookings)" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <span className="w-3 h-0.5 bg-fgl-purple-500 rounded" /> Lead mới
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <span className="w-3 h-0.5 bg-green-500 rounded" /> Đặt lịch
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Hoạt động gần đây</CardTitle>
                  <button className="text-xs text-fgl-purple-400 hover:text-fgl-purple-300 flex items-center gap-1">
                    Xem tất cả <ChevronRight size={12} />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((item) => {
                    const config = activityIcons[item.type] ?? { icon: <Zap size={14} />, color: 'bg-gray-500/20 text-gray-400' };
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${config.color}`}>
                          {config.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{item.name}</p>
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.action}</p>
                          <p className="text-[10px] text-[var(--text-muted)]/60 mt-0.5">{formatRelativeTime(item.time)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Pending Bookings + Upgrade CTA */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Pending Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Lịch hẹn chờ xác nhận</CardTitle>
                  <Button variant="outline" size="sm">Xem tất cả</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-fgl-purple-500/20 transition-all group"
                    >
                      <Avatar name={booking.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{booking.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{booking.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{booking.time}</p>
                        <p className="text-xs text-[var(--text-muted)]">{booking.date}</p>
                      </div>
                      <StatusBadge status="pending" />
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-xs text-green-400 hover:text-green-300 font-medium">✓ OK</button>
                        <button className="text-xs text-red-400 hover:text-red-300 font-medium">✕ Hủy</button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions + Upgrade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-4"
          >
            {/* Quick Actions */}
            <Card>
              <CardHeader><CardTitle>Thao tác nhanh</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { label: 'Viết caption Facebook', icon: <Sparkles size={14} />, href: '/dashboard/content' },
                    { label: 'Xem leads mới hôm nay', icon: <Users size={14} />, href: '/dashboard/leads' },
                    { label: 'Kế hoạch marketing', icon: <TrendingUp size={14} />, href: '/dashboard/marketing' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-transparent hover:border-fgl-purple-500/20 transition-all text-left group"
                    >
                      <span className="text-fgl-purple-400">{action.icon}</span>
                      <span className="text-sm text-[var(--text-muted)] group-hover:text-white transition-colors">
                        {action.label}
                      </span>
                      <ChevronRight size={12} className="ml-auto text-[var(--text-muted)] group-hover:text-fgl-purple-400" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upgrade CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-fgl-purple-600/20 via-fgl-purple-800/10 to-fgl-gold-500/10 border border-fgl-purple-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-fgl-gold-500/10 rounded-full blur-2xl" />
              <Crown size={20} className="text-fgl-gold-400 mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">Nâng cấp VIP Pro</h4>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                Mở khóa Dashboard VIP, 8 tools AI, và Coaching 1-1
              </p>
              <Button variant="gold" size="sm" fullWidth>
                Xem gói 999K/tháng
              </Button>
            </div>
          </motion.div>
        </div>

      </div>
    </DashboardLayout>
  );
}
