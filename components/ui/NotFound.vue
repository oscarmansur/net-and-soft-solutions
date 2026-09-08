<template>
  <div class="relative py-12 md:py-20 overflow-hidden">
    <!-- Ambient Background Lighting -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 via-primary/10 to-transparent dark:from-cyan-500/15 dark:via-primary-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

    <div class="container-custom max-w-4xl text-center">
      <!-- 404 Visual Icon & Numbers -->
      <div class="relative inline-block mb-6">
        <!-- Radar / Network Disconnected Pulse Rings -->
        <div class="absolute inset-0 flex items-center justify-center -z-10">
          <div class="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-primary/15 dark:border-cyan-500/20 animate-pulse-slow"></div>
          <div class="w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-primary/20 dark:border-cyan-500/30"></div>
        </div>

        <!-- Big 404 Number -->
        <p class="text-8xl sm:text-9xl lg:text-[11rem] font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 via-primary to-cyan-600 dark:from-white dark:via-cyan-300 dark:to-primary-400 select-none leading-none">
          404
        </p>

        <!-- Broken Circuit / Node Floating Badge -->
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/30 shadow-md backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>{{ $t('notFound.badge') }}</span>
        </div>
      </div>

      <!-- Heading & Explanatory Text -->
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 mt-6">
        {{ $t('notFound.title') }}
      </h1>

      <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
        {{ $t('notFound.subtitle') }}
      </p>

      <!-- Primary Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-4 mb-16">
        <button
          type="button"
          @click="handleNavigate(localePath('/'))"
          class="btn btn-primary px-6 py-3.5 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>{{ $t('notFound.backHome') }}</span>
        </button>

        <button
          type="button"
          @click="handleNavigate(localePath('/#services'))"
          class="btn btn-outline px-6 py-3.5 text-sm font-semibold transition-all duration-300 gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>{{ $t('notFound.viewServices') }}</span>
        </button>

        <button
          type="button"
          @click="handleNavigate(localePath('/sitemap'))"
          class="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/80 font-medium text-sm transition-all duration-300 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>{{ $t('notFound.viewSitemap') }}</span>
        </button>
      </div>

      <!-- Suggested Services Cards Grid -->
      <div class="border-t border-gray-200/80 dark:border-slate-800/80 pt-12 text-left">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary dark:bg-cyan-400"></span>
            {{ $t('notFound.suggestedTitle') }}
          </h2>
          <span class="text-xs text-gray-500 dark:text-gray-400">Net & Soft Solutions</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div
            v-for="(service, idx) in suggestedServices"
            :key="service.title"
            @click="handleNavigate(localePath(service.href))"
            class="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/70 dark:border-slate-800 hover:border-primary/50 dark:hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div class="w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-primary dark:text-cyan-400 bg-primary/10 dark:bg-cyan-500/10 group-hover:scale-110 transition-transform">
                <!-- Service Icon 0: Software -->
                <svg v-if="idx === 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <!-- Service Icon 1: Networks -->
                <svg v-else-if="idx === 1" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <!-- Service Icon 2: CCTV -->
                <svg v-else-if="idx === 2" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <!-- Service Icon 3: Support -->
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h3 class="font-heading font-semibold text-sm text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors mb-1.5">
                {{ service.title }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {{ service.desc }}
              </p>
            </div>

            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-primary dark:text-cyan-400 font-semibold">
              <span>{{ $t('header.servicesDropdown.viewAll') }}</span>
              <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </div>
        </div>

        <!-- WhatsApp Quick Assistance Banner -->
        <div class="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4 text-center sm:text-left">
            <div class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div>
              <p class="font-heading font-bold text-lg text-white">
                {{ $t('notFound.needHelp') }}
              </p>
              <p class="text-white/80 text-xs sm:text-sm">
                {{ $t('notFound.needHelpDesc') }}
              </p>
            </div>
          </div>

          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="px-5 py-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-semibold text-sm transition-all duration-300 shadow-md flex-shrink-0 flex items-center gap-2"
          >
            <span>{{ $t('notFound.contactWhatsApp') }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isErrorPage?: boolean
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()

interface SuggestedServiceItem {
  title: string
  desc: string
  href: string
}

const suggestedServices = computed<SuggestedServiceItem[]>(() => {
  const raw = t('notFound.services', { returnObjects: true })
  return Array.isArray(raw) ? raw : []
})

const whatsappUrl = computed(() => {
  const phone = '584144785215'
  const message = encodeURIComponent(t('footer.whatsappMessage'))
  return `https://wa.me/${phone}?text=${message}`
})

const handleNavigate = (path: string) => {
  if (props.isErrorPage) {
    clearError({ redirect: path })
  } else {
    router.push(path)
  }
}
</script>
