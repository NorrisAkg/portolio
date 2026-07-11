import type { ArticleProps, PaginatedResult } from '../../shared/types/article'

export interface MappedArticle {
  id: string
  idx: number
  slug: string
  tag: string
  tone: 'warm' | 'cool' | 'navy'
  date: string
  read: string
  title: string
  excerpt: string
  cover: string
  toc: { id: string; label: string }[]
  content: string
}

export const useArticles = () => {
  const { locale } = useI18n()

  // Format date helper
  const formatDate = (dateStr: string | null, loc: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(loc === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // Calculate read time
  const calculateReadTime = (content: string, loc: string) => {
    const words = content.trim().split(/\s+/).length
    const minutes = Math.max(1, Math.ceil(words / 200))
    return loc === 'fr' ? `${minutes} min` : `${minutes} min read`
  }

  // Dynamic tag helper
  const getArticleTag = (slug: string, loc: string) => {
    const s = slug.toLowerCase()
    if (s.includes('blockchain') || s.includes('estimate') || s.includes('brief')) {
      return loc === 'fr' ? 'STRATÉGIE' : 'STRATEGY'
    }
    if (s.includes('react') || s.includes('nuxt')) {
      return loc === 'fr' ? 'TECH' : 'TECH'
    }
    return loc === 'fr' ? 'GÉNÉRAL' : 'GENERAL'
  }

  // Extract TOC headings
  const extractTOC = (content: string) => {
    const headings: { id: string; label: string }[] = []
    const lines = content.split('\n')
    for (const line of lines) {
      const match = line.match(/^##\s+(.+)$/)
      if (match) {
        const label = (match[1] || '').trim()
        // Simple and robust slugifier matching nuxt mdc
        const id = label
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        headings.push({ id, label })
      }
    }
    return headings
  }

  // Map database article to UI model
  const mapArticle = (article: ArticleProps, index: number, loc: string = locale.value): MappedArticle => {
    // Find matching translation or fallback to first
    const translation = article.translations.find(t => t.locale === loc) || article.translations[0]
    
    const title = translation?.title || ''
    const slug = translation?.slug || article.id
    const excerpt = translation?.description || ''
    const content = translation?.content || ''
    
    const tones: ('warm' | 'cool' | 'navy')[] = ['warm', 'cool', 'navy']
    const tone = tones[index % tones.length] ?? 'warm'
    
    return {
      id: article.id,
      idx: index,
      slug,
      tag: getArticleTag(slug, loc),
      tone,
      date: formatDate(article.publishedAt || article.createdAt, loc),
      read: calculateReadTime(content, loc),
      title,
      excerpt,
      cover: article.image || 'seed-article-1.PNG',
      toc: extractTOC(content),
      content,
    }
  }

  // Fetch paginated list
  const getArticlesList = async (options: { page?: number; limit?: number; status?: 'DRAFT' | 'PUBLISHED' } = {}) => {
    const query: Record<string, string | number> = {
      page: options.page ?? 1,
      limit: options.limit ?? 10,
    }
    if (options.status) query.status = options.status

    const { data, error, pending, refresh } = await useFetch<PaginatedResult<ArticleProps>>('/api/articles', {
      query,
    })

    const articles = computed(() => {
      if (!data.value) return []
      return data.value.data.map((item, idx) => mapArticle(item, idx))
    })

    const meta = computed(() => data.value?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 })

    return {
      articles,
      meta,
      pending,
      error,
      refresh,
    }
  }

  // Fetch one article by slug
  const getArticleBySlug = async (slug: string) => {
    const { data, error, pending, refresh } = await useFetch<ArticleProps>(`/api/articles/${slug}`)

    const article = computed(() => {
      if (!data.value) return null
      // We don't have index here, but we can generate one from id hash to keep tone stable
      const charCodeSum = data.value.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
      return mapArticle(data.value, charCodeSum)
    })

    return {
      article,
      pending,
      error,
      refresh,
    }
  }

  return {
    mapArticle,
    getArticlesList,
    getArticleBySlug,
  }
}
