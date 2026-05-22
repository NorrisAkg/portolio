<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg v-if="name === 'moon'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
  <svg v-else-if="name === 'sun'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
  <svg v-else-if="name === 'github'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5 3.3 9.3 7.9 10.8.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.4 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.8C23.5 5.7 18.3.5 12 .5Z" />
  </svg>
  <svg v-else-if="name === 'linkedin'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5V9h3v10Zm-1.5-11.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM19 19h-3v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V19h-3V9h2.9v1.4h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.7V19Z" />
  </svg>
  <svg v-else-if="name === 'x'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2H21l-6.52 7.45L22 22h-6.9l-4.78-6.27L4.8 22H2l7-8L1.5 2h6.96l4.32 5.71L18.244 2Zm-2.42 18h1.91L7.3 4H5.3l10.524 16Z" />
  </svg>
  <svg v-else-if="name === 'mail'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
  <svg v-else-if="name === 'whatsapp'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.05 4.91A10 10 0 0 0 4.93 19.13L4 22l2.93-.91A10 10 0 0 0 19.05 4.91ZM12 20.27a8.27 8.27 0 0 1-4.23-1.16l-.3-.18-2.43.76.78-2.37-.2-.31A8.27 8.27 0 1 1 12 20.27Zm4.55-6.2c-.25-.13-1.47-.72-1.7-.8s-.39-.13-.56.12-.64.8-.79.96-.29.18-.54.06a6.78 6.78 0 0 1-2-1.23 7.5 7.5 0 0 1-1.39-1.72c-.14-.25 0-.38.11-.5s.25-.29.37-.43a1.7 1.7 0 0 0 .25-.41.45.45 0 0 0 0-.43c-.06-.13-.56-1.35-.77-1.85s-.41-.42-.56-.43h-.48a.92.92 0 0 0-.67.31 2.81 2.81 0 0 0-.87 2.08 4.87 4.87 0 0 0 1 2.6 11.18 11.18 0 0 0 4.27 3.78c.6.26 1.07.42 1.43.54a3.46 3.46 0 0 0 1.58.1 2.59 2.59 0 0 0 1.69-1.19 2.1 2.1 0 0 0 .15-1.19c-.07-.11-.23-.18-.48-.31Z" />
  </svg>
  <svg v-else-if="name === 'facebook'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.77l-.44 2.91h-2.33V22c4.78-.78 8.44-4.94 8.44-9.94Z" />
  </svg>
  <svg v-else-if="name === 'instagram'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none" />
  </svg>
  <svg v-else-if="name === 'tiktok'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.6 8.4a6.4 6.4 0 0 1-3.8-1.2v7.6a5.7 5.7 0 1 1-5.7-5.7c.32 0 .63.03.95.08v2.92a2.84 2.84 0 1 0 2 2.71V2h2.86a3.94 3.94 0 0 0 3.7 3.5V8.4Z" />
  </svg>
  <svg v-else-if="name === 'arrow'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
  <svg v-else-if="name === 'menu'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
  <svg v-else-if="name === 'close'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
  <svg v-else-if="name === 'send'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="m22 2-7 20-4-9-9-4 20-7Z" />
  </svg>
  <svg v-else-if="name === 'download'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14" />
  </svg>
</template>
