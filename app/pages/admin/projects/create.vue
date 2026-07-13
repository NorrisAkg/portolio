<script setup lang="ts">
import { slugify } from '../../../../shared/utils/slugify'

import type { TechnologyProps } from '../../../../shared/types/project'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const localePath = useLocalePath()
const router = useRouter()

const year = ref('')
const dur = ref('')
const tone = ref<'warm' | 'cool' | 'navy'>('cool')
const image = ref('')
const githubUrl = ref('')
const liveUrl = ref('')
const featured = ref(false)
const selectedTechIds = ref<string[]>([])

const { data: technologies } = await useFetch<TechnologyProps[]>('/api/technologies')

const activeFormTab = ref<'fr' | 'en'>('fr')

const frForm = ref({
  title: '',
  slug: '',
  description: '',
  content: '',
  outcome: '',
  durationLabel: '',
})

const enForm = ref({
  title: '',
  slug: '',
  description: '',
  content: '',
  outcome: '',
  durationLabel: '',
})

const isFrSlugAuto = ref(true)
const isEnSlugAuto = ref(true)

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

  // Fallback copies to prevent empty data for second language if user only filled one
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

    await $fetch('/api/projects', {
      method: 'POST',
      body: payload,
    })

    router.push(localePath('/admin'))
  } catch (err: unknown) {
    const error = err as { data?: { statusMessage?: string }; message?: string }
    errorMsg.value = error.data?.statusMessage || error.message || 'Une erreur est survenue lors de la création du projet'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Breadcrumb & Title -->
    <div class="space-y-2 border-b border-border pb-5">
      <nav class="flex items-center gap-2 font-['JetBrains_Mono'] text-[10px] tracking-[0.1em] uppercase text-muted" aria-label="breadcrumb">
        <NuxtLink :to="localePath('/admin')" class="hover:text-orange transition-colors">Dashboard</NuxtLink>
        <span class="text-border">/</span>
        <span class="text-navy dark:text-white">Créer un projet</span>
      </nav>
      <h1 class="font-['Montserrat'] font-bold text-3xl tracking-tight text-navy dark:text-white m-0">Créer un projet</h1>
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <!-- Image Label -->
          <div class="flex flex-col gap-1.5">
            <label for="image" class="text-xs tracking-wider uppercase text-muted font-medium">Libellé de l'image (Mockup SVG)</label>
            <input
              id="image"
              v-model="image"
              type="text"
              placeholder="MARKETPLACE_AGRO_BJ_2025.PNG"
              class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
            />
          </div>
        </div>

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
            <label for="liveUrl" class="text-xs tracking-wider uppercase text-muted font-medium">URL Démo Live (Optionnel)</label>
            <input
              id="liveUrl"
              v-model="liveUrl"
              type="url"
              placeholder="https://project.live"
              class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
            />
          </div>
        </div>

        <!-- Featured -->
        <div class="flex items-center gap-3 pt-2">
          <input
            id="featured"
            v-model="featured"
            type="checkbox"
            class="h-4 w-4 rounded border-border text-orange focus:ring-orange bg-slate-50 dark:bg-slate-900"
          />
          <label for="featured" class="text-xs tracking-wider uppercase text-muted font-semibold cursor-pointer select-none">Mettre en avant ce projet sur la page d'accueil</label>
        </div>
      </div>

      <!-- Technologies -->
      <div class="bg-white dark:bg-[#0A0F1A] border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 class="font-['Montserrat'] font-bold text-base text-navy dark:text-white m-0">Technologies associées</h2>
        <div v-if="technologies && technologies.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <label
            v-for="tech in technologies"
            :key="tech.id"
            class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg cursor-pointer hover:border-orange/50 transition-colors select-none"
          >
            <input
              v-model="selectedTechIds"
              type="checkbox"
              :value="tech.id"
              class="rounded text-orange focus:ring-orange border-border"
            />
            <span class="text-xs text-navy dark:text-[#E8ECF5] font-medium">{{ tech.name }}</span>
          </label>
        </div>
        <div v-else class="text-xs text-muted">
          Chargement des technologies...
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
              <label for="fr-title" class="text-xs tracking-wider uppercase text-muted font-medium">Titre du Projet</label>
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
                placeholder="agricultural-marketplace-bj"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
                @input="handleFrSlugInput"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="fr-desc" class="text-xs tracking-wider uppercase text-muted font-medium">Description (Problème)</label>
              <textarea
                id="fr-desc"
                v-model="frForm.description"
                rows="3"
                placeholder="Résumé du problème business résolu par le projet..."
                class="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="fr-outcome" class="text-xs tracking-wider uppercase text-muted font-medium">Résultat (Outcome)</label>
                <input
                  id="fr-outcome"
                  v-model="frForm.outcome"
                  type="text"
                  placeholder="+38% de marge moyenne pour les producteurs"
                  class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="fr-durationLabel" class="text-xs tracking-wider uppercase text-muted font-medium">Libellé de durée détaillé</label>
                <input
                  id="fr-durationLabel"
                  v-model="frForm.durationLabel"
                  type="text"
                  placeholder="8 semaines · MVP → production"
                  class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="fr-content" class="text-xs tracking-wider uppercase text-muted font-medium">Description détaillée (Markdown)</label>
              <textarea
                id="fr-content"
                v-model="frForm.content"
                rows="12"
                placeholder="Rédigez la description détaillée en Markdown. Utilisez ## pour les titres, * pour le gras, etc."
                class="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] font-mono focus:outline-none focus:border-orange transition-colors"
              ></textarea>
            </div>
          </div>

          <!-- EN FIELDS -->
          <div v-show="activeFormTab === 'en'" class="space-y-5">
            <div class="flex flex-col gap-1.5">
              <label for="en-title" class="text-xs tracking-wider uppercase text-muted font-medium">Project Title</label>
              <input
                id="en-title"
                v-model="enForm.title"
                type="text"
                placeholder="Agricultural marketplace — Benin"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-slug" class="text-xs tracking-wider uppercase text-muted font-medium">URL Slug</label>
              <input
                id="en-slug"
                v-model="enForm.slug"
                type="text"
                placeholder="agricultural-marketplace-en"
                class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
                @input="handleEnSlugInput"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-desc" class="text-xs tracking-wider uppercase text-muted font-medium">Description (Problem)</label>
              <textarea
                id="en-desc"
                v-model="enForm.description"
                rows="3"
                placeholder="Short summary of the problem solved..."
                class="p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="en-outcome" class="text-xs tracking-wider uppercase text-muted font-medium">Outcome</label>
                <input
                  id="en-outcome"
                  v-model="enForm.outcome"
                  type="text"
                  placeholder="+38% average margin for producers"
                  class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label for="en-durationLabel" class="text-xs tracking-wider uppercase text-muted font-medium">Detailed Duration Label</label>
                <input
                  id="en-durationLabel"
                  v-model="enForm.durationLabel"
                  type="text"
                  placeholder="8 weeks · MVP → production"
                  class="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="en-content" class="text-xs tracking-wider uppercase text-muted font-medium">Detailed Content (Markdown)</label>
              <textarea
                id="en-content"
                v-model="enForm.content"
                rows="12"
                placeholder="Write the detailed writeup in Markdown..."
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
          Enregistrer le projet
        </button>
      </div>
    </form>
  </div>
</template>
