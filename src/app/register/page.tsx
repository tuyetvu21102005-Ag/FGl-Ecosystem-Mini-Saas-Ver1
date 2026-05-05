'use client';

/**
 * Register Page — Đăng ký tài khoản mới
 * Multi-step: Thông tin cá nhân → Thông tin spa → Chọn gói
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Building2, Phone, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TierBadge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { cn, isValidVietnamesePhone } from '@/lib/utils';
import { TenantTier } from '@/types';

// ── Pricing Tiers ────────────────────────────────────────────

const tiers = [
  {
    id: 'regular' as TenantTier,
    name: 'Regular',
    price: 199000,
    desc: 'Cho spa nhỏ đang tăng trưởng',
    features: ['Booking Module', 'CRM cơ bản', '2 Content Tools', 'Chat không giới hạn'],
    color: 'border-blue-500/40',
    highlight: false,
  },
  {
    id: 'vip' as TenantTier,
    name: 'VIP',
    price: 499000,
    desc: 'Phổ biến nhất',
    features: ['Full 3 modules', 'Top 3 Content Tools', 'Marketing Co-Pilot', 'Báo cáo nâng cao'],
    color: 'border-fgl-purple-500/60',
    highlight: true,
  },
  {
    id: 'vip_pro' as TenantTier,
    name: 'VIP Pro',
    price: 999000,
    desc: 'Full ecosystem + Coaching',
    features: ['Full 8 AI Tools', 'Dashboard VIP', 'Automation', 'Coaching 1-1 hàng tháng'],
    color: 'border-fgl-gold-500/60',
    highlight: false,
  },
];

// ── Validation Schemas ────────────────────────────────────────

const step1Schema = z.object({
  full_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  phone: z.string().refine(isValidVietnamesePhone, 'Số điện thoại Việt Nam không hợp lệ'),
});

const step2Schema = z.object({
  spa_name: z.string().min(2, 'Tên spa phải có ít nhất 2 ký tự'),
  spa_address: z.string().min(5, 'Vui lòng nhập địa chỉ spa'),
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;

// ── Component ─────────────────────────────────────────────────

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState<TenantTier>('regular');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const step1Form = useForm<Step1Form>({ resolver: zodResolver(step1Schema) });
  const step2Form = useForm<Step2Form>({ resolver: zodResolver(step2Schema) });

  const handleStep1 = (data: Step1Form) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleStep2 = () => {
    setStep(3);
  };

  const handleGoogleRegister = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleFinalSubmit = async () => {
    if (!step1Data) return;
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email: step1Data.email,
      password: step1Data.password,
      options: {
        data: {
          full_name: step1Data.full_name,
          phone: step1Data.phone,
          tier: selectedTier,
        },
      },
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('Email này đã được đăng ký. Vui lòng đăng nhập.');
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
      setStep(1);
    } else {
      router.push('/dashboard?welcome=true');
    }
  };

  const steps = ['Thông tin cá nhân', 'Thông tin spa', 'Chọn gói'];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Background orbs */}
      <div className="fixed top-0 left-0 w-72 h-72 bg-fgl-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-fgl-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fgl-purple-600 to-fgl-purple-800 flex items-center justify-center shadow-fgl">
            <span className="text-lg font-bold text-white font-display">F</span>
          </div>
          <span className="font-bold text-white">Feel Great Life</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  i + 1 < step  ? 'bg-fgl-purple-600 text-white' :
                  i + 1 === step ? 'bg-fgl-purple-600 text-white ring-4 ring-fgl-purple-600/20' :
                                   'bg-white/[0.08] text-[var(--text-muted)]'
                )}>
                  {i + 1 < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={cn(
                  'text-xs hidden sm:block',
                  i + 1 === step ? 'text-white font-medium' : 'text-[var(--text-muted)]'
                )}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('h-px w-8 transition-all', i + 1 < step ? 'bg-fgl-purple-600' : 'bg-white/[0.1]')} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">

          <AnimatePresence mode="wait">

            {/* Step 1: Thông tin cá nhân */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-2xl font-bold text-white mb-1">Tạo tài khoản</h1>
                <p className="text-[var(--text-muted)] text-sm mb-6">Giải pháp AI toàn diện cho Spa của bạn</p>

                {/* Google */}
                <button
                  onClick={handleGoogleRegister}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white font-medium text-sm hover:bg-white/[0.10] transition-all mb-4"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Đăng ký với Google
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/[0.08]" />
                  <span className="text-xs text-[var(--text-muted)]">hoặc</span>
                  <div className="flex-1 h-px bg-white/[0.08]" />
                </div>

                {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

                <form onSubmit={step1Form.handleSubmit(handleStep1)} className="space-y-4">
                  <Input label="Họ và tên" placeholder="Nguyễn Thị Hoa" leftIcon={<User size={16} />} error={step1Form.formState.errors.full_name?.message} {...step1Form.register('full_name')} />
                  <Input label="Email" type="email" placeholder="ten@spa.com" leftIcon={<Mail size={16} />} error={step1Form.formState.errors.email?.message} {...step1Form.register('email')} />
                  <Input label="Số điện thoại" type="tel" placeholder="0901 234 567" leftIcon={<Phone size={16} />} error={step1Form.formState.errors.phone?.message} {...step1Form.register('phone')} />
                  <Input label="Mật khẩu" type={showPassword ? 'text' : 'password'} placeholder="Ít nhất 8 ký tự" leftIcon={<Lock size={16} />} rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />} onRightIconClick={() => setShowPassword(!showPassword)} error={step1Form.formState.errors.password?.message} {...step1Form.register('password')} />
                  <Button type="submit" fullWidth rightIcon={<ArrowRight size={16} />}>Tiếp theo</Button>
                </form>

                <p className="text-center text-sm text-[var(--text-muted)] mt-4">
                  Đã có tài khoản? <Link href="/login" className="text-fgl-purple-400 hover:text-fgl-purple-300 font-medium">Đăng nhập</Link>
                </p>
              </motion.div>
            )}

            {/* Step 2: Thông tin spa */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-2xl font-bold text-white mb-1">Thông tin spa</h1>
                <p className="text-[var(--text-muted)] text-sm mb-6">Giúp chúng tôi cá nhân hóa trải nghiệm cho bạn</p>

                <form onSubmit={step2Form.handleSubmit(handleStep2)} className="space-y-4">
                  <Input label="Tên spa / doanh nghiệp" placeholder="Zen Spa Hà Nội" leftIcon={<Building2 size={16} />} error={step2Form.formState.errors.spa_name?.message} {...step2Form.register('spa_name')} />
                  <Input label="Địa chỉ" placeholder="123 Đường ABC, Quận 1, TP.HCM" error={step2Form.formState.errors.spa_address?.message} {...step2Form.register('spa_address')} />

                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep(1)} leftIcon={<ArrowLeft size={16} />}>Quay lại</Button>
                    <Button type="submit" fullWidth rightIcon={<ArrowRight size={16} />}>Tiếp theo</Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Chọn gói */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-2xl font-bold text-white mb-1">Chọn gói phù hợp</h1>
                <p className="text-[var(--text-muted)] text-sm mb-6">Bạn có thể nâng cấp bất cứ lúc nào</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {tiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={cn(
                        'p-4 rounded-xl border text-left transition-all',
                        selectedTier === tier.id
                          ? `${tier.color} bg-white/[0.08]`
                          : 'border-white/[0.08] hover:border-white/[0.15]',
                        tier.highlight && selectedTier !== tier.id && 'border-fgl-purple-500/30'
                      )}
                    >
                      {tier.highlight && (
                        <span className="text-[10px] text-fgl-purple-400 font-semibold mb-1 block">PHỔ BIẾN NHẤT</span>
                      )}
                      <TierBadge tier={tier.id} className="mb-2" />
                      <p className="text-base font-bold text-white">
                        {tier.price === 0 ? 'Miễn phí' : `${(tier.price / 1000).toFixed(0)}K/tháng`}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{tier.desc}</p>
                      <ul className="mt-2 space-y-1">
                        {tier.features.slice(0, 2).map(f => (
                          <li key={f} className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                            <Check size={10} className="text-fgl-purple-400 flex-shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)} leftIcon={<ArrowLeft size={16} />}>Quay lại</Button>
                  <Button fullWidth onClick={handleFinalSubmit} rightIcon={<Check size={16} />}>
                    Tạo tài khoản
                  </Button>
                </div>

                <p className="text-center text-[11px] text-[var(--text-muted)] mt-4">
                  Bằng cách đăng ký, bạn đồng ý với{' '}
                  <Link href="/terms" className="text-fgl-purple-400">Điều khoản dịch vụ</Link> và{' '}
                  <Link href="/privacy" className="text-fgl-purple-400">Chính sách bảo mật</Link>
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
