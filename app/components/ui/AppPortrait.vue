<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number }>(), { size: 76 })
const gradId = computed(() => `pg${props.size}`)
</script>

<template>
  <svg viewBox="0 0 80 80" :width="props.size" :height="props.size" aria-hidden="true">
    <defs>
      <linearGradient :id="gradId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1B2A4A" />
        <stop offset="1" stop-color="#3B4D75" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" :fill="`url(#${gradId})`" />
    <circle cx="40" cy="32" r="11" fill="#F4A623" opacity=".95" />
    <path d="M14 80c2-14 12-22 26-22s24 8 26 22z" fill="#F4A623" opacity=".95" />
    <text
      x="40" y="46"
      text-anchor="middle"
      font-family="Montserrat,sans-serif"
      font-weight="700"
      font-size="11"
      fill="#1B2A4A"
      letter-spacing="0.1em"
    >NA</text>
  </svg>
</template>
