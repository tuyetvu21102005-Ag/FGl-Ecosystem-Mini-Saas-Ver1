'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Sparkles, MessageSquare, Calendar, Users, BarChart3, CheckCircle2, ArrowRight, Star, Crown, Zap, Shield, TrendingUp, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return <motion.div ref={ref} initial="initial" animate={inView ? 'animate' : 'initial'} variants={fadeUp} transition={{ duration: 0.5, delay }} className={className}>{children}</motion.div>;
};

const features = [
  { icon: <MessageSquare size={22} className="text-blue-400" />, title: 'AI Chat Widget', desc: 'Chatbot thông minh tự động tư vấn 24/7, chấm điểm lead và gửi Telegram ngay khi có khách tiềm năng.', color: 'border-blue-500/20 bg-blue-500/5' },
  { icon: <Sparkles size={22} className="text-fgl-purple-400" />, title: 'Quiz Lead Magnet', desc: 'Bài quiz cá nhân hóa thu hút và phân loại khách hàng, tự động đẩy vào phễu marketing.', color: 'border-fgl-purple-500/20 bg-fgl-purple-500/5' },
  { icon: <Calendar size={22} className="text-green-400" />, title: 'Booking Manager', desc: 'Đặt lịch online, xác nhận tự động, nhắc nhở qua Zalo/SMS và quản lý lịch nhân viên.', color: 'border-green-500/20 bg-green-500/5' },
  { icon: <Users size={22} className="text-yellow-400" />, title: 'CRM Chuyên biệt', desc: 'Toàn bộ hành trình khách hàng: lead → booking → chăm sóc, đồng bộ Google Sheets.', color: 'border-yellow-500/20 bg-yellow-500/5' },
  { icon: <TrendingUp size={22} className="text-pink-400" />, title: 'Marketing Co-Pilot', desc: 'AI lên kế hoạch marketing 30-90 ngày, viết caption Facebook/Zalo/TikTok tự động.', color: 'border-pink-500/20 bg-pink-500/5' },
  { icon: <BarChart3 size={22} className="text-fgl-gold-400" />, title: 'Dashboard VIP', desc: 'Báo cáo real-time: doanh thu, tỷ lệ chuyển đổi, hiệu quả kênh — tất cả trên 1 màn hình.', color: 'border-fgl-gold-500/20 bg-fgl-gold-500/5' },
];

const tiers = [
  { id: 'free',    name: 'Miễn phí', price: 0,   features: ['Quiz Tool', 'Chat 5 sessions/tháng', 'Dashboard cơ bản'],                  cta: 'Bắt đầu miễn phí', highlight: false, badgeClass: 'text-gray-400 border-gray-500/30' },
  { id: 'regular', name: 'Regular',  price: 199,  features: ['Booking Module', 'CRM cơ bản', '2 Content Tools', 'Chat không giới hạn'],   cta: 'Dùng thử 14 ngày', highlight: false, badgeClass: 'text-blue-400 border-blue-500/40' },
  { id: 'vip',     name: '⭐ VIP',   price: 499,  features: ['Full 3 modules', 'Top 3 AI Tools', 'Marketing Co-Pilot', 'Coaching nhóm'],  cta: 'Chọn VIP',         highlight: true,  badgeClass: 'text-fgl-purple-300 border-fgl-purple-500/60' },
  { id: 'vip_pro', name: '👑 VIP Pro', price: 999, features: ['Full 8 AI Tools', 'Dashboard VIP', 'Automation', 'Coaching 1-1'],          cta: 'Liên hệ ngay',     highlight: false, badgeClass: 'text-fgl-gold-400 border-fgl-gold-500/50' },
];

const testimonials = [
  { name: 'Nguyễn Thị Hương', role: 'Chủ Beauty Spa Đà Nẵng', avatar: 'H', content: 'FGL tăng gấp đôi lịch hẹn của tôi chỉ trong 1 tháng. AI chat tự động tư vấn 24/7 không cần trực điện thoại!', stars: 5 },
  { name: 'Trần Minh Quân',   role: 'GĐ Zen Spa Chain',       avatar: 'Q', content: 'Quiz và CRM giúp thu 200+ lead/tháng từ Facebook. Hiệu quả hơn hẳn khi tự chạy ads bình thường.', stars: 5 },
  { name: 'Lê Phương Anh',    role: 'Lotus Salon TP.HCM',     avatar: 'A', content: 'AI viết caption Facebook cho tôi mỗi ngày. Khách bảo page tôi "pro" hơn hẳn rồi. Quá tiết kiệm thời gian!', stars: 5 },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[rgba(15,10,30,0.85)] backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fgl-purple-600 to-fgl-purple-800 flex items-center justify-center"><span className="text-sm font-bold text-white">F</span></div>
            <span className="font-bold text-white text-sm">Feel Great Life</span>
          </Link>
          <div className="hidden md:flex items-center gap-5 text-sm text-[var(--text-muted)]">
            {['Tính năng', 'Bảng giá'].map(item => <a key={item} href={`#${item}`} className="hover:text-white transition-colors">{item}</a>)}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-[var(--text-muted)] hover:text-white px-3 py-2">Đăng nhập</Link>
            <Link href="/register"><Button size="sm">Dùng thử miễn phí</Button></Link>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 flex items-center justify-center text-white/70">{mobileOpen ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
        {mobileOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-white/[0.06]">
            <div className="flex gap-3 pt-3">
              <Link href="/login" className="flex-1"><Button variant="outline" fullWidth size="sm">Đăng nhập</Button></Link>
              <Link href="/register" className="flex-1"><Button fullWidth size="sm">Dùng thử</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-fgl-purple-600/15 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-fgl-gold-500/10 rounded-full blur-3xl pointer-events-none animate-float"/>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fgl-purple-600/15 border border-fgl-purple-500/30 text-xs text-fgl-purple-400 font-medium mb-6">
            <Sparkles size={12}/> Nền tảng AI Marketing #1 cho Spa Việt Nam
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Biến spa của bạn thành <span className="text-gradient">cỗ máy kiếm tiền</span> với AI
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-[var(--text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
            FGL tự động hóa marketing, chăm sóc khách hàng và quản lý booking — giúp bạn tăng 3x doanh thu mà không cần thuê thêm nhân viên
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register"><Button size="lg" rightIcon={<ArrowRight size={18}/>}>Bắt đầu miễn phí — không cần thẻ</Button></Link>
            <Link href="#features"><Button variant="outline" size="lg">Xem tính năng</Button></Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-6 mt-12 flex-wrap">
            {[{ icon: <Shield size={13}/>, l: 'Bảo mật dữ liệu' }, { icon: <Zap size={13}/>, l: 'Thiết lập 5 phút' }, { icon: <Star size={13}/>, l: '500+ spa tin dùng' }].map(b => (
              <div key={b.l} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]"><span className="text-fgl-purple-400">{b.icon}</span>{b.l}</div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{ v: '500+', l: 'Spa đang dùng FGL' }, { v: '50,000+', l: 'Lead đã tạo ra' }, { v: '3x', l: 'Tăng booking' }, { v: '98%', l: 'Khách hàng hài lòng' }].map((s, i) => (
            <FadeUp key={s.l} delay={i * 0.05} className="text-center">
              <p className="text-3xl font-bold text-gradient-gold mb-1">{s.v}</p>
              <p className="text-sm text-[var(--text-muted)]">{s.l}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="Tính năng" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-xs font-semibold text-fgl-purple-400 uppercase tracking-widest">Tính năng</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">Mọi thứ spa cần — trong 1 nền tảng</h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">Từ thu hút lead đến chốt booking đến chăm sóc hậu mãi</p>
          </FadeUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.05}>
                <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-fgl-sm ${f.color}`}>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">{f.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="Bảng giá" className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-xs font-semibold text-fgl-purple-400 uppercase tracking-widest">Bảng giá</span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-3">Chọn gói phù hợp với spa của bạn</h2>
            <p className="text-[var(--text-muted)]">Tất cả gói đều có 14 ngày dùng thử miễn phí</p>
          </FadeUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {tiers.map((tier, i) => (
              <FadeUp key={tier.id} delay={i * 0.05}>
                <div className={cn('p-6 rounded-2xl border relative transition-all hover:-translate-y-1', tier.highlight ? 'bg-fgl-purple-600/10 border-fgl-purple-500/60 shadow-fgl-sm' : `bg-white/[0.02] ${tier.badgeClass.includes('gray') ? 'border-gray-500/20' : tier.badgeClass.includes('blue') ? 'border-blue-500/25' : 'border-fgl-gold-500/30'}`)}>
                  {tier.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-fgl-purple-600 text-white text-[11px] font-semibold rounded-full">PHỔ BIẾN NHẤT</div>}
                  <p className={`text-sm font-bold mb-2 ${tier.badgeClass.split(' ')[0]}`}>{tier.name}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-white">{tier.price === 0 ? '0' : tier.price}K</span>
                    <span className="text-xs text-[var(--text-muted)]">/tháng</span>
                  </div>
                  <Link href="/register" className="block mt-3 mb-4">
                    <Button variant={tier.highlight ? 'primary' : tier.id === 'vip_pro' ? 'gold' : 'outline'} size="sm" fullWidth>{tier.cta}</Button>
                  </Link>
                  <ul className="space-y-2">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                        <CheckCircle2 size={13} className="text-fgl-purple-400 flex-shrink-0 mt-0.5"/>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Được tin dùng bởi 500+ spa Việt Nam</h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.08}>
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-fgl-purple-500/20 transition-all">
                  <div className="flex gap-0.5 mb-3">{Array(t.stars).fill(0).map((_, j) => <Star key={j} size={13} className="fill-fgl-gold-400 text-fgl-gold-400"/>)}</div>
                  <p className="text-sm text-[var(--text-secondary)] italic mb-4">&quot;{t.content}&quot;</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fgl-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">{t.avatar}</div>
                    <div><p className="text-sm font-medium text-white">{t.name}</p><p className="text-xs text-[var(--text-muted)]">{t.role}</p></div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-fgl-purple-600/20 to-fgl-gold-500/10 border border-fgl-purple-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.2),transparent_70%)]"/>
            <Crown size={32} className="text-fgl-gold-400 mx-auto mb-4 relative z-10"/>
            <h2 className="text-3xl font-bold text-white mb-3 relative z-10">Sẵn sàng tăng trưởng cùng FGL?</h2>
            <p className="text-[var(--text-muted)] mb-8 relative z-10">Thiết lập trong 5 phút, dùng thử 14 ngày miễn phí.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/register"><Button size="lg" rightIcon={<ArrowRight size={18}/>}>Bắt đầu miễn phí ngay</Button></Link>
              <Link href="/register"><Button variant="gold" size="lg">Xem demo live</Button></Link>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fgl-purple-600 to-fgl-purple-800 flex items-center justify-center"><span className="text-xs font-bold text-white">F</span></div>
            <span className="text-sm font-bold text-white">Feel Great Life</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">© 2025 Feel Great Life. Bản quyền thuộc về FGL Vietnam.</p>
          <div className="flex gap-4 text-xs text-[var(--text-muted)]">
            {['Điều khoản', 'Bảo mật', 'Liên hệ'].map(l => <Link key={l} href="#" className="hover:text-white">{l}</Link>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
