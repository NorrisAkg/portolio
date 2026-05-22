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
  <section id="contact" class="contact-band">
    <span class="watermark">N.A.</span>
    <div class="contact-inner">
      <div class="section-label">
        <span>{{ $t('contact.label') }}</span>
        <span class="rule" />
      </div>
      <AppReveal>
        <h2 class="contact-h">{{ $t('contact.heading') }}</h2>
        <p class="contact-sub">{{ $t('contact.subtitle') }}</p>
      </AppReveal>
      <div class="contact-grid">
        <AppReveal>
          <form class="form" @submit="handleSubmit">
            <div class="field">
              <label>{{ $t('contact.formName') }}</label>
              <input v-model="name" type="text" :placeholder="$t('contact.formNamePlaceholder')" required />
            </div>
            <div class="field">
              <label>{{ $t('contact.formEmail') }}</label>
              <input v-model="email" type="email" :placeholder="$t('contact.formEmailPlaceholder')" required />
            </div>
            <div class="field">
              <label>{{ $t('contact.formMessage') }}</label>
              <textarea v-model="message" :placeholder="$t('contact.formMessagePlaceholder')" rows="4" required />
            </div>
            <button class="submit" type="submit" :disabled="submitting">
              {{ $t('contact.submit') }} <AppIcon name="send" />
            </button>
          </form>
        </AppReveal>
        <AppReveal :delay="100">
          <div class="direct">
            <span class="lbl">{{ $t('contact.directLabel') }}</span>
            <a href="https://wa.me/22900000000" target="_blank" rel="noopener noreferrer">
              <span class="ic"><AppIcon name="whatsapp" /></span>
              <span><span class="k">WHATSAPP</span><span class="v">+229 00 00 00 00</span></span>
            </a>
            <a href="mailto:hello@norrisakogbede.com">
              <span class="ic"><AppIcon name="mail" /></span>
              <span><span class="k">EMAIL</span><span class="v">hello@norrisakogbede.com</span></span>
            </a>
            <a href="https://linkedin.com/in/norris-akogbede" target="_blank" rel="noopener noreferrer">
              <span class="ic"><AppIcon name="linkedin" /></span>
              <span><span class="k">LINKEDIN</span><span class="v">in/norris-akogbede</span></span>
            </a>
          </div>
        </AppReveal>
      </div>
    </div>
  </section>
</template>
