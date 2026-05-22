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
  <NuxtLink :to="to ?? '#'" class="blog-card">
    <span class="tag">{{ tag }}</span>
    <h4>{{ title }}</h4>
    <p class="excerpt">{{ excerpt }}</p>
    <div class="meta">
      <span>{{ date }}</span>
      <span class="sep" />
      <span>{{ read }}</span>
    </div>
  </NuxtLink>
</template>
