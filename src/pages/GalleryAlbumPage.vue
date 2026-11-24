<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, ArrowRight, CalendarDays, Images, ZoomIn } from '@lucide/vue';
import PhotoLightbox from '../components/shared/PhotoLightbox.vue';
import { useNews } from '../composables/useNews';
import { sizedImage } from '../utils/driveImage';

const route = useRoute();
const { isLoading, newsItems } = useNews();

const album = computed(() => newsItems.value.find((news) => news.slug === route.params.slug && news.gallery?.length));
const openPhoto = ref(null);

function useFallbackImage(event) {
  event.target.src = '/images/img_hero_1.webp';
}
</script>

<template>
  <main class="album-page">
    <div class="page-container">
      <RouterLink class="album-back" to="/galeria">
        <ArrowLeft aria-hidden="true" />
        Volver a la galería
      </RouterLink>

      <section v-if="isLoading" class="album-grid" aria-busy="true" aria-live="polite">
        <span class="visually-hidden">Cargando álbum…</span>
        <div v-for="index in 8" :key="index" class="photo-skeleton" />
      </section>

      <section v-else-if="!album" class="album-empty">
        <h1>Álbum no disponible</h1>
        <p>El álbum solicitado no existe o fue retirado.</p>
        <RouterLink to="/galeria" class="album-empty__link">Ver todos los álbumes</RouterLink>
      </section>

      <template v-else>
        <header class="album-header">
          <span v-reveal="'down'" class="album-header__category">{{ album.category }}</span>
          <h1 v-reveal="{ direction: 'up', delay: 100 }">{{ album.title }}</h1>
          <ul v-reveal="{ direction: 'up', delay: 180 }" class="album-header__meta">
            <li v-if="album.date"><CalendarDays aria-hidden="true" /> {{ album.date }}</li>
            <li><Images aria-hidden="true" /> {{ album.gallery.length }} {{ album.gallery.length === 1 ? 'foto' : 'fotos' }}</li>
          </ul>
          <p v-if="album.excerpt" v-reveal="{ direction: 'up', delay: 240 }" class="album-header__excerpt">{{ album.excerpt }}</p>
          <RouterLink v-reveal="{ direction: 'up', delay: 300 }" :to="`/noticias/${album.slug}`" class="album-header__link">
            Leer la noticia completa
            <ArrowRight aria-hidden="true" />
          </RouterLink>
        </header>

        <section class="album-grid" aria-label="Fotos del álbum">
          <button
            v-for="(photo, index) in album.gallery"
            :key="photo"
            type="button"
            class="photo"
            :aria-label="`Ampliar foto ${index + 1} de ${album.gallery.length}`"
            @click="openPhoto = index">
            <img
              :src="sizedImage(photo, 500)"
              alt=""
              :loading="index < 8 ? 'eager' : 'lazy'"
              decoding="async"
              @error="useFallbackImage">
            <span class="photo__zoom" aria-hidden="true"><ZoomIn /></span>
          </button>
        </section>

        <PhotoLightbox v-model="openPhoto" :images="album.gallery" :title="album.title" />
      </template>
    </div>
  </main>
</template>

<style scoped>
.album-page {
  background: #f7f8f4;
  color: #1f2f2b;
  font-family: 'Open Sans', Arial, sans-serif;
  padding: 3rem 0 4.5rem;
}

.album-page,
.album-page :deep(*) {
  box-sizing: border-box;
}

.page-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.album-back {
  align-items: center;
  background: #fff;
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

.album-back svg {
  height: 1rem;
  width: 1rem;
}

.album-back:hover,
.album-back:focus-visible {
  background: #07513e;
  border-color: #07513e;
  color: #fff;
}

/* ---- Header ---- */
.album-header {
  margin: 0 auto 2.5rem;
  max-width: 48rem;
  text-align: center;
}

.album-header__category {
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

.album-header h1 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.8rem, 4.2vw, 2.8rem);
  line-height: 1.15;
  margin: 0;
}

.album-header__meta {
  color: #5b6d62;
  display: flex;
  flex-wrap: wrap;
  font-size: .9rem;
  gap: .5rem 1.5rem;
  justify-content: center;
  list-style: none;
  margin: 1.1rem 0 0;
  padding: 0;
}

.album-header__meta li {
  align-items: center;
  display: inline-flex;
  gap: .4rem;
}

.album-header__meta svg {
  color: #b3821c;
  height: 1rem;
  width: 1rem;
}

.album-header__excerpt {
  color: #42554f;
  line-height: 1.7;
  margin: 1.25rem 0 0;
}

.album-header__link {
  align-items: center;
  background: #07513e;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-weight: 700;
  gap: .5rem;
  margin-top: 1.5rem;
  padding: .7rem 1.35rem;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease;
}

.album-header__link svg {
  height: 1.05rem;
  width: 1.05rem;
}

.album-header__link:hover,
.album-header__link:focus-visible {
  background: #0b6a52;
  transform: translateY(-2px);
}

/* ---- Photos ---- */
.album-grid {
  display: grid;
  gap: .75rem;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
}

.photo {
  aspect-ratio: 1 / 1;
  background: #e7ede5;
  border: 0;
  border-radius: 14px;
  cursor: zoom-in;
  overflow: hidden;
  padding: 0;
  position: relative;
}

.photo img {
  display: block;
  height: 100%;
  object-fit: cover;
  transition: transform .5s ease;
  width: 100%;
}

.photo::after {
  background: linear-gradient(180deg, transparent 50%, rgba(6, 45, 38, .55));
  content: "";
  inset: 0;
  opacity: 0;
  position: absolute;
  transition: opacity .3s ease;
}

.photo__zoom {
  align-items: center;
  background: #e5b54b;
  border-radius: 50%;
  bottom: .6rem;
  color: #123c35;
  display: flex;
  height: 2.2rem;
  justify-content: center;
  opacity: 0;
  position: absolute;
  right: .6rem;
  transform: scale(.8);
  transition: opacity .3s ease, transform .3s ease;
  width: 2.2rem;
  z-index: 1;
}

.photo__zoom svg {
  height: 1.1rem;
  width: 1.1rem;
}

.photo:hover img,
.photo:focus-visible img {
  transform: scale(1.07);
}

.photo:hover::after,
.photo:focus-visible::after,
.photo:hover .photo__zoom,
.photo:focus-visible .photo__zoom {
  opacity: 1;
  transform: none;
}

.photo:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 3px;
}

/* ---- Loading and empty ---- */
.photo-skeleton {
  animation: album-shimmer 1.4s ease-in-out infinite;
  aspect-ratio: 1 / 1;
  background: linear-gradient(90deg, #eef2ec 0%, #f7f9f5 50%, #eef2ec 100%);
  background-size: 200% 100%;
  border-radius: 14px;
}

@keyframes album-shimmer {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}

.album-empty {
  background: #fff;
  border: 1px dashed #cdd8cc;
  border-radius: 20px;
  margin: 0 auto;
  max-width: 40rem;
  padding: 2.5rem 2rem;
  text-align: center;
}

.album-empty h1 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.75rem;
  margin: 0 0 .75rem;
}

.album-empty p {
  color: #42554f;
  margin: 0;
}

.album-empty__link {
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

@media (max-width: 520px) {
  .album-grid {
    gap: .4rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .photo {
    border-radius: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .photo-skeleton {
    animation: none;
  }

  .photo img,
  .photo__zoom {
    transition: none;
  }

  .photo:hover img {
    transform: none;
  }
}
</style>
