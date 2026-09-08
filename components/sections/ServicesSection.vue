<template>
  <section id="services" class="section bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300" data-aos="fade-up">
    <!-- Ambient glow behind section -->
    <div class="absolute top-1/3 left-0 w-80 h-80 bg-primary/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/3 right-0 w-80 h-80 bg-secondary/5 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="container-custom relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 sm:mb-20" data-aos="fade-up">
        <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/30 mb-4 shadow-sm backdrop-blur-md">
          {{ $t('services.badge') }}
        </span>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-gray-900 dark:text-white mb-5 text-balance leading-tight">
          {{ $t('services.title') }} <span class="text-gradient">{{ $t('services.titleHighlight') }}</span> {{ $t('services.titleEnd') }}
        </h2>
        <p class="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto font-normal">
          {{ $t('services.description') }}
        </p>
      </div>

      <!-- Services Grid (Strict Height Symmetry) -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
        <div 
          v-for="(service, index) in services" 
          :key="service.title"
          class="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] hover:border-primary/40 dark:hover:border-cyan-500/40 shadow-sm hover:shadow-2xl dark:hover:shadow-cyan-950/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between specular-rim"
          data-aos="fade-up"
          :data-aos-delay="(index % 4) * 100">
          
          <!-- Top: Image Header -->
          <div class="relative h-48 sm:h-52 overflow-hidden flex-shrink-0">
            <img 
              :src="service.image" 
              :alt="service.title"
              width="400"
              height="225"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
            
            <!-- Icon Overlay Badge -->
            <div class="absolute bottom-3.5 left-4">
              <div class="w-12 h-12 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 border border-white/40 dark:border-white/10">
                <component :is="service.icon" class="w-6 h-6 text-primary dark:text-cyan-400" />
              </div>
            </div>
          </div>

          <!-- Bottom: Content with Flex Equalizer -->
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-heading font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-2.5 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors duration-200 leading-snug">
                {{ service.title }}
              </h3>
              
              <p class="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed text-xs sm:text-sm">
                {{ service.description }}
              </p>

              <!-- Features List -->
              <ul class="space-y-2 mb-6">
                <li 
                  v-for="feature in service.features" 
                  :key="feature"
                  class="flex items-start text-xs text-gray-700 dark:text-gray-300 leading-tight"
                >
                  <CheckIcon class="w-4 h-4 text-secondary dark:text-cyan-400 mr-2 flex-shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- Horizontally Levelled Bottom Action -->
            <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
              <a 
                :href="getWhatsAppLink(service.title)" 
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center text-primary dark:text-cyan-400 font-semibold group-hover:text-secondary dark:group-hover:text-cyan-300 transition-colors duration-200 text-xs sm:text-sm gap-1.5"
              >
                <span>{{$t('services.cta')}}</span>
                <ArrowRightIcon class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200 stroke-[2.5]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Luxury Bento Stats Bar -->
      <div class="mt-16 sm:mt-20 p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] shadow-xl shadow-slate-900/5 dark:shadow-black/50 backdrop-blur-xl specular-rim">
        <div class="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800/80">
          <div class="space-y-2 py-3 md:py-0">
            <AnimatedCounter :target="24" suffix="/7" size-class="text-3xl sm:text-4xl lg:text-5xl" />
            <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">{{$t('services.stats.support')}}</p>
          </div>
          <div class="space-y-2 py-3 md:py-0">
            <AnimatedCounter :target="100" prefix="+" size-class="text-3xl sm:text-4xl lg:text-5xl" />
            <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">{{$t('services.stats.projects')}}</p>
          </div>
          <div class="space-y-2 py-3 md:py-0">
            <AnimatedCounter :target="100" suffix="%" size-class="text-3xl sm:text-4xl lg:text-5xl" />
            <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">{{$t('services.stats.satisfaction')}}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CodeBracketIcon,
  ServerStackIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'
import AnimatedCounter from '~/components/ui/AnimatedCounter.vue'

const { t } = useI18n()

const services = computed(() => [
  {
    title: t('services.list.0.title'),
    description: t('services.list.0.description'),
    icon: CodeBracketIcon,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    features: [
      t('services.list.0.features.0'),
      t('services.list.0.features.1'),
      t('services.list.0.features.2'),
      t('services.list.0.features.3')
    ]
  },
  {
    title: t('services.list.1.title'),
    description: t('services.list.1.description'),
    icon: ServerStackIcon,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    features: [
      t('services.list.1.features.0'),
      t('services.list.1.features.1'),
      t('services.list.1.features.2'),
      t('services.list.1.features.3')
    ]
  },
  {
    title: t('services.list.2.title'),
    description: t('services.list.2.description'),
    icon: VideoCameraIcon,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80',
    features: [
      t('services.list.2.features.0'),
      t('services.list.2.features.1'),
      t('services.list.2.features.2'),
      t('services.list.2.features.3')
    ]
  },
  {
    title: t('services.list.3.title'),
    description: t('services.list.3.description'),
    icon: WrenchScrewdriverIcon,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    features: [
      t('services.list.3.features.0'),
      t('services.list.3.features.1'),
      t('services.list.3.features.2'),
      t('services.list.3.features.3')
    ]
  }
])

const getWhatsAppLink = (serviceName: string) => {
  const phone = '584144785215'
  const message = encodeURIComponent(`${t('ServiceRequest')} ${serviceName}`)
  return `https://wa.me/${phone}?text=${message}`
}
</script>