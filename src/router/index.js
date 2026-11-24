import { createRouter, createWebHashHistory } from 'vue-router';
import ContactPage from '../pages/ContactPage.vue';
import EducationOfferPage from '../pages/EducationOfferPage.vue';
import HomePage from '../pages/HomePage.vue';
import InstitutionPage from '../pages/InstitutionPage.vue';
import NewsDetailPage from '../pages/NewsDetailPage.vue';
import NewsPage from '../pages/NewsPage.vue';
import OurPeoplePage from '../pages/OurPeoplePage.vue';
import ProjectsPage from '../pages/ProjectsPage.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        heroTitle: 'Institución Educativa Padre Roberto Arroyave Vélez',
        heroSubtitle: 'Formación integral para niñas, niños y jóvenes, con sentido humano, compromiso académico y amor por el territorio.',
        heroEyebrow: 'San Pedro de los Milagros'
      }
    },
    {
      path: '/institucion',
      name: 'institution',
      component: InstitutionPage,
      meta: {
        heroTitle: 'Nuestra Institución',
        heroSubtitle: 'Identidad, historia, misión, visión y símbolos de la Institución Educativa Padre Roberto Arroyave Vélez.',
        heroEyebrow: 'Formación integral'
      }
    },
    {
      path: '/nuestra-gente',
      name: 'our-people',
      component: OurPeoplePage,
      meta: {
        heroTitle: 'Nuestra Gente',
        heroSubtitle: 'Grupos, docentes, directivos y personal de apoyo que dan vida a la comunidad educativa.',
        heroEyebrow: 'Comunidad IEPRAV'
      }
    },
    {
      path: '/horizonte-institucional',
      alias: '/oferta-educativa',
      name: 'institutional-horizon',
      component: EducationOfferPage,
      meta: {
        heroTitle: 'Horizonte Institucional',
        heroSubtitle: 'Manual de convivencia, PEI y Sistema Institucional de Evaluación para consulta de la comunidad educativa.',
        heroEyebrow: 'Documentos institucionales',
        heroWave: '#fff'
      }
    },
    {
      path: '/proyectos',
      name: 'projects',
      component: ProjectsPage,
      meta: {
        heroTitle: 'Proyectos Institucionales',
        heroSubtitle: 'Experiencias pedagógicas, culturales, ambientales y comunitarias que fortalecen la vida escolar.',
        heroEyebrow: 'Vida escolar'
      }
    },
    {
      path: '/noticias',
      name: 'news',
      component: NewsPage,
      meta: {
        heroTitle: 'Noticias y Comunicados',
        heroSubtitle: 'Un espacio para publicar novedades, circulares, galerías y momentos importantes de la comunidad educativa.',
        heroEyebrow: 'Actualidad institucional',
        heroWave: '#fff'
      }
    },
    {
      path: '/noticias/:slug',
      name: 'news-detail',
      component: NewsDetailPage,
      meta: {
        heroTitle: 'Detalle de Noticia',
        heroSubtitle: 'Información institucional ampliada para la comunidad educativa.',
        heroEyebrow: 'Actualidad institucional',
        heroWave: '#fff'
      }
    },
    {
      path: '/contacto',
      name: 'contact',
      component: ContactPage,
      meta: {
        heroTitle: 'Contacto',
        heroSubtitle: 'Institución Educativa Padre Roberto Arroyave Vélez, San Pedro de los Milagros',
        heroEyebrow: 'Canales de atención'
      }
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 100,
        behavior: 'smooth'
      };
    }

    return { top: 0 };
  }
});
