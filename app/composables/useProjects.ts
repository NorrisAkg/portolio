import type { ProjectProps } from '../../shared/types/project'

export const useProjects = () => {
  const { locale } = useI18n()

  const mapProject = (p: ProjectProps) => {
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
      tone: p.tone,
      label: p.image || undefined,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      slug: trans.slug,
      featured: p.featured,
    }
  }

  const getProjectsList = async (options: { featured?: boolean } = {}) => {
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
