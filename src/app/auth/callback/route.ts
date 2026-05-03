/**
 * Auth Callback Route — xử lý OAuth callback từ Supabase
 * Google OAuth và Magic Link đều redirect về đây
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get('code');
  const next  = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');

  // Xử lý lỗi OAuth
  if (error) {
    console.error('[Auth Callback] OAuth error:', error);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Thành công — chuyển về dashboard hoặc trang được yêu cầu
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('[Auth Callback] Exchange error:', exchangeError);
  }

  // Fallback về login nếu có lỗi
  return NextResponse.redirect(`${origin}/login?error=callback_failed`);
}
