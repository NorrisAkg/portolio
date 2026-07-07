<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()

const name = ref('')
const email = ref('')
const message = ref('')
const submitting = ref(false)

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  submitting.value = true
  // TODO: wire to POST /api/contact in Phase 4 (nuxt-nodemailer)
  await new Promise(resolve => setTimeout(resolve, 400))
  submitting.value = false
  name.value = ''
  email.value = ''
  message.value = ''
  toast.add({ title: t('contact.heading'), description: '✓ Message reçu — je reviens vers vous rapidement.' })
}
</script>

<template>
  <section id="contact" class="mt-24 bg-[#1B2A4A] dark:bg-[#0F1626] dark:border-t dark:border-[#1E2638] text-white py-20 relative overflow-hidden max-sm:mt-12 max-sm:py-12">
    <!-- Watermark -->
    <span
      class="absolute right-[-20px] bottom-[-60px] font-['Montserrat'] font-black text-[280px] leading-none text-white/[0.03] tracking-[-0.04em] pointer-events-none select-none max-sm:text-[160px]"
      aria-hidden="true"
    >N.A.</span>

    <div class="max-w-[1120px] mx-auto px-12 relative z-10 max-lg:px-8 max-sm:px-5">
      <!-- Section label -->
      <div class="flex items-center gap-4 text-[11px] tracking-[0.18em] uppercase text-white/55 font-medium mb-7">
        <span><span class="font-['JetBrains_Mono'] text-orange text-[10px] tracking-[0.12em] font-medium mr-1">05</span> — {{ $t('contact.label') }}</span>
        <span class="flex-1 h-px bg-white/[0.12] max-w-[240px]" />
      </div>

      <AppReveal>
        <h2 class="font-['Montserrat'] font-bold text-[40px] leading-[1.15] text-white m-0 mb-4 tracking-[-0.02em] max-w-[18ch]">{{ $t('contact.heading') }}</h2>
        <p class="text-[17px] leading-[1.55] text-[#D1D5DB] m-0 mb-12 max-w-[48ch]">{{ $t('contact.subtitle') }}</p>
      </AppReveal>

      <div class="grid grid-cols-[1.2fr_1fr] gap-16 items-start max-sm:grid-cols-1 max-sm:gap-10">

        <!-- Form -->
        <AppReveal>
          <form class="flex flex-col gap-[18px]" @submit="handleSubmit">
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] tracking-[0.18em] uppercase text-white/55 font-medium">{{ $t('contact.formName') }}</label>
              <input
                v-model="name"
                type="text"
                :placeholder="$t('contact.formNamePlaceholder')"
                required
                class="bg-transparent text-white border-0 border-b border-white/25 py-2.5 text-base font-[inherit] outline-none transition-[border-color] duration-200 placeholder:text-white/40 focus:border-orange"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] tracking-[0.18em] uppercase text-white/55 font-medium">{{ $t('contact.formEmail') }}</label>
              <input
                v-model="email"
                type="email"
                :placeholder="$t('contact.formEmailPlaceholder')"
                required
                class="bg-transparent text-white border-0 border-b border-white/25 py-2.5 text-base font-[inherit] outline-none transition-[border-color] duration-200 placeholder:text-white/40 focus:border-orange"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] tracking-[0.18em] uppercase text-white/55 font-medium">{{ $t('contact.formMessage') }}</label>
              <textarea
                v-model="message"
                :placeholder="$t('contact.formMessagePlaceholder')"
                rows="4"
                required
                class="bg-transparent text-white border-0 border-b border-white/25 py-2.5 text-base font-[inherit] outline-none transition-[border-color] duration-200 placeholder:text-white/40 focus:border-orange resize-y min-h-[90px]"
              />
            </div>
            <button
              type="submit"
              :disabled="submitting"
              class="self-start mt-3 bg-orange text-[#1B2A4A] border-0 h-12 px-6 rounded-[10px] font-semibold text-[15px] inline-flex items-center gap-2.5 hover:brightness-105 transition-[filter]"
            >
              {{ $t('contact.submit') }} <AppIcon name="send" />
            </button>
          </form>
        </AppReveal>

        <!-- Direct contacts -->
        <AppReveal :delay="100">
          <div class="flex flex-col gap-3.5">
            <span class="text-[11px] tracking-[0.18em] uppercase text-white/55 font-medium mb-2">{{ $t('contact.directLabel') }}</span>
            <a
              v-for="item in [
                { href: 'https://wa.me/22900000000', label: 'WHATSAPP', value: '+229 00 00 00 00', icon: 'whatsapp', external: true },
                { href: 'mailto:hello@norrisakogbede.com', label: 'EMAIL', value: 'hello@norrisakogbede.com', icon: 'mail', external: false },
                { href: 'https://linkedin.com/in/norris-akogbede', label: 'LINKEDIN', value: 'in/norris-akogbede', icon: 'linkedin', external: true },
              ]"
              :key="item.label"
              :href="item.href"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noopener noreferrer' : undefined"
              class="grid grid-cols-[40px_1fr] gap-3.5 items-center py-3.5 border-b border-white/10 last:border-0 transition-[padding] duration-200 hover:pl-1.5"
            >
              <span class="w-10 h-10 rounded-[10px] border border-white/[0.18] flex items-center justify-center text-white">
                <AppIcon :name="item.icon" class="w-4 h-4" />
              </span>
              <span>
                <span class="block text-[11px] tracking-[0.12em] uppercase text-white/55 font-medium mb-0.5">{{ item.label }}</span>
                <span class="text-[15px] text-white font-medium">{{ item.value }}</span>
              </span>
            </a>
          </div>
        </AppReveal>
      </div>
    </div>
  </section>
</template>
