import { defineStore } from 'pinia'
import type { User, LoginCredentials, AuthResponse } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role || 'guest',
    userName: (state) => state.user?.name || ''
  },

  actions: {
    /**
     * Set session data manually
     */
    setSession(token: string, user: User, refreshToken?: string) {
      this.token = token
      this.user = user
      if (refreshToken) {
        this.refreshToken = refreshToken
      }
      this.error = null
    },

    /**
     * Authenticate with backend API
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
      this.isLoading = true
      this.error = null

      try {
        const api = useApi()
        const response = await api.post<AuthResponse>('/auth/login', credentials, {
          requiresAuth: false
        })

        this.setSession(response.token, response.user, response.refreshToken)
        return response
      } catch (err: any) {
        this.error = err.message || 'Error al iniciar sesión'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch current user profile from backend
     */
    async fetchProfile(): Promise<User> {
      if (!this.token) {
        throw new Error('No hay sesión activa')
      }

      this.isLoading = true
      try {
        const api = useApi()
        const profile = await api.get<User>('/auth/profile')
        this.user = profile
        return profile
      } catch (err: any) {
        this.error = err.message || 'Error al obtener perfil'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Terminate session and clear state
     */
    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.error = null
    }
  },

  /**
   * Persistence configuration:
   * Uses cookies to maintain SSR session consistency and avoid hydration mismatches
   */
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: 'lax'
    }),
    paths: ['token', 'user']
  }
})
