<script setup lang="ts">
const props = withDefaults(defineProps<{
  tone?: 'warm' | 'cool' | 'navy'
  label?: string
}>(), { tone: 'warm', label: '' })

const palettes = {
  warm: ['#FEF3E2', '#F4A623', '#1B2A4A'],
  cool: ['#EEF2F7', '#1B2A4A', '#F4A623'],
  navy: ['#1B2A4A', '#27365A', '#F4A623'],
}

const bg = computed(() => palettes[props.tone][0])
const stripe = computed(() => palettes[props.tone][1])
const accent = computed(() => palettes[props.tone][2])
const stripeColor = computed(() => props.tone === 'navy' ? 'rgba(255,255,255,0.06)' : 'rgba(27,42,74,0.06)')
const patternId = computed(() => `stripes-${props.tone}-${props.label}`)
const innerBg = computed(() => props.tone === 'navy' ? '#0F1626' : '#fff')
const innerStroke = computed(() => props.tone === 'navy' ? '#1E2638' : '#E5E7EB')
const barFill = computed(() => props.tone === 'navy' ? '#8A93A6' : '#6B7280')
const blockBg = computed(() => props.tone === 'navy' ? '#1E2638' : '#F7F8FA')
</script>

<template>
  <div
    class="aspect-[4/3] rounded-[14px] overflow-hidden border border-border relative"
    :style="{ background: bg }"
  >
    <svg viewBox="0 0 400 300" preserveAspectRatio="none" width="100%" height="100%">
      <defs>
        <pattern
          :id="patternId"
          width="14" height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="14" height="14" :fill="bg" />
          <rect width="1" height="14" :fill="stripeColor" />
        </pattern>
      </defs>
      <rect width="400" height="300" :fill="`url(#${patternId})`" />
      <rect x="40" y="40" width="320" height="220" rx="8" :fill="innerBg" :stroke="innerStroke" />
      <rect x="60" y="62" width="120" height="8" rx="2" :fill="accent" />
      <rect x="60" y="80" width="80" height="6" rx="2" :fill="barFill" opacity=".5" />
      <rect x="60" y="110" width="280" height="50" rx="6" :fill="blockBg" />
      <rect x="76" y="124" width="60" height="6" rx="2" :fill="stripe" opacity=".4" />
      <rect x="76" y="138" width="160" height="6" rx="2" :fill="stripe" opacity=".3" />
      <rect x="60" y="180" width="130" height="60" rx="6" :fill="blockBg" />
      <rect x="210" y="180" width="130" height="60" rx="6" :fill="accent" opacity=".15" />
      <rect x="222" y="200" width="46" height="6" rx="2" :fill="accent" />
      <rect x="222" y="214" width="80" height="5" rx="2" :fill="stripe" opacity=".4" />
    </svg>
    <span class="absolute left-3.5 bottom-3 font-['JetBrains_Mono'] text-[10px] text-muted uppercase tracking-[0.1em]">{{ label }}</span>
  </div>
</template>
