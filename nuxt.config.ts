// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  css: [
    '~/assets/css/main.css',
    'aos/dist/aos.css'
  ],

  typescript: {
    strict: true
  },

  piniaPluginPersistedstate: {
    storage: 'localStorage'
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      contactEmail: process.env.NUXT_PUBLIC_CONTACT_EMAIL || 'info@netandsoft.com.ve',
      contactPhone: process.env.NUXT_PUBLIC_CONTACT_PHONE || '+58 414-478-5215',
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '584144785215',
      locationAddress: process.env.NUXT_PUBLIC_LOCATION_ADDRESS || '27 C. Muñoz, San Fernando de Apure 7001, Apure.',
      mapLatitude: process.env.NUXT_PUBLIC_MAP_LATITUDE || '7.8921750877067645',
      mapLongitude: process.env.NUXT_PUBLIC_MAP_LONGITUDE || '-67.46952135309213',
      mapCoordinates: process.env.NUXT_PUBLIC_MAP_COORDINATES || '',
      mapZoom: process.env.NUXT_PUBLIC_MAP_ZOOM || '13'
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      meta: [
        { name: 'theme-color', content: '#022B3A', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#020617', media: '(prefers-color-scheme: dark)' }
      ]
    }
  },
  site: {
    url: 'https://netandsoft.com.ve',
    name: 'Net And Soft Solutions',
    description: 'Soluciones tecnológicas integrales en Venezuela. Desarrollo de software a medida, instalación y mantenimiento de redes, sistemas de videovigilancia CCTV y soporte técnico profesional 24/7.',
    defaultLocale: 'en'
  },

  seo: {
    redirectToCanonicalSiteUrl: false
  },

  sitemap: {
    strictNuxtContentPaths: true,
    autoLastmod: true,
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' }
    ],
    defaults: {
      changefreq: 'weekly',
      priority: 0.8
    }
  },

  routeRules: {
    '/': { sitemap: { priority: 1.0, changefreq: 'weekly' } },
    '/privacy': { sitemap: { priority: 0.5, changefreq: 'monthly' } },
    '/terms': { sitemap: { priority: 0.5, changefreq: 'monthly' } },
    '/sitemap': { sitemap: { priority: 0.7, changefreq: 'monthly' } }
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
