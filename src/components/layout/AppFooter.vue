<script setup>
import { Mail, MapPin, Phone } from '@lucide/vue';

defineProps({ homePreview: { type: Boolean, default: false } });

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
</script>

<template>
  <footer class="site-footer" :class="{ 'site-footer--home': homePreview }" role="contentinfo">
    <div class="site-footer__container">
      <div class="site-footer__grid">
        <section class="footer-brand" aria-labelledby="footer-brand-title">
          <img v-if="homePreview" class="footer-brand__crest" src="/images/escudo.webp" alt="Escudo institucional" width="64" height="64" loading="lazy" />
          <h2 id="footer-brand-title">
            Institución Educativa Padre Roberto Arroyave Vélez
          </h2>
          <p>
            Formación integral para la comunidad educativa de San Pedro de los Milagros, Antioquia.
          </p>
          <ul>
            <li><strong>Naturaleza:</strong> Oficial</li>
            <li><strong>Carácter:</strong> Mixto</li>
            <li><strong>Código DANE:</strong> 105664000292</li>
          </ul>
        </section>

        <section aria-labelledby="footer-contact-title">
          <h3 id="footer-contact-title">Contacto</h3>
          <address class="footer-contact">
            <span><MapPin aria-hidden="true" /> Calle 46 No. 50-225, Barrio San José</span>
            <span>San Pedro de los Milagros, Antioquia</span>
            <a href="tel:+5748687124">
              <Phone aria-hidden="true" /> 868 71 24
            </a>
            <a href="mailto:ieproberto.01@gmail.com">
              <Mail aria-hidden="true" /> ieproberto.01@gmail.com
            </a>
          </address>
        </section>

        <section aria-labelledby="footer-interest-title">
          <h3 id="footer-interest-title">Enlaces de interés</h3>
          <ul class="footer-links">
            <li v-for="link in interestLinks" :key="link.label">
              <a :href="link.href" target="_blank" rel="noopener noreferrer">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div class="site-footer__bottom">
        <p>© 2026 Institución Educativa Padre Roberto Arroyave Vélez. Todos los derechos reservados.</p>
        <a
          class="site-footer__social"
          href="https://www.facebook.com/p/Institucion-Educativa-Padre-Roberto-Arroyave-Velez-100039734155514/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook de la Institución Educativa Padre Roberto Arroyave Vélez">
          <span v-if="homePreview">Síguenos en Facebook</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
            <path
              fill="currentColor"
              d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.49 0-1.955.93-1.955 1.884v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: #123c35;
  color: #fff;
  padding: 2.5rem 0;
  text-align: left;
}

.site-footer__container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.site-footer__grid {
  display: grid;
  gap: 1.75rem;
}

.site-footer h2,
.site-footer h3 {
  color: #fff;
  font-weight: 700;
  margin: 0 0 .75rem;
}

.site-footer h2 {
  font-size: 1.25rem;
  line-height: 1.25;
}

.site-footer h3 {
  font-size: 1rem;
}

.site-footer p,
.site-footer ul,
.footer-contact {
  color: rgba(255, 255, 255, .82);
  font-size: .875rem;
}

.site-footer p {
  line-height: 1.65;
  margin: 0 0 1rem;
}

.site-footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-brand li,
.footer-links li {
  margin-bottom: .45rem;
}

.footer-contact {
  display: grid;
  font-style: normal;
  gap: .5rem;
}

.footer-contact span,
.footer-contact a {
  align-items: flex-start;
  display: flex;
  gap: .5rem;
}

.footer-contact svg {
  color: #e5b54b;
  flex: 0 0 auto;
  height: 1rem;
  margin-top: .15rem;
  width: 1rem;
}

.footer-contact a,
.footer-links a {
  color: rgba(255, 255, 255, .86);
  text-decoration: none;
  transition: color .2s ease, padding-left .2s ease;
}

.footer-links a {
  display: block;
  padding: .25rem 0;
}

.footer-contact a:hover,
.footer-contact a:focus,
.footer-links a:hover,
.footer-links a:focus {
  color: #e5b54b;
}

.site-footer__bottom {
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, .15);
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 1.75rem;
  padding-top: 1rem;
}

.site-footer__bottom p {
  color: rgba(255, 255, 255, .74);
  margin: 0;
}

.site-footer__social {
  align-items: center;
  background: #fff;
  border-radius: 999px;
  color: #1877f2;
  display: inline-flex;
  flex: 0 0 auto;
  height: 2.5rem;
  justify-content: center;
  text-decoration: none;
  transition: background .2s ease, color .2s ease;
  width: 2.5rem;
}

.site-footer__social svg {
  height: 1.85rem;
  width: 1.85rem;
}

.site-footer__social:hover,
.site-footer__social:focus {
  background: #1877f2;
  color: #fff;
}

@media (min-width: 768px) {
  .site-footer__grid {
    grid-template-columns: 1.5fr 1.1fr 1.2fr;
  }
}
/* Refined footer enabled only on Home. */
.site-footer--home { background: #064b3c; border-top: 4px solid #d9bd52; font-family: 'Open Sans', Arial, sans-serif; }
.site-footer--home, .site-footer--home * { box-sizing: border-box; }
.site-footer--home h2, .site-footer--home h3 { font-family: Georgia, 'Times New Roman', serif; }
.site-footer--home h2 { font-size: 1.3rem; line-height: 1.4; }
.site-footer--home h3 { font-size: 1.15rem; margin-bottom: 1.1rem; }
.footer-brand__crest { display: block; object-fit: contain; width: 4rem; height: 4rem; margin-bottom: 1rem; }
.site-footer--home p, .site-footer--home ul, .site-footer--home .footer-contact { font-size: .95rem; line-height: 1.75; color: #e1eee5; }
.site-footer--home .footer-brand ul { padding-top: .75rem; border-top: 1px solid #ffffff24; }
.site-footer--home .footer-brand li { margin: .25rem 0; font-size: .85rem; }
.site-footer--home .footer-contact { gap: .85rem; }
.site-footer--home .footer-contact a, .site-footer--home .footer-links a { color: #e1eee5; overflow-wrap: anywhere; }
.site-footer--home .footer-contact a { min-height: 2.5rem; align-items: center; }
.site-footer--home .footer-links a { padding: .4rem 0; }
.site-footer--home .footer-links a:hover, .site-footer--home .footer-contact a:hover { color: #f5d66e; text-decoration: underline; }
.site-footer--home a:focus-visible { outline: 2px solid #f5d66e; outline-offset: 4px; }
.site-footer--home .site-footer__bottom { margin-top: 2rem; padding-top: 1.25rem; flex-wrap: wrap; }
.site-footer--home .site-footer__bottom p { font-size: .8rem; flex: 1 1 28rem; }
.site-footer--home .site-footer__social { gap: .6rem; background: #ffffff12; border: 1px solid #ffffff40; color: white; border-radius: 8px; width: auto; height: auto; min-height: 44px; padding: .65rem .85rem; font-size: .8rem; max-width: 100%; }
.site-footer--home .site-footer__social svg { width: 1.2rem; height: 1.2rem; flex-shrink: 0; }
.site-footer--home .site-footer__social:hover { background: #ffffff25; }
@media (min-width: 768px) and (max-width: 1023px) {
  .site-footer--home .site-footer__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .site-footer--home .footer-brand { grid-column: 1 / -1; }
}
@media (min-width: 1024px) {
  .site-footer--home .site-footer__grid { grid-template-columns: 1.25fr 1fr 1fr; gap: 2.5rem; }
  .site-footer--home .site-footer__grid > section + section { border-left: 1px solid #ffffff24; padding-left: 1.75rem; }
}
@media (max-width: 767px) {
  .site-footer--home { padding-top: 2rem; }
  .site-footer--home .site-footer__container { padding: 0 1rem; }
  .site-footer--home .site-footer__grid > section + section { padding-top: 1.5rem; border-top: 1px solid #ffffff24; }
}
</style>
