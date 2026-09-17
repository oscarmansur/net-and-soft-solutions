<template>
  <section id="about" class="section bg-gradient-to-b from-white via-slate-50/70 to-white dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 transition-colors duration-300" data-aos="fade-up">
    <!-- Ambient glow -->
    <div class="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="container-custom relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- Content -->
        <div class="space-y-8" data-aos="fade-up">
          <div>
            <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/30 mb-4 shadow-sm backdrop-blur-md">
              {{ $t('about.WhyChooseUs') }}
            </span>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-gray-900 dark:text-white mb-5 text-balance leading-tight">
              {{ titleBefore }}<span class="text-gradient">{{ titleHighlight }}</span>{{ titleAfter }}
            </h2>
            <p class="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl font-normal">
              {{ $t('about.description') }}
            </p>
          </div>

          <!-- Benefits (Luxury Micro-Cards) -->
          <div class="space-y-3.5">
            <div 
              v-for="(benefit, index) in benefits" 
              :key="benefit.title"
              class="flex items-start space-x-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/[0.06] hover:border-primary/30 dark:hover:border-cyan-500/30 hover:shadow-md hover:translate-x-1.5 transition-all duration-300 ease-out group"
              data-aos="fade-up"
              :data-aos-delay="100 + (index * 100)"
            >
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/15 dark:from-cyan-500/20 dark:to-blue-500/20 border border-primary/20 dark:border-cyan-500/30 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <component :is="benefit.icon" class="w-6 h-6 text-primary dark:text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 class="font-heading font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                  {{ benefit.title }}
                </h3>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ benefit.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Symmetrical Stats Cards -->
          <div class="grid grid-cols-2 gap-4 pt-4" data-aos="fade-up" data-aos-delay="300">
            <div class="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-soft dark:shadow-none border border-slate-200/80 dark:border-white/[0.08] specular-rim">
              <AnimatedCounter :target="5" suffix="+" size-class="text-3xl sm:text-4xl" class="mb-1" />
              <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">{{ $t('about.stats.experience') }}</p>
            </div>
            <div class="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-soft dark:shadow-none border border-slate-200/80 dark:border-white/[0.08] specular-rim">
              <AnimatedCounter :target="100" suffix="%" size-class="text-3xl sm:text-4xl" class="mb-1" />
              <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">{{ $t('about.stats.satisfaction') }}</p>
            </div>
          </div>
        </div>

        <!-- Right Side: Mission, Vision, Values Command Center Card -->
        <div class="relative" data-aos="fade-left" data-aos-delay="200">
          <div class="relative z-10 bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-2xl dark:shadow-black/70 border border-slate-200/80 dark:border-white/[0.08] p-8 sm:p-10 backdrop-blur-2xl specular-rim">
            <div class="space-y-8 divide-y divide-slate-100 dark:divide-slate-800/80">
              <!-- Mission -->
              <div class="space-y-3">
                <div class="flex items-center space-x-3.5">
                  <div class="w-11 h-11 rounded-xl bg-primary/10 dark:bg-cyan-500/20 border border-primary/20 dark:border-cyan-500/30 flex items-center justify-center shadow-sm">
                    <RocketLaunchIcon class="w-5 h-5 text-primary dark:text-cyan-400" />
                  </div>
                  <h4 class="font-heading font-bold text-lg sm:text-xl text-gray-900 dark:text-white">{{ $t('about.mission.title') }}</h4>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed pl-1">
                  {{ $t('about.mission.description') }}
                </p>
              </div>

              <!-- Vision -->
              <div class="space-y-3 pt-6">
                <div class="flex items-center space-x-3.5">
                  <div class="w-11 h-11 rounded-xl bg-primary/10 dark:bg-cyan-500/20 border border-primary/20 dark:border-cyan-500/30 flex items-center justify-center shadow-sm">
                    <EyeIcon class="w-5 h-5 text-primary dark:text-cyan-400" />
                  </div>
                  <h4 class="font-heading font-bold text-lg sm:text-xl text-gray-900 dark:text-white">{{ $t('about.vision.title') }}</h4>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed pl-1">
                  {{ $t('about.vision.description') }}
                </p>
              </div>

              <!-- Values (Interactive Pill Grid) -->
              <div class="space-y-3 pt-6">
                <div class="flex items-center space-x-3.5">
                  <div class="w-11 h-11 rounded-xl bg-primary/10 dark:bg-cyan-500/20 border border-primary/20 dark:border-cyan-500/30 flex items-center justify-center shadow-sm">
                    <SparklesIcon class="w-5 h-5 text-primary dark:text-cyan-400" />
                  </div>
                  <h4 class="font-heading font-bold text-lg sm:text-xl text-gray-900 dark:text-white">{{ $t('about.values.title') }}</h4>
                </div>
                <div class="grid grid-cols-2 gap-2.5 pt-1">
                  <div 
                    v-for="value in values" 
                    :key="value" 
                    class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    <span class="w-2 h-2 rounded-full bg-primary dark:bg-cyan-400 flex-shrink-0"></span>
                    <span class="truncate">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Decorative ambient glows behind card -->
          <div class="absolute -top-8 -left-8 w-40 h-40 bg-primary/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-8 -right-8 w-48 h-48 bg-secondary/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>

      <!-- Certifications/Trust Badges (Equal-height Symmetric Grid) -->
      <div class="mt-24" data-aos="fade-up" data-aos-delay="300">
        <div class="text-center mb-14">
          <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/30 mb-4 shadow-sm backdrop-blur-md">
            {{ $t('about.certifications') }}
          </span>
          <h3 class="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-gray-900 dark:text-white text-balance">
            {{ $t('about.certificationsTitle') }} <span class="text-gradient">{{ $t('about.certificationsHighlight') }}</span>
          </h3>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
          <div 
            v-for="(cert, index) in certifications" 
            :key="cert.name"
            class="group relative bg-white dark:bg-slate-900 rounded-2xl p-7 shadow-soft dark:shadow-none border border-slate-200/80 dark:border-white/[0.08] hover:shadow-2xl dark:hover:shadow-cyan-950/30 hover:border-primary/30 dark:hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center justify-between text-center specular-rim h-full"
            data-aos="fade-up"
            :data-aos-delay="100 + (index * 100)"
          >
            <!-- Logo with protective clean backdrop for dark mode visibility -->
            <div class="w-20 h-20 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 mb-4">
              <img 
                :src="cert.logo" 
                :alt="cert.name"
                width="64"
                height="64"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-contain"
              />
            </div>
            
            <!-- Name -->
            <h4 class="font-heading font-bold text-gray-900 dark:text-white text-sm leading-snug mb-3 flex-1 flex items-center">
              {{ cert.name }}
            </h4>
            
            <!-- Badge/Label -->
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 dark:bg-cyan-500/15 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/30">
              <CheckBadgeIcon class="w-3.5 h-3.5 mr-1.5 text-primary dark:text-cyan-400" />
              {{ cert.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  RocketLaunchIcon,
  EyeIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import { CheckBadgeIcon } from '@heroicons/vue/20/solid'
import AnimatedCounter from '~/components/ui/AnimatedCounter.vue'

const { t } = useI18n()

const titleFull = computed(() => String(t('about.title') || ''))
const titleHighlight = computed(() => String(t('about.titleHighlight') || ''))

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

const benefits = computed(() => [
  {
    title: t('about.benefits[0].title'),
    description: t('about.benefits[0].description'),
    icon: ShieldCheckIcon
  },
  {
    title: t('about.benefits[1].title'),
    description: t('about.benefits[1].description'),
    icon: ClockIcon
  },
  {
    title: t('about.benefits[2].title'),
    description: t('about.benefits[2].description'),
    icon: UserGroupIcon
  },
  {
    title: t('about.benefits[3].title'),
    description: t('about.benefits[3].description'),
    icon: StarIcon
  }
])

const values = computed(() => [
  t('about.values.list[0]'),
  t('about.values.list[1]'),
  t('about.values.list[2]'),
  t('about.values.list[3]'),
  t('about.values.list[4]'),
  t('about.values.list[5]')
])

const certifications = computed(() => [
  {
    name: t('about.MicrosoftPartner'),
    label: t('about.certified'),
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
  },
  {
    name: t('about.CiscoCertified'),
    label: t('about.certified'),
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg'
  },
  {
    name: t('about.IBMCertified'),
    label: t('about.certified'),
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg'
  },
  {
    name: t('about.ISO9001'),
    label: t('about.certified'),
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/ISO_9001-2015.svg'
  }
])
</script>