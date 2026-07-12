<script setup lang="ts">
const { locale } = useI18n()

useSeoMeta({
  title: computed(() => locale.value === 'fr'
    ? 'Projets — Études de cas et missions livrées'
    : 'Projects — Case studies and delivered missions'),
  description: computed(() => locale.value === 'fr'
    ? 'Une sélection de missions Web2 et Web3, de la définition du besoin business jusqu\'à la mise en production.'
    : 'A selection of Web2 and Web3 projects, from business requirement to production delivery.'),
  ogTitle: computed(() => locale.value === 'fr'
    ? 'Projets de Norris Akogbede — Études de cas'
    : 'Norris Akogbede\'s Projects — Case Studies'),
  ogDescription: computed(() => locale.value === 'fr'
    ? 'Marketplace agricole, app de fidélité, tokenisation immobilière, back-office SaaS — des projets qui ont un impact business mesurable.'
    : 'Agricultural marketplace, loyalty app, real estate tokenization, SaaS back-office — projects with measurable business impact.'),
  ogUrl: computed(() => `https://norrisakogbede.com${locale.value === 'en' ? '/en' : ''}/projects`),
})

const { getProjectsList } = useProjects()
const { projects } = await getProjectsList()
</script>

<template>
  <div class="max-w-[1120px] mx-auto px-12 max-lg:px-8 max-sm:px-5">
    <header class="pt-14">
      <div class="flex items-center gap-4 text-[11px] tracking-[0.18em] uppercase text-muted font-medium mb-7">
        <span>{{ $t('projects.pageLabel') }}</span>
        <span class="flex-1 h-px bg-border max-w-[240px]" />
      </div>
      <AppReveal>
        <h1 class="font-['Montserrat'] font-bold text-[48px] leading-[1.1] text-navy dark:text-[#E8ECF5] m-0 mb-4 tracking-[-0.02em] max-w-[18ch] max-lg:text-[40px] max-sm:text-[32px]">{{ $t('projects.pageHeading') }}</h1>
        <p class="text-[18px] text-muted max-w-[55ch] m-0 mb-12 leading-[1.55]">{{ $t('projects.pageSubtitle') }}</p>
      </AppReveal>
    </header>

    <div class="flex flex-col gap-16 pb-16">
      <AppReveal v-for="(p, i) in projects" :key="i" :delay="(i % 3) * 60">
        <ProjectCard
          :name="p.name"
          :year="p.year"
          :dur="p.dur"
          :problem="p.problem"
          :bullets="p.bullets"
          :tone="p.tone"
          :label="p.label"
          :reverse="i % 2 === 1"
          :read-case-label="$t('projects.readCase')"
        />
      </AppReveal>
    </div>
  </div>
</template>
