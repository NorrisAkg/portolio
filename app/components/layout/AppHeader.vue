<script setup lang="ts">
defineProps<{
  isDark: boolean
  lang: string
}>()
defineEmits<{
  toggleDark: []
  toggleLang: []
  openMenu: []
}>()

const route = useRoute()
const localePath = useLocalePath()
</script>

<template>
  <header class="hdr">
    <div class="hdr-inner">
      <!-- Identity (left) -->
      <NuxtLink :to="localePath('/')" class="hdr-id" title="Norris Akogbede">
        <span class="portrait-mini">
          <AppPortrait :size="36" />
        </span>
        <span class="id-text">
          <span class="name">Norris Akogbede</span>
          <span class="subtitle mt-1">{{ $t('common.subtitle') }}</span>
        </span>
      </NuxtLink>

      <!-- Nav (center) -->
      <nav class="hdr-nav">
        <NuxtLink :to="localePath('/')" :class="{ active: route.path === localePath('/') }">
          {{ $t('nav.home') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/projects')" :class="{ active: route.path.startsWith(localePath('/projects')) }">
          {{ $t('nav.projects') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/blog')" :class="{ active: route.path.startsWith(localePath('/blog')) }">
          {{ $t('nav.blog') }}
        </NuxtLink>
      </nav>

      <!-- Utilities (right) -->
      <div class="hdr-util">
        <span class="status">
          <span class="dot" />
          {{ $t('common.status') }}
        </span>
        <button class="pill-btn" :aria-label="isDark ? 'Light mode' : 'Dark mode'" @click="$emit('toggleDark')">
          <AppIcon :name="isDark ? 'sun' : 'moon'" />
          {{ isDark ? 'DARK' : 'LIGHT' }}
        </button>
        <button class="pill-btn" aria-label="Toggle language" @click="$emit('toggleLang')">
          {{ lang.toUpperCase() }}
        </button>
        <button class="ic-burger" aria-label="Menu" @click="$emit('openMenu')">
          <AppIcon name="menu" />
        </button>
      </div>
    </div>
  </header>
</template>
