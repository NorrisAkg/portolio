// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
      '@stylistic/quotes': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)
