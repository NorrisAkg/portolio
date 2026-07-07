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
  <header
    class="sticky top-0 z-40 h-[72px] border-b border-border bg-white/[0.88] dark:bg-[#0A0F1A]/80 backdrop-blur-[12px] backdrop-saturate-[140%]"
  >
    <div class="max-w-[1120px] h-full mx-auto px-12 grid grid-cols-[1fr_auto_1fr] items-center gap-6 max-lg:px-8 max-sm:px-5">

      <!-- Identity (left) -->
      <NuxtLink :to="localePath('/')" class="flex items-center gap-3 min-w-0 justify-self-start" title="Norris Akogbede">
        <span class="w-9 h-9 rounded-full overflow-hidden border border-border bg-[#dfe4ec] flex-shrink-0">
          <AppPortrait :size="36" />
        </span>
        <span class="flex flex-col leading-[1.15] min-w-0">
          <span class="font-['Montserrat'] font-bold text-sm text-navy dark:text-[#E8ECF5] tracking-[-0.01em] whitespace-nowrap">Norris Akogbede</span>
          <span class="text-[10px] tracking-[0.14em] uppercase text-muted font-medium whitespace-nowrap mt-px max-sm:hidden">{{ $t('common.subtitle') }}</span>
        </span>
      </NuxtLink>

      <!-- Nav (center) -->
      <nav class="flex items-center gap-1 justify-self-center max-sm:hidden">
        <NuxtLink
          :to="localePath('/')"
          class="relative px-3.5 py-2 rounded-lg text-sm text-[#2D2D2D] dark:text-[#E8EAEE] font-medium transition-[color,background] duration-[180ms] hover:text-navy hover:bg-orange/[0.08]"
          :class="{ 'text-navy after:absolute after:left-3.5 after:right-3.5 after:bottom-0.5 after:h-0.5 after:bg-orange after:rounded': route.path === localePath('/') }"
        >
          {{ $t('nav.home') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/projects')"
          class="relative px-3.5 py-2 rounded-lg text-sm text-[#2D2D2D] dark:text-[#E8EAEE] font-medium transition-[color,background] duration-[180ms] hover:text-navy hover:bg-orange/[0.08]"
          :class="{ 'text-navy after:absolute after:left-3.5 after:right-3.5 after:bottom-0.5 after:h-0.5 after:bg-orange after:rounded': route.path.startsWith(localePath('/projects')) }"
        >
          {{ $t('nav.projects') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/blog')"
          class="relative px-3.5 py-2 rounded-lg text-sm text-[#2D2D2D] dark:text-[#E8EAEE] font-medium transition-[color,background] duration-[180ms] hover:text-navy hover:bg-orange/[0.08]"
          :class="{ 'text-navy after:absolute after:left-3.5 after:right-3.5 after:bottom-0.5 after:h-0.5 after:bg-orange after:rounded': route.path.startsWith(localePath('/blog')) }"
        >
          {{ $t('nav.blog') }}
        </NuxtLink>
      </nav>

      <!-- Utilities (right) -->
      <div class="flex items-center gap-2 justify-self-end">
        <!-- Status pill -->
        <span class="inline-flex items-center gap-2 bg-white dark:bg-[#0A0F1A] border border-border rounded-full px-2.5 py-[6px] text-[11px] text-[#2D2D2D] dark:text-[#E8EAEE] shadow-[0_1px_2px_rgba(15,23,42,0.04)] self-start max-sm:hidden">
          <span class="w-[6px] h-[6px] rounded-full bg-green shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
          {{ $t('common.status') }}
        </span>
        <button
          class="inline-flex items-center justify-center gap-1.5 h-[30px] rounded-full px-3 bg-white dark:bg-[#0A0F1A] border border-border text-[10px] tracking-[0.1em] uppercase text-[#2D2D2D] dark:text-[#E8EAEE] font-medium transition-[border-color] duration-[180ms] hover:border-navy max-sm:hidden"
          :aria-label="isDark ? 'Light mode' : 'Dark mode'"
          @click="$emit('toggleDark')"
        >
          <AppIcon :name="isDark ? 'sun' : 'moon'" class="w-[13px] h-[13px]" />
          {{ isDark ? 'DARK' : 'LIGHT' }}
        </button>
        <button
          class="inline-flex items-center justify-center gap-1.5 h-[30px] rounded-full px-3 bg-white dark:bg-[#0A0F1A] border border-border text-[10px] tracking-[0.1em] uppercase text-[#2D2D2D] dark:text-[#E8EAEE] font-medium transition-[border-color] duration-[180ms] hover:border-navy max-sm:hidden"
          aria-label="Toggle language"
          @click="$emit('toggleLang')"
        >
          {{ lang.toUpperCase() }}
        </button>
        <!-- Burger (mobile only) -->
        <button
          class="hidden w-9 h-9 rounded-lg bg-white dark:bg-[#0A0F1A] border border-border items-center justify-center text-[#2D2D2D] dark:text-[#E8EAEE] max-sm:flex"
          aria-label="Menu"
          @click="$emit('openMenu')"
        >
          <AppIcon name="menu" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
</template>
