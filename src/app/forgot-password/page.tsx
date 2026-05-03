'use client';

/**
 * Forgot Password Page
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Vui lòng nhập email'); return; }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
    });
    setLoading(false);
    if (error) { setError('Không thể gửi email. Kiểm tra lại địa chỉ email.'); }
    else { setSent(true); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed top-0 left-1/4 w-64 h-64 bg-fgl-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fgl-purple-600 to-fgl-purple-800 flex items-center justify-center shadow-fgl">
            <span className="text-lg font-bold text-white font-display">F</span>
          </div>
          <span className="font-bold text-white">Feel Great Life</span>
        </div>

        {!sent ? (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-white mb-2">Quên mật khẩu?</h1>
            <p className="text-[var(--text-muted)] text-sm mb-6">Nhập email và chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email đăng ký"
                type="email"
                placeholder="ten@spa.com"
                leftIcon={<Mail size={16} />}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Button type="submit" fullWidth loading={loading} rightIcon={<Send size={15} />}>
                Gửi link đặt lại mật khẩu
              </Button>
            </form>

            <Link href="/login" className="flex items-center justify-center gap-2 mt-4 text-sm text-[var(--text-muted)] hover:text-white transition-colors">
              <ArrowLeft size={14} /> Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 text-center backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <Send size={28} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Email đã được gửi!</h2>
            <p className="text-[var(--text-muted)] text-sm mb-6">
              Kiểm tra hộp thư của <strong className="text-white">{email}</strong> và nhấn vào link để đặt lại mật khẩu. Link có hiệu lực trong 1 giờ.
            </p>
            <Link href="/login"><Button variant="outline" fullWidth leftIcon={<ArrowLeft size={14}/>}>Quay lại đăng nhập</Button></Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
