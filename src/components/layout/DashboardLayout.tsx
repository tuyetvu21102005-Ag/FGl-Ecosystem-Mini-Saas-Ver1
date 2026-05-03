/**
 * DashboardLayout — Layout wrapper cho tất cả pages trong /dashboard
 * Lấy user session từ Supabase và pass xuống Sidebar + Header
 */

import React from 'react';
// import { redirect } from 'next/navigation';
// import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { UserWithProfile } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
}

// Mock user data — sẽ thay bằng Supabase query thực sau khi cấu hình
const getMockUser = (): UserWithProfile => ({
  id: 'mock-user-id',
  email: 'demo@feelgreatlife.vn',
  profile: {
    id: 'mock-profile-id',
    tenant_id: 'mock-tenant-id',
    role: 'owner',
    full_name: 'Nguyễn Thị Hoa',
    phone: '0901234567',
    avatar_url: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  tenant: {
    id: 'mock-tenant-id',
    name: 'Zen Spa Hà Nội',
    slug: 'zen-spa-hanoi',
    tier: 'vip',
    owner_id: 'mock-user-id',
    settings: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
});

export default async function DashboardLayout({ children, title, breadcrumb }: DashboardLayoutProps) {
  // TODO: Thay mock bằng Supabase query sau khi cấu hình credentials
  // const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) redirect('/login');
  // ... fetch profile & tenant

  const user = getMockUser();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header user={user} title={title} breadcrumb={breadcrumb} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
