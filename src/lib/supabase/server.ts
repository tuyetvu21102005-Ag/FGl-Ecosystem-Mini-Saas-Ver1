/**
 * Supabase Client cho Server (Server Components, Route Handlers, Server Actions)
 * Đọc cookies từ Next.js headers để duy trì session
 */

import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Bỏ qua lỗi khi gọi từ Server Component (không set được cookies)
          }
        },
      },
    }
  );
}

/**
 * Supabase Admin Client dùng Service Role (bypass RLS)
 * CHỈ dùng trong server-side code, KHÔNG bao giờ expose ra client!
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
