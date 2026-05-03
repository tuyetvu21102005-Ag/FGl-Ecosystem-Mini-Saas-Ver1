/**
 * API Route: /api/tenant
 * GET  — lấy thông tin tenant hiện tại
 * PATCH — cập nhật settings spa
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-errors';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new ApiError(401, 'Chưa đăng nhập');
    }

    // Lấy profile + tenant của user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, tenant:tenants(*)')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new ApiError(404, 'Không tìm thấy thông tin spa');
    }

    return NextResponse.json({ data: profile.tenant });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new ApiError(401, 'Chưa đăng nhập');
    }

    const body = await request.json();

    // Chỉ cho phép cập nhật các trường an toàn
    const allowedFields = ['name', 'phone', 'address', 'description', 'logo_url', 'settings'];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) updates[field] = body[field];
    }

    // Lấy tenant_id từ profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      throw new ApiError(404, 'Không tìm thấy spa');
    }

    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', profile.tenant_id)
      .eq('owner_id', user.id) // Chỉ owner mới sửa được
      .select()
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    return NextResponse.json({ data, message: 'Cập nhật thành công' });
  } catch (err) {
    return handleApiError(err);
  }
}
