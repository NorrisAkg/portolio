<script setup lang="ts">
const props = withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })
const el = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!el.value) return
  if (typeof IntersectionObserver === 'undefined') {
    el.value.classList.add('in')
    return
  }
  const io = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      setTimeout(() => el.value?.classList.add('in'), props.delay)
      io.disconnect()
    }
  }, { threshold: 0.08 })
  io.observe(el.value as any)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <div ref="el" class="reveal">
    <slot />
  </div>
</template>
