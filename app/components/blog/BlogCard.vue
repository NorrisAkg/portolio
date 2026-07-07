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
    class="border border-border rounded-xl p-6 flex flex-col gap-3.5 transition-[border-color,transform] duration-[180ms] bg-white dark:bg-[#0A0F1A] hover:border-navy hover:-translate-y-0.5"
  >
    <span class="text-[10px] tracking-[0.18em] uppercase text-orange font-semibold">{{ tag }}</span>
    <h4 class="font-['Montserrat'] font-bold text-[18px] leading-[1.3] text-navy dark:text-[#E8ECF5] m-0 tracking-[-0.01em]">{{ title }}</h4>
    <p class="text-sm text-[#2D2D2D] dark:text-[#E8EAEE] leading-[1.55] m-0 flex-1">{{ excerpt }}</p>
    <div class="text-xs text-muted flex gap-2.5 items-center mt-auto pt-2 border-t border-border">
      <span>{{ date }}</span>
      <span class="w-[3px] h-[3px] rounded-full bg-muted opacity-50" />
      <span>{{ read }}</span>
    </div>
  </NuxtLink>
</template>
