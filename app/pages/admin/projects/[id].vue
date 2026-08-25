<script setup lang="ts">
import { slugify } from '../../../../shared/utils/slugify'
import type { ProjectProps, TechnologyProps } from '../../../../shared/types/project'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const route = useRoute()
const localePath = useLocalePath()
const router = useRouter()

const idParam = computed(() => route.params.id as string)

// Fetch raw project including all translations & technologies
const { data: rawProject, error: fetchError } = await useFetch<ProjectProps>(`/api/projects/${idParam.value}`)

if (fetchError.value || !rawProject.value) {
  throw createError({ statusCode: 404, statusMessage: 'Projet introuvable', fatal: true })
}

const { data: technologies } = await useFetch<TechnologyProps[]>('/api/technologies')

const year = ref(rawProject.value.year || '')
const dur = ref(rawProject.value.dur || '')
const tone = ref<'warm' | 'cool' | 'navy'>((rawProject.value.tone as 'warm' | 'cool' | 'navy') || 'cool')
const image = ref(rawProject.value.image || '')
const githubUrl = ref(rawProject.value.githubUrl || '')
const liveUrl = ref(rawProject.value.liveUrl || '')
const featured = ref(rawProject.value.featured || false)
const selectedTechIds = ref<string[]>(rawProject.value.technologies?.map(t => t.id) || [])

const activeFormTab = ref<'fr' | 'en'>('fr')

const frTranslation = rawProject.value.translations.find(t => t.locale === 'fr')
const enTranslation = rawProject.value.translations.find(t => t.locale === 'en')

const frForm = ref({
  title: frTranslation?.title || '',
  slug: frTranslation?.slug || '',
  description: frTranslation?.description || '',
  content: frTranslation?.content || '',
  outcome: frTranslation?.outcome || '',
  durationLabel: frTranslation?.durationLabel || '',
})

const enForm = ref({
  title: enTranslation?.title || '',
  slug: enTranslation?.slug || '',
  description: enTranslation?.description || '',
  content: enTranslation?.content || '',
  outcome: enTranslation?.outcome || '',
  durationLabel: enTranslation?.durationLabel || '',
})

const isFrSlugAuto = ref(frForm.value.slug === '')
const isEnSlugAuto = ref(enForm.value.slug === '')

// Watch title to auto-generate slug
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

  if (!year.value.trim()) {
    errorMsg.value = 'L\'année est obligatoire'
    loading.value = false
    return
  }

  if (!dur.value.trim()) {
    errorMsg.value = 'La durée est obligatoire'
    loading.value = false
    return
  }

  const finalFr = hasFr ? { ...frForm.value, locale: 'fr' } : { ...enForm.value, locale: 'fr' }
  const finalEn = hasEn ? { ...enForm.value, locale: 'en' } : { ...frForm.value, locale: 'en' }

  const translations = [finalFr, finalEn]

  try {
    const payload = {
      image: image.value.trim() !== '' ? image.value.trim() : null,
      tone: tone.value,
      year: year.value.trim(),
      dur: dur.value.trim(),
      githubUrl: githubUrl.value.trim() !== '' ? githubUrl.value.trim() : null,
      liveUrl: liveUrl.value.trim() !== '' ? liveUrl.value.trim() : null,
      featured: featured.value,
      translations,
      technologyIds: selectedTechIds.value,
    }

    await $fetch(`/api/projects/${idParam.value}`, {
      method: 'PATCH',
      body: payload,
    })

    router.push(localePath('/admin'))
  } catch (err: unknown) {
    errorMsg.value = formatApiError(err, 'Une erreur est survenue lors de la mise à jour du projet')
  } finally {
    loading.value = false
  }
}

const currentStatus = ref(rawProject.value?.status || 'DRAFT')
const isTogglingStatus = ref(false)

const handleTogglePublish = async () => {
  const projectId = rawProject.value?.id
  if (!projectId) return

  isTogglingStatus.value = true
  try {
    if (currentStatus.value === 'PUBLISHED') {
      await $fetch(`/api/projects/${projectId}/unpublish`, { method: 'POST' })
      currentStatus.value = 'DRAFT'
    } else {
      await $fetch(`/api/projects/${projectId}/publish`, { method: 'POST' })
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
          <span class="text-navy dark:text-white">Modifier le projet</span>
        </nav>
        <div class="flex items-center gap-3">
          <h1 class="font-['Montserrat'] font-bold text-3xl tracking-tight text-navy dark:text-white m-0">Modifier le projet</h1>
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
        <span>{{ currentStatus === 'PUBLISHED' ? '🔒 Dépublier (Passer en brouillon)' : '🌐 Publier le projet' }}</span>
      </button>
    </div>

    <!-- Main Form -->
    <form class="space-y-6" @submit.prevent="handleSave">
      <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/30 text-red-200 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
        <span>⚠️</span>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- General settings -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <h2 class="font-['Montserrat'] font-bold text-base text-navy dark:text-white m-0">Paramètres généraux</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Year -->
          <div class="flex flex-col gap-1.5">
            <label for="year" class="text-xs tracking-wider uppercase text-muted font-medium">Année</label>
            <input
              id="year"
              v-model="year"
              type="text"
              placeholder="2025"
              required
              class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
            />
          </div>

          <!-- Duration (Short) -->
          <div class="flex flex-col gap-1.5">
            <label for="dur" class="text-xs tracking-wider uppercase text-muted font-medium">Durée (court)</label>
            <input
              id="dur"
              v-model="dur"
              type="text"
              placeholder="8w"
              required
              class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
            />
          </div>
        </div>

        <!-- Tone -->
        <div class="flex flex-col gap-1.5">
          <label for="tone" class="text-xs tracking-wider uppercase text-muted font-medium">Palette de couleurs (Tone)</label>
          <select
            id="tone"
            v-model="tone"
            class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
          >
            <option value="cool">Cool (Bleu / Gris)</option>
            <option value="warm">Warm (Orange / Jaune)</option>
            <option value="navy">Navy (Sombre / Bleu nuit)</option>
          </select>
        </div>

        <!-- Image Upload -->
        <AdminImageUpload
          v-model="image"
          label="Image du projet (Téléversement ou URL)"
          placeholder="MARKETPLACE_AGRO_BJ_2025.PNG ou /uploads/..."
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- GitHub URL -->
          <div class="flex flex-col gap-1.5">
            <label for="githubUrl" class="text-xs tracking-wider uppercase text-muted font-medium">URL GitHub (Optionnel)</label>
            <input
              id="githubUrl"
              v-model="githubUrl"
              type="url"
              placeholder="https://github.com/username/project"
              class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
            />
          </div>

          <!-- Live URL -->
          <div class="flex flex-col gap-1.5">
            <label for="liveUrl" class="text-xs tracking-wider uppercase text-muted font-medium">URL Démo / Production (Optionnel)</label>
            <input
              id="liveUrl"
              v-model="liveUrl"
              type="url"
              placeholder="https://myproject.com"
              class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
            />
          </div>
        </div>

        <!-- Featured checkbox -->
        <div class="flex items-center gap-2 pt-2">
          <input
            id="featured"
            v-model="featured"
            type="checkbox"
            class="w-4 h-4 rounded border-border text-orange focus:ring-orange accent-orange"
          />
          <label for="featured" class="text-sm font-medium text-navy dark:text-[#E8ECF5] cursor-pointer">
            Mettre en avant sur la page d'accueil (Featured)
          </label>
        </div>
      </div>

      <!-- Technologies Selection -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 class="font-['Montserrat'] font-bold text-base text-navy dark:text-white m-0">Technologies utilisées</h2>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="tech in technologies"
            :key="tech.id"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors"
            :class="selectedTechIds.includes(tech.id) ? 'border-orange bg-orange/10 text-orange font-semibold' : 'border-border bg-slate-50 dark:bg-slate-900 text-muted hover:border-slate-400'"
          >
            <input
              v-model="selectedTechIds"
              type="checkbox"
              :value="tech.id"
              class="hidden"
            />
            <span>{{ tech.name }}</span>
          </label>
        </div>
      </div>

      <!-- Translations settings tab -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border rounded-2xl shadow-sm overflow-hidden">
        <!-- Tab headers -->
        <div class="flex border-b border-border bg-slate-50/50 dark:bg-slate-900/40">
          <button
            type="button"
            class="h-12 px-6 text-xs uppercase tracking-wider font-bold border-r border-border transition-colors flex items-center gap-2"
            :class="activeFormTab === 'fr' ? 'bg-white dark:bg-[#0A0F1A] text-orange border-b-2 border-b-orange' : 'text-muted hover:text-navy'"
            @click="activeFormTab === 'fr'"
          >
            🇫🇷 Français
          </button>
          <button
            type="button"
            class="h-12 px-6 text-xs uppercase tracking-wider font-bold border-r border-border transition-colors flex items-center gap-2"
            :class="activeFormTab === 'en' ? 'bg-white dark:bg-[#0A0F1A] text-orange border-b-2 border-b-orange' : 'text-muted hover:text-navy'"
            @click="activeFormTab === 'en'"
          >
            🇺🇸 English
          </button>
        </div>

        <!-- Form fields inside tab -->
        <div class="p-6 space-y-5">
          <!-- FR FIELDS -->
          <div v-show="activeFormTab === 'fr'" class="space-y-5">
            <div class="flex flex-col gap-1.5">
              <label for="fr-title" class="text-xs tracking-wider uppercase text-muted font-medium">Titre du projet (FR)</label>
              <input
                id="fr-title"
                v-model="frForm.title"
                type="text"
                placeholder="Marketplace agricole — Bénin"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="fr-slug" class="text-xs tracking-wider uppercase text-muted font-medium">Slug de l'URL</label>
              <input
                id="fr-slug"
                v-model="frForm.slug"
                type="text"
                placeholder="marketplace-agricole-benin"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
                @input="handleFrSlugInput"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="fr-outcome" class="text-xs tracking-wider uppercase text-muted font-medium">Outcome / Résultat clé (FR)</label>
              <input
                id="fr-outcome"
                v-model="frForm.outcome"
                type="text"
                placeholder="+38% marge moyenne"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="fr-durationLabel" class="text-xs tracking-wider uppercase text-muted font-medium">Libellé complet de la durée (FR)</label>
              <input
                id="fr-durationLabel"
                v-model="frForm.durationLabel"
                type="text"
                placeholder="8 semaines · MVP → production"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="fr-desc" class="text-xs tracking-wider uppercase text-muted font-medium">Description / Problème (FR)</label>
              <textarea
                id="fr-desc"
                v-model="frForm.description"
                rows="3"
                placeholder="Plateforme de mise en relation directe producteurs-acheteurs..."
                class="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors resize-none"
              ></textarea>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="fr-content" class="text-xs tracking-wider uppercase text-muted font-medium">Étude de cas détaillée (Markdown FR)</label>
              <textarea
                id="fr-content"
                v-model="frForm.content"
                rows="8"
                placeholder="Détails de l'architecture, défis relevés et solutions techniques..."
                class="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] font-mono focus:outline-none focus:border-orange transition-colors"
              ></textarea>
            </div>
          </div>

          <!-- EN FIELDS -->
          <div v-show="activeFormTab === 'en'" class="space-y-5">
            <div class="flex flex-col gap-1.5">
              <label for="en-title" class="text-xs tracking-wider uppercase text-muted font-medium">Project Title (EN)</label>
              <input
                id="en-title"
                v-model="enForm.title"
                type="text"
                placeholder="Agricultural Marketplace — Benin"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-slug" class="text-xs tracking-wider uppercase text-muted font-medium">URL Slug (EN)</label>
              <input
                id="en-slug"
                v-model="enForm.slug"
                type="text"
                placeholder="agricultural-marketplace-benin"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
                @input="handleEnSlugInput"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-outcome" class="text-xs tracking-wider uppercase text-muted font-medium">Outcome / Key Result (EN)</label>
              <input
                id="en-outcome"
                v-model="enForm.outcome"
                type="text"
                placeholder="+38% average margin"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-durationLabel" class="text-xs tracking-wider uppercase text-muted font-medium">Duration Label (EN)</label>
              <input
                id="en-durationLabel"
                v-model="enForm.durationLabel"
                type="text"
                placeholder="8 weeks · MVP → production"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-desc" class="text-xs tracking-wider uppercase text-muted font-medium">Description / Problem (EN)</label>
              <textarea
                id="en-desc"
                v-model="enForm.description"
                rows="3"
                placeholder="Direct connecting platform for producers and buyers..."
                class="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors resize-none"
              ></textarea>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-content" class="text-xs tracking-wider uppercase text-muted font-medium">Detailed Case Study (Markdown EN)</label>
              <textarea
                id="en-content"
                v-model="enForm.content"
                rows="8"
                placeholder="Architecture details, challenges overcome and tech solutions..."
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
