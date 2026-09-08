import type { ApiError, ApiRequestOptions } from '~/types/api'

/**
 * Enterprise-grade API client composable for Nuxt 3.
 * Wraps $fetch with automatic base URL, reactive authentication headers,
 * and centralized error parsing.
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  // Base URL configured via runtimeConfig / env
  const baseURL = config.public.apiBase || '/api'

  /**
   * Internal request executor with interceptors
   */
  const request = async <T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
      body?: any
      params?: Record<string, any>
      headers?: Record<string, string>
      requiresAuth?: boolean
    } = {}
  ): Promise<T> => {
    const {
      method = 'GET',
      body,
      params,
      headers = {},
      requiresAuth = true
    } = options

    // Prepare default headers
    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...headers
    }

    // Attach Bearer token if required and available
    if (requiresAuth && authStore.token) {
      requestHeaders.Authorization = `Bearer ${authStore.token}`
    }

    try {
      return await $fetch<T>(endpoint, {
        baseURL,
        method,
        headers: requestHeaders,
        params,
        body
      })
    } catch (error: any) {
      // Standardize error payload
      const status = error?.response?.status || error?.statusCode || 500
      const responseData = error?.data || error?.response?._data || {}

      const apiError: ApiError = {
        statusCode: status,
        message:
          responseData.message ||
          error?.message ||
          'Ha ocurrido un error al procesar la solicitud.',
        code: responseData.code,
        errors: responseData.errors
      }

      // Handle session expiration
      if (status === 401 && authStore.isAuthenticated) {
        authStore.logout()
      }

      throw apiError
    }
  }

  return {
    baseURL,

    /**
     * HTTP GET
     */
    get: <T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'body'>) =>
      request<T>(endpoint, { method: 'GET', ...options }),

    /**
     * HTTP POST
     */
    post: <T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) =>
      request<T>(endpoint, { method: 'POST', body, ...options }),

    /**
     * HTTP PUT
     */
    put: <T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) =>
      request<T>(endpoint, { method: 'PUT', body, ...options }),

    /**
     * HTTP PATCH
     */
    patch: <T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) =>
      request<T>(endpoint, { method: 'PATCH', body, ...options }),

    /**
     * HTTP DELETE
     */
    delete: <T = any>(endpoint: string, options?: ApiRequestOptions) =>
      request<T>(endpoint, { method: 'DELETE', ...options }),

    /**
     * Raw request wrapper
     */
    raw: request
  }
}
