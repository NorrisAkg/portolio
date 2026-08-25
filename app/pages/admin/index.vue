<script setup lang="ts">
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

// Deletion dialog state (Articles)
const articleToDelete = ref<{ id: string; title: string } | null>(null)
const isDeleting = ref(false)

const confirmDelete = (id: string, title: string) => {
  articleToDelete.value = { id, title }
}

const cancelDelete = () => {
  articleToDelete.value = null
}

const handleDelete = async () => {
  if (!articleToDelete.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/articles/${articleToDelete.value.id}`, {
      method: 'DELETE',
    })
    await refreshPublished()
    await refreshDrafts()
    articleToDelete.value = null
  } catch (err: unknown) {
    alert(formatApiError(err, 'Erreur lors de la suppression de l\'article.'))
  } finally {
    isDeleting.value = false
  }
}

// Publish article action
const handlePublish = async (id: string) => {
  try {
    await $fetch(`/api/articles/${id}/publish`, {
      method: 'POST',
    })
    await refreshPublished()
    await refreshDrafts()
  } catch (err: unknown) {
    alert(formatApiError(err, 'Erreur lors de la publication de l\'article.'))
  }
}

// Unpublish article action
const handleUnpublish = async (id: string) => {
  try {
    await $fetch(`/api/articles/${id}/unpublish`, {
      method: 'POST',
    })
    await refreshPublished()
    await refreshDrafts()
  } catch (err: unknown) {
    alert(formatApiError(err, 'Erreur lors de la dépublication de l\'article.'))
  }
}

// Project actions (Publish / Unpublish)
const handlePublishProject = async (id: string) => {
  try {
    await $fetch(`/api/projects/${id}/publish`, {
      method: 'POST',
    })
    await refreshPublishedProjects()
    await refreshDraftProjects()
  } catch (err: unknown) {
    alert(formatApiError(err, 'Erreur lors de la publication du projet.'))
  }
}

const handleUnpublishProject = async (id: string) => {
  try {
    await $fetch(`/api/projects/${id}/unpublish`, {
      method: 'POST',
    })
    await refreshPublishedProjects()
    await refreshDraftProjects()
  } catch (err: unknown) {
    alert(formatApiError(err, 'Erreur lors de la dépublication du projet.'))
  }
}

// Project Deletion Dialog State
const projectToDelete = ref<{ id: string; name: string } | null>(null)
const isDeletingProject = ref(false)

const confirmDeleteProject = (id: string, name: string) => {
  projectToDelete.value = { id, name }
}

const cancelDeleteProject = () => {
  projectToDelete.value = null
}

const handleDeleteProject = async () => {
  if (!projectToDelete.value) return
  isDeletingProject.value = true
  try {
    await $fetch(`/api/projects/${projectToDelete.value.id}`, {
      method: 'DELETE',
    })
    await refreshPublishedProjects()
    await refreshDraftProjects()
    projectToDelete.value = null
  } catch (err: unknown) {
    alert(formatApiError(err, 'Erreur lors de la suppression du projet.'))
  } finally {
    isDeletingProject.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="flex items-center justify-between border-b border-border pb-5">
      <div>
        <h1 class="font-['Montserrat'] font-bold text-3xl tracking-tight text-navy dark:text-white m-0">Tableau de bord</h1>
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

    <!-- ARTICLES CONTENT -->
    <div v-if="activeTab === 'articles'" class="space-y-6">
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

      <!-- Articles Table -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border rounded-2xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/40 text-xs font-['JetBrains_Mono'] tracking-wider uppercase text-muted border-b border-border">
              <th class="p-4 pl-6">Titre de l'article</th>
              <th class="p-4">Tag</th>
              <th class="p-4">Date</th>
              <th class="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="(activeArticleSubTab === 'published' ? publishedArticles : draftArticles).length === 0">
              <td colspan="4" class="p-8 text-center text-sm text-muted">
                Aucun article dans cette section.
              </td>
            </tr>
            <tr
              v-for="art in (activeArticleSubTab === 'published' ? publishedArticles : draftArticles)"
              :key="art.id"
              class="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
            >
              <td class="p-4 pl-6 font-semibold text-navy dark:text-[#E8ECF5]">
                <NuxtLink :to="localePath(`/blog/${art.slug}`)" target="_blank" class="hover:text-orange transition-colors inline-flex items-center gap-1.5">
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
                  @click="handleUnpublish(art.id)"
                >
                  🔒
                </button>
                <!-- Publish Button (for drafts) -->
                <button
                  v-else
                  title="Publier l'article"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                  @click="handlePublish(art.id)"
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
                  @click="confirmDelete(art.id, art.title)"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PROJECTS CONTENT -->
    <div v-if="activeTab === 'projects'" class="space-y-6">
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

      <!-- Projects Table -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border rounded-2xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/40 text-xs font-['JetBrains_Mono'] tracking-wider uppercase text-muted border-b border-border">
              <th class="p-4 pl-6">Nom du Projet</th>
              <th class="p-4">Année</th>
              <th class="p-4">Mise en avant</th>
              <th class="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="(activeProjectSubTab === 'published' ? publishedProjects : draftProjects).length === 0">
              <td colspan="4" class="p-8 text-center text-sm text-muted">
                Aucun projet dans cette section.
              </td>
            </tr>
            <tr
              v-for="p in (activeProjectSubTab === 'published' ? publishedProjects : draftProjects)"
              :key="p.id"
              class="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
            >
              <td class="p-4 pl-6 font-semibold text-navy dark:text-[#E8ECF5]">
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
                  @click="handleUnpublishProject(p.id)"
                >
                  🔒
                </button>
                <!-- Publish Button (for drafts) -->
                <button
                  v-else
                  title="Publier le projet"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                  @click="handlePublishProject(p.id)"
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
                  @click="confirmDeleteProject(p.id, p.name)"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="articleToDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-[#0A0F1A] border border-border p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
        <h3 class="font-['Montserrat'] font-bold text-lg text-navy dark:text-white m-0">Confirmer la suppression</h3>
        <p class="text-sm text-muted">
          Êtes-vous sûr de vouloir supprimer l'article <strong class="text-navy dark:text-white">"{{ articleToDelete.title }}"</strong> ? Cette action est irréversible.
        </p>
        <div class="flex justify-end gap-3 pt-2">
          <button
            :disabled="isDeleting"
            class="h-9 px-4 rounded-lg border border-border text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            @click="cancelDelete"
          >
            Annuler
          </button>
          <button
            :disabled="isDeleting"
            class="h-9 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            @click="handleDelete"
          >
            <span v-if="isDeleting" class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Project Modal -->
    <div v-if="projectToDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-[#0A0F1A] border border-border p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
        <h3 class="font-['Montserrat'] font-bold text-lg text-navy dark:text-white m-0">Confirmer la suppression</h3>
        <p class="text-sm text-muted">
          Êtes-vous sûr de vouloir supprimer le projet <strong class="text-navy dark:text-white">"{{ projectToDelete.name }}"</strong> ? Cette action est irréversible.
        </p>
        <div class="flex justify-end gap-3 pt-2">
          <button
            :disabled="isDeletingProject"
            class="h-9 px-4 rounded-lg border border-border text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            @click="cancelDeleteProject"
          >
            Annuler
          </button>
          <button
            :disabled="isDeletingProject"
            class="h-9 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            @click="handleDeleteProject"
          >
            <span v-if="isDeletingProject" class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
