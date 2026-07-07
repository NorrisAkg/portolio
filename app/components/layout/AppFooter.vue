<script setup lang="ts">
defineProps<{ lang: string }>()

const localePath = useLocalePath()

const navLinks = computed(() => [
  { id: 'home',     to: '/',         labelFr: 'Accueil',  labelEn: 'Home' },
  { id: 'projects', to: '/projects', labelFr: 'Projets',  labelEn: 'Projects' },
  { id: 'blog',     to: '/blog',     labelFr: 'Blog',     labelEn: 'Blog' },
  { id: 'contact',  to: '#contact',  labelFr: 'Contact',  labelEn: 'Contact' },
])
</script>

<template>
  <footer class="bg-[#1B2A4A] dark:bg-[#0F1626] dark:border-t dark:border-[#1E2638] text-white pt-[72px] pb-8">
    <div class="max-w-[1120px] mx-auto px-12 max-lg:px-8 max-sm:px-5">

      <!-- 4-col grid -->
      <div class="grid grid-cols-[1.4fr_1fr_1.2fr_1.4fr] gap-12 pb-14 border-b border-white/[0.08] max-lg:grid-cols-2 max-lg:gap-10 max-sm:grid-cols-1 max-sm:gap-8 max-sm:pb-8">

        <!-- Brand -->
        <div class="flex flex-col gap-3.5">
          <div class="flex items-center gap-3">
            <span class="w-11 h-11 rounded-full overflow-hidden border border-white/[0.16] flex-shrink-0">
              <AppPortrait :size="44" />
            </span>
            <span>
              <span class="block font-['Montserrat'] font-bold text-base text-white tracking-[-0.01em]">Norris Akogbede</span>
              <span class="text-[10px] tracking-[0.14em] uppercase text-white/55">{{ $t('common.subtitle') }}</span>
            </span>
          </div>
          <p class="text-sm text-white/70 leading-[1.55] max-w-[30ch] m-0">
            {{ lang === 'fr'
              ? 'Développeur freelance basé à Cotonou. Web2 & Web3, du MVP à la production.'
              : 'Freelance developer based in Cotonou. Web2 & Web3, from MVP to production.' }}
          </p>
          <span class="inline-flex items-center gap-2 bg-transparent border border-white/[0.16] rounded-full px-2.5 py-[6px] text-[11px] text-white/90 self-start">
            <span class="w-[6px] h-[6px] rounded-full bg-green shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
            {{ $t('common.status') }}
          </span>
        </div>

        <!-- Navigation -->
        <div>
          <h5 class="text-[11px] tracking-[0.18em] uppercase text-white/55 font-medium m-0 mb-4.5">Navigation</h5>
          <div class="flex flex-col gap-2.5">
            <template v-for="link in navLinks" :key="link.id">
              <a
                v-if="link.to.startsWith('#')"
                :href="link.to"
                class="text-sm text-white/85 inline-flex items-center gap-2 transition-[color,gap] duration-[180ms] hover:text-orange hover:gap-3 w-max"
              >
                {{ lang === 'fr' ? link.labelFr : link.labelEn }}
                <AppIcon name="arrow" class="w-3 h-3 opacity-0 transition-opacity duration-[180ms] group-hover:opacity-100" />
              </a>
              <NuxtLink
                v-else
                :to="localePath(link.to)"
                class="text-sm text-white/85 inline-flex items-center gap-2 transition-[color,gap] duration-[180ms] hover:text-orange hover:gap-3 w-max"
              >
                {{ lang === 'fr' ? link.labelFr : link.labelEn }}
                <AppIcon name="arrow" class="w-3 h-3 opacity-0 transition-opacity duration-[180ms]" />
              </NuxtLink>
            </template>
          </div>
        </div>

        <!-- Direct contact -->
        <div>
          <h5 class="text-[11px] tracking-[0.18em] uppercase text-white/55 font-medium m-0 mb-4.5">
            {{ lang === 'fr' ? 'Contact direct' : 'Direct contact' }}
          </h5>
          <div class="flex flex-col gap-3.5">
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
              class="grid grid-cols-[32px_1fr] gap-3 items-center group"
            >
              <span class="w-8 h-8 rounded-lg border border-white/[0.16] flex items-center justify-center text-white">
                <AppIcon :name="item.icon" class="w-3.5 h-3.5" />
              </span>
              <span>
                <span class="block text-[10px] tracking-[0.12em] uppercase text-white/50 font-medium mb-0.5">{{ item.label }}</span>
                <span class="text-[13px] text-white font-medium transition-colors duration-[180ms] group-hover:text-orange">{{ item.value }}</span>
              </span>
            </a>
          </div>
        </div>

        <!-- Socials -->
        <div>
          <h5 class="text-[11px] tracking-[0.18em] uppercase text-white/55 font-medium m-0 mb-4.5">
            {{ lang === 'fr' ? 'Réseaux' : 'Socials' }}
          </h5>
          <div class="grid grid-cols-4 gap-2 max-w-[220px]">
            <a
              v-for="soc in [
                { href: '#', label: 'GitHub', icon: 'github' },
                { href: '#', label: 'LinkedIn', icon: 'linkedin' },
                { href: '#', label: 'X', icon: 'x' },
                { href: '#', label: 'Facebook', icon: 'facebook' },
                { href: '#', label: 'Instagram', icon: 'instagram' },
                { href: '#', label: 'TikTok', icon: 'tiktok' },
                { href: 'mailto:hello@norrisakogbede.com', label: 'Email', icon: 'mail' },
              ]"
              :key="soc.label"
              :href="soc.href"
              :aria-label="soc.label"
              class="aspect-square rounded-lg border border-white/[0.14] flex items-center justify-center text-white transition-[border-color,color,transform,background] duration-[180ms] hover:border-orange hover:text-orange hover:-translate-y-px hover:bg-orange/[0.06]"
            >
              <AppIcon :name="soc.icon" class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="flex justify-between items-center pt-6 gap-4 text-xs text-white/50 max-sm:flex-col max-sm:items-start max-sm:gap-2">
        <span>{{ $t('common.footCopy') }}</span>
        <span class="font-['JetBrains_Mono'] text-[11px] tracking-[0.06em]">{{ $t('common.footBuilt') }} · v1.0</span>
      </div>
    </div>
  </footer>
</template>
