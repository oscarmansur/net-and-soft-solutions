<template>
  <section id="home" class="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300 pt-24 lg:pt-28 pb-16" data-aos="fade-in">
    <!-- Atmospheric Ambient Glow Spheres -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-cyan-500/10 via-primary/5 to-transparent dark:from-cyan-500/15 dark:via-secondary/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-0"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

    <!-- Subtle Binary Matrix Pattern (0s & 1s) -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]">
      <svg class="absolute inset-0 w-full h-full text-slate-800 dark:text-cyan-400 opacity-[0.045] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-binary-pattern" width="160" height="100" patternUnits="userSpaceOnUse">
            <!-- Row 1 -->
            <rect x="16" y="12" width="9" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.8" />
            <path d="M57 14.5l3-2.5v13m-3.5 0h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="96" y="12" width="9" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.8" />
            <path d="M137 14.5l3-2.5v13m-3.5 0h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />

            <!-- Row 2 -->
            <path d="M17 46.5l3-2.5v13m-3.5 0h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="56" y="44" width="9" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.8" />
            <path d="M97 46.5l3-2.5v13m-3.5 0h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="136" y="44" width="9" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.8" />

            <!-- Row 3 -->
            <rect x="16" y="76" width="9" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.8" />
            <rect x="56" y="76" width="9" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.8" />
            <path d="M97 78.5l3-2.5v13m-3.5 0h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M137 78.5l3-2.5v13m-3.5 0h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-binary-pattern)" />
      </svg>
    </div>

    <div class="container-custom relative z-10 py-12 lg:py-16">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- Content -->
        <div class="space-y-8" data-aos="fade-up" data-aos-duration="1000">
          <!-- Badge with pulse dot -->
          <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/30 shadow-sm backdrop-blur-md" data-aos="fade-up" data-aos-delay="100">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 dark:bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary dark:bg-cyan-400"></span>
            </span>
            <span>{{ $t('hero.badge') }}</span>
          </div>

          <!-- Hero Headline -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.12] text-balance" data-aos="fade-up" data-aos-delay="200">
            {{ titleBefore }}<span class="text-gradient">{{ titleHighlight }}</span>{{ titleAfter }}
          </h1>

          <!-- Hero Description -->
          <p class="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl font-normal" data-aos="fade-up" data-aos-delay="300">
            {{ $t('hero.description') }}
          </p>

          <!-- Features (Pill Badges Grid) -->
          <div class="grid sm:grid-cols-2 gap-3.5 pt-1" data-aos="fade-up" data-aos-delay="400">
            <div v-for="feature in features" :key="feature.text" class="flex items-center space-x-3 p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/[0.08] shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/30 dark:hover:border-cyan-500/30">
              <div class="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/15 dark:bg-cyan-500/20 flex items-center justify-center">
                <CheckIcon class="w-3.5 h-3.5 text-primary dark:text-cyan-400 stroke-[2.5]" />
              </div>
              <span class="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">{{ feature.text }}</span>
            </div>
          </div>

          <!-- Symmetrical CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-2" data-aos="fade-up" data-aos-delay="500">
            <a 
              :href="whatsappLink" 
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary h-14 px-8 text-base shadow-xl flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>{{ $t('hero.ctaQuote') }}</span>
            </a>
            <NuxtLink 
              to="#services"
              class="btn btn-outline h-14 px-8 text-base shadow-sm hover:shadow flex items-center justify-center"
            >
              <span>{{ $t('hero.ctaServices') }}</span>
            </NuxtLink>
          </div>

          <!-- Trust Indicators -->
          <div class="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
            <div class="flex items-center space-x-2.5 text-gray-600 dark:text-gray-300">
              <div class="w-8 h-8 rounded-lg bg-primary/10 dark:bg-cyan-500/10 flex items-center justify-center">
                <UserGroupIcon class="w-4 h-4 text-primary dark:text-cyan-400" />
              </div>
              <span class="text-xs sm:text-sm font-semibold">{{$t('hero.projectsCompleted')}}</span>
            </div>
            <div class="flex items-center space-x-2.5 text-gray-600 dark:text-gray-300">
              <div class="w-8 h-8 rounded-lg bg-secondary/10 dark:bg-blue-500/10 flex items-center justify-center">
                <ClockIcon class="w-4 h-4 text-secondary dark:text-cyan-400" />
              </div>
              <span class="text-xs sm:text-sm font-semibold">{{ $t('hero.support247') }}</span>
            </div>
          </div>
        </div>

        <!-- Image/Illustration with 3D canvas and Specular Rim -->
        <div class="relative" data-aos="fade-left" data-aos-delay="600">
          <div class="relative z-10">
            <div class="aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 dark:shadow-black/70 bg-slate-900 border border-slate-200/80 dark:border-white/10 specular-rim">
              <NetworkCanvas 
                :show-overlay="true"
                :particle-density="8000"
                :connection-distance="150"
                :mouse-distance="200"
              />
            </div>
          </div>
          
          <!-- Decorative ambient glows behind frame -->
          <div class="absolute -top-6 -right-6 w-36 h-36 bg-cyan-500/15 dark:bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>
          <div class="absolute -bottom-6 -left-6 w-44 h-44 bg-secondary/15 dark:bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-75 hover:opacity-100 transition-opacity">
      <NuxtLink to="#services" aria-label="Ir a servicios">
        <ArrowDownIcon class="w-6 h-6 text-primary dark:text-cyan-400 stroke-[2.5]" />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon, UserGroupIcon, ClockIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'
import NetworkCanvas from '~/components/ui/NetworkCanvas.vue'

const { t, tm, rt } = useI18n()

const titleFull = computed(() => String(t('hero.title') || ''))
const titleHighlight = computed(() => String(t('hero.titleHighlight') || ''))

const titleBefore = computed(() => {
  const full = titleFull.value
  const h = titleHighlight.value
  if (!h) return full
  const idx = full.indexOf(h)
  return idx === -1 ? full : full.substring(0, idx)
})

const titleAfter = computed(() => {
  const full = titleFull.value
  const h = titleHighlight.value
  if (!h) return ''
  const idx = full.indexOf(h)
  return idx === -1 ? '' : full.substring(idx + h.length)
})

const features = computed(() => {
  const raw = tm('hero.features') as any[]
  if (Array.isArray(raw)) {
    return raw.map((item: any) => ({
      text: typeof item === 'string' ? item : rt(item)
    }))
  }
  return [
    { text: t('hero.features.0') },
    { text: t('hero.features.1') },
    { text: t('hero.features.2') },
    { text: t('hero.features.3') }
  ]
})

const whatsappLink = computed(() => {
  const phone = '584144785215'
  const message = encodeURIComponent(String(t('contact.whatsapp.description') || 'Hola, me gustaría solicitar información sobre los servicios de Net & Soft Solutions'))
  return `https://wa.me/${phone}?text=${message}`
})
</script>

<style scoped>
.section {
  @apply py-20 md:py-28 lg:py-36;
}

.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full;
}
</style>
