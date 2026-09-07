<template>
  <div
    ref="selectorRef"
    class="relative inline-block text-left"
    :class="{ 'w-full': fullWidth }"
    @keydown.escape="closeDropdown"
  >
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none select-none"
      :class="[
        fullWidth ? 'w-full justify-between py-2.5 px-4 text-sm' : 'h-10',
        isOpen
          ? 'border-primary dark:border-cyan-500 ring-2 ring-primary/20 dark:ring-cyan-500/20 bg-primary/5 dark:bg-cyan-950/30 text-primary dark:text-cyan-400 shadow-sm'
          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600 hover:text-primary dark:hover:text-cyan-400 shadow-sm hover:shadow'
      ]"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-label="$t('header.languageSelector.ariaLabel')"
    >
      <div class="flex items-center gap-2">
        <!-- Current Flag -->
        <div class="w-5 h-3.5 rounded-[3px] overflow-hidden shadow-sm flex-shrink-0 border border-black/10 flex items-center justify-center">
          <svg v-if="currentLanguage.code === 'es'" class="w-full h-full object-cover" viewBox="0 0 640 480">
            <rect width="640" height="480" fill="#c60b1e" />
            <rect width="640" height="240" y="120" fill="#ffc400" />
          </svg>
          <svg v-else class="w-full h-full object-cover" viewBox="0 0 640 480">
            <rect width="640" height="480" fill="#ffffff" />
            <g fill="#b22234">
              <rect width="640" height="37" y="0" />
              <rect width="640" height="37" y="74" />
              <rect width="640" height="37" y="148" />
              <rect width="640" height="37" y="222" />
              <rect width="640" height="37" y="296" />
              <rect width="640" height="37" y="370" />
              <rect width="640" height="37" y="443" />
            </g>
            <rect width="256" height="259" fill="#3c3b6e" />
            <!-- Star dots representation -->
            <g fill="#ffffff" transform="scale(0.8) translate(16, 16)">
              <circle cx="20" cy="20" r="8" /><circle cx="60" cy="20" r="8" /><circle cx="100" cy="20" r="8" /><circle cx="140" cy="20" r="8" /><circle cx="180" cy="20" r="8" /><circle cx="220" cy="20" r="8" />
              <circle cx="40" cy="50" r="8" /><circle cx="80" cy="50" r="8" /><circle cx="120" cy="50" r="8" /><circle cx="160" cy="50" r="8" /><circle cx="200" cy="50" r="8" />
              <circle cx="20" cy="80" r="8" /><circle cx="60" cy="80" r="8" /><circle cx="100" cy="80" r="8" /><circle cx="140" cy="80" r="8" /><circle cx="180" cy="80" r="8" /><circle cx="220" cy="80" r="8" />
              <circle cx="40" cy="110" r="8" /><circle cx="80" cy="110" r="8" /><circle cx="120" cy="110" r="8" /><circle cx="160" cy="110" r="8" /><circle cx="200" cy="110" r="8" />
              <circle cx="20" cy="140" r="8" /><circle cx="60" cy="140" r="8" /><circle cx="100" cy="140" r="8" /><circle cx="140" cy="140" r="8" /><circle cx="180" cy="140" r="8" /><circle cx="220" cy="140" r="8" />
            </g>
          </svg>
        </div>

        <!-- Language Code/Name -->
        <span class="uppercase font-bold tracking-wider">
          {{ fullWidth ? currentLanguage.nativeName : currentLanguage.code }}
        </span>
      </div>

      <!-- Dropdown Chevron Icon -->
      <svg
        class="w-3.5 h-3.5 transition-transform duration-300 text-gray-400 group-hover:text-primary dark:text-gray-400"
        :class="{ 'rotate-180 text-primary dark:text-cyan-400': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute mt-2 py-1.5 rounded-2xl border shadow-2xl backdrop-blur-xl z-50 focus:outline-none overflow-hidden"
        :class="[
          fullWidth ? 'left-0 right-0 w-full' : 'right-0 w-52',
          'bg-white/95 dark:bg-slate-900/95 border-gray-100 dark:border-slate-800 shadow-slate-900/10 dark:shadow-slate-950/80'
        ]"
        role="listbox"
        :aria-label="$t('header.languageSelector.ariaLabel')"
        tabindex="-1"
      >
        <button
          v-for="lang in availableLanguages"
          :key="lang.code"
          type="button"
          @click="changeLanguage(lang.code)"
          class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors duration-150 group/item select-none text-left"
          :class="[
            locale === lang.code
              ? 'bg-primary/10 dark:bg-cyan-500/15 text-primary dark:text-cyan-400 font-semibold'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/70 hover:text-gray-900 dark:hover:text-white'
          ]"
          role="option"
          :aria-selected="locale === lang.code"
        >
          <div class="flex items-center gap-3">
            <!-- Flag SVG -->
            <div class="w-5 h-3.5 rounded-[3px] overflow-hidden shadow-sm flex-shrink-0 border border-black/10">
              <svg v-if="lang.code === 'es'" class="w-full h-full object-cover" viewBox="0 0 640 480">
                <rect width="640" height="480" fill="#c60b1e" />
                <rect width="640" height="240" y="120" fill="#ffc400" />
              </svg>
              <svg v-else class="w-full h-full object-cover" viewBox="0 0 640 480">
                <rect width="640" height="480" fill="#ffffff" />
                <g fill="#b22234">
                  <rect width="640" height="37" y="0" />
                  <rect width="640" height="37" y="74" />
                  <rect width="640" height="37" y="148" />
                  <rect width="640" height="37" y="222" />
                  <rect width="640" height="37" y="296" />
                  <rect width="640" height="37" y="370" />
                  <rect width="640" height="37" y="443" />
                </g>
                <rect width="256" height="259" fill="#3c3b6e" />
                <g fill="#ffffff" transform="scale(0.8) translate(16, 16)">
                  <circle cx="20" cy="20" r="8" /><circle cx="60" cy="20" r="8" /><circle cx="100" cy="20" r="8" /><circle cx="140" cy="20" r="8" /><circle cx="180" cy="20" r="8" /><circle cx="220" cy="20" r="8" />
                  <circle cx="40" cy="50" r="8" /><circle cx="80" cy="50" r="8" /><circle cx="120" cy="50" r="8" /><circle cx="160" cy="50" r="8" /><circle cx="200" cy="50" r="8" />
                  <circle cx="20" cy="80" r="8" /><circle cx="60" cy="80" r="8" /><circle cx="100" cy="80" r="8" /><circle cx="140" cy="80" r="8" /><circle cx="180" cy="80" r="8" /><circle cx="220" cy="80" r="8" />
                  <circle cx="40" cy="110" r="8" /><circle cx="80" cy="110" r="8" /><circle cx="120" cy="110" r="8" /><circle cx="160" cy="110" r="8" /><circle cx="200" cy="110" r="8" />
                  <circle cx="20" cy="140" r="8" /><circle cx="60" cy="140" r="8" /><circle cx="100" cy="140" r="8" /><circle cx="140" cy="140" r="8" /><circle cx="180" cy="140" r="8" /><circle cx="220" cy="140" r="8" />
                </g>
              </svg>
            </div>

            <div class="flex flex-col">
              <span class="text-xs font-semibold leading-none">{{ lang.nativeName }}</span>
              <span class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-none">
                {{ lang.subtitle }}
              </span>
            </div>
          </div>

          <!-- Active Checkmark Indicator -->
          <div v-if="locale === lang.code" class="text-primary dark:text-cyan-400 pl-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    fullWidth?: boolean
  }>(),
  {
    fullWidth: false
  }
)

const emit = defineEmits<{
  (e: 'change', code: 'es' | 'en'): void
}>()

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const selectorRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const availableLanguages = [
  {
    code: 'es' as const,
    nativeName: 'Español',
    subtitle: 'ES - Español'
  },
  {
    code: 'en' as const,
    nativeName: 'English',
    subtitle: 'EN - English'
  }
]

const currentLanguage = computed(() => {
  return availableLanguages.find(l => l.code === locale.value) || availableLanguages[0]
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const changeLanguage = (code: 'es' | 'en') => {
  isOpen.value = false
  emit('change', code)
  const newPath = switchLocalePath(code)
  if (newPath) {
    navigateTo(newPath)
  }
}

const handleGlobalClick = (event: MouseEvent) => {
  if (selectorRef.value && !selectorRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleGlobalClick)
})
</script>
