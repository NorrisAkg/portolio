<script setup lang="ts">
import type { ArticleProps, PaginatedResult } from '../../../shared/types/article'

const { locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const { mapArticle } = useArticles()

const LIMIT = 10

// ── Page state (URL-driven) ────────────────────────────────────
const currentPage = computed(() => Math.max(1, Number(route.query.page) || 1))

// ── Fetch (reactive on page change) ───────────────────────────
const { data, pending } = await useFetch<PaginatedResult<ArticleProps>>('/api/articles', {
  query: computed(() => ({ page: currentPage.value, limit: LIMIT })),
  watch: [currentPage],
})

// ── Derived data ───────────────────────────────────────────────
const allPosts = computed(() =>
  (data.value?.data || []).map((item, idx) =>
    mapArticle(item, (currentPage.value - 1) * LIMIT + idx),
  ),
)

const totalPages = computed(() => data.value?.meta?.totalPages ?? 1)
const totalArticles = computed(() => data.value?.meta?.total ?? 0)

// ── Tag filter (resets on page change) ────────────────────────
const activeFilter = ref('all')
watch(currentPage, () => { activeFilter.value = 'all' })

const allTags = computed(() => {
  const tags = new Set(allPosts.value.map(p => p.tag))
  return ['all', ...Array.from(tags)]
})

const visiblePosts = computed(() =>
  activeFilter.value === 'all'
    ? allPosts.value
    : allPosts.value.filter(p => p.tag === activeFilter.value),
)

const filterAllLabel = computed(() => locale.value === 'fr' ? 'TOUS' : 'ALL')

// ── Pagination helpers ─────────────────────────────────────────
const pageNumbers = computed<(number | '…')[]>(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (cur > 3) pages.push('…')
  const start = Math.max(2, cur - 1)
  const end = Math.min(total - 1, cur + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (cur < total - 2) pages.push('…')
  pages.push(total)
  return pages
})

const goToPage = (p: number | '…') => {
  if (typeof p !== 'number') return
  router.push({ query: { ...route.query, page: p === 1 ? undefined : p } })
}
</script>

<template>
  <div class="max-w-[1120px] mx-auto px-12 max-lg:px-8 max-sm:px-5">
    <header class="pt-14">
      <div class="flex items-center gap-4 text-[11px] tracking-[0.18em] uppercase text-muted font-medium mb-7">
        <span>{{ $t('blog.pageLabel') }}</span>
        <span class="flex-1 h-px bg-border max-w-[240px]" />
      </div>
      <AppReveal>
        <h1 class="font-['Montserrat'] font-bold text-[48px] leading-[1.1] text-navy dark:text-[#E8ECF5] m-0 mb-4 tracking-[-0.02em] max-w-[18ch] max-lg:text-[40px] max-sm:text-[32px]">{{ $t('blog.pageHeading') }}</h1>
        <p class="text-[18px] text-muted max-w-[55ch] m-0 mb-12 leading-[1.55]">{{ $t('blog.pageSubtitle') }}</p>
      </AppReveal>
    </header>

    <!-- Tag filter row -->
    <AppReveal>
      <div class="flex flex-wrap gap-2 mb-6 pb-6 border-b border-border">
        <button
          v-for="tag in allTags"
          :key="tag"
          class="text-xs px-2.5 py-1.5 rounded-full border font-medium tracking-[0.01em] bg-white dark:bg-[#0A0F1A] transition-[border-color,color] duration-[180ms]"
          :class="activeFilter === tag
            ? 'border-orange text-orange'
            : 'border-border text-[#2D2D2D] dark:text-[#E8EAEE]'"
          @click="activeFilter = tag"
        >
          {{ tag === 'all' ? filterAllLabel : tag }}
        </button>
      </div>
    </AppReveal>

    <!-- Loading skeleton -->
    <div v-if="pending" class="flex flex-col gap-0">
      <div
        v-for="i in LIMIT"
        :key="i"
        class="py-7 border-b border-border flex flex-col gap-3 animate-pulse"
      >
        <div class="h-3 w-16 rounded bg-border" />
        <div class="h-5 w-3/4 rounded bg-border" />
        <div class="h-4 w-1/2 rounded bg-border" />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="visiblePosts.length === 0"
      class="py-24 flex flex-col items-center gap-4 text-center"
    >
      <span class="font-['JetBrains_Mono'] text-[40px] text-border select-none">∅</span>
      <p class="text-muted text-[15px]">
        {{ locale === 'fr' ? 'Aucun article pour le moment.' : 'No articles yet.' }}
      </p>
    </div>

    <!-- Blog rows -->
    <div v-else>
      <AppReveal
        v-for="(post, i) in visiblePosts"
        :key="`${currentPage}-${activeFilter}-${post.slug}`"
        :delay="(i % 3) * 40"
      >
        <BlogRow
          :tag="post.tag"
          :title="post.title"
          :excerpt="post.excerpt"
          :date="post.date"
          :read="post.read"
          :to="localePath(`/blog/${post.slug}`)"
        />
      </AppReveal>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1 && !pending" class="flex items-center justify-between mt-12 pb-16 gap-4 flex-wrap">
      <!-- Counter -->
      <span class="font-['JetBrains_Mono'] text-[11px] tracking-[0.08em] text-muted uppercase">
        {{ locale === 'fr'
          ? `Page ${currentPage} sur ${totalPages} · ${totalArticles} articles`
          : `Page ${currentPage} of ${totalPages} · ${totalArticles} articles` }}
      </span>

      <!-- Page numbers -->
      <nav class="flex items-center gap-1" aria-label="Pagination">
        <!-- Prev -->
        <button
          :disabled="currentPage === 1"
          class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted transition-[border-color,color,opacity] duration-[180ms] hover:border-navy hover:text-navy dark:hover:border-white dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          :aria-label="locale === 'fr' ? 'Page précédente' : 'Previous page'"
          @click="goToPage(currentPage - 1)"
        >
          <AppIcon name="arrow" class="w-3.5 h-3.5 rotate-180" />
        </button>

        <!-- Numbered pages -->
        <template v-for="p in pageNumbers" :key="String(p)">
          <button
            v-if="p !== '…'"
            class="w-9 h-9 rounded-lg border font-['JetBrains_Mono'] text-[13px] font-medium transition-[border-color,color,background] duration-[180ms]"
            :class="p === currentPage
              ? 'border-orange bg-orange/10 text-orange'
              : 'border-border text-muted hover:border-navy hover:text-navy dark:hover:border-white dark:hover:text-white'"
            :aria-current="p === currentPage ? 'page' : undefined"
            @click="goToPage(p)"
          >
            {{ p }}
          </button>
          <span
            v-else
            class="w-9 h-9 flex items-center justify-center text-muted font-['JetBrains_Mono'] text-sm select-none"
          >…</span>
        </template>

        <!-- Next -->
        <button
          :disabled="currentPage === totalPages"
          class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted transition-[border-color,color,opacity] duration-[180ms] hover:border-navy hover:text-navy dark:hover:border-white dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          :aria-label="locale === 'fr' ? 'Page suivante' : 'Next page'"
          @click="goToPage(currentPage + 1)"
        >
          <AppIcon name="arrow" class="w-3.5 h-3.5" />
        </button>
      </nav>
    </div>

    <!-- Spacer when single page -->
    <div v-else class="pb-16" />
  </div>
</template>

