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
      class="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-cyan-400 font-medium transition-colors duration-200 relative group py-2 text-xs lg:text-sm flex items-center gap-1.5 cursor-pointer focus:outline-none tracking-wide"
      :class="{ 'text-primary dark:text-cyan-400': servicesOpen }"
      @click="handleTriggerClick"
      @keydown.escape="servicesOpen = false"
      aria-haspopup="true"
      :aria-expanded="servicesOpen"
    >
      <span>{{ $t('header.navItems.services') }}</span>
      <ChevronDownIcon
        class="w-3.5 h-3.5 transition-transform duration-300 transform pointer-events-none opacity-80 group-hover:opacity-100"
        :class="{ 'rotate-180 text-primary dark:text-cyan-400': servicesOpen }"
      />
      <span
        class="absolute bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary dark:from-cyan-400 dark:to-blue-400 transition-all duration-300 rounded-full"
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
        class="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] lg:w-[800px] max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl dark:shadow-black/80 border border-slate-200/80 dark:border-white/10 overflow-hidden z-50 specular-rim before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
        role="menu"
        @mouseenter="cancelClose"
        @mouseleave="scheduleClose"
      >
        <!-- Services 4-Column Grid -->
        <div class="grid grid-cols-4 gap-3 p-5">
          <NuxtLink
            v-for="srv in previewServices"
            :key="srv.title"
            :to="servicesHref"
            @click="handleServiceClick"
            class="flex flex-col items-start gap-3 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all duration-200 group/card border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/60 cursor-pointer"
            role="menuitem"
          >
            <!-- Service Icon Container -->
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover/card:scale-110 shadow-sm"
              :class="srv.iconBg"
            >
              <component :is="srv.icon" class="w-5 h-5" :class="srv.iconColor" />
            </div>

            <!-- Content -->
            <div>
              <p class="font-heading font-bold text-sm text-gray-900 dark:text-white group-hover/card:text-primary dark:group-hover/card:text-cyan-400 transition-colors duration-200 leading-snug">
                {{ srv.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                {{ srv.description }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <!-- Footer Action Links -->
        <div class="grid grid-cols-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/80">
          <NuxtLink
            v-for="action in dropdownActions"
            :key="action.label"
            :to="action.href"
            :target="action.external ? '_blank' : undefined"
            :rel="action.external ? 'noopener noreferrer' : undefined"
            @click="handleActionClick(action, $event)"
            class="flex items-center justify-center gap-2 py-3.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800/60 transition-all duration-200 border-r last:border-r-0 border-slate-100 dark:border-slate-800/80"
          >
            <component :is="action.icon" class="w-4 h-4 flex-shrink-0 opacity-80" />
            <span>{{ action.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import {
  ChevronDownIcon,
  CodeBracketIcon,
  ServerStackIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon,
  Squares2X2Icon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

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
    icon: CodeBracketIcon
  },
  {
    title: t('services.list.1.title') || 'Redes e Infraestructura',
    description: t('services.list.1.description') || 'Infraestructura y conectividad robusta',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    icon: ServerStackIcon
  },
  {
    title: t('services.list.2.title') || 'Sistemas CCTV',
    description: t('services.list.2.description') || 'Cámaras de seguridad y monitoreo 24/7',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    icon: VideoCameraIcon
  },
  {
    title: t('services.list.3.title') || 'Soporte Técnico',
    description: t('services.list.3.description') || 'Mantenimiento y soporte profesional',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    icon: WrenchScrewdriverIcon
  }
])

const dropdownActions = computed(() => [
  {
    label: t('header.servicesDropdown.viewAll') || 'Ver todos los servicios',
    href: props.servicesHref,
    external: false,
    icon: Squares2X2Icon
  },
  {
    label: t('header.servicesDropdown.requestQuote') || 'Solicitar asesoría',
    href: localePath('/#contact'),
    external: false,
    icon: ChatBubbleBottomCenterTextIcon
  },
  {
    label: t('header.servicesDropdown.whatsapp') || 'Atención WhatsApp',
    href: props.whatsappLink,
    external: true,
    icon: ChatBubbleLeftRightIcon
  }
])
</script>
