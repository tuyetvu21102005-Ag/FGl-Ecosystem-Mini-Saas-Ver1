
/**
 * AI Lead Scoring Logic
 * Đánh giá mức độ tiềm năng của khách hàng dựa trên nội dung hội thoại.
 */

export function calculateLeadScore(messages: { content: string }[]): number {
  let score = 30; // Điểm khởi điểm cơ bản

  const chatContent = messages.map(m => m.content).join(' ').toLowerCase();

  // 1. Kiểm tra sự hiện diện của SĐT (Tiềm năng cao)
  const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
  if (phoneRegex.test(chatContent)) score += 40;

  // 2. Kiểm tra độ dài hội thoại (Sự quan tâm)
  if (messages.length > 5) score += 10;
  if (messages.length > 10) score += 10;

  // 3. Từ khóa thể hiện sự quan tâm cao (Intent)
  const highIntentKeywords = ['giá bao nhiêu', 'đặt lịch', 'hẹn', 'tư vấn', 'địa chỉ', 'cơ sở', 'khuyến mãi', 'combo'];
  highIntentKeywords.forEach(word => {
    if (chatContent.includes(word)) score += 2;
  });

  // Giới hạn điểm tối đa 100
  return Math.min(score, 100);
}
