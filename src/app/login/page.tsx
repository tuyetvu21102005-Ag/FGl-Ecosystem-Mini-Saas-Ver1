'use client';

/**
 * Login Page — FGL Ecosystem
 * Email/Password + Google OAuth + Magic Link
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

// ── Validation Schema ─────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginForm = z.infer<typeof loginSchema>;

// ── Component ─────────────────────────────────────────────────

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Đăng nhập Email/Password
  const onSubmit = async (data: LoginForm) => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  // Đăng nhập Google
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
  };

  // Magic Link
  const handleMagicLink = async () => {
    const email = getValues('email');
    if (!email) { setError('Vui lòng nhập email trước'); return; }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError('Không thể gửi magic link. Vui lòng thử lại.'); }
    else { setMagicLinkSent(true); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fgl-purple-600 to-fgl-purple-800 flex items-center justify-center shadow-fgl">
              <span className="text-lg font-bold text-white font-display">F</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm">Feel Great Life</p>
              <p className="text-[10px] text-[var(--text-muted)]">Spa & SME Platform</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại</h1>
          <p className="text-[var(--text-muted)] mb-8">
            Đăng nhập để quản lý spa và tối ưu marketing của bạn
          </p>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white font-medium text-sm hover:bg-white/[0.10] transition-all mb-6 group"
          >
            {/* Google icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Tiếp tục với Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-xs text-[var(--text-muted)]">hoặc đăng nhập bằng email</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Magic link sent */}
          {magicLinkSent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
            >
              ✓ Magic link đã gửi đến email của bạn. Kiểm tra hộp thư nhé!
            </motion.div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="ten@spa.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu..."
              leftIcon={<Lock size={16} />}
              rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              onRightIconClick={() => setShowPassword(!showPassword)}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-fgl-purple-500" />
                <span className="text-xs text-[var(--text-muted)]">Ghi nhớ đăng nhập</span>
              </label>
              <Link href="/forgot-password" className="text-xs text-fgl-purple-400 hover:text-fgl-purple-300">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={isSubmitting} rightIcon={<ArrowRight size={16} />}>
              Đăng nhập
            </Button>
          </form>

          {/* Magic Link */}
          <button
            onClick={handleMagicLink}
            className="w-full mt-3 py-2.5 text-sm text-fgl-purple-400 hover:text-fgl-purple-300 flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles size={14} />
            Gửi magic link đăng nhập không cần mật khẩu
          </button>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-fgl-purple-400 hover:text-fgl-purple-300 font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Brand panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-16 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-fgl-purple-900/50 to-fgl-dark-200" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(124,58,237,0.3),transparent_60%)]" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-fgl-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 left-10 w-24 h-24 bg-fgl-gold-500/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-sm text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-fgl-purple-500 to-fgl-purple-800 flex items-center justify-center mx-auto mb-6 shadow-fgl animate-glow">
            <span className="text-4xl font-bold text-white font-display">F</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 font-display">Feel Great Life</h2>
          <p className="text-[var(--text-muted)] mb-8 leading-relaxed">
            Nền tảng AI marketing đầu tiên được thiết kế riêng cho spa và doanh nghiệp làm đẹp Việt Nam
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { value: '500+', label: 'Spa tin dùng' },
              { value: '50K+', label: 'Lead generated' },
              { value: '3x', label: 'Tăng booking' },
            ].map(stat => (
              <div key={stat.label} className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                <p className="text-xl font-bold text-gradient-gold">{stat.value}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-left">
            <p className="text-sm text-[var(--text-secondary)] italic mb-3">
              &quot;FGL giúp tôi tăng gấp đôi lịch hẹn chỉ trong 1 tháng. AI chat widget tuyệt vời!&quot;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fgl-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">H</div>
              <div>
                <p className="text-xs font-medium text-white">Nguyễn Thị Hương</p>
                <p className="text-[10px] text-[var(--text-muted)]">Chủ Beauty Spa Đà Nẵng</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
