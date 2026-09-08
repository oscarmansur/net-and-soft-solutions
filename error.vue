<template>
  <div class="overflow-x-hidden min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col justify-between">
    <LayoutHeader />

    <main class="pt-20 flex-1 flex items-center justify-center">
      <NotFound :is-error-page="true" />
    </main>

    <LayoutFooter />
    <LayoutWhatsAppButton />
  </div>
</template>

<script setup lang="ts">
import NotFound from '~/components/ui/NotFound.vue'
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

useHead({
  title: `404 - ${t('notFound.title')} | Net & Soft Solutions`,
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
})
</script>
