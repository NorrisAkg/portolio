<script setup lang="ts">
const localePath = useLocalePath()

// TODO: replace with useFetch('/api/projects?featured=true') in Phase 3
const projects = [
  {
    year: '2025', dur: '8w', name: 'Agricultural marketplace — Benin',
    problem: 'Connecting 400+ producers directly to urban buyers, no middlemen.',
    bullets: [['TECH', 'Nuxt 3 · NestJS · PostgreSQL · Stripe'], ['OUTCOME', '+38% average margin for producers'], ['DURATION', '8 weeks · MVP → production']] as [string, string][],
    label: 'MARKETPLACE_AGRO_BJ_2025.PNG', tone: 'warm' as const,
  },
  {
    year: '2024', dur: '5w', name: 'Mobile loyalty app — Cotonou',
    problem: 'Replacing an unreadable paper-card system with a simple, fast app.',
    bullets: [['TECH', 'React Native · NestJS · Firebase'], ['OUTCOME', '+62% retention in 3 months'], ['DURATION', '5 weeks · 8 partner stores']] as [string, string][],
    label: 'APP_FIDELITE_COT_2024.PNG', tone: 'cool' as const,
  },
  {
    year: '2025', dur: '12w', name: 'Tokenization platform — Web3',
    problem: 'Fractionalising real-estate ownership for the diaspora.',
    bullets: [['TECH', 'Solidity · Nuxt 3 · Ethers.js · Polygon'], ['OUTCOME', '4 assets tokenised · €312K raised'], ['DURATION', '12 weeks · external audit included']] as [string, string][],
    label: 'TOKENISATION_RWA_2025.PNG', tone: 'navy' as const,
  },
]

const { getArticlesList } = useArticles()
const { articles } = await getArticlesList({ limit: 3 })
const blogPosts = computed(() => articles.value)
</script>

<template>
  <div class="max-w-[1120px] mx-auto px-12 max-lg:px-8 max-sm:px-5">

    <!-- ── HERO ─────────────────────────────────────────────── -->
    <section id="home" class="grid grid-cols-[1.1fr_1fr] grid-rows-[auto_1fr] gap-16 items-start pt-[88px] pb-24 max-lg:pt-16 max-lg:pb-[72px] max-sm:flex max-sm:flex-col max-sm:gap-6 max-sm:pt-8 max-sm:pb-12">
      <div class="col-start-1 row-start-1 max-sm:col-start-auto max-sm:row-start-auto">
        <AppReveal>
          <h1 class="font-['Montserrat'] font-bold text-[60px] leading-[1.08] tracking-[-0.025em] text-navy dark:text-[#E8ECF5] m-0 mb-6 max-w-[14ch] text-balance max-lg:text-[48px] max-sm:text-[36px]">
            {{ $t('home.headlineA') }} <em class="not-italic text-orange font-bold">{{ $t('home.headlineB') }}</em> {{ $t('home.headlineC') }}
          </h1>
        </AppReveal>
        <AppReveal :delay="80">
          <p class="text-xl leading-[1.55] text-muted max-w-[38ch] m-0 mb-9">{{ $t('home.lede') }}</p>
        </AppReveal>
      </div>

      <AppReveal class="col-start-2 row-start-1 row-span-2 self-center justify-self-end max-sm:col-start-auto max-sm:row-start-auto max-sm:row-span-1" :delay="120">
        <HeroPortrait />
      </AppReveal>

      <div class="col-start-1 row-start-2 max-sm:col-start-auto max-sm:row-start-auto">
        <AppReveal :delay="140">
          <div class="flex flex-wrap gap-3 items-center mb-7 max-sm:[&>a]:flex-1 max-sm:[&>a]:justify-center">
            <a
              href="#contact"
              class="inline-flex items-center gap-2.5 h-12 px-[22px] rounded-[10px] text-[15px] font-medium bg-navy text-white border border-transparent transition-[transform,box-shadow] duration-[180ms] hover:shadow-[0_10px_24px_-10px_rgba(27,42,74,0.55)] hover:-translate-y-px dark:text-[#0A0F1A]"
            >
              {{ $t('home.ctaPrimary') }} <span class="transition-transform duration-200 group-hover:translate-x-1"><AppIcon name="arrow" /></span>
            </a>
            <NuxtLink
              :to="localePath('/projects')"
              class="inline-flex items-center gap-2.5 h-12 px-[22px] rounded-[10px] text-[15px] font-medium bg-transparent text-navy border border-navy transition-[background,color] duration-[180ms] hover:bg-navy hover:text-white dark:text-[#E8ECF5] dark:hover:text-[#0A0F1A]"
            >
              {{ $t('home.ctaSecondary') }}
            </NuxtLink>
          </div>
          <div class="flex flex-wrap gap-2 items-center">
            <span v-for="(_, i) in 3" :key="i" class="inline-flex items-center gap-1.5 border border-border rounded-full px-2.5 py-1.5 text-[11px] text-muted leading-none before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-orange before:flex-shrink-0">
              {{ $t(`home.trust${i}`) }}
            </span>
          </div>
        </AppReveal>
      </div>
    </section>

    <!-- ── ABOUT ───────────────────────────────────────────── -->
    <section id="about" class="py-[72px] pb-24 border-t border-border max-sm:py-10 max-sm:pb-14">
      <div class="flex items-center gap-4 text-[11px] tracking-[0.18em] uppercase text-muted font-medium mb-7">
        <span><span class="font-['JetBrains_Mono'] text-orange text-[10px] tracking-[0.12em] font-medium mr-1">02</span> — {{ $t('about.label') }}</span>
        <span class="flex-1 h-px bg-border max-w-[240px]" />
      </div>
      <AppReveal>
        <h2 class="font-['Montserrat'] font-bold text-[32px] leading-[1.2] text-navy dark:text-[#E8ECF5] m-0 mb-7 max-w-[22ch] tracking-[-0.015em]">{{ $t('about.heading') }}</h2>
      </AppReveal>
      <div class="grid grid-cols-[1.5fr_1fr] gap-16 items-start max-sm:grid-cols-1 max-sm:gap-8">
        <AppReveal>
          <div>
            <p class="text-[17px] leading-[1.7] text-[#2D2D2D] dark:text-[#E8EAEE] m-0 mb-[18px] max-w-[55ch]">{{ $t('about.p1') }}</p>
            <blockquote class="border-l-[3px] border-orange pl-5 py-1.5 my-6 italic text-[18px] leading-[1.5] text-navy dark:text-[#E8ECF5] max-w-[48ch]">« {{ $t('about.pull') }} »</blockquote>
            <p class="text-[17px] leading-[1.7] text-[#2D2D2D] dark:text-[#E8EAEE] m-0 mb-[18px] max-w-[55ch]">{{ $t('about.p2') }}</p>
            <p class="text-[17px] leading-[1.7] text-[#2D2D2D] dark:text-[#E8EAEE] m-0 mb-[18px] max-w-[55ch]">{{ $t('about.p3') }}</p>
          </div>
        </AppReveal>
        <AppReveal :delay="120">
          <div class="flex flex-col gap-2 mt-2 max-sm:grid max-sm:grid-cols-3">
            <!-- Stat cards -->
            <div
v-for="stat in [
              { lbl: $t('about.statsExpLabel'), val: '4+', desc: $t('about.statsExpDesc') },
              { lbl: $t('about.statsDelivLabel'), val: '22', desc: $t('about.statsDelivDesc') },
              { lbl: $t('about.statsRefLabel'), val: '70%', desc: $t('about.statsRefDesc') },
            ]" :key="stat.val" class="border border-border rounded-xl p-[18px_20px] bg-sidebar dark:bg-[#0F1626] max-sm:col-span-1">
              <div class="text-[11px] tracking-[0.16em] uppercase text-muted mb-1.5 font-medium">{{ stat.lbl }}</div>
              <div class="font-['Montserrat'] font-bold text-[28px] text-orange leading-none tracking-[-0.02em] max-sm:text-[22px]">{{ stat.val }}</div>
              <div class="text-[13px] text-muted mt-1.5">{{ stat.desc }}</div>
            </div>

            <!-- CV download -->
            <a
              class="flex items-center justify-between gap-4 border border-border rounded-xl p-[16px_18px] bg-white dark:bg-[#0A0F1A] transition-[border-color,transform] duration-200 hover:border-navy hover:-translate-y-px mt-1.5 max-sm:col-span-3"
              href="/cv-norris-akogbede.pdf"
              download
            >
              <span class="flex items-center gap-3 min-w-0">
                <span class="w-[38px] h-[38px] rounded-lg flex-shrink-0 bg-orange-tint text-orange flex items-center justify-center">
                  <AppIcon name="download" class="w-[18px] h-[18px]" />
                </span>
                <span class="flex flex-col leading-[1.2] min-w-0">
                  <span class="text-[11px] tracking-[0.16em] uppercase text-muted font-medium mb-[3px]">{{ $t('about.cvLabel') }}</span>
                  <span class="font-['Montserrat'] font-bold text-sm text-navy dark:text-[#E8ECF5] tracking-[-0.01em]">{{ $t('about.cvTitle') }}</span>
                </span>
              </span>
              <span class="font-['JetBrains_Mono'] text-[10px] tracking-[0.1em] text-muted uppercase whitespace-nowrap">{{ $t('about.cvSize') }}</span>
            </a>

            <!-- Stack -->
            <div class="mt-2 max-sm:col-span-3">
              <div class="text-[11px] tracking-[0.16em] uppercase text-muted mt-3.5 mb-2 font-medium">{{ $t('about.stackPrimaryLabel') }}</div>
              <div class="flex flex-wrap gap-1.5">
                <span
v-for="tech in ['Nuxt 4', 'NestJS', 'React Native', 'PostgreSQL', 'TypeScript']" :key="tech"
                  class="text-xs px-2.5 py-1.5 rounded-full border border-border text-[#2D2D2D] dark:text-[#E8EAEE] bg-white dark:bg-[#0A0F1A] font-medium tracking-[0.01em]">{{ tech }}</span>
              </div>
              <div class="text-[11px] tracking-[0.16em] uppercase text-muted mt-3.5 mb-2 font-medium">{{ $t('about.stackWeb3Label') }}</div>
              <div class="flex flex-wrap gap-1.5">
                <span
v-for="tech in ['Solidity', 'Ethers.js', 'Polygon']" :key="tech"
                  class="text-xs px-2.5 py-1.5 rounded-full border border-orange text-orange bg-white dark:bg-[#0A0F1A] font-medium tracking-[0.01em]">{{ tech }}</span>
              </div>
            </div>
          </div>
        </AppReveal>
      </div>
    </section>

    <!-- ── PROJECTS ────────────────────────────────────────── -->
    <section id="projects" class="py-[72px] pb-24 border-t border-border max-sm:py-10 max-sm:pb-14">
      <div class="flex items-center gap-4 text-[11px] tracking-[0.18em] uppercase text-muted font-medium mb-7">
        <span><span class="font-['JetBrains_Mono'] text-orange text-[10px] tracking-[0.12em] font-medium mr-1">03</span> — {{ $t('projects.sectionLabel') }}</span>
        <span class="flex-1 h-px bg-border max-w-[240px]" />
      </div>
      <AppReveal>
        <h2 class="font-['Montserrat'] font-bold text-[32px] leading-[1.2] text-navy dark:text-[#E8ECF5] m-0 mb-2 tracking-[-0.015em]">{{ $t('projects.sectionHeading') }}</h2>
        <p class="text-[17px] text-muted m-0 mb-12 max-w-[55ch]">{{ $t('projects.sectionSubtitle') }}</p>
      </AppReveal>
      <div class="flex flex-col gap-20">
        <AppReveal v-for="(p, i) in projects" :key="i" :delay="i * 60">
          <ProjectCard
            :name="p.name" :year="p.year" :dur="p.dur" :problem="p.problem" :bullets="p.bullets"
            :tone="p.tone" :label="p.label" :reverse="i % 2 === 1" :read-case-label="$t('projects.readCase')"
            :to="localePath('/projects')" />
        </AppReveal>
      </div>
      <AppReveal>
        <NuxtLink
          :to="localePath('/projects')"
          class="inline-flex items-center gap-2 mt-10 text-navy dark:text-[#E8ECF5] font-medium text-[15px] border-b border-transparent pb-0.5 transition-[gap,border-color,color] duration-200 hover:gap-3 hover:border-navy hover:text-orange"
        >
          {{ $t('projects.seeAll') }} <span class="transition-transform duration-200"><AppIcon name="arrow" /></span>
        </NuxtLink>
      </AppReveal>
    </section>

    <!-- ── BLOG ───────────────────────────────────────────── -->
    <section id="blog" class="py-[72px] pb-24 border-t border-border max-sm:py-10 max-sm:pb-14">
      <div class="flex items-center gap-4 text-[11px] tracking-[0.18em] uppercase text-muted font-medium mb-7">
        <span><span class="font-['JetBrains_Mono'] text-orange text-[10px] tracking-[0.12em] font-medium mr-1">04</span> — {{ $t('blog.sectionLabel') }}</span>
        <span class="flex-1 h-px bg-border max-w-[240px]" />
      </div>
      <AppReveal>
        <h2 class="font-['Montserrat'] font-bold text-[32px] leading-[1.2] text-navy dark:text-[#E8ECF5] m-0 mb-2 tracking-[-0.015em]">{{ $t('blog.sectionHeading') }}</h2>
        <p class="text-[17px] text-muted m-0 mb-9 max-w-[55ch]">{{ $t('blog.sectionSubtitle') }}</p>
      </AppReveal>
      <div class="grid grid-cols-3 gap-[22px] max-sm:grid-cols-1">
        <AppReveal v-for="(b, i) in blogPosts" :key="b.slug" :delay="i * 60">
          <BlogCard
            :tag="b.tag" :title="b.title" :excerpt="b.excerpt" :date="b.date" :read="b.read"
            :to="localePath(`/blog/${b.slug}`)" />
        </AppReveal>
      </div>
      <AppReveal>
        <NuxtLink
          :to="localePath('/blog')"
          class="inline-flex items-center gap-2 mt-10 text-navy dark:text-[#E8ECF5] font-medium text-[15px] border-b border-transparent pb-0.5 transition-[gap,border-color,color] duration-200 hover:gap-3 hover:border-navy hover:text-orange"
        >
          {{ $t('blog.seeAll') }} <span class="transition-transform duration-200"><AppIcon name="arrow" /></span>
        </NuxtLink>
      </AppReveal>
    </section>

  </div>
</template>
