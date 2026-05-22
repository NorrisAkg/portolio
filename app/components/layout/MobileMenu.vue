<script setup lang="ts">
defineProps<{
  open: boolean
  lang: string
  isDark: boolean
}>()
defineEmits<{
  close: []
  toggleDark: []
  toggleLang: []
}>()

const localePath = useLocalePath()

const navLinks = computed(() => [
  { id: 'home',     to: '/',         labelFr: 'Accueil', labelEn: 'Home' },
  { id: 'projects', to: '/projects', labelFr: 'Projets', labelEn: 'Projects' },
  { id: 'blog',     to: '/blog',     labelFr: 'Blog',    labelEn: 'Blog' },
])
</script>

<template>
  <div :class="['overlay-v2', { open }]">
    <!-- Head -->
    <div class="ov-head">
      <div class="hdr-id">
        <span class="portrait-mini"><AppPortrait :size="36" /></span>
        <span class="id-text">
          <span class="name">Norris Akogbede</span>
          <span class="subtitle">{{ $t('common.subtitle') }}</span>
        </span>
      </div>
      <button class="pill-btn" style="width:36px;height:36px;padding:0" aria-label="Close menu" @click="$emit('close')">
        <AppIcon name="close" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="ov-nav">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.id"
        :to="localePath(link.to)"
        @click="$emit('close')"
      >
        <span>{{ lang === 'fr' ? link.labelFr : link.labelEn }}</span>
        <span class="ar"><AppIcon name="arrow" /></span>
      </NuxtLink>
    </nav>

    <!-- Utilities -->
    <div class="ov-util">
      <button class="pill-btn" @click="$emit('toggleDark')">
        <AppIcon :name="isDark ? 'sun' : 'moon'" />
        {{ isDark ? 'DARK' : 'LIGHT' }}
      </button>
      <button class="pill-btn" @click="$emit('toggleLang')">
        {{ lang.toUpperCase() }}
      </button>
    </div>

    <!-- Socials -->
    <div class="ov-soc">
      <a class="sq-btn" href="#" aria-label="GitHub"><AppIcon name="github" /></a>
      <a class="sq-btn" href="#" aria-label="LinkedIn"><AppIcon name="linkedin" /></a>
      <a class="sq-btn" href="#" aria-label="X"><AppIcon name="x" /></a>
      <a class="sq-btn" href="#" aria-label="Facebook"><AppIcon name="facebook" /></a>
      <a class="sq-btn" href="#" aria-label="Instagram"><AppIcon name="instagram" /></a>
      <a class="sq-btn" href="#" aria-label="TikTok"><AppIcon name="tiktok" /></a>
      <a class="sq-btn" href="mailto:hello@norrisakogbede.com" aria-label="Email"><AppIcon name="mail" /></a>
    </div>
  </div>
</template>
