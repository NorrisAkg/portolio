<script setup lang="ts">
import { ARTICLES, resolveArticle, listArticles, type Locale } from '~/utils/articles'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()

const slug = computed(() => route.params.slug as string)

const article = computed(() => resolveArticle(slug.value, locale.value as Locale))

// 404 when the slug doesn't match any article
if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const allPosts = computed(() => listArticles(locale.value as Locale))

const related = computed(() => {
  if (!article.value) return []
  const me = article.value
  const others = allPosts.value.filter(p => p.idx !== me.idx)
  const sameTag = others.filter(p => p.tag === me.tag)
  const rest = others.filter(p => p.tag !== me.tag)
  return [...sameTag, ...rest].slice(0, 3)
})

const prev = computed(() => {
  if (!article.value) return null
  const i = (article.value.idx - 1 + ARTICLES.length) % ARTICLES.length
  return allPosts.value[i]
})

const next = computed(() => {
  if (!article.value) return null
  const i = (article.value.idx + 1) % ARTICLES.length
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

// Inline rendering: backtick `code` only, all other HTML escaped.
const renderInline = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
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
  <div v-if="article" class="content">
    <!-- Breadcrumbs -->
    <nav class="art-crumbs" aria-label="breadcrumb">
      <NuxtLink :to="localePath('/')">N.A.</NuxtLink>
      <span class="sep">/</span>
      <NuxtLink :to="localePath('/blog')">{{ $t('blog.pageLabel') }}</NuxtLink>
      <span class="sep">/</span>
      <span class="here">{{ $t('article.label') }} #{{ String(article.idx + 1).padStart(2, '0') }}</span>
    </nav>

    <!-- Hero -->
    <AppReveal>
      <header class="art-hero">
        <div class="tag-row">
          <span class="tag">{{ article.tag }}</span>
          <span class="dot" />
          <span class="date">{{ article.date }}</span>
          <span class="dot" />
          <span class="read">{{ article.read }}</span>
        </div>
        <h1 class="art-title">{{ article.title }}</h1>
        <p class="art-lede">{{ article.excerpt }}</p>

        <div class="art-byline">
          <div class="who">
            <span class="av"><AppPortrait :size="36" /></span>
            <span>
              <span class="nm">Norris Akogbede</span>
              <span class="role">{{ $t('article.authorRoleLabel') }}</span>
            </span>
          </div>
          <div class="actions">
            <a class="sq-btn" href="#" aria-label="Share on X"><AppIcon name="x" /></a>
            <a class="sq-btn" href="#" aria-label="Share on LinkedIn"><AppIcon name="linkedin" /></a>
            <a class="sq-btn" href="#" aria-label="Copy link"><AppIcon name="mail" /></a>
          </div>
        </div>
      </header>
    </AppReveal>

    <!-- Cover -->
    <AppReveal :delay="60">
      <div class="art-cover">
        <ProjectImage :tone="article.tone" :label="article.cover" />
        <span class="stamp">{{ $t('article.coverStamp') }} · {{ String(article.idx + 1).padStart(2, '0') }}</span>
      </div>
    </AppReveal>

    <!-- Body grid -->
    <div class="art-grid">
      <!-- TOC -->
      <aside class="art-toc">
        <span class="lbl">{{ $t('article.toc') }}</span>
        <a
          v-for="(item, i) in article.toc"
          :key="item.id"
          :href="`#${item.id}`"
          :class="{ active: activeTOC === item.id }"
          @click="scrollToHeading(item.id, $event)"
        >
          <span class="n">{{ String(i + 1).padStart(2, '0') }}</span>
          <span>{{ item.label }}</span>
        </a>
        <div class="progress">
          <span class="pl">{{ $t('article.progress') }}</span>
          <span class="bar"><i :style="{ width: `${progress}%` }" /></span>
          <span class="pct">{{ Math.round(progress) }}%</span>
        </div>
      </aside>

      <!-- Prose -->
      <article id="art-prose" class="art-prose">
        <template v-for="(block, i) in article.blocks" :key="i">
          <p v-if="block.type === 'lede'" class="lede-p">{{ block.text }}</p>
          <h2 v-else-if="block.type === 'h2'" :id="block.id">{{ block.text }}</h2>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-else-if="block.type === 'p'" v-html="renderInline(block.text)" />
          <blockquote v-else-if="block.type === 'pull'" class="pull">« {{ block.text }} »</blockquote>
          <ul v-else-if="block.type === 'ul'">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <li v-for="(item, j) in block.items" :key="j" v-html="renderInline(item)" />
          </ul>
          <ol v-else-if="block.type === 'ol'">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <li v-for="(item, j) in block.items" :key="j" v-html="renderInline(item)" />
          </ol>
        </template>

        <!-- End-of-article footer -->
        <div class="art-end">
          <span class="updated">{{ $t('article.updated') }}{{ article.date }}</span>
          <span class="share">
            {{ $t('article.share') }}
            <a class="sq-btn" href="#" aria-label="Share on X"><AppIcon name="x" /></a>
            <a class="sq-btn" href="#" aria-label="Share on LinkedIn"><AppIcon name="linkedin" /></a>
            <a class="sq-btn" href="#" aria-label="Share by mail"><AppIcon name="mail" /></a>
          </span>
        </div>

        <!-- Author card -->
        <AppReveal>
          <aside class="art-author-card">
            <span class="av"><AppPortrait :size="96" /></span>
            <div class="meta">
              <div class="lbl">{{ $t('article.authorRoleLabel') }}</div>
              <div class="nm">Norris Akogbede</div>
              <p class="bio">{{ $t('article.authorBio') }}</p>
            </div>
            <NuxtLink :to="`${localePath('/')}#contact`" class="cta">
              {{ $t('article.authorCta') }} <AppIcon name="arrow" />
            </NuxtLink>
          </aside>
        </AppReveal>

        <!-- Prev / next -->
        <nav v-if="prev && next" class="art-nav" aria-label="article navigation">
          <NuxtLink :to="localePath(`/blog/${prev.slug}`)" class="prev">
            <span class="dir"><AppIcon name="arrow" /> {{ $t('article.prev') }}</span>
            <span class="ttl">{{ prev.title }}</span>
          </NuxtLink>
          <NuxtLink :to="localePath(`/blog/${next.slug}`)" class="next">
            <span class="dir">{{ $t('article.next') }} <AppIcon name="arrow" /></span>
            <span class="ttl">{{ next.title }}</span>
          </NuxtLink>
        </nav>
      </article>
    </div>

    <!-- Related -->
    <AppReveal>
      <section class="art-related">
        <div class="head">
          <h3>{{ $t('article.related') }}</h3>
          <NuxtLink :to="localePath('/blog')" class="all">
            {{ $t('article.allJournal') }} <AppIcon name="arrow" />
          </NuxtLink>
        </div>
        <div class="list">
          <NuxtLink
            v-for="r in related"
            :key="r.slug"
            :to="localePath(`/blog/${r.slug}`)"
            class="card"
          >
            <span class="tag">{{ r.tag }}</span>
            <h4>{{ r.title }}</h4>
            <span class="meta">
              <span>{{ r.date }}</span>
              <span>{{ r.read }}</span>
            </span>
          </NuxtLink>
        </div>
      </section>
    </AppReveal>
  </div>
</template>
