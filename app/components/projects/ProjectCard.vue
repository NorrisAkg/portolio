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
  <article :class="['project', { reverse }]">
    <div class="proj-text">
      <div class="meta">
        <span class="yr">{{ year }}</span>
        <span>·</span>
        <span>{{ dur }}</span>
      </div>
      <h3>{{ name }}</h3>
      <p class="problem">{{ problem }}</p>
      <ul>
        <li v-for="([key, val], i) in bullets" :key="i">
          <span class="k">{{ key }}</span>
          <span>{{ val }}</span>
        </li>
      </ul>
      <NuxtLink v-if="to" :to="to" class="more">
        {{ readCaseLabel }} <AppIcon name="arrow" />
      </NuxtLink>
      <a v-else href="#" class="more">
        {{ readCaseLabel }} <AppIcon name="arrow" />
      </a>
    </div>
    <ProjectImage :tone="tone" :label="label" />
  </article>
</template>
