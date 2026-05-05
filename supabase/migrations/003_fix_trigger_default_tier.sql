-- Migration 003: Fix trigger default tier
-- Cập nhật trigger handle_new_user để mặc định là 'regular' thay vì 'free'

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_tenant_id UUID;
  spa_name TEXT;
  default_tier public.tenant_tier;
BEGIN
  spa_name := COALESCE(NEW.raw_user_meta_data->>'spa_name', 'Spa của tôi');
  -- Sử dụng 'regular' làm mặc định nếu không có tier trong metadata
  default_tier := COALESCE((NEW.raw_user_meta_data->>'tier')::public.tenant_tier, 'regular');

  -- Tạo tenant mới
  INSERT INTO tenants (name, slug, owner_id, tier)
  VALUES (
    spa_name,
    lower(regexp_replace(spa_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(NEW.id::text, 1, 6),
    NEW.id,
    default_tier
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
