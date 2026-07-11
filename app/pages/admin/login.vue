<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'auth',
})

const { login, loading } = useAuth()
const localePath = useLocalePath()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  try {
    const success = await login(email.value, password.value)
    if (success) {
      router.push(localePath('/admin'))
    }
  } catch (err: any) {
    errorMsg.value = err.message || 'Une erreur est survenue lors de la connexion'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
    <!-- Back to site link -->
    <div class="absolute top-6 left-6">
      <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-slate-400 hover:text-orange transition-colors">
        ← Retour au site
      </NuxtLink>
    </div>

    <!-- Background decoration -->
    <div class="absolute w-[400px] h-[400px] rounded-full bg-orange/5 blur-3xl -top-20 -left-20"></div>
    <div class="absolute w-[400px] h-[400px] rounded-full bg-navy/20 blur-3xl -bottom-20 -right-20"></div>

    <!-- Login card -->
    <div class="w-full max-w-md bg-slate-950/40 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl relative">
      <div class="flex flex-col items-center mb-8">
        <span class="w-4 h-4 rounded-[3px] bg-orange rotate-45 mb-4"></span>
        <h1 class="font-['Montserrat'] font-bold text-2xl tracking-tight text-white m-0">Connexion Back-office</h1>
        <p class="text-xs text-slate-400 mt-1.5 text-center">
          Portfolio de Norris Akogbede
        </p>
      </div>

      <form class="flex flex-col gap-5" @submit.prevent="handleLogin">
        <!-- Error Alert -->
        <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/30 text-red-200 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{{ errorMsg }}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-xs tracking-wider uppercase text-slate-400 font-medium">Adresse email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="admin@portfolio.local"
            class="h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-xs tracking-wider uppercase text-slate-400 font-medium">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="h-10 px-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="h-10 w-full mt-2 rounded-lg bg-orange text-slate-950 text-sm font-semibold transition-all hover:bg-orange/90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <!-- Tip for developers -->
      <div class="mt-6 pt-6 border-t border-slate-900 text-center">
        <p class="text-[10px] text-slate-500 font-['JetBrains_Mono']">
          Seed dev : admin@portfolio.local / password123
        </p>
      </div>
    </div>
  </div>
</template>
