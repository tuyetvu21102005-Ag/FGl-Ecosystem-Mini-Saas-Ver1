-- Migration 002: Remove 'free' tier from tenants
-- Cập nhật ràng buộc cho cột tier trong bảng tenants

ALTER TABLE tenants DROP CONSTRAINT IF EXISTS tenants_tier_check;

ALTER TABLE tenants ADD CONSTRAINT tenants_tier_check 
  CHECK (tier IN ('regular', 'vip', 'vip_pro'));

-- Nếu có bất kỳ tenant nào đang ở gói 'free', chuyển họ sang 'regular'
UPDATE tenants SET tier = 'regular' WHERE tier = 'free';
