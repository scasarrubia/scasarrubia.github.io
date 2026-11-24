<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ArrowRight, ChevronDown, ExternalLink } from '@lucide/vue';

defineProps({
  heroContent: {
    type: Object,
    required: true
  },
  isHomePage: {
    type: Boolean,
    required: true
  },
  // Must match the background of the page below so the wave blends in.
  waveColor: {
    type: String,
    default: '#f7f8f4'
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

function startSlideshow() {
  window.clearInterval(slideInterval);
  slideInterval = window.setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % heroSlides.length;
  }, 6500);
}

function goToSlide(index) {
  activeSlide.value = index;
  startSlideshow();
}

const heroElement = ref(null);

// The router uses hash history, so a plain "#id" link would change the route; scroll manually instead.
function scrollPastHero() {
  const headerHeight = document.getElementById('encabezado')?.offsetHeight ?? 0;
  const target = document.getElementById('accesos') ?? heroElement.value;
  const top = target === heroElement.value
    ? target.getBoundingClientRect().bottom
    : target.getBoundingClientRect().top;

  window.scrollTo({ top: window.scrollY + top - headerHeight - 16, behavior: 'smooth' });
}

onMounted(startSlideshow);

onBeforeUnmount(() => {
  window.clearInterval(slideInterval);
});
</script>

<template>
  <section
    ref="heroElement"
    class="bienvenidos app-hero"
    :class="{ 'app-hero--home': isHomePage }"
    :style="{ '--hero-wave': waveColor }">
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
          <img
            v-reveal="{ direction: 'zoom', delay: 0 }"
            class="app-hero__crest"
            src="/images/escudo.webp"
            alt=""
            aria-hidden="true" />
          <p v-reveal="{ direction: 'down', delay: 100 }" class="app-hero__eyebrow">
            {{ heroContent.eyebrow }}
          </p>
          <h1 v-reveal="{ direction: 'left', delay: 220 }" class="app-hero__title app-hero__title--home">
            {{ heroContent.title }}
          </h1>
          <p v-reveal="{ direction: 'right', delay: 360 }" class="app-hero__lead">
            {{ heroContent.subtitle }}
          </p>
          <div v-reveal="{ direction: 'up', delay: 500 }" class="app-hero__actions">
            <a
              href="https://padreroberto.educa.city/"
              target="_blank"
              rel="noopener noreferrer"
              class="app-hero__action">
              Ingresar a Educacity <ExternalLink aria-hidden="true" />
            </a>
            <RouterLink to="/noticias" class="app-hero__action app-hero__action--ghost">
              Ver noticias <ArrowRight aria-hidden="true" />
            </RouterLink>
          </div>
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

    <div class="app-hero__dots" role="group" aria-label="Cambiar imagen del encabezado">
      <button
        v-for="(slide, index) in heroSlides"
        :key="slide.src"
        type="button"
        class="app-hero__dot"
        :class="{ 'app-hero__dot--active': index === activeSlide }"
        :aria-label="`Mostrar imagen ${index + 1} de ${heroSlides.length}`"
        :aria-pressed="index === activeSlide"
        @click="goToSlide(index)" />
    </div>

    <button type="button" class="app-hero__scroll" aria-label="Ir al contenido" @click="scrollPastHero">
      <ChevronDown aria-hidden="true" />
    </button>

    <svg class="app-hero__wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 64 C 240 120 480 120 720 80 C 960 40 1200 20 1440 56 L1440 120 L0 120 Z" />
    </svg>
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

/* Leave room so the quick-access cards peek above the fold. */
.app-hero--home {
  min-height: calc(100vh - 3rem);
  min-height: calc(100svh - 3rem);
}

.app-hero__body {
  padding-bottom: 7rem;
}

.app-hero--home .app-hero__body {
  padding-bottom: 9rem;
}

.app-hero__crest {
  display: block;
  filter: drop-shadow(0 .6rem 1.2rem rgba(0, 0, 0, .35));
  height: auto;
  margin: 0 auto 1.25rem;
  width: clamp(4.5rem, 9vw, 6.5rem);
}

.app-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: .85rem;
  justify-content: center;
  margin-top: 2rem;
}

.app-hero__action {
  align-items: center;
  background: #e5b54b;
  border: 2px solid #e5b54b;
  border-radius: 999px;
  box-shadow: 0 .8rem 1.8rem rgba(0, 0, 0, .25);
  color: #123c35;
  display: inline-flex;
  font-size: 1rem;
  font-weight: 700;
  gap: .55rem;
  justify-content: center;
  padding: .8rem 1.6rem;
  text-decoration: none;
  transition: background .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
}

.app-hero__action svg {
  height: 1.1rem;
  transition: transform .2s ease;
  width: 1.1rem;
}

.app-hero__action:hover,
.app-hero__action:focus-visible {
  background: #f3d06f;
  border-color: #f3d06f;
  box-shadow: 0 1rem 2.2rem rgba(0, 0, 0, .32);
  color: #123c35;
  transform: translateY(-.15rem);
}

.app-hero__action:hover svg {
  transform: translateX(.2rem);
}

.app-hero__action--ghost {
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .75);
  color: #fff;
}

.app-hero__action--ghost:hover,
.app-hero__action--ghost:focus-visible {
  background: #fff;
  border-color: #fff;
}

.app-hero__action:focus-visible,
.app-hero__dot:focus-visible,
.app-hero__scroll:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}

.app-hero__dots {
  bottom: 6.5rem;
  display: flex;
  gap: .5rem;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  z-index: 2;
}

.app-hero__dot {
  background: rgba(255, 255, 255, .45);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  height: .6rem;
  padding: 0;
  transition: background .3s ease, width .3s ease;
  width: .6rem;
}

.app-hero__dot:hover {
  background: rgba(255, 255, 255, .8);
}

.app-hero__dot--active {
  background: #e5b54b;
  width: 2rem;
}

.app-hero__scroll {
  animation: bounce 1.4s infinite;
  background: none;
  border: 0;
  bottom: 3.5rem;
  cursor: pointer;
  padding: 0;
  color: #fff;
  display: inline-flex;
  left: calc(50% - 1.25rem);
  position: absolute;
  text-decoration: none;
  z-index: 2;
}

.app-hero__scroll svg {
  height: 2.5rem;
  width: 2.5rem;
}

.app-hero__wave {
  bottom: -1px;
  fill: var(--hero-wave, #f7f8f4);
  height: clamp(3rem, 8vw, 6rem);
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 1;
}

/* On the home page the quick-access cards overlap the bottom of the hero. */
.app-hero--home .app-hero__dots {
  bottom: 8.5rem;
}

.app-hero--home .app-hero__scroll {
  bottom: 5.5rem;
}

@media (prefers-reduced-motion: reduce) {
  .app-hero__scroll {
    animation: none;
  }
}

@media (max-width: 520px) {
  .app-hero__action {
    width: 100%;
  }

  .app-hero__scroll {
    display: none;
  }

  .app-hero__dots {
    bottom: 4.5rem;
  }

  .app-hero--home .app-hero__dots {
    bottom: 6.5rem;
  }
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
