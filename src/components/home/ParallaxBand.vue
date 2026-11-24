<script setup>
import { ArrowRight } from '@lucide/vue';

const mottoWords = ['Dios', 'Superación', 'Ciencia'];
</script>

<template>
  <section class="parallax-band" aria-labelledby="parallax-band-title">
    <div class="parallax-band__content">
      <p v-reveal="'down'" class="parallax-band__kicker">Nuestro lema</p>
      <h2 id="parallax-band-title" class="parallax-band__motto">
        <span
          v-for="(word, index) in mottoWords"
          :key="word"
          v-reveal="{ direction: 'zoom', delay: 120 + index * 160 }">{{ word }}</span>
      </h2>
      <p v-reveal="{ direction: 'up', delay: 600 }" class="parallax-band__text">
        Formamos personas íntegras mediante una educación de calidad que fortalece el desarrollo académico, científico,
        tecnológico, ético y humano, al servicio de la comunidad.
      </p>
      <RouterLink v-reveal="{ direction: 'up', delay: 720 }" to="/institucion" class="parallax-band__link">
        Conoce nuestra institución <ArrowRight aria-hidden="true" />
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.parallax-band {
  background-attachment: fixed;
  background-image:
    linear-gradient(120deg, rgba(6, 45, 38, .92), rgba(18, 60, 53, .78) 55%, rgba(120, 88, 20, .7)),
    url('/images/parallax.webp');
  background-position: center;
  background-size: cover;
  color: #fff;
  overflow: hidden;
  padding: clamp(4.5rem, 10vw, 7.5rem) 1.5rem;
  position: relative;
  text-align: center;
}

/* Soft glows to add depth over the photo. */
.parallax-band::before,
.parallax-band::after {
  border-radius: 50%;
  content: "";
  filter: blur(10px);
  pointer-events: none;
  position: absolute;
}

.parallax-band::before {
  background: radial-gradient(circle, rgba(229, 181, 75, .35), transparent 70%);
  height: 26rem;
  left: -8rem;
  top: -10rem;
  width: 26rem;
}

.parallax-band::after {
  background: radial-gradient(circle, rgba(84, 158, 192, .25), transparent 70%);
  bottom: -12rem;
  height: 30rem;
  right: -10rem;
  width: 30rem;
}

.parallax-band__content {
  margin: 0 auto;
  max-width: 52rem;
  position: relative;
  z-index: 1;
}

.parallax-band__kicker {
  color: #f3d87c;
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: .18em;
  margin: 0 0 1rem;
  text-transform: uppercase;
}

.parallax-band__motto {
  display: flex;
  flex-wrap: wrap;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.1rem, 6vw, 4rem);
  font-weight: 700;
  gap: .2em .9em;
  justify-content: center;
  line-height: 1.1;
  margin: 0 0 1.75rem;
  text-shadow: 0 4px 18px rgba(0, 0, 0, .3);
}

.parallax-band__motto span {
  display: inline-block;
  position: relative;
}

/* Gold dot between the words of the motto. */
.parallax-band__motto span + span::before {
  background: #e5b54b;
  border-radius: 50%;
  content: "";
  height: .18em;
  left: -.55em;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: .18em;
}

.parallax-band__text {
  color: rgba(255, 255, 255, .9);
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  line-height: 1.7;
  margin: 0 auto 2rem;
  max-width: 44rem;
}

.parallax-band__link {
  align-items: center;
  border: 2px solid #e5b54b;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-weight: 700;
  gap: .55rem;
  padding: .75rem 1.5rem;
  text-decoration: none;
  transition: background .2s ease, color .2s ease, transform .2s ease;
}

.parallax-band__link svg {
  height: 1.1rem;
  transition: transform .2s ease;
  width: 1.1rem;
}

.parallax-band__link:hover,
.parallax-band__link:focus-visible {
  background: #e5b54b;
  color: #123c35;
  transform: translateY(-2px);
}

.parallax-band__link:hover svg {
  transform: translateX(.2rem);
}

.parallax-band__link:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}

/* Fixed backgrounds stutter or break on touch devices. */
@media (hover: none), (max-width: 800px), (prefers-reduced-motion: reduce) {
  .parallax-band {
    background-attachment: scroll;
  }
}

@media (max-width: 520px) {
  .parallax-band {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .parallax-band__motto {
    flex-direction: column;
  }

  .parallax-band__motto span + span::before {
    display: none;
  }
}
</style>
