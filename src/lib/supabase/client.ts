/**
 * Supabase Client cho browser (Client Components)
 * Sử dụng @supabase/ssr để xử lý cookies đúng cách với Next.js App Router
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
