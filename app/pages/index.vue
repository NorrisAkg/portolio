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

// TODO: replace with useFetch('/api/articles?limit=3') in Phase 3
const blogPosts = [
  { tag: 'STRATEGY', title: "Why your MVP doesn't need blockchain", excerpt: "Most Web3 projects I turn down could ship with a database and a PDF.", date: 'April 12, 2026', read: '6 min' },
  { tag: 'TECH', title: 'Nuxt 3 + NestJS: the combo I recommend to SMEs', excerpt: "One language, one ecosystem, a velocity few stacks match at this level of maturity.", date: 'March 28, 2026', read: '9 min' },
  { tag: 'FREELANCE', title: 'The ideal client brief (and how to get it)', excerpt: "Three questions I ask before every quote to clear up 80% of misunderstandings.", date: 'March 5, 2026', read: '4 min' },
]
</script>

<template>
  <div class="content">

    <!-- HERO -->
    <section id="home" class="section hero-v2">
      <div class="hero-text">
        <AppReveal>
          <h1 class="headline">
            {{ $t('home.headlineA') }} <em>{{ $t('home.headlineB') }}</em> {{ $t('home.headlineC') }}
          </h1>
        </AppReveal>
        <AppReveal :delay="80">
          <p class="lede">{{ $t('home.lede') }}</p>
        </AppReveal>
        <AppReveal :delay="140">
          <div class="cta-row">
            <a href="#contact" class="btn btn-primary">
              {{ $t('home.ctaPrimary') }} <span class="arr">
                <AppIcon name="arrow" />
              </span>
            </a>
            <NuxtLink :to="localePath('/projects')" class="btn btn-secondary">
              {{ $t('home.ctaSecondary') }}
            </NuxtLink>
          </div>
          <div class="trust">
            <template v-for="(_, i) in 3" :key="i">
              <span v-if="i > 0" class="sep" />
              <span>{{ $t(`home.trust${i}`) }}</span>
            </template>
          </div>
        </AppReveal>
      </div>
      <AppReveal :delay="120">
        <HeroPortrait />
      </AppReveal>
    </section>

    <!-- ABOUT -->
    <section id="about" class="section">
      <div class="section-label">
        <span>{{ $t('about.label') }}</span>
        <span class="rule" />
      </div>
      <AppReveal>
        <h2 class="about-h">{{ $t('about.heading') }}</h2>
      </AppReveal>
      <div class="about-grid">
        <AppReveal>
          <div class="about-prose">
            <p>{{ $t('about.p1') }}</p>
            <div class="pull">« {{ $t('about.pull') }} »</div>
            <p>{{ $t('about.p2') }}</p>
            <p>{{ $t('about.p3') }}</p>
          </div>
        </AppReveal>
        <AppReveal :delay="120">
          <div class="aside-stack">
            <div class="aside-card">
              <div class="lbl">{{ $t('about.statsExpLabel') }}</div>
              <div class="val">4+</div>
              <div class="desc">{{ $t('about.statsExpDesc') }}</div>
            </div>
            <div class="aside-card">
              <div class="lbl">{{ $t('about.statsDelivLabel') }}</div>
              <div class="val">22</div>
              <div class="desc">{{ $t('about.statsDelivDesc') }}</div>
            </div>
            <div class="aside-card">
              <div class="lbl">{{ $t('about.statsRefLabel') }}</div>
              <div class="val">70%</div>
              <div class="desc">{{ $t('about.statsRefDesc') }}</div>
            </div>

            <a class="cv-card" href="/cv-norris-akogbede.pdf" download>
              <span class="left">
                <span class="ic">
                  <AppIcon name="download" />
                </span>
                <span class="meta">
                  <span class="lbl">{{ $t('about.cvLabel') }}</span>
                  <span class="ttl">{{ $t('about.cvTitle') }}</span>
                </span>
              </span>
              <span class="right">{{ $t('about.cvSize') }}</span>
            </a>

            <div class="stack-block">
              <div class="stack-lbl">{{ $t('about.stackPrimaryLabel') }}</div>
              <div class="stack-row">
                <span class="chip">Nuxt 4</span>
                <span class="chip">NestJS</span>
                <span class="chip">React Native</span>
                <span class="chip">PostgreSQL</span>
                <span class="chip">TypeScript</span>
              </div>
              <div class="stack-lbl">{{ $t('about.stackWeb3Label') }}</div>
              <div class="stack-row">
                <span class="chip accent">Solidity</span>
                <span class="chip accent">Ethers.js</span>
                <span class="chip accent">Polygon</span>
              </div>
            </div>
          </div>
        </AppReveal>
      </div>
    </section>

    <!-- PROJECTS — first 3 -->
    <section id="projects" class="section">
      <div class="section-label">
        <span>{{ $t('projects.sectionLabel') }}</span>
        <span class="rule" />
      </div>
      <AppReveal>
        <h2 class="proj-h">{{ $t('projects.sectionHeading') }}</h2>
        <p class="proj-sub">{{ $t('projects.sectionSubtitle') }}</p>
      </AppReveal>
      <div class="projects">
        <AppReveal v-for="(p, i) in projects" :key="i" :delay="i * 60">
          <ProjectCard
:name="p.name" :year="p.year" :dur="p.dur" :problem="p.problem" :bullets="p.bullets"
            :tone="p.tone" :label="p.label" :reverse="i % 2 === 1" :read-case-label="$t('projects.readCase')"
            :to="localePath('/projects')" />
        </AppReveal>
      </div>
      <AppReveal>
        <NuxtLink :to="localePath('/projects')" class="see-more">
          {{ $t('projects.seeAll') }} <span class="ar">
            <AppIcon name="arrow" />
          </span>
        </NuxtLink>
      </AppReveal>
    </section>

    <!-- BLOG — first 3 -->
    <section id="blog" class="section">
      <div class="section-label">
        <span>{{ $t('blog.sectionLabel') }}</span>
        <span class="rule" />
      </div>
      <AppReveal>
        <h2 class="blog-h">{{ $t('blog.sectionHeading') }}</h2>
        <p class="blog-sub">{{ $t('blog.sectionSubtitle') }}</p>
      </AppReveal>
      <div class="blog-grid">
        <AppReveal v-for="(b, i) in blogPosts" :key="i" :delay="i * 60">
          <BlogCard
:tag="b.tag" :title="b.title" :excerpt="b.excerpt" :date="b.date" :read="b.read"
            :to="localePath('/blog')" />
        </AppReveal>
      </div>
      <AppReveal>
        <NuxtLink :to="localePath('/blog')" class="see-more">
          {{ $t('blog.seeAll') }} <span class="ar">
            <AppIcon name="arrow" />
          </span>
        </NuxtLink>
      </AppReveal>
    </section>

  </div>
</template>
