<script setup>
import { computed } from 'vue';
import { ArrowRight, CalendarDays } from '@lucide/vue';
import { useNews } from '../../composables/useNews';

const { isLoading, newsItems } = useNews();

const latestNews = computed(() => newsItems.value.slice(0, 3));

function useFallbackImage(event) {
  event.target.src = '/images/img_hero_1.webp';
}
</script>

<template>
  <section v-if="isLoading || latestNews.length" class="latest-news" aria-labelledby="latest-news-title">
    <div class="latest-news__container">
      <header class="latest-news__header">
        <div v-reveal="'left'">
          <p class="latest-news__kicker">Actualidad institucional</p>
          <h2 id="latest-news-title">Últimas noticias</h2>
        </div>
        <RouterLink v-reveal="'right'" to="/noticias" class="latest-news__all">
          Ver todas <ArrowRight aria-hidden="true" />
        </RouterLink>
      </header>

      <div v-if="isLoading" class="latest-news__grid" aria-live="polite" aria-busy="true">
        <div v-for="index in 3" :key="index" class="latest-news__skeleton" :class="{ 'latest-news__skeleton--main': index === 1 }">
          <span class="visually-hidden" v-if="index === 1">Cargando noticias…</span>
        </div>
      </div>

      <div v-else class="latest-news__grid" :class="{ 'latest-news__grid--few': latestNews.length < 3 }">
        <article
          v-for="(news, index) in latestNews"
          :key="news.slug"
          v-reveal="{ direction: 'up', delay: 100 + index * 120 }"
          class="latest-news__card"
          :class="{ 'latest-news__card--main': index === 0 && latestNews.length === 3 }">
          <RouterLink :to="`/noticias/${news.slug}`">
            <img
              :src="news.image"
              :alt="news.imageAlt"
              :loading="index === 0 ? 'eager' : 'lazy'"
              decoding="async"
              @error="useFallbackImage" />
            <div class="latest-news__content">
              <span class="latest-news__category">{{ news.category }}</span>
              <h3>{{ news.title }}</h3>
              <p v-if="index === 0">{{ news.excerpt }}</p>
              <time v-if="news.date"><CalendarDays aria-hidden="true" /> {{ news.date }}</time>
            </div>
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.latest-news {
  background: transparent;
  color: #1f2f2b;
  padding: 4.5rem 0 4rem;
}

.latest-news__container {
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 1.5rem;
}

.latest-news__header {
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.latest-news__kicker {
  color: #8b6418;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .08em;
  margin: 0 0 .4rem;
  text-transform: uppercase;
}

.latest-news__header h2 {
  color: #123c35;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  line-height: 1.15;
  margin: 0;
  position: relative;
  padding-bottom: .6rem;
}

.latest-news__header h2::after {
  background: #e5b54b;
  border-radius: 2px;
  bottom: 0;
  content: "";
  height: 4px;
  left: 0;
  position: absolute;
  width: 3.5rem;
}

.latest-news__all {
  align-items: center;
  border: 2px solid #07513e;
  border-radius: 999px;
  color: #07513e;
  display: inline-flex;
  font-weight: 700;
  gap: .45rem;
  padding: .55rem 1.15rem;
  text-decoration: none;
  transition: background .2s ease, color .2s ease;
}

.latest-news__all svg {
  height: 1rem;
  width: 1rem;
}

.latest-news__all:hover,
.latest-news__all:focus-visible {
  background: #07513e;
  color: #fff;
}

.latest-news__grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  grid-template-rows: repeat(2, minmax(14rem, auto));
}

.latest-news__card--main,
.latest-news__skeleton--main {
  grid-row: span 2;
}

.latest-news__grid--few {
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  grid-template-columns: none;
  grid-template-rows: minmax(22rem, auto);
}

.latest-news__card {
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(18, 60, 53, .12);
  min-height: 14rem;
  overflow: hidden;
  position: relative;
  transition: transform .3s ease, box-shadow .3s ease;
}

.latest-news__card:hover {
  box-shadow: 0 22px 44px rgba(18, 60, 53, .22);
  transform: translateY(-4px);
}

.latest-news__card a {
  color: #fff;
  display: block;
  height: 100%;
  text-decoration: none;
}

.latest-news__card a:focus-visible {
  outline: 3px solid #b3821c;
  outline-offset: -3px;
}

.latest-news__card img {
  height: 100%;
  inset: 0;
  object-fit: cover;
  position: absolute;
  transition: transform .7s ease;
  width: 100%;
}

.latest-news__card:hover img {
  transform: scale(1.06);
}

.latest-news__card a::after {
  background: linear-gradient(180deg, rgba(10, 45, 40, 0) 30%, rgba(10, 45, 40, .92) 100%);
  content: "";
  inset: 0;
  position: absolute;
}

.latest-news__content {
  bottom: 0;
  left: 0;
  padding: 1.4rem;
  position: absolute;
  right: 0;
  z-index: 1;
}

.latest-news__category {
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-block;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .04em;
  margin-bottom: .6rem;
  padding: .2rem .7rem;
  text-transform: uppercase;
}

.latest-news__content h3 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.2rem;
  line-height: 1.3;
  margin: 0 0 .5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, .3);
}

.latest-news__card--main .latest-news__content {
  padding: 2rem;
}

.latest-news__card--main h3 {
  font-size: clamp(1.4rem, 2.6vw, 2rem);
}

.latest-news__content p {
  color: rgba(255, 255, 255, .88);
  font-size: .95rem;
  line-height: 1.55;
  margin: 0 0 .75rem;
  max-width: 36rem;
}

.latest-news__content time {
  align-items: center;
  color: rgba(255, 255, 255, .8);
  display: inline-flex;
  font-size: .8rem;
  gap: .4rem;
}

.latest-news__content time svg {
  height: .9rem;
  width: .9rem;
}

.latest-news__skeleton {
  animation: shimmer 1.4s ease-in-out infinite;
  background: linear-gradient(90deg, #eef2ec 0%, #f7f9f5 50%, #eef2ec 100%);
  background-size: 200% 100%;
  border-radius: 18px;
  min-height: 14rem;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

@keyframes shimmer {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .latest-news__skeleton { animation: none; }
  .latest-news__card,
  .latest-news__card img { transition: none; }
  .latest-news__card:hover,
  .latest-news__card:hover img { transform: none; }
}

@media (max-width: 800px) {
  .latest-news {
    padding: 3.5rem 0 3rem;
  }

  .latest-news__grid,
  .latest-news__grid--few {
    grid-auto-flow: row;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: none;
  }

  .latest-news__card--main,
  .latest-news__skeleton--main {
    grid-row: auto;
    min-height: 20rem;
  }
}

@media (max-width: 520px) {
  .latest-news__container {
    padding: 0 1rem;
  }

  .latest-news__card--main .latest-news__content {
    padding: 1.4rem;
  }
}
</style>
