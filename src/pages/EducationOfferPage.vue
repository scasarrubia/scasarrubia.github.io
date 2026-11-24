<script setup>
import { computed, onUnmounted, ref, watch } from 'vue';
import { ChevronLeft, ChevronRight, Download, Eye, FileCheck2, Keyboard } from '@lucide/vue';
import { useInstitutionalDocuments } from '../composables/useInstitutionalDocuments';

const {
  documents,
  featuredDocument,
  secondaryDocuments
} = useInstitutionalDocuments();

// Accent color per document type, matched by its short title.
const documentAccents = {
  PEI: '#07513e',
  Manual: '#3f9b6a',
  SIEE: '#2f7fa6'
};

function documentAccent(documentItem) {
  return documentAccents[documentItem?.shortTitle] ?? '#8a5aa8';
}

const manualDocument = computed(() => documents.value.find((documentItem) => documentItem.shortTitle === 'Manual'));
const manualPageCount = 129;
const currentManualPage = ref(1);
const flipDirection = ref('next');
const isTurningPage = ref(false);
const turningManualPage = ref(null);
const manualImageCache = new Map();
let flipTimer;

const visibleManualPages = computed(() => {
  const pages = [currentManualPage.value];
  const nextPage = currentManualPage.value + 1;

  if (nextPage <= manualPageCount) {
    pages.push(nextPage);
  }

  return pages;
});
const lastVisibleManualPage = computed(() => visibleManualPages.value[visibleManualPages.value.length - 1]);
const preloadedManualPages = computed(() => {
  const pageNumbers = new Set();
  const start = Math.max(1, currentManualPage.value - 4);
  const end = Math.min(manualPageCount, currentManualPage.value + 5);

  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    pageNumbers.add(pageNumber);
  }

  return [...pageNumbers].filter((pageNumber) => !visibleManualPages.value.includes(pageNumber));
});

const canGoBack = computed(() => currentManualPage.value > 1);
const canGoForward = computed(() => currentManualPage.value + 1 < manualPageCount);
const currentManualRange = computed(() => `Pág. ${visibleManualPages.value[0]} - ${lastVisibleManualPage.value} de ${manualPageCount}`);

function getManualPageImage(pageNumber) {
  return `/docs/manual-convivencia/page-${String(pageNumber).padStart(3, '0')}.webp`;
}

function preloadManualPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > manualPageCount || manualImageCache.has(pageNumber)) return;

  const image = new Image();
  image.src = getManualPageImage(pageNumber);
  manualImageCache.set(pageNumber, image);
}

function preloadManualSpread(pageNumber) {
  const start = Math.max(1, pageNumber - 6);
  const end = Math.min(manualPageCount, pageNumber + 9);

  for (let currentPage = start; currentPage <= end; currentPage += 1) {
    preloadManualPage(currentPage);
  }
}

function turnManualPage(targetPage, direction) {
  if (targetPage === currentManualPage.value || isTurningPage.value) return;

  window.clearTimeout(flipTimer);
  preloadManualSpread(targetPage);
  flipDirection.value = direction;
  turningManualPage.value = direction === 'next'
    ? lastVisibleManualPage.value
    : currentManualPage.value;
  currentManualPage.value = targetPage;
  isTurningPage.value = true;

  flipTimer = window.setTimeout(() => {
    turningManualPage.value = null;
    isTurningPage.value = false;
  }, 720);
}

function goToPreviousManualPages() {
  if (!canGoBack.value) return;

  turnManualPage(Math.max(1, currentManualPage.value - 2), 'previous');
}

function goToNextManualPages() {
  if (!canGoForward.value) return;

  turnManualPage(Math.min(manualPageCount, currentManualPage.value + 2), 'next');
}

// Spreads always start on an odd page (1-2, 3-4, ...).
function jumpToManualPage(pageNumber) {
  const page = Math.min(manualPageCount, Math.max(1, Number(pageNumber) || 1));
  const spreadStart = page % 2 === 1 ? page : page - 1;
  if (spreadStart === currentManualPage.value) return;

  turnManualPage(spreadStart, spreadStart > currentManualPage.value ? 'next' : 'previous');
}

function handleManualKeydown(event) {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    goToNextManualPages();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    goToPreviousManualPages();
  }
}

const manualProgress = computed(() => `${(lastVisibleManualPage.value / manualPageCount) * 100}%`);

onUnmounted(() => {
  window.clearTimeout(flipTimer);
});

watch(currentManualPage, preloadManualSpread, { immediate: true });
</script>

<template>
  <main class="horizon-page">
    <div class="page-container">
      <section class="horizon-intro">
        <p v-reveal="'down'" class="section-kicker">Horizonte institucional</p>
        <h1 v-reveal="{ direction: 'up', delay: 120 }">Biblioteca normativa institucional</h1>
        <p v-reveal="{ direction: 'up', delay: 220 }">
          Documentos oficiales para comprender cómo se orienta la vida escolar, la convivencia, la evaluación y el
          proyecto educativo de la Institución Educativa Padre Roberto Arroyave Vélez.
        </p>
      </section>

      <section class="documents-showcase" aria-label="Documentos del horizonte institucional">
        <article v-reveal="featuredDocument.reveal" class="featured-document">
          <div class="featured-document__stamp">
            <component :is="featuredDocument.icon" class="icon-spin-hover" aria-hidden="true" />
            <span>{{ featuredDocument.shortTitle }}</span>
          </div>

          <div class="featured-document__content">
            <p class="section-kicker">{{ featuredDocument.label }}</p>
            <h2>{{ featuredDocument.title }}</h2>
            <p>{{ featuredDocument.description }}</p>

            <div class="document-actions document-actions--featured">
              <a
                :href="featuredDocument.previewUrl || undefined"
                :aria-disabled="!featuredDocument.previewUrl"
                :tabindex="featuredDocument.previewUrl ? 0 : -1"
                target="_blank"
                rel="noopener noreferrer">
                <Eye aria-hidden="true" />
                Leer en línea
              </a>
              <a
                :href="featuredDocument.downloadUrl || undefined"
                :aria-disabled="!featuredDocument.downloadUrl"
                :tabindex="featuredDocument.downloadUrl ? 0 : -1">
                <Download aria-hidden="true" />
                Descargar
              </a>
            </div>
          </div>
        </article>

        <div class="documents-list">
          <article
            v-for="document in secondaryDocuments"
            :key="document.title"
            v-reveal="document.reveal"
            class="document-row"
            :style="{ '--accent': documentAccent(document) }">
            <div class="document-row__icon">
              <component :is="document.icon" class="icon-spin-hover" aria-hidden="true" />
            </div>

            <div class="document-row__content">
              <span>{{ document.label }}</span>
              <h2>{{ document.title }}</h2>
              <p>{{ document.description }}</p>

              <div class="document-actions">
                <a
                  :href="document.previewUrl || undefined"
                  :aria-disabled="!document.previewUrl"
                  :tabindex="document.previewUrl ? 0 : -1"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Eye aria-hidden="true" />
                  Leer
                </a>
                <a
                  :href="document.downloadUrl || undefined"
                  :aria-disabled="!document.downloadUrl"
                  :tabindex="document.downloadUrl ? 0 : -1">
                  <Download aria-hidden="true" />
                  Descargar
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="manual-flipbook" aria-labelledby="manual-flipbook-title">
        <div v-reveal="'up'" class="manual-flipbook__header">
          <p class="section-kicker">Manual de convivencia</p>
          <h2 id="manual-flipbook-title">Lectura tipo libro</h2>
          <p class="manual-flipbook__lead">
            Hojea el manual página por página, salta a la sección que necesites o descárgalo completo.
          </p>
          <a
            v-if="manualDocument?.downloadUrl"
            :href="manualDocument.downloadUrl"
            class="manual-flipbook__download">
            <Download aria-hidden="true" />
            Descargar manual completo
          </a>
        </div>

        <div
          v-reveal="{ direction: 'up', delay: 160 }"
          class="manual-flipbook__stage"
          tabindex="0"
          role="region"
          aria-label="Visor del Manual de convivencia. Usa las flechas izquierda y derecha para pasar las páginas."
          @keydown="handleManualKeydown"
          :class="{
            'is-turning': isTurningPage,
            'is-next': flipDirection === 'next',
            'is-previous': flipDirection === 'previous'
          }">
          <button
            type="button"
            class="manual-flipbook__arrow manual-flipbook__arrow--previous"
            :disabled="!canGoBack || isTurningPage"
            aria-label="Ver páginas anteriores"
            title="Páginas anteriores"
            @click="goToPreviousManualPages">
            <ChevronLeft aria-hidden="true" />
          </button>

          <div class="manual-flipbook__book">
            <figure
              v-for="pageNumber in visibleManualPages"
              :key="pageNumber"
              class="manual-flipbook__page">
              <img
                :src="getManualPageImage(pageNumber)"
                :alt="`Página ${pageNumber} del Manual de convivencia`"
                loading="eager"
                fetchpriority="high"
                decoding="async">
              <figcaption>Página {{ pageNumber }}</figcaption>
            </figure>

            <div
              v-if="turningManualPage"
              class="manual-flipbook__turn-page"
              aria-hidden="true">
              <img
                :src="getManualPageImage(turningManualPage)"
                alt=""
                decoding="async">
            </div>
          </div>

          <button
            type="button"
            class="manual-flipbook__arrow manual-flipbook__arrow--next"
            :disabled="!canGoForward || isTurningPage"
            aria-label="Ver páginas siguientes"
            title="Páginas siguientes"
            @click="goToNextManualPages">
            <ChevronRight aria-hidden="true" />
          </button>

          <div class="manual-flipbook__preload" aria-hidden="true">
            <img
              v-for="pageNumber in preloadedManualPages"
              :key="pageNumber"
              :src="getManualPageImage(pageNumber)"
              alt="">
          </div>
        </div>

        <div class="manual-flipbook__controls">
          <span class="manual-flipbook__counter" aria-live="polite">{{ currentManualRange }}</span>
          <label class="manual-flipbook__slider">
            <span class="visually-hidden">Ir a la página</span>
            <input
              type="range"
              min="1"
              :max="manualPageCount"
              step="1"
              :value="currentManualPage"
              :style="{ '--progress': manualProgress }"
              :disabled="isTurningPage"
              @change="jumpToManualPage($event.target.value)">
          </label>
          <span class="manual-flipbook__hint">
            <Keyboard aria-hidden="true" />
            Usa ← → para pasar páginas
          </span>
        </div>
      </section>

      <section class="horizon-note">
        <img class="horizon-note__crest" src="/images/escudo.webp" alt="" aria-hidden="true" />
        <div v-reveal="'left'" class="horizon-note__content">
          <span class="horizon-note__icon"><FileCheck2 aria-hidden="true" /></span>
          <div>
            <p class="section-kicker">Consulta oficial</p>
            <h2>Documentos vigentes y descargables</h2>
            <p>
              Esta biblioteca se actualizará con las versiones aprobadas para consulta de estudiantes, familias, docentes,
              directivos y comunidad educativa.
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.horizon-page {
  background: #fff;
  color: #1f2f2b;
  padding: 3rem 0;
}

.page-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.horizon-intro {
  margin: 0 auto 2.25rem;
  max-width: 50rem;
  text-align: center;
}

.section-kicker {
  color: #e5b54b;
  font-size: .875rem;
  font-weight: 800;
  letter-spacing: 0;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

.horizon-intro h1 {
  color: #123c35;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.12;
  margin: 0;
}

.horizon-intro p:last-child {
  line-height: 1.65;
  margin: .85rem 0 0;
}

.documents-showcase {
  display: grid;
  gap: 1.25rem;
}

.featured-document,
.document-row {
  border: 1px solid #dde6dc;
  border-radius: 8px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .1);
  overflow: hidden;
}

.featured-document {
  background:
    linear-gradient(135deg, rgba(18, 60, 53, .96), rgba(18, 60, 53, .84)),
    url("/images/img_hero.webp") center / cover no-repeat;
  color: #fff;
  display: grid;
  min-height: 28rem;
}

.featured-document__stamp {
  align-items: center;
  align-self: start;
  background: rgba(255, 255, 255, .1);
  border: 1px solid rgba(255, 255, 255, .22);
  border-radius: 999px;
  color: #e5b54b;
  display: inline-flex;
  gap: .55rem;
  margin: 1.25rem;
  padding: .55rem .85rem;
  width: fit-content;
}

.featured-document__stamp svg {
  height: 1.35rem;
  width: 1.35rem;
}

.featured-document__stamp span {
  font-size: .9rem;
  font-weight: 900;
}

.featured-document__content {
  align-self: end;
  padding: 1.25rem;
}

.featured-document h2 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1.05;
  margin: 0 0 .8rem;
}

.featured-document__content > p:not(.section-kicker) {
  color: rgba(255, 255, 255, .88);
  line-height: 1.65;
  margin: 0;
  max-width: 38rem;
}

.documents-list {
  display: grid;
  gap: 1rem;
}

.document-row {
  background: #f7f8f4;
  display: grid;
  gap: 1rem;
  padding: 1rem;
  transition: box-shadow .25s ease, transform .25s ease;
}

.document-row:hover {
  box-shadow: 0 1rem 2.2rem rgba(31, 47, 43, .14);
  transform: translateY(-.2rem);
}

.document-row:hover .icon-spin-hover,
.featured-document:hover .icon-spin-hover {
  transform: rotate(360deg) scale(1.08);
}

.document-row__icon {
  align-items: center;
  background: #123c35;
  border-radius: 8px;
  color: #e5b54b;
  display: inline-flex;
  height: 4rem;
  justify-content: center;
  width: 4rem;
}

.document-row__icon svg {
  height: 2rem;
  width: 2rem;
}

.document-row__content span {
  color: #b77c17;
  display: block;
  font-size: .78rem;
  font-weight: 900;
  margin-bottom: .3rem;
  text-transform: uppercase;
}

.document-row h2 {
  color: #123c35;
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1.2;
  margin: 0 0 .5rem;
}

.document-row p {
  color: #42554f;
  line-height: 1.55;
  margin: 0;
}

.document-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .6rem;
  margin-top: 1rem;
}

.document-actions a {
  align-items: center;
  background: #fff;
  border: 1px solid #dde6dc;
  border-radius: 6px;
  color: #123c35;
  display: inline-flex;
  font-size: .84rem;
  font-weight: 900;
  gap: .4rem;
  min-height: 2.55rem;
  padding: 0 .85rem;
  text-decoration: none;
  transition: background .2s ease, border-color .2s ease, color .2s ease, opacity .2s ease;
}

.document-actions--featured a:first-child,
.document-actions a:hover,
.document-actions a:focus {
  background: #e5b54b;
  border-color: #e5b54b;
  color: #123c35;
}

.document-actions a[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: .48;
  pointer-events: none;
}

.document-actions svg {
  height: 1rem;
  width: 1rem;
}

.manual-flipbook {
  margin-top: 2.5rem;
}

.manual-flipbook__header {
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.manual-flipbook__header h2 {
  color: #123c35;
  font-size: clamp(1.75rem, 4vw, 2.6rem);
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
}

.manual-flipbook__counter {
  background: #f7f8f4;
  border: 1px solid #dde6dc;
  border-radius: 999px;
  color: #42554f;
  font-size: .85rem;
  font-weight: 800;
  padding: .55rem .85rem;
}

.manual-flipbook__stage {
  background:
    radial-gradient(circle at 50% 18%, rgba(229, 181, 75, .16), transparent 28rem),
    linear-gradient(135deg, #eef4ec, #f9faf5);
  border: 1px solid #dde6dc;
  border-radius: 8px;
  box-shadow: 0 1rem 2.4rem rgba(31, 47, 43, .11);
  overflow: hidden;
  padding: clamp(.8rem, 2.5vw, 1.5rem);
  perspective: 1600px;
  position: relative;
}

.manual-flipbook__book {
  background:
    linear-gradient(90deg, rgba(18, 60, 53, .22), transparent 8%, transparent 92%, rgba(18, 60, 53, .22)),
    #123c35;
  border-radius: 8px;
  box-shadow: 0 1.3rem 2.8rem rgba(18, 60, 53, .2);
  display: grid;
  gap: .35rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 auto;
  max-width: 62rem;
  padding: .45rem;
  position: relative;
  transform-style: preserve-3d;
}

.manual-flipbook__book::before {
  background: linear-gradient(90deg, rgba(0, 0, 0, .18), rgba(255, 255, 255, .3), rgba(0, 0, 0, .18));
  content: "";
  inset: .45rem auto .45rem 50%;
  pointer-events: none;
  position: absolute;
  transform: translateX(-50%);
  width: .35rem;
  z-index: 2;
}

.manual-flipbook__page {
  background: #fff;
  border-radius: 4px;
  box-shadow:
    inset 0 0 1.7rem rgba(31, 47, 43, .08),
    0 .8rem 1.4rem rgba(31, 47, 43, .12);
  margin: 0;
  overflow: hidden;
  position: relative;
  transition: opacity .45s ease, transform .72s cubic-bezier(.2, .7, .18, 1);
}

.manual-flipbook__page:first-child {
  border-radius: 6px 3px 3px 6px;
  transform-origin: right center;
}

.manual-flipbook__page:nth-child(2) {
  border-radius: 3px 6px 6px 3px;
  transform-origin: left center;
}

.manual-flipbook__stage.is-turning .manual-flipbook__page {
  opacity: .92;
}

.manual-flipbook__page img {
  aspect-ratio: 8.5 / 11;
  display: block;
  object-fit: contain;
  width: 100%;
}

.manual-flipbook__page figcaption {
  background: rgba(18, 60, 53, .92);
  bottom: 0;
  color: #fff;
  font-size: .76rem;
  font-weight: 800;
  left: 0;
  padding: .35rem .55rem;
  position: absolute;
}

.manual-flipbook__turn-page {
  background: #fff;
  bottom: .45rem;
  box-shadow:
    inset 0 0 2rem rgba(31, 47, 43, .12),
    0 1rem 2rem rgba(31, 47, 43, .22);
  overflow: hidden;
  position: absolute;
  top: .45rem;
  transform-style: preserve-3d;
  width: calc(50% - .275rem);
  z-index: 5;
}

.manual-flipbook__turn-page::after {
  background: linear-gradient(90deg, rgba(18, 60, 53, .18), transparent 42%, rgba(18, 60, 53, .12));
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.manual-flipbook__turn-page img {
  height: 100%;
  object-fit: contain;
  width: 100%;
}

.manual-flipbook__stage.is-next .manual-flipbook__turn-page {
  animation: turn-page-next .72s cubic-bezier(.18, .74, .18, 1) forwards;
  border-radius: 3px 6px 6px 3px;
  right: .45rem;
  transform-origin: left center;
}

.manual-flipbook__stage.is-previous .manual-flipbook__turn-page {
  animation: turn-page-previous .72s cubic-bezier(.18, .74, .18, 1) forwards;
  border-radius: 6px 3px 3px 6px;
  left: .45rem;
  transform-origin: right center;
}

.manual-flipbook__arrow {
  align-items: center;
  background: rgba(229, 181, 75, .95);
  border: 1px solid rgba(229, 181, 75, .95);
  border-radius: 999px;
  box-shadow: 0 .75rem 1.5rem rgba(18, 60, 53, .18);
  color: #123c35;
  cursor: pointer;
  display: inline-flex;
  height: 3rem;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: background .2s ease, border-color .2s ease, opacity .2s ease, transform .2s ease;
  width: 3rem;
  z-index: 8;
}

.manual-flipbook__arrow:hover,
.manual-flipbook__arrow:focus {
  background: #f2c95d;
  border-color: #f2c95d;
  transform: translateY(-50%) scale(1.06);
}

.manual-flipbook__arrow:disabled {
  cursor: not-allowed;
  opacity: .35;
  transform: translateY(-50%);
}

.manual-flipbook__arrow svg {
  height: 1.45rem;
  width: 1.45rem;
}

.manual-flipbook__arrow--previous {
  left: clamp(.8rem, 2vw, 1.4rem);
}

.manual-flipbook__arrow--next {
  right: clamp(.8rem, 2vw, 1.4rem);
}

.manual-flipbook__preload {
  height: 1px;
  left: -9999px;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 1px;
}

.manual-flipbook__preload img {
  height: 1px;
  width: 1px;
}

@keyframes turn-page-next {
  0% {
    opacity: 1;
    transform: rotateY(0deg);
  }

  45% {
    box-shadow:
      inset -2rem 0 2.6rem rgba(31, 47, 43, .18),
      0 1.2rem 2.6rem rgba(31, 47, 43, .22);
  }

  100% {
    opacity: .92;
    transform: rotateY(-172deg);
  }
}

@keyframes turn-page-previous {
  0% {
    opacity: 1;
    transform: rotateY(0deg);
  }

  45% {
    box-shadow:
      inset 2rem 0 2.6rem rgba(31, 47, 43, .18),
      0 1.2rem 2.6rem rgba(31, 47, 43, .22);
  }

  100% {
    opacity: .92;
    transform: rotateY(172deg);
  }
}

.horizon-note {
  background: #123c35;
  border-radius: 8px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .1);
  color: #fff;
  margin-top: 2.5rem;
  padding: 1.5rem;
}

.horizon-note__content {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  max-width: 54rem;
}

.horizon-note__content > svg {
  color: #e5b54b;
  flex: 0 0 auto;
  height: 2rem;
  margin-top: .25rem;
  width: 2rem;
}

.horizon-note h2 {
  font-size: 1.875rem;
  font-weight: 800;
  margin: 0 0 .75rem;
}

.horizon-note p:not(.section-kicker) {
  color: rgba(255, 255, 255, .86);
  line-height: 1.65;
  margin: 0;
}

@media (min-width: 768px) {
  .documents-showcase {
    grid-template-columns: minmax(0, 1.15fr) minmax(18rem, .85fr);
  }

  .document-row {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .manual-flipbook__stage {
    padding: 1.5rem;
  }
}

@media (max-width: 640px) {
  .manual-flipbook__header {
    align-items: stretch;
    justify-content: stretch;
  }

  .manual-flipbook__counter {
    text-align: center;
  }

  .manual-flipbook__book {
    grid-template-columns: 1fr;
    max-width: 28rem;
  }

  .manual-flipbook__book::before {
    display: none;
  }

  .manual-flipbook__turn-page {
    display: none;
  }

  .manual-flipbook__page:first-child,
  .manual-flipbook__page:nth-child(2) {
    border-radius: 6px;
    transform-origin: center;
  }

  .manual-flipbook__arrow {
    height: 2.65rem;
    width: 2.65rem;
  }
}

/* ---- Visual refresh: consistent fonts and components with the rest of the site ---- */
.horizon-page {
  font-family: 'Open Sans', Arial, sans-serif;
  padding: 3.5rem 0 4.5rem;
}

.horizon-page h1,
.horizon-page h2 {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
}

.section-kicker {
  color: #8b6418;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .08em;
}

.horizon-intro {
  margin-bottom: 2.75rem;
}

.horizon-intro h1,
.manual-flipbook__header h2 {
  padding-bottom: .8rem;
  position: relative;
}

.horizon-intro h1::after,
.manual-flipbook__header h2::after {
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

.horizon-intro > p:last-child {
  color: #42554f;
  margin-top: 1rem;
}

/* Featured document (PEI). */
.featured-document,
.document-row {
  border-radius: 18px;
}

.featured-document {
  background:
    radial-gradient(circle at 85% 10%, rgba(229, 181, 75, .28), transparent 40%),
    linear-gradient(150deg, rgba(6, 45, 38, .96), rgba(18, 60, 53, .82) 60%, rgba(18, 60, 53, .7)),
    url("/images/img_hero.webp") center / cover no-repeat;
  box-shadow: 0 22px 48px rgba(18, 60, 53, .22);
  transition: transform .3s ease, box-shadow .3s ease;
}

.featured-document:hover {
  box-shadow: 0 28px 56px rgba(18, 60, 53, .28);
  transform: translateY(-4px);
}

.featured-document__stamp {
  backdrop-filter: blur(6px);
  margin: 1.75rem;
}

.featured-document__stamp span {
  font-weight: 700;
  letter-spacing: .06em;
}

.featured-document__content {
  padding: 1.75rem 2rem 2rem;
}

.featured-document .section-kicker {
  color: #f3d87c;
}

.featured-document h2 {
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  line-height: 1.1;
}

/* Secondary documents (Manual, SIEE). */
.documents-list {
  gap: 1.25rem;
}

.document-row {
  background: #fff;
  border-left: 5px solid var(--accent, #07513e);
  box-shadow: 0 14px 34px rgba(18, 60, 53, .09);
  padding: 1.5rem;
}

.document-row:hover {
  box-shadow: 0 22px 44px rgba(18, 60, 53, .16);
  transform: translateY(-4px);
}

.document-row__icon {
  background: color-mix(in srgb, var(--accent, #07513e) 14%, #fff);
  border-radius: 14px;
  color: var(--accent, #07513e);
  transition: transform .3s ease;
}

.document-row:hover .document-row__icon {
  transform: rotate(-8deg) scale(1.06);
}

.document-row__content span {
  color: var(--accent, #07513e);
  font-weight: 700;
  letter-spacing: .06em;
}

.document-row h2 {
  font-size: 1.3rem;
}

/* Buttons. */
.document-actions a {
  border: 2px solid #07513e;
  border-radius: 999px;
  color: #07513e;
  font-weight: 700;
  padding: 0 1.1rem;
}

.document-actions a:first-child {
  background: #07513e;
  color: #fff;
}

.document-actions a:hover,
.document-actions a:focus-visible {
  background: #0b6a52;
  border-color: #0b6a52;
  color: #fff;
}

.document-actions--featured a {
  background: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .7);
  color: #fff;
}

.document-actions--featured a:first-child {
  background: #e5b54b;
  border-color: #e5b54b;
  color: #123c35;
}

.document-actions--featured a:hover,
.document-actions--featured a:focus-visible {
  background: #fff;
  border-color: #fff;
  color: #123c35;
}

.document-actions a:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 2px;
}

/* Manual viewer. */
.manual-flipbook {
  margin-top: 4rem;
}

.manual-flipbook__header {
  display: block;
  margin: 0 auto 2rem;
  max-width: 46rem;
  text-align: center;
}

.manual-flipbook__header h2 {
  font-size: clamp(1.75rem, 4vw, 2.4rem);
}

.manual-flipbook__lead {
  color: #42554f;
  line-height: 1.65;
  margin: 1rem 0 0;
}

.manual-flipbook__download {
  align-items: center;
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-weight: 700;
  gap: .45rem;
  margin-top: 1.25rem;
  padding: .7rem 1.3rem;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease;
}

.manual-flipbook__download svg {
  height: 1.05rem;
  width: 1.05rem;
}

.manual-flipbook__download:hover,
.manual-flipbook__download:focus-visible {
  background: #f3d06f;
  transform: translateY(-2px);
}

.manual-flipbook__stage {
  border-radius: 20px;
}

.manual-flipbook__stage:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 4px;
}

.manual-flipbook__arrow:focus-visible {
  outline: 3px solid #123c35;
  outline-offset: 3px;
}

.manual-flipbook__controls {
  align-items: center;
  display: grid;
  gap: 1rem;
  grid-template-columns: auto minmax(0, 1fr) auto;
  margin: 1.25rem auto 0;
  max-width: 62rem;
}

.manual-flipbook__counter {
  background: #07513e;
  border-color: #07513e;
  color: #fff;
  white-space: nowrap;
}

.manual-flipbook__slider input {
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(90deg, #e5b54b var(--progress, 0%), #dfe7de var(--progress, 0%));
  border-radius: 999px;
  cursor: pointer;
  display: block;
  height: .5rem;
  width: 100%;
}

.manual-flipbook__slider input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #07513e;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(18, 60, 53, .35);
  height: 1.35rem;
  width: 1.35rem;
}

.manual-flipbook__slider input::-moz-range-thumb {
  background: #07513e;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(18, 60, 53, .35);
  height: 1.1rem;
  width: 1.1rem;
}

.manual-flipbook__slider input:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 4px;
}

.manual-flipbook__hint {
  align-items: center;
  color: #5b6d62;
  display: inline-flex;
  font-size: .82rem;
  gap: .4rem;
  white-space: nowrap;
}

.manual-flipbook__hint svg {
  height: 1rem;
  width: 1rem;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

/* Closing banner. */
.horizon-note {
  background: linear-gradient(135deg, #0b4a3d, #123c35 55%, #0d2f2a);
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(18, 60, 53, .2);
  margin-top: 4rem;
  overflow: hidden;
  padding: 2.25rem;
  position: relative;
}

.horizon-note__crest {
  bottom: -4rem;
  height: auto;
  opacity: .08;
  pointer-events: none;
  position: absolute;
  right: -3rem;
  width: 18rem;
}

.horizon-note__content {
  align-items: center;
  gap: 1.25rem;
  position: relative;
}

.horizon-note__icon {
  align-items: center;
  background: rgba(229, 181, 75, .18);
  border: 1px solid rgba(229, 181, 75, .45);
  border-radius: 16px;
  color: #f3d87c;
  display: flex;
  flex-shrink: 0;
  height: 4rem;
  justify-content: center;
  width: 4rem;
}

.horizon-note__icon svg {
  height: 2rem;
  width: 2rem;
}

.horizon-note .section-kicker {
  color: #f3d87c;
}

.horizon-note h2 {
  font-size: clamp(1.4rem, 3vw, 1.85rem);
}

@media (prefers-reduced-motion: reduce) {
  .featured-document,
  .document-row__icon,
  .manual-flipbook__download {
    transition: none;
  }

  .featured-document:hover,
  .document-row:hover .document-row__icon,
  .manual-flipbook__download:hover {
    transform: none;
  }
}

@media (max-width: 700px) {
  .manual-flipbook__controls {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
  }

  .manual-flipbook__slider {
    width: 100%;
  }

  .manual-flipbook__hint {
    display: none;
  }

  .horizon-note {
    padding: 1.5rem;
  }

  .horizon-note__content {
    align-items: flex-start;
    flex-direction: column;
  }

  .featured-document__content {
    padding: 1.25rem 1.25rem 1.5rem;
  }
}
</style>
