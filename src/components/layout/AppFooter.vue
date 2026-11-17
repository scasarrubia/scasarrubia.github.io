<script setup>
import { Mail, MapPin, Phone } from '@lucide/vue';

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
  <footer class="site-footer" role="contentinfo">
    <div class="site-footer__container">
      <div class="site-footer__grid">
        <section class="footer-brand" aria-labelledby="footer-brand-title">
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
</style>
