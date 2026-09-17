/**
 * User roles for access control
 */
export type UserRole = 'admin' | 'staff' | 'client' | 'guest'

/**
 * Core User profile model
 */
export interface User {
  id: string | number
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  company?: string
  createdAt?: string
}

/**
 * Authentication tokens
 */
export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
  tokenType?: string
}

/**
 * Login credentials payload
 */
export interface LoginCredentials {
  email: string
  password?: string
  rememberMe?: boolean
}

/**
 * Login response payload from backend
 */
export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
  expiresIn?: number
}
