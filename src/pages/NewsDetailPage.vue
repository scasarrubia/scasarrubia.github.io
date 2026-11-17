<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { useNews } from '../composables/useNews';

const route = useRoute();
const { isLoading, newsItems } = useNews();
const news = computed(() => newsItems.value.find((item) => item.slug === route.params.slug));
const activeGalleryIndex = ref(0);
let galleryInterval;

const activeGalleryImage = computed(() => news.value?.gallery?.[activeGalleryIndex.value] || '');
const urlPattern = /(https?:\/\/[^\s<>"']+)/g;

function parseParagraphLinks(paragraph) {
  const text = String(paragraph || '');
  const parts = [];
  let lastIndex = 0;

  for (const match of text.matchAll(urlPattern)) {
    const rawUrl = match[0];
    const start = match.index || 0;
    const trailingPunctuation = rawUrl.match(/[.,;:!?)]*$/)?.[0] || '';
    const url = rawUrl.slice(0, rawUrl.length - trailingPunctuation.length);

    if (start > lastIndex) {
      parts.push({
        type: 'text',
        text: text.slice(lastIndex, start)
      });
    }

    if (url) {
      parts.push({
        type: 'link',
        text: 'click aquí',
        href: url
      });
    }

    if (trailingPunctuation) {
      parts.push({
        type: 'text',
        text: trailingPunctuation
      });
    }

    lastIndex = start + rawUrl.length;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      text: text.slice(lastIndex)
    });
  }

  return parts.length ? parts : [{ type: 'text', text }];
}

function useFallbackImage(event) {
  event.target.src = '/images/img_hero_1.webp';
}

function stopGalleryAutoplay() {
  window.clearInterval(galleryInterval);
}

function startGalleryAutoplay() {
  stopGalleryAutoplay();

  if (!news.value?.gallery || news.value.gallery.length <= 1) return;

  galleryInterval = window.setInterval(() => {
    activeGalleryIndex.value = (activeGalleryIndex.value + 1) % news.value.gallery.length;
  }, 5200);
}

function showGalleryImage(index) {
  activeGalleryIndex.value = index;
  startGalleryAutoplay();
}

function showPreviousGalleryImage() {
  if (!news.value?.gallery?.length) return;

  activeGalleryIndex.value = activeGalleryIndex.value === 0
    ? news.value.gallery.length - 1
    : activeGalleryIndex.value - 1;
  startGalleryAutoplay();
}

function showNextGalleryImage() {
  if (!news.value?.gallery?.length) return;

  activeGalleryIndex.value = (activeGalleryIndex.value + 1) % news.value.gallery.length;
  startGalleryAutoplay();
}

watch(
  () => news.value?.slug,
  () => {
    activeGalleryIndex.value = 0;
    startGalleryAutoplay();
  },
  { immediate: true }
);

onBeforeUnmount(stopGalleryAutoplay);
</script>

<template>
  <main class="news-detail-page">
    <div class="page-container">
      <RouterLink class="news-back" to="/noticias">Volver a noticias</RouterLink>

      <section v-if="isLoading" class="news-detail-empty">
        <h1>Cargando noticia</h1>
        <p>Estamos consultando la información institucional.</p>
      </section>

      <section v-else-if="!news" class="news-detail-empty">
        <h1>Noticia no disponible</h1>
        <p>La publicación solicitada aún no está disponible o fue retirada.</p>
      </section>

      <article v-else class="featured-news">
        <header class="featured-news__header">
          <span>{{ news.category }}</span>
          <h1>{{ news.title }}</h1>
        </header>

        <dl class="featured-news__meta">
          <div>
            <dt>Fecha</dt>
            <dd>{{ news.date }}</dd>
          </div>
          <div>
            <dt>Publicado por</dt>
            <dd>{{ news.author }}</dd>
          </div>
        </dl>

        <figure class="featured-news__image">
          <img :src="news.image" :alt="news.imageAlt" decoding="async" @error="useFallbackImage" />
          <figcaption>{{ news.imageAlt }}</figcaption>
        </figure>

        <div class="featured-news__body">
          <p v-for="paragraph in news.body" :key="paragraph">
            <template v-for="(part, index) in parseParagraphLinks(paragraph)" :key="`${part.text}-${index}`">
              <a
                v-if="part.type === 'link'"
                :href="part.href"
                target="_blank"
                rel="noopener noreferrer">
                {{ part.text }}
              </a>
              <span v-else>{{ part.text }}</span>
            </template>
          </p>
        </div>

        <section v-if="news.gallery.length > 1" class="featured-news__gallery" aria-label="Galería de la noticia">
          <div class="featured-news__gallery-header">
            <span>Galería</span>
            <h2>Momentos de la actividad</h2>
          </div>

          <div class="featured-news__gallery-viewer">
            <button
              type="button"
              class="featured-news__gallery-arrow featured-news__gallery-arrow--previous"
              aria-label="Ver imagen anterior"
              @click="showPreviousGalleryImage">
              <ChevronLeft aria-hidden="true" />
            </button>

            <div class="featured-news__gallery-frame">
              <img
                :key="activeGalleryImage"
                :src="activeGalleryImage"
                :alt="`${news.title} - imagen ${activeGalleryIndex + 1}`"
                loading="lazy"
                decoding="async"
                @error="useFallbackImage">
              <span>{{ activeGalleryIndex + 1 }} / {{ news.gallery.length }}</span>
            </div>

            <button
              type="button"
              class="featured-news__gallery-arrow featured-news__gallery-arrow--next"
              aria-label="Ver imagen siguiente"
              @click="showNextGalleryImage">
              <ChevronRight aria-hidden="true" />
            </button>

            <div class="featured-news__gallery-thumbs" aria-label="Seleccionar imagen de la galería">
              <button
                v-for="(image, index) in news.gallery"
                :key="image"
                type="button"
                :class="{ 'featured-news__gallery-thumb--active': activeGalleryIndex === index }"
                :aria-label="`Ver imagen ${index + 1}`"
                @click="showGalleryImage(index)">
                <img
                  :src="image"
                  :alt="`${news.title} - miniatura ${index + 1}`"
                  loading="lazy"
                  decoding="async"
                  @error="useFallbackImage">
              </button>
            </div>
          </div>
        </section>
      </article>
    </div>
  </main>
</template>

<style scoped>
.news-detail-page {
  background: #fff;
  color: #1f2f2b;
  padding: 3rem 0;
}

.page-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.news-back {
  color: #123c35;
  display: inline-flex;
  font-weight: 900;
  margin-bottom: 1rem;
  text-decoration: none;
}

.news-back:hover,
.news-back:focus {
  color: #b77c17;
}

.news-detail-empty {
  background: #f7f8f4;
  border: 1px solid #dde6dc;
  border-radius: 8px;
  box-shadow: 0 1rem 2.4rem rgba(31, 47, 43, .11);
  padding: 2rem;
  text-align: center;
}

.news-detail-empty h1 {
  color: #123c35;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  margin: 0 0 .75rem;
}

.news-detail-empty p {
  color: #42554f;
  line-height: 1.65;
  margin: 0;
}

.featured-news {
  background: #f7f8f4;
  border: 1px solid #dde6dc;
  border-radius: 8px;
  box-shadow: 0 1rem 2.4rem rgba(31, 47, 43, .11);
  overflow: hidden;
}

.featured-news__header {
  padding: 1.5rem;
}

.featured-news__header span {
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-size: .78rem;
  font-weight: 900;
  margin-bottom: .9rem;
  padding: .3rem .75rem;
  text-transform: uppercase;
}

.featured-news__header h1 {
  color: #123c35;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.04;
  margin: 0;
}

.featured-news__meta {
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  margin: 0;
  padding: 1rem 1.5rem 0;
}

.featured-news__meta div {
  background: #fff;
  border: 1px solid #dde6dc;
  border-radius: 999px;
  display: inline-flex;
  gap: .35rem;
  padding: .38rem .75rem;
}

.featured-news__meta dt {
  color: #b77c17;
  font-size: .75rem;
  font-weight: 900;
  text-transform: uppercase;
}

.featured-news__meta dd {
  color: #123c35;
  font-size: .88rem;
  font-weight: 800;
  margin: 0;
}

.featured-news__image {
  margin: 0;
}

.featured-news__image img {
  aspect-ratio: 16 / 8;
  display: block;
  object-fit: cover;
  width: 100%;
}

.featured-news__image figcaption {
  background: #123c35;
  color: rgba(255, 255, 255, .82);
  font-size: .78rem;
  padding: .55rem 1rem;
}

.featured-news__body {
  background: #fff;
  padding: 1.5rem;
}

.featured-news__body p {
  color: #1f2f2b;
  font-size: 1rem;
  line-height: 1.8;
  margin: 0 auto;
  max-width: 48rem;
}

.featured-news__body p + p {
  margin-top: 1.2rem;
}

.featured-news__body a {
  color: #b77c17;
  font-weight: 900;
  text-decoration: underline;
  text-underline-offset: .18rem;
}

.featured-news__body a:hover,
.featured-news__body a:focus {
  color: #123c35;
}

.featured-news__gallery {
  background: #f7f8f4;
  border-top: 1px solid #dde6dc;
  padding: 1.5rem;
}

.featured-news__gallery-header {
  margin: 0 0 1rem;
  text-align: center;
}

.featured-news__gallery-header span {
  color: #b77c17;
  font-size: .78rem;
  font-weight: 900;
  text-transform: uppercase;
}

.featured-news__gallery-header h2 {
  color: #123c35;
  font-size: 1.5rem;
  font-weight: 900;
  margin: .25rem 0 0;
}

.featured-news__gallery-viewer {
  background: #123c35;
  border-radius: 8px;
  box-shadow: 0 1rem 2.2rem rgba(31, 47, 43, .16);
  overflow: hidden;
  position: relative;
}

.featured-news__gallery-frame {
  align-items: center;
  background:
    linear-gradient(135deg, rgba(18, 60, 53, .94), rgba(18, 60, 53, .86)),
    radial-gradient(circle at top right, rgba(229, 181, 75, .2), transparent 18rem);
  display: flex;
  justify-content: center;
  min-height: 18rem;
  padding: 1rem 1rem 3.8rem;
  position: relative;
}

.featured-news__gallery-frame > img {
  border-radius: 6px;
  box-shadow: 0 .8rem 1.8rem rgba(0, 0, 0, .18);
  display: block;
  max-height: min(30rem, 62vh);
  object-fit: contain;
  width: 100%;
}

.featured-news__gallery-frame span {
  background: rgba(18, 60, 53, .88);
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 999px;
  top: 1rem;
  color: #fff;
  font-size: .8rem;
  font-weight: 900;
  padding: .35rem .75rem;
  position: absolute;
  right: 1rem;
}

.featured-news__gallery-arrow {
  align-items: center;
  background: rgba(229, 181, 75, .95);
  border: 1px solid rgba(229, 181, 75, .95);
  border-radius: 999px;
  color: #123c35;
  cursor: pointer;
  display: inline-flex;
  height: 2.75rem;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: background .2s ease, border-color .2s ease, transform .2s ease;
  width: 2.75rem;
  z-index: 2;
}

.featured-news__gallery-arrow:hover,
.featured-news__gallery-arrow:focus {
  background: #fff;
  border-color: #fff;
  transform: translateY(-50%) scale(1.06);
}

.featured-news__gallery-arrow svg {
  height: 1.4rem;
  width: 1.4rem;
}

.featured-news__gallery-arrow--previous {
  left: .85rem;
}

.featured-news__gallery-arrow--next {
  right: .85rem;
}

.featured-news__gallery-thumbs {
  align-items: center;
  bottom: .85rem;
  display: flex;
  gap: .5rem;
  justify-content: center;
  left: 50%;
  max-width: calc(100% - 2rem);
  overflow-x: auto;
  padding: .1rem;
  position: absolute;
  scrollbar-width: thin;
  transform: translateX(-50%);
  z-index: 3;
}

.featured-news__gallery-thumbs button {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, .35);
  border-radius: 6px;
  cursor: pointer;
  flex: 0 0 auto;
  overflow: hidden;
  padding: 0;
  transition: border-color .2s ease, opacity .2s ease, transform .2s ease;
  width: 3.2rem;
}

.featured-news__gallery-thumbs button:hover,
.featured-news__gallery-thumbs button:focus,
.featured-news__gallery-thumb--active {
  border-color: #e5b54b !important;
  opacity: 1;
  transform: translateY(-.1rem);
}

.featured-news__gallery-thumbs button:not(.featured-news__gallery-thumb--active) {
  opacity: .72;
}

.featured-news__gallery-thumbs img {
  aspect-ratio: 1 / 1;
  display: block;
  object-fit: cover;
  width: 100%;
}

@media (min-width: 768px) {
  .featured-news__header,
  .featured-news__meta,
  .featured-news__body,
  .featured-news__gallery {
    padding: 2rem;
  }

  .featured-news__meta {
    padding-bottom: 0;
  }

  .featured-news__gallery-frame {
    min-height: 22rem;
    padding: 1.25rem 1.25rem 4rem;
  }

  .featured-news__gallery-thumbs button {
    width: 3.7rem;
  }

}
</style>
