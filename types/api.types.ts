export interface PaginatedResponse<T> {
  items: T[]
  nextCursor: string | null
  total: number
  hasMore: boolean
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta: {
    requestId: string
    version: string
    timestamp: string
  }
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Array<{
      field: string
      message: string
    }>
  }
  meta: {
    requestId: string
    version: string
    timestamp: string
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
