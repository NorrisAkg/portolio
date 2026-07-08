<template>
  <div class="relative w-full aspect-[4/5] max-w-[460px] justify-self-end">
    <!-- Decorative stripes (bottom-left) -->
    <span
      aria-hidden="true"
      class="absolute z-0 w-[120px] h-[120px] rounded-sm opacity-[.18] -bottom-7 -left-7 bg-[repeating-linear-gradient(45deg,#1B2A4A_0_1px,transparent_1px_8px)]"
    />
    <!-- Decorative accent block (bottom-right) -->
    <span
      aria-hidden="true"
      class="absolute z-0 w-[78%] h-[78%] bg-orange-tint rounded-3xl -bottom-[18px] -right-[18px]"
    />
    <!-- Photo frame -->
    <div
      class="relative z-10 w-full h-full rounded-[20px] overflow-hidden border border-border bg-[linear-gradient(160deg,#1B2A4A_0%,#3B4D75_100%)] shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35),0_8px_24px_-10px_rgba(15,23,42,0.18)]"
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
