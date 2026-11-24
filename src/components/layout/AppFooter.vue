<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowUp, ChevronRight, ExternalLink, Mail, MapPin, MonitorCheck, Phone } from '@lucide/vue';

const facebookUrl = 'https://www.facebook.com/p/Institucion-Educativa-Padre-Roberto-Arroyave-Velez-100039734155514/';

const siteLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Institución', to: '/institucion' },
  { label: 'Nuestra gente', to: '/nuestra-gente' },
  { label: 'Horizonte institucional', to: '/horizonte-institucional' },
  { label: 'Proyectos', to: '/proyectos' },
  { label: 'Noticias', to: '/noticias' },
  { label: 'Galería', to: '/galeria' },
  { label: 'Contacto', to: '/contacto' }
];

const interestLinks = [
  {
    label: 'Ministerio de Educación Nacional',
    href: 'https://www.mineducacion.gov.co/'
  },
  {
    label: 'Colombia Aprende',
    href: 'https://www.colombiaaprende.edu.co/'
  },
  {
    label: 'Contenidos para Aprender',
    href: 'https://contenidosparaaprender.colombiaaprende.edu.co/'
  },
  {
    label: 'Secretaría de Educación de Antioquia',
    href: 'https://www.seduca.gov.co/'
  },
  {
    label: 'Alcaldía de San Pedro de los Milagros',
    href: 'https://www.sanpedrodelosmilagros-antioquia.gov.co/'
  }
];

const currentYear = new Date().getFullYear();

// Behind the wave we paint the same background as the page above (white or cream).
const route = useRoute();
const pageBackground = computed(() => route.meta.heroWave || '#f7f8f4');

function scrollToTop() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}
</script>

<template>
  <footer class="site-footer" role="contentinfo">
    <svg class="site-footer__wave" :style="{ backgroundColor: pageBackground }" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path class="site-footer__wave-line" d="M0 42 C 240 6 480 6 720 34 C 960 62 1200 70 1440 30" />
      <path d="M0 48 C 240 12 480 12 720 40 C 960 68 1200 76 1440 36 L1440 80 L0 80 Z" />
    </svg>

    <div class="site-footer__body">
      <img class="site-footer__watermark" src="/images/escudo.webp" alt="" aria-hidden="true" />

      <div class="site-footer__container">
        <!-- Brand band -->
        <div class="footer-hero">
          <RouterLink to="/" class="footer-hero__brand" aria-label="Ir al inicio">
            <img src="/images/escudo.webp" alt="Escudo de la Institución Educativa Padre Roberto Arroyave Vélez" />
            <span>
              <strong>Institución Educativa Padre Roberto Arroyave Vélez</strong>
              <small>Dios · Superación · Ciencia</small>
            </span>
          </RouterLink>

          <div class="footer-hero__actions">
            <a href="https://padreroberto.educa.city/" target="_blank" rel="noopener noreferrer" class="footer-button footer-button--gold">
              <MonitorCheck aria-hidden="true" />
              Ingresar a Educacity
            </a>
            <a
              :href="facebookUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-button footer-button--facebook"
              aria-label="Facebook de la Institución Educativa Padre Roberto Arroyave Vélez">
              <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                <path
                  fill="currentColor"
                  d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.49 0-1.955.93-1.955 1.884v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
              Síguenos en Facebook
            </a>
          </div>
        </div>

        <div class="site-footer__grid">
          <section class="footer-about" aria-labelledby="footer-about-title">
            <h2 id="footer-about-title">Nuestra institución</h2>
            <p>Formación integral para la comunidad educativa de San Pedro de los Milagros, Antioquia.</p>
            <ul class="footer-chips">
              <li><span>Naturaleza</span> Oficial</li>
              <li><span>Carácter</span> Mixto</li>
              <li><span>DANE</span> 105664000292</li>
            </ul>
          </section>

          <section aria-labelledby="footer-explore-title">
            <h3 id="footer-explore-title">Explora</h3>
            <ul class="footer-links footer-links--columns">
              <li v-for="link in siteLinks" :key="link.to">
                <RouterLink :to="link.to">
                  <ChevronRight aria-hidden="true" />
                  {{ link.label }}
                </RouterLink>
              </li>
            </ul>
          </section>

          <section aria-labelledby="footer-contact-title">
            <h3 id="footer-contact-title">Contacto</h3>
            <address class="footer-contact">
              <span class="footer-contact__item">
                <span class="footer-contact__icon"><MapPin aria-hidden="true" /></span>
                <span>Calle 46 No. 50-225, Barrio San José<br>San Pedro de los Milagros, Antioquia</span>
              </span>
              <a class="footer-contact__item" href="tel:+576048687124">
                <span class="footer-contact__icon"><Phone aria-hidden="true" /></span>
                <span>(604) 868 71 24</span>
              </a>
              <a class="footer-contact__item" href="mailto:ieproberto.01@gmail.com">
                <span class="footer-contact__icon"><Mail aria-hidden="true" /></span>
                <span>ieproberto.01@gmail.com</span>
              </a>
            </address>
          </section>

          <section aria-labelledby="footer-interest-title">
            <h3 id="footer-interest-title">Enlaces de interés</h3>
            <ul class="footer-links">
              <li v-for="link in interestLinks" :key="link.label">
                <a :href="link.href" target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden="true" />
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div class="site-footer__bottom">
          <p>© {{ currentYear }} Institución Educativa Padre Roberto Arroyave Vélez. Todos los derechos reservados.</p>
          <button type="button" class="footer-top" @click="scrollToTop">
            <ArrowUp aria-hidden="true" />
            Volver arriba
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  color: #fff;
  font-family: 'Open Sans', Arial, sans-serif;
  position: relative;
  text-align: left;
}

.site-footer,
.site-footer * {
  box-sizing: border-box;
}

/* Wave sits on the page background, so it blends with any page color. */
.site-footer__wave {
  display: block;
  fill: #064b3c;
  height: clamp(2.5rem, 5vw, 4.5rem);
  margin-bottom: -1px;
  width: 100%;
}

.site-footer__wave-line {
  fill: none;
  stroke: #e5b54b;
  stroke-width: 3;
}

.site-footer__body {
  background:
    radial-gradient(circle at 12% 55%, rgba(229, 181, 75, .1), transparent 24rem),
    radial-gradient(circle at 95% 100%, rgba(84, 158, 192, .14), transparent 28rem),
    linear-gradient(180deg, #064b3c 0%, #064b3c 8%, #053d31 60%, #04342a);
  overflow: hidden;
  padding: 1.5rem 0 1.5rem;
  position: relative;
}

.site-footer__watermark {
  bottom: -6rem;
  height: auto;
  opacity: .05;
  pointer-events: none;
  position: absolute;
  right: -5rem;
  width: 28rem;
}

.site-footer__container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
  position: relative;
}

/* ---- Brand band ---- */
.footer-hero {
  align-items: center;
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem 2rem;
  justify-content: space-between;
  margin-bottom: 2.75rem;
  padding: 1.5rem 1.75rem;
}

.footer-hero__brand {
  align-items: center;
  color: #fff;
  display: flex;
  gap: 1.1rem;
  min-width: 0;
  text-decoration: none;
}

.footer-hero__brand img {
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(229, 181, 75, .5), 0 10px 24px rgba(0, 0, 0, .3);
  flex-shrink: 0;
  height: 4.5rem;
  object-fit: contain;
  padding: .2rem;
  transition: transform .4s ease;
  width: 4.5rem;
}

.footer-hero__brand:hover img {
  transform: rotate(-8deg) scale(1.05);
}

.footer-hero__brand span {
  display: flex;
  flex-direction: column;
  gap: .3rem;
  min-width: 0;
}

.footer-hero__brand strong {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.1rem, 2.2vw, 1.4rem);
  line-height: 1.25;
}

.footer-hero__brand small {
  color: #f3d87c;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.footer-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}

.footer-button {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: .9rem;
  font-weight: 700;
  gap: .5rem;
  min-height: 2.75rem;
  padding: .65rem 1.25rem;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
}

.footer-button svg {
  flex-shrink: 0;
  height: 1.15rem;
  width: 1.15rem;
}

.footer-button:hover,
.footer-button:focus-visible {
  box-shadow: 0 10px 22px rgba(0, 0, 0, .25);
  transform: translateY(-2px);
}

.footer-button--gold {
  background: #e5b54b;
  color: #123c35;
}

.footer-button--gold:hover,
.footer-button--gold:focus-visible {
  background: #f3d06f;
}

.footer-button--facebook {
  background: #1877f2;
  color: #fff;
}

.footer-button--facebook:hover,
.footer-button--facebook:focus-visible {
  background: #3b8cf5;
}

/* ---- Columns ---- */
.site-footer__grid {
  display: grid;
  gap: 2.25rem;
}

.site-footer h2,
.site-footer h3 {
  color: #fff;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 1.15rem;
  padding-bottom: .6rem;
  position: relative;
}

.site-footer h2::after,
.site-footer h3::after {
  background: #e5b54b;
  border-radius: 2px;
  bottom: 0;
  content: "";
  height: 3px;
  left: 0;
  position: absolute;
  width: 2.25rem;
}

.footer-about p {
  color: #d5e6db;
  font-size: .93rem;
  line-height: 1.7;
  margin: 0 0 1.1rem;
}

.footer-chips {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-chips li {
  background: rgba(255, 255, 255, .08);
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 999px;
  color: #fff;
  font-size: .8rem;
  font-weight: 600;
  padding: .3rem .75rem;
}

.footer-chips span {
  color: #f3d87c;
  font-weight: 700;
  margin-right: .25rem;
}

.footer-links {
  display: grid;
  gap: .15rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-links a {
  align-items: flex-start;
  border-radius: 8px;
  color: #d5e6db;
  display: flex;
  font-size: .9rem;
  gap: .45rem;
  line-height: 1.45;
  padding: .35rem .25rem;
  text-decoration: none;
  transition: color .2s ease, transform .2s ease;
}

.footer-links svg {
  color: #e5b54b;
  flex-shrink: 0;
  height: .95rem;
  margin-top: .2rem;
  width: .95rem;
}

.footer-links a:hover,
.footer-links a:focus-visible {
  color: #fff;
  transform: translateX(4px);
}

.footer-links a.router-link-exact-active {
  color: #f3d87c;
  font-weight: 700;
}

.footer-contact {
  display: grid;
  font-style: normal;
  gap: .85rem;
}

.footer-contact__item {
  align-items: center;
  color: #d5e6db;
  display: flex;
  font-size: .9rem;
  gap: .75rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.footer-contact__icon {
  align-items: center;
  background: rgba(229, 181, 75, .15);
  border: 1px solid rgba(229, 181, 75, .35);
  border-radius: 50%;
  color: #f3d87c;
  display: flex;
  flex-shrink: 0;
  height: 2.4rem;
  justify-content: center;
  transition: background .2s ease, color .2s ease;
  width: 2.4rem;
}

.footer-contact__icon svg {
  height: 1.05rem;
  width: 1.05rem;
}

a.footer-contact__item:hover,
a.footer-contact__item:focus-visible {
  color: #fff;
}

a.footer-contact__item:hover .footer-contact__icon,
a.footer-contact__item:focus-visible .footer-contact__icon {
  background: #e5b54b;
  color: #123c35;
}

/* ---- Bottom bar ---- */
.site-footer__bottom {
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, .14);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2.5rem;
  padding-top: 1.25rem;
}

.site-footer__bottom p {
  color: rgba(255, 255, 255, .7);
  flex: 1 1 24rem;
  font-size: .8rem;
  margin: 0;
}

.footer-top {
  align-items: center;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, .3);
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: .82rem;
  font-weight: 700;
  gap: .4rem;
  padding: .5rem 1rem;
  transition: background .2s ease, border-color .2s ease, color .2s ease;
}

.footer-top svg {
  height: 1rem;
  transition: transform .2s ease;
  width: 1rem;
}

.footer-top:hover,
.footer-top:focus-visible {
  background: #e5b54b;
  border-color: #e5b54b;
  color: #123c35;
}

.footer-top:hover svg {
  transform: translateY(-2px);
}

.site-footer a:focus-visible,
.site-footer button:focus-visible {
  outline: 2px solid #f5d66e;
  outline-offset: 3px;
}

@media (min-width: 700px) {
  .site-footer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .footer-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .site-footer__grid {
    gap: 2.5rem;
    grid-template-columns: 1.2fr .9fr 1.1fr 1.1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-hero__brand img,
  .footer-button,
  .footer-links a,
  .footer-top svg {
    transition: none;
  }

  .footer-hero__brand:hover img,
  .footer-button:hover,
  .footer-links a:hover,
  .footer-top:hover svg {
    transform: none;
  }
}

@media (max-width: 699px) {
  .footer-hero {
    padding: 1.25rem;
  }

  .footer-hero__brand img {
    height: 3.75rem;
    width: 3.75rem;
  }

  .footer-hero__actions,
  .footer-button {
    width: 100%;
  }

  .footer-button {
    justify-content: center;
  }

  .footer-links--columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .site-footer__grid > section + section {
    border-top: 1px solid rgba(255, 255, 255, .12);
    padding-top: 1.75rem;
  }

  .footer-top {
    justify-content: center;
    width: 100%;
  }
}
</style>
