<script setup lang="ts">
defineProps<{
  name: string
  year: string
  dur: string
  problem: string
  bullets: [string, string][]
  tone?: 'warm' | 'cool' | 'navy'
  label?: string
  reverse?: boolean
  readCaseLabel?: string
  to?: string
}>()
</script>

<template>
  <article
    class="grid grid-cols-2 gap-12 items-center max-sm:grid-cols-1 max-sm:gap-5"
    :class="{ '[direction:rtl]': reverse }"
  >
    <div class="[direction:ltr]">
      <div class="text-[11px] tracking-[0.18em] uppercase text-muted font-medium mb-3 flex gap-3.5 items-center">
        <span class="text-navy dark:text-[#E8ECF5] font-[tabular-nums]">{{ year }}</span>
        <span>·</span>
        <span>{{ dur }}</span>
      </div>
      <h3 class="font-['Montserrat'] font-bold text-[26px] leading-[1.2] text-navy dark:text-[#E8ECF5] m-0 mb-2.5 tracking-[-0.01em]">{{ name }}</h3>
      <p class="text-muted text-base mb-4.5 leading-[1.55] m-0 mb-[18px]">{{ problem }}</p>
      <ul class="list-none p-0 m-0 mb-5 flex flex-col gap-2">
        <li
          v-for="([key, val], i) in bullets"
          :key="i"
          class="text-sm text-[#2D2D2D] dark:text-[#E8EAEE] grid grid-cols-[80px_1fr] gap-3.5 items-baseline"
        >
          <span class="text-[11px] tracking-[0.12em] uppercase text-muted font-medium">{{ key }}</span>
          <span>{{ val }}</span>
        </li>
      </ul>
      <NuxtLink v-if="to" :to="to" class="text-orange text-sm font-medium inline-flex items-center gap-1.5 transition-[gap] duration-200 hover:gap-2.5">
        {{ readCaseLabel }} <AppIcon name="arrow" />
      </NuxtLink>
      <a v-else href="#" class="text-orange text-sm font-medium inline-flex items-center gap-1.5 transition-[gap] duration-200 hover:gap-2.5">
        {{ readCaseLabel }} <AppIcon name="arrow" />
      </a>
    </div>
    <div class="[direction:ltr]">
      <ProjectImage :tone="tone" :label="label" />
    </div>
  </article>
</template>
