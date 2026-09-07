<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
    <LayoutHeader />

    <main class="pt-28 pb-20">
      <div class="container-custom max-w-5xl">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
          <NuxtLink :to="localePath('/')" class="hover:text-primary dark:hover:text-cyan-400 transition-colors">
            {{ $t('legal.common.backToHome') }}
          </NuxtLink>
          <span>/</span>
          <span class="text-gray-900 dark:text-white font-semibold">
            {{ $t('legal.terms.title') }}
          </span>
        </nav>

        <!-- Hero Header -->
        <header class="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-cyan-950/30 dark:via-slate-900 dark:to-slate-950 border border-primary/20 dark:border-cyan-500/20 shadow-sm">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/15 dark:bg-cyan-500/20 text-primary dark:text-cyan-300 mb-5 border border-primary/20 dark:border-cyan-500/30">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{{ $t('legal.terms.badge') }}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {{ $t('legal.terms.title') }}
            </h1>

            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {{ $t('legal.terms.subtitle') }}
            </p>

            <div class="inline-flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-slate-900/80 px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm">
              <svg class="w-4 h-4 text-primary dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ $t('legal.common.lastUpdated') }}: {{ $t('legal.common.effectiveDate') }}</span>
            </div>
          </div>
        </header>

        <!-- Introductory Card -->
        <div class="card p-6 sm:p-8 mb-10 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm rounded-2xl">
          <p class="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
            {{ $t('legal.terms.intro') }}
          </p>
        </div>

        <!-- Sections List -->
        <div class="space-y-6">
          <article
            v-for="section in termsSections"
            :key="section.number"
            class="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200/70 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl"
          >
            <div class="flex items-start gap-4 sm:gap-6">
              <span class="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 dark:bg-cyan-500/15 text-primary dark:text-cyan-400 font-bold font-mono text-sm border border-primary/20 dark:border-cyan-500/30">
                {{ section.number }}
              </span>
              <div class="flex-1 min-w-0">
                <h2 class="text-lg sm:text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                  {{ section.title }}
                </h2>
                <div class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line space-y-2">
                  {{ section.content }}
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Help & Contact Box -->
        <div class="mt-14 rounded-2xl p-8 sm:p-10 bg-gradient-to-r from-primary to-primary-700 dark:from-slate-900 dark:to-slate-800 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10 dark:border-slate-700">
          <div class="max-w-xl text-center sm:text-left">
            <h3 class="text-xl sm:text-2xl font-heading font-bold mb-2 text-white">
              {{ $t('legal.common.needHelp') }}
            </h3>
            <p class="text-white/80 text-sm leading-relaxed">
              {{ $t('legal.common.needHelpDesc') }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <NuxtLink
              :to="localePath('/#contact')"
              class="px-5 py-3 rounded-xl bg-white text-primary hover:bg-gray-100 font-semibold text-sm transition-all duration-300 shadow-md"
            >
              {{ $t('legal.common.contactUs') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/')"
              class="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all duration-300 border border-white/20"
            >
              {{ $t('legal.common.backToHome') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <LayoutFooter />
    <LayoutWhatsAppButton />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()
const localePath = useLocalePath()

const termsSections = computed(() => {
  const raw = t('legal.terms.sections', { returnObjects: true })
  return Array.isArray(raw) ? raw : []
})

useHead({
  title: `${t('legal.terms.title')} | Net & Soft Solutions`,
  meta: [
    {
      name: 'description',
      content: t('legal.terms.subtitle')
    },
    {
      property: 'og:title',
      content: `${t('legal.terms.title')} | Net & Soft Solutions`
    },
    {
      property: 'og:description',
      content: t('legal.terms.subtitle')
    },
    {
      name: 'robots',
      content: 'index, follow'
    }
  ]
})
</script>
