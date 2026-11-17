<script setup>
import { computed, ref } from 'vue';
import { BookOpen, ExternalLink, FlaskConical, GraduationCap, School } from '@lucide/vue';
import { learningLevels } from '../../constants/learningPaths';

const activeLevelId = ref(learningLevels[0].id);
const icons = {
  BookOpen,
  FlaskConical,
  GraduationCap,
  School
};

const activeLevel = computed(() => learningLevels.find((level) => level.id === activeLevelId.value) ?? learningLevels[0]);
</script>

<template>
  <section class="learning-explorer" id="niveles">
    <div class="learning-explorer__container">
      <div class="learning-explorer__header">
        <p v-reveal="'down'" class="section-kicker">Ruta de aprendizaje</p>
        <h2 v-reveal="{ direction: 'up', delay: 120 }">Contenidos por niveles y áreas</h2>
        <p v-reveal="{ direction: 'up', delay: 220 }">
          Un espacio para organizar recursos, proyectos y experiencias pedagógicas de acuerdo con la trayectoria escolar.
        </p>
      </div>

      <div v-reveal="{ direction: 'up', delay: 260 }" class="learning-explorer__panel">
        <div class="learning-explorer__tabs" role="tablist" aria-label="Niveles educativos">
          <button
            v-for="level in learningLevels"
            :key="level.id"
            type="button"
            class="learning-explorer__tab"
            :class="{ 'learning-explorer__tab--active': activeLevel.id === level.id }"
            :aria-selected="activeLevel.id === level.id"
            role="tab"
            @click="activeLevelId = level.id">
            <component :is="icons[level.icon]" class="icon-spin-hover" aria-hidden="true" />
            <span>{{ level.name }}</span>
          </button>
        </div>

        <div class="learning-explorer__content" role="tabpanel">
          <div class="learning-explorer__summary">
            <span class="learning-explorer__summary-icon">
              <component :is="icons[activeLevel.icon]" class="icon-spin-hover" aria-hidden="true" />
            </span>
            <div>
              <h3>{{ activeLevel.name }}</h3>
              <p>{{ activeLevel.summary }}</p>
              <a
                v-if="activeLevel.href"
                class="learning-explorer__summary-link"
                :href="activeLevel.href"
                target="_blank"
                rel="noopener noreferrer">
                {{ activeLevel.linkLabel || 'Abrir enlace' }}
                <ExternalLink aria-hidden="true" />
              </a>
            </div>
          </div>

          <div class="learning-explorer__areas">
            <article
              v-for="area in activeLevel.areas"
              :key="area.name"
              v-reveal="{ direction: 'right', delay: 120 }"
              class="learning-explorer__area">
              <h4>{{ area.name }}</h4>
              <p>{{ area.detail }}</p>
              <a
                v-if="area.href"
                class="learning-explorer__area-link"
                :href="area.href"
                target="_blank"
                rel="noopener noreferrer">
                {{ area.linkLabel || 'Abrir enlace' }}
                <ExternalLink aria-hidden="true" />
              </a>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.learning-explorer {
  background: #f7f8f4;
  color: #1f2f2b;
  padding: 3rem 0;
}

.learning-explorer__container {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.learning-explorer__header {
  margin: 0 auto 2rem;
  max-width: 48rem;
  text-align: center;
}

.section-kicker {
  color: #e5b54b;
  font-size: .875rem;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

.learning-explorer__header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.learning-explorer__header p:not(.section-kicker) {
  margin: .75rem 0 0;
}

.learning-explorer__panel {
  background: #fff;
  border: 1px solid #dde6dc;
  border-radius: 8px;
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .1);
  display: grid;
  overflow: hidden;
}

.learning-explorer__tabs {
  background: #123c35;
  display: grid;
}

.learning-explorer__tab {
  align-items: center;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, .15);
  color: #fff;
  display: flex;
  font-weight: 700;
  gap: .75rem;
  min-height: 4.4rem;
  padding: 1rem;
  text-align: left;
  transition: background .2s ease, color .2s ease, transform .2s ease;
}

.learning-explorer__tab:hover,
.learning-explorer__tab:focus,
.learning-explorer__tab--active {
  background: #e5b54b;
  color: #123c35;
  outline: none;
  transform: translateX(.25rem);
}

.learning-explorer__tab svg {
  height: 1.5rem;
  width: 2rem;
}

.learning-explorer__content {
  padding: 1.25rem;
}

.learning-explorer__summary {
  align-items: center;
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.learning-explorer__summary-icon {
  align-items: center;
  background: #e7f0e8;
  border-radius: 999px;
  color: #123c35;
  display: flex;
  flex: 0 0 4rem;
  height: 4rem;
  justify-content: center;
  width: 4rem;
}

.learning-explorer__summary-icon svg {
  height: 2rem;
  width: 2rem;
}

.learning-explorer__summary h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 .25rem;
}

.learning-explorer__summary p {
  margin: 0;
}

.learning-explorer__summary-link,
.learning-explorer__area-link {
  align-items: center;
  color: #123c35;
  display: inline-flex;
  font-weight: 700;
  gap: .4rem;
  margin-top: .85rem;
  text-decoration: none;
}

.learning-explorer__summary-link {
  background: #e5b54b;
  border-radius: 6px;
  padding: .65rem .85rem;
}

.learning-explorer__summary-link:hover,
.learning-explorer__summary-link:focus,
.learning-explorer__area-link:hover,
.learning-explorer__area-link:focus {
  color: #0f2f29;
  text-decoration: underline;
}

.learning-explorer__summary-link svg,
.learning-explorer__area-link svg {
  height: 1rem;
  width: 1rem;
}

.learning-explorer__areas {
  display: grid;
  gap: 1rem;
}

.learning-explorer__area {
  background: #f7f8f4;
  border-left: 4px solid #e5b54b;
  border-radius: 6px;
  padding: 1rem;
  transition: box-shadow .25s ease, transform .25s ease;
}

.learning-explorer__area:hover {
  box-shadow: 0 .7rem 1.5rem rgba(31, 47, 43, .12);
  transform: translateY(-.25rem);
}

.learning-explorer__area h4 {
  font-weight: 700;
  margin: 0 0 .5rem;
}

.learning-explorer__area p {
  margin: 0;
}

@media (min-width: 768px) {
  .learning-explorer__header h2 {
    font-size: 1.875rem;
  }

  .learning-explorer__panel {
    grid-template-columns: 18rem minmax(0, 1fr);
  }

  .learning-explorer__content {
    padding: 2rem;
  }

  .learning-explorer__areas {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
