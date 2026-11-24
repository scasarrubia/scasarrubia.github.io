<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Images,
  Link2,
  MessageCircle,
  Newspaper,
  UserRound
} from '@lucide/vue';
import PhotoLightbox from '../components/shared/PhotoLightbox.vue';
import { useNews } from '../composables/useNews';
import { sizedImage } from '../utils/driveImage';

const route = useRoute();
const { isLoading, newsItems } = useNews();
const news = computed(() => newsItems.value.find((item) => item.slug === route.params.slug));
const linkCopied = ref(false);
const openPhoto = ref(null);
let copiedTimer;

// The article shows only a few photos; the full set lives in the gallery album.
const PREVIEW_PHOTOS = 4;
const previewPhotos = computed(() => (news.value?.gallery ?? []).slice(0, PREVIEW_PHOTOS));
const hiddenPhotoCount = computed(() => Math.max((news.value?.gallery?.length ?? 0) - PREVIEW_PHOTOS, 0));
const urlPattern = /(https?:\/\/[^\s<>"']+)/g;

const relatedNews = computed(() => newsItems.value.filter((item) => item.slug !== news.value?.slug).slice(0, 3));

// Long texts pasted from Sheets often arrive as a single block: split on line breaks and,
// when a paragraph is still very long, group its sentences in threes for easier reading.
const readableParagraphs = computed(() => {
  if (!news.value) return [];

  return news.value.body
    .flatMap((paragraph) => String(paragraph).split(/\r?\n+/))
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .flatMap((paragraph) => {
      if (paragraph.length < 700) return [paragraph];

      const sentences = paragraph.match(/[^.!?]+[.!?]+["”»)]*\s*|[^.!?]+$/g) || [paragraph];
      const groups = [];
      for (let index = 0; index < sentences.length; index += 3) {
        groups.push(sentences.slice(index, index + 3).join('').trim());
      }
      return groups;
    });
});

const readingMinutes = computed(() => {
  const words = readableParagraphs.value.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
});

// Built from the route so it stays correct when moving between news without reloading.
const shareUrl = computed(() => `${window.location.origin}${window.location.pathname}#${route.fullPath}`);
const whatsappUrl = computed(() => `https://wa.me/?text=${encodeURIComponent(`${news.value?.title ?? ''} ${shareUrl.value}`)}`);

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    linkCopied.value = true;
    window.clearTimeout(copiedTimer);
    copiedTimer = window.setTimeout(() => {
      linkCopied.value = false;
    }, 2200);
  } catch {
    window.prompt('Copia el enlace de la noticia:', shareUrl.value);
  }
}

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

watch(() => news.value?.slug, () => {
  openPhoto.value = null;
});

onBeforeUnmount(() => {
  window.clearTimeout(copiedTimer);
});
</script>

<template>
  <main class="news-detail-page">
    <div class="page-container">
      <RouterLink class="news-back" to="/noticias">
        <ArrowLeft aria-hidden="true" />
        Volver a noticias
      </RouterLink>

      <section v-if="isLoading" class="news-detail-loading" aria-live="polite" aria-busy="true">
        <span class="visually-hidden">Cargando noticia…</span>
        <div class="news-skeleton news-skeleton--title" />
        <div class="news-skeleton news-skeleton--meta" />
        <div class="news-skeleton news-skeleton--image" />
      </section>

      <section v-else-if="!news" class="news-detail-empty">
        <span class="news-detail-empty__icon"><Newspaper aria-hidden="true" /></span>
        <h1>Noticia no disponible</h1>
        <p>La publicación solicitada aún no está disponible o fue retirada.</p>
        <RouterLink to="/noticias" class="news-detail-empty__link">Ver todas las noticias</RouterLink>
      </section>

      <article v-else class="article">
        <header class="article__header">
          <span v-reveal="'down'" class="article__category">{{ news.category }}</span>
          <h1 v-reveal="{ direction: 'up', delay: 100 }">{{ news.title }}</h1>

          <div v-reveal="{ direction: 'up', delay: 200 }" class="article__bar">
            <ul class="article__meta">
              <li v-if="news.date"><CalendarDays aria-hidden="true" /> <time>{{ news.date }}</time></li>
              <li v-if="news.author"><UserRound aria-hidden="true" /> {{ news.author }}</li>
              <li><Clock aria-hidden="true" /> {{ readingMinutes }} min de lectura</li>
            </ul>

            <div class="article__share" aria-label="Compartir noticia">
              <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="article__share-button">
                <MessageCircle aria-hidden="true" />
                WhatsApp
              </a>
              <button type="button" class="article__share-button" @click="copyLink">
                <Check v-if="linkCopied" aria-hidden="true" />
                <Link2 v-else aria-hidden="true" />
                {{ linkCopied ? 'Enlace copiado' : 'Copiar enlace' }}
              </button>
            </div>
          </div>
        </header>

        <figure v-reveal="{ direction: 'zoom', delay: 120 }" class="article__image">
          <img
            :src="news.image"
            :alt="news.imageAlt"
            fetchpriority="high"
            decoding="async"
            @error="useFallbackImage" />
        </figure>

        <div class="article__body">
          <p v-for="(paragraph, paragraphIndex) in readableParagraphs" :key="paragraphIndex">
            <template v-for="(part, index) in parseParagraphLinks(paragraph)" :key="`${paragraphIndex}-${index}`">
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

        <section v-if="news.gallery.length > 1" class="article__gallery" aria-labelledby="article-photos-title">
          <div class="article__section-heading">
            <p class="section-kicker">Galería</p>
            <h2 id="article-photos-title">Momentos de la actividad</h2>
          </div>

          <div class="photo-preview" :class="`photo-preview--${previewPhotos.length}`">
            <button
              v-for="(photo, index) in previewPhotos"
              :key="photo"
              type="button"
              class="photo-preview__item"
              :aria-label="`Ampliar foto ${index + 1} de ${news.gallery.length}`"
              @click="openPhoto = index">
              <img :src="sizedImage(photo, index === 0 ? 900 : 500)" alt="" loading="lazy" decoding="async" @error="useFallbackImage">
              <span
                v-if="hiddenPhotoCount && index === previewPhotos.length - 1"
                class="photo-preview__more"
                aria-hidden="true">+{{ hiddenPhotoCount }}</span>
            </button>
          </div>

          <div class="article__gallery-actions">
            <RouterLink :to="`/galeria/${news.slug}`" class="article__gallery-link">
              <Images aria-hidden="true" />
              Ver las {{ news.gallery.length }} fotos en la galería
            </RouterLink>
          </div>

          <PhotoLightbox v-model="openPhoto" :images="news.gallery" :title="news.title" />
        </section>

        <footer class="article__footer">
          <RouterLink to="/noticias" class="article__footer-link">
            <ArrowLeft aria-hidden="true" />
            Ver todas las noticias
          </RouterLink>
          <div class="article__share">
            <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="article__share-button">
              <MessageCircle aria-hidden="true" />
              Compartir
            </a>
          </div>
        </footer>
      </article>

      <section v-if="news && relatedNews.length" class="related" aria-labelledby="related-title">
        <div class="article__section-heading">
          <p class="section-kicker">Sigue leyendo</p>
          <h2 id="related-title">Otras noticias</h2>
        </div>

        <div class="related__grid">
          <article
            v-for="(item, index) in relatedNews"
            :key="item.slug"
            v-reveal="{ direction: 'up', delay: 80 + index * 100 }"
            class="related__card">
            <RouterLink :to="`/noticias/${item.slug}`">
              <div class="related__media">
                <img :src="item.image" :alt="item.imageAlt" loading="lazy" decoding="async" @error="useFallbackImage" />
                <span>{{ item.category }}</span>
              </div>
              <div class="related__content">
                <h3>{{ item.title }}</h3>
                <p>
                  <time v-if="item.date"><CalendarDays aria-hidden="true" /> {{ item.date }}</time>
                  <strong>Leer <ArrowRight aria-hidden="true" /></strong>
                </p>
              </div>
            </RouterLink>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.news-detail-page {
  background: #fff;
  color: #1f2f2b;
  font-family: 'Open Sans', Arial, sans-serif;
  padding: 3rem 0 4.5rem;
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

/* ---- Back link ---- */
.news-back {
  align-items: center;
  background: #f7f8f4;
  border: 1px solid #e3e9e1;
  border-radius: 999px;
  color: #07513e;
  display: inline-flex;
  font-size: .9rem;
  font-weight: 700;
  gap: .45rem;
  margin-bottom: 2rem;
  padding: .5rem 1rem .5rem .8rem;
  text-decoration: none;
  transition: background .2s ease, color .2s ease, border-color .2s ease;
}

.news-back svg {
  height: 1rem;
  transition: transform .2s ease;
  width: 1rem;
}

.news-back:hover,
.news-back:focus-visible {
  background: #07513e;
  border-color: #07513e;
  color: #fff;
}

.news-back:hover svg {
  transform: translateX(-.2rem);
}

/* ---- Article header ---- */
.article__header {
  margin: 0 auto 2rem;
  max-width: 56rem;
  text-align: center;
}

.article__category {
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .05em;
  margin-bottom: 1rem;
  padding: .3rem .85rem;
  text-transform: uppercase;
}

.article__header h1 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.9rem, 4.5vw, 3.1rem);
  font-weight: 700;
  line-height: 1.15;
  margin: 0;
}

.article__bar {
  align-items: center;
  border-bottom: 1px solid #e3e9e1;
  border-top: 1px solid #e3e9e1;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 1.75rem;
  padding: 1rem 0;
}

.article__meta {
  color: #5b6d62;
  display: flex;
  flex-wrap: wrap;
  font-size: .88rem;
  gap: .5rem 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.article__meta li {
  align-items: center;
  display: inline-flex;
  gap: .4rem;
}

.article__meta svg {
  color: #b3821c;
  height: 1rem;
  width: 1rem;
}

.article__share {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.article__share-button {
  align-items: center;
  background: #fff;
  border: 1px solid #cfdccf;
  border-radius: 999px;
  color: #07513e;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: .82rem;
  font-weight: 700;
  gap: .4rem;
  padding: .45rem .9rem;
  text-decoration: none;
  transition: background .2s ease, color .2s ease, border-color .2s ease;
}

.article__share-button svg {
  height: 1rem;
  width: 1rem;
}

.article__share-button:hover,
.article__share-button:focus-visible {
  background: #07513e;
  border-color: #07513e;
  color: #fff;
}

/* ---- Main image ---- */
.article__image {
  border-radius: 22px;
  box-shadow: 0 22px 50px rgba(18, 60, 53, .18);
  margin: 0 0 2.75rem;
  overflow: hidden;
}

.article__image img {
  aspect-ratio: 16 / 9;
  display: block;
  object-fit: cover;
  width: 100%;
}

/* ---- Body ---- */
.article__body {
  margin: 0 auto;
  max-width: 46rem;
}

.article__body p {
  color: #2a3a35;
  font-size: 1.08rem;
  line-height: 1.85;
  margin: 0 0 1.4rem;
}

.article__body p:first-child::first-letter {
  color: #07513e;
  float: left;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 3.6rem;
  font-weight: 700;
  line-height: .9;
  margin: .35rem .6rem 0 0;
}

.article__body a {
  color: #8b6418;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: #e5b54b;
  text-decoration-thickness: 2px;
  text-underline-offset: .2rem;
}

.article__body a:hover,
.article__body a:focus-visible {
  color: #07513e;
}

/* ---- Section headings ---- */
.article__section-heading {
  margin-bottom: 1.5rem;
  text-align: center;
}

.article__section-heading h2 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  margin: 0;
  padding-bottom: .7rem;
  position: relative;
}

.article__section-heading h2::after {
  background: #e5b54b;
  border-radius: 2px;
  bottom: 0;
  content: "";
  height: 4px;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  width: 3rem;
}

/* ---- Photo preview ---- */
.article__gallery {
  margin: 3.5rem auto 0;
  max-width: 56rem;
}

.photo-preview {
  display: grid;
  gap: .6rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 9rem));
}

.photo-preview__item {
  background: #e7ede5;
  border: 0;
  border-radius: 14px;
  cursor: zoom-in;
  overflow: hidden;
  padding: 0;
  position: relative;
}

.photo-preview__item img {
  display: block;
  height: 100%;
  object-fit: cover;
  transition: transform .5s ease;
  width: 100%;
}

.photo-preview__item:hover img,
.photo-preview__item:focus-visible img {
  transform: scale(1.06);
}

.photo-preview__item:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 3px;
}

/* Layouts by number of photos: the first one is always the largest. */
.photo-preview--2 .photo-preview__item,
.photo-preview--3 .photo-preview__item:first-child,
.photo-preview--4 .photo-preview__item:first-child {
  grid-column: span 2;
  grid-row: span 2;
}

.photo-preview--3 .photo-preview__item:not(:first-child) {
  grid-column: span 2;
}

.photo-preview--4 .photo-preview__item:nth-child(2) {
  grid-column: span 2;
}

.photo-preview__more {
  align-items: center;
  background: rgba(6, 45, 38, .68);
  color: #fff;
  display: flex;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2rem;
  font-weight: 700;
  inset: 0;
  justify-content: center;
  position: absolute;
}

.article__gallery-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.article__gallery-link {
  align-items: center;
  background: #07513e;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-weight: 700;
  gap: .5rem;
  padding: .75rem 1.4rem;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease;
}

.article__gallery-link svg {
  height: 1.1rem;
  width: 1.1rem;
}

.article__gallery-link:hover,
.article__gallery-link:focus-visible {
  background: #0b6a52;
  transform: translateY(-2px);
}

/* ---- Footer ---- */
.article__footer {
  align-items: center;
  border-top: 1px solid #e3e9e1;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  margin: 3rem auto 0;
  max-width: 46rem;
  padding-top: 1.5rem;
}

.article__footer-link {
  align-items: center;
  color: #07513e;
  display: inline-flex;
  font-weight: 700;
  gap: .4rem;
  text-decoration: none;
}

.article__footer-link svg {
  height: 1rem;
  width: 1rem;
}

.article__footer-link:hover {
  text-decoration: underline;
}

/* ---- Related news ---- */
.related {
  border-top: 1px solid #e3e9e1;
  margin-top: 4rem;
  padding-top: 3.5rem;
}

.related__grid {
  display: grid;
  gap: 1.25rem;
}

.related__card {
  border: 1px solid #e3e9e1;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(18, 60, 53, .08);
  overflow: hidden;
  transition: transform .3s ease, box-shadow .3s ease;
}

.related__card:hover {
  box-shadow: 0 20px 40px rgba(18, 60, 53, .16);
  transform: translateY(-4px);
}

.related__card a {
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
}

.related__media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  position: relative;
}

.related__media img {
  height: 100%;
  object-fit: cover;
  transition: transform .6s ease;
  width: 100%;
}

.related__card:hover .related__media img {
  transform: scale(1.06);
}

.related__media span {
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  font-size: .7rem;
  font-weight: 700;
  left: .85rem;
  padding: .2rem .65rem;
  position: absolute;
  text-transform: uppercase;
  top: .85rem;
}

.related__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.15rem 1.25rem;
}

.related__content h3 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.08rem;
  line-height: 1.3;
  margin: 0 0 1rem;
}

.related__content p {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: auto 0 0;
}

.related__content time {
  align-items: center;
  color: #5b6d62;
  display: inline-flex;
  font-size: .8rem;
  gap: .35rem;
}

.related__content time svg {
  color: #b3821c;
  height: .95rem;
  width: .95rem;
}

.related__content strong {
  align-items: center;
  color: #07513e;
  display: inline-flex;
  font-size: .85rem;
  gap: .3rem;
}

.related__content strong svg {
  height: 1rem;
  width: 1rem;
}

/* ---- Loading and empty ---- */
.news-skeleton {
  animation: detail-shimmer 1.4s ease-in-out infinite;
  background: linear-gradient(90deg, #eef2ec 0%, #f7f9f5 50%, #eef2ec 100%);
  background-size: 200% 100%;
  border-radius: 14px;
  margin: 0 auto 1.25rem;
}

.news-skeleton--title {
  height: 3.5rem;
  max-width: 44rem;
}

.news-skeleton--meta {
  height: 1.5rem;
  max-width: 28rem;
}

.news-skeleton--image {
  aspect-ratio: 16 / 9;
  border-radius: 22px;
}

@keyframes detail-shimmer {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}

.news-detail-empty {
  background: #f7f8f4;
  border: 1px dashed #cdd8cc;
  border-radius: 20px;
  margin: 0 auto;
  max-width: 40rem;
  padding: 2.5rem 2rem;
  text-align: center;
}

.news-detail-empty__icon {
  align-items: center;
  background: #e7f0e8;
  border-radius: 50%;
  color: #07513e;
  display: inline-flex;
  height: 4rem;
  justify-content: center;
  margin-bottom: 1rem;
  width: 4rem;
}

.news-detail-empty__icon svg {
  height: 1.9rem;
  width: 1.9rem;
}

.news-detail-empty h1 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.75rem;
  margin: 0 0 .75rem;
}

.news-detail-empty p {
  color: #42554f;
  line-height: 1.65;
  margin: 0;
}

.news-detail-empty__link {
  background: #07513e;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-weight: 700;
  margin-top: 1.25rem;
  padding: .7rem 1.3rem;
  text-decoration: none;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

@media (min-width: 700px) {
  .related__grid {
    grid-template-columns: repeat(auto-fit, minmax(16rem, 22rem));
    justify-content: center;
  }

}

@media (prefers-reduced-motion: reduce) {
  .news-skeleton {
    animation: none;
  }

  .related__card,
  .related__media img,
  .photo-preview__item img {
    transition: none;
  }

  .related__card:hover,
  .related__card:hover .related__media img {
    transform: none;
  }
}

@media (max-width: 600px) {
  .article__bar {
    flex-direction: column;
  }

  .article__meta {
    justify-content: center;
  }

  .article__image {
    border-radius: 14px;
    margin-left: -.25rem;
    margin-right: -.25rem;
  }

  .article__body p {
    font-size: 1.02rem;
  }

  .photo-preview {
    grid-template-rows: repeat(2, minmax(0, 6.5rem));
  }
}
</style>
