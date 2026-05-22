<script setup lang="ts">
const { isOpen, close } = useMobileMenu()
const colorMode = useColorMode()
const { locale, setLocale } = useI18n()

const isDark = computed(() => colorMode.value === 'dark')
const toggleDark = () => { colorMode.preference = isDark.value ? 'light' : 'dark' }
const toggleLang = () => setLocale(locale.value === 'fr' ? 'en' : 'fr')
</script>

<template>
  <div class="app v2">
    <AppHeader
      :is-dark="isDark"
      :lang="locale"
      @toggle-dark="toggleDark"
      @toggle-lang="toggleLang"
      @open-menu="isOpen = true"
    />

    <main class="main">
      <slot />
      <ContactSection />
    </main>

    <AppFooter :lang="locale" />

    <MobileMenu
      :open="isOpen"
      :lang="locale"
      :is-dark="isDark"
      @close="close"
      @toggle-dark="toggleDark"
      @toggle-lang="toggleLang"
    />
  </div>
</template>
