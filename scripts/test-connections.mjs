
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

// Đọc file .env.local thủ công
const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    if (key && value) acc[key.trim()] = value.join('=').trim();
    return acc;
  }, {});

const {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
  DEEPSEEK_API_KEY
} = envConfig;

async function testSupabase() {
  console.log('--- Kiểm tra Supabase ---');
  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase.from('tenants').select('count', { count: 'exact' });
  
  if (error) {
    console.error('❌ Lỗi kết nối Supabase:', error.message);
  } else {
    console.log('✅ Kết nối Supabase thành công! Số lượng tenants hiện tại:', data);
  }
}

async function testTelegram() {
  console.log('\n--- Kiểm tra Telegram ---');
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const message = '🔔 *Thông báo kiểm thử hệ thống*\n\n✅ Kết nối Telegram thành công!\n🚀 Dự án FGL Ecosystem đã sẵn sàng.';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    const result = await response.json();
    if (result.ok) {
      console.log('✅ Đã gửi tin nhắn kiểm thử đến Telegram!');
    } else {
      console.error('❌ Lỗi gửi tin nhắn Telegram:', result.description);
    }
  } catch (err) {
    console.error('❌ Lỗi kết nối Telegram API:', err.message);
  }
}

async function testDeepSeek() {
  console.log('\n--- Kiểm tra DeepSeek AI ---');
  const url = 'https://api.deepseek.com/chat/completions';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Chào bạn, hãy phản hồi ngắn gọn "AI đã sẵn sàng" nếu bạn nhận được tin nhắn này.' }],
        max_tokens: 50
      })
    });
    
    const result = await response.json();
    if (result.choices && result.choices.length > 0) {
      console.log('✅ Phản hồi từ DeepSeek:', result.choices[0].message.content);
    } else {
      console.error('❌ Lỗi DeepSeek API:', result.error ? result.error.message : 'Không có phản hồi');
    }
  } catch (err) {
    console.error('❌ Lỗi kết nối DeepSeek API:', err.message);
  }
}

async function runAllTests() {
  await testSupabase();
  await testTelegram();
  await testDeepSeek();
  console.log('\n--- Hoàn tất kiểm thử ---');
}

runAllTests();
