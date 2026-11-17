<script setup>
import { computed, onUnmounted, ref } from 'vue';
import {
  BookOpen,
  Download,
  Eye,
  GraduationCap,
  HeartHandshake,
  Leaf,
  Megaphone,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
  X
} from '@lucide/vue';
import { useInstitutionalProjects } from '../composables/useInstitutionalProjects';

const projectIcons = {
  ambiente: Leaf,
  convivencia: HeartHandshake,
  democracia: Users,
  lectura: BookOpen,
  orientacion: GraduationCap,
  cultura: Palette,
  prevencion: ShieldCheck,
  comunicacion: Megaphone,
  default: Sparkles
};

const activeProject = ref(null);
const activeCategory = ref('Todos');
const { categories, error, projects } = useInstitutionalProjects();

const filteredProjects = computed(() => {
  if (activeCategory.value === 'Todos') return projects.value;
  return projects.value.filter((project) => project.category === activeCategory.value);
});

function getProjectIcon(project) {
  return projectIcons[project.icon] || projectIcons.default;
}

function openProject(project) {
  if (!project.previewUrl) return;
  activeProject.value = project;
  document.body.style.overflow = 'hidden';
}

function closeProject() {
  activeProject.value = null;
  document.body.style.overflow = '';
}

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <main class="projects-page">
    <section class="projects-intro">
      <div class="page-container">
        <p v-reveal="'down'" class="projects-intro__kicker">Proyectos institucionales</p>
        <p v-reveal="{ direction: 'up', delay: 220 }">
          Consulta los proyectos pedagógicos de la institución, léelos en línea y descarga los documentos para revisión.
        </p>
      </div>
    </section>

    <section class="projects-catalog">
      <div class="page-container">
        <div v-reveal="{ direction: 'up', delay: 120 }" class="projects-filters" aria-label="Filtrar proyectos por categoría">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="{ 'projects-filters__button--active': activeCategory === category }"
            @click="activeCategory = category">
            {{ category }}
          </button>
        </div>

        <div v-if="error" v-reveal="{ direction: 'up', delay: 180 }" class="projects-toolbar">
          <p v-if="error">{{ error }} Se muestran proyectos locales de respaldo.</p>
        </div>

        <div class="projects-grid">
          <article
            v-for="(project, index) in filteredProjects"
            :key="project.title"
            v-reveal="{ direction: index % 3 === 0 ? 'left' : index % 3 === 1 ? 'up' : 'right', delay: 80 + index * 35 }"
            class="project-card">
            <div class="project-card__media">
              <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title" />
              <component v-else :is="getProjectIcon(project)" class="icon-spin-hover" aria-hidden="true" />
            </div>

            <div class="project-card__body">
              <span>{{ project.category }}</span>
              <h2>{{ project.title }}</h2>
              <p>{{ project.description }}</p>
            </div>

            <div class="project-card__actions">
              <button type="button" :disabled="!project.previewUrl" @click="openProject(project)">
                <Eye aria-hidden="true" />
                Ver en línea
              </button>
              <a
                :href="project.downloadUrl || undefined"
                :aria-disabled="!project.downloadUrl"
                :tabindex="project.downloadUrl ? 0 : -1">
                <Download aria-hidden="true" />
                Descargar
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <div v-if="activeProject" class="project-modal" @click.self="closeProject">
      <div class="project-modal__dialog" role="dialog" aria-modal="true" :aria-labelledby="`${activeProject.title}-title`">
        <header>
          <div>
            <span>{{ activeProject.category }}</span>
            <h2 :id="`${activeProject.title}-title`">{{ activeProject.title }}</h2>
          </div>
          <button type="button" aria-label="Cerrar visor de proyecto" @click="closeProject">
            <X aria-hidden="true" />
          </button>
        </header>

        <iframe :src="activeProject.previewUrl" :title="`Documento ${activeProject.title}`"></iframe>

        <footer>
          <a :href="activeProject.downloadUrl">
            <Download aria-hidden="true" />
            Descargar documento
          </a>
        </footer>
      </div>
    </div>
  </main>
</template>

<style scoped>
.projects-page {
  background: #f7f8f4;
  color: #1f2f2b;
}

.page-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.projects-intro {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, .96), rgba(231, 240, 232, .88)),
    radial-gradient(circle at top right, rgba(229, 181, 75, .28), transparent 32%);
  padding: 3rem 0 2rem;
  text-align: center;
}

.projects-intro__kicker {
  color: #e5b54b;
  font-size: .8rem;
  font-weight: 800;
  letter-spacing: 0;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

.projects-intro h1 {
  color: #123c35;
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.05;
  margin: 0;
}

.projects-intro p:last-child {
  line-height: 1.65;
  margin: .85rem auto 0;
  max-width: 43rem;
}

.projects-catalog {
  padding: 2rem 0 3rem;
}

.projects-filters {
  display: flex;
  flex-wrap: wrap;
  gap: .6rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.projects-filters button {
  background: #fff;
  border: 1px solid #dde6dc;
  border-radius: 999px;
  color: #1f2f2b;
  cursor: pointer;
  font-size: .85rem;
  font-weight: 800;
  padding: .45rem .85rem;
  transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease;
}

.projects-filters button:hover,
.projects-filters button:focus,
.projects-filters__button--active {
  background: #123c35 !important;
  border-color: #123c35 !important;
  color: #fff !important;
  transform: translateY(-.1rem);
}

.projects-toolbar {
  margin-bottom: 1.5rem;
}

.projects-toolbar p {
  background: #fff0f0;
  border-left: 4px solid #b84a4a;
  border-radius: 6px;
  color: #7c2626;
  flex: 1;
  margin: 0;
  padding: .75rem 1rem;
}

.projects-grid {
  display: grid;
  gap: 1.25rem;
}

.project-card {
  background: #fff;
  border: 1px solid #dde6dc;
  border-radius: 8px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .08);
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow: hidden;
  transition: box-shadow .25s ease, transform .25s ease;
}

.project-card:hover {
  box-shadow: 0 1rem 2.2rem rgba(31, 47, 43, .14);
  transform: translateY(-.25rem);
}

.project-card:hover .icon-spin-hover {
  transform: rotate(360deg) scale(1.08);
}

.project-card__media {
  align-items: center;
  background:
    linear-gradient(135deg, rgba(18, 60, 53, .94), rgba(18, 60, 53, .76)),
    url("/images/img_hero.webp") center / cover no-repeat;
  color: #e5b54b;
  display: flex;
  height: 9rem;
  justify-content: center;
}

.project-card__media svg {
  height: 3.2rem;
  width: 3.2rem;
}

.project-card__media img {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.project-card__body {
  flex: 1;
  padding: 1rem;
}

.project-card__body span,
.project-modal header span {
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-size: .72rem;
  font-weight: 800;
  margin-bottom: .7rem;
  padding: .25rem .6rem;
}

.project-card h2 {
  color: #123c35;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.22;
  margin: 0 0 .6rem;
}

.project-card p {
  color: #42554f;
  font-size: .92rem;
  line-height: 1.55;
  margin: 0;
}

.project-card__actions {
  border-top: 1px solid #dde6dc;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.project-card__actions button,
.project-card__actions a,
.project-modal footer a {
  align-items: center;
  background: #fff;
  border: 0;
  color: #123c35;
  display: inline-flex;
  font-size: .82rem;
  font-weight: 800;
  gap: .4rem;
  justify-content: center;
  min-height: 2.8rem;
  text-decoration: none;
  transition: background .2s ease, color .2s ease, opacity .2s ease;
}

.project-card__actions button {
  border-right: 1px solid #dde6dc;
  cursor: pointer;
}

.project-card__actions svg,
.project-modal footer svg {
  height: 1rem;
  width: 1rem;
}

.project-card__actions button:hover,
.project-card__actions button:focus,
.project-card__actions a:hover,
.project-card__actions a:focus,
.project-modal footer a:hover,
.project-modal footer a:focus {
  background: #123c35;
  color: #fff;
}

.project-card__actions button:disabled,
.project-card__actions a[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: .45;
  pointer-events: none;
}

.project-modal {
  align-items: center;
  background: rgba(18, 60, 53, .82);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1rem;
  position: fixed;
  z-index: 1000;
}

.project-modal__dialog {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, .3);
  display: grid;
  grid-template-rows: auto minmax(18rem, 1fr) auto;
  max-height: min(92vh, 58rem);
  max-width: 68rem;
  overflow: hidden;
  width: 100%;
}

.project-modal header {
  align-items: flex-start;
  border-bottom: 1px solid #dde6dc;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem;
}

.project-modal h2 {
  color: #123c35;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0;
}

.project-modal header button {
  align-items: center;
  background: #123c35;
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  height: 2.25rem;
  justify-content: center;
  width: 2.25rem;
}

.project-modal header button svg {
  height: 1.1rem;
  width: 1.1rem;
}

.project-modal iframe {
  border: 0;
  height: 100%;
  width: 100%;
}

.project-modal footer {
  border-top: 1px solid #dde6dc;
  display: flex;
  justify-content: flex-end;
  padding: .8rem;
}

.project-modal footer a {
  background: #e5b54b;
  border-radius: 6px;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .projects-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 992px) {
  .projects-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

}
</style>
