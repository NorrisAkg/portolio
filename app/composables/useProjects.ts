export interface MappedProject {
  id: string
  name: string
  year: string
  dur: string
  problem: string
  bullets: [string, string][]
  tone: 'warm' | 'cool' | 'navy'
  label?: string
  githubUrl?: string | null
  liveUrl?: string | null
  slug: string
  featured: boolean
  status: 'DRAFT' | 'PUBLISHED'
  publishedAt?: string | null
}

export const useProjects = () => {
  const { locale } = useI18n()

  const mapProject = (p: ProjectProps): MappedProject => {
    const trans = p.translations.find(t => t.locale === locale.value) || p.translations[0] || {
      title: '',
      slug: '',
      description: '',
      outcome: '',
      durationLabel: '',
    }

    const techString = p.technologies?.map((t) => t.name).join(' · ') || 'Web'

    return {
      id: p.id,
      name: trans.title,
      year: p.year,
      dur: p.dur,
      problem: trans.description,
      bullets: [
        ['TECH', techString],
        ['OUTCOME', trans.outcome],
        ['DURATION', trans.durationLabel],
      ] as [string, string][],
      tone: (p.tone as 'warm' | 'cool' | 'navy') || 'cool',
      label: p.image || undefined,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      slug: trans.slug,
      featured: p.featured,
      status: p.status || 'DRAFT',
      publishedAt: p.publishedAt,
    }
  }

  const getProjectsList = async (options: { featured?: boolean; status?: 'PUBLISHED' | 'DRAFT' | 'ALL' } = {}) => {
    const { data, error, pending, refresh } = await useFetch<ProjectProps[]>('/api/projects', {
      query: options,
    })

    const projects = computed(() => {
      if (!data.value) return []
      return data.value.map(p => mapProject(p))
    })

    return {
      projects,
      pending,
      error,
      refresh,
    }
  }

  return {
    mapProject,
    getProjectsList,
  }
}
