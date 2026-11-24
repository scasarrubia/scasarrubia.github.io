<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
  ArrowRight,
  BookOpenText,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  MonitorCheck,
  Navigation,
  Newspaper,
  Phone
} from '@lucide/vue';

const institutionEmail = 'ieproberto.01@gmail.com';
const address = 'Calle 46 No. 50-225, Barrio San José';
const city = 'San Pedro de los Milagros, Antioquia';
const mapQuery = encodeURIComponent(`Institución Educativa Padre Roberto Arroyave Vélez, ${address}, ${city}`);
const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
const facebookUrl = 'https://www.facebook.com/p/Institucion-Educativa-Padre-Roberto-Arroyave-Velez-100039734155514/';

const emailCopied = ref(false);
let copiedTimer;

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(institutionEmail);
    emailCopied.value = true;
    window.clearTimeout(copiedTimer);
    copiedTimer = window.setTimeout(() => {
      emailCopied.value = false;
    }, 2200);
  } catch {
    window.prompt('Copia el correo institucional:', institutionEmail);
  }
}

onBeforeUnmount(() => window.clearTimeout(copiedTimer));

const quickLinks = [
  { label: 'Plataforma Educacity', detail: 'Notas, tareas y procesos académicos', href: 'https://padreroberto.educa.city/', icon: MonitorCheck, external: true },
  { label: 'Manual de convivencia', detail: 'PEI, SIEE y documentos oficiales', to: '/horizonte-institucional', icon: BookOpenText },
  { label: 'Noticias y comunicados', detail: 'Lo más reciente de la institución', to: '/noticias', icon: Newspaper }
];
</script>

<template>
  <main class="contact-page">
    <div class="page-container">
      <section class="contact-intro">
        <p v-reveal="'down'" class="section-kicker">Canales de atención</p>
        <h1 v-reveal="{ direction: 'up', delay: 120 }">Estamos para atenderte</h1>
        <p v-reveal="{ direction: 'up', delay: 220 }">
          Familias, estudiantes, egresados y comunidad pueden comunicarse con la Institución Educativa Padre Roberto
          Arroyave Vélez por cualquiera de estos medios.
        </p>
      </section>

      <section class="channels" aria-label="Medios de contacto">
        <article v-reveal="{ direction: 'up', delay: 60 }" class="channel" style="--accent: #07513e">
          <span class="channel__icon"><Phone aria-hidden="true" /></span>
          <h2>Teléfono</h2>
          <p class="channel__value">(604) 868 71 24</p>
          <p class="channel__detail">Línea fija de la institución.</p>
          <a href="tel:+576048687124" class="channel__action">
            <Phone aria-hidden="true" />
            Llamar
          </a>
        </article>

        <article v-reveal="{ direction: 'up', delay: 160 }" class="channel" style="--accent: #b77c17">
          <span class="channel__icon"><Mail aria-hidden="true" /></span>
          <h2>Correo electrónico</h2>
          <p class="channel__value channel__value--email">{{ institutionEmail }}</p>
          <p class="channel__detail">Escríbenos tus solicitudes y consultas.</p>
          <div class="channel__actions">
            <a :href="`mailto:${institutionEmail}`" class="channel__action">
              <Mail aria-hidden="true" />
              Escribir
            </a>
            <button
              type="button"
              class="channel__action channel__action--ghost channel__action--icon"
              :aria-label="emailCopied ? 'Correo copiado' : 'Copiar correo'"
              :title="emailCopied ? 'Correo copiado' : 'Copiar correo'"
              @click="copyEmail">
              <Check v-if="emailCopied" aria-hidden="true" />
              <Copy v-else aria-hidden="true" />
            </button>
            <span v-if="emailCopied" class="channel__copied" role="status">¡Copiado!</span>
          </div>
        </article>

        <article v-reveal="{ direction: 'up', delay: 260 }" class="channel" style="--accent: #2f7fa6">
          <span class="channel__icon"><MapPin aria-hidden="true" /></span>
          <h2>Dirección</h2>
          <p class="channel__value">{{ address }}</p>
          <p class="channel__detail">{{ city }}</p>
          <a :href="mapDirectionsUrl" target="_blank" rel="noopener noreferrer" class="channel__action">
            <Navigation aria-hidden="true" />
            Cómo llegar
          </a>
        </article>

        <article v-reveal="{ direction: 'up', delay: 360 }" class="channel" style="--accent: #1877f2">
          <span class="channel__icon">
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
              <path
                fill="currentColor"
                d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.49 0-1.955.93-1.955 1.884v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </span>
          <h2>Facebook</h2>
          <p class="channel__value">Página institucional</p>
          <p class="channel__detail">Fotos, eventos y novedades de la comunidad.</p>
          <a :href="facebookUrl" target="_blank" rel="noopener noreferrer" class="channel__action">
            <ExternalLink aria-hidden="true" />
            Visitar
          </a>
        </article>
      </section>

      <section class="location" aria-labelledby="location-title">
        <div v-reveal="'left'" class="location__info">
          <p class="section-kicker">Ubicación</p>
          <h2 id="location-title">Visítanos</h2>
          <p class="location__address">
            <MapPin aria-hidden="true" />
            <span>
              <strong>{{ address }}</strong><br>
              {{ city }}
            </span>
          </p>
          <dl class="location__facts">
            <div><dt>Naturaleza</dt><dd>Oficial</dd></div>
            <div><dt>Carácter</dt><dd>Mixto</dd></div>
            <div><dt>Código DANE</dt><dd>105664000292</dd></div>
          </dl>
          <a :href="mapDirectionsUrl" target="_blank" rel="noopener noreferrer" class="location__button">
            <Navigation aria-hidden="true" />
            Abrir en Google Maps
          </a>
        </div>

        <div v-reveal="'right'" class="location__map">
          <iframe
            :src="mapEmbedUrl"
            title="Mapa de ubicación de la Institución Educativa Padre Roberto Arroyave Vélez"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen></iframe>
        </div>
      </section>

      <section class="quick" aria-labelledby="quick-title">
        <div class="quick__heading">
          <p class="section-kicker">Antes de escribir</p>
          <h2 id="quick-title">Quizás encuentres aquí lo que buscas</h2>
        </div>

        <ul class="quick__list">
          <li v-for="(link, index) in quickLinks" :key="link.label" v-reveal="{ direction: 'up', delay: 80 + index * 100 }">
            <component
              :is="link.external ? 'a' : RouterLink"
              v-bind="link.external ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' } : { to: link.to }"
              class="quick__card">
              <span class="quick__icon"><component :is="link.icon" aria-hidden="true" /></span>
              <span class="quick__text">
                <strong>{{ link.label }}</strong>
                <small>{{ link.detail }}</small>
              </span>
              <ArrowRight class="quick__arrow" aria-hidden="true" />
            </component>
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>

<style scoped>
.contact-page {
  background: #f7f8f4;
  color: #1f2f2b;
  font-family: 'Open Sans', Arial, sans-serif;
  padding: 3.5rem 0 4.5rem;
}

/* The site has no global box-sizing reset (Tailwind preflight is off). */
.contact-page,
.contact-page :deep(*),
.contact-page :deep(*::before),
.contact-page :deep(*::after) {
  box-sizing: border-box;
}

.page-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.section-kicker {
  color: #8b6418;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .08em;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

.contact-page h1,
.contact-page h2 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
}

/* ---- Intro ---- */
.contact-intro {
  margin: 0 auto 2.75rem;
  max-width: 50rem;
  text-align: center;
}

.contact-intro h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.12;
  margin: 0;
  padding-bottom: .8rem;
  position: relative;
}

.contact-intro h1::after,
.quick__heading h2::after {
  background: #e5b54b;
  border-radius: 2px;
  bottom: 0;
  content: "";
  height: 4px;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  width: 3.5rem;
}

.contact-intro > p:last-child {
  color: #42554f;
  line-height: 1.65;
  margin: 1rem 0 0;
}

/* ---- Channels ---- */
.channels {
  display: grid;
  gap: 1.25rem;
}

.channel {
  background: #fff;
  border: 1px solid #e3e9e1;
  border-radius: 18px;
  border-top: 4px solid var(--accent);
  box-shadow: 0 14px 34px rgba(18, 60, 53, .08);
  display: flex;
  flex-direction: column;
  padding: 1.6rem 1.5rem 1.5rem;
  transition: transform .3s ease, box-shadow .3s ease;
}

.channel:hover {
  box-shadow: 0 22px 44px rgba(18, 60, 53, .15);
  transform: translateY(-5px);
}

.channel__icon {
  align-items: center;
  background: color-mix(in srgb, var(--accent) 12%, #fff);
  border-radius: 16px;
  color: var(--accent);
  display: flex;
  height: 3.5rem;
  justify-content: center;
  margin-bottom: 1.1rem;
  transition: transform .3s ease, background .3s ease, color .3s ease;
  width: 3.5rem;
}

.channel:hover .channel__icon {
  background: var(--accent);
  color: #fff;
  transform: rotate(-8deg) scale(1.06);
}

.channel__icon svg {
  height: 1.6rem;
  width: 1.6rem;
}

.channel h2 {
  font-size: 1.2rem;
  margin: 0 0 .5rem;
}

.channel__value {
  color: #123c35;
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
}

.channel__value--email {
  font-size: .95rem;
  overflow-wrap: anywhere;
}

.channel__detail {
  color: #5b6d62;
  font-size: .88rem;
  line-height: 1.5;
  margin: .35rem 0 1.25rem;
}

.channel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  margin-top: auto;
}

.channel > .channel__action {
  margin-top: auto;
}

.channel__action {
  align-items: center;
  align-self: flex-start;
  background: var(--accent);
  border: 2px solid var(--accent);
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: .88rem;
  font-weight: 700;
  gap: .4rem;
  padding: .55rem 1.1rem;
  text-decoration: none;
  transition: filter .2s ease, transform .2s ease;
}

.channel__action svg {
  height: 1rem;
  width: 1rem;
}

.channel__action:hover,
.channel__action:focus-visible {
  filter: brightness(1.12);
  transform: translateY(-2px);
}

.channel__action:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 2px;
}

.channel__action--ghost {
  background: #fff;
  color: var(--accent);
}

.channel__action--icon {
  align-self: center;
  height: 2.6rem;
  justify-content: center;
  padding: 0;
  width: 2.6rem;
}

.channel__actions {
  align-items: center;
}

.channel__copied {
  color: var(--accent);
  font-size: .82rem;
  font-weight: 700;
}

/* ---- Location ---- */
.location {
  background: linear-gradient(150deg, #0b4a3d, #123c35 60%, #0d2f2a);
  border-radius: 24px;
  box-shadow: 0 22px 50px rgba(18, 60, 53, .22);
  color: #fff;
  display: grid;
  margin-top: 4rem;
  overflow: hidden;
}

.location__info {
  padding: 2.25rem;
}

.location .section-kicker {
  color: #f3d87c;
}

.location h2 {
  color: #fff;
  font-size: clamp(1.7rem, 3.5vw, 2.3rem);
  margin: 0 0 1.25rem;
}

.location__address {
  align-items: flex-start;
  display: flex;
  gap: .75rem;
  line-height: 1.6;
  margin: 0 0 1.5rem;
}

.location__address svg {
  color: #e5b54b;
  flex-shrink: 0;
  height: 1.4rem;
  margin-top: .15rem;
  width: 1.4rem;
}

.location__address span {
  color: rgba(255, 255, 255, .85);
}

.location__address strong {
  color: #fff;
}

.location__facts {
  border-top: 1px solid rgba(255, 255, 255, .14);
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0 0 1.75rem;
  padding-top: 1.25rem;
}

.location__facts dt {
  color: rgba(255, 255, 255, .6);
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.location__facts dd {
  font-weight: 600;
  margin: .2rem 0 0;
  overflow-wrap: anywhere;
}

.location__button {
  align-items: center;
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-weight: 700;
  gap: .5rem;
  padding: .8rem 1.4rem;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease;
}

.location__button svg {
  height: 1.1rem;
  width: 1.1rem;
}

.location__button:hover,
.location__button:focus-visible {
  background: #f3d06f;
  transform: translateY(-2px);
}

.location__button:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}

.location__map {
  background: #e7f0e8;
  min-height: 20rem;
  position: relative;
}

.location__map iframe {
  border: 0;
  display: block;
  height: 100%;
  inset: 0;
  position: absolute;
  width: 100%;
}

/* ---- Quick links ---- */
.quick {
  margin-top: 4rem;
}

.quick__heading {
  margin-bottom: 2rem;
  text-align: center;
}

.quick__heading h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin: 0;
  padding-bottom: .7rem;
  position: relative;
}

.quick__list {
  display: grid;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.quick__card {
  align-items: center;
  background: #fff;
  border: 1px solid #e3e9e1;
  border-radius: 16px;
  box-shadow: 0 10px 26px rgba(18, 60, 53, .07);
  color: inherit;
  display: flex;
  gap: 1rem;
  height: 100%;
  padding: 1.1rem 1.25rem;
  text-decoration: none;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}

.quick__card:hover,
.quick__card:focus-visible {
  border-color: #cfdccf;
  box-shadow: 0 18px 36px rgba(18, 60, 53, .14);
  transform: translateY(-3px);
}

.quick__card:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 2px;
}

.quick__icon {
  align-items: center;
  background: #e7f0e8;
  border-radius: 12px;
  color: #07513e;
  display: flex;
  flex-shrink: 0;
  height: 3rem;
  justify-content: center;
  width: 3rem;
}

.quick__icon svg {
  height: 1.4rem;
  width: 1.4rem;
}

.quick__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: .15rem;
  min-width: 0;
}

.quick__text strong {
  color: #123c35;
}

.quick__text small {
  color: #5b6d62;
  font-size: .84rem;
}

.quick__arrow {
  color: #b3821c;
  flex-shrink: 0;
  height: 1.15rem;
  transition: transform .2s ease;
  width: 1.15rem;
}

.quick__card:hover .quick__arrow {
  transform: translateX(.25rem);
}

@media (min-width: 640px) {
  .channels {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .location {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  }

  .location__info {
    padding: 3rem;
  }

  .quick__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .channels {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .channel,
  .channel__icon,
  .channel__action,
  .location__button,
  .quick__card,
  .quick__arrow {
    transition: none;
  }

  .channel:hover,
  .channel:hover .channel__icon,
  .channel__action:hover,
  .location__button:hover,
  .quick__card:hover,
  .quick__card:hover .quick__arrow {
    transform: none;
  }
}

@media (max-width: 520px) {
  .location__info {
    padding: 1.5rem;
  }

  .location__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .location__button {
    justify-content: center;
    width: 100%;
  }
}
</style>
