<template>
  <section id="contact" class="section bg-white dark:bg-slate-950 transition-colors duration-300" data-aos="fade-up">
    <!-- Ambient glow behind section -->
    <div class="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="container-custom relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 sm:mb-20 animate-fade-in-up">
        <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 border border-primary/20 dark:border-cyan-500/30 mb-4 shadow-sm backdrop-blur-md">
          {{ $t('contact.badge') }}
        </span>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-gray-900 dark:text-white mb-5 text-balance leading-tight">
          {{ $t('contact.title') }} <span class="text-gradient">{{ $t('contact.titleHighlight') }}</span>
        </h2>
        <p class="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto font-normal">
          {{ $t('contact.description') }}
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <!-- Contact Info (Left Column) -->
        <div class="space-y-6 animate-fade-in-up">
          <!-- Contact Cards -->
          <div class="space-y-3.5">
            <div 
              v-for="contact in contactInfo" 
              :key="contact.title"
              class="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] hover:border-primary/30 dark:hover:border-cyan-500/30 shadow-soft dark:shadow-none hover:shadow-lg transition-all duration-300 specular-rim group"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/15 dark:from-cyan-500/20 dark:to-blue-500/20 border border-primary/20 dark:border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                    <component :is="contact.icon" class="w-6 h-6 text-primary dark:text-cyan-400" />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="font-heading font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                    {{ contact.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-2.5 leading-relaxed">
                    {{ contact.description }}
                  </p>
                  <a 
                    v-if="contact.link"
                    :href="contact.link" 
                    :target="contact.external ? '_blank' : '_self'"
                    :rel="contact.external ? 'noopener noreferrer' : ''"
                    class="inline-flex items-center text-primary dark:text-cyan-400 font-semibold hover:text-secondary dark:hover:text-cyan-300 transition-colors text-xs sm:text-sm gap-1"
                  >
                    <span>{{ contact.linkText }}</span>
                    <ArrowRightIcon class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                  <p v-else class="text-primary dark:text-cyan-400 font-semibold text-xs sm:text-sm">
                    {{ contact.value }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- WhatsApp CTA Card -->
          <div class="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#25D366]/10 via-[#25D366]/5 to-transparent dark:from-[#25D366]/20 dark:via-emerald-950/20 dark:to-transparent border border-[#25D366]/30 shadow-md backdrop-blur-xl specular-rim">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <h3 class="font-heading font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-1">
                  {{ $t('contact.whatsapp.title') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed">
                  {{ $t('contact.whatsapp.description') }}
                </p>
                <a 
                  :href="whatsappLink" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn bg-[#25D366] text-white hover:bg-[#20BA5A] focus:ring-[#25D366] text-xs sm:text-sm px-5 py-2.5 shadow-md hover:shadow-lg shadow-emerald-600/20"
                >
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>{{ $t('contact.whatsapp.cta') }}</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Coverage Map Frame -->
          <div class="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-72 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 relative specular-rim">
            <iframe
              :src="contact.mapUrl.value"
              class="w-full h-full border-0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              :title="`Mapa de ubicación - ${contact.address.value}`"
              :aria-label="`Mapa mostrando ubicación: ${contact.address.value}`"
            ></iframe>

            <!-- Informative badge -->
            <div class="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/95 text-gray-900 dark:text-white border border-slate-200/80 dark:border-slate-700 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center space-x-2 text-xs font-semibold z-10">
              <MapPinIcon class="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
              <span>{{ contact.address.value }}</span>
            </div>

            <!-- Visual pin marker centered over map -->
            <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <MapPinIcon class="w-8 h-8 text-red-500 drop-shadow-md" />
            </div>
          </div>
        </div>

        <!-- Quick Contact Form (Right Column) -->
        <div class="animate-fade-in-up animation-delay-200">
          <div class="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-white/[0.08] shadow-2xl dark:shadow-black/70 backdrop-blur-2xl specular-rim">
            <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white mb-6 tracking-tight">
              {{ $t('contact.form.title') }}
            </h3>
            
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div>
                <label for="name" class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('contact.form.name') }} *
                </label>
                <input 
                  id="name"
                  v-model="form.name"
                  type="text" 
                  required
                  class="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-cyan-500/15 focus:border-primary dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 outline-none text-sm"
                  :placeholder="$t('contact.form.namePlaceholder')"
                />
              </div>

              <div>
                <label for="phone" class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('contact.form.phone') }} *
                </label>
                <input 
                  id="phone"
                  v-model="form.phone"
                  type="tel" 
                  required
                  class="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-cyan-500/15 focus:border-primary dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 outline-none text-sm"
                  :placeholder="$t('contact.form.phonePlaceholder')"
                />
              </div>

              <div>
                <label for="service" class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('contact.form.service') }}
                </label>
                <select 
                  id="service"
                  v-model="form.service"
                  class="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/60 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 dark:focus:ring-cyan-500/15 focus:border-primary dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 outline-none text-sm cursor-pointer"
                >
                  <option value="">{{ $t('contact.form.servicePlaceholder') }}</option>
                  <option :value="$t('services.list[0].title')">{{ $t('services.list[0].title') }}</option>
                  <option :value="$t('services.list[1].title')">{{ $t('services.list[1].title') }}</option>
                  <option :value="$t('services.list[2].title')">{{ $t('services.list[2].title') }}</option>
                  <option :value="$t('services.list[3].title')">{{ $t('services.list[3].title') }}</option>
                </select>
              </div>

              <div>
                <label for="message" class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('contact.form.message') }} *
                </label>
                <textarea 
                  id="message"
                  v-model="form.message"
                  required
                  rows="4"
                  class="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-cyan-500/15 focus:border-primary dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 outline-none text-sm resize-none"
                  :placeholder="$t('contact.form.messagePlaceholder')"
                ></textarea>
              </div>

              <button 
                type="submit"
                class="btn btn-primary w-full h-14 text-base font-semibold shadow-xl flex items-center justify-center gap-2"
              >
                <span>{{ $t('contact.form.submit') }}</span>
                <PaperAirplaneIcon class="w-4 h-4 ml-1" />
              </button>

              <p class="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed pt-1">
                {{ $t('contact.form.policyPrefix') }}
                <NuxtLink :to="localePath('/privacy')" class="text-primary dark:text-cyan-400 underline hover:text-primary-600 dark:hover:text-cyan-300 font-medium transition-colors">
                  {{ $t('footer.privacyPolicy') }}
                </NuxtLink>
                {{ $t('contact.form.policyAnd') }}
                <NuxtLink :to="localePath('/terms')" class="text-primary dark:text-cyan-400 underline hover:text-primary-600 dark:hover:text-cyan-300 font-medium transition-colors">
                  {{ $t('footer.termsConditions') }}
                </NuxtLink>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  MapPinIcon,
  ArrowRightIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const localePath = useLocalePath()
const contact = useContact()

const contactInfo = computed(() => [
  {
    title: t('contact.info[0].title'),
    description: t('contact.info[0].description'),
    icon: PhoneIcon,
    value: contact.phone.value,
    link: contact.telLink.value,
    linkText: t('contact.info[0].linkText'),
    external: false
  },
  {
    title: t('contact.info[1].title'),
    description: t('contact.info[1].description'),
    icon: EnvelopeIcon,
    value: contact.email.value,
    link: contact.mailtoLink.value,
    linkText: t('contact.info[1].linkText'),
    external: false
  },
  {
    title: t('contact.info[2].title'),
    description: t('contact.info[2].description'),
    icon: ClockIcon,
    value: t('contact.info[2].value'),
    link: '',
    linkText: '',
    external: false
  }
])

const form = ref({
  name: '',
  phone: '',
  service: '',
  message: ''
})

const whatsappLink = computed(() => {
  return contact.getWhatsAppLink(String(t('contact.whatsappMessage') || ''))
})

const handleSubmit = () => {
  const message = `${t('contact.HelloIAm')} ${form.value.name}. ${form.value.message}. ${t('contact.myPhone')} ${form.value.phone}${form.value.service ? `. ${t('contact.imInterestedIn')} ${form.value.service}.` : ''}`
  const whatsappUrl = contact.getWhatsAppLink(message)
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  
  // Reset form
  form.value = {
    name: '',
    phone: '',
    service: '',
    message: ''
  }
}
</script>