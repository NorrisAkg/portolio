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
  <footer class="foot-rich">
    <div class="foot-inner">
      <div class="grid">
        <!-- Brand -->
        <div class="col brand">
          <div class="id">
            <span class="portrait-mini"><AppPortrait :size="44" /></span>
            <span>
              <span class="nm" style="display:block">Norris Akogbede</span>
              <span class="sub">{{ $t('common.subtitle') }}</span>
            </span>
          </div>
          <p class="tagline">
            {{ lang === 'fr'
              ? 'Développeur freelance basé à Cotonou. Web2 & Web3, du MVP à la production.'
              : 'Freelance developer based in Cotonou. Web2 & Web3, from MVP to production.' }}
          </p>
          <span class="status">
            <span class="dot" />
            {{ $t('common.status') }}
          </span>
        </div>

        <!-- Navigation -->
        <div class="col nav-col">
          <h5>Navigation</h5>
          <template v-for="link in navLinks" :key="link.id">
            <a v-if="link.to.startsWith('#')" :href="link.to">
              {{ lang === 'fr' ? link.labelFr : link.labelEn }}
              <AppIcon name="arrow" />
            </a>
            <NuxtLink v-else :to="localePath(link.to)">
              {{ lang === 'fr' ? link.labelFr : link.labelEn }}
              <AppIcon name="arrow" />
            </NuxtLink>
          </template>
        </div>

        <!-- Direct contact -->
        <div class="col contact-col">
          <h5>{{ lang === 'fr' ? 'Contact direct' : 'Direct contact' }}</h5>
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

        <!-- Socials -->
        <div class="col socials-col">
          <h5>{{ lang === 'fr' ? 'Réseaux' : 'Socials' }}</h5>
          <div class="grid-soc">
            <a class="sq" href="#" aria-label="GitHub"><AppIcon name="github" /></a>
            <a class="sq" href="#" aria-label="LinkedIn"><AppIcon name="linkedin" /></a>
            <a class="sq" href="#" aria-label="X"><AppIcon name="x" /></a>
            <a class="sq" href="#" aria-label="Facebook"><AppIcon name="facebook" /></a>
            <a class="sq" href="#" aria-label="Instagram"><AppIcon name="instagram" /></a>
            <a class="sq" href="#" aria-label="TikTok"><AppIcon name="tiktok" /></a>
            <a class="sq" href="mailto:hello@norrisakogbede.com" aria-label="Email"><AppIcon name="mail" /></a>
          </div>
        </div>
      </div>

      <div class="bottom">
        <span>{{ $t('common.footCopy') }}</span>
        <span class="built">{{ $t('common.footBuilt') }} · v1.0</span>
      </div>
    </div>
  </footer>
</template>
