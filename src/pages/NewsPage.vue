<script setup>
import { computed, ref } from 'vue';
import { ArrowRight, CalendarDays, Newspaper, Search, UserRound, X } from '@lucide/vue';
import { useNews } from '../composables/useNews';

const { error, isLoading, newsItems } = useNews();

const activeCategory = ref('Todas');
const searchText = ref('');

const categories = computed(() => ['Todas', ...new Set(newsItems.value.map((news) => news.category))]);
const showFilters = computed(() => categories.value.length > 2);
const showSearch = computed(() => newsItems.value.length > 3);

function normalizeText(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

const filteredNews = computed(() => {
  const query = normalizeText(searchText.value.trim());

  return newsItems.value.filter((news) => {
    const matchesCategory = activeCategory.value === 'Todas' || news.category === activeCategory.value;
    const matchesSearch = !query || normalizeText(`${news.title} ${news.excerpt}`).includes(query);
    return matchesCategory && matchesSearch;
  });
});

// The newest item is highlighted only when the full list is shown.
const isFiltering = computed(() => activeCategory.value !== 'Todas' || searchText.value.trim() !== '');
const featuredNews = computed(() => (isFiltering.value ? null : filteredNews.value[0] ?? null));
const gridNews = computed(() => (featuredNews.value ? filteredNews.value.slice(1) : filteredNews.value));

function resetFilters() {
  activeCategory.value = 'Todas';
  searchText.value = '';
}

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

      <p v-if="error" class="news-error" role="status">{{ error }}</p>

      <div v-if="!isLoading && (showFilters || showSearch)" v-reveal="'up'" class="news-tools">
        <div v-if="showFilters" class="news-filters" role="group" aria-label="Filtrar noticias por categoría">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="{ 'news-filters__button--active': activeCategory === category }"
            :aria-pressed="activeCategory === category"
            @click="activeCategory = category">
            {{ category }}
          </button>
        </div>

        <label v-if="showSearch" class="news-search">
          <Search aria-hidden="true" />
          <span class="visually-hidden">Buscar noticias</span>
          <input v-model="searchText" type="search" placeholder="Buscar noticias…" />
          <button v-if="searchText" type="button" aria-label="Limpiar búsqueda" @click="searchText = ''">
            <X aria-hidden="true" />
          </button>
        </label>
      </div>

      <section v-if="isLoading" class="news-loading" aria-live="polite" aria-busy="true">
        <span class="visually-hidden">Cargando noticias…</span>
        <div class="news-skeleton news-skeleton--featured" />
        <div class="news-grid">
          <div v-for="index in 3" :key="index" class="news-skeleton" />
        </div>
      </section>

      <section v-else-if="!newsItems.length" class="news-empty">
        <span class="news-empty__icon"><Newspaper aria-hidden="true" /></span>
        <h2>Aún no hay noticias para mostrar</h2>
        <p>
          Este espacio se actualizará cuando la institución publique comunicados, actividades, galerías o novedades desde
          el formulario institucional.
        </p>
      </section>

      <section v-else-if="!filteredNews.length" class="news-empty">
        <span class="news-empty__icon"><Search aria-hidden="true" /></span>
        <h2>No encontramos noticias con ese criterio</h2>
        <p>Prueba con otra palabra o revisa todas las publicaciones.</p>
        <button type="button" class="news-empty__reset" @click="resetFilters">Ver todas las noticias</button>
      </section>

      <template v-else>
        <article v-if="featuredNews" v-reveal="'up'" class="news-featured">
          <RouterLink :to="`/noticias/${featuredNews.slug}`">
            <div class="news-featured__media">
              <img
                :src="featuredNews.image"
                :alt="featuredNews.imageAlt"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                @error="useFallbackImage" />
              <span class="news-featured__badge">Más reciente</span>
            </div>
            <div class="news-featured__content">
              <span class="news-category">{{ featuredNews.category }}</span>
              <h2>{{ featuredNews.title }}</h2>
              <p>{{ featuredNews.excerpt }}</p>
              <ul class="news-meta">
                <li v-if="featuredNews.date"><CalendarDays aria-hidden="true" /> <time>{{ featuredNews.date }}</time></li>
                <li v-if="featuredNews.author"><UserRound aria-hidden="true" /> {{ featuredNews.author }}</li>
              </ul>
              <span class="news-featured__cta">
                Leer noticia completa <ArrowRight aria-hidden="true" />
              </span>
            </div>
          </RouterLink>
        </article>

        <section v-if="gridNews.length" class="news-grid" aria-label="Listado de noticias institucionales">
          <article
            v-for="(news, index) in gridNews"
            :key="news.slug"
            v-reveal="{ direction: 'up', delay: 60 + (index % 3) * 90 }"
            class="news-card">
            <RouterLink :to="`/noticias/${news.slug}`">
              <div class="news-card__media">
                <img
                  :src="news.image"
                  :alt="news.imageAlt"
                  :loading="index < 3 ? 'eager' : 'lazy'"
                  decoding="async"
                  @error="useFallbackImage" />
                <span class="news-category news-category--floating">{{ news.category }}</span>
              </div>

              <div class="news-card__content">
                <h2>{{ news.title }}</h2>
                <p>{{ news.excerpt }}</p>

                <div class="news-card__footer">
                  <time v-if="news.date"><CalendarDays aria-hidden="true" /> {{ news.date }}</time>
                  <strong>
                    Leer más
                    <ArrowRight aria-hidden="true" />
                  </strong>
                </div>
              </div>
            </RouterLink>
          </article>
        </section>
      </template>
    </div>
  </main>
</template>

<style scoped>
.news-page {
  background: #fff;
  color: #1f2f2b;
  font-family: 'Open Sans', Arial, sans-serif;
  padding: 3.5rem 0 4.5rem;
}

.page-container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

/* ---- Heading ---- */
.news-heading {
  margin: 0 auto 2.5rem;
  max-width: 52rem;
  text-align: center;
}

.section-kicker {
  color: #8b6418;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .08em;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

.news-heading h1 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.12;
  margin: 0;
  padding-bottom: .8rem;
  position: relative;
}

.news-heading h1::after {
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

.news-heading > p:last-child {
  color: #42554f;
  line-height: 1.65;
  margin: 1rem 0 0;
}

.news-error {
  background: #fff0f0;
  border-left: 4px solid #b84a4a;
  border-radius: 8px;
  color: #7c2626;
  margin: 0 0 1.5rem;
  padding: .75rem 1rem;
}

/* ---- Tools: filters and search ---- */
.news-tools {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.news-filters {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.news-filters button {
  background: #fff;
  border: 1px solid #dde6dc;
  border-radius: 999px;
  color: #1f2f2b;
  cursor: pointer;
  font-family: inherit;
  font-size: .85rem;
  font-weight: 700;
  padding: .45rem 1rem;
  transition: background .2s ease, border-color .2s ease, color .2s ease;
}

.news-filters button:hover {
  border-color: #07513e;
}

.news-filters .news-filters__button--active {
  background: #07513e;
  border-color: #07513e;
  color: #fff;
}

.news-filters button:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: 2px;
}

.news-search {
  align-items: center;
  background: #f7f8f4;
  border: 1px solid #dde6dc;
  border-radius: 999px;
  display: flex;
  flex: 0 1 20rem;
  gap: .5rem;
  margin-left: auto;
  padding: 0 .4rem 0 1rem;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.news-search:focus-within {
  border-color: #07513e;
  box-shadow: 0 0 0 3px rgba(7, 81, 62, .15);
}

.news-search > svg {
  color: #5b6d62;
  flex-shrink: 0;
  height: 1.1rem;
  width: 1.1rem;
}

.news-search input {
  background: transparent;
  border: 0;
  color: #1f2f2b;
  flex: 1;
  font: inherit;
  min-width: 0;
  outline: none;
  padding: .65rem 0;
}

.news-search button {
  align-items: center;
  background: #e3e9e1;
  border: 0;
  border-radius: 50%;
  color: #42554f;
  cursor: pointer;
  display: flex;
  height: 1.8rem;
  justify-content: center;
  width: 1.8rem;
}

.news-search button svg {
  height: .9rem;
  width: .9rem;
}

/* ---- Shared bits ---- */
.news-category {
  background: #fbf3dc;
  border-radius: 999px;
  color: #7a5510;
  display: inline-flex;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .04em;
  padding: .25rem .75rem;
  text-transform: uppercase;
  width: fit-content;
}

.news-category--floating {
  background: #e5b54b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .2);
  color: #123c35;
  left: 1rem;
  position: absolute;
  top: 1rem;
}

.news-meta {
  color: #5b6d62;
  display: flex;
  flex-wrap: wrap;
  font-size: .85rem;
  gap: .5rem 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.news-meta li {
  align-items: center;
  display: inline-flex;
  gap: .4rem;
}

.news-meta svg {
  color: #b3821c;
  height: 1rem;
  width: 1rem;
}

/* ---- Featured (newest) ---- */
.news-featured {
  border: 1px solid #e3e9e1;
  border-radius: 22px;
  box-shadow: 0 18px 44px rgba(18, 60, 53, .12);
  margin-bottom: 2.5rem;
  overflow: hidden;
  transition: box-shadow .3s ease, transform .3s ease;
}

.news-featured:hover {
  box-shadow: 0 26px 56px rgba(18, 60, 53, .2);
  transform: translateY(-4px);
}

.news-featured a {
  color: inherit;
  display: grid;
  text-decoration: none;
}

.news-featured a:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: -3px;
}

.news-featured__media {
  min-height: 16rem;
  overflow: hidden;
  position: relative;
}

.news-featured__media img {
  height: 100%;
  inset: 0;
  object-fit: cover;
  position: absolute;
  transition: transform .7s ease;
  width: 100%;
}

.news-featured:hover .news-featured__media img {
  transform: scale(1.05);
}

.news-featured__badge {
  background: #07513e;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .25);
  color: #fff;
  font-size: .75rem;
  font-weight: 700;
  left: 1.25rem;
  letter-spacing: .04em;
  padding: .35rem .85rem;
  position: absolute;
  text-transform: uppercase;
  top: 1.25rem;
}

.news-featured__content {
  background:
    radial-gradient(circle at 100% 0%, rgba(229, 181, 75, .14), transparent 45%),
    #fff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
}

.news-featured h2 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.news-featured p {
  color: #42554f;
  font-size: 1.02rem;
  line-height: 1.7;
  margin: 0;
}

.news-featured__cta {
  align-items: center;
  align-self: flex-start;
  background: #07513e;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-weight: 700;
  gap: .5rem;
  margin-top: .5rem;
  padding: .75rem 1.4rem;
  transition: background .2s ease;
}

.news-featured__cta svg {
  height: 1.1rem;
  transition: transform .2s ease;
  width: 1.1rem;
}

.news-featured:hover .news-featured__cta {
  background: #0b6a52;
}

.news-featured:hover .news-featured__cta svg {
  transform: translateX(.25rem);
}

/* ---- Grid cards ---- */
.news-grid {
  display: grid;
  gap: 1.5rem;
}

.news-card {
  background: #fff;
  border: 1px solid #e3e9e1;
  border-radius: 18px;
  box-shadow: 0 14px 34px rgba(18, 60, 53, .08);
  overflow: hidden;
  transition: box-shadow .3s ease, transform .3s ease;
}

.news-card:hover {
  box-shadow: 0 22px 44px rgba(18, 60, 53, .16);
  transform: translateY(-5px);
}

.news-card a {
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
}

.news-card a:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: -3px;
}

.news-card__media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  position: relative;
}

.news-card__media img {
  display: block;
  height: 100%;
  object-fit: cover;
  transition: transform .6s ease;
  width: 100%;
}

.news-card:hover .news-card__media img {
  transform: scale(1.06);
}

.news-card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.35rem 1.4rem 1.25rem;
}

.news-card h2 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.28;
  margin: 0 0 .65rem;
}

.news-card p {
  color: #42554f;
  font-size: .93rem;
  line-height: 1.6;
  margin: 0;
}

.news-card__footer {
  align-items: center;
  border-top: 1px solid #e3e9e1;
  display: flex;
  gap: .75rem;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
}

.news-card__content p + .news-card__footer {
  margin-top: 1.25rem;
}

.news-card__footer time {
  align-items: center;
  color: #5b6d62;
  display: inline-flex;
  font-size: .82rem;
  gap: .35rem;
}

.news-card__footer time svg {
  color: #b3821c;
}

.news-card__footer strong {
  align-items: center;
  color: #07513e;
  display: inline-flex;
  font-size: .85rem;
  gap: .35rem;
  white-space: nowrap;
}

.news-card__footer svg {
  height: 1rem;
  transition: transform .2s ease;
  width: 1rem;
}

.news-card:hover .news-card__footer strong svg {
  transform: translateX(.25rem);
}

/* ---- Loading and empty states ---- */
.news-skeleton {
  animation: news-shimmer 1.4s ease-in-out infinite;
  background: linear-gradient(90deg, #eef2ec 0%, #f7f9f5 50%, #eef2ec 100%);
  background-size: 200% 100%;
  border-radius: 18px;
  min-height: 20rem;
}

.news-skeleton--featured {
  margin-bottom: 2.5rem;
  min-height: 22rem;
}

@keyframes news-shimmer {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}

.news-empty {
  background: #f7f8f4;
  border: 1px dashed #cdd8cc;
  border-radius: 20px;
  margin: 0 auto;
  max-width: 42rem;
  padding: 2.5rem 2rem;
  text-align: center;
}

.news-empty__icon {
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

.news-empty__icon svg {
  height: 1.9rem;
  width: 1.9rem;
}

.news-empty h2 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.5rem;
  margin: 0 0 .75rem;
}

.news-empty p {
  color: #42554f;
  line-height: 1.65;
  margin: 0;
}

.news-empty__reset {
  background: #07513e;
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  margin-top: 1.25rem;
  padding: .7rem 1.3rem;
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
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .news-featured a {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  }

  .news-featured__media {
    min-height: 24rem;
  }

  .news-featured__content {
    justify-content: center;
    padding: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .news-skeleton {
    animation: none;
  }

  .news-featured,
  .news-featured__media img,
  .news-card,
  .news-card__media img {
    transition: none;
  }

  .news-featured:hover,
  .news-featured:hover .news-featured__media img,
  .news-card:hover,
  .news-card:hover .news-card__media img {
    transform: none;
  }
}

@media (max-width: 600px) {
  .news-search {
    flex-basis: 100%;
    margin-left: 0;
  }

  .news-featured__content {
    padding: 1.5rem;
  }
}
</style>
