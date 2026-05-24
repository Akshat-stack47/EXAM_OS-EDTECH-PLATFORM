import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import type { ApiSuccessResponse, ApiErrorResponse } from '@/types/api.types'

const API_VERSION = '1.0.0'

function buildMeta() {
  return {
    requestId: randomUUID(),
    version: API_VERSION,
    timestamp: new Date().toISOString(),
  }
}

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: buildMeta(),
  }
  return NextResponse.json(body, { status })
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: Array<{ field: string; message: string }>,
): NextResponse {
  const body: ApiErrorResponse = {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
    meta: buildMeta(),
  }
  return NextResponse.json(body, { status })
}
