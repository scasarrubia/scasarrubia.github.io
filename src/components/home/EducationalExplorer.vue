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

// Accent color per level: background, soft tint and readable text on the accent.
const levelThemes = {
  preescolar: { accent: '#e5b54b', soft: '#fbf3dc', ink: '#123c35' },
  primaria: { accent: '#3f9b6a', soft: '#e3f3e9', ink: '#fff' },
  secundaria: { accent: '#2f7fa6', soft: '#e1eff6', ink: '#fff' },
  media: { accent: '#8a5aa8', soft: '#f1e8f6', ink: '#fff' }
};

const activeLevel = computed(() => learningLevels.find((level) => level.id === activeLevelId.value) ?? learningLevels[0]);

function themeStyle(levelId) {
  const theme = levelThemes[levelId] ?? levelThemes.preescolar;

  return {
    '--level-accent': theme.accent,
    '--level-soft': theme.soft,
    '--level-ink': theme.ink
  };
}
</script>

<template>
  <section class="learning-explorer" id="niveles">
    <div class="learning-explorer__container">
      <div class="learning-explorer__header">
        <p class="section-kicker">Ruta de aprendizaje</p>
        <h2>Contenidos por niveles y áreas</h2>
        <p>
          Un espacio para organizar recursos, proyectos y experiencias pedagógicas de acuerdo con la trayectoria escolar.
        </p>
      </div>

      <div v-reveal="'up'" class="learning-explorer__panel" :style="themeStyle(activeLevel.id)">
        <div class="learning-explorer__tabs" role="tablist" aria-label="Niveles educativos">
          <button
            v-for="level in learningLevels"
            :key="level.id"
            type="button"
            class="learning-explorer__tab"
            :class="{ 'learning-explorer__tab--active': activeLevel.id === level.id }"
            :style="themeStyle(level.id)"
            :aria-selected="activeLevel.id === level.id"
            role="tab"
            @click="activeLevelId = level.id">
            <span class="learning-explorer__tab-dot" aria-hidden="true" />
            <component :is="icons[level.icon]" class="icon-spin-hover" aria-hidden="true" />
            <span>{{ level.name }}</span>
          </button>
        </div>

        <Transition name="level-swap" mode="out-in">
        <div :key="activeLevel.id" class="learning-explorer__content" role="tabpanel">
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
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.learning-explorer {
  background: #fff;
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
/* Home readability and responsive layout. */
.learning-explorer { padding: 2.75rem 0 2rem; font-family: 'Open Sans', Arial, sans-serif; font-size: 1rem; line-height: 1.65; }
.learning-explorer__container { max-width: 1200px; padding: 0 1.5rem; }
.learning-explorer__header { max-width: 58rem; margin-bottom: 1.75rem; }
.section-kicker { color: #8b6418; font-size: .75rem; letter-spacing: .08em; }
.learning-explorer__header h2 { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(1.65rem, 3vw, 2.4rem); line-height: 1.2; color: #123c35; }
.learning-explorer__panel { border-radius: 14px; box-shadow: 0 8px 24px #123c350a; }
.learning-explorer__tab { font-size: 1rem; }
.learning-explorer__area h4 { font-family: Georgia, 'Times New Roman', serif; font-size: 1.05rem; line-height: 1.35; }
.learning-explorer__area { font-size: .95rem; padding: 1rem; }
.learning-explorer .icon-spin-hover { transition: none; transform: none; }
@media (min-width: 768px) {
  .learning-explorer__panel { grid-template-columns: 15rem minmax(0,1fr); }
  .learning-explorer__content { padding: 1.5rem; }
}
@media (min-width: 768px) and (max-width: 1050px) {
  .learning-explorer__areas { grid-template-columns: 1fr; }
}
/* Per-level color theme. */
.learning-explorer__header h2 { position: relative; padding-bottom: .7rem; }
.learning-explorer__header h2::after { content: ""; position: absolute; left: 50%; bottom: 0; width: 3.5rem; height: 4px; border-radius: 2px; background: #e5b54b; transform: translateX(-50%); }
.learning-explorer__panel { border-top: 4px solid var(--level-accent); transition: border-color .35s ease; box-shadow: 0 16px 40px rgba(18, 60, 53, .1); }
.learning-explorer__tab { cursor: pointer; position: relative; }
.learning-explorer__tab:hover,
.learning-explorer__tab:focus { background: rgba(255, 255, 255, .08); color: #fff; transform: translateX(.25rem); }
.learning-explorer__tab:focus-visible { outline: 3px solid #f3d87c; outline-offset: -3px; }
.learning-explorer__tab--active,
.learning-explorer__tab--active:hover,
.learning-explorer__tab--active:focus { background: var(--level-accent); color: var(--level-ink); transform: none; }
.learning-explorer__tab-dot { width: .55rem; height: .55rem; border-radius: 50%; background: var(--level-accent); flex-shrink: 0; box-shadow: 0 0 0 3px rgba(255, 255, 255, .12); }
.learning-explorer__tab--active .learning-explorer__tab-dot { background: var(--level-ink); box-shadow: none; }
.learning-explorer__summary-icon { background: var(--level-soft); color: var(--level-accent); transition: background .35s ease, color .35s ease; }
.learning-explorer__summary h3 { color: #123c35; font-family: Georgia, 'Times New Roman', serif; font-size: 1.4rem; }
.learning-explorer__summary-link { background: var(--level-accent); color: var(--level-ink); }
.learning-explorer__area { background: var(--level-soft); border-left-color: var(--level-accent); border-radius: 10px; }
.learning-explorer__area:hover { box-shadow: 0 12px 26px rgba(18, 60, 53, .12); }
.level-swap-enter-active,
.level-swap-leave-active { transition: opacity .22s ease, transform .22s ease; }
.level-swap-enter-from { opacity: 0; transform: translateY(.6rem); }
.level-swap-leave-to { opacity: 0; transform: translateY(-.4rem); }
@media (prefers-reduced-motion: reduce) {
  .level-swap-enter-active,
  .level-swap-leave-active { transition: none; }
  .learning-explorer__tab:hover,
  .learning-explorer__tab:focus { transform: none; }
}
@media (max-width: 600px) {
  .learning-explorer__container { padding: 0 1rem; }
  .learning-explorer__tabs { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .learning-explorer__tab { padding: .75rem; font-size: .85rem; gap: .4rem; }
  .learning-explorer__tab svg { width: 1.35rem; flex-shrink: 0; }
  .learning-explorer__summary { align-items: flex-start; }
}
</style>
