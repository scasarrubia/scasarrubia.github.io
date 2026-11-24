<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  BookOpenText,
  ChevronRight,
  House,
  Images,
  Landmark,
  Lightbulb,
  Menu,
  MessageCircle,
  Newspaper,
  Users,
  X
} from '@lucide/vue';

const navLinks = [
  { name: 'home', label: 'Inicio', to: '/', icon: House },
  { name: 'institution', label: 'Institución', to: '/institucion', icon: Landmark },
  { name: 'our-people', label: 'Nuestra gente', to: '/nuestra-gente', icon: Users },
  { name: 'institutional-horizon', label: 'Horizonte institucional', to: '/horizonte-institucional', icon: BookOpenText },
  { name: 'projects', label: 'Proyectos', to: '/proyectos', icon: Lightbulb },
  { name: 'news', label: 'Noticias', to: '/noticias', icon: Newspaper, also: ['news-detail'] },
  { name: 'gallery', label: 'Galería', to: '/galeria', icon: Images, also: ['gallery-album'] }
];

const route = useRoute();
const isMenuOpen = ref(false);
const isScrolled = ref(false);
const headerElement = ref(null);

function isActive(link) {
  return route.name === link.name || link.also?.includes(route.name);
}

function closeMenu() {
  isMenuOpen.value = false;
}

function updateScrollState() {
  isScrolled.value = window.scrollY > 40;
}

function handleKeydown(event) {
  if (event.key === 'Escape' && isMenuOpen.value) closeMenu();
}

function handleClickOutside(event) {
  if (isMenuOpen.value && headerElement.value && !headerElement.value.contains(event.target)) closeMenu();
}

watch(() => route.fullPath, closeMenu);

onMounted(() => {
  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('keydown', handleKeydown);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState);
  window.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header
    id="encabezado"
    ref="headerElement"
    class="site-header"
    :class="{ 'site-header--scrolled': isScrolled || isMenuOpen }"
    role="banner">
    <div class="site-header__container">
      <RouterLink to="/" class="site-header__brand" aria-label="Inicio - Institución Educativa Padre Roberto Arroyave Vélez">
        <img
          class="site-header__crest"
          src="/images/escudo.webp"
          alt="" />
        <span class="site-header__brand-text">
          <span class="site-header__brand-code">IEPRAV</span>
          <span class="site-header__brand-name">Padre Roberto Arroyave Vélez</span>
        </span>
      </RouterLink>

      <button
        type="button"
        class="site-header__toggle"
        :aria-expanded="isMenuOpen"
        aria-controls="menu-principal"
        :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
        @click.stop="isMenuOpen = !isMenuOpen">
        <X v-if="isMenuOpen" aria-hidden="true" />
        <Menu v-else aria-hidden="true" />
      </button>

      <nav id="menu-principal" class="site-nav" :class="{ 'site-nav--open': isMenuOpen }" aria-label="Menú principal">
        <ul class="site-nav__list">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink
              class="site-nav__link"
              :class="{ 'site-nav__link--active': isActive(link) }"
              :aria-current="isActive(link) ? 'page' : undefined"
              :to="link.to">
              <component :is="link.icon" class="site-nav__icon" aria-hidden="true" />
              <span>{{ link.label }}</span>
              <ChevronRight class="site-nav__chevron" aria-hidden="true" />
            </RouterLink>
          </li>
          <li class="site-nav__cta-item">
            <RouterLink
              class="site-nav__cta"
              :class="{ 'site-nav__cta--active': route.name === 'contact' }"
              :aria-current="route.name === 'contact' ? 'page' : undefined"
              to="/contacto">
              <MessageCircle aria-hidden="true" />
              Contacto
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header,
.site-header * {
  box-sizing: border-box;
}

/* Transparent over the hero photo; solid once the page scrolls. */
.site-header {
  background: linear-gradient(180deg, rgba(6, 45, 38, .78), rgba(6, 45, 38, 0));
  color: #fff;
  font-family: 'Open Sans', Arial, sans-serif;
  left: 0;
  padding: 1rem 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: background .35s ease, box-shadow .35s ease, padding .35s ease;
  z-index: 50;
}

.site-header--scrolled {
  backdrop-filter: blur(10px);
  background: rgba(10, 52, 44, .94);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .22);
  padding: .55rem 0;
}

/* Thin gold line that appears with the solid state. */
.site-header::after {
  background: linear-gradient(90deg, transparent, #e5b54b, transparent);
  bottom: 0;
  content: "";
  height: 2px;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  transition: opacity .35s ease;
}

.site-header--scrolled::after {
  opacity: .7;
}

.site-header__container {
  align-items: center;
  display: flex;
  gap: 1rem;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 1.25rem;
}

/* ---- Brand ---- */
.site-header__brand {
  align-items: center;
  color: #fff;
  display: flex;
  flex-shrink: 0;
  gap: .7rem;
  line-height: 1;
  text-decoration: none;
}

.site-header__crest {
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(229, 181, 75, .7), 0 4px 12px rgba(0, 0, 0, .25);
  display: block;
  flex: 0 0 auto;
  height: 2.9rem;
  object-fit: contain;
  padding: .15rem;
  transition: transform .4s ease, height .35s ease, width .35s ease;
  width: 2.9rem;
}

.site-header--scrolled .site-header__crest {
  height: 2.5rem;
  width: 2.5rem;
}

.site-header__brand:hover .site-header__crest {
  transform: rotate(-10deg) scale(1.05);
}

.site-header__brand-text {
  display: flex;
  flex-direction: column;
  gap: .2rem;
}

.site-header__brand-code {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: .04em;
}

.site-header__brand-name {
  color: #f3d87c;
  font-size: .66rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ---- Mobile toggle ---- */
.site-header__toggle {
  align-items: center;
  background: rgba(255, 255, 255, .1);
  border: 1px solid rgba(255, 255, 255, .25);
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  display: flex;
  height: 2.75rem;
  justify-content: center;
  margin-left: auto;
  transition: background .2s ease, border-color .2s ease;
  width: 2.75rem;
}

.site-header__toggle:hover,
.site-header__toggle[aria-expanded="true"] {
  background: #e5b54b;
  border-color: #e5b54b;
  color: #123c35;
}

.site-header__toggle svg {
  height: 1.5rem;
  width: 1.5rem;
}

.site-header__toggle:focus-visible,
.site-nav__link:focus-visible,
.site-nav__cta:focus-visible,
.site-header__brand:focus-visible {
  outline: 2px solid #f3d87c;
  outline-offset: 3px;
}

/* ---- Mobile panel (default) ---- */
.site-nav {
  background: #0a342c;
  border-top: 1px solid rgba(255, 255, 255, .12);
  box-shadow: 0 18px 30px rgba(0, 0, 0, .3);
  left: 0;
  max-height: calc(100vh - 4rem);
  opacity: 0;
  overflow-y: auto;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 100%;
  transform: translateY(-.75rem);
  transition: opacity .25s ease, transform .25s ease, visibility .25s;
  visibility: hidden;
}

.site-nav--open {
  opacity: 1;
  pointer-events: auto;
  transform: none;
  visibility: visible;
}

.site-nav__list {
  display: flex;
  flex-direction: column;
  gap: .25rem;
  list-style: none;
  margin: 0 auto;
  max-width: 1200px;
  padding: 1rem 1.25rem 1.25rem;
}

.site-nav__link {
  align-items: center;
  border-radius: 12px;
  color: #fff;
  display: flex;
  font-size: 1rem;
  font-weight: 600;
  gap: .85rem;
  padding: .8rem .9rem;
  position: relative;
  text-decoration: none;
  transition: background .2s ease, color .2s ease;
}

.site-nav__icon {
  color: #f3d87c;
  flex-shrink: 0;
  height: 1.2rem;
  width: 1.2rem;
}

.site-nav__chevron {
  height: 1rem;
  margin-left: auto;
  opacity: .45;
  width: 1rem;
}

.site-nav__link:hover {
  background: rgba(255, 255, 255, .08);
}

.site-nav__link--active {
  background: rgba(229, 181, 75, .16);
  color: #f3d87c;
}

.site-nav__cta-item {
  margin-top: .5rem;
}

.site-nav__cta {
  align-items: center;
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: flex;
  font-weight: 700;
  gap: .5rem;
  justify-content: center;
  padding: .8rem 1.25rem;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
}

.site-nav__cta svg {
  height: 1.1rem;
  width: 1.1rem;
}

.site-nav__cta:hover,
.site-nav__cta--active {
  background: #f3d06f;
}

/* ---- Desktop ---- */
@media (min-width: 1240px) {
  .site-header__toggle {
    display: none;
  }

  .site-nav {
    background: transparent;
    border: 0;
    box-shadow: none;
    margin-left: auto;
    max-height: none;
    opacity: 1;
    overflow: visible;
    pointer-events: auto;
    position: static;
    transform: none;
    visibility: visible;
  }

  .site-nav__list {
    align-items: center;
    flex-direction: row;
    gap: .1rem;
    padding: 0;
  }

  .site-nav__icon,
  .site-nav__chevron {
    display: none;
  }

  .site-nav__link {
    background: transparent;
    border-radius: 8px;
    font-size: .9rem;
    padding: .55rem .6rem;
    text-shadow: 0 1px 6px rgba(0, 0, 0, .35);
    white-space: nowrap;
  }

  /* Animated gold underline for hover and the current page. */
  .site-nav__link::after {
    background: #e5b54b;
    border-radius: 2px;
    bottom: .15rem;
    content: "";
    height: 2px;
    left: .6rem;
    position: absolute;
    right: .6rem;
    transform: scaleX(0);
    transition: transform .25s ease;
  }

  .site-nav__link:hover {
    background: transparent;
    color: #f3d87c;
  }

  .site-nav__link:hover::after,
  .site-nav__link--active::after {
    transform: scaleX(1);
  }

  .site-nav__link--active {
    background: transparent;
    color: #f3d87c;
  }

  .site-nav__cta-item {
    margin: 0 0 0 .6rem;
  }

  .site-nav__cta {
    box-shadow: 0 6px 16px rgba(0, 0, 0, .2);
    font-size: .9rem;
    padding: .6rem 1.15rem;
  }

  .site-nav__cta:hover {
    box-shadow: 0 10px 22px rgba(0, 0, 0, .28);
    transform: translateY(-2px);
  }

  .site-nav__cta--active {
    box-shadow: 0 0 0 2px #fff, 0 6px 16px rgba(0, 0, 0, .2);
  }
}

@media (max-width: 420px) {
  .site-header__brand-name {
    font-size: .58rem;
  }

  .site-header__brand-code {
    font-size: 1.2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .site-header::after,
  .site-header__crest,
  .site-nav,
  .site-nav__link::after,
  .site-nav__cta {
    transition: none;
  }

  .site-header__brand:hover .site-header__crest,
  .site-nav__cta:hover {
    transform: none;
  }
}
</style>
