<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'success' | 'info'
    loading?: boolean
  }>(),
  {
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    variant: 'danger',
    loading: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm' | 'cancel'): void
}>()

const handleClose = () => {
  if (props.loading) return
  emit('update:modelValue', false)
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}

// Icon based on variant
const variantIcon = computed(() => {
  switch (props.variant) {
    case 'danger':
      return '🗑️'
    case 'warning':
      return '🔒'
    case 'success':
      return '🌐'
    default:
      return 'ℹ️'
  }
})

// Styles based on variant
const buttonStyles = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20'
    case 'warning':
      return 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/20'
    case 'success':
      return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
    default:
      return 'bg-orange hover:bg-orange/90 text-slate-950 shadow-orange/20'
  }
})

const iconBgStyles = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
    case 'warning':
      return 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
    case 'success':
      return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
    default:
      return 'bg-orange/10 text-orange border border-orange/20'
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      @click.self="handleClose"
    >
      <div
        class="bg-white dark:bg-[#0A0F1A] border border-border p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-5 transition-all scale-100"
      >
        <!-- Header with Icon & Title -->
        <div class="flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            :class="iconBgStyles"
          >
            <span>{{ variantIcon }}</span>
          </div>
          <div class="space-y-1">
            <h3 class="font-['Montserrat'] font-bold text-lg text-navy dark:text-white m-0">
              {{ title }}
            </h3>
            <p class="text-sm text-muted leading-relaxed">
              {{ message }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            :disabled="loading"
            class="h-9 px-4 rounded-lg border border-border text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors disabled:opacity-50"
            @click="handleClose"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            :disabled="loading"
            class="h-9 px-4 rounded-lg text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
            :class="buttonStyles"
            @click="handleConfirm"
          >
            <span
              v-if="loading"
              class="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent"
            ></span>
            <span>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
