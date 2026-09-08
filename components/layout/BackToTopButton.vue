<template>
  <transition name="fade">
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-primary via-primary-600 to-secondary dark:from-cyan-600 dark:via-cyan-500 dark:to-blue-600 hover:shadow-xl hover:shadow-primary/30 dark:hover:shadow-cyan-500/30 text-white rounded-full border border-white/20 dark:border-white/15 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group shadow-lg shadow-primary/20 dark:shadow-cyan-950/40"
      :aria-label="$t('backToTop.label')"
    >
      <ArrowUpIcon class="w-5 h-5 transform transition-transform duration-300 group-hover:-translate-y-0.5 stroke-[2.5]" />

      <!-- Tooltip -->
      <span class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-white border border-white/10 shadow-xl text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {{ $t('backToTop.tooltip') }}
      </span>
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUpIcon } from '@heroicons/vue/24/outline'

const isVisible = ref(false)

const handleScroll = () => {
  // Show button when user scrolls down 300px
  isVisible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
