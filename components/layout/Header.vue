<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300" :class="{ 'shadow-md': scrolled }">
    <nav class="container-custom">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-3 group">
          <img src="/logo.svg" alt="Net & Soft Solutions Logo" class="h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
           <NuxtLink
             v-for="item in navItems"
             :key="item.nameKey"
             :to="item.href"
             class="text-gray-700 hover:text-primary font-medium transition-colors duration-300 relative group"
           >
             {{ $t(item.nameKey) }}
             <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
           </NuxtLink>

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

           <!-- Language Switcher -->
           <select
             :value="locale"
             @change="$event => navigateTo(switchLocalePath(($event.target as HTMLSelectElement).value as 'es' | 'en'))"
             class="ml-4 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white"
           >
             <option value="es">ES</option>
             <option value="en">EN</option>
           </select>
         </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          aria-label="Toggle menu"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-100">
           <div class="flex flex-col space-y-4">
             <NuxtLink
               v-for="item in navItems"
               :key="item.nameKey"
               :to="item.href"
               @click="mobileMenuOpen = false"
               class="text-gray-700 hover:text-primary font-medium transition-colors duration-300 py-2"
             >
               {{ $t(item.nameKey) }}
             </NuxtLink>

             <!-- Mobile Language Switcher -->
             <select
               :value="locale"
               @change="$event => { navigateTo(switchLocalePath(($event.target as HTMLSelectElement).value as 'es' | 'en')); mobileMenuOpen = false; }"
               class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white text-center"
             >
               <option value="es">ES</option>
               <option value="en">EN</option>
             </select>

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

const { locale } = useI18n()

const mobileMenuOpen = ref(false)
const scrolled = ref(false)

const switchLocalePath = useSwitchLocalePath()

const navItems = [
  { nameKey: 'header.navItems.home', href: '#inicio' },
  { nameKey: 'header.navItems.services', href: '#servicios' },
  { nameKey: 'header.navItems.about', href: '#nosotros' },
  { nameKey: 'header.navItems.contact', href: '#contacto' }
]

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