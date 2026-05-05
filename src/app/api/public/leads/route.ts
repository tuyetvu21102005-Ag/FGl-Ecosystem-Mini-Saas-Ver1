import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Sử dụng Service Role Key để có quyền insert vào bảng leads mà không cần Auth
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramNotification(lead: any) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const message = `
🔔 *CÓ LEAD MỚI TỪ AI CHAT*
────────────────────
👤 *Khách hàng:* ${lead.name || 'N/A'}
📞 *SĐT:* ${lead.phone || 'N/A'}
📧 *Email:* ${lead.email || 'N/A'}
💡 *Nguồn:* AI Chat Widget
📝 *Ghi chú:* ${lead.notes || 'Không có'}
────────────────────
🚀 *Hãy liên hệ ngay để chốt lịch!*
  `;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Lỗi gửi thông báo Telegram:', error);
  }
}

export async function POST(req: Request) {
  try {
    const { name, phone, email, tenant_id, notes } = await req.json();

    if (!tenant_id) {
      return NextResponse.json({ error: 'Thiếu tenant_id' }, { status: 400 });
    }

    if (!phone && !email) {
      return NextResponse.json({ error: 'Cần số điện thoại hoặc email' }, { status: 400 });
    }

    // Insert lead vào Supabase
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        tenant_id,
        name,
        phone,
        email,
        source: 'chat',
        notes: notes || 'Lead từ AI Chat Widget',
        status: 'new',
        score: 50, // Lead từ Chat thường có tiềm năng trung bình
      })
      .select()
      .single();

    if (error) {
      console.error('Lỗi lưu Lead:', error);
      return NextResponse.json({ error: 'Không thể lưu thông tin khách hàng' }, { status: 500 });
    }

    // Gửi thông báo Telegram
    await sendTelegramNotification(data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Public Leads Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
