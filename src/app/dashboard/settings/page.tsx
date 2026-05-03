'use client';

/**
 * Settings Page — Cài đặt spa và tài khoản
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Bell, Shield, Save, Phone, MapPin } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'spa',      label: 'Thông tin spa',   icon: Building2 },
  { id: 'account',  label: 'Tài khoản',       icon: User },
  { id: 'notify',   label: 'Thông báo',       icon: Bell },
  { id: 'security', label: 'Bảo mật',         icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('spa');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
  };

  return (
    <DashboardLayout
      breadcrumb={[{ label: 'Tổng quan', href: '/dashboard' }, { label: 'Cài đặt' }]}
    >
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Cài đặt</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Quản lý thông tin spa và tài khoản của bạn</p>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-8 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-fgl-purple-600 text-white shadow-fgl-sm'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.05]'
                )}
              >
                <Icon size={15} />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab: Thông tin spa */}
        {activeTab === 'spa' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Thông tin này hiển thị với khách hàng của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Tên spa / doanh nghiệp" defaultValue="Zen Spa Hà Nội" leftIcon={<Building2 size={16}/>} />
                <Input label="Số điện thoại" defaultValue="0901 234 567" type="tel" leftIcon={<Phone size={16}/>} />
                <Input label="Địa chỉ" defaultValue="123 Đường Cầu Giấy, Hà Nội" leftIcon={<MapPin size={16}/>} />
                <Textarea label="Mô tả spa" defaultValue="Zen Spa — không gian thư giãn đẳng cấp tại Hà Nội, chuyên các liệu trình chăm sóc da mặt và massage trị liệu." hint="Tối đa 300 ký tự. AI sẽ dùng mô tả này để tư vấn khách hàng." />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dịch vụ của spa</CardTitle>
                <CardDescription>AI Chat Widget sẽ dùng danh sách này để tư vấn</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  label="Danh sách dịch vụ"
                  defaultValue={"Massage thư giãn toàn thân\nChăm sóc da mặt cơ bản\nTrị mụn chuyên sâu\nTẩy tế bào chết\nWaxing body"}
                  hint="Mỗi dịch vụ một dòng"
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} loading={saving} leftIcon={<Save size={15}/>}>
                Lưu thay đổi
              </Button>
            </div>
          </motion.div>
        )}

        {/* Tab: Tài khoản */}
        {activeTab === 'account' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hồ sơ cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fgl-purple-600 to-fgl-purple-800 flex items-center justify-center text-2xl font-bold text-white">H</div>
                  <div>
                    <p className="text-sm font-medium text-white">Ảnh đại diện</p>
                    <p className="text-xs text-[var(--text-muted)] mb-2">JPG, PNG tối đa 2MB</p>
                    <Button variant="outline" size="sm">Tải ảnh lên</Button>
                  </div>
                </div>
                <Input label="Họ và tên" defaultValue="Nguyễn Thị Hoa" leftIcon={<User size={16}/>} />
                <Input label="Email" defaultValue="hoa@zenspa.vn" type="email" disabled hint="Email không thể thay đổi" />
                <Input label="Số điện thoại" defaultValue="0901 234 567" type="tel" leftIcon={<Phone size={16}/>} />
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={handleSave} loading={saving} leftIcon={<Save size={15}/>}>Lưu thay đổi</Button>
            </div>
          </motion.div>
        )}

        {/* Tab: Thông báo */}
        {activeTab === 'notify' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Telegram Notifications</CardTitle>
                <CardDescription>Nhận thông báo tức thì khi có lead mới, booking, chat session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Telegram Bot Token" placeholder="110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw" hint="Tạo bot tại @BotFather trên Telegram" />
                <Input label="Chat ID" placeholder="-1001234567890" hint="Dùng @userinfobot để lấy chat ID của bạn" />
                <div className="space-y-3">
                  {[
                    { label: 'Lead mới từ Quiz hoặc Chat',   defaultChecked: true },
                    { label: 'Đặt lịch mới',                  defaultChecked: true },
                    { label: 'Lịch hẹn cần xác nhận',        defaultChecked: true },
                    { label: 'Khách hàng hủy lịch',           defaultChecked: false },
                    { label: 'Báo cáo tổng kết hàng ngày',    defaultChecked: true },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:border-fgl-purple-500/20 transition-all">
                      <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                      <input type="checkbox" defaultChecked={item.defaultChecked} className="w-4 h-4 accent-fgl-purple-500" />
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-3">
              <Button variant="outline">Test gửi thông báo</Button>
              <Button onClick={handleSave} loading={saving} leftIcon={<Save size={15}/>}>Lưu cài đặt</Button>
            </div>
          </motion.div>
        )}

        {/* Tab: Bảo mật */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Mật khẩu hiện tại" type="password" placeholder="••••••••" />
                <Input label="Mật khẩu mới" type="password" placeholder="••••••••" hint="Ít nhất 8 ký tự" />
                <Input label="Xác nhận mật khẩu mới" type="password" placeholder="••••••••" />
                <Button onClick={handleSave} loading={saving}>Cập nhật mật khẩu</Button>
              </CardContent>
            </Card>
            <Card variant="bordered">
              <CardHeader>
                <CardTitle className="text-red-400">Vùng nguy hiểm</CardTitle>
                <CardDescription>Các thao tác không thể hoàn tác</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div>
                    <p className="text-sm font-medium text-white">Xóa tài khoản</p>
                    <p className="text-xs text-[var(--text-muted)]">Xóa vĩnh viễn toàn bộ dữ liệu spa của bạn</p>
                  </div>
                  <Button variant="danger" size="sm">Xóa tài khoản</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
