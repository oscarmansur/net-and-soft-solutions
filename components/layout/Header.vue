<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800/80 shadow-sm transition-all duration-300" :class="{ 'shadow-md dark:shadow-slate-900/50': scrolled }">
    <nav class="container-custom">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center space-x-3 group">
          <img src="/logo.svg" alt="Net & Soft Solutions Logo" class="h-12 w-auto transition-all duration-300 group-hover:scale-105 dark:brightness-0 dark:invert" />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
           <template v-for="item in navItems" :key="item.nameKey">
             <!-- Services with Mega Dropdown -->
             <ServicesDropdown
               v-if="item.nameKey === 'header.navItems.services'"
               :services-href="item.href"
               :whatsapp-link="whatsappLink"
             />

             <!-- Regular Nav Links -->
             <NuxtLink
               v-else
               :to="item.href"
               class="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-cyan-400 font-medium transition-colors duration-300 relative group py-1 text-sm"
             >
               {{ $t(item.nameKey) }}
               <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
             </NuxtLink>
           </template>

           <a
             :href="whatsappLink"
             target="_blank"
             rel="noopener noreferrer"
             class="btn btn-primary"
           >
             <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
             </svg>
             {{ $t('header.contact') }}
           </a>

           <!-- Language Selector Dropdown -->
           <LanguageSelector />

           <!-- Theme Toggle Button -->
           <ThemeToggle />
         </div>

        <!-- Mobile Menu Controls (Toggle + Menu Button) -->
        <div class="flex items-center space-x-2 md:hidden">
          <ThemeToggle />

          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950">
           <div class="flex flex-col space-y-3">
             <template v-for="item in navItems" :key="item.nameKey">
               <!-- Mobile Services with expandable list -->
               <div v-if="item.nameKey === 'header.navItems.services'" class="flex flex-col">
                 <div class="flex items-center justify-between py-2">
                   <NuxtLink
                     :to="item.href"
                     @click="mobileMenuOpen = false"
                     class="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-cyan-400 font-medium transition-colors duration-300"
                   >
                     {{ $t(item.nameKey) }}
                   </NuxtLink>
                   <button
                     type="button"
                     @click="mobileServicesExpanded = !mobileServicesExpanded"
                     class="p-1.5 text-gray-500 hover:text-primary dark:hover:text-cyan-400 transition-colors"
                     aria-label="Expandir servicios"
                   >
                     <svg class="w-4 h-4 transform transition-transform duration-200" :class="{ 'rotate-180': mobileServicesExpanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                     </svg>
                   </button>
                 </div>
                 <!-- Mobile services list -->
                 <div v-if="mobileServicesExpanded" class="pl-4 pb-2 space-y-2 border-l-2 border-primary/20 dark:border-cyan-500/20 ml-2">
                   <NuxtLink
                     :to="localePath('/#services')"
                     @click="mobileMenuOpen = false"
                     class="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-cyan-400 py-1"
                   >
                     • {{ $t('services.list.0.title') }}
                   </NuxtLink>
                   <NuxtLink
                     :to="localePath('/#services')"
                     @click="mobileMenuOpen = false"
                     class="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-cyan-400 py-1"
                   >
                     • {{ $t('services.list.1.title') }}
                   </NuxtLink>
                   <NuxtLink
                     :to="localePath('/#services')"
                     @click="mobileMenuOpen = false"
                     class="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-cyan-400 py-1"
                   >
                     • {{ $t('services.list.2.title') }}
                   </NuxtLink>
                   <NuxtLink
                     :to="localePath('/#services')"
                     @click="mobileMenuOpen = false"
                     class="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-cyan-400 py-1"
                   >
                     • {{ $t('services.list.3.title') }}
                   </NuxtLink>
                 </div>
               </div>

               <NuxtLink
                 v-else
                 :to="item.href"
                 @click="mobileMenuOpen = false"
                 class="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-cyan-400 font-medium transition-colors duration-300 py-2"
               >
                 {{ $t(item.nameKey) }}
               </NuxtLink>
             </template>

             <!-- Mobile Language Switcher -->
             <div class="pt-1">
               <LanguageSelector :full-width="true" @change="mobileMenuOpen = false" />
             </div>

             <a
               :href="whatsappLink"
               target="_blank"
               rel="noopener noreferrer"
               class="btn btn-primary w-full justify-center"
             >
               <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
               </svg>
               {{ $t('header.contactWhatsApp') }}
             </a>
           </div>
         </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ThemeToggle from '~/components/ui/ThemeToggle.vue'
import LanguageSelector from '~/components/ui/LanguageSelector.vue'
import ServicesDropdown from '~/components/layout/ServicesDropdown.vue'

const { locale } = useI18n()

const mobileMenuOpen = ref(false)
const mobileServicesExpanded = ref(false)
const scrolled = ref(false)

const localePath = useLocalePath()

const navItems = computed(() => [
  { nameKey: 'header.navItems.home', href: localePath('/#home') },
  { nameKey: 'header.navItems.services', href: localePath('/#services') },
  { nameKey: 'header.navItems.about', href: localePath('/#about') },
  { nameKey: 'header.navItems.contact', href: localePath('/#contact') }
])

const whatsappLink = computed(() => {
  const phone = '584144785215'
  const message = encodeURIComponent($t('header.whatsappMessage'))
  return `https://wa.me/${phone}?text=${message}`
})

// Handle scroll effect
onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 20
  }
  
  window.addEventListener('scroll', handleScroll)
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>