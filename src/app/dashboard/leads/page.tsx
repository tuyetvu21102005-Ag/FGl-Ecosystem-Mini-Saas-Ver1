'use client';

/**
 * Leads Page — Danh sách khách hàng tiềm năng
 * Skeleton cho Phase 0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, Plus, 
  MoreHorizontal, Phone, Mail, Sparkles
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { cn, formatRelativeTime } from '@/lib/utils';

const mockLeads = [
  { id: '1', name: 'Nguyễn Thị Hương', phone: '0901234567', email: 'huong@gmail.com', source: 'quiz', score: 85, status: 'qualified', time: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', name: 'Trần Văn Minh', phone: '0912345678', email: 'minh.tran@yahoo.com', source: 'chat', score: 45, status: 'new', time: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', name: 'Lê Thị Lan', phone: '0987654321', email: 'lanle@hotmail.com', source: 'booking', score: 95, status: 'booked', time: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', name: 'Phạm Quốc Tuấn', phone: '0933445566', email: 'tuan.pq@gmail.com', source: 'manual', score: 20, status: 'contacted', time: new Date(Date.now() - 172800000).toISOString() },
  { id: '5', name: 'Vũ Thị Mai', phone: '0944556677', email: 'maivu@gmail.com', source: 'chat', score: 65, status: 'qualified', time: new Date(Date.now() - 259200000).toISOString() },
];

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <DashboardLayout 
      title="Khách hàng" 
      breadcrumb={[{ label: 'Tổng quan', href: '/dashboard' }, { label: 'Khách hàng' }]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Danh sách Leads</h2>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>Xuất Excel</Button>
            <Button size="sm" leftIcon={<Plus size={14} />}>Thêm khách hàng</Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4" padding="none">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Tìm theo tên, SĐT, email..." 
                leftIcon={<Search size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Bộ lọc</Button>
              <select className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-fgl-purple-500">
                <option value="">Tất cả trạng thái</option>
                <option value="new">Mới</option>
                <option value="qualified">Tiềm năng</option>
                <option value="booked">Đã đặt lịch</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Leads Table */}
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Liên hệ</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Nguồn</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Điểm tiềm năng</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {mockLeads.map((lead, i) => (
                  <motion.tr 
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar name={lead.name} size="sm" />
                        <span className="text-sm font-medium text-white">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                          <Phone size={12} /> {lead.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                          <Mail size={12} /> {lead.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {lead.source === 'quiz' && <Sparkles size={14} className="text-fgl-purple-400" />}
                        <span className="text-xs text-[var(--text-secondary)] capitalize">{lead.source}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-white/[0.05] rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              lead.score >= 80 ? "bg-green-500" : lead.score >= 50 ? "bg-yellow-500" : "bg-blue-500"
                            )}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-white">{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[var(--text-muted)]">
                      {formatRelativeTime(lead.time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-2 rounded-lg hover:bg-white/[0.05] text-[var(--text-muted)] hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
            <span className="text-xs text-[var(--text-muted)]">Hiển thị 5 trên 47 khách hàng</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Trước</Button>
              <Button variant="outline" size="sm">Tiếp</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
