<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ChevronDown } from '@lucide/vue';

defineProps({
  heroContent: {
    type: Object,
    required: true
  },
  isHomePage: {
    type: Boolean,
    required: true
  }
});

const heroSlides = [
  {
    src: '/images/img_hero.webp',
    alt: 'Estudiantes participando en actividades académicas'
  },
  {
    src: '/images/img_hero_1.webp',
    alt: 'Comunidad educativa en espacios institucionales'
  },
  {
    src: '/images/img_hero_2.webp',
    alt: 'Actividades escolares de la Institución Educativa Padre Roberto Arroyave Vélez'
  }
];

const activeSlide = ref(0);
const activeSlideAlt = computed(() => heroSlides[activeSlide.value]?.alt ?? '');
let slideInterval;

onMounted(() => {
  slideInterval = window.setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % heroSlides.length;
  }, 6500);
});

onBeforeUnmount(() => {
  window.clearInterval(slideInterval);
});
</script>

<template>
  <section class="bienvenidos app-hero">
    <div class="app-hero__media" :aria-label="activeSlideAlt" role="img">
      <img
        v-for="(slide, index) in heroSlides"
        :key="slide.src"
        :src="slide.src"
        alt=""
        :data-active="index === activeSlide"
        aria-hidden="true" />
    </div>

    <slot name="header" />

    <div class="app-hero__body">
      <div class="app-hero__content">
        <template v-if="isHomePage">
          <p v-reveal="{ direction: 'down', delay: 100 }" class="app-hero__eyebrow">
            {{ heroContent.eyebrow }}
          </p>
          <h1 v-reveal="{ direction: 'left', delay: 220 }" class="app-hero__title app-hero__title--home">
            {{ heroContent.title }}
          </h1>
          <p v-reveal="{ direction: 'right', delay: 360 }" class="app-hero__lead">
            {{ heroContent.subtitle }}
          </p>
          <!-- <RouterLink
            v-reveal="{ direction: 'up', delay: 520 }"
            to="/contacto"
            class="app-hero__action">
            Comunícate con nosotros
          </RouterLink> -->
        </template>

        <template v-else>
          <p v-reveal="{ direction: 'down', delay: 80 }" class="app-hero__eyebrow">
            {{ heroContent.eyebrow }}
          </p>
          <h1 v-reveal="{ direction: 'left', delay: 160 }" class="app-hero__title">
            {{ heroContent.title }}
          </h1>
          <p v-reveal="{ direction: 'right', delay: 280 }" class="app-hero__lead">
            {{ heroContent.subtitle }}
          </p>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.app-hero {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-hero__media {
  display: grid;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  z-index: 0;
}

.app-hero__media img {
  grid-area: 1 / 1;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 1.4s ease, transform 7s ease;
  width: 100%;
}

.app-hero__media img[data-active="true"] {
  opacity: 1;
  transform: scale(1);
}

.app-hero__body {
  align-items: center;
  display: flex;
  flex: 1;
  text-align: center;
}

.app-hero__content {
  margin: 0 auto;
  max-width: 64rem;
  padding: 0 1rem;
  text-align: center;
}

.app-hero__eyebrow {
  color: #e5b54b;
  font-size: .875rem;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 .75rem;
  text-transform: uppercase;
}

.app-hero__title {
  color: #fff;
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.12;
  margin: 0 0 1rem;
}

.app-hero__title--home {
  margin-left: auto;
  margin-right: auto;
  max-width: 56rem;
}

.app-hero__lead {
  color: #fff;
  font-size: 1rem;
  line-height: 1.65;
  margin: 0 auto;
  max-width: 48rem;
}

.app-hero__action {
  align-items: center;
  background: #e5b54b;
  border-radius: 6px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .18);
  color: #123c35;
  display: inline-flex;
  font-size: 1rem;
  font-weight: 700;
  justify-content: center;
  margin-top: 1.5rem;
  padding: .75rem 1.5rem;
  text-decoration: none;
  transition: background .2s ease, color .2s ease, transform .2s ease;
}

.app-hero__action:hover,
.app-hero__action:focus {
  background: #b77c17;
  color: #fff;
  transform: translateY(-.125rem);
}

.app-hero__scroll {
  padding-bottom: 1rem;
  text-align: center;
}

.app-hero__scroll a {
  animation: bounce 1s infinite;
  color: #fff;
  display: inline-flex;
  text-decoration: none;
}

.app-hero__scroll svg {
  height: 3.5rem;
  width: 3.5rem;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(.8, 0, 1, 1);
  }

  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, .2, 1);
  }
}

@media (min-width: 768px) {
  .app-hero__eyebrow {
    font-size: 1rem;
  }

  .app-hero__title {
    font-size: 3.75rem;
  }

  .app-hero__lead {
    font-size: 1.25rem;
  }
}
</style>
