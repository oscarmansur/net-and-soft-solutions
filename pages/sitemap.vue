<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
    <LayoutHeader />

    <main class="pt-28 pb-20">
      <div class="container-custom max-w-6xl">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
          <NuxtLink :to="localePath('/')" class="hover:text-primary dark:hover:text-cyan-400 transition-colors">
            {{ $t('legal.common.backToHome') }}
          </NuxtLink>
          <span>/</span>
          <span class="text-gray-900 dark:text-white font-semibold">
            {{ $t('sitemapPage.title') }}
          </span>
        </nav>

        <!-- Hero Header -->
        <header class="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-cyan-950/30 dark:via-slate-900 dark:to-slate-950 border border-primary/20 dark:border-cyan-500/20 shadow-sm">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/15 dark:bg-cyan-500/20 text-primary dark:text-cyan-300 mb-5 border border-primary/20 dark:border-cyan-500/30">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>{{ $t('sitemapPage.badge') }}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {{ $t('sitemapPage.title') }}
            </h1>

            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {{ $t('sitemapPage.subtitle') }}
            </p>

            <div class="inline-flex flex-wrap items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
              <span>{{ $t('sitemapPage.xmlNotice') }}</span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-primary dark:text-cyan-400 hover:underline font-semibold"
              >
                <span>{{ $t('sitemapPage.xmlLink') }}</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </header>

        <!-- Sitemap Categories Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <!-- Category 1: Main Pages -->
          <div class="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shadow-sm">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    {{ $t('sitemapPage.categories.main.title') }}
                  </h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('sitemapPage.categories.main.description') }}
                  </p>
                </div>
              </div>

              <ul class="divide-y divide-gray-100 dark:divide-slate-800/80">
                <li v-for="link in mainLinks" :key="link.name" class="py-3.5 first:pt-2 last:pb-0">
                  <NuxtLink
                    :to="localePath(link.path)"
                    class="group flex items-start justify-between gap-3 text-sm hover:text-primary dark:hover:text-cyan-400 transition-colors"
                  >
                    <div>
                      <span class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                        {{ link.name }}
                      </span>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {{ link.desc }}
                      </p>
                    </div>
                    <span class="text-xs text-gray-400 group-hover:text-primary dark:group-hover:text-cyan-400 font-mono flex-shrink-0 mt-0.5">
                      {{ link.path }} &rarr;
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- Category 2: Specialized Services -->
          <div class="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    {{ $t('sitemapPage.categories.services.title') }}
                  </h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('sitemapPage.categories.services.description') }}
                  </p>
                </div>
              </div>

              <ul class="divide-y divide-gray-100 dark:divide-slate-800/80">
                <li v-for="link in servicesLinks" :key="link.name" class="py-3.5 first:pt-2 last:pb-0">
                  <NuxtLink
                    :to="localePath(link.path)"
                    class="group flex items-start justify-between gap-3 text-sm hover:text-primary dark:hover:text-cyan-400 transition-colors"
                  >
                    <div>
                      <span class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                        {{ link.name }}
                      </span>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {{ link.desc }}
                      </p>
                    </div>
                    <span class="text-xs text-gray-400 group-hover:text-primary dark:group-hover:text-cyan-400 font-mono flex-shrink-0 mt-0.5">
                      {{ link.path }} &rarr;
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- Category 3: Legal & Policies -->
          <div class="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    {{ $t('sitemapPage.categories.legal.title') }}
                  </h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('sitemapPage.categories.legal.description') }}
                  </p>
                </div>
              </div>

              <ul class="divide-y divide-gray-100 dark:divide-slate-800/80">
                <li v-for="link in legalLinks" :key="link.name" class="py-3.5 first:pt-2 last:pb-0">
                  <NuxtLink
                    :to="localePath(link.path)"
                    class="group flex items-start justify-between gap-3 text-sm hover:text-primary dark:hover:text-cyan-400 transition-colors"
                  >
                    <div>
                      <span class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                        {{ link.name }}
                      </span>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {{ link.desc }}
                      </p>
                    </div>
                    <span class="text-xs text-gray-400 group-hover:text-primary dark:group-hover:text-cyan-400 font-mono flex-shrink-0 mt-0.5">
                      {{ link.path }} &rarr;
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- Category 4: Direct Channels & Assistance -->
          <div class="card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-heading font-bold text-gray-900 dark:text-white">
                    {{ $t('sitemapPage.categories.contact.title') }}
                  </h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('sitemapPage.categories.contact.description') }}
                  </p>
                </div>
              </div>

              <ul class="divide-y divide-gray-100 dark:divide-slate-800/80">
                <li v-for="link in contactLinks" :key="link.name" class="py-3.5 first:pt-2 last:pb-0">
                  <a
                    :href="link.path"
                    :target="link.external ? '_blank' : undefined"
                    :rel="link.external ? 'noopener noreferrer' : undefined"
                    class="group flex items-start justify-between gap-3 text-sm hover:text-primary dark:hover:text-cyan-400 transition-colors"
                  >
                    <div>
                      <span class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                        {{ link.name }}
                      </span>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {{ link.desc }}
                      </p>
                    </div>
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-primary dark:group-hover:text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Help & Support Call to Action -->
        <div class="rounded-2xl p-8 sm:p-10 bg-gradient-to-r from-primary to-primary-700 dark:from-slate-900 dark:to-slate-800 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10 dark:border-slate-700">
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

interface SitemapLinkItem {
  name: string
  path: string
  desc: string
  external?: boolean
}

const mainLinks = computed<SitemapLinkItem[]>(() => {
  const raw = t('sitemapPage.categories.main.links', { returnObjects: true })
  return Array.isArray(raw) ? raw : []
})

const servicesLinks = computed<SitemapLinkItem[]>(() => {
  const raw = t('sitemapPage.categories.services.links', { returnObjects: true })
  return Array.isArray(raw) ? raw : []
})

const legalLinks = computed<SitemapLinkItem[]>(() => {
  const raw = t('sitemapPage.categories.legal.links', { returnObjects: true })
  return Array.isArray(raw) ? raw : []
})

const contactLinks = computed<SitemapLinkItem[]>(() => {
  const raw = t('sitemapPage.categories.contact.links', { returnObjects: true })
  return Array.isArray(raw) ? raw : []
})

useHead({
  title: `${t('sitemapPage.title')} | Net & Soft Solutions`,
  meta: [
    {
      name: 'description',
      content: t('sitemapPage.subtitle')
    },
    {
      property: 'og:title',
      content: `${t('sitemapPage.title')} | Net & Soft Solutions`
    },
    {
      property: 'og:description',
      content: t('sitemapPage.subtitle')
    },
    {
      name: 'robots',
      content: 'index, follow'
    }
  ]
})
</script>
