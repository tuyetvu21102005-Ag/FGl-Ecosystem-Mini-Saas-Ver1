
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    if (key && value) acc[key.trim()] = value.join('=').trim();
    return acc;
  }, {});

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function runMigration() {
  const sql = `
    ALTER TABLE tenants DROP CONSTRAINT IF EXISTS tenants_tier_check;
    ALTER TABLE tenants ADD CONSTRAINT tenants_tier_check 
      CHECK (tier IN ('free', 'regular', 'vip', 'vip_pro'));
  `;
  
  // Lưu ý: supabase-js không hỗ trợ chạy SQL trực tiếp trừ khi có RPC.
  // Nếu không chạy được, tôi sẽ yêu cầu người dùng chạy tay.
  console.log('Vui lòng chạy nội dung file supabase/migrations/002_remove_free_tier.sql trong SQL Editor của Supabase.');
}

runMigration();
