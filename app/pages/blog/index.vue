<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const { getArticlesList } = useArticles()
const { articles } = await getArticlesList()

const allPosts = computed(() => articles.value)

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

    <!-- Blog rows -->
    <div>
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
