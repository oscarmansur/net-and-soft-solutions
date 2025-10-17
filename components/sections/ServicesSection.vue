<template>
  <section id="servicios" class="section bg-white">
    <div class="container-custom">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
        <span class="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
          {{ $t('services.badge') }}
        </span>
        <h2 class="font-heading font-bold text-gray-900 mb-6">
          {{ $t('services.title') }} <span class="text-gradient">{{ $t('services.titleHighlight') }}</span> {{ $t('services.titleEnd') }}
        </h2>
        <p class="text-lg text-gray-600">
          {{ $t('services.description') }}
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="(service, index) in services" 
          :key="service.title"
          class="card group hover:scale-105 cursor-pointer animate-fade-in-up"
          :class="`animation-delay-${index * 200}`"
        >
          <!-- Icon -->
          <div class="mb-6">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <component :is="service.icon" class="w-8 h-8 text-primary" />
            </div>
          </div>

          <!-- Content -->
          <h3 class="font-heading font-semibold text-xl text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
            {{ service.title }}
          </h3>
          
          <p class="text-gray-600 mb-6 leading-relaxed text-sm">
            {{ service.description }}
          </p>

          <!-- Features List -->
            <ul class="space-y-2 mb-6">
            <li 
              v-for="feature in service.features" 
              :key="feature"
              class="flex items-start text-xs text-gray-700"
            >
              <svg class="w-4 h-4 text-accent mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>


          <!-- CTA -->
          <a 
            :href="getWhatsAppLink(service.title)" 
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center text-primary font-medium group-hover:text-secondary transition-colors duration-300 text-sm"
          >
            {{$t('services.cta')}}
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div class="space-y-2">
            <div class="text-4xl font-bold text-primary">24/7</div>
            <p class="text-gray-600">{{$t('services.stats.support')}}</p>
          </div>
          <div class="space-y-2">
            <div class="text-4xl font-bold text-primary">+100</div>
            <p class="text-gray-600">{{$t('services.stats.projects')}}</p>
          </div>
          <div class="space-y-2">
            <div class="text-4xl font-bold text-primary">100%</div>
            <p class="text-gray-600">{{$t('services.stats.satisfaction')}}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Service icons as functional components
const CodeIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 
    'fill-rule': 'evenodd',
    d: 'M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z',
    'clip-rule': 'evenodd'
  })
])

const NetworkIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { d: 'M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z' })
])

const CameraIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 
    'fill-rule': 'evenodd',
    d: 'M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z',
    'clip-rule': 'evenodd'
  })
])

const SupportIcon = () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 
    'fill-rule': 'evenodd',
    d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z',
    'clip-rule': 'evenodd'
  })
])

const services = [
  {
    title: $t('services.list.0.title'),
    description: $t('services.list.0.description'),
    icon: CodeIcon,
    features: [
      $t('services.list.0.features.0'),
      $t('services.list.0.features.1'),
      $t('services.list.0.features.2'),
      $t('services.list.0.features.3')
    ]
  },
  {
    title: $t('services.list.1.title'),
    description: $t('services.list.1.description'),
    icon: NetworkIcon,
    features: [
      $t('services.list.1.features.0'),
      $t('services.list.1.features.1'),
      $t('services.list.1.features.2'),
      $t('services.list.1.features.3')
    ]
  },
  {
    title: $t('services.list.2.title'),
    description: $t('services.list.2.description'),
    icon: CameraIcon,
    features: [
      $t('services.list.2.features.0'),
      $t('services.list.2.features.1'),
      $t('services.list.2.features.2'),
      $t('services.list.2.features.3')
    ]
  },
  {
    title: $t('services.list.3.title'),
    description: $t('services.list.3.description'),
    icon: SupportIcon,
    features: [
      $t('services.list.3.features.0'),
      $t('services.list.3.features.1'),
      $t('services.list.3.features.2'),
      $t('services.list.3.features.3')
    ]
  }
]

const getWhatsAppLink = (serviceName: string) => {
  const phone = '584144785215'
  const message = encodeURIComponent(`${$t('ServiceRequest')} ${serviceName}`)
  return `https://wa.me/${phone}?text=${message}`
}
</script>