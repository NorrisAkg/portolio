<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()

const slug = computed(() => route.params.slug as string)

const { getArticleBySlug, getArticlesList } = useArticles()

// 1. Fetch current article
const { article } = await getArticleBySlug(slug.value)

// 404 when the slug doesn't match any article
if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

// 2. Fetch all articles to compute navigation (prev, next, related)
const { articles: allPosts } = await getArticlesList()

const related = computed(() => {
  if (!article.value) return []
  const me = article.value
  const others = allPosts.value.filter(p => p.id !== me.id)
  const sameTag = others.filter(p => p.tag === me.tag)
  const rest = others.filter(p => p.tag !== me.tag)
  return [...sameTag, ...rest].slice(0, 3)
})

const prev = computed(() => {
  if (!article.value || allPosts.value.length === 0) return null
  const meIdx = allPosts.value.findIndex(p => p.id === article.value!.id)
  if (meIdx === -1) return null
  const i = (meIdx - 1 + allPosts.value.length) % allPosts.value.length
  return allPosts.value[i]
})

const next = computed(() => {
  if (!article.value || allPosts.value.length === 0) return null
  const meIdx = allPosts.value.findIndex(p => p.id === article.value!.id)
  if (meIdx === -1) return null
  const i = (meIdx + 1) % allPosts.value.length
  return allPosts.value[i]
})

// Scroll spy + progress bar
const activeTOC = ref<string>('')
const progress = ref(0)

const onScroll = () => {
  if (!article.value) return
  const proseEl = document.getElementById('art-prose')
  if (!proseEl) return
  const rect = proseEl.getBoundingClientRect()
  const total = proseEl.offsetHeight
  const passed = Math.max(0, -rect.top)
  const visible = window.innerHeight
  const pct = Math.min(100, Math.max(0, (passed / Math.max(1, total - visible * 0.6)) * 100))
  progress.value = pct

  const firstId = article.value.toc[0]?.id ?? ''
  let current = firstId
  for (const item of article.value.toc) {
    const el = document.getElementById(item.id)
    if (el && el.getBoundingClientRect().top < 140) current = item.id
  }
  activeTOC.value = current
}

onMounted(() => {
  activeTOC.value = article.value?.toc[0]?.id ?? ''
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const scrollToHeading = (id: string, e: Event) => {
  e.preventDefault()
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

// SEO
useHead(() => ({
  title: article.value ? `${article.value.title} — Norris Akogbede` : 'Article',
  meta: article.value
    ? [{ name: 'description', content: article.value.excerpt }]
    : [],
}))
</script>

<template>
  <div v-if="article" class="max-w-[1120px] mx-auto px-12 max-lg:px-8 max-sm:px-5">

    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] tracking-[0.1em] uppercase text-muted pt-10 mb-7" aria-label="breadcrumb">
      <NuxtLink :to="localePath('/')" class="text-muted transition-colors duration-[180ms] hover:text-orange">N.A.</NuxtLink>
      <span class="text-border">/</span>
      <NuxtLink :to="localePath('/blog')" class="text-muted transition-colors duration-[180ms] hover:text-orange">{{ $t('blog.pageLabel') }}</NuxtLink>
      <span class="text-border">/</span>
      <span class="text-navy dark:text-[#E8EAEE]">{{ $t('article.label') }} #{{ String(article.idx + 1).padStart(2, '0') }}</span>
    </nav>

    <!-- Hero -->
    <AppReveal>
      <header class="flex flex-col gap-[18px] pb-10 border-b border-border">
        <div class="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase font-semibold">
          <span class="text-orange">{{ article.tag }}</span>
          <span class="w-[3px] h-[3px] rounded-full bg-muted opacity-50" />
          <span class="text-muted font-medium">{{ article.date }}</span>
          <span class="w-[3px] h-[3px] rounded-full bg-muted opacity-50" />
          <span class="text-muted font-medium font-['JetBrains_Mono'] tracking-[0.08em]">{{ article.read }}</span>
        </div>
        <h1 class="font-['Montserrat'] font-bold text-[52px] leading-[1.08] text-navy dark:text-[#E8ECF5] m-0 tracking-[-0.02em] max-w-[20ch] text-balance max-lg:text-[42px] max-sm:text-[32px]">{{ article.title }}</h1>
        <p class="text-xl leading-[1.55] text-muted m-0 max-w-[56ch]">{{ article.excerpt }}</p>

        <div class="flex items-center gap-3.5 mt-1.5">
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-full overflow-hidden border border-border bg-[#dfe4ec] flex-shrink-0">
              <AppPortrait :size="36" />
            </span>
            <span>
              <span class="font-['Montserrat'] font-bold text-[13px] text-navy dark:text-[#E8ECF5] tracking-[-0.01em] block leading-[1.2]">Norris Akogbede</span>
              <span class="text-[10px] tracking-[0.14em] uppercase text-muted font-medium">{{ $t('article.authorRoleLabel') }}</span>
            </span>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <a class="w-[34px] h-[34px] aspect-square rounded-lg bg-white dark:bg-[#0A0F1A] border border-border flex items-center justify-center text-[#2D2D2D] dark:text-[#E8EAEE] transition-[border-color,transform,color] duration-[180ms] hover:border-navy hover:-translate-y-px hover:text-orange" href="#" aria-label="Share on X"><AppIcon name="x" /></a>
            <a class="w-[34px] h-[34px] aspect-square rounded-lg bg-white dark:bg-[#0A0F1A] border border-border flex items-center justify-center text-[#2D2D2D] dark:text-[#E8EAEE] transition-[border-color,transform,color] duration-[180ms] hover:border-navy hover:-translate-y-px hover:text-orange" href="#" aria-label="Share on LinkedIn"><AppIcon name="linkedin" /></a>
            <a class="w-[34px] h-[34px] aspect-square rounded-lg bg-white dark:bg-[#0A0F1A] border border-border flex items-center justify-center text-[#2D2D2D] dark:text-[#E8EAEE] transition-[border-color,transform,color] duration-[180ms] hover:border-navy hover:-translate-y-px hover:text-orange" href="#" aria-label="Copy link"><AppIcon name="mail" /></a>
          </div>
        </div>
      </header>
    </AppReveal>

    <!-- Cover -->
    <AppReveal :delay="60">
      <div class="my-10 aspect-[16/9] rounded-2xl overflow-hidden border border-border relative">
        <ProjectImage :tone="article.tone" :label="article.cover" class="!aspect-auto w-full h-full !rounded-none !border-0" />
        <span class="absolute top-3.5 right-3.5 font-['JetBrains_Mono'] text-[10px] tracking-[0.14em] text-muted bg-white dark:bg-[#0A0F1A] border border-border px-2 py-1 rounded uppercase">
          {{ $t('article.coverStamp') }} · {{ String(article.idx + 1).padStart(2, '0') }}
        </span>
      </div>
    </AppReveal>

    <!-- Body grid: TOC + Prose -->
    <div class="grid grid-cols-[220px_1fr] gap-16 items-start max-lg:grid-cols-[180px_1fr] max-lg:gap-10 max-sm:grid-cols-1 max-sm:gap-8">

      <!-- TOC -->
      <aside class="sticky top-[96px] flex flex-col gap-3 text-[13px] max-sm:relative max-sm:top-0 max-sm:p-4 max-sm:border max-sm:border-border max-sm:rounded-xl max-sm:bg-sidebar">
        <span class="text-[11px] tracking-[0.18em] uppercase text-muted font-medium pb-3 border-b border-border mb-1">{{ $t('article.toc') }}</span>
        <a
          v-for="(item, i) in article.toc"
          :key="item.id"
          :href="`#${item.id}`"
          class="flex items-start gap-2.5 py-1 leading-[1.45] transition-[color,padding,border-left-color] duration-[180ms] border-l-2 pl-3 -ml-3"
          :class="activeTOC === item.id
            ? 'text-orange border-l-orange'
            : 'text-muted border-l-transparent hover:text-navy'"
          @click="scrollToHeading(item.id, $event)"
        >
          <span
            class="font-['JetBrains_Mono'] text-[10px] tracking-[0.08em] pt-0.5 flex-shrink-0"
            :class="activeTOC === item.id ? 'text-orange' : 'text-muted'"
          >{{ String(i + 1).padStart(2, '0') }}</span>
          <span>{{ item.label }}</span>
        </a>
        <div class="mt-[22px] flex flex-col gap-2 pt-[18px] border-t border-border">
          <span class="text-[10px] tracking-[0.14em] uppercase text-muted font-medium">{{ $t('article.progress') }}</span>
          <span class="h-1 rounded-sm bg-border overflow-hidden">
            <i class="block h-full bg-orange rounded-sm transition-[width] duration-[150ms] linear" :style="{ width: `${progress}%` }" />
          </span>
          <span class="font-['JetBrains_Mono'] text-[11px] text-muted tracking-[0.06em]">{{ Math.round(progress) }}%</span>
        </div>
      </aside>

      <!-- Prose -->
      <article id="art-prose" class="max-w-[64ch] text-[17px] leading-[1.75] text-[#2D2D2D] dark:text-[#E8EAEE]">
        <MDC :value="article.content" class="blog-content" />

        <!-- End-of-article footer -->
        <div class="mt-14 pt-7 border-t border-border flex flex-wrap gap-[18px] items-center justify-between">
          <span class="font-['JetBrains_Mono'] text-[11px] tracking-[0.08em] text-muted uppercase">{{ $t('article.updated') }}{{ article.date }}</span>
          <span class="flex items-center gap-2.5 text-[11px] tracking-[0.14em] uppercase text-muted font-medium">
            {{ $t('article.share') }}
            <a class="w-[34px] h-[34px] aspect-square rounded-lg bg-white dark:bg-[#0A0F1A] border border-border flex items-center justify-center text-[#2D2D2D] dark:text-[#E8EAEE] transition-[border-color,transform,color] duration-[180ms] hover:border-navy hover:-translate-y-px hover:text-orange" href="#" aria-label="Share on X"><AppIcon name="x" /></a>
            <a class="w-[34px] h-[34px] aspect-square rounded-lg bg-white dark:bg-[#0A0F1A] border border-border flex items-center justify-center text-[#2D2D2D] dark:text-[#E8EAEE] transition-[border-color,transform,color] duration-[180ms] hover:border-navy hover:-translate-y-px hover:text-orange" href="#" aria-label="Share on LinkedIn"><AppIcon name="linkedin" /></a>
            <a class="w-[34px] h-[34px] aspect-square rounded-lg bg-white dark:bg-[#0A0F1A] border border-border flex items-center justify-center text-[#2D2D2D] dark:text-[#E8EAEE] transition-[border-color,transform,color] duration-[180ms] hover:border-navy hover:-translate-y-px hover:text-orange" href="#" aria-label="Share by mail"><AppIcon name="mail" /></a>
          </span>
        </div>

        <!-- Author card -->
        <AppReveal>
          <aside class="mt-12 grid grid-cols-[96px_1fr_auto] gap-6 items-center p-6 border border-border rounded-2xl bg-sidebar dark:bg-[#0F1626] relative overflow-hidden before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-orange max-sm:grid-cols-1 max-sm:before:inset-x-0 max-sm:before:top-0 max-sm:before:bottom-auto max-sm:before:w-full max-sm:before:h-1">
            <span class="w-24 h-24 rounded-full overflow-hidden border border-border flex-shrink-0 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.2)] max-sm:w-16 max-sm:h-16">
              <AppPortrait :size="96" />
            </span>
            <div>
              <div class="text-[10px] tracking-[0.18em] uppercase text-muted font-medium mb-1">{{ $t('article.authorRoleLabel') }}</div>
              <div class="font-['Montserrat'] font-bold text-[18px] text-navy dark:text-[#E8ECF5] tracking-[-0.01em] mb-1.5">Norris Akogbede</div>
              <p class="text-sm text-[#2D2D2D] dark:text-[#E8EAEE] leading-[1.55] m-0 max-w-[50ch]">{{ $t('article.authorBio') }}</p>
            </div>
            <NuxtLink
              :to="`${localePath('/')}#contact`"
              class="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] bg-navy text-white text-[13px] font-medium transition-[transform,box-shadow] duration-[180ms] hover:-translate-y-px hover:shadow-[0_10px_24px_-10px_rgba(27,42,74,0.55)] whitespace-nowrap dark:text-[#0A0F1A]"
            >
              {{ $t('article.authorCta') }} <AppIcon name="arrow" class="w-3.5 h-3.5" />
            </NuxtLink>
          </aside>
        </AppReveal>

        <!-- Prev / next -->
        <nav v-if="prev && next" class="mt-8 grid grid-cols-2 gap-4 max-sm:grid-cols-1" aria-label="article navigation">
          <NuxtLink
            :to="localePath(`/blog/${prev.slug}`)"
            class="flex flex-col gap-1.5 p-[18px_20px] border border-border rounded-xl bg-white dark:bg-[#0A0F1A] transition-[border-color,transform] duration-[180ms] hover:border-navy hover:-translate-y-px text-left"
          >
            <span class="text-[10px] tracking-[0.18em] uppercase text-muted font-medium flex items-center gap-1.5">
              <AppIcon name="arrow" class="w-3 h-3 rotate-180" /> {{ $t('article.prev') }}
            </span>
            <span class="font-['Montserrat'] font-bold text-[15px] leading-[1.3] text-navy dark:text-[#E8ECF5] tracking-[-0.01em]">{{ prev.title }}</span>
          </NuxtLink>
          <NuxtLink
            :to="localePath(`/blog/${next.slug}`)"
            class="flex flex-col gap-1.5 p-[18px_20px] border border-border rounded-xl bg-white dark:bg-[#0A0F1A] transition-[border-color,transform] duration-[180ms] hover:border-navy hover:-translate-y-px text-right"
          >
            <span class="text-[10px] tracking-[0.18em] uppercase text-muted font-medium flex items-center gap-1.5 justify-end">
              {{ $t('article.next') }} <AppIcon name="arrow" class="w-3 h-3" />
            </span>
            <span class="font-['Montserrat'] font-bold text-[15px] leading-[1.3] text-navy dark:text-[#E8ECF5] tracking-[-0.01em]">{{ next.title }}</span>
          </NuxtLink>
        </nav>
      </article>
    </div>

    <!-- Related -->
    <AppReveal>
      <section class="mt-24 pt-12 border-t border-border">
        <div class="flex items-end justify-between mb-6 gap-4">
          <h3 class="font-['Montserrat'] font-bold text-2xl text-navy dark:text-[#E8ECF5] tracking-[-0.015em] m-0">{{ $t('article.related') }}</h3>
          <NuxtLink :to="localePath('/blog')" class="inline-flex items-center gap-1.5 text-[13px] text-navy dark:text-[#E8ECF5] font-medium hover:text-orange transition-colors duration-[180ms]">
            {{ $t('article.allJournal') }} <AppIcon name="arrow" class="w-3 h-3" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
          <NuxtLink
            v-for="r in related"
            :key="r.slug"
            :to="localePath(`/blog/${r.slug}`)"
            class="flex flex-col gap-3 p-5 border border-border rounded-xl bg-white dark:bg-[#0A0F1A] transition-[border-color,transform] duration-[180ms] hover:border-navy hover:-translate-y-0.5"
          >
            <span class="text-[10px] tracking-[0.18em] uppercase text-orange font-semibold">{{ r.tag }}</span>
            <h4 class="font-['Montserrat'] font-bold text-base leading-[1.3] text-navy dark:text-[#E8ECF5] tracking-[-0.01em] m-0">{{ r.title }}</h4>
            <span class="text-[11px] text-muted font-['JetBrains_Mono'] tracking-[0.06em] uppercase mt-auto pt-2 border-t border-border flex justify-between items-center">
              <span>{{ r.date }}</span>
              <span>{{ r.read }}</span>
            </span>
          </NuxtLink>
        </div>
      </section>
    </AppReveal>
  </div>
</template>

<style scoped>
.blog-content :deep(h2) {
  @apply font-['Montserrat'] font-bold text-[26px] leading-[1.25] text-navy dark:text-[#E8ECF5] tracking-[-0.015em] mt-14 mb-4 scroll-mt-[96px] relative;
}
@media (min-width: 768px) {
  .blog-content :deep(h2)::before {
    content: "§";
    @apply absolute -left-7 top-0.5 font-['JetBrains_Mono'] text-base text-orange opacity-80;
  }
}
.blog-content :deep(p) {
  @apply mb-5 leading-[1.75];
}
.blog-content :deep(p strong) {
  @apply text-navy dark:text-white font-semibold;
}
.blog-content :deep(p code) {
  @apply font-['JetBrains_Mono'] text-[0.88em] bg-[#F7F8FA] dark:bg-[#0F1626] border border-[#E5E7EB] dark:border-[#1E2638] px-1.5 py-0.5 rounded text-navy dark:text-orange;
}
.blog-content :deep(blockquote) {
  @apply border-l-3 border-orange pl-5.5 py-1 my-9 font-['Montserrat'] font-semibold text-[22px] leading-[1.4] text-navy dark:text-white tracking-[-0.01em] max-w-[48ch];
}
.blog-content :deep(ul) {
  @apply mb-6 pl-0 list-none;
}
.blog-content :deep(ul > li) {
  @apply relative pl-7.5 my-2 leading-[1.6];
}
.blog-content :deep(ul > li)::before {
  content: "";
  @apply absolute left-2 top-3 w-1.5 h-1.5 bg-orange rounded-[1px] rotate-45;
}
.blog-content :deep(ul > li strong) {
  @apply text-navy dark:text-white font-semibold;
}
.blog-content :deep(ul > li code) {
  @apply font-['JetBrains_Mono'] text-[0.88em] bg-[#F7F8FA] dark:bg-[#0F1626] border border-[#E5E7EB] dark:border-[#1E2638] px-1.5 py-0.5 rounded text-navy dark:text-orange;
}
.blog-content :deep(ol) {
  @apply mb-6 pl-0 list-none;
  counter-reset: olist;
}
.blog-content :deep(ol > li) {
  @apply relative pl-7.5 my-2 leading-[1.6];
  counter-increment: olist;
}
.blog-content :deep(ol > li)::before {
  content: counter(olist, decimal-leading-zero);
  @apply absolute left-0 top-[1px] font-['JetBrains_Mono'] text-xs font-medium text-orange tracking-[0.06em];
}
.blog-content :deep(ol > li strong) {
  @apply text-navy dark:text-white font-semibold;
}
.blog-content :deep(ol > li code) {
  @apply font-['JetBrains_Mono'] text-[0.88em] bg-[#F7F8FA] dark:bg-[#0F1626] border border-[#E5E7EB] dark:border-[#1E2638] px-1.5 py-0.5 rounded text-navy dark:text-orange;
}
</style>
