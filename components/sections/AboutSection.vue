<template>
  <section id="nosotros" class="section bg-gradient-to-br from-gray-50 to-white" data-aos="fade-up">
    <div class="container-custom">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="space-y-8" data-aos="fade-up">
          <div>
            <span class="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              {{ $t('about.WhyChooseUs') }}
            </span>
            <h2 class="font-heading font-bold text-gray-900 mb-6">
              {{ $t('about.title').replace($t('about.titleHighlight'), '') }}<span class="text-gradient">{{ $t('about.titleHighlight') }}</span>{{ $t('about.title').includes($t('about.titleHighlight')) ? $t('about.title').substring($t('about.title').indexOf($t('about.titleHighlight')) + $t('about.titleHighlight').length) : '' }}
            </h2>
            <p class="text-lg text-gray-600 leading-relaxed">
              {{ $t('about.description') }}
            </p>
          </div>

          <!-- Benefits -->
          <div class="space-y-6">
            <div 
              v-for="(benefit, index) in benefits" 
              :key="benefit.title"
              class="flex items-start space-x-4 p-4 rounded-xl hover:bg-white hover:shadow-soft transition-all duration-300"
              data-aos="fade-up"
              :data-aos-delay="100 + (index * 100)"
            >
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <component :is="benefit.icon" class="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 class="font-heading font-semibold text-lg text-gray-900 mb-2">
                  {{ benefit.title }}
                </h3>
                <p class="text-gray-600">
                  {{ benefit.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-6 pt-8" data-aos="fade-up" data-aos-delay="300">
            <div class="text-center p-6 rounded-xl bg-white shadow-soft">
              <AnimatedCounter :target="5" suffix="+" class="text-3xl font-bold text-primary mb-2" />
              <p class="text-gray-600 text-sm">{{ $t('about.stats.experience') }}</p>
            </div>
            <div class="text-center p-6 rounded-xl bg-white shadow-soft">
              <AnimatedCounter :target="100" suffix="%" class="text-3xl font-bold text-primary mb-2" />
              <p class="text-gray-600 text-sm">{{ $t('about.stats.satisfaction') }}</p>
            </div>
          </div>
        </div>

        <!-- Image/Visual -->
        <div class="relative" data-aos="fade-left" data-aos-delay="200">
          <!-- Main card -->
          <div class="relative z-10 bg-white rounded-2xl shadow-large p-8">
            <div class="space-y-6">
              <!-- Mission -->
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <h4 class="font-heading font-semibold text-gray-900">{{ $t('about.mission.title') }}</h4>
                </div>
                <p class="text-gray-600 text-sm leading-relaxed pl-13">
                  {{ $t('about.mission.description') }}
                </p>
              </div>

              <!-- Vision -->
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <svg class="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <h4 class="font-heading font-semibold text-gray-900">{{ $t('about.vision.title') }}</h4>
                </div>
                <p class="text-gray-600 text-sm leading-relaxed pl-13">
                  {{ $t('about.vision.description') }}
                </p>
              </div>

              <!-- Values -->
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <h4 class="font-heading font-semibold text-gray-900">{{ $t('about.values.title') }}</h4>
                </div>
                <div class="grid grid-cols-2 gap-2 pl-13">
                  <span v-for="value in values" :key="value" class="text-gray-600 text-sm flex items-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                    {{ value }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Decorative elements -->
          <div class="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-6 -right-6 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      <!-- Certifications/Trust Badges -->
      <div class="mt-20 text-center" data-aos="fade-up" data-aos-delay="300">
        <p class="text-gray-500 text-sm mb-8">{{ $t('about.certifications') }}</p>
        <div class="flex flex-wrap justify-center items-center gap-12 opacity-50">
          <div class="text-gray-400 font-semibold text-lg">{{ $t('about.MicrosoftPartner') }}</div>
          <div class="text-gray-400 font-semibold text-lg">{{ $t('about.CiscoCertified') }}</div>
          <div class="text-gray-400 font-semibold text-lg">{{ $t('about.IBMCertified') }}</div>
          <div class="text-gray-400 font-semibold text-lg">{{ $t('about.ISO9001') }}</div>         
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { h } from 'vue'
import AnimatedCounter from '~/components/ui/AnimatedCounter.vue'

const ShieldIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 
    'fill-rule': 'evenodd',
    d: 'M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
    'clip-rule': 'evenodd'
  })
])

const ClockIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 
    'fill-rule': 'evenodd',
    d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z',
    'clip-rule': 'evenodd'
  })
])

const UserGroupIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { d: 'M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' })
])

const StarIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' })
])

const benefits = [
  {
    title: $t('about.benefits[0].title'),
    description: $t('about.benefits[0].description'),
    icon: ShieldIcon
  },
  {
    title: $t('about.benefits[1].title'),
    description: $t('about.benefits[1].description'),
    icon: ClockIcon
  },
  {
    title: $t('about.benefits[2].title'),
    description: $t('about.benefits[2].description'),
    icon: UserGroupIcon
  },
  {
    title: $t('about.benefits[3].title'),
    description: $t('about.benefits[3].description'),
    icon: StarIcon
  }
]

const values = [
  $t('about.values.list[0]'),
  $t('about.values.list[1]'),
  $t('about.values.list[2]'),
  $t('about.values.list[3]'),
  $t('about.values.list[4]'),
  $t('about.values.list[5]')
]
</script>