
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

async function testInsert() {
  const testId = '00000000-0000-0000-0000-000000000001';
  console.log('Đang thử insert trực tiếp vào bảng tenants...');
  
  const { data, error } = await supabase.from('tenants').insert({
    name: 'Test Spa',
    slug: 'test-spa-' + Date.now(),
    owner_id: 'd6de391d-810d-4898-989d-c08e8945ddcb', // Một ID bất kỳ
    tier: 'vip_pro'
  });

  if (error) {
    console.error('❌ Lỗi Insert:', error.message);
    if (error.message.includes('invalid input value for enum tenant_tier')) {
        console.log('XÁC NHẬN: Lỗi do kiểu enum tenant_tier không khớp.');
    }
  } else {
    console.log('✅ Insert thành công! Bảng tenants vẫn hoạt động tốt.');
  }
}

testInsert();
