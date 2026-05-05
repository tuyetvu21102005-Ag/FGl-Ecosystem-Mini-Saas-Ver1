'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Facebook, Calendar, PenTool, 
  ChevronRight, ArrowLeft, Copy, Check, 
  RotateCcw, Send, Settings2, Hash
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

// ── Types & Mock Data ────────────────────────────────────────

type ToolType = 'facebook' | 'planner' | 'email' | 'none';

const tools = [
  {
    id: 'facebook' as ToolType,
    name: 'Facebook Caption Generator',
    desc: 'Tạo bài viết quảng cáo thu hút khách hàng cho Fanpage Spa.',
    icon: Facebook,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    tier: ['vip', 'vip_pro'],
  },
  {
    id: 'planner' as ToolType,
    name: 'Marketing Planner',
    desc: 'Lập kế hoạch khuyến mãi và nội dung bài đăng cho cả tháng.',
    icon: Calendar,
    color: 'text-fgl-purple-400',
    bgColor: 'bg-fgl-purple-400/10',
    tier: ['vip', 'vip_pro'],
  },
  {
    id: 'email' as ToolType,
    name: 'Email Campaign AI',
    desc: 'Viết nội dung email chăm sóc khách hàng tự động.',
    icon: Send,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    tier: ['vip_pro'],
  },
];

// ── Components ───────────────────────────────────────────────

export default function ContentToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolType>('none');

  return (
    <DashboardLayout 
      title="Nội dung AI" 
      breadcrumb={[{ label: 'Nội dung AI', href: '/dashboard/content' }]}
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* Header Section */}
        <AnimatePresence mode="wait">
          {activeTool === 'none' ? (
            <motion.div 
              key="header-hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Sparkles className="text-fgl-gold-400" />
                AI Content Hub
              </h1>
              <p className="text-[var(--text-muted)] mt-2">Chọn công cụ AI để bắt đầu sáng tạo nội dung cho Spa của bạn.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="header-tool"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="mb-8"
            >
              <button 
                onClick={() => setActiveTool('none')}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors mb-4 group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Quay lại Content Hub
              </button>
              <h1 className="text-3xl font-bold text-white">
                {tools.find(t => t.id === activeTool)?.name}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hub View: Grid of tools */}
        {activeTool === 'none' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className="h-full hover:border-fgl-purple-500/40 transition-all group cursor-pointer overflow-hidden"
                  onClick={() => setActiveTool(tool.id)}
                >
                  <CardHeader>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", tool.bgColor)}>
                      <tool.icon className={cn("w-6 h-6", tool.color)} />
                    </div>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription className="min-h-[40px]">{tool.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-fgl-purple-400 flex items-center gap-1">
                        Bắt đầu ngay <ChevronRight size={14} />
                      </span>
                      <div className="flex gap-1">
                        {tool.tier.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--text-muted)] uppercase text-[8px]">{t}</span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tool View: Facebook Caption Generator */}
        {activeTool === 'facebook' && <FacebookCaptionTool />}
        
        {/* Tool View: Marketing Planner */}
        {activeTool === 'planner' && <MarketingPlannerTool />}

        {/* Placeholder for other tools */}
        {activeTool === 'email' && (
          <Card className="p-12 text-center">
            <Send className="w-12 h-12 text-orange-400 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-white mb-2">Email Campaign AI</h3>
            <p className="text-[var(--text-muted)]">Tính năng này dành riêng cho gói VIP Pro.</p>
            <Button className="mt-6" variant="outline" onClick={() => setActiveTool('none')}>Quay lại</Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

// ── Tool Component: Marketing Planner ────────────────────────

function MarketingPlannerTool() {
  const [month, setMonth] = useState('Tháng 10');
  const [goal, setGoal] = useState('Tăng lượng khách hàng mới');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Hãy lập một kế hoạch Marketing chi tiết cho Spa vào ${month}. Mục tiêu chính: ${goal}. Kế hoạch bao gồm: Các chương trình khuyến mãi chính, chủ đề bài đăng Facebook cho 4 tuần, và các gợi ý để tăng tỉ lệ chốt đơn.` }
          ],
          isContentTool: true
        }),
      });
      const data = await response.json();
      setResult(data.content);
    } catch (error) {
      console.error('Lỗi tạo kế hoạch:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Chọn thời điểm</label>
            <select 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-fgl-purple-500"
            >
              {['Tháng 10', 'Tháng 11', 'Tháng 12', 'Tết Nguyên Đán'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex-[2] space-y-2">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Mục tiêu chính</label>
            <Input 
              placeholder="Ví dụ: Tăng doanh thu dịch vụ VIP, Tri ân khách cũ..." 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerate} loading={generating} leftIcon={<Calendar size={16} />}>Lập kế hoạch AI</Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="bg-gradient-to-br from-white/[0.02] to-transparent">
              <CardHeader className="border-b border-white/[0.06] flex flex-row items-center justify-between">
                <CardTitle className="text-fgl-gold-400 flex items-center gap-2">
                  <Sparkles size={18} />
                  Kế hoạch Marketing Chiến lược
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => {
                   navigator.clipboard.writeText(result);
                }}>Copy toàn bộ</Button>
              </CardHeader>
              <CardContent className="p-8">
                <div className="whitespace-pre-wrap text-sm leading-loose text-white/90">
                  {result}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Tool Component: Facebook Caption Generator ────────────────

function FacebookCaptionTool() {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('chuyên nghiệp');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Hãy viết một bài đăng Facebook quảng cáo cho Spa với nội dung sau: "${prompt}". Phong cách: ${tone}. Yêu cầu: Có Emoji, Hashtag, và kêu gọi hành động (CTA) thu hút.` }
          ],
          isContentTool: true // Để API biết và dùng system prompt khác nếu cần
        }),
      });
      
      const data = await response.json();
      setResult(data.content);
    } catch (error) {
      console.error('Lỗi tạo nội dung:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Side */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Cấu hình bài viết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Bạn muốn quảng cáo gì?</label>
              <Textarea 
                placeholder="Ví dụ: Giảm giá 50% dịch vụ nặn mụn cho sinh viên trong tháng 10..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[150px] bg-white/[0.03] border-white/[0.08] focus:border-fgl-purple-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Phong cách (Tone)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Chuyên nghiệp', 'Hài hước', 'Gần gũi', 'Sang trọng'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t.toLowerCase())}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                      tone === t.toLowerCase() 
                        ? "bg-fgl-purple-600 border-fgl-purple-500 text-white shadow-lg"
                        : "bg-white/5 border-white/10 text-[var(--text-muted)] hover:border-white/20"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              fullWidth 
              size="lg" 
              onClick={handleGenerate} 
              loading={generating}
              disabled={!prompt}
              leftIcon={<Sparkles size={18} />}
              className="bg-gradient-to-r from-fgl-purple-600 to-fgl-purple-800 shadow-fgl hover:shadow-fgl-lg"
            >
              Tạo nội dung ngay
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Output Side */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="h-full border-dashed border-white/10 bg-white/[0.01]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.06] pb-4">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Kết quả từ AI</CardTitle>
            {result && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setResult('')} leftIcon={<RotateCcw size={14} />}>Làm lại</Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard} leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}>
                  {copied ? 'Đã chép' : 'Copy'}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-invert max-w-none"
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-white font-sans">
                    {result}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-[300px] text-center text-[var(--text-muted)]"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <PenTool size={24} className="opacity-20" />
                  </div>
                  <p className="text-sm italic">Kết quả sẽ hiển thị tại đây sau khi bạn nhấn nút tạo...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
