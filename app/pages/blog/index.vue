<script setup lang="ts">
const { locale } = useI18n()

// TODO: replace with useFetch('/api/articles') in Phase 3
const allPosts = [
  { tag: 'STRATEGY', title: "Why your MVP doesn't need blockchain", excerpt: "Most Web3 projects I turn down could ship with a database and a PDF.", date: 'April 12, 2026', read: '6 min' },
  { tag: 'TECH', title: 'Nuxt 3 + NestJS: the combo I recommend to SMEs', excerpt: "One language, one ecosystem, a velocity few stacks match at this level of maturity.", date: 'March 28, 2026', read: '9 min' },
  { tag: 'FREELANCE', title: 'The ideal client brief (and how to get it)', excerpt: "Three questions I ask before every quote to clear up 80% of misunderstandings.", date: 'March 5, 2026', read: '4 min' },
  { tag: 'TECH', title: 'React Native in production: what actually breaks', excerpt: "Three years of shipped mobile apps and the list of traps I still see senior teams fall into.", date: 'February 18, 2026', read: '11 min' },
  { tag: 'STRATEGY', title: 'Estimating a project: the 3-scenario method', excerpt: "Why I refuse \"gut-feel\" quotes and how I present a number that survives scope creep.", date: 'February 2, 2026', read: '7 min' },
  { tag: 'FREELANCE', title: 'Invoicing in CFA, euros, or stablecoin?', excerpt: "My current arbitrage to live in Cotonou and invoice three currency zones without losing 8% per transfer.", date: 'January 14, 2026', read: '5 min' },
]

const activeFilter = ref('all')

const allTags = computed(() => {
  const tags = new Set(allPosts.map(p => p.tag))
  return ['all', ...Array.from(tags)]
})

const visiblePosts = computed(() =>
  activeFilter.value === 'all'
    ? allPosts
    : allPosts.filter(p => p.tag === activeFilter.value),
)

const filterAllLabel = computed(() => locale.value === 'fr' ? 'TOUS' : 'ALL')
</script>

<template>
  <div class="content">
    <header class="page-top">
      <div class="section-label">
        <span>{{ $t('blog.pageLabel') }}</span>
        <span class="rule" />
      </div>
      <AppReveal>
        <h1 class="page-h">{{ $t('blog.pageHeading') }}</h1>
        <p class="page-sub">{{ $t('blog.pageSubtitle') }}</p>
      </AppReveal>
    </header>

    <!-- Tag filter row -->
    <AppReveal>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--border)">
        <button
          v-for="tag in allTags"
          :key="tag"
          class="chip"
          :style="{
            cursor: 'pointer',
            borderColor: activeFilter === tag ? 'var(--orange)' : 'var(--border)',
            color: activeFilter === tag ? 'var(--orange)' : 'var(--text)',
            background: 'var(--main-bg)',
          }"
          @click="activeFilter = tag"
        >
          {{ tag === 'all' ? filterAllLabel : tag }}
        </button>
      </div>
    </AppReveal>

    <!-- Blog rows -->
    <div class="blog-list">
      <AppReveal
        v-for="(post, i) in visiblePosts"
        :key="`${activeFilter}-${i}`"
        :delay="(i % 3) * 40"
      >
        <BlogRow
          :tag="post.tag"
          :title="post.title"
          :excerpt="post.excerpt"
          :date="post.date"
          :read="post.read"
        />
      </AppReveal>
    </div>
  </div>
</template>
