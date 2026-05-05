
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

async function createTestAccount() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'tuyetvu21102006@gmail.com',
    password: 'Fgl@2026',
    email_confirm: true,
    user_metadata: {
      full_name: 'Tuyet Vu',
      spa_name: 'FGL Spa Demo',
      tier: 'vip_pro'
    }
  });

  if (error) {
    console.error('Lỗi tạo tài khoản:', error.message);
  } else {
    console.log('✅ Tạo tài khoản thành công!');
    console.log('User ID:', data.user.id);
  }
}

createTestAccount();
