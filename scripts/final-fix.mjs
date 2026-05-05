
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

async function finalAttempt() {
  const email = 'tuyetvu21102006@gmail.com';
  
  // Xóa user cũ nếu có
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const oldUser = users.find(u => u.email === email);
  if (oldUser) await supabase.auth.admin.deleteUser(oldUser.id);

  console.log('Đang tạo user không có metadata...');
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: 'Fgl@2026',
    email_confirm: true
  });

  if (error) {
    console.error('❌ Lỗi:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Tạo user thành công (không metadata)!');
    console.log('User ID:', data.user.id);
    
    // Thử cập nhật metadata sau khi tạo
    console.log('Đang cập nhật metadata...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(data.user.id, {
      user_metadata: {
        full_name: 'Tuyet Vu',
        spa_name: 'FGL Premium',
        tier: 'vip_pro'
      }
    });
    
    if (updateError) console.error('❌ Lỗi cập nhật:', updateError.message);
    else console.log('✅ Cập nhật metadata thành công!');
  }
}

finalAttempt();
