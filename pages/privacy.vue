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
            {{ $t('legal.privacy.title') }}
          </span>
        </nav>

        <!-- Hero Header -->
        <header class="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-cyan-950/30 dark:via-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-white/10 shadow-lg specular-rim">
          <div class="max-w-3xl relative z-10">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/15 dark:bg-cyan-500/20 text-primary dark:text-cyan-300 mb-5 border border-primary/20 dark:border-cyan-500/30 shadow-sm backdrop-blur-md">
              <ShieldCheckIcon class="w-4 h-4" />
              <span>{{ $t('legal.privacy.badge') }}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 text-balance">
              {{ $t('legal.privacy.title') }}
            </h1>

            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-normal">
              {{ $t('legal.privacy.subtitle') }}
            </p>

            <div class="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <CalendarDaysIcon class="w-4 h-4 text-primary dark:text-cyan-400" />
              <span>{{ $t('legal.common.lastUpdated') }}: {{ $t('legal.common.effectiveDate') }}</span>
            </div>
          </div>
        </header>

        <!-- Introductory Card -->
        <div class="p-6 sm:p-8 mb-10 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm rounded-2xl backdrop-blur-xl specular-rim">
          <p class="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
            {{ $t('legal.privacy.intro') }}
          </p>
        </div>

        <!-- Sections List -->
        <div class="space-y-6">
          <article
            v-for="section in privacySections"
            :key="section.number"
            class="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm hover:shadow-xl dark:hover:shadow-cyan-950/20 hover:border-primary/30 dark:hover:border-cyan-500/30 transition-all duration-300 rounded-2xl specular-rim"
          >
            <div class="flex items-start gap-4 sm:gap-6">
              <span class="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/15 dark:from-cyan-500/20 dark:to-blue-500/20 text-primary dark:text-cyan-400 font-bold font-mono text-sm border border-primary/20 dark:border-cyan-500/30 shadow-sm">
                {{ section.number }}
              </span>
              <div class="flex-1 min-w-0">
                <h2 class="text-lg sm:text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                  {{ section.title }}
                </h2>
                <div class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line space-y-2 font-normal">
                  {{ section.content }}
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Help & Contact Box -->
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
import { ShieldCheckIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline'

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const contact = useContact()

interface PrivacySectionItem {
  number: string
  title: string
  content: string
}

const privacySections = computed<PrivacySectionItem[]>(() => {
  const raw = tm('legal.privacy.sections') as any[]
  if (!Array.isArray(raw)) return []
  return raw.map((section: any) => {
    let content = typeof section.content === 'string'
      ? section.content
      : rt(section.content, {
          email: contact.email.value,
          phone: contact.phone.value
        })

    content = content
      .replace(/\{email\}/g, contact.email.value)
      .replace(/\{phone\}/g, contact.phone.value)
      .replace(/info\{'@'\}netandsoft\.com\.ve/g, contact.email.value)
      .replace(/info@netandsoft\.com\.ve/g, contact.email.value)
      .replace(/\+58\s*414-478-5215/g, contact.phone.value)
    return {
      number: typeof section.number === 'string' ? section.number : rt(section.number),
      title: typeof section.title === 'string' ? section.title : rt(section.title),
      content
    }
  })
})

useHead({
  title: `${t('legal.privacy.title')} | Net & Soft Solutions`,
  meta: [
    {
      name: 'description',
      content: t('legal.privacy.subtitle')
    },
    {
      property: 'og:title',
      content: `${t('legal.privacy.title')} | Net & Soft Solutions`
    },
    {
      property: 'og:description',
      content: t('legal.privacy.subtitle')
    },
    {
      name: 'robots',
      content: 'index, follow'
    }
  ]
})
</script>
