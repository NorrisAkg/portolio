<script setup lang="ts">
import { listArticles, type Locale } from '~/utils/articles'

const { locale } = useI18n()
const localePath = useLocalePath()

// TODO: replace with useFetch('/api/articles') in Phase 3
const allPosts = computed(() => listArticles(locale.value as Locale))

const activeFilter = ref('all')

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
        :key="`${activeFilter}-${post.slug}`"
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
  </div>
</template>
