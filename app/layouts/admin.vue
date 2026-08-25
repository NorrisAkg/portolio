<script setup lang="ts">
const { user, logout, fetchMe } = useAuth()
const localePath = useLocalePath()
const router = useRouter()

onMounted(async () => {
  if (!user.value) {
    await fetchMe()
  }
})

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toggleDark = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const handleLogout = async () => {
  await logout()
  router.push(localePath('/admin/login'))
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#060B13] text-navy dark:text-[#E8ECF5] font-sans">
    <!-- Admin Header -->
    <header class="sticky top-0 z-40 bg-white/80 dark:bg-[#0A0F1A]/80 backdrop-blur-md border-b border-border py-4 px-8 max-sm:px-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink :to="localePath('/admin')" class="font-['Montserrat'] font-extrabold text-lg tracking-tight text-navy dark:text-white flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-[2px] bg-orange rotate-45"></span>
          <span>Norris <span class="text-orange">Admin</span></span>
        </NuxtLink>
        <span class="text-border">|</span>
        <span class="text-xs font-['JetBrains_Mono'] text-muted max-sm:hidden">
          Console de Gestion
        </span>
      </div>

      <div class="flex items-center gap-4">
        <!-- User info -->
        <span v-if="user" class="text-xs text-muted max-sm:hidden">
          {{ user.email }}
        </span>

        <!-- Theme Toggle -->
        <button
          class="inline-flex items-center justify-center gap-1.5 h-8 rounded-lg px-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-border text-xs text-[#2D2D2D] dark:text-[#E8EAEE] font-medium transition-colors"
          :aria-label="isDark ? 'Mode clair' : 'Mode sombre'"
          @click="toggleDark"
        >
          <AppIcon :name="isDark ? 'sun' : 'moon'" class="w-3.5 h-3.5" />
          <span class="max-sm:hidden">{{ isDark ? 'Sombre' : 'Clair' }}</span>
        </button>

        <!-- Quick navigation -->
        <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-1.5 text-xs font-medium hover:text-orange transition-colors">
          Voir le site public
        </NuxtLink>

        <!-- Logout -->
        <button
          class="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-orange/10 hover:bg-orange/20 text-orange text-xs font-semibold transition-colors cursor-pointer"
          title="Se déconnecter de l'espace administration"
          @click="handleLogout"
        >
          <span>Déconnexion</span>
        </button>
      </div>
    </header>

    <!-- Main Container -->
    <div class="max-w-[1280px] mx-auto p-8 max-sm:p-4">
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
