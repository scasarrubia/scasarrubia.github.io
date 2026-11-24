<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import {
  BookOpen,
  Calculator,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  HeartHandshake,
  Leaf,
  Megaphone,
  Palette,
  ShieldCheck,
  Sparkles,
  Bike,
  House,
  Laptop,
  Trophy,
  Users,
  X
} from '@lucide/vue';
import { useInstitutionalProjects } from '../composables/useInstitutionalProjects';

// Icon and color by keywords. The title is checked first because it is more specific than the category.
const projectThemes = [
  { keywords: ['riesgo', 'emergencia', 'seguridad', 'prevencion', 'spa', 'sustancias'], icon: ShieldCheck, accent: '#b84a4a' },
  { keywords: ['sexual', 'afectividad'], icon: HeartHandshake, accent: '#c2577a' },
  { keywords: ['ambient', 'ecolog', 'prae', 'sostenib'], icon: Leaf, accent: '#3f9b6a' },
  { keywords: ['tecnolog', 'informatica', 'digital', 'innovacion'], icon: Laptop, accent: '#3d6fb0' },
  { keywords: ['recreacion', 'tiempo libre', 'deporte'], icon: Bike, accent: '#2e8b8b' },
  { keywords: ['familia', 'escuela de padres', 'hogar'], icon: House, accent: '#b77c17' },
  { keywords: ['democra', 'gobierno', 'ciudadan', 'participacion', 'comunidad', 'constitucion'], icon: Users, accent: '#2f7fa6' },
  { keywords: ['lectura', 'lengua', 'literat', 'escritura'], icon: BookOpen, accent: '#9a6c12' },
  { keywords: ['academ', 'matemat', 'ciencia', 'investig', 'calidad'], icon: Calculator, accent: '#4a6fb5' },
  { keywords: ['orientacion', 'vocacion', 'proyecto de vida', 'formacion'], icon: GraduationCap, accent: '#8a5aa8' },
  { keywords: ['cultur', 'arte', 'musica', 'identidad', 'patrimonio'], icon: Palette, accent: '#a4508b' },
  { keywords: ['convivencia', 'bienestar', 'salud', 'emocional'], icon: HeartHandshake, accent: '#d0714f' },
  { keywords: ['comunicacion', 'medios', 'emisora', 'periodico'], icon: Megaphone, accent: '#c98a1a' },
  { keywords: ['bilinguismo', 'ingles', 'idioma'], icon: Globe, accent: '#3d7f9e' },
  { keywords: ['deporte', 'olimpiada', 'juegos'], icon: Trophy, accent: '#2e8b8b' }
];
const defaultTheme = { icon: Sparkles, accent: '#07513e' };

function normalizeText(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function findTheme(text) {
  const normalized = normalizeText(text);
  return projectThemes.find((theme) => theme.keywords.some((keyword) => normalized.includes(keyword)));
}

function getProjectTheme(project) {
  return findTheme(project.title) ?? findTheme(project.category) ?? defaultTheme;
}

// Titles coming from Drive file names may include the extension.
function cleanTitle(title) {
  return String(title || '').replace(/\.(docx?|pdf|pptx?|xlsx?|odt)$/i, '').trim();
}

const activeProject = ref(null);
const activeCategory = ref('Todos');
const closeButton = ref(null);
const { categories, error, projects } = useInstitutionalProjects();

const filteredProjects = computed(() => {
  if (activeCategory.value === 'Todos') return projects.value;
  return projects.value.filter((project) => project.category === activeCategory.value);
});

const categoryCounts = computed(() => {
  const counts = { Todos: projects.value.length };
  projects.value.forEach((project) => {
    counts[project.category] = (counts[project.category] || 0) + 1;
  });
  return counts;
});

const availableDocuments = computed(() => projects.value.filter((project) => project.previewUrl).length);

async function openProject(project) {
  if (!project.previewUrl) return;
  activeProject.value = project;
  document.body.style.overflow = 'hidden';
  await nextTick();
  closeButton.value?.focus();
}

function closeProject() {
  activeProject.value = null;
  document.body.style.overflow = '';
}

function handleKeydown(event) {
  if (event.key === 'Escape' && activeProject.value) closeProject();
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <main class="projects-page">
    <section class="projects-intro">
      <div class="page-container">
        <p v-reveal="'down'" class="projects-intro__kicker">Proyectos institucionales</p>
        <h1 v-reveal="{ direction: 'up', delay: 120 }">Experiencias que transforman la vida escolar</h1>
        <p v-reveal="{ direction: 'up', delay: 220 }" class="projects-intro__lead">
          Consulta los proyectos pedagógicos de la institución, léelos en línea y descarga los documentos para revisión.
        </p>
        <dl v-reveal="{ direction: 'up', delay: 320 }" class="projects-stats">
          <div>
            <dt>Proyectos</dt>
            <dd>{{ projects.length }}</dd>
          </div>
          <div>
            <dt>Categorías</dt>
            <dd>{{ Math.max(categories.length - 1, 0) }}</dd>
          </div>
          <div>
            <dt>Documentos en línea</dt>
            <dd>{{ availableDocuments }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="projects-catalog">
      <div class="page-container">
        <div v-reveal="{ direction: 'up', delay: 120 }" class="projects-filters" role="group" aria-label="Filtrar proyectos por categoría">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="{ 'projects-filters__button--active': activeCategory === category }"
            :aria-pressed="activeCategory === category"
            @click="activeCategory = category">
            {{ category }}
            <span class="projects-filters__count">{{ categoryCounts[category] || 0 }}</span>
          </button>
        </div>

        <p v-if="error" class="projects-error" role="status">{{ error }} Se muestran proyectos locales de respaldo.</p>

        <div class="projects-grid">
          <article
            v-for="(project, index) in filteredProjects"
            :key="project.id"
            v-reveal="{ direction: 'up', delay: 60 + (index % 3) * 90 }"
            class="project-card"
            :style="{ '--accent': getProjectTheme(project).accent }">
            <div class="project-card__media" :class="{ 'project-card__media--photo': project.imageUrl }">
              <img v-if="project.imageUrl" :src="project.imageUrl" alt="" loading="lazy" decoding="async" />
              <span class="project-card__icon">
                <component :is="getProjectTheme(project).icon" aria-hidden="true" />
              </span>
              <span class="project-card__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>

            <div class="project-card__body">
              <span class="project-card__category">{{ project.category }}</span>
              <h2>{{ cleanTitle(project.title) }}</h2>
              <p>{{ project.description }}</p>
            </div>

            <div class="project-card__actions">
              <button
                v-if="project.previewUrl"
                type="button"
                class="project-card__action project-card__action--primary"
                @click="openProject(project)">
                <Eye aria-hidden="true" />
                Ver en línea
              </button>
              <a
                v-if="project.downloadUrl"
                :href="project.downloadUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="project-card__action">
                <Download aria-hidden="true" />
                Descargar
              </a>
              <span v-if="!project.previewUrl && !project.downloadUrl" class="project-card__pending">
                <FileText aria-hidden="true" />
                Documento en preparación
              </span>
            </div>
          </article>
        </div>

        <div v-if="!filteredProjects.length" class="projects-empty">
          <FolderOpen aria-hidden="true" />
          <p>No hay proyectos publicados en esta categoría.</p>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="project-modal">
        <div v-if="activeProject" class="project-modal" @click.self="closeProject">
          <div
            class="project-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            :style="{ '--accent': getProjectTheme(activeProject).accent }">
            <header>
              <span class="project-modal__icon">
                <component :is="getProjectTheme(activeProject).icon" aria-hidden="true" />
              </span>
              <div>
                <span class="project-card__category">{{ activeProject.category }}</span>
                <h2 id="project-modal-title">{{ cleanTitle(activeProject.title) }}</h2>
              </div>
              <button ref="closeButton" type="button" aria-label="Cerrar visor de proyecto" @click="closeProject">
                <X aria-hidden="true" />
              </button>
            </header>

            <iframe :src="activeProject.previewUrl" :title="`Documento ${cleanTitle(activeProject.title)}`"></iframe>

            <footer v-if="activeProject.downloadUrl">
              <a :href="activeProject.downloadUrl" target="_blank" rel="noopener noreferrer">
                <Download aria-hidden="true" />
                Descargar documento
              </a>
            </footer>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<style scoped>
.projects-page {
  background: #f7f8f4;
  color: #1f2f2b;
  font-family: 'Open Sans', Arial, sans-serif;
}

.page-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

/* ---- Intro ---- */
.projects-intro {
  padding: 3.5rem 0 1rem;
  text-align: center;
}

.projects-intro__kicker {
  color: #8b6418;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .08em;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

.projects-intro h1 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.12;
  margin: 0;
  padding-bottom: .8rem;
  position: relative;
}

.projects-intro h1::after {
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

.projects-intro__lead {
  color: #42554f;
  line-height: 1.65;
  margin: 1rem auto 0;
  max-width: 43rem;
}

.projects-stats {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  justify-content: center;
  margin: 2rem 0 0;
}

.projects-stats div {
  background: #fff;
  border: 1px solid #e3e9e1;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(18, 60, 53, .06);
  min-width: 9rem;
  padding: .85rem 1.25rem;
}

.projects-stats dt {
  color: #5b6d62;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.projects-stats dd {
  color: #07513e;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1.1;
  margin: .2rem 0 0;
}

/* ---- Filters ---- */
.projects-catalog {
  padding: 2rem 0 4.5rem;
}

.projects-filters {
  display: flex;
  flex-wrap: wrap;
  gap: .6rem;
  justify-content: center;
  margin-bottom: 2.25rem;
}

.projects-filters button {
  align-items: center;
  background: #fff;
  border: 1px solid #dde6dc;
  border-radius: 999px;
  color: #1f2f2b;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: .85rem;
  font-weight: 700;
  gap: .5rem;
  padding: .45rem .5rem .45rem 1rem;
  transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease;
}

.projects-filters__count {
  background: #eef3ec;
  border-radius: 999px;
  color: #42554f;
  font-size: .72rem;
  min-width: 1.6rem;
  padding: .1rem .45rem;
  text-align: center;
  transition: background .2s ease, color .2s ease;
}

.projects-filters button:hover {
  border-color: #07513e;
  transform: translateY(-2px);
}

.projects-filters button:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 2px;
}

.projects-filters .projects-filters__button--active {
  background: #07513e;
  border-color: #07513e;
  color: #fff;
}

.projects-filters__button--active .projects-filters__count {
  background: #e5b54b;
  color: #123c35;
}

.projects-error {
  background: #fff0f0;
  border-left: 4px solid #b84a4a;
  border-radius: 8px;
  color: #7c2626;
  margin: 0 0 1.5rem;
  padding: .75rem 1rem;
}

/* ---- Cards ---- */
.projects-grid {
  display: grid;
  gap: 1.5rem;
}

.project-card {
  background: #fff;
  border: 1px solid #e3e9e1;
  border-radius: 18px;
  box-shadow: 0 14px 34px rgba(18, 60, 53, .08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow .3s ease, transform .3s ease;
}

.project-card:hover {
  box-shadow: 0 24px 48px rgba(18, 60, 53, .16);
  transform: translateY(-5px);
}

.project-card__media {
  align-items: center;
  background: var(--accent);
  background:
    radial-gradient(circle at 85% 15%, rgba(255, 255, 255, .22), transparent 45%),
    linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, #0d2f2a));
  display: flex;
  height: 9.5rem;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

/* Subtle dotted pattern for depth. */
.project-card__media::before {
  background-image: radial-gradient(rgba(255, 255, 255, .18) 1.5px, transparent 1.5px);
  background-size: 16px 16px;
  content: "";
  inset: 0;
  position: absolute;
}

.project-card__media img {
  height: 100%;
  inset: 0;
  object-fit: cover;
  position: absolute;
  transition: transform .6s ease;
  width: 100%;
}

.project-card__media--photo::after {
  background: linear-gradient(180deg, transparent 30%, color-mix(in srgb, var(--accent) 70%, rgba(0, 0, 0, .6)));
  content: "";
  inset: 0;
  position: absolute;
}

.project-card:hover .project-card__media img {
  transform: scale(1.06);
}

.project-card__icon {
  align-items: center;
  background: rgba(255, 255, 255, .18);
  border: 1px solid rgba(255, 255, 255, .35);
  border-radius: 20px;
  backdrop-filter: blur(4px);
  color: #fff;
  display: flex;
  height: 4.5rem;
  justify-content: center;
  position: relative;
  transition: transform .35s ease;
  width: 4.5rem;
  z-index: 1;
}

.project-card__media--photo .project-card__icon {
  bottom: 1rem;
  height: 3rem;
  left: 1rem;
  position: absolute;
  width: 3rem;
}

.project-card__icon svg {
  height: 2.2rem;
  width: 2.2rem;
}

.project-card__media--photo .project-card__icon svg {
  height: 1.5rem;
  width: 1.5rem;
}

.project-card:hover .project-card__icon {
  transform: rotate(-8deg) scale(1.08);
}

.project-card__number {
  color: rgba(255, 255, 255, .3);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1;
  position: absolute;
  right: 1rem;
  top: .75rem;
  z-index: 1;
}

.project-card__body {
  flex: 1;
  padding: 1.35rem 1.4rem 1rem;
}

.project-card__category {
  background: color-mix(in srgb, var(--accent) 14%, #fff);
  border-radius: 999px;
  color: color-mix(in srgb, var(--accent) 75%, #000);
  display: inline-flex;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .03em;
  margin-bottom: .7rem;
  padding: .25rem .7rem;
  text-transform: uppercase;
}

.project-card h2 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.28;
  margin: 0 0 .6rem;
}

.project-card p {
  color: #42554f;
  font-size: .93rem;
  line-height: 1.6;
  margin: 0;
}

.project-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: .6rem;
  padding: 0 1.4rem 1.4rem;
}

.project-card__action {
  align-items: center;
  background: #fff;
  border: 2px solid #07513e;
  border-radius: 999px;
  color: #07513e;
  cursor: pointer;
  display: inline-flex;
  flex: 1;
  font-family: inherit;
  font-size: .85rem;
  font-weight: 700;
  gap: .4rem;
  justify-content: center;
  min-height: 2.6rem;
  padding: 0 .9rem;
  text-decoration: none;
  transition: background .2s ease, color .2s ease, border-color .2s ease;
}

.project-card__action svg {
  height: 1rem;
  width: 1rem;
}

.project-card__action:hover,
.project-card__action:focus-visible {
  background: #07513e;
  color: #fff;
}

.project-card__action--primary {
  background: #07513e;
  color: #fff;
}

.project-card__action--primary:hover,
.project-card__action--primary:focus-visible {
  background: #0b6a52;
  border-color: #0b6a52;
}

.project-card__action:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 2px;
}

.project-card__pending {
  align-items: center;
  background: #f4f6f2;
  border: 1px dashed #cdd8cc;
  border-radius: 999px;
  color: #5b6d62;
  display: inline-flex;
  flex: 1;
  font-size: .82rem;
  font-weight: 600;
  gap: .4rem;
  justify-content: center;
  min-height: 2.6rem;
}

.project-card__pending svg {
  height: 1rem;
  width: 1rem;
}

.projects-empty {
  color: #5b6d62;
  padding: 3rem 1rem;
  text-align: center;
}

.projects-empty svg {
  color: #9fb3a3;
  height: 3rem;
  width: 3rem;
}

/* ---- Modal ---- */
.project-modal {
  align-items: center;
  backdrop-filter: blur(4px);
  background: rgba(13, 47, 42, .8);
  display: flex;
  font-family: 'Open Sans', Arial, sans-serif;
  inset: 0;
  justify-content: center;
  padding: 1rem;
  position: fixed;
  z-index: 1000;
}

.project-modal__dialog {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, .3);
  display: grid;
  grid-template-rows: auto minmax(18rem, 1fr) auto;
  height: min(92vh, 58rem);
  max-width: 68rem;
  overflow: hidden;
  width: 100%;
}

.project-modal header {
  align-items: center;
  border-bottom: 1px solid #e3e9e1;
  border-top: 5px solid var(--accent);
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
}

.project-modal header > div {
  flex: 1;
  min-width: 0;
}

.project-modal__icon {
  align-items: center;
  background: var(--accent);
  border-radius: 14px;
  color: #fff;
  display: flex;
  flex-shrink: 0;
  height: 3rem;
  justify-content: center;
  width: 3rem;
}

.project-modal__icon svg {
  height: 1.5rem;
  width: 1.5rem;
}

.project-modal .project-card__category {
  margin-bottom: .3rem;
}

.project-modal h2 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.3rem;
  font-weight: 700;
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
  height: 2.5rem;
  justify-content: center;
  transition: background .2s ease, color .2s ease, transform .2s ease;
  width: 2.5rem;
}

.project-modal header button:hover,
.project-modal header button:focus-visible {
  background: #e5b54b;
  color: #123c35;
  transform: rotate(90deg);
}

.project-modal header button svg {
  height: 1.2rem;
  width: 1.2rem;
}

.project-modal iframe {
  background: #f4f6f2;
  border: 0;
  height: 100%;
  width: 100%;
}

.project-modal footer {
  border-top: 1px solid #e3e9e1;
  display: flex;
  justify-content: flex-end;
  padding: .85rem 1.25rem;
}

.project-modal footer a {
  align-items: center;
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-size: .9rem;
  font-weight: 700;
  gap: .45rem;
  min-height: 2.6rem;
  padding: 0 1.25rem;
  text-decoration: none;
  transition: background .2s ease;
}

.project-modal footer a:hover,
.project-modal footer a:focus-visible {
  background: #f3d06f;
}

.project-modal footer svg {
  height: 1rem;
  width: 1rem;
}

.project-modal-enter-active,
.project-modal-leave-active {
  transition: opacity .25s ease;
}

.project-modal-enter-active .project-modal__dialog,
.project-modal-leave-active .project-modal__dialog {
  transition: transform .3s cubic-bezier(.22, 1, .36, 1);
}

.project-modal-enter-from,
.project-modal-leave-to {
  opacity: 0;
}

.project-modal-enter-from .project-modal__dialog,
.project-modal-leave-to .project-modal__dialog {
  transform: translateY(1.5rem) scale(.97);
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

@media (prefers-reduced-motion: reduce) {
  .project-card,
  .project-card__icon,
  .project-card__media img,
  .projects-filters button,
  .project-modal-enter-active,
  .project-modal-leave-active,
  .project-modal-enter-active .project-modal__dialog,
  .project-modal-leave-active .project-modal__dialog {
    transition: none;
  }

  .project-card:hover,
  .project-card:hover .project-card__icon,
  .project-card:hover .project-card__media img,
  .projects-filters button:hover {
    transform: none;
  }
}

@media (max-width: 520px) {
  .projects-stats div {
    flex: 1;
    min-width: 0;
    padding: .7rem;
  }

  .projects-stats dd {
    font-size: 1.5rem;
  }

  .project-modal {
    padding: .5rem;
  }

  .project-modal header {
    padding: .85rem;
  }

  .project-modal__icon {
    display: none;
  }
}
</style>
