import { ref } from 'vue'

// Shared reactive state across components
const isDark = ref(false)
let initialized = false

export function useTheme() {
  const initTheme = () => {
    if (process.client && !initialized) {
      initialized = true
      const stored = localStorage.getItem('theme') || localStorage.getItem('vueuse-color-scheme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      const shouldBeDark = stored === 'dark' || (!stored && prefersDark)
      isDark.value = shouldBeDark
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const toggleTheme = () => {
    if (process.client) {
      isDark.value = !isDark.value
      
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
        localStorage.setItem('vueuse-color-scheme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
        localStorage.setItem('vueuse-color-scheme', 'light')
      }
    }
  }

  return {
    isDark,
    initTheme,
    toggleTheme
  }
}
