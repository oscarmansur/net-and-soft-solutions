import { defineStore } from 'pinia'
import type { ApiResponse } from '~/types/api'

export interface BackendServiceItem {
  id: string
  key: string
  title: string
  description: string
  icon?: string
  features: string[]
  isActive: boolean
}

export interface QuoteRequestPayload {
  name: string
  email: string
  phone: string
  serviceKey: string
  message: string
}

export const useServicesStore = defineStore('services', {
  state: () => ({
    services: [] as BackendServiceItem[],
    isLoading: false,
    error: null as string | null,
    lastFetched: null as number | null,
    isSubmittingQuote: false,
    quoteSubmittedSuccess: false
  }),

  getters: {
    activeServices: (state) => state.services.filter((s) => s.isActive),
    hasCachedServices: (state) =>
      state.services.length > 0 &&
      state.lastFetched !== null &&
      Date.now() - state.lastFetched < 1000 * 60 * 15 // 15 min TTL cache
  },

  actions: {
    /**
     * Fetch services list from backend with local cache verification
     */
    async fetchServices(forceRefresh = false): Promise<BackendServiceItem[]> {
      if (!forceRefresh && this.hasCachedServices) {
        return this.services
      }

      this.isLoading = true
      this.error = null

      try {
        const api = useApi()
        const response = await api.get<ApiResponse<BackendServiceItem[]> | BackendServiceItem[]>('/services', {
          requiresAuth: false
        })

        const items = Array.isArray(response) ? response : response.data
        this.services = items || []
        this.lastFetched = Date.now()
        return this.services
      } catch (err: any) {
        this.error = err.message || 'Error al cargar los servicios'
        // Fallback: If backend is not yet available, keep existing data
        return this.services
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Submit quote/contact request to backend
     */
    async submitQuote(payload: QuoteRequestPayload): Promise<boolean> {
      this.isSubmittingQuote = true
      this.quoteSubmittedSuccess = false
      this.error = null

      const appStore = useAppStore()

      try {
        const api = useApi()
        await api.post('/quotes', payload, {
          requiresAuth: false
        })

        this.quoteSubmittedSuccess = true
        appStore.notifySuccess('¡Solicitud enviada con éxito! Nos comunicaremos a la brevedad.')
        return true
      } catch (err: any) {
        this.error = err.message || 'No fue posible enviar la cotización'
        appStore.notifyError(this.error || 'Error al procesar la solicitud')
        throw err
      } finally {
        this.isSubmittingQuote = false
      }
    }
  },

  /**
   * Persistence configuration:
   * Cache fetched services in localStorage for instant offline/re-visit access
   */
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['services', 'lastFetched']
  }
})
