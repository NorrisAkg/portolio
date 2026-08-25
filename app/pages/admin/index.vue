<script setup lang="ts">
import type { MappedArticle } from '../../composables/useArticles'
import type { MappedProject } from '../../composables/useProjects'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { getArticlesList } = useArticles()
const { getProjectsList } = useProjects()
const localePath = useLocalePath()

// Fetch articles list with different statuses
const { articles: publishedArticles, refresh: refreshPublished } = await getArticlesList({ status: 'PUBLISHED' })
const { articles: draftArticles, refresh: refreshDrafts } = await getArticlesList({ status: 'DRAFT' })

// Fetch projects list with different statuses
const { projects: publishedProjects, refresh: refreshPublishedProjects } = await getProjectsList({ status: 'PUBLISHED' })
const { projects: draftProjects, refresh: refreshDraftProjects } = await getProjectsList({ status: 'DRAFT' })

const activeTab = ref<'articles' | 'projects'>('articles')
const activeArticleSubTab = ref<'published' | 'drafts'>('published')
const activeProjectSubTab = ref<'published' | 'drafts'>('published')

// Selection state
const selectedArticleIds = ref<string[]>([])
const selectedProjectIds = ref<string[]>([])

// Reset selections when tabs change
watch([activeTab, activeArticleSubTab, activeProjectSubTab], () => {
  selectedArticleIds.value = []
  selectedProjectIds.value = []
})

// Current visible lists
const currentArticles = computed(() => {
  return activeArticleSubTab.value === 'published' ? publishedArticles.value : draftArticles.value
})

const currentProjects = computed(() => {
  return activeProjectSubTab.value === 'published' ? publishedProjects.value : draftProjects.value
})

// "Select all" computed & methods for Articles
const isAllArticlesSelected = computed(() => {
  return currentArticles.value.length > 0 && selectedArticleIds.value.length === currentArticles.value.length
})

const isSomeArticlesSelected = computed(() => {
  return selectedArticleIds.value.length > 0 && !isAllArticlesSelected.value
})

const toggleSelectAllArticles = () => {
  if (isAllArticlesSelected.value) {
    selectedArticleIds.value = []
  } else {
    selectedArticleIds.value = currentArticles.value.map(a => a.id)
  }
}

// "Select all" computed & methods for Projects
const isAllProjectsSelected = computed(() => {
  return currentProjects.value.length > 0 && selectedProjectIds.value.length === currentProjects.value.length
})

const isSomeProjectsSelected = computed(() => {
  return selectedProjectIds.value.length > 0 && !isAllProjectsSelected.value
})

const toggleSelectAllProjects = () => {
  if (isAllProjectsSelected.value) {
    selectedProjectIds.value = []
  } else {
    selectedProjectIds.value = currentProjects.value.map(p => p.id)
  }
}

// Global Confirmation Modal State
interface ConfirmModalOptions {
  title: string
  message: string
  confirmText?: string
  variant: 'danger' | 'warning' | 'success'
  action: () => Promise<void>
}

const isModalOpen = ref(false)
const modalLoading = ref(false)
const modalOptions = ref<ConfirmModalOptions>({
  title: '',
  message: '',
  confirmText: 'Confirmer',
  variant: 'danger',
  action: async () => {},
})

const openConfirm = (opts: ConfirmModalOptions) => {
  modalOptions.value = opts
  isModalOpen.value = true
}

const handleModalConfirm = async () => {
  modalLoading.value = true
  try {
    await modalOptions.value.action()
    isModalOpen.value = false
  } catch (err: unknown) {
    alert(formatApiError(err, 'Une erreur est survenue lors de l\'opération.'))
  } finally {
    modalLoading.value = false
  }
}

// Single Article Action Confirmations
const confirmPublishArticle = (art: MappedArticle) => {
  openConfirm({
    title: 'Confirmer la publication',
    message: `Voulez-vous publier l'article "${art.title}" ? Il sera visible publiquement sur le site.`,
    confirmText: 'Publier',
    variant: 'success',
    action: async () => {
      await $fetch(`/api/articles/${art.id}/publish`, { method: 'POST' })
      await refreshPublished()
      await refreshDrafts()
    },
  })
}

const confirmUnpublishArticle = (art: MappedArticle) => {
  openConfirm({
    title: 'Confirmer la dépublication',
    message: `Voulez-vous dépublier l'article "${art.title}" ? Il repassera en brouillon et ne sera plus accessible publiquement.`,
    confirmText: 'Dépublier',
    variant: 'warning',
    action: async () => {
      await $fetch(`/api/articles/${art.id}/unpublish`, { method: 'POST' })
      await refreshPublished()
      await refreshDrafts()
    },
  })
}

const confirmDeleteArticle = (art: MappedArticle) => {
  openConfirm({
    title: 'Confirmer la suppression',
    message: `Êtes-vous sûr de vouloir supprimer définitivement l'article "${art.title}" ? Cette action est irréversible.`,
    confirmText: 'Supprimer',
    variant: 'danger',
    action: async () => {
      await $fetch(`/api/articles/${art.id}`, { method: 'DELETE' })
      await refreshPublished()
      await refreshDrafts()
      selectedArticleIds.value = selectedArticleIds.value.filter(id => id !== art.id)
    },
  })
}

// Single Project Action Confirmations
const confirmPublishProject = (proj: MappedProject) => {
  openConfirm({
    title: 'Confirmer la publication',
    message: `Voulez-vous publier le projet "${proj.name}" ? Il sera visible publiquement sur le site.`,
    confirmText: 'Publier',
    variant: 'success',
    action: async () => {
      await $fetch(`/api/projects/${proj.id}/publish`, { method: 'POST' })
      await refreshPublishedProjects()
      await refreshDraftProjects()
    },
  })
}

const confirmUnpublishProject = (proj: MappedProject) => {
  openConfirm({
    title: 'Confirmer la dépublication',
    message: `Voulez-vous dépublier le projet "${proj.name}" ? Il repassera en brouillon et ne sera plus accessible publiquement.`,
    confirmText: 'Dépublier',
    variant: 'warning',
    action: async () => {
      await $fetch(`/api/projects/${proj.id}/unpublish`, { method: 'POST' })
      await refreshPublishedProjects()
      await refreshDraftProjects()
    },
  })
}

const confirmDeleteProject = (proj: MappedProject) => {
  openConfirm({
    title: 'Confirmer la suppression',
    message: `Êtes-vous sûr de vouloir supprimer définitivement le projet "${proj.name}" ? Cette action est irréversible.`,
    confirmText: 'Supprimer',
    variant: 'danger',
    action: async () => {
      await $fetch(`/api/projects/${proj.id}`, { method: 'DELETE' })
      await refreshPublishedProjects()
      await refreshDraftProjects()
      selectedProjectIds.value = selectedProjectIds.value.filter(id => id !== proj.id)
    },
  })
}

// Batch Articles Actions
const confirmBatchPublishArticles = () => {
  const count = selectedArticleIds.value.length
  if (count === 0) return
  openConfirm({
    title: 'Publier la sélection',
    message: `Voulez-vous publier les ${count} article(s) sélectionné(s) ?`,
    confirmText: `Publier (${count})`,
    variant: 'success',
    action: async () => {
      await $fetch('/api/articles/batch', {
        method: 'POST',
        body: { ids: selectedArticleIds.value, action: 'publish' },
      })
      selectedArticleIds.value = []
      await refreshPublished()
      await refreshDrafts()
    },
  })
}

const confirmBatchUnpublishArticles = () => {
  const count = selectedArticleIds.value.length
  if (count === 0) return
  openConfirm({
    title: 'Dépublier la sélection',
    message: `Voulez-vous dépublier les ${count} article(s) sélectionné(s) et les repasser en brouillons ?`,
    confirmText: `Dépublier (${count})`,
    variant: 'warning',
    action: async () => {
      await $fetch('/api/articles/batch', {
        method: 'POST',
        body: { ids: selectedArticleIds.value, action: 'unpublish' },
      })
      selectedArticleIds.value = []
      await refreshPublished()
      await refreshDrafts()
    },
  })
}

const confirmBatchDeleteArticles = () => {
  const count = selectedArticleIds.value.length
  if (count === 0) return
  openConfirm({
    title: 'Supprimer la sélection',
    message: `Êtes-vous sûr de vouloir supprimer définitivement les ${count} article(s) sélectionné(s) ? Cette action est irréversible.`,
    confirmText: `Supprimer (${count})`,
    variant: 'danger',
    action: async () => {
      await $fetch('/api/articles/batch', {
        method: 'POST',
        body: { ids: selectedArticleIds.value, action: 'delete' },
      })
      selectedArticleIds.value = []
      await refreshPublished()
      await refreshDrafts()
    },
  })
}

// Batch Projects Actions
const confirmBatchPublishProjects = () => {
  const count = selectedProjectIds.value.length
  if (count === 0) return
  openConfirm({
    title: 'Publier la sélection',
    message: `Voulez-vous publier les ${count} projet(s) sélectionné(s) ?`,
    confirmText: `Publier (${count})`,
    variant: 'success',
    action: async () => {
      await $fetch('/api/projects/batch', {
        method: 'POST',
        body: { ids: selectedProjectIds.value, action: 'publish' },
      })
      selectedProjectIds.value = []
      await refreshPublishedProjects()
      await refreshDraftProjects()
    },
  })
}

const confirmBatchUnpublishProjects = () => {
  const count = selectedProjectIds.value.length
  if (count === 0) return
  openConfirm({
    title: 'Dépublier la sélection',
    message: `Voulez-vous dépublier les ${count} projet(s) sélectionné(s) et les repasser en brouillons ?`,
    confirmText: `Dépublier (${count})`,
    variant: 'warning',
    action: async () => {
      await $fetch('/api/projects/batch', {
        method: 'POST',
        body: { ids: selectedProjectIds.value, action: 'unpublish' },
      })
      selectedProjectIds.value = []
      await refreshPublishedProjects()
      await refreshDraftProjects()
    },
  })
}

const confirmBatchDeleteProjects = () => {
  const count = selectedProjectIds.value.length
  if (count === 0) return
  openConfirm({
    title: 'Supprimer la sélection',
    message: `Êtes-vous sûr de vouloir supprimer définitivement les ${count} projet(s) sélectionné(s) ? Cette action est irréversible.`,
    confirmText: `Supprimer (${count})`,
    variant: 'danger',
    action: async () => {
      await $fetch('/api/projects/batch', {
        method: 'POST',
        body: { ids: selectedProjectIds.value, action: 'delete' },
      })
      selectedProjectIds.value = []
      await refreshPublishedProjects()
      await refreshDraftProjects()
    },
  })
}
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="flex items-center justify-between border-b border-border pb-5">
      <div>
        <h1 class="font-['Montserrat'] font-bold text-3xl tracking-tight text-navy dark:text-white m-0">
          Tableau de bord
        </h1>
        <p class="text-sm text-muted mt-1">Gérez le contenu de votre portfolio personnel.</p>
      </div>
      <div>
        <NuxtLink
          v-if="activeTab === 'articles'"
          :to="localePath('/admin/articles/create')"
          class="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-orange text-slate-950 text-sm font-semibold hover:bg-orange/90 transition-colors"
        >
          <span>+</span> Nouvel article
        </NuxtLink>
        <NuxtLink
          v-else
          :to="localePath('/admin/projects/create')"
          class="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-orange text-slate-950 text-sm font-semibold hover:bg-orange/90 transition-colors"
        >
          <span>+</span> Nouveau projet
        </NuxtLink>
      </div>
    </div>

    <!-- Main Navigation Tabs -->
    <div class="flex border-b border-border gap-8 text-sm font-semibold">
      <button
        class="pb-3 relative transition-colors flex items-center gap-2"
        :class="activeTab === 'articles' ? 'text-orange border-b-2 border-orange' : 'text-muted hover:text-navy dark:hover:text-[#E8ECF5]'"
        @click="activeTab = 'articles'"
      >
        <span>Articles</span>
        <span class="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {{ publishedArticles.length + draftArticles.length }}
        </span>
      </button>
      <button
        class="pb-3 relative transition-colors flex items-center gap-2"
        :class="activeTab === 'projects' ? 'text-orange border-b-2 border-orange' : 'text-muted hover:text-navy dark:hover:text-[#E8ECF5]'"
        @click="activeTab = 'projects'"
      >
        <span>Projets</span>
        <span class="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {{ publishedProjects.length + draftProjects.length }}
        </span>
      </button>
    </div>

    <!-- ==================== ARTICLES TAB ==================== -->
    <div v-if="activeTab === 'articles'" class="space-y-6">
      <!-- Sub-tabs & Batch Actions Toolbar -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Sub-tabs: Published vs Drafts -->
        <div class="flex items-center gap-3">
          <button
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
            :class="activeArticleSubTab === 'published' ? 'bg-orange/15 text-orange' : 'bg-slate-100 dark:bg-slate-900 text-muted hover:text-navy dark:hover:text-white'"
            @click="activeArticleSubTab = 'published'"
          >
            <span>Publiés</span>
            <span class="px-1.5 py-0.2 rounded text-[10px] bg-white/60 dark:bg-slate-800">{{ publishedArticles.length }}</span>
          </button>
          <button
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
            :class="activeArticleSubTab === 'drafts' ? 'bg-orange/15 text-orange' : 'bg-slate-100 dark:bg-slate-900 text-muted hover:text-navy dark:hover:text-white'"
            @click="activeArticleSubTab = 'drafts'"
          >
            <span>Brouillons</span>
            <span class="px-1.5 py-0.2 rounded text-[10px] bg-white/60 dark:bg-slate-800">{{ draftArticles.length }}</span>
          </button>
        </div>

        <!-- BATCH ACTIONS TOOLBAR (Articles) -->
        <div
          v-if="selectedArticleIds.length > 0"
          class="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-border px-3 py-1.5 rounded-xl animate-fade-in text-xs font-semibold"
        >
          <span class="text-muted mr-1 font-mono">
            {{ selectedArticleIds.length }} sélectionné(s)
          </span>

          <!-- Batch Publish (for drafts) -->
          <button
            v-if="activeArticleSubTab === 'drafts'"
            class="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
            @click="confirmBatchPublishArticles"
          >
            <span>🌐</span> Publier la sélection
          </button>

          <!-- Batch Unpublish (for published) -->
          <button
            v-if="activeArticleSubTab === 'published'"
            class="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
            @click="confirmBatchUnpublishArticles"
          >
            <span>🔒</span> Dépublier la sélection
          </button>

          <!-- Batch Delete -->
          <button
            class="px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
            @click="confirmBatchDeleteArticles"
          >
            <span>🗑️</span> Supprimer
          </button>

          <!-- Clear selection -->
          <button
            class="p-1 text-muted hover:text-navy dark:hover:text-white transition-colors"
            title="Désélectionner tout"
            @click="selectedArticleIds = []"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Articles Table -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border rounded-2xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/40 text-xs font-['JetBrains_Mono'] tracking-wider uppercase text-muted border-b border-border">
              <th class="p-4 pl-6 w-12 text-center">
                <input
                  type="checkbox"
                  :checked="isAllArticlesSelected"
                  :indeterminate.prop="isSomeArticlesSelected"
                  class="w-4 h-4 rounded border-border text-orange focus:ring-orange accent-orange cursor-pointer"
                  @change="toggleSelectAllArticles"
                />
              </th>
              <th class="p-4">Titre de l'article</th>
              <th class="p-4">Tag</th>
              <th class="p-4">Date</th>
              <th class="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="currentArticles.length === 0">
              <td colspan="5" class="p-8 text-center text-sm text-muted">
                Aucun article dans cette section.
              </td>
            </tr>
            <tr
              v-for="art in currentArticles"
              :key="art.id"
              class="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
              :class="selectedArticleIds.includes(art.id) ? 'bg-orange/5 dark:bg-orange/10' : ''"
            >
              <!-- Row Checkbox -->
              <td class="p-4 pl-6 text-center">
                <input
                  v-model="selectedArticleIds"
                  type="checkbox"
                  :value="art.id"
                  class="w-4 h-4 rounded border-border text-orange focus:ring-orange accent-orange cursor-pointer"
                />
              </td>
              <td class="p-4 font-semibold text-navy dark:text-[#E8ECF5]">
                <NuxtLink
                  :to="localePath(`/blog/${art.slug}`)"
                  target="_blank"
                  class="hover:text-orange transition-colors inline-flex items-center gap-1.5"
                >
                  {{ art.title }}
                  <span class="text-xs text-muted">↗</span>
                </NuxtLink>
              </td>
              <td class="p-4">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-orange/10 text-orange uppercase tracking-wider">
                  {{ art.tag }}
                </span>
              </td>
              <td class="p-4 text-xs text-muted">
                {{ art.date || 'Non daté' }}
              </td>
              <td class="p-4 text-right pr-6 space-x-2">
                <!-- Unpublish Button (for published) -->
                <button
                  v-if="activeArticleSubTab === 'published'"
                  title="Dépublier (passer en brouillon)"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
                  @click="confirmUnpublishArticle(art)"
                >
                  🔒
                </button>
                <!-- Publish Button (for drafts) -->
                <button
                  v-else
                  title="Publier l'article"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                  @click="confirmPublishArticle(art)"
                >
                  🌐
                </button>
                <!-- Edit Button -->
                <NuxtLink
                  :to="localePath(`/admin/articles/${art.slug}`)"
                  title="Modifier"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                >
                  ✏️
                </NuxtLink>
                <!-- Delete Button -->
                <button
                  title="Supprimer"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                  @click="confirmDeleteArticle(art)"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ==================== PROJECTS CONTENT ==================== -->
    <div v-if="activeTab === 'projects'" class="space-y-6">
      <!-- Sub-tabs & Batch Actions Toolbar -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Sub-tabs: Published vs Drafts -->
        <div class="flex items-center gap-3">
          <button
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
            :class="activeProjectSubTab === 'published' ? 'bg-orange/15 text-orange' : 'bg-slate-100 dark:bg-slate-900 text-muted hover:text-navy dark:hover:text-white'"
            @click="activeProjectSubTab = 'published'"
          >
            <span>Publiés</span>
            <span class="px-1.5 py-0.2 rounded text-[10px] bg-white/60 dark:bg-slate-800">{{ publishedProjects.length }}</span>
          </button>
          <button
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
            :class="activeProjectSubTab === 'drafts' ? 'bg-orange/15 text-orange' : 'bg-slate-100 dark:bg-slate-900 text-muted hover:text-navy dark:hover:text-white'"
            @click="activeProjectSubTab = 'drafts'"
          >
            <span>Brouillons</span>
            <span class="px-1.5 py-0.2 rounded text-[10px] bg-white/60 dark:bg-slate-800">{{ draftProjects.length }}</span>
          </button>
        </div>

        <!-- BATCH ACTIONS TOOLBAR (Projects) -->
        <div
          v-if="selectedProjectIds.length > 0"
          class="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-border px-3 py-1.5 rounded-xl animate-fade-in text-xs font-semibold"
        >
          <span class="text-muted mr-1 font-mono">
            {{ selectedProjectIds.length }} sélectionné(s)
          </span>

          <!-- Batch Publish (for drafts) -->
          <button
            v-if="activeProjectSubTab === 'drafts'"
            class="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
            @click="confirmBatchPublishProjects"
          >
            <span>🌐</span> Publier la sélection
          </button>

          <!-- Batch Unpublish (for published) -->
          <button
            v-if="activeProjectSubTab === 'published'"
            class="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
            @click="confirmBatchUnpublishProjects"
          >
            <span>🔒</span> Dépublier la sélection
          </button>

          <!-- Batch Delete -->
          <button
            class="px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
            @click="confirmBatchDeleteProjects"
          >
            <span>🗑️</span> Supprimer
          </button>

          <!-- Clear selection -->
          <button
            class="p-1 text-muted hover:text-navy dark:hover:text-white transition-colors"
            title="Désélectionner tout"
            @click="selectedProjectIds = []"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Projects Table -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border rounded-2xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/40 text-xs font-['JetBrains_Mono'] tracking-wider uppercase text-muted border-b border-border">
              <th class="p-4 pl-6 w-12 text-center">
                <input
                  type="checkbox"
                  :checked="isAllProjectsSelected"
                  :indeterminate.prop="isSomeProjectsSelected"
                  class="w-4 h-4 rounded border-border text-orange focus:ring-orange accent-orange cursor-pointer"
                  @change="toggleSelectAllProjects"
                />
              </th>
              <th class="p-4">Nom du Projet</th>
              <th class="p-4">Année</th>
              <th class="p-4">Mise en avant</th>
              <th class="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="currentProjects.length === 0">
              <td colspan="5" class="p-8 text-center text-sm text-muted">
                Aucun projet dans cette section.
              </td>
            </tr>
            <tr
              v-for="p in currentProjects"
              :key="p.id"
              class="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
              :class="selectedProjectIds.includes(p.id) ? 'bg-orange/5 dark:bg-orange/10' : ''"
            >
              <!-- Row Checkbox -->
              <td class="p-4 pl-6 text-center">
                <input
                  v-model="selectedProjectIds"
                  type="checkbox"
                  :value="p.id"
                  class="w-4 h-4 rounded border-border text-orange focus:ring-orange accent-orange cursor-pointer"
                />
              </td>
              <td class="p-4 font-semibold text-navy dark:text-[#E8ECF5]">
                {{ p.name }}
              </td>
              <td class="p-4 text-xs text-muted">
                {{ p.year }} · {{ p.dur }}
              </td>
              <td class="p-4">
                <span
                  v-if="p.featured"
                  class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-orange/10 text-orange"
                >
                  FEATURED
                </span>
                <span
                  v-else
                  class="text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-muted"
                >
                  STANDARD
                </span>
              </td>
              <td class="p-4 text-right pr-6 space-x-2">
                <!-- Unpublish Button (for published) -->
                <button
                  v-if="activeProjectSubTab === 'published'"
                  title="Dépublier (passer en brouillon)"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors"
                  @click="confirmUnpublishProject(p)"
                >
                  🔒
                </button>
                <!-- Publish Button (for drafts) -->
                <button
                  v-else
                  title="Publier le projet"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                  @click="confirmPublishProject(p)"
                >
                  🌐
                </button>
                <!-- Edit Button -->
                <NuxtLink
                  :to="localePath(`/admin/projects/${p.id}`)"
                  title="Modifier"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                >
                  ✏️
                </NuxtLink>
                <!-- Delete Button -->
                <button
                  title="Supprimer"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                  @click="confirmDeleteProject(p)"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- UNIFIED CONFIRMATION MODAL -->
    <AdminConfirmModal
      v-model="isModalOpen"
      :title="modalOptions.title"
      :message="modalOptions.message"
      :confirm-text="modalOptions.confirmText"
      :variant="modalOptions.variant"
      :loading="modalLoading"
      @confirm="handleModalConfirm"
    />
  </div>
</template>
