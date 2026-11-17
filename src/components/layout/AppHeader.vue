<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Menu, Search, X } from '@lucide/vue';

const route = useRoute();
const isMenuOpen = ref(false);
const isActive = (name) => route.name === name;
const isHome = computed(() => route.name === 'home');

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false;
  }
);
</script>

<template>
  <header class="site-header" role="banner" id="encabezado">
    <div class="site-header__container">
      <RouterLink to="/" class="site-header__brand">
        <img
          class="site-header__crest"
          src="/images/escudo.webp"
          alt="Escudo de la Institución Educativa Padre Roberto Arroyave Vélez" />
        <span class="site-header__brand-text">
          <span class="site-header__brand-code">IEPRAV</span>
          <span class="site-header__brand-name">Padre Roberto Arroyave Vélez</span>
        </span>
      </RouterLink>

      <button
        type="button"
        class="site-header__search"
        aria-label="Abrir busqueda">
        <Search aria-hidden="true" />
      </button>

      <button
        type="button"
        class="site-header__toggle"
        :aria-expanded="isMenuOpen"
        aria-label="Abrir menu"
        @click="isMenuOpen = !isMenuOpen">
        <X v-if="isMenuOpen" aria-hidden="true" />
        <Menu v-else aria-hidden="true" />
      </button>

      <nav id="menu-principal" class="site-nav" :class="{ 'site-nav--closed': !isMenuOpen }">
        <ul class="site-nav__list">
          <li :class="{ active: isHome }">
            <RouterLink class="site-nav__link" to="/">
              Inicio
            </RouterLink>
          </li>
          <li :class="{ active: isActive('institution') }">
            <RouterLink class="site-nav__link" to="/institucion">
              Institución
            </RouterLink>
          </li>
          <li :class="{ active: isActive('our-people') }">
            <RouterLink class="site-nav__link" to="/nuestra-gente">
              Nuestra gente
            </RouterLink>
          </li>
          <li :class="{ active: isActive('institutional-horizon') }">
            <RouterLink class="site-nav__link" to="/horizonte-institucional">
              Horizonte institucional
            </RouterLink>
          </li>
          <li :class="{ active: isActive('projects') }">
            <RouterLink class="site-nav__link" to="/proyectos">
              Proyectos
            </RouterLink>
          </li>
          <li :class="{ active: isActive('news') }">
            <RouterLink class="site-nav__link" to="/noticias">
              Noticias
            </RouterLink>
          </li>
          <li :class="{ active: isActive('contact') }">
            <RouterLink class="site-nav__link site-nav__link--featured" to="/contacto">
              Contacto
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: #123c35;
  box-shadow: 0 .5rem 1rem rgba(31, 47, 43, .18);
  color: #fff;
  left: 0;
  padding: .75rem 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: background .3s ease, box-shadow .3s ease;
  z-index: 50;
}

.site-header__container {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.site-header__brand {
  align-items: center;
  color: #fff;
  display: flex;
  gap: .65rem;
  line-height: 1;
  text-decoration: none;
}

.site-header__brand:hover,
.site-header__brand:focus {
  color: #fff;
}

.site-header__crest {
  background: #fff;
  border-radius: 999px;
  display: block;
  flex: 0 0 auto;
  height: 2.75rem;
  object-fit: contain;
  padding: .2rem;
  width: 2.75rem;
}

.site-header__brand-text {
  display: flex;
  flex-direction: column;
}

.site-header__brand-code {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0;
}

.site-header__brand-name {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: 0;
  max-width: 11rem;
  text-transform: uppercase;
}

.site-header__search {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.site-header__search svg {
  height: 1.25rem;
  width: 1.25rem;
}

.site-header__toggle {
  background: transparent;
  border: 0;
  color: #fff;
  line-height: 1;
  margin-left: auto;
  padding: .5rem;
}

.site-header__toggle svg {
  height: 1.75rem;
  width: 1.75rem;
}

.site-nav {
  width: 100%;
}

.site-nav--closed {
  display: none;
}

.site-nav__list {
  display: flex;
  flex-direction: column;
  gap: .25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.site-nav__link {
  border-radius: 4px;
  color: #fff;
  display: block;
  padding: .5rem .75rem;
  text-align: center;
  text-decoration: none;
  transition: color .2s ease, background .2s ease;
}

.site-nav__link:hover,
.site-nav__link:focus,
.active .site-nav__link {
  color: #e5b54b;
}

.site-nav__link--featured {
  background: #e5b54b;
  color: #123c35;
  font-weight: 700;
}

.site-nav__link--featured:hover,
.site-nav__link--featured:focus,
.active .site-nav__link--featured {
  color: #123c35;
}

@media (min-width: 768px) {
  .site-header__toggle {
    display: none;
  }

  .site-nav,
  .site-nav--closed {
    display: block;
    margin-left: auto;
    width: auto;
  }

  .site-nav__list {
    align-items: center;
    flex-direction: row;
    gap: .5rem;
  }
}
</style>
