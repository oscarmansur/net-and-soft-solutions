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
        <header class="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-cyan-950/30 dark:via-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-white/10 shadow-lg specular-rim">
          <div class="max-w-3xl relative z-10">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/15 dark:bg-cyan-500/20 text-primary dark:text-cyan-300 mb-5 border border-primary/20 dark:border-cyan-500/30 shadow-sm backdrop-blur-md">
              <QueueListIcon class="w-4 h-4" />
              <span>{{ $t('sitemapPage.badge') }}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 text-balance">
              {{ $t('sitemapPage.title') }}
            </h1>

            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-normal">
              {{ $t('sitemapPage.subtitle') }}
            </p>

            <div class="inline-flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
              <span>{{ $t('sitemapPage.xmlNotice') }}</span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-primary dark:text-cyan-400 hover:underline font-bold"
              >
                <span>{{ $t('sitemapPage.xmlLink') }}</span>
                <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </header>

        <!-- Sitemap Categories Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <!-- Category 1: Main Pages -->
          <div class="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm hover:shadow-xl dark:hover:shadow-cyan-950/20 hover:border-primary/30 dark:hover:border-cyan-500/30 transition-all duration-300 rounded-2xl flex flex-col justify-between specular-rim backdrop-blur-xl">
            <div>
              <div class="flex items-center gap-3.5 mb-5">
                <div class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200/60 dark:border-cyan-500/30 flex items-center justify-center shadow-sm">
                  <HomeIcon class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-xl font-heading font-bold text-gray-900 dark:text-white tracking-tight">
                    {{ $t('sitemapPage.categories.main.title') }}
                  </h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-normal">
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
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
                        {{ link.desc }}
                      </p>
                    </div>
                    <span class="text-xs text-gray-400 group-hover:text-primary dark:group-hover:text-cyan-400 font-mono flex-shrink-0 mt-0.5 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
                      {{ link.path }} &rarr;
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- Category 2: Specialized Services -->
          <div class="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm hover:shadow-xl dark:hover:shadow-cyan-950/20 hover:border-primary/30 dark:hover:border-cyan-500/30 transition-all duration-300 rounded-2xl flex flex-col justify-between specular-rim backdrop-blur-xl">
            <div>
              <div class="flex items-center gap-3.5 mb-5">
                <div class="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/30 flex items-center justify-center shadow-sm">
                  <CodeBracketIcon class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-xl font-heading font-bold text-gray-900 dark:text-white tracking-tight">
                    {{ $t('sitemapPage.categories.services.title') }}
                  </h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-normal">
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
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
                        {{ link.desc }}
                      </p>
                    </div>
                    <span class="text-xs text-gray-400 group-hover:text-primary dark:group-hover:text-cyan-400 font-mono flex-shrink-0 mt-0.5 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
                      {{ link.path }} &rarr;
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- Category 3: Legal & Policies -->
          <div class="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm hover:shadow-xl dark:hover:shadow-cyan-950/20 hover:border-primary/30 dark:hover:border-cyan-500/30 transition-all duration-300 rounded-2xl flex flex-col justify-between specular-rim backdrop-blur-xl">
            <div>
              <div class="flex items-center gap-3.5 mb-5">
                <div class="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/30 flex items-center justify-center shadow-sm">
                  <ShieldCheckIcon class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-xl font-heading font-bold text-gray-900 dark:text-white tracking-tight">
                    {{ $t('sitemapPage.categories.legal.title') }}
                  </h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-normal">
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
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
                        {{ link.desc }}
                      </p>
                    </div>
                    <span class="text-xs text-gray-400 group-hover:text-primary dark:group-hover:text-cyan-400 font-mono flex-shrink-0 mt-0.5 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
                      {{ link.path }} &rarr;
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- Category 4: Direct Channels & Assistance -->
          <div class="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm hover:shadow-xl dark:hover:shadow-cyan-950/20 hover:border-primary/30 dark:hover:border-cyan-500/30 transition-all duration-300 rounded-2xl flex flex-col justify-between specular-rim backdrop-blur-xl">
            <div>
              <div class="flex items-center gap-3.5 mb-5">
                <div class="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/30 flex items-center justify-center shadow-sm">
                  <ChatBubbleLeftRightIcon class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-xl font-heading font-bold text-gray-900 dark:text-white tracking-tight">
                    {{ $t('sitemapPage.categories.contact.title') }}
                  </h2>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-normal">
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
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-normal">
                        {{ link.desc }}
                      </p>
                    </div>
                    <ArrowTopRightOnSquareIcon class="w-4 h-4 text-gray-400 group-hover:text-primary dark:group-hover:text-cyan-400 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Help & Support Call to Action -->
        <div class="mt-14 rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-primary via-primary-700 to-secondary-800 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10 specular-rim">
          <div class="max-w-xl text-center sm:text-left">
            <h3 class="text-xl sm:text-2xl font-heading font-extrabold mb-2 text-white">
              {{ $t('legal.common.needHelp') }}
            </h3>
            <p class="text-white/80 text-sm leading-relaxed font-normal">
              {{ $t('legal.common.needHelpDesc') }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <NuxtLink
              :to="localePath('/#contact')"
              class="btn btn-primary h-12 px-5 text-sm shadow-md"
            >
              {{ $t('legal.common.contactUs') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/')"
              class="h-12 inline-flex items-center px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all duration-200 border border-white/20"
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
import {
  QueueListIcon,
  ArrowTopRightOnSquareIcon,
  HomeIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const localePath = useLocalePath()

const contact = useContact()

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
  if (!Array.isArray(raw)) return []
  return (raw as SitemapLinkItem[]).map((item, index) => {
    if (index === 0) {
      return {
        ...item,
        path: contact.getWhatsAppLink()
      }
    }
    if (index === 1) {
      return {
        ...item,
        path: contact.mailtoLink.value,
        desc: contact.email.value
      }
    }
    return item
  })
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
