<template>
  <footer class="relative bg-gradient-to-b from-[#021F2A] via-primary-900 to-[#01141B] dark:from-slate-950 dark:via-[#070c16] dark:to-black text-white border-t border-white/10 dark:border-slate-800/80 transition-colors duration-300 overflow-hidden">
    <!-- Ambient subtle background glow -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-0"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-0"></div>

    <div class="container-custom py-16 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        <!-- Company Info -->
        <div class="space-y-5">
          <img src="/logo.svg" alt="Net & Soft Solutions" width="180" height="64" loading="lazy" decoding="async" class="h-12 w-auto brightness-0 invert transition-transform duration-300 hover:scale-105" />
          <p class="text-slate-300 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
            {{ $t('footer.description') }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-heading font-bold text-base uppercase tracking-wider mb-5 text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            {{ $t('footer.quickLinks') }}
          </h3>
          <ul class="space-y-3">
            <li v-for="item in quickLinks" :key="item.name">
              <NuxtLink 
                :to="item.href" 
                class="text-slate-300 dark:text-slate-400 hover:text-cyan-300 dark:hover:text-cyan-400 transition-all duration-200 text-sm inline-flex items-center group"
              >
                <span class="w-0 group-hover:w-2 h-0.5 bg-cyan-400 transition-all duration-200 mr-0 group-hover:mr-2 rounded-full"></span>
                <span>{{ item.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h3 class="font-heading font-bold text-base uppercase tracking-wider mb-5 text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            {{ $t('footer.services') }}
          </h3>
          <ul class="space-y-3">
            <li v-for="service in services" :key="service">
              <span class="text-slate-300 dark:text-slate-400 text-sm flex items-start leading-snug">
                <CheckCircleIcon class="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0 text-cyan-400 opacity-80" />
                <span>{{ service }}</span>
              </span>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="font-heading font-bold text-base uppercase tracking-wider mb-5 text-white flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            {{ $t('footer.contact') }}
          </h3>
          <ul class="space-y-3.5">
            <li class="flex items-start text-slate-300 dark:text-slate-400 text-sm group">
              <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/10 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 transition-colors">
                <PhoneIcon class="w-4 h-4 text-cyan-400" />
              </div>
              <a :href="contact.telLink.value" class="mt-1 font-mono text-xs sm:text-sm hover:text-cyan-400 transition-colors">{{ contact.phone.value }}</a>
            </li>
            <li class="flex items-start text-slate-300 dark:text-slate-400 text-sm group">
              <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/10 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 transition-colors">
                <EnvelopeIcon class="w-4 h-4 text-cyan-400" />
              </div>
              <a :href="contact.mailtoLink.value" class="mt-1 break-all text-xs sm:text-sm hover:text-cyan-400 transition-colors">{{ contact.email.value }}</a>
            </li>
            <li class="flex items-start text-slate-300 dark:text-slate-400 text-sm group">
              <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 flex-shrink-0 border border-white/10 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 transition-colors">
                <ClockIcon class="w-4 h-4 text-cyan-400" />
              </div>
              <span class="mt-1 text-xs sm:text-sm">{{ $t('footer.Schedule') }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10 dark:border-slate-800/80 mt-14 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
        <p class="text-slate-400 text-xs sm:text-sm order-2 lg:order-1 text-center lg:text-left">
          © {{ currentYear }} {{ $t('footer.copyright') }}
        </p>

        <!-- Legal & Sitemap Links -->
        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-slate-300/80 order-1 lg:order-2">
          <NuxtLink
            :to="localePath('/privacy')"
            class="hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
          >
            {{ $t('footer.privacyPolicy') }}
          </NuxtLink>
          <span class="text-white/20">•</span>
          <NuxtLink
            :to="localePath('/terms')"
            class="hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
          >
            {{ $t('footer.termsConditions') }}
          </NuxtLink>
          <span class="text-white/20">•</span>
          <NuxtLink
            :to="localePath('/sitemap')"
            class="hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
          >
            {{ $t('footer.sitemap') }}
          </NuxtLink>
        </div>

        <div class="flex items-center space-x-3 order-3">
          <a href="https://www.facebook.com/netandsoftsolutions" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200 hover:scale-105" aria-label="Facebook">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/netandsoftsolutions" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200 hover:scale-105" aria-label="Instagram">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-all duration-200 hover:scale-105" aria-label="WhatsApp">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon } from '@heroicons/vue/20/solid'

const { t } = useI18n()
const currentYear = new Date().getFullYear()
const localePath = useLocalePath()

const quickLinks = computed(() => [
  { name: t('header.navItems.home'), href: localePath('/#home') },
  { name: t('footer.services'), href: localePath('/#services') },
  { name: t('footer.about'), href: localePath('/#about') },
  { name: t('footer.contact'), href: localePath('/#contact') }
])

const services = computed(() => [
  t('services.list[0].title'),
  t('services.list[1].title'),
  t('services.list[2].title'),
  t('services.list[3].title')
])

const contact = useContact()

const whatsappLink = computed(() => {
  return contact.getWhatsAppLink(String(t('footer.whatsappMessage') || ''))
})
</script>