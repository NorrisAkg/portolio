<script setup lang="ts">
const { user, logout } = useAuth()
const localePath = useLocalePath()
const router = useRouter()

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

        <!-- Quick navigation -->
        <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-1.5 text-xs font-medium hover:text-orange transition-colors">
          Voir le site public
        </NuxtLink>

        <!-- Logout -->
        <button
          v-if="user"
          class="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-orange/10 hover:bg-orange/20 text-orange text-xs font-medium transition-colors"
          @click="handleLogout"
        >
          Déconnexion
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

<style scoped>
/* Scoped styles if needed */
</style>
