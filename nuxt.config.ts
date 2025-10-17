// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxtjs/i18n'
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    }
  },
  vite: {
    server: {
      allowedHosts: ['better-kiwis-shine.loca.lt'],
    }
  },
  site: {
    url: 'https://netandsoft.com.ve',
    name: 'Net And Soft Solutions',
    description: 'Soluciones tecnológicas integrales en Venezuela. Desarrollo de software a medida, instalación y mantenimiento de redes, sistemas de videovigilancia CCTV y soporte técnico profesional 24/7.',
    defaultLocale: 'En'
  },

  seo: {
    redirectToCanonicalSiteUrl: true
  },

  sitemap: {
    strictNuxtContentPaths: true
  },

  robots: {
    allow: '/',
    sitemap: '/sitemap.xml'
  },

  image: {
    quality: 80,
    formats: ['webp', 'jpg', 'png']
  },

  i18n: {
    // Use langDir + lazy loading. `file` must be the filename (not full path)
    // to avoid duplication like `i18n/locales/i18n/locales/...` in generated imports.
    locales: [
      { code: 'es', name: 'Español', iso: 'es-ES', file: 'es.json' },
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    baseUrl: 'https://netandsoft.com.ve',
    // langDir should be relative to the i18n module folder. Using 'i18n/locales/'
    // caused the module to produce 'i18n/i18n/locales/...'. Use 'locales/' instead.
    langDir: 'locales/'
  }
})
