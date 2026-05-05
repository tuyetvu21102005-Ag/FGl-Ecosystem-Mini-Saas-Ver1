/**
 * TypeScript types cho FGL Ecosystem
 * Phản ánh schema Supabase database
 */

// ── Enum Types ──────────────────────────────────────────────

/** Gói dịch vụ của spa */
export type TenantTier = 'regular' | 'vip' | 'vip_pro';

/** Vai trò người dùng trong spa */
export type UserRole = 'owner' | 'manager' | 'staff';

/** Trạng thái lead/khách hàng tiềm năng */
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'booked' | 'closed' | 'lost';

/** Nguồn lead */
export type LeadSource = 'quiz' | 'chat' | 'booking' | 'manual' | 'referral' | 'social';

/** Trạng thái booking */
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

// ── Database Types ───────────────────────────────────────────

/** Thông tin spa/tenant */
export interface Tenant {
  id: string;
  name: string;                    // Tên spa
  slug: string;                    // URL slug: zen-spa-hanoi
  tier: TenantTier;                // Gói dịch vụ
  owner_id: string;                // UUID của chủ spa
  logo_url?: string;               // Logo spa
  phone?: string;                  // SĐT spa
  address?: string;                // Địa chỉ spa
  description?: string;            // Mô tả spa
  settings: TenantSettings;        // Cài đặt riêng
  created_at: string;
  updated_at: string;
}

/** Cài đặt riêng của từng spa */
export interface TenantSettings {
  telegram_chat_id?: string;       // ID chat Telegram nhận thông báo
  google_sheet_id?: string;        // Google Sheet CRM
  working_hours?: WorkingHours;    // Giờ làm việc
  services?: string[];             // Danh sách dịch vụ
  ai_persona?: string;             // Tính cách AI chat
  brand_color?: string;            // Màu thương hiệu riêng
}

/** Giờ làm việc */
export interface WorkingHours {
  mon?: DayHours;
  tue?: DayHours;
  wed?: DayHours;
  thu?: DayHours;
  fri?: DayHours;
  sat?: DayHours;
  sun?: DayHours;
}

export interface DayHours {
  open: string;   // "08:00"
  close: string;  // "20:00"
  closed?: boolean;
}

/** Profile người dùng (mở rộng auth.users) */
export interface Profile {
  id: string;                      // = auth.users.id
  tenant_id: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

/** Thông tin đầy đủ của user (join profile + tenant) */
export interface UserWithProfile {
  id: string;
  email: string;
  profile: Profile;
  tenant: Tenant;
}

/** Lead / Khách hàng tiềm năng */
export interface Lead {
  id: string;
  tenant_id: string;
  name?: string;
  phone?: string;
  email?: string;
  source: LeadSource;
  score: number;                   // 0-100
  status: LeadStatus;
  notes?: string;
  tags?: string[];
  last_contact_at?: string;
  created_at: string;
  updated_at: string;
}

/** Booking / Lịch hẹn */
export interface Booking {
  id: string;
  tenant_id: string;
  lead_id?: string;
  customer_name: string;
  customer_phone: string;
  service: string;
  staff?: string;
  date: string;                    // YYYY-MM-DD
  time: string;                    // HH:MM
  duration_minutes: number;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ── UI / Component Types ─────────────────────────────────────

/** Props chung cho component có className */
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

/** Thống kê tổng quan dashboard */
export interface DashboardStats {
  total_leads: number;
  new_leads_today: number;
  bookings_pending: number;
  sessions_this_month: number;
  revenue_this_month: number;
  growth_leads: number;            // % so với tháng trước
  growth_bookings: number;
}

/** Data point cho biểu đồ */
export interface ChartDataPoint {
  date: string;                    // DD/MM
  leads: number;
  bookings: number;
}

/** Activity feed item */
export interface ActivityItem {
  id: string;
  type: 'lead_new' | 'booking_new' | 'booking_confirmed' | 'chat_session' | 'lead_qualified';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

/** Navigation item cho sidebar */
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  badge?: string | number;
  tier?: TenantTier[];             // Chỉ hiện với tier này trở lên
  children?: NavItem[];
}

/** Pricing tier info */
export interface PricingTier {
  id: TenantTier;
  name: string;
  price: number;                   // VNĐ/tháng
  description: string;
  features: string[];
  highlight?: boolean;             // Gói nổi bật
  cta: string;
}

// ── API Response Types ───────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
