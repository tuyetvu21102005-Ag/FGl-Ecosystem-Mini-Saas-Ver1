
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

async function debugAndFix() {
  const email = 'tuyetvu21102006@gmail.com';
  
  console.log(`--- Đang kiểm tra email: ${email} ---`);

  // 1. Kiểm tra xem user đã tồn tại trong Auth chưa
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    console.log('Phát hiện user cũ, đang tiến hành xóa để làm sạch...');
    await supabase.auth.admin.deleteUser(existingUser.id);
  }

  // 2. Tạo lại user mới hoàn toàn sạch sẽ
  console.log('Đang tạo lại tài khoản mới...');
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: 'Fgl@2026',
    email_confirm: true,
    user_metadata: {
      full_name: 'Tuyet Vu',
      spa_name: 'FGL Premium Spa',
      tier: 'vip_pro'
    }
  });

  if (error) {
    console.error('❌ Lỗi tạo lại:', error.message);
    console.log('Gợi ý: Hãy kiểm tra xem bạn đã chạy migration 001 và 002 chưa.');
  } else {
    console.log('✅ Tài khoản đã được tạo lại thành công!');
    console.log('ID:', data.user.id);
  }
}

debugAndFix();
