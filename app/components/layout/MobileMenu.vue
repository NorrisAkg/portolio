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
  <div
    class="fixed inset-0 z-60 bg-white dark:bg-[#0A0F1A] p-6 pb-8 flex flex-col gap-6 transition-transform duration-[350ms] ease-[cubic-bezier(.2,.7,.2,1)] overflow-y-auto"
    :class="open ? 'translate-y-0' : '-translate-y-full'"
  >
    <!-- Head -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-3 min-w-0">
        <span class="w-9 h-9 rounded-full overflow-hidden border border-border flex-shrink-0">
          <AppPortrait :size="36" />
        </span>
        <span class="flex flex-col leading-[1.15] min-w-0">
          <span class="font-['Montserrat'] font-bold text-sm text-navy dark:text-[#E8ECF5] tracking-[-0.01em] whitespace-nowrap">Norris Akogbede</span>
          <span class="text-[10px] tracking-[0.14em] uppercase text-muted font-medium whitespace-nowrap">{{ $t('common.subtitle') }}</span>
        </span>
      </div>
      <button
        class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-[#0A0F1A] border border-border"
        aria-label="Close menu"
        @click="$emit('close')"
      >
        <AppIcon name="close" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex flex-col gap-1.5 mt-3">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.id"
        :to="localePath(link.to)"
        class="flex justify-between items-center p-4 rounded-[10px] font-['Montserrat'] font-bold text-[22px] text-navy dark:text-[#E8ECF5] border border-border bg-sidebar dark:bg-[#0F1626]"
        @click="$emit('close')"
      >
        <span>{{ lang === 'fr' ? link.labelFr : link.labelEn }}</span>
        <span class="text-orange"><AppIcon name="arrow" /></span>
      </NuxtLink>
    </nav>

    <!-- Utilities -->
    <div class="flex gap-2 mt-2">
      <button
        class="flex-1 h-10 inline-flex items-center justify-center gap-1.5 rounded-full bg-white dark:bg-[#0A0F1A] border border-border text-[11px] tracking-[0.1em] uppercase text-[#2D2D2D] dark:text-[#E8EAEE] font-medium transition-[border-color] duration-[180ms] hover:border-navy"
        @click="$emit('toggleDark')"
      >
        <AppIcon :name="isDark ? 'sun' : 'moon'" class="w-[13px] h-[13px]" />
        {{ isDark ? 'DARK' : 'LIGHT' }}
      </button>
      <button
        class="flex-1 h-10 inline-flex items-center justify-center gap-1.5 rounded-full bg-white dark:bg-[#0A0F1A] border border-border text-[11px] tracking-[0.1em] uppercase text-[#2D2D2D] dark:text-[#E8EAEE] font-medium transition-[border-color] duration-[180ms] hover:border-navy"
        @click="$emit('toggleLang')"
      >
        {{ lang.toUpperCase() }}
      </button>
    </div>

    <!-- Socials -->
    <div class="grid grid-cols-7 gap-1.5 mt-2">
      <a
        v-for="soc in [
          { href: '#', label: 'GitHub', icon: 'github' },
          { href: '#', label: 'LinkedIn', icon: 'linkedin' },
          { href: '#', label: 'X', icon: 'x' },
          { href: '#', label: 'Facebook', icon: 'facebook' },
          { href: '#', label: 'Instagram', icon: 'instagram' },
          { href: '#', label: 'TikTok', icon: 'tiktok' },
          { href: 'mailto:hello@norrisakogbede.com', label: 'Email', icon: 'mail' },
        ]"
        :key="soc.label"
        :href="soc.href"
        :aria-label="soc.label"
        class="aspect-square rounded-lg border border-border flex items-center justify-center text-[#2D2D2D] dark:text-[#E8EAEE] transition-[border-color,color,transform,background] duration-[180ms] hover:border-orange hover:text-orange hover:-translate-y-px hover:bg-orange/[0.06]"
      >
        <AppIcon :name="soc.icon" class="w-[13px] h-[13px]" />
      </a>
    </div>
  </div>
</template>
