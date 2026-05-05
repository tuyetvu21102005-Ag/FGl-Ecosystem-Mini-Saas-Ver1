
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

async function checkLeads() {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5);
  if (error) {
    console.error('Lỗi:', error.message);
  } else {
    console.log('--- DANH SÁCH LEADS MỚI NHẤT ---');
    console.log(JSON.stringify(data, null, 2));
  }
}

checkLeads();
