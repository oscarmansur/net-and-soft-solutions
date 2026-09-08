import { defineStore } from 'pinia'

export interface ToastNotification {
  id: string
  title?: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

export interface UserPreferences {
  reducedMotion: boolean
  notificationsEnabled: boolean
  cookieConsentGiven: boolean
  lastVisitedSection: string
}

export const useAppStore = defineStore('app', {
  state: () => ({
    toasts: [] as ToastNotification[],
    isGlobalLoading: false,
    globalLoadingText: '',
    preferences: {
      reducedMotion: false,
      notificationsEnabled: true,
      cookieConsentGiven: false,
      lastVisitedSection: 'home'
    } as UserPreferences
  }),

  getters: {
    activeToasts: (state) => state.toasts,
    hasActiveNotifications: (state) => state.toasts.length > 0,
    isConsentGiven: (state) => state.preferences.cookieConsentGiven
  },

  actions: {
    /**
     * Show a toast notification
     */
    notify(toast: Omit<ToastNotification, 'id'>): string {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      const newToast: ToastNotification = {
        id,
        duration: 4000,
        ...toast
      }

      this.toasts.push(newToast)

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          this.dismissToast(id)
        }, newToast.duration)
      }

      return id
    },

    notifySuccess(message: string, title?: string) {
      return this.notify({ message, title, type: 'success' })
    },

    notifyError(message: string, title?: string) {
      return this.notify({ message, title, type: 'error', duration: 6000 })
    },

    notifyInfo(message: string, title?: string) {
      return this.notify({ message, title, type: 'info' })
    },

    notifyWarning(message: string, title?: string) {
      return this.notify({ message, title, type: 'warning' })
    },

    dismissToast(id: string) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },

    clearToasts() {
      this.toasts = []
    },

    /**
     * Set global loading state
     */
    setLoading(loading: boolean, text: string = '') {
      this.isGlobalLoading = loading
      this.globalLoadingText = text
    },

    /**
     * Update user preferences
     */
    updatePreferences(partial: Partial<UserPreferences>) {
      this.preferences = {
        ...this.preferences,
        ...partial
      }
    },

    acceptCookieConsent() {
      this.preferences.cookieConsentGiven = true
    }
  },

  /**
   * Persistence configuration:
   * Client-side UI preferences persisted in localStorage
   */
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['preferences']
  }
})
