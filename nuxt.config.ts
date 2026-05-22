// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@pinia/colada-nuxt',
    '@pinia/nuxt',
    'nuxt-nodemailer',
  ],

  css: ['~/assets/css/main.css'],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Montserrat: [600, 700, 800],
      'JetBrains Mono': [400, 500],
    },
    display: 'swap',
  },

  i18n: {
    vueI18n: 'i18n.config.ts',
    locales: [
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
  },

  colorMode: {
    classSuffix: '',
  },
})
