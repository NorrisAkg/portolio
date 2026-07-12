<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { getArticlesList } = useArticles()
const localePath = useLocalePath()

// Fetch articles list with different statuses
const { articles: publishedArticles, refresh: refreshPublished } = await getArticlesList({ status: 'PUBLISHED' })
const { articles: draftArticles, refresh: refreshDrafts } = await getArticlesList({ status: 'DRAFT' })

const activeTab = ref<'articles' | 'projects'>('articles')
const activeArticleSubTab = ref<'published' | 'drafts'>('published')

// Deletion dialog state
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
  } catch {
    alert('Erreur lors de la suppression de l\'article.')
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
  } catch {
    alert('Erreur lors de la publication de l\'article.')
  }
}

const { getProjectsList } = useProjects()
const { projects: realProjects } = await getProjectsList()
const mockProjects = computed(() => realProjects.value.map(p => ({
  id: p.id,
  name: p.name,
  year: p.year,
  status: p.featured ? 'FEATURED' : 'ACTIVE',
})))
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
          <span>+</span> Nouveau Blog
        </NuxtLink>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex gap-2 border-b border-border p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl w-fit">
      <button
        class="h-9 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
        :class="activeTab === 'articles' ? 'bg-white dark:bg-[#0A0F1A] text-orange shadow-sm' : 'text-muted hover:text-navy'"
        @click="activeTab = 'articles'"
      >
        Blog (Articles)
      </button>
      <button
        class="h-9 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
        :class="activeTab === 'projects' ? 'bg-white dark:bg-[#0A0F1A] text-orange shadow-sm' : 'text-muted hover:text-navy'"
        @click="activeTab = 'projects'"
      >
        Projets (Mock)
      </button>
    </div>

    <!-- ARTICLES CONTENT -->
    <div v-if="activeTab === 'articles'" class="space-y-6">
      <!-- Subtabs: Published / Drafts -->
      <div class="flex gap-4 items-center">
        <button
          class="relative pb-2 text-xs uppercase tracking-wider font-bold transition-colors"
          :class="activeArticleSubTab === 'published' ? 'text-orange' : 'text-muted hover:text-navy'"
          @click="activeArticleSubTab = 'published'"
        >
          Publiés ({{ publishedArticles.length }})
          <span v-if="activeArticleSubTab === 'published'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange"></span>
        </button>
        <button
          class="relative pb-2 text-xs uppercase tracking-wider font-bold transition-colors"
          :class="activeArticleSubTab === 'drafts' ? 'text-orange' : 'text-muted hover:text-navy'"
          @click="activeArticleSubTab = 'drafts'"
        >
          Brouillons ({{ draftArticles.length }})
          <span v-if="activeArticleSubTab === 'drafts'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange"></span>
        </button>
      </div>

      <!-- Articles list container -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border rounded-2xl overflow-hidden shadow-sm">
        <!-- Empty States -->
        <div v-if="activeArticleSubTab === 'published' && publishedArticles.length === 0" class="p-12 text-center text-muted text-sm">
          Aucun article publié. Créez-en un et cliquez sur "Publier".
        </div>
        <div v-else-if="activeArticleSubTab === 'drafts' && draftArticles.length === 0" class="p-12 text-center text-muted text-sm">
          Aucun brouillon.
        </div>

        <!-- Table -->
        <table v-else class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/40 text-xs font-['JetBrains_Mono'] tracking-wider uppercase text-muted border-b border-border">
              <th class="p-4 pl-6">Index</th>
              <th class="p-4">Titre</th>
              <th class="p-4">Catégorie</th>
              <th class="p-4">Date</th>
              <th class="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="art in (activeArticleSubTab === 'published' ? publishedArticles : draftArticles)"
              :key="art.id"
              class="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
            >
              <td class="p-4 pl-6 font-['JetBrains_Mono'] text-xs text-muted">
                #{{ String(art.idx + 1).padStart(2, '0') }}
              </td>
              <td class="p-4 font-semibold text-navy dark:text-[#E8ECF5]">
                {{ art.title }}
              </td>
              <td class="p-4">
                <span class="text-xs font-bold text-orange uppercase tracking-wider">{{ art.tag }}</span>
              </td>
              <td class="p-4 text-xs text-muted">
                {{ art.date }}
              </td>
              <td class="p-4 text-right pr-6 space-x-2">
                <!-- Publish Button (only for drafts) -->
                <button
                  v-if="activeArticleSubTab === 'drafts'"
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

      <div class="bg-white dark:bg-[#0A0F1A] border border-border rounded-2xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/40 text-xs font-['JetBrains_Mono'] tracking-wider uppercase text-muted border-b border-border">
              <th class="p-4 pl-6">Nom du Projet</th>
              <th class="p-4">Année</th>
              <th class="p-4">Statut</th>
              <th class="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="p in mockProjects"
              :key="p.id"
              class="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors"
            >
              <td class="p-4 pl-6 font-semibold text-navy dark:text-[#E8ECF5]">
                {{ p.name }}
              </td>
              <td class="p-4 text-xs text-muted">
                {{ p.year }}
              </td>
              <td class="p-4">
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                  :class="p.status === 'FEATURED' ? 'bg-orange/10 text-orange' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'"
                >
                  {{ p.status }}
                </span>
              </td>
              <td class="p-4 text-right pr-6">
                <button disabled class="opacity-30 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-500/10 text-slate-500 cursor-not-allowed">✏️</button>
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
  </div>
</template>
