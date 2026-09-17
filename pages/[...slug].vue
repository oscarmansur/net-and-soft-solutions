<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300 flex flex-col justify-between">
    <LayoutHeader />

    <main class="pt-20 flex-1 flex items-center justify-center">
      <NotFound />
    </main>

    <LayoutFooter />
    <LayoutWhatsAppButton />
  </div>
</template>

<script setup lang="ts">
import NotFound from '~/components/ui/NotFound.vue'

const { t } = useI18n()

// Return official 404 HTTP status code on server-side
if (import.meta.server) {
  setResponseStatus(404)
}

// SEO: instruct crawlers not to index non-existent routes
useHead({
  title: `404 - ${t('notFound.title')} | Net & Soft Solutions`,
  meta: [
    {
      name: 'description',
      content: t('notFound.subtitle')
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})
</script>
