<script setup>
import { computed } from 'vue';
import { CalendarDays, Camera, Images } from '@lucide/vue';
import { useNews } from '../composables/useNews';
import { sizedImage } from '../utils/driveImage';

const { error, isLoading, newsItems } = useNews();

// Every news item with photos becomes an album, so each photo keeps its context.
const albums = computed(() => newsItems.value.filter((news) => news.gallery?.length));
const totalPhotos = computed(() => albums.value.reduce((total, album) => total + album.gallery.length, 0));

function photoLabel(count) {
  return `${count} ${count === 1 ? 'foto' : 'fotos'}`;
}

function useFallbackImage(event) {
  event.target.src = '/images/img_hero_1.webp';
}
</script>

<template>
  <main class="gallery-page">
    <div class="page-container">
      <section class="gallery-intro">
        <p v-reveal="'down'" class="section-kicker">Galería institucional</p>
        <h1 v-reveal="{ direction: 'up', delay: 120 }">Momentos de nuestra comunidad</h1>
        <p v-reveal="{ direction: 'up', delay: 220 }">
          Cada álbum reúne las fotos de una actividad institucional junto con su historia. Elige uno para ver todas sus
          imágenes.
        </p>
        <dl v-if="albums.length" v-reveal="{ direction: 'up', delay: 320 }" class="gallery-stats">
          <div><dt>Álbumes</dt><dd>{{ albums.length }}</dd></div>
          <div><dt>Fotos</dt><dd>{{ totalPhotos }}</dd></div>
        </dl>
      </section>

      <p v-if="error" class="gallery-error" role="status">{{ error }}</p>

      <section v-if="isLoading" class="album-grid" aria-busy="true" aria-live="polite">
        <span class="visually-hidden">Cargando álbumes…</span>
        <div v-for="index in 3" :key="index" class="album-skeleton" />
      </section>

      <section v-else-if="!albums.length" class="gallery-empty">
        <span class="gallery-empty__icon"><Camera aria-hidden="true" /></span>
        <h2>Aún no hay álbumes publicados</h2>
        <p>Las fotos aparecerán aquí cuando se publiquen noticias con imágenes desde el formulario institucional.</p>
      </section>

      <section v-else class="album-grid" aria-label="Álbumes de fotos">
        <article
          v-for="(album, index) in albums"
          :key="album.slug"
          v-reveal="{ direction: 'up', delay: 60 + (index % 3) * 90 }"
          class="album-card">
          <RouterLink :to="`/galeria/${album.slug}`">
            <div class="album-card__media" :class="{ 'album-card__media--stack': album.gallery.length > 1 }">
              <img
                :src="sizedImage(album.gallery[0], 700)"
                :alt="album.imageAlt || album.title"
                :loading="index < 3 ? 'eager' : 'lazy'"
                decoding="async"
                @error="useFallbackImage" />
              <span class="album-card__count">
                <Images aria-hidden="true" />
                {{ photoLabel(album.gallery.length) }}
              </span>
            </div>
            <div class="album-card__content">
              <span class="album-card__category">{{ album.category }}</span>
              <h2>{{ album.title }}</h2>
              <p v-if="album.date"><CalendarDays aria-hidden="true" /> {{ album.date }}</p>
            </div>
          </RouterLink>
        </article>
      </section>
    </div>
  </main>
</template>

<style scoped>
.gallery-page {
  background: #f7f8f4;
  color: #1f2f2b;
  font-family: 'Open Sans', Arial, sans-serif;
  padding: 3.5rem 0 4.5rem;
}

.gallery-page,
.gallery-page :deep(*) {
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

/* ---- Intro ---- */
.gallery-intro {
  margin: 0 auto 2.75rem;
  max-width: 50rem;
  text-align: center;
}

.gallery-intro h1 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.12;
  margin: 0;
  padding-bottom: .8rem;
  position: relative;
}

.gallery-intro h1::after {
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

.gallery-intro > p:not(.section-kicker) {
  color: #42554f;
  line-height: 1.65;
  margin: 1rem 0 0;
}

.gallery-stats {
  display: flex;
  gap: .75rem;
  justify-content: center;
  margin: 1.75rem 0 0;
}

.gallery-stats div {
  background: #fff;
  border: 1px solid #e3e9e1;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(18, 60, 53, .06);
  min-width: 8rem;
  padding: .75rem 1.25rem;
}

.gallery-stats dt {
  color: #5b6d62;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.gallery-stats dd {
  color: #07513e;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin: .15rem 0 0;
}

.gallery-error {
  background: #fff0f0;
  border-left: 4px solid #b84a4a;
  border-radius: 8px;
  color: #7c2626;
  margin: 0 0 1.5rem;
  padding: .75rem 1rem;
}

/* ---- Album cards ---- */
.album-grid {
  display: grid;
  gap: 2rem 1.5rem;
}

.album-card a {
  color: inherit;
  display: block;
  text-decoration: none;
}

.album-card a:focus-visible {
  border-radius: 18px;
  outline: 3px solid #b3821c;
  outline-offset: 4px;
}

.album-card__media {
  aspect-ratio: 4 / 3;
  position: relative;
}

/* Two sheets behind the cover make the card read as a photo album. */
.album-card__media--stack::before,
.album-card__media--stack::after {
  background: #fff;
  border: 1px solid #dfe7de;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(18, 60, 53, .08);
  content: "";
  inset: 0;
  position: absolute;
  transition: transform .35s ease;
}

.album-card__media--stack::before {
  transform: rotate(-4deg) translate(-4px, 6px);
}

.album-card__media--stack::after {
  transform: rotate(3deg) translate(4px, 4px);
}

.album-card:hover .album-card__media--stack::before {
  transform: rotate(-7deg) translate(-12px, 8px);
}

.album-card:hover .album-card__media--stack::after {
  transform: rotate(6deg) translate(12px, 6px);
}

.album-card__media img {
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(18, 60, 53, .18);
  display: block;
  height: 100%;
  object-fit: cover;
  position: relative;
  transition: transform .35s ease, box-shadow .35s ease;
  width: 100%;
  z-index: 1;
}

.album-card:hover .album-card__media img {
  box-shadow: 0 22px 44px rgba(18, 60, 53, .26);
  transform: translateY(-4px);
}

.album-card__count {
  align-items: center;
  backdrop-filter: blur(6px);
  background: rgba(6, 45, 38, .78);
  border-radius: 999px;
  bottom: .85rem;
  color: #fff;
  display: inline-flex;
  font-size: .8rem;
  font-weight: 700;
  gap: .4rem;
  padding: .35rem .8rem;
  position: absolute;
  right: .85rem;
  z-index: 2;
}

.album-card__count svg {
  color: #f3d87c;
  height: 1rem;
  width: 1rem;
}

.album-card__content {
  padding: 1.25rem .25rem 0;
}

.album-card__category {
  background: #fbf3dc;
  border-radius: 999px;
  color: #7a5510;
  display: inline-flex;
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .04em;
  margin-bottom: .55rem;
  padding: .2rem .7rem;
  text-transform: uppercase;
}

.album-card h2 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.15rem;
  line-height: 1.3;
  margin: 0 0 .45rem;
  transition: color .2s ease;
}

.album-card:hover h2 {
  color: #07513e;
}

.album-card__content p {
  align-items: center;
  color: #5b6d62;
  display: flex;
  font-size: .85rem;
  gap: .4rem;
  margin: 0;
}

.album-card__content p svg {
  color: #b3821c;
  height: 1rem;
  width: 1rem;
}

/* ---- Loading and empty ---- */
.album-skeleton {
  animation: gallery-shimmer 1.4s ease-in-out infinite;
  aspect-ratio: 4 / 3;
  background: linear-gradient(90deg, #eef2ec 0%, #f7f9f5 50%, #eef2ec 100%);
  background-size: 200% 100%;
  border-radius: 16px;
}

@keyframes gallery-shimmer {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}

.gallery-empty {
  background: #fff;
  border: 1px dashed #cdd8cc;
  border-radius: 20px;
  margin: 0 auto;
  max-width: 40rem;
  padding: 2.5rem 2rem;
  text-align: center;
}

.gallery-empty__icon {
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

.gallery-empty__icon svg {
  height: 1.9rem;
  width: 1.9rem;
}

.gallery-empty h2 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  margin: 0 0 .75rem;
}

.gallery-empty p {
  color: #42554f;
  line-height: 1.65;
  margin: 0;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

@media (min-width: 640px) {
  .album-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1000px) {
  .album-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .album-skeleton {
    animation: none;
  }

  .album-card__media--stack::before,
  .album-card__media--stack::after,
  .album-card__media img {
    transition: none;
  }

  .album-card:hover .album-card__media img {
    transform: none;
  }
}
</style>
