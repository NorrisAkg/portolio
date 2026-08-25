<script setup lang="ts">
import { formatApiError } from '../../utils/error-formatter'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    helpText?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    label: "Image de couverture",
    helpText: 'Glissez-déposez une image ou cliquez pour parcourir (JPG, PNG, WebP, SVG jusqu\'à 10 Mo)',
    placeholder: 'https://images.unsplash.com/... ou /uploads/...',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadError = ref('')
const inputMode = ref<'upload' | 'url'>('upload')

const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const handleFileDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    uploadFile(file)
  }
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadFile(file)
  }
}

const uploadFile = async (file: File) => {
  uploadError.value = ''
  
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Le fichier sélectionné doit être une image (JPG, PNG, WebP, SVG, GIF).'
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    uploadError.value = 'L\'image dépasse la taille maximale autorisée de 10 Mo.'
    return
  }

  isUploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await $fetch<{ url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    })

    emit('update:modelValue', res.url)
  } catch (err: unknown) {
    uploadError.value = formatApiError(err, 'Erreur lors du téléversement de l\'image')
  } finally {
    isUploading.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

const handleUrlInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const clearImage = () => {
  emit('update:modelValue', '')
  uploadError.value = ''
}

const isPreviewable = computed(() => {
  return (
    props.modelValue &&
    (props.modelValue.startsWith('/') ||
      props.modelValue.startsWith('http://') ||
      props.modelValue.startsWith('https://') ||
      props.modelValue.startsWith('data:'))
  )
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <label class="text-xs tracking-wider uppercase text-muted font-medium">
        {{ label }}
      </label>
      <div class="flex items-center gap-1.5 text-xs">
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors text-xs"
          :class="inputMode === 'upload' ? 'bg-orange/15 text-orange font-semibold' : 'text-muted hover:text-navy dark:hover:text-white'"
          @click="inputMode = 'upload'"
        >
          Fichier local
        </button>
        <span class="text-border">|</span>
        <button
          type="button"
          class="px-2 py-0.5 rounded transition-colors text-xs"
          :class="inputMode === 'url' ? 'bg-orange/15 text-orange font-semibold' : 'text-muted hover:text-navy dark:hover:text-white'"
          @click="inputMode = 'url'"
        >
          URL externe
        </button>
      </div>
    </div>

    <!-- Hidden native file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Upload mode -->
    <div v-if="inputMode === 'upload'" class="space-y-3">
      <!-- Preview card if image exists -->
      <div
        v-if="modelValue"
        class="relative border border-border bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 flex items-center gap-4 group"
      >
        <div class="w-20 h-14 rounded-lg overflow-hidden border border-border bg-slate-200 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
          <img
            v-if="isPreviewable"
            :src="modelValue"
            alt="Preview"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-[10px] text-muted text-center px-1 font-mono break-all">
            {{ modelValue }}
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-xs font-mono text-navy dark:text-white truncate m-0">
            {{ modelValue }}
          </p>
          <p class="text-[11px] text-muted m-0 mt-0.5">
            Image active
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-2.5 py-1.5 rounded-lg border border-border bg-white dark:bg-slate-800 text-xs text-navy dark:text-white hover:border-orange hover:text-orange transition-colors"
            @click="triggerFileSelect"
          >
            Changer
          </button>
          <button
            type="button"
            class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
            title="Supprimer"
            @click="clearImage"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Dropzone when no image or to replace -->
      <div
        v-else
        class="border-2 border-dashed rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer select-none"
        :class="[
          isDragging
            ? 'border-orange bg-orange/5 scale-[0.99]'
            : 'border-border hover:border-orange/60 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/70',
          isUploading ? 'pointer-events-none opacity-60' : ''
        ]"
        @click="triggerFileSelect"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleFileDrop"
      >
        <div class="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange mb-1">
          <svg v-if="!isUploading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span v-else class="animate-spin rounded-full h-5 w-5 border-2 border-orange border-t-transparent"></span>
        </div>

        <div>
          <p class="text-xs font-semibold text-navy dark:text-white m-0">
            {{ isUploading ? 'Téléversement en cours...' : 'Cliquez pour choisir un fichier ou glissez-le ici' }}
          </p>
          <p class="text-[11px] text-muted m-0 mt-1">
            {{ helpText }}
          </p>
        </div>
      </div>
    </div>

    <!-- URL mode -->
    <div v-else class="space-y-3">
      <div class="flex items-center gap-2">
        <input
          :value="modelValue"
          type="text"
          :placeholder="placeholder"
          class="h-10 flex-1 px-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm text-navy dark:text-[#E8ECF5] focus:outline-none focus:border-orange transition-colors"
          @input="handleUrlInput"
        />
        <button
          v-if="modelValue"
          type="button"
          class="h-10 px-3 border border-border rounded-lg text-xs text-red-500 hover:bg-red-500/10 transition-colors"
          @click="clearImage"
        >
          Effacer
        </button>
      </div>

      <!-- Preview if valid URL -->
      <div v-if="isPreviewable" class="relative w-full h-32 rounded-lg overflow-hidden border border-border bg-slate-100 dark:bg-slate-900">
        <img :src="modelValue" alt="Preview" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- Error message if any -->
    <div v-if="uploadError" class="text-xs text-red-500 flex items-center gap-1.5 mt-1">
      <span>⚠️</span>
      <span>{{ uploadError }}</span>
    </div>
  </div>
</template>
