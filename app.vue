<template>
  <div class="overflow-x-hidden min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <NuxtPage />
    <ClientOnly>
      <BackToTopButton />
    </ClientOnly>
  </div>
</template>

<style>
html, body {
  max-width: 100%;
  overflow-x: hidden;
}

html.dark {
  color-scheme: dark;
}
</style>

<script setup lang="ts">
// Global CSS import
import '~/assets/css/main.css'
import 'aos/dist/aos.css'
import BackToTopButton from '~/components/layout/BackToTopButton.vue'

// Default SEO Configuration for the entire app
useHead({
  titleTemplate: (titleChunk: string | undefined) => {
    return titleChunk ? `${titleChunk}` : 'Net And Soft Solutions | Desarrollo de Software, Redes, CCTV y Soporte Técnico'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { 
      name: 'description', 
      content: 'Soluciones tecnológicas integrales en Venezuela. Desarrollo de software a medida, instalación y mantenimiento de redes, sistemas de videovigilancia CCTV y soporte técnico profesional 24/7.' 
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Net And Soft Solutions' },
    { property: 'og:locale', content: 'es_VE' },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
  ],
  script: [
    {
      children: `(function() {
        try {
          var stored = localStorage.getItem('theme') || localStorage.getItem('vueuse-color-scheme');
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (stored === 'dark' || (stored === 'auto' && prefersDark) || (!stored && prefersDark)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {}
      })();`,
      tagPosition: 'head'
    }
  ],
  htmlAttrs: {
    lang: 'es'
  }
})

const { initTheme } = useTheme()
onMounted(() => {
  initTheme()
})
</script>
