<template>
  <button
    type="button"
    @click="toggleTheme"
    class="relative inline-flex items-center justify-center h-10 w-10 flex-shrink-0 rounded-xl border transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 select-none group cursor-pointer"
    :class="isDark 
      ? 'border-white/10 bg-slate-900/80 text-amber-400 hover:text-amber-300 hover:bg-slate-800 hover:border-cyan-500/40 focus:ring-cyan-500 focus:ring-offset-slate-950 shadow-sm shadow-cyan-950/20' 
      : 'border-slate-200/80 bg-white/90 text-slate-700 hover:text-primary hover:bg-slate-50 hover:border-primary/30 focus:ring-primary focus:ring-offset-white shadow-sm'"
    :aria-label="isDark ? $t('header.themeToggleLight') : $t('header.themeToggleDark')"
    :title="isDark ? $t('header.themeToggleLight') : $t('header.themeToggleDark')"
  >
    <!-- Sun Icon (shown in dark mode to switch to light) -->
    <SunIcon
      v-if="mounted && isDark"
      class="w-5 h-5 transform transition-transform duration-500 rotate-0 group-hover:rotate-45"
    />

    <!-- Moon Icon (shown in light mode to switch to dark) -->
    <MoonIcon
      v-else-if="mounted && !isDark"
      class="w-5 h-5 transform transition-transform duration-500 rotate-0 group-hover:-rotate-12"
    />

    <!-- Placeholder during SSR / initial hydration to prevent layout shift -->
    <div v-else class="w-5 h-5 opacity-0"></div>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SunIcon } from '@heroicons/vue/24/outline'
import { MoonIcon } from '@heroicons/vue/24/solid'
import { useTheme } from '~/composables/useTheme'

const { isDark, initTheme, toggleTheme } = useTheme()

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
  initTheme()
})
</script>
