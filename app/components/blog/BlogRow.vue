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
  <NuxtLink :to="to ?? '#'" class="blog-row">
    <span class="date">{{ date }}</span>
    <div class="body">
      <span class="tag">{{ tag }}</span>
      <h4>{{ title }}</h4>
      <p class="excerpt">{{ excerpt }}</p>
    </div>
    <span class="read">{{ read }} <AppIcon name="arrow" /></span>
  </NuxtLink>
</template>
