/**
 * API Route: /api/leads
 * GET  — danh sách leads (phân trang, filter)
 * POST — tạo lead mới
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new ApiError(401, 'Chưa đăng nhập');
    }

    // Lấy query params
    const { searchParams } = new URL(request.url);
    const page     = parseInt(searchParams.get('page')    ?? '1');
    const perPage  = parseInt(searchParams.get('per_page') ?? '20');
    const status   = searchParams.get('status');
    const source   = searchParams.get('source');
    const search   = searchParams.get('search');

    // Lấy tenant_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      throw new ApiError(404, 'Không tìm thấy spa');
    }

    // Build query
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('tenant_id', profile.tenant_id)
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (status) query = query.eq('status', status);
    if (source) query = query.eq('source', source);
    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);

    const { data, count, error } = await query;

    if (error) {
      throw new ApiError(400, error.message);
    }

    return NextResponse.json({
      data,
      total:       count ?? 0,
      page,
      per_page:    perPage,
      total_pages: Math.ceil((count ?? 0) / perPage),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new ApiError(401, 'Chưa đăng nhập');
    }

    const body = await request.json();
    const { name, phone, email, source = 'manual', notes, tags } = body;

    // Validate
    if (!name && !phone && !email) {
      throw new ApiError(400, 'Cần ít nhất 1 trong: tên, SĐT, hoặc email');
    }

    // Lấy tenant_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      throw new ApiError(404, 'Không tìm thấy spa');
    }

    const { data, error } = await supabase
      .from('leads')
      .insert({
        tenant_id: profile.tenant_id,
        name,
        phone,
        email,
        source,
        notes,
        tags: tags ?? [],
        score: 10, // Điểm khởi điểm cho lead tạo thủ công
      })
      .select()
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    return NextResponse.json({ data, message: 'Tạo lead thành công' }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
