'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Calendar, 
  Download, ArrowUpRight, 
  ArrowDownRight, Target, Percent, Sparkles
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatVND } from '@/lib/utils';

// ── Mock Data for Analytics ──────────────────────────────────

const weeklyData = [
  { name: 'Thứ 2', leads: 12, bookings: 5, revenue: 2500000 },
  { name: 'Thứ 3', leads: 18, bookings: 8, revenue: 4200000 },
  { name: 'Thứ 4', leads: 15, bookings: 7, revenue: 3800000 },
  { name: 'Thứ 5', leads: 25, bookings: 12, revenue: 6500000 },
  { name: 'Thứ 6', leads: 32, bookings: 15, revenue: 8200000 },
  { name: 'Thứ 7', leads: 45, bookings: 22, revenue: 12500000 },
  { name: 'Chủ Nhật', leads: 38, bookings: 20, revenue: 10800000 },
];

const sourceData = [
  { name: 'AI Chat Widget', value: 45, color: '#7c3aed' },
  { name: 'Booking Trực tiếp', value: 30, color: '#10b981' },
  { name: 'Facebook/Social', value: 15, color: '#3b82f6' },
  { name: 'Khác', value: 10, color: '#f59e0b' },
];

// ── Components ───────────────────────────────────────────────

const StatCard = ({ title, value, change, icon, delay = 0 }: { title: string; value: string; change: number; icon: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card variant="metric">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-fgl-purple-400">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <div className={`flex items-center gap-0.5 text-xs font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(change)}%
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function AnalyticsPage() {
  const [mounted, setMounted] = React.useState(false);
  const [timeRange, setTimeRange] = useState('weekly');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DashboardLayout title="Báo cáo chuyên sâu" breadcrumb={[{ label: 'Báo cáo', href: '/dashboard/analytics' }]}>
      <div className="space-y-8 pb-12">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Thống kê hiệu quả</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Theo dõi các chỉ số quan trọng của Spa theo thời gian thực</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setTimeRange('weekly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${timeRange === 'weekly' ? 'bg-fgl-purple-600 text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-white'}`}
              >
                Tuần này
              </button>
              <button 
                onClick={() => setTimeRange('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${timeRange === 'monthly' ? 'bg-fgl-purple-600 text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-white'}`}
              >
                Tháng này
              </button>
            </div>
            <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>Xuất báo cáo</Button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Tổng số Lead" value="580" change={28} icon={<Users size={18} />} delay={0} />
          <StatCard title="Lịch hẹn mới" value="240" change={15} icon={<Calendar size={18} />} delay={0.1} />
          <StatCard title="Tỉ lệ chuyển đổi" value="41.3%" change={5} icon={<Percent size={18} />} delay={0.2} />
          <StatCard title="Doanh thu ước tính" value={formatVND(112000000)} change={12} icon={<TrendingUp size={18} />} delay={0.3} />
        </div>

        {/* Main Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Revenue & Growth Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={18} className="text-fgl-purple-400" />
                Tăng trưởng doanh thu & khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-white/5 animate-pulse rounded-2xl" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lead Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Nguồn khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-white/5 border-t-fgl-purple-500 animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-3 mt-4">
                {sourceData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-[var(--text-muted)]">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Comparison Table-like Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Performance Metrics */}
          <Card>
            <CardHeader><CardTitle>Chỉ số vận hành</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { label: 'Tỉ lệ phản hồi AI', value: '98%', progress: 98, color: 'bg-purple-500' },
                  { label: 'Tỉ lệ khách hàng quay lại', value: '35%', progress: 35, color: 'bg-blue-500' },
                  { label: 'Tỉ lệ xác nhận lịch hẹn', value: '82%', progress: 82, color: 'bg-green-500' },
                  { label: 'Tỉ lệ hoàn thành liệu trình', value: '75%', progress: 75, color: 'bg-gold-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-muted)]">{item.label}</span>
                      <span className="text-white font-bold">{item.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${item.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Marketing ROI */}
          <Card className="bg-gradient-to-br from-fgl-purple-600/10 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={18} className="text-fgl-gold-400" />
                Hiệu quả Marketing AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Chi phí mỗi Lead (CPL)</p>
                  <p className="text-lg font-bold text-white">{formatVND(12500)}</p>
                  <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                    <ArrowDownRight size={10} /> Giảm 15% so với tháng trước
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Lợi nhuận trên vốn (ROI)</p>
                  <p className="text-lg font-bold text-white">4.5x</p>
                  <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                    <ArrowUpRight size={10} /> Tăng 0.8x
                  </p>
                </div>
                <div className="col-span-2 p-4 rounded-2xl bg-fgl-purple-600/10 border border-fgl-purple-500/20">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles size={14} className="text-fgl-gold-400" />
                    AI Insights
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    AI Chat Widget của bạn đang hoạt động hiệu quả nhất vào khung giờ 19:00 - 21:00. 
                    Bạn nên tập trung chạy quảng cáo vào khung giờ này để tối ưu hóa ngân sách.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}
