<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppFooter from './components/layout/AppFooter.vue';
import AppHeader from './components/layout/AppHeader.vue';
import AppHero from './components/layout/AppHero.vue';
import SiteAlerts from './components/shared/SiteAlerts.vue';

const route = useRoute();
const isHomePage = computed(() => route.name === 'home');
const isInnerPage = computed(() => !isHomePage.value);
const heroAnimationKey = computed(() => route.name);
const heroContent = computed(() => ({
  eyebrow: route.meta.heroEyebrow,
  title: route.meta.heroTitle,
  subtitle: route.meta.heroSubtitle
}));
</script>

<template>
  <div :class="{ 'paginas-internas': isInnerPage }">
    <AppHero :key="heroAnimationKey" :hero-content="heroContent" :is-home-page="isHomePage" :wave-color="route.meta.heroWave">
      <template #header>
        <AppHeader />
      </template>
    </AppHero>

    <RouterView />

    <AppFooter />

    <SiteAlerts />
  </div>
</template>
