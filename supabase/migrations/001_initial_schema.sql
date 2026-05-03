-- ============================================================
-- FGL Ecosystem — Supabase Initial Schema
-- Migration 001: Tenants, Profiles, Leads
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── TENANTS (mỗi spa = 1 tenant) ────────────────────────────
CREATE TABLE tenants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  tier        TEXT NOT NULL DEFAULT 'free'
              CHECK (tier IN ('free', 'regular', 'vip', 'vip_pro')),
  owner_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  logo_url    TEXT,
  phone       TEXT,
  address     TEXT,
  description TEXT,
  settings    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── PROFILES (mở rộng auth.users) ───────────────────────────
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'staff'
              CHECK (role IN ('owner', 'manager', 'staff')),
  full_name   TEXT NOT NULL DEFAULT '',
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── LEADS ───────────────────────────────────────────────────
CREATE TABLE leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name             TEXT,
  phone            TEXT,
  email            TEXT,
  source           TEXT DEFAULT 'manual'
                   CHECK (source IN ('quiz', 'chat', 'booking', 'manual', 'referral', 'social')),
  score            INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  status           TEXT DEFAULT 'new'
                   CHECK (status IN ('new', 'contacted', 'qualified', 'booked', 'closed', 'lost')),
  notes            TEXT,
  tags             TEXT[] DEFAULT '{}',
  last_contact_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── BOOKINGS ─────────────────────────────────────────────────
CREATE TABLE bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id          UUID REFERENCES leads(id) ON DELETE SET NULL,
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  service          TEXT NOT NULL,
  staff            TEXT,
  date             DATE NOT NULL,
  time             TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status           TEXT DEFAULT 'pending'
                   CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── FUNCTIONS & TRIGGERS ─────────────────────────────────────

-- Tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tenants_updated_at  BEFORE UPDATE ON tenants  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER leads_updated_at    BEFORE UPDATE ON leads    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Tự động tạo profile khi user đăng ký
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_tenant_id UUID;
  spa_name TEXT;
BEGIN
  spa_name := COALESCE(NEW.raw_user_meta_data->>'spa_name', 'Spa của tôi');

  -- Tạo tenant mới
  INSERT INTO tenants (name, slug, owner_id, tier)
  VALUES (
    spa_name,
    lower(regexp_replace(spa_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(NEW.id::text, 1, 6),
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'tier', 'free')
  )
  RETURNING id INTO new_tenant_id;

  -- Tạo profile
  INSERT INTO profiles (id, tenant_id, role, full_name, phone)
  VALUES (
    NEW.id,
    new_tenant_id,
    'owner',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── ROW LEVEL SECURITY ────────────────────────────────────────

ALTER TABLE tenants  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Tenants: chỉ đọc được tenant của mình
CREATE POLICY "tenants_select_own" ON tenants FOR SELECT
  USING (owner_id = auth.uid() OR id IN (
    SELECT tenant_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "tenants_update_own" ON tenants FOR UPDATE
  USING (owner_id = auth.uid());

-- Profiles: đọc/sửa profile cùng tenant
CREATE POLICY "profiles_select_same_tenant" ON profiles FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Leads: chỉ thao tác được leads của tenant mình
CREATE POLICY "leads_tenant_isolation" ON leads FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- Bookings: chỉ thao tác được bookings của tenant mình
CREATE POLICY "bookings_tenant_isolation" ON bookings FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid()));

-- ── INDEXES ───────────────────────────────────────────────────
CREATE INDEX idx_profiles_tenant   ON profiles(tenant_id);
CREATE INDEX idx_leads_tenant      ON leads(tenant_id);
CREATE INDEX idx_leads_status      ON leads(tenant_id, status);
CREATE INDEX idx_leads_created     ON leads(tenant_id, created_at DESC);
CREATE INDEX idx_bookings_tenant   ON bookings(tenant_id);
CREATE INDEX idx_bookings_date     ON bookings(tenant_id, date);
CREATE INDEX idx_bookings_status   ON bookings(tenant_id, status);
