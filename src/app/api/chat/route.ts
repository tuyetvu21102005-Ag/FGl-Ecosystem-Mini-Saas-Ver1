import { NextResponse } from 'next/server';

export const runtime = 'edge';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT_CHAT = `
Bạn là một chuyên gia tư vấn sắc đẹp và quản lý Spa chuyên nghiệp của hệ thống "Feel Great Life" tại Việt Nam.
Nhiệm vụ của bạn là:
1. Chào hỏi khách hàng thân thiện, lịch sự.
2. Tư vấn các dịch vụ phổ biến của Spa (Chăm sóc da mặt, Massage, Triệt lông, Giảm béo...).
3. Luôn khéo léo yêu cầu khách hàng để lại Tên và Số điện thoại để nhân viên có thể liên hệ tư vấn chi tiết hoặc đặt lịch.
4. Nếu khách hàng hỏi về giá, hãy đưa ra khoảng giá chung và nói rằng sẽ có ưu đãi tốt hơn khi tư vấn trực tiếp qua điện thoại.
5. Ngôn ngữ: Tiếng Việt, sử dụng các từ ngữ nhẹ nhàng, tinh tế, phù hợp với phái đẹp. Thỉnh thoảng sử dụng icon để tăng tính thân thiện.

Lưu ý quan trọng: Khi khách hàng cung cấp số điện thoại, hãy xác nhận lại và nói rằng "Cảm ơn bạn, chuyên viên của chúng tôi sẽ gọi cho bạn ngay!".
`;

const SYSTEM_PROMPT_CONTENT = `
Bạn là một chuyên gia Content Marketing kỳ cựu trong ngành Spa và làm đẹp tại Việt Nam. 
Nhiệm vụ của bạn là viết các nội dung quảng cáo Facebook, bài viết Blog hoặc kế hoạch Marketing hấp dẫn, có tỉ lệ chuyển đổi cao.
Yêu cầu:
- Ngôn ngữ: Tiếng Việt hiện đại, bắt trend, đánh đúng tâm lý khách hàng (muốn đẹp, muốn thư giãn, muốn ưu đãi).
- Cấu trúc: Tiêu đề thu hút, Nội dung chi tiết, Lợi ích khách hàng, CTA (Kêu gọi hành động) mạnh mẽ.
- Hình thức: Sử dụng Emoji linh hoạt, Hashtag phù hợp (#spa #beauty #fgl).
- Phong cách: Tùy biến theo yêu cầu của người dùng.
`;

export async function POST(req: Request) {
  try {
    const { messages, isContentTool } = await req.json();

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'DeepSeek API Key is not configured' }, { status: 500 });
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: isContentTool ? SYSTEM_PROMPT_CONTENT : SYSTEM_PROMPT_CHAT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('DeepSeek API Error:', data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({
      content: data.choices[0].message.content,
      message: data.choices[0].message.content, // Giữ lại message cho tương thích ngược
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
