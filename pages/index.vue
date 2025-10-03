<template>
  <div>
    <LayoutHeader />
    <main>
      <SectionsHeroSection />
      <SectionsServicesSection />
      <SectionsAboutSection />
      <SectionsContactSection />
    </main>
    <LayoutFooter />
    <LayoutWhatsAppButton />
  </div>
</template>

<script setup lang="ts">
// SEO Configuration
useHead({
  title: 'Net And Soft Solutions | Desarrollo de Software, Redes, CCTV y Soporte Técnico',
  meta: [
    {
      name: 'description',
      content: 'Soluciones tecnológicas integrales en Venezuela. Desarrollo de software a medida, instalación y mantenimiento de redes, sistemas de videovigilancia CCTV y soporte técnico profesional 24/7.'
    },
    {
      name: 'keywords',
      content: 'desarrollo de software, desarrollo web, aplicaciones móviles, redes informáticas, instalación de redes, CCTV, cámaras de seguridad, videovigilancia, soporte técnico, mantenimiento informático, soluciones tecnológicas, infraestructura IT, seguridad informática, Net And Soft Solutions, Venezuela'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Net And Soft Solutions | Desarrollo de Software, Redes, CCTV y Soporte Técnico'
    },
    {
      property: 'og:description',
      content: 'Soluciones tecnológicas integrales: desarrollo de software, redes, CCTV y soporte técnico profesional. Transformamos tu negocio con tecnología de vanguardia.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://netandsoft.com.ve'
    },
    {
      property: 'og:image',
      content: 'https://netandsoft.com.ve/og-image.jpg'
    },
    {
      property: 'og:locale',
      content: 'es_VE'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Net And Soft Solutions | Desarrollo de Software, Redes, CCTV y Soporte Técnico'
    },
    {
      name: 'twitter:description',
      content: 'Soluciones tecnológicas integrales: desarrollo de software, redes, CCTV y soporte técnico profesional.'
    },
    {
      name: 'twitter:image',
      content: 'https://netandsoft.com.ve/og-image.jpg'
    },
    // Additional Meta Tags
    {
      name: 'author',
      content: 'Net And Soft Solutions'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    {
      name: 'language',
      content: 'Spanish'
    },
    {
      name: 'geo.region',
      content: 'VE'
    },
    {
      name: 'geo.placename',
      content: 'Venezuela'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://netandsoft.com.ve'
    }
  ],
  htmlAttrs: {
    lang: 'es'
  }
})

// Structured Data (JSON-LD) for SEO
useSchemaOrg([
  {
    '@type': 'ProfessionalService',
    '@id': 'https://netandsoft.com.ve',
    name: 'Net And Soft Solutions',
    description: 'Empresa de soluciones tecnológicas especializada en desarrollo de software, infraestructura de redes, sistemas de videovigilancia CCTV y soporte técnico profesional.',
    url: 'https://netandsoft.com.ve',
    logo: 'https://netandsoft.com.ve/logo.svg',
    image: 'https://netandsoft.com.ve/og-image.jpg',
    telephone: '+58-414-478-5215',
    email: 'info@netandsoft.com.ve',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'VE',
      addressLocality: 'Venezuela'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '08:00',
      closes: '18:00'
    },
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'Venezuela'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios Tecnológicos',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Desarrollo de Software',
            description: 'Desarrollo de aplicaciones web, móviles y software a medida para empresas. Soluciones personalizadas con tecnologías modernas.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Infraestructura de Redes',
            description: 'Diseño, instalación y mantenimiento de redes informáticas. Cableado estructurado, configuración de routers y switches.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sistemas CCTV',
            description: 'Instalación y configuración de sistemas de videovigilancia. Cámaras IP, DVR/NVR y monitoreo remoto.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Soporte Técnico',
            description: 'Soporte técnico profesional para equipos, redes y sistemas. Mantenimiento preventivo y correctivo.'
          }
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1'
    }
  },
  {
    '@type': 'WebSite',
    '@id': 'https://netandsoft.com.ve/#website',
    url: 'https://netandsoft.com.ve',
    name: 'Net And Soft Solutions',
    description: 'Soluciones Tecnológicas Integrales - Desarrollo de Software, Redes, CCTV y Soporte Técnico',
    publisher: {
      '@id': 'https://netandsoft.com.ve'
    },
    inLanguage: 'es-VE'
  },
  {
    '@type': 'Organization',
    '@id': 'https://netandsoft.com.ve/#organization',
    name: 'Net And Soft Solutions',
    url: 'https://netandsoft.com.ve',
    logo: {
      '@type': 'ImageObject',
      url: 'https://netandsoft.com.ve/logo.svg'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+58-414-478-5215',
      contactType: 'customer service',
      availableLanguage: ['Spanish'],
      areaServed: 'VE'
    },
    sameAs: [
      'https://www.facebook.com/netandsoftsolutions',
      'https://www.instagram.com/netandsoftsolutions'
    ]
  }
])
</script>