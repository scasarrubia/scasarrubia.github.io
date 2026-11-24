<script setup>
import { RouterLink } from 'vue-router';
import { ArrowRight, BookOpenText, Lightbulb, MessageCircle, MonitorCheck, Newspaper } from '@lucide/vue';

const accessLinks = [
  {
    title: 'Educacity',
    detail: 'Tareas, notas y procesos académicos.',
    href: 'https://padreroberto.educa.city/',
    icon: MonitorCheck,
    external: true,
    featured: true
  },
  {
    title: 'Manual de convivencia',
    detail: 'PEI, SIEE y documentos institucionales.',
    to: '/horizonte-institucional',
    icon: BookOpenText
  },
  {
    title: 'Proyectos',
    detail: 'Experiencias pedagógicas y comunitarias.',
    to: '/proyectos',
    icon: Lightbulb
  },
  {
    title: 'Noticias',
    detail: 'Comunicados y vida escolar.',
    to: '/noticias',
    icon: Newspaper
  },
  {
    title: 'Contacto',
    detail: 'Canales de atención institucional.',
    to: '/contacto',
    icon: MessageCircle
  }
];
</script>

<template>
  <section id="accesos" class="quick-access" aria-label="Accesos rápidos">
    <ul class="quick-access__list">
      <li
        v-for="(link, index) in accessLinks"
        :key="link.title"
        :style="{ '--index': index }">
        <component
          :is="link.external ? 'a' : RouterLink"
          v-bind="link.external ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' } : { to: link.to }"
          class="quick-access__card"
          :class="{ 'quick-access__card--featured': link.featured }">
          <span class="quick-access__icon">
            <component :is="link.icon" aria-hidden="true" />
          </span>
          <span class="quick-access__title">{{ link.title }}</span>
          <span class="quick-access__detail">{{ link.detail }}</span>
          <ArrowRight class="quick-access__arrow" aria-hidden="true" />
        </component>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.quick-access {
  margin: -5rem auto 0;
  max-width: 1200px;
  padding: 0 1.5rem;
  position: relative;
  z-index: 3;
}

.quick-access__list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

.quick-access__card {
  background: #fff;
  border: 1px solid #e0e7df;
  border-radius: 16px;
  box-shadow: 0 14px 34px rgba(18, 60, 53, .12);
  color: #1f2f2b;
  display: flex;
  flex-direction: column;
  gap: .35rem;
  height: 100%;
  overflow: hidden;
  padding: 1.35rem 1.25rem 1.2rem;
  position: relative;
  text-decoration: none;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}

.quick-access__card::before {
  background: linear-gradient(90deg, #e5b54b, #07513e);
  content: "";
  height: 4px;
  inset: 0 0 auto;
  position: absolute;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .3s ease;
}

.quick-access__card:hover,
.quick-access__card:focus-visible {
  border-color: #cfdccf;
  box-shadow: 0 22px 44px rgba(18, 60, 53, .2);
  transform: translateY(-6px);
}

.quick-access__card:hover::before,
.quick-access__card:focus-visible::before {
  transform: scaleX(1);
}

.quick-access__card:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 3px;
}

.quick-access__icon {
  align-items: center;
  background: #e7f0e8;
  border-radius: 12px;
  color: #07513e;
  display: inline-flex;
  height: 3rem;
  justify-content: center;
  margin-bottom: .5rem;
  transition: background .25s ease, color .25s ease, transform .25s ease;
  width: 3rem;
}

.quick-access__icon svg {
  height: 1.5rem;
  width: 1.5rem;
}

.quick-access__card:hover .quick-access__icon {
  background: #07513e;
  color: #f3d87c;
  transform: rotate(-6deg) scale(1.05);
}

.quick-access__title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.25;
}

.quick-access__detail {
  color: #5b6d62;
  font-size: .85rem;
  line-height: 1.45;
}

.quick-access__arrow {
  color: #b3821c;
  flex-shrink: 0;
  height: 1.15rem;
  margin-top: auto;
  transition: transform .25s ease;
  width: 1.15rem;
}

.quick-access__detail {
  margin-bottom: .6rem;
}

.quick-access__list li {
  animation: quick-access-in .7s cubic-bezier(.22, 1, .36, 1) both;
  animation-delay: calc(var(--index) * 90ms + 250ms);
}

@keyframes quick-access-in {
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
}

.quick-access__card:hover .quick-access__arrow {
  transform: translateX(.35rem);
}

.quick-access__card--featured {
  background: linear-gradient(145deg, #064b3c, #1e6350);
  border-color: transparent;
  color: #fff;
}

.quick-access__card--featured .quick-access__icon {
  background: rgba(255, 255, 255, .14);
  color: #f3d87c;
}

.quick-access__card--featured .quick-access__detail {
  color: rgba(255, 255, 255, .82);
}

.quick-access__card--featured .quick-access__arrow {
  color: #f3d87c;
}

.quick-access__card--featured:hover .quick-access__icon {
  background: #e5b54b;
  color: #123c35;
}

@media (prefers-reduced-motion: reduce) {
  .quick-access__list li {
    animation: none;
  }

  .quick-access__card,
  .quick-access__card::before,
  .quick-access__icon,
  .quick-access__arrow {
    transition: none;
  }
}

@media (max-width: 1000px) {
  .quick-access__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .quick-access__list li:first-child {
    grid-column: span 3;
  }
}

@media (max-width: 620px) {
  .quick-access {
    margin-top: -3rem;
    padding: 0 1rem;
  }

  .quick-access__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: .75rem;
  }

  .quick-access__list li:first-child {
    grid-column: span 2;
  }

  .quick-access__card {
    padding: 1rem;
  }

  .quick-access__detail {
    display: none;
  }
}
</style>
