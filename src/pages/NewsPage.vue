<script setup>
import { ArrowRight } from '@lucide/vue';
import { useNews } from '../composables/useNews';

const { error, isLoading, newsItems } = useNews();

function useFallbackImage(event) {
  event.target.src = '/images/img_hero_1.webp';
}
</script>

<template>
  <main class="news-page">
    <div class="page-container">
      <section class="news-heading">
        <p v-reveal="'down'" class="section-kicker">Noticias institucionales</p>
        <h1 v-reveal="{ direction: 'up', delay: 120 }">Actualidad de nuestra comunidad educativa</h1>
        <p v-reveal="{ direction: 'up', delay: 220 }">
          Consulta comunicados, actividades, logros y momentos significativos de la vida escolar.
        </p>
      </section>

      <div v-if="error" v-reveal="{ direction: 'up', delay: 260 }" class="news-toolbar">
        <p v-if="error">{{ error }}</p>
      </div>

      <section v-if="isLoading" class="news-empty" aria-live="polite">
        <span>Cargando noticias</span>
        <h2>Estamos consultando las publicaciones institucionales.</h2>
        <p>En unos segundos se mostrará la información disponible.</p>
      </section>

      <section v-else-if="!newsItems.length" class="news-empty">
        <span>Sin publicaciones</span>
        <h2>Aún no hay noticias para mostrar.</h2>
        <p>
          Este espacio se actualizará cuando la institución publique comunicados, actividades, galerías o novedades desde
          el formulario institucional.
        </p>
      </section>

      <section v-else class="news-grid" aria-label="Listado de noticias institucionales">
        <article
          v-for="(news, index) in newsItems"
          :key="news.slug"
          v-reveal="{ direction: index % 3 === 0 ? 'left' : index % 3 === 1 ? 'up' : 'right', delay: 100 + index * 90 }"
          class="news-card">
          <RouterLink :to="`/noticias/${news.slug}`">
            <img
              :src="news.image"
              :alt="news.imageAlt"
              :loading="index < 3 ? 'eager' : 'lazy'"
              decoding="async"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              @error="useFallbackImage" />

            <div class="news-card__content">
              <span>{{ news.category }}</span>
              <h2>{{ news.title }}</h2>
              <p>{{ news.excerpt }}</p>

              <div class="news-card__footer">
                <time>{{ news.date }}</time>
                <strong>
                  Continuar leyendo
                  <ArrowRight aria-hidden="true" />
                </strong>
              </div>
            </div>
          </RouterLink>
        </article>
      </section>
    </div>
  </main>
</template>

<style scoped>
.news-page {
  background: #fff;
  color: #1f2f2b;
  padding: 3rem 0;
}

.page-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.news-heading {
  margin: 0 auto 2.25rem;
  max-width: 52rem;
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

.news-heading h1 {
  color: #123c35;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  line-height: 1.08;
  margin: 0;
}

.news-heading p:last-child {
  line-height: 1.65;
  margin: .85rem 0 0;
}

.news-grid {
  display: grid;
  gap: 1.5rem;
}

.news-empty {
  background: #f7f8f4;
  border: 1px solid #dde6dc;
  border-radius: 8px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .1);
  margin: 0 auto;
  max-width: 42rem;
  padding: 2rem;
  text-align: center;
}

.news-empty span {
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-size: .75rem;
  font-weight: 900;
  margin-bottom: .85rem;
  padding: .3rem .75rem;
  text-transform: uppercase;
}

.news-empty h2 {
  color: #123c35;
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0 0 .75rem;
}

.news-empty p {
  color: #42554f;
  line-height: 1.65;
  margin: 0;
}

.news-toolbar {
  margin-bottom: 1.5rem;
}

.news-toolbar p {
  background: #fff0f0;
  border-left: 4px solid #b84a4a;
  border-radius: 6px;
  color: #7c2626;
  flex: 1;
  margin: 0;
  padding: .75rem 1rem;
}

.news-card {
  background: #f7f8f4;
  border: 1px solid #dde6dc;
  border-radius: 8px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .1);
  overflow: hidden;
  transition: box-shadow .25s ease, transform .25s ease;
}

.news-card:hover {
  box-shadow: 0 1rem 2.2rem rgba(31, 47, 43, .14);
  transform: translateY(-.25rem);
}

.news-card a {
  color: inherit;
  display: grid;
  height: 100%;
  text-decoration: none;
}

.news-card img {
  aspect-ratio: 16 / 10;
  display: block;
  object-fit: cover;
  width: 100%;
}

.news-card__content {
  display: flex;
  flex-direction: column;
  padding: 1.15rem;
}

.news-card__content span {
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-size: .72rem;
  font-weight: 900;
  margin-bottom: .75rem;
  padding: .25rem .65rem;
  width: fit-content;
}

.news-card h2 {
  color: #123c35;
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1.22;
  margin: 0 0 .65rem;
}

.news-card p {
  color: #42554f;
  line-height: 1.6;
  margin: 0;
}

.news-card__footer {
  align-items: center;
  border-top: 1px solid #dde6dc;
  display: flex;
  gap: .75rem;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
}

.news-card__footer time {
  color: #61736d;
  font-size: .82rem;
  font-weight: 800;
}

.news-card__footer strong {
  align-items: center;
  color: #123c35;
  display: inline-flex;
  font-size: .84rem;
  gap: .35rem;
  white-space: nowrap;
}

.news-card__footer svg {
  height: 1rem;
  width: 1rem;
}

@media (min-width: 700px) {
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
