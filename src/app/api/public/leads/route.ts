import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateLeadScore } from '@/lib/ai/scoring';

// Sử dụng Service Role Key để có quyền insert vào bảng leads mà không cần Auth
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramNotification(lead: { 
  id?: string; 
  name?: string; 
  phone?: string; 
  email?: string; 
  notes?: string; 
}) {
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

  const inline_keyboard = {
    inline_keyboard: [
      [
        { text: '✅ Xác nhận lịch', callback_data: `confirm_booking_${lead.id}` },
        { text: '📞 Gọi ngay', url: `tel:${lead.phone}` }
      ],
      [
        { text: '🌐 Xem trên Dashboard', url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/leads/${lead.id}` }
      ]
    ]
  };

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        reply_markup: inline_keyboard
      }),
    });
  } catch (error) {
    console.error('Lỗi gửi thông báo Telegram:', error);
  }
}

export async function POST(req: Request) {
  try {
    const { name, phone, email, tenant_id, notes, messages } = await req.json();

    if (!tenant_id) {
      return NextResponse.json({ error: 'Thiếu tenant_id' }, { status: 400 });
    }

    if (!phone && !email) {
      return NextResponse.json({ error: 'Cần số điện thoại hoặc email' }, { status: 400 });
    }

    // Lấy thông tin tenant để kiểm tra cài đặt webhook
    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('settings')
      .eq('id', tenant_id)
      .single();

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
        score: messages ? calculateLeadScore(messages) : 50,
      })
      .select()
      .single();

    if (error) {
      console.error('Lỗi lưu Lead:', error);
      return NextResponse.json({ error: 'Không thể lưu thông tin khách hàng' }, { status: 500 });
    }

    // Gửi thông báo Telegram
    await sendTelegramNotification(data);

    // Gửi thông báo Webhook (Google Sheets/CRM) nếu có cấu hình
    if (tenant?.settings?.webhook_url) {
      const { sendWebhookNotification } = await import('@/lib/integrations/webhook');
      await sendWebhookNotification(tenant.settings.webhook_url, data);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Public Leads Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
