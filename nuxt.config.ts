// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/seo',
    '@nuxt/image'
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'es'
      }
    }
  },
  vite: {
    server: {
      allowedHosts: ['better-kiwis-shine.loca.lt'],
    },
  },
  site: {
    url: 'https://netandsoftsolutions.com.ve',
    name: 'Net And Soft Solutions',
    description: 'Servicios médicos profesionales a domicilio. Consultas generales, procedimientos médicos y ecografías. Atención de calidad en la comodidad de tu hogar.',
    defaultLocale: 'es'
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
  }
})
