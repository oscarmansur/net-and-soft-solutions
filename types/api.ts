/**
 * Standard API Response wrapper for backend integrations
 */
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: 'success' | 'error'
  statusCode?: number
}

/**
 * Standard pagination metadata
 */
export interface ApiPaginationMeta {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Paginated API Response
 */
export interface ApiPaginatedResponse<T> {
  data: T[]
  meta: ApiPaginationMeta
  message?: string
  status: 'success' | 'error'
}

/**
 * Structured API Error
 */
export interface ApiError {
  statusCode: number
  message: string
  code?: string
  errors?: Record<string, string[]>
}

/**
 * HTTP Request Options for useApi
 */
export interface ApiRequestOptions {
  headers?: Record<string, string>
  params?: Record<string, any>
  body?: any
  requiresAuth?: boolean
}
