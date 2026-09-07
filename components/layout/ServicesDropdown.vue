<template>
  <div
    ref="dropdownRef"
    class="relative"
    @mouseenter="cancelClose"
    @mouseleave="scheduleClose"
  >
    <!-- Trigger (Nav Link to Services + Dropdown Indicator) -->
    <NuxtLink
      :to="servicesHref"
      class="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-cyan-400 font-medium transition-colors duration-300 relative group py-1 text-sm flex items-center gap-1 cursor-pointer focus:outline-none"
      :class="{ 'text-primary dark:text-cyan-400': servicesOpen }"
      @click="handleTriggerClick"
      @keydown.escape="servicesOpen = false"
      aria-haspopup="true"
      :aria-expanded="servicesOpen"
    >
      <span>{{ $t('header.navItems.services') }}</span>
      <svg
        class="w-4 h-4 transition-transform duration-300 transform pointer-events-none"
        :class="{ 'rotate-180': servicesOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
      <span
        class="absolute bottom-0 left-0 h-0.5 bg-primary dark:bg-cyan-400 transition-all duration-300"
        :class="servicesOpen ? 'w-full' : 'w-0 group-hover:w-full'"
      ></span>
    </NuxtLink>

    <!-- Mega Dropdown Modal / Flyout -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-show="servicesOpen"
        class="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] lg:w-[780px] max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-slate-950/80 border border-gray-100 dark:border-slate-800 overflow-hidden z-50 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
        role="menu"
        @mouseenter="cancelClose"
        @mouseleave="scheduleClose"
      >
        <!-- Services 4-Column Grid -->
        <div class="grid grid-cols-4 gap-2 p-5">
          <NuxtLink
            v-for="srv in previewServices"
            :key="srv.title"
            :to="servicesHref"
            @click="handleServiceClick"
            class="flex flex-col items-start gap-3 p-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-all duration-200 group/card border border-transparent hover:border-gray-200/60 dark:hover:border-slate-700/60 cursor-pointer"
            role="menuitem"
          >
            <!-- Service Icon Container -->
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover/card:scale-110 shadow-sm"
              :class="srv.iconBg"
            >
              <svg class="w-6 h-6" :class="srv.iconColor" fill="currentColor" viewBox="0 0 20 20">
                <path :d="srv.iconPath" fill-rule="evenodd" clip-rule="evenodd" />
              </svg>
            </div>

            <!-- Content -->
            <div>
              <p class="font-heading font-semibold text-sm text-gray-900 dark:text-white group-hover/card:text-primary dark:group-hover/card:text-cyan-400 transition-colors duration-200">
                {{ srv.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                {{ srv.description }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <!-- Footer Action Links -->
        <div class="grid grid-cols-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-950/60">
          <NuxtLink
            v-for="action in dropdownActions"
            :key="action.label"
            :to="action.href"
            :target="action.external ? '_blank' : undefined"
            :rel="action.external ? 'noopener noreferrer' : undefined"
            @click="handleActionClick(action, $event)"
            class="flex items-center justify-center gap-2 py-3.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800/60 transition-all duration-200 border-r last:border-r-0 border-gray-100 dark:border-slate-800"
          >
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path :d="action.iconPath" fill-rule="evenodd" clip-rule="evenodd" />
            </svg>
            <span>{{ action.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  servicesHref: string
  whatsappLink: string
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const dropdownRef = ref<HTMLElement | null>(null)
const servicesOpen = ref(false)
const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const scheduleClose = () => {
  closeTimer.value = setTimeout(() => {
    servicesOpen.value = false
  }, 150)
}

const cancelClose = () => {
  if (closeTimer.value) {
    clearTimeout(closeTimer.value)
    closeTimer.value = null
  }
  servicesOpen.value = true
}

const handleTriggerClick = (event: MouseEvent) => {
  servicesOpen.value = false
  if (closeTimer.value) {
    clearTimeout(closeTimer.value)
    closeTimer.value = null
  }
  const el = document.getElementById('services')
  if (el) {
    event.preventDefault()
    el.scrollIntoView({ behavior: 'smooth' })
    window.history.pushState(null, '', props.servicesHref)
  }
}

const handleServiceClick = (event: MouseEvent) => {
  servicesOpen.value = false
  if (closeTimer.value) {
    clearTimeout(closeTimer.value)
    closeTimer.value = null
  }
  const el = document.getElementById('services')
  if (el) {
    event.preventDefault()
    el.scrollIntoView({ behavior: 'smooth' })
    window.history.pushState(null, '', props.servicesHref)
  }
}

const handleActionClick = (action: { href: string; external?: boolean }, event: MouseEvent) => {
  servicesOpen.value = false
  if (closeTimer.value) {
    clearTimeout(closeTimer.value)
    closeTimer.value = null
  }
  if (action.external) return

  const hashIndex = action.href.indexOf('#')
  if (hashIndex !== -1) {
    const hash = action.href.substring(hashIndex + 1)
    const el = document.getElementById(hash)
    if (el) {
      event.preventDefault()
      el.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', action.href)
    }
  }
}

const handleGlobalClick = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    servicesOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleGlobalClick)
})

const previewServices = computed(() => [
  {
    title: t('services.list.0.title') || 'Desarrollo de Software',
    description: t('services.list.0.description') || 'Aplicaciones web y móviles a medida',
    iconBg: 'bg-blue-50 dark:bg-cyan-950/40',
    iconColor: 'text-blue-600 dark:text-cyan-400',
    iconPath: 'M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z'
  },
  {
    title: t('services.list.1.title') || 'Redes e Infraestructura',
    description: t('services.list.1.description') || 'Infraestructura y conectividad robusta',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconPath: 'M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z'
  },
  {
    title: t('services.list.2.title') || 'Sistemas CCTV',
    description: t('services.list.2.description') || 'Cámaras de seguridad y monitoreo 24/7',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconPath: 'M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z'
  },
  {
    title: t('services.list.3.title') || 'Soporte Técnico',
    description: t('services.list.3.description') || 'Mantenimiento y soporte profesional',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconPath: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z'
  }
])

const dropdownActions = computed(() => [
  {
    label: t('header.servicesDropdown.viewAll') || 'Ver todos los servicios',
    href: props.servicesHref,
    external: false,
    iconPath: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
  },
  {
    label: t('header.servicesDropdown.requestQuote') || 'Solicitar asesoría',
    href: localePath('/#contact'),
    external: false,
    iconPath: 'M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0h-2v2h2V9z'
  },
  {
    label: t('header.servicesDropdown.whatsapp') || 'Atención WhatsApp',
    href: props.whatsappLink,
    external: true,
    iconPath: 'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z'
  }
])
</script>
