<script setup lang="ts">
defineProps<{
  tag: string
  title: string
  excerpt: string
  date: string
  read: string
  to?: string
}>()
</script>

<template>
  <NuxtLink
    :to="to ?? '#'"
    class="grid grid-cols-[160px_1fr_auto] gap-8 items-center py-6 border-b border-border transition-[padding] duration-200 hover:pl-2 group max-sm:grid-cols-1 max-sm:gap-2 max-sm:py-5"
  >
    <span class="font-['JetBrains_Mono'] text-[11px] tracking-[0.08em] text-muted uppercase">{{ date }}</span>
    <div class="flex flex-col gap-1.5 min-w-0">
      <span class="text-[10px] tracking-[0.18em] uppercase text-orange font-semibold">{{ tag }}</span>
      <h4 class="font-['Montserrat'] font-bold text-xl leading-[1.25] text-navy dark:text-[#E8ECF5] m-0 tracking-[-0.01em] transition-colors duration-200 group-hover:text-orange">{{ title }}</h4>
      <p class="text-sm text-muted leading-[1.5] m-0">{{ excerpt }}</p>
    </div>
    <span class="text-xs text-muted whitespace-nowrap inline-flex items-center gap-1.5 max-sm:hidden">
      {{ read }} <AppIcon name="arrow" />
    </span>
  </NuxtLink>
</template>
