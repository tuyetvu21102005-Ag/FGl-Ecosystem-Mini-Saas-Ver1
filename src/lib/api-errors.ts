import { NextResponse } from 'next/server';

/**
 * Standard API Error Class
 */
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Common Error Handler for API Routes
 */
export function handleApiError(error: unknown) {
  console.error('[API Error]', error);

  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    // Treat unknown object errors with a message as 400 Bad Request
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  return NextResponse.json({ error: 'Đã xảy ra lỗi hệ thống' }, { status: 500 });
}
