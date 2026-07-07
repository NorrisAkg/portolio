<template>
  <div class="relative w-full aspect-[4/5] max-w-[460px] justify-self-end">
    <!-- Decorative stripes (bottom-left) -->
    <span
      aria-hidden="true"
      class="absolute z-0 w-[120px] h-[120px] rounded-sm opacity-[.18]"
      style="bottom: -28px; left: -28px; background-image: repeating-linear-gradient(45deg, #1B2A4A 0 1px, transparent 1px 8px);"
    />
    <!-- Decorative accent block (bottom-right) -->
    <span
      aria-hidden="true"
      class="absolute z-0 w-[78%] h-[78%] bg-orange-tint rounded-3xl"
      style="bottom: -18px; right: -18px;"
    />
    <!-- Photo frame -->
    <div
      class="relative z-10 w-full h-full rounded-[20px] overflow-hidden border border-border"
      style="background: linear-gradient(160deg, #1B2A4A 0%, #3B4D75 100%); box-shadow: 0 30px 60px -30px rgba(15,23,42,0.35), 0 8px 24px -10px rgba(15,23,42,0.18);"
    >
      <span
        class="absolute left-3.5 top-3.5 font-['JetBrains_Mono'] text-[10px] tracking-[0.14em] text-white/70 uppercase bg-black/[.18] px-2 py-1 rounded backdrop-blur-sm"
      >PORTRAIT_NORRIS_2026.JPG</span>
      <div class="absolute inset-0 flex items-end justify-center">
        <AppPortrait :size="360" />
      </div>
    </div>
  </div>
</template>
