<script setup>
import { ExternalLink, GraduationCap, Leaf, MonitorCheck, RefreshCw, Users } from '@lucide/vue';
import EducationalExplorer from '../components/home/EducationalExplorer.vue';
import SchoolCalendar from '../components/home/SchoolCalendar.vue';
import { useWeeklyAgenda } from '../composables/useWeeklyAgenda';

const { agenda: weeklyAgenda, error: weeklyAgendaError, isLoading: isWeeklyAgendaLoading, loadAgenda, metadata: weeklyAgendaMetadata } = useWeeklyAgenda();

const proposalCards = [
  {
    title: 'Excelencia académica',
    description: 'Procesos de aprendizaje orientados al pensamiento crítico, la curiosidad y la superación personal.',
    icon: GraduationCap,
    reveal: { direction: 'left', delay: 80 }
  },
  {
    title: 'Convivencia y valores',
    description: 'Acompañamiento para crecer con respeto, responsabilidad, solidaridad y sentido de pertenencia.',
    icon: Users,
    reveal: { direction: 'up', delay: 200 }
  },
  {
    title: 'Territorio y comunidad',
    description: 'Proyectos que conectan la vida escolar con las necesidades, saberes y oportunidades del municipio.',
    icon: Leaf,
    reveal: { direction: 'right', delay: 320 }
  }
];

const agendaColumns = ['Fecha', 'Actividad', 'Responsables', 'Participantes', 'Lugar'];

function getAgendaActivityParts(activity) {
  const text = String(activity || '').trim();
  const timeMatch = text.match(/(\b\d{1,2}:\d{2}\s*(?:a\.?\s*m\.?|p\.?\s*m\.?|am|pm)?)/i);

  if (!timeMatch) {
    return {
      title: text,
      time: ''
    };
  }

  return {
    title: text.replace(timeMatch[0], '').replace(/\s{2,}/g, ' ').trim(),
    time: timeMatch[0].replace(/\s+/g, ' ').trim()
  };
}

const newsItems = [
  {
    title: 'Encuentros pedagógicos',
    image: '/images/img_hero.webp',
    alt: 'Encuentro de la comunidad educativa',
    reveal: { direction: 'left', delay: 80 }
  },
  {
    title: 'Proyectos de aula',
    image: '/images/img_hero.webp',
    alt: 'Proyecto desarrollado por estudiantes',
    reveal: { direction: 'up', delay: 180 }
  },
  {
    title: 'Creatividad estudiantil',
    image: '/images/img_hero.webp',
    alt: 'Proyecto creativo estudiantil',
    reveal: { direction: 'up', delay: 280 }
  },
  {
    title: 'Ciencia escolar',
    image: '/images/img_hero.webp',
    alt: 'Proyecto de ciencia escolar',
    reveal: { direction: 'right', delay: 380 }
  }
];
</script>

<template>
  <EducationalExplorer />

  <section class="educacity-access" aria-labelledby="educacity-access-title">
    <div class="educacity-access__container">
      <div v-reveal="'left'" class="educacity-access__content">
        <span class="educacity-access__icon">
          <MonitorCheck class="icon-spin-hover" aria-hidden="true" />
        </span>
        <div>
          <p class="section-kicker">Plataforma académica</p>
          <h2 id="educacity-access-title">Acceso a Educacity</h2>
          <p>
            Consulta actividades, tareas, calificaciones y procesos académicos institucionales.
          </p>
        </div>
      </div>

      <a
        v-reveal="{ direction: 'right', delay: 160 }"
        class="educacity-access__button"
        href="https://padreroberto.educa.city/"
        target="_blank"
        rel="noopener noreferrer">
        Ingresar a Educacity
        <ExternalLink aria-hidden="true" />
      </a>
    </div>
  </section>

  <div class="home-shell">
    <main class="home-main">
      <section class="home-section weekly-agenda" aria-labelledby="agenda-semanal-title">
        <div class="section-header">
          <p v-reveal="'down'" class="section-kicker">Agenda semanal</p>
          <h2 id="agenda-semanal-title" v-reveal="{ direction: 'up', delay: 120 }" class="section-title">
            Actividades institucionales de la semana
          </h2>
          <p v-reveal="{ direction: 'up', delay: 220 }" class="section-lead">
            Programación organizada para directivos, docentes, estudiantes, familias y comunidad educativa.
          </p>
        </div>

        <div v-reveal="{ direction: 'up', delay: 260 }" class="weekly-agenda__toolbar">
          <dl class="weekly-agenda__metadata" aria-label="Datos de la agenda semanal">
            <div v-if="weeklyAgendaMetadata.week">
              <dt>Semana</dt>
              <dd>{{ weeklyAgendaMetadata.week }}</dd>
            </div>
            <div v-if="weeklyAgendaMetadata.period">
              <dt>Periodo</dt>
              <dd>{{ weeklyAgendaMetadata.period }}</dd>
            </div>
            <div v-if="weeklyAgendaMetadata.month">
              <dt>Mes</dt>
              <dd>{{ weeklyAgendaMetadata.month }}</dd>
            </div>
          </dl>

          <button type="button" :disabled="isWeeklyAgendaLoading" @click="loadAgenda">
            <RefreshCw aria-hidden="true" />
            {{ isWeeklyAgendaLoading ? 'Actualizando...' : 'Actualizar' }}
          </button>
        </div>

        <p v-if="weeklyAgendaError" class="weekly-agenda__error">
          {{ weeklyAgendaError }} Se muestra la agenda local de respaldo.
        </p>

        <div v-reveal="{ direction: 'up', delay: 300 }" class="weekly-agenda__table-wrap">
          <table class="weekly-agenda__table">
            <thead>
              <tr>
                <th v-for="column in agendaColumns" :key="column" scope="col">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="day in weeklyAgenda" :key="day.date">
                <tr v-for="(item, index) in day.activities" :key="`${day.date}-${item.activity}`">
                  <th v-if="index === 0" :rowspan="day.activities.length" scope="rowgroup" class="weekly-agenda__date">
                    {{ day.date }}
                  </th>
                  <td class="weekly-agenda__activity">
                    <span v-if="getAgendaActivityParts(item.activity).time" class="weekly-agenda__time">
                      {{ getAgendaActivityParts(item.activity).time }}
                    </span>
                    <strong>{{ getAgendaActivityParts(item.activity).title }}</strong>
                  </td>
                  <td>{{ item.responsible }}</td>
                  <td>{{ item.participants }}</td>
                  <td>{{ item.place }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="weekly-agenda__cards">
          <article v-for="day in weeklyAgenda" :key="day.date" v-reveal="{ direction: 'up', delay: 160 }"
            class="weekly-agenda__day-card">
            <h3>{{ day.date }}</h3>
            <div v-for="item in day.activities" :key="item.activity" class="weekly-agenda__activity-card">
              <h4>
                <span v-if="getAgendaActivityParts(item.activity).time" class="weekly-agenda__time">
                  {{ getAgendaActivityParts(item.activity).time }}
                </span>
                {{ getAgendaActivityParts(item.activity).title }}
              </h4>
              <dl>
                <div>
                  <dt>Responsables</dt>
                  <dd>{{ item.responsible }}</dd>
                </div>
                <div>
                  <dt>Participantes</dt>
                  <dd>{{ item.participants }}</dd>
                </div>
                <div>
                  <dt>Lugar</dt>
                  <dd>{{ item.place }}</dd>
                </div>
              </dl>
            </div>
          </article>
        </div>
      </section>


    </main>

    <aside class="home-sidebar" aria-label="Calendario escolar">
      <SchoolCalendar />
    </aside>
  </div>
</template>

<style scoped>
.home-container,
.home-shell {
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 15px;
}

.home-shell {
  display: grid;
  gap: 1.25rem;
}

.home-main {
  min-width: 0;
}

.home-section,
.news-section {
  padding: 2rem 0;
}

.educacity-access {
  background: #f7f8f4;
  padding: 0 1rem 2rem;
}

.educacity-access__container {
  align-items: center;
  background:
    linear-gradient(135deg, rgba(18, 60, 53, .98), rgba(18, 60, 53, .9)),
    radial-gradient(circle at top right, rgba(229, 181, 75, .28), transparent 20rem);
  border-radius: 8px;
  box-shadow: 0 1rem 2.4rem rgba(31, 47, 43, .16);
  color: #fff;
  display: grid;
  gap: 1.25rem;
  margin: 0 auto;
  max-width: 1140px;
  overflow: hidden;
  padding: 1.25rem;
  position: relative;
}

.educacity-access__container::after {
  background: rgba(255, 255, 255, .08);
  content: "";
  height: 9rem;
  position: absolute;
  right: -3rem;
  top: -3rem;
  transform: rotate(22deg);
  width: 12rem;
}

.educacity-access__content {
  align-items: center;
  display: flex;
  gap: 1rem;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.educacity-access__icon {
  align-items: center;
  background: #e5b54b;
  border-radius: 8px;
  color: #123c35;
  display: flex;
  flex: 0 0 4.25rem;
  height: 4.25rem;
  justify-content: center;
  width: 4.25rem;
}

.educacity-access__icon svg {
  height: 2.2rem;
  width: 2.2rem;
}

.educacity-access h2 {
  font-size: clamp(1.45rem, 4vw, 2.15rem);
  font-weight: 800;
  line-height: 1.12;
  margin: 0;
}

.educacity-access p:not(.section-kicker) {
  color: rgba(255, 255, 255, .86);
  line-height: 1.55;
  margin: .4rem 0 0;
}

.educacity-access__button {
  align-items: center;
  background: #e5b54b;
  border: 1px solid #e5b54b;
  border-radius: 6px;
  color: #123c35;
  display: inline-flex;
  font-weight: 900;
  gap: .45rem;
  justify-content: center;
  min-height: 3rem;
  padding: 0 1rem;
  position: relative;
  text-decoration: none;
  transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease;
  z-index: 1;
}

.educacity-access__button:hover,
.educacity-access__button:focus {
  background: #fff;
  border-color: #fff;
  color: #123c35;
  transform: translateY(-.12rem);
}

.educacity-access__button svg {
  height: 1rem;
  width: 1rem;
}

.educational-proposal {
  background: #fff;
}

.section-header {
  margin: 0 auto;
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

.section-title {
  color: #1f2f2b;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  text-align: center;
}

.section-lead {
  line-height: 1.6;
  margin: .75rem auto 0;
  max-width: 48rem;
}

.proposal-grid,
.news-grid {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.weekly-agenda {
  background:
    linear-gradient(135deg, rgba(247, 248, 244, .94), rgba(231, 240, 232, .9)),
    radial-gradient(circle at top left, rgba(229, 181, 75, .28), transparent 34%);
  color: #1f2f2b;
}

.weekly-agenda__table-wrap {
  background:
    linear-gradient(135deg, rgba(18, 60, 53, .08), transparent 24rem),
    #fff;
  border: 1px solid rgba(221, 230, 220, .9);
  border-radius: 8px;
  box-shadow: 0 1rem 2.6rem rgba(31, 47, 43, .14);
  margin-top: 2rem;
  max-height: 34rem;
  overflow-x: auto;
  overflow-y: auto;
  padding: .75rem;
  scrollbar-color: #123c35 #e7f0e8;
}

.weekly-agenda__toolbar {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 1.25rem;
}

.weekly-agenda__metadata {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  margin: 0;
}

.weekly-agenda__metadata div {
  align-items: center;
  background: #fff;
  border: 1px solid #dde6dc;
  border-radius: 999px;
  display: inline-flex;
  gap: .35rem;
  padding: .35rem .7rem;
}

.weekly-agenda__metadata dt {
  color: #42554f;
  font-size: .72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.weekly-agenda__metadata dd {
  color: #123c35;
  font-size: .9rem;
  font-weight: 800;
  margin: 0;
}

.weekly-agenda__toolbar button {
  align-items: center;
  background: #e5b54b;
  border: 0;
  border-radius: 6px;
  color: #123c35;
  display: inline-flex;
  font-size: .85rem;
  font-weight: 800;
  gap: .45rem;
  padding: .5rem .75rem;
  transition: background .2s ease, color .2s ease, opacity .2s ease;
}

.weekly-agenda__toolbar button:hover,
.weekly-agenda__toolbar button:focus {
  background: #123c35;
  color: #fff;
}

.weekly-agenda__toolbar button:disabled {
  opacity: .7;
}

.weekly-agenda__toolbar svg {
  height: 1rem;
  width: 1rem;
}

.weekly-agenda__error {
  background: #fff0f0;
  border-left: 4px solid #b84a4a;
  border-radius: 6px;
  color: #7c2626;
  margin: 1rem 0 0;
  padding: .85rem 1rem;
}

.weekly-agenda__table {
  border-collapse: separate;
  border-spacing: 0 .65rem;
  width: 100%;
}

.weekly-agenda__table th,
.weekly-agenda__table td {
  background: #fff;
  border-bottom: 1px solid #dde6dc;
  font-size: .82rem;
  line-height: 1.45;
  padding: .9rem .75rem;
  text-align: left;
  vertical-align: top;
  white-space: pre-line;
}

.weekly-agenda__table thead th {
  background: #123c35;
  border-bottom: 0;
  color: #fff;
  font-size: .74rem;
  font-weight: 800;
  letter-spacing: 0;
  position: sticky;
  top: .75rem;
  z-index: 2;
  text-align: center;
  text-transform: uppercase;
}

.weekly-agenda__table thead th:first-child {
  border-radius: 8px 0 0 8px;
}

.weekly-agenda__table thead th:last-child {
  border-radius: 0 8px 8px 0;
}

.weekly-agenda__table tbody tr {
  filter: drop-shadow(0 .5rem .9rem rgba(31, 47, 43, .08));
}

.weekly-agenda__table tbody tr:hover td,
.weekly-agenda__table tbody tr:hover .weekly-agenda__date {
  background: #fff9e8;
}

.weekly-agenda__date {
  background:
    linear-gradient(135deg, rgba(18, 60, 53, .98), rgba(18, 60, 53, .88)) !important;
  border-bottom: 0 !important;
  border-radius: 8px 0 0 8px;
  box-shadow: inset .35rem 0 0 #e5b54b;
  color: #fff;
  font-size: .85rem !important;
  font-weight: 900;
  line-height: 1.35 !important;
  width: 7.5rem;
}

.weekly-agenda__activity {
  min-width: 13rem;
}

.weekly-agenda__activity strong {
  color: #123c35;
  display: block;
  font-weight: 900;
}

.weekly-agenda__time {
  background: #e5b54b;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  font-size: .72rem;
  font-weight: 900;
  margin: 0 0 .45rem;
  padding: .24rem .6rem;
  width: fit-content;
}

.weekly-agenda__cards {
  display: none;
}

.proposal-card {
  text-align: center;
  transition: transform .25s ease;
}

.proposal-card:hover {
  transform: translateY(-.25rem);
}

.proposal-card:hover :deep(.icon-spin-hover) {
  transform: rotate(360deg) scale(1.08);
}

.proposal-card__icon {
  align-items: center;
  background: #e7f0e8;
  border-radius: 999px;
  color: #123c35;
  display: inline-flex;
  height: 4rem;
  justify-content: center;
  margin-bottom: 1rem;
  width: 4rem;
}

.proposal-card__icon :deep(svg) {
  height: 2rem;
  width: 2rem;
}

.proposal-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 .75rem;
}

.proposal-card p {
  line-height: 1.55;
  margin: 0;
}

.home-sidebar {
  min-width: 0;
}

.news-section {
  background: #f7f8f4;
  padding: 3rem 0;
}

.news-section .section-title {
  font-size: 1.875rem;
}

.news-card {
  color: #1f2f2b;
  display: block;
  text-decoration: none;
}

.news-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 .75rem;
  text-align: center;
}

.news-card img {
  aspect-ratio: 4 / 3;
  border-radius: 6px;
  display: block;
  object-fit: cover;
  transition: transform .25s ease, box-shadow .25s ease;
  width: 100%;
}

.news-card:hover img,
.news-card:focus img {
  box-shadow: 0 .8rem 1.8rem rgba(31, 47, 43, .14);
  transform: translateY(-.25rem);
}

@media (min-width: 768px) {
  .educacity-access__container {
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 1.35rem 1.5rem;
  }

  .proposal-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .weekly-agenda__toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .weekly-agenda__table-wrap {
    display: none;
  }

  .weekly-agenda__cards {
    display: grid;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .weekly-agenda__day-card {
    background:
      linear-gradient(135deg, rgba(18, 60, 53, .04), transparent 14rem),
      #fff;
    border: 1px solid #dde6dc;
    border-radius: 8px;
    box-shadow: 0 .7rem 1.6rem rgba(31, 47, 43, .1);
    overflow: hidden;
  }

  .weekly-agenda__day-card h3 {
    background:
      linear-gradient(135deg, rgba(18, 60, 53, .98), rgba(18, 60, 53, .88));
    box-shadow: inset .35rem 0 0 #e5b54b;
    color: #e5b54b;
    font-size: 1rem;
    font-weight: 800;
    margin: 0;
    padding: .8rem 1rem;
  }

  .weekly-agenda__activity-card {
    padding: 1rem;
    transition: background .2s ease;
  }

  .weekly-agenda__activity-card:hover {
    background: #fff9e8;
  }

  .weekly-agenda__activity-card+.weekly-agenda__activity-card {
    border-top: 1px solid #dde6dc;
  }

  .weekly-agenda__activity-card h4 {
    color: #123c35;
    font-size: .98rem;
    font-weight: 800;
    line-height: 1.3;
    margin: 0 0 .75rem;
  }

  .weekly-agenda__activity-card dl {
    display: grid;
    gap: .65rem;
    margin: 0;
  }

  .weekly-agenda__activity-card dt {
    color: #b77c17;
    font-size: .72rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  .weekly-agenda__activity-card dd {
    color: #42554f;
    margin: .15rem 0 0;
    white-space: pre-line;
  }
}

@media (min-width: 992px) {
  .home-shell {
    align-items: start;
    grid-template-columns: minmax(0, 1fr) 20rem;
  }

  .home-sidebar {
    display: flex;
    height: auto;
    min-height: 0;
  }

  .home-sidebar :deep(.calendario-escolar) {
    max-height: min(44rem, calc(100vh - 7rem));
  }
}

@media (min-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
