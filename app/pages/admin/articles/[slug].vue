<script setup lang="ts">
import type { ArticleProps } from '../../../../shared/types/article'
import { slugify } from '../../../../shared/utils/slugify'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const localePath = useLocalePath()
const router = useRouter()

const slugParam = computed(() => route.params.slug as string)


// Fetch raw article including all translations
const { data: rawArticle, error: fetchError } = await useFetch<ArticleProps>(`/api/articles/${slugParam.value}`)

if (fetchError.value || !rawArticle.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article introuvable', fatal: true })
}

const image = ref(rawArticle.value.image || '')
const activeFormTab = ref<'fr' | 'en'>('fr')

const frTranslation = rawArticle.value.translations.find(t => t.locale === 'fr')
const enTranslation = rawArticle.value.translations.find(t => t.locale === 'en')

const frForm = ref({
  title: frTranslation?.title || '',
  slug: frTranslation?.slug || '',
  description: frTranslation?.description || '',
  content: frTranslation?.content || '',
})

const enForm = ref({
  title: enTranslation?.title || '',
  slug: enTranslation?.slug || '',
  description: enTranslation?.description || '',
  content: enTranslation?.content || '',
})

const isFrSlugAuto = ref(frForm.value.slug === '')
const isEnSlugAuto = ref(enForm.value.slug === '')

// Watch title to auto-generate slug if enabled
watch(() => frForm.value.title, (newVal) => {
  if (isFrSlugAuto.value) {
    frForm.value.slug = slugify(newVal)
  }
})

watch(() => enForm.value.title, (newVal) => {
  if (isEnSlugAuto.value) {
    enForm.value.slug = slugify(newVal)
  }
})

const handleFrSlugInput = () => {
  isFrSlugAuto.value = frForm.value.slug === ''
}

const handleEnSlugInput = () => {
  isEnSlugAuto.value = enForm.value.slug === ''
}

const loading = ref(false)
const errorMsg = ref('')

const handleSave = async () => {
  errorMsg.value = ''
  loading.value = true

  const hasFr = frForm.value.title.trim() !== ''
  const hasEn = enForm.value.title.trim() !== ''

  if (!hasFr && !hasEn) {
    errorMsg.value = 'Veuillez remplir au moins une langue (titre obligatoire)'
    loading.value = false
    return
  }

  const finalFr = hasFr ? frForm.value : { ...enForm.value }
  const finalEn = hasEn ? enForm.value : { ...frForm.value }

  const translations = [
    { locale: 'fr', ...finalFr },
    { locale: 'en', ...finalEn },
  ]

  const articleId = rawArticle.value?.id
  if (!articleId) {
    errorMsg.value = 'Article introuvable ou non chargé'
    loading.value = false
    return
  }

  try {
    const payload = {
      image: image.value.trim() !== '' ? image.value.trim() : null,
      translations,
    }

    await $fetch(`/api/articles/${articleId}`, {
      method: 'PATCH',
      body: payload,
    })

    router.push(localePath('/admin'))
  } catch (err: unknown) {
    errorMsg.value = formatApiError(err, 'Une erreur est survenue lors de la mise à jour')
  } finally {
    loading.value = false
  }
}

const currentStatus = ref(rawArticle.value?.status || 'DRAFT')
const isTogglingStatus = ref(false)

const handleTogglePublish = async () => {
  const articleId = rawArticle.value?.id
  if (!articleId) return

  isTogglingStatus.value = true
  try {
    if (currentStatus.value === 'PUBLISHED') {
      await $fetch(`/api/articles/${articleId}/unpublish`, { method: 'POST' })
      currentStatus.value = 'DRAFT'
    } else {
      await $fetch(`/api/articles/${articleId}/publish`, { method: 'POST' })
      currentStatus.value = 'PUBLISHED'
    }
  } catch (err: unknown) {
    errorMsg.value = formatApiError(err, 'Erreur lors du changement de statut')
  } finally {
    isTogglingStatus.value = false
  }
}
</script>

<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Breadcrumb & Title -->
    <div class="flex items-center justify-between border-b border-border pb-5">
      <div class="space-y-2">
        <nav class="flex items-center gap-2 font-['JetBrains_Mono'] text-[10px] tracking-[0.1em] uppercase text-muted" aria-label="breadcrumb">
          <NuxtLink :to="localePath('/admin')" class="hover:text-orange transition-colors">Dashboard</NuxtLink>
          <span class="text-border">/</span>
          <span class="text-navy dark:text-white">Modifier l'article</span>
        </nav>
        <div class="flex items-center gap-3">
          <h1 class="font-['Montserrat'] font-bold text-3xl tracking-tight text-navy dark:text-white m-0">Modifier l'article</h1>
          <span
            class="text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider"
            :class="currentStatus === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'"
          >
            {{ currentStatus === 'PUBLISHED' ? 'Publié' : 'Brouillon' }}
          </span>
        </div>
      </div>

      <!-- Quick toggle status button -->
      <button
        type="button"
        :disabled="isTogglingStatus"
        class="h-9 px-4 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all border"
        :class="currentStatus === 'PUBLISHED'
          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'"
        @click="handleTogglePublish"
      >
        <span v-if="isTogglingStatus" class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-current border-t-transparent"></span>
        <span>{{ currentStatus === 'PUBLISHED' ? '🔒 Dépublier (Passer en brouillon)' : '🌐 Publier l\'article' }}</span>
      </button>
    </div>

    <!-- Main Form -->
    <form class="space-y-6" @submit.prevent="handleSave">
      <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/30 text-red-200 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
        <span>⚠️</span>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- General settings -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 class="font-['Montserrat'] font-bold text-base text-navy dark:text-white m-0">Paramètres généraux</h2>
        <AdminImageUpload
          v-model="image"
          label="Image de couverture"
          placeholder="https://images.unsplash.com/... ou /uploads/..."
        />
      </div>

      <!-- Translations settings tab -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border rounded-2xl shadow-sm overflow-hidden">
        <!-- Tab headers -->
        <div class="flex border-b border-border bg-slate-50/50 dark:bg-slate-900/40">
          <button
            type="button"
            class="h-12 px-6 text-xs uppercase tracking-wider font-bold border-r border-border transition-colors flex items-center gap-2"
            :class="activeFormTab === 'fr' ? 'bg-white dark:bg-[#0A0F1A] text-orange border-b-2 border-b-orange' : 'text-muted hover:text-navy'"
            @click="activeFormTab = 'fr'"
          >
            🇫🇷 Français
          </button>
          <button
            type="button"
            class="h-12 px-6 text-xs uppercase tracking-wider font-bold border-r border-border transition-colors flex items-center gap-2"
            :class="activeFormTab === 'en' ? 'bg-white dark:bg-[#0A0F1A] text-orange border-b-2 border-b-orange' : 'text-muted hover:text-navy'"
            @click="activeFormTab = 'en'"
          >
            🇺🇸 English
          </button>
        </div>

        <!-- Form fields inside tab -->
        <div class="p-6 space-y-5">
          <!-- FR FIELDS -->
          <div v-show="activeFormTab === 'fr'" class="space-y-5">
            <div class="flex flex-col gap-1.5">
              <label for="fr-title" class="text-xs tracking-wider uppercase text-muted font-medium">Titre</label>
              <input
                id="fr-title"
                v-model="frForm.title"
                type="text"
                placeholder="Pourquoi votre MVP n'a pas besoin de blockchain"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="fr-slug" class="text-xs tracking-wider uppercase text-muted font-medium">Slug de l'URL</label>
              <input
                id="fr-slug"
                v-model="frForm.slug"
                type="text"
                placeholder="mvp-blockchain-fr"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
                @input="handleFrSlugInput"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="fr-desc" class="text-xs tracking-wider uppercase text-muted font-medium">Description (Extrait)</label>
              <textarea
                id="fr-desc"
                v-model="frForm.description"
                rows="3"
                placeholder="Résumé court de l'article pour les cartes du blog..."
                class="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors resize-none"
              ></textarea>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="fr-content" class="text-xs tracking-wider uppercase text-muted font-medium">Contenu (Markdown)</label>
              <textarea
                id="fr-content"
                v-model="frForm.content"
                rows="12"
                placeholder="Rédigez l'article en Markdown. Utilisez ## pour les titres, * pour le gras, etc."
                class="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] font-mono focus:outline-none focus:border-orange transition-colors"
              ></textarea>
            </div>
          </div>

          <!-- EN FIELDS -->
          <div v-show="activeFormTab === 'en'" class="space-y-5">
            <div class="flex flex-col gap-1.5">
              <label for="en-title" class="text-xs tracking-wider uppercase text-muted font-medium">Title</label>
              <input
                id="en-title"
                v-model="enForm.title"
                type="text"
                placeholder="Why your MVP doesn't need blockchain"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-slug" class="text-xs tracking-wider uppercase text-muted font-medium">URL Slug</label>
              <input
                id="en-slug"
                v-model="enForm.slug"
                type="text"
                placeholder="mvp-blockchain-en"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
                @input="handleEnSlugInput"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-desc" class="text-xs tracking-wider uppercase text-muted font-medium">Description (Excerpt)</label>
              <textarea
                id="en-desc"
                v-model="enForm.description"
                rows="3"
                placeholder="Short summary of the post..."
                class="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors resize-none"
              ></textarea>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-content" class="text-xs tracking-wider uppercase text-muted font-medium">Content (Markdown)</label>
              <textarea
                id="en-content"
                v-model="enForm.content"
                rows="12"
                placeholder="Write your post in Markdown..."
                class="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] font-mono focus:outline-none focus:border-orange transition-colors"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-3 pb-8">
        <NuxtLink
          :to="localePath('/admin')"
          class="inline-flex items-center justify-center h-10 px-5 rounded-lg border border-border text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        >
          Annuler
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="h-10 px-5 rounded-lg bg-orange text-slate-950 text-sm font-semibold hover:bg-orange/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></span>
          Enregistrer les modifications
        </button>
      </div>
    </form>
  </div>
</template>
