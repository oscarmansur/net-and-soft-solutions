<template>
  <button
    type="button"
    @click="toggleTheme"
    class="relative inline-flex items-center justify-center p-2.5 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none group"
    :class="isDark 
      ? 'border-slate-700 bg-slate-900/80 text-amber-400 hover:text-amber-300 hover:bg-slate-800 hover:border-slate-600 focus:ring-cyan-500 focus:ring-offset-slate-950 shadow-sm shadow-cyan-950/20' 
      : 'border-gray-200 bg-white text-slate-700 hover:text-primary hover:bg-gray-50 hover:border-gray-300 focus:ring-primary focus:ring-offset-white shadow-sm'"
    :aria-label="isDark ? $t('header.themeToggleLight') : $t('header.themeToggleDark')"
    :title="isDark ? $t('header.themeToggleLight') : $t('header.themeToggleDark')"
  >
    <!-- Sun Icon (shown in dark mode to switch to light) -->
    <svg
      v-if="mounted && isDark"
      class="w-5 h-5 transform transition-transform duration-500 rotate-0 group-hover:rotate-45"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" stroke-width="2" stroke="currentColor" fill="currentColor" fill-opacity="0.2" />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 2v2m0 16v2m10-10h-2M4 10H2m15.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636"
      />
    </svg>

    <!-- Moon Icon (shown in light mode to switch to dark) -->
    <svg
      v-else-if="mounted && !isDark"
      class="w-5 h-5 transform transition-transform duration-500 rotate-0 group-hover:-rotate-12"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>

    <!-- Placeholder during SSR / initial hydration to prevent layout shift -->
    <div v-else class="w-5 h-5 opacity-0"></div>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'

const { isDark, initTheme, toggleTheme } = useTheme()

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
  initTheme()
})
</script>
