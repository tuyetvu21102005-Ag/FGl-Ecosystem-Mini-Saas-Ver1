import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Feel Great Life — Nền tảng AI Marketing cho Spa & SME Việt Nam',
    template: '%s | Feel Great Life',
  },
  description:
    'FGL giúp spa và doanh nghiệp làm đẹp Việt Nam tự động hóa marketing, quản lý khách hàng, và tăng doanh thu với AI. Thử miễn phí ngay hôm nay.',
  keywords: ['spa', 'marketing ai', 'quản lý spa', 'crm spa', 'feel great life', 'fgl'],
  authors: [{ name: 'Feel Great Life Team' }],
  openGraph: {
    title: 'Feel Great Life — AI Marketing cho Spa Việt Nam',
    description: 'Tự động hóa marketing & quản lý spa với AI. Tăng lead, booking, doanh thu.',
    type: 'website',
    locale: 'vi_VN',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

import ChatWidget from '@/components/chat/ChatWidget';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {/* AI Chat Widget - Hiển thị trên toàn bộ trang web */}
        <ChatWidget 
          tenantId="00000000-0000-0000-0000-000000000000" // ID mặc định của Platform
          spaName="Feel Great Life"
        />
      </body>
    </html>
  );
}
