<script setup>
import { CalendarDays, ChevronDown, RefreshCw } from '@lucide/vue';
import EducationalExplorer from '../components/home/EducationalExplorer.vue';
import LatestNews from '../components/home/LatestNews.vue';
import ParallaxBand from '../components/home/ParallaxBand.vue';
import QuickAccess from '../components/home/QuickAccess.vue';
import SchoolCalendar from '../components/home/SchoolCalendar.vue';
import { useWeeklyAgenda } from '../composables/useWeeklyAgenda';

const { agenda: weeklyAgenda, error: weeklyAgendaError, isLoading: isWeeklyAgendaLoading, loadAgenda, metadata: weeklyAgendaMetadata } = useWeeklyAgenda();

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

</script>

<template>
  <main class="home-preview">
    <QuickAccess />
    <LatestNews />
    <ParallaxBand />
    <EducationalExplorer />
    <div v-reveal="'up'" class="home-planning">
      <section class="home-agenda" aria-labelledby="agenda-semanal-title">
        <header class="home-agenda__header">
          <div>
            <p class="home-eyebrow">Vida institucional</p>
            <h2 id="agenda-semanal-title"><CalendarDays aria-hidden="true" /> Agenda semanal</h2>
          </div>
          <button type="button" class="home-refresh" :disabled="isWeeklyAgendaLoading" @click="loadAgenda">
            <RefreshCw aria-hidden="true" /> {{ isWeeklyAgendaLoading ? 'Actualizando…' : 'Actualizar' }}
          </button>
        </header>
        <p class="home-agenda__intro">Actividades para estudiantes, familias y equipo educativo.</p>
        <dl class="home-agenda__metadata" aria-label="Datos de la agenda semanal">
          <div v-if="weeklyAgendaMetadata.week"><dt>Semana</dt><dd>{{ weeklyAgendaMetadata.week }}</dd></div>
          <div v-if="weeklyAgendaMetadata.period"><dt>Periodo</dt><dd>{{ weeklyAgendaMetadata.period }}</dd></div>
          <div v-if="weeklyAgendaMetadata.month"><dt>Mes</dt><dd>{{ weeklyAgendaMetadata.month }}</dd></div>
        </dl>
        <p v-if="weeklyAgendaError" role="status" class="home-agenda__error">{{ weeklyAgendaError }} Se muestra la agenda local de respaldo.</p>
        <p v-if="isWeeklyAgendaLoading" class="home-agenda__status" role="status">Consultando la agenda institucional…</p>
        <p v-else-if="!weeklyAgenda.length" class="home-agenda__status">No hay actividades publicadas para esta semana.</p>
        <div v-else class="home-agenda__days">
          <details v-for="(day, index) in weeklyAgenda" :key="day.id || day.date" class="home-agenda__day" :open="index === 0">
            <summary>
              <CalendarDays aria-hidden="true" />
              <span>{{ day.date }}</span>
              <span class="home-agenda__count">{{ day.activities.length }} {{ day.activities.length === 1 ? 'actividad' : 'actividades' }}</span>
              <ChevronDown class="home-agenda__chevron" aria-hidden="true" />
            </summary>
            <div class="home-agenda__activities">
              <article v-for="activity in day.activities" :key="activity.id || activity.activity" class="home-agenda__activity">
                <span v-if="getAgendaActivityParts(activity.activity).time" class="home-agenda__time">{{ getAgendaActivityParts(activity.activity).time }}</span>
                <h3>{{ getAgendaActivityParts(activity.activity).title || activity.activity }}</h3>
                <dl>
                  <div v-if="activity.responsible"><dt>Responsables</dt><dd>{{ activity.responsible }}</dd></div>
                  <div v-if="activity.participants"><dt>Participantes</dt><dd>{{ activity.participants }}</dd></div>
                  <div v-if="activity.place"><dt>Lugar</dt><dd>{{ activity.place }}</dd></div>
                </dl>
              </article>
            </div>
          </details>
        </div>
      </section>
      <aside class="home-calendar" aria-label="Calendario escolar"><SchoolCalendar /></aside>
    </div>
  </main>
</template>

<style scoped>
.home-preview { background: #f7f8f4; color: #203c34; font-family: 'Open Sans', Arial, sans-serif; font-size: 1rem; line-height: 1.65; }
.home-preview, .home-preview :deep(*), .home-preview :deep(*::before), .home-preview :deep(*::after) { box-sizing: border-box; }
.home-preview h2, .home-preview h3 { font-family: Georgia, 'Times New Roman', serif; }
.home-planning { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
.home-eyebrow { color: #8b6418; font-size: .75rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 .5rem; }
.home-planning { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); align-items: start; gap: 1.5rem; padding-top: 2.5rem; padding-bottom: 3.5rem; }
.home-agenda, .home-calendar { min-width: 0; background: #fff; border: 1px solid #e0e7df; border-radius: 14px; box-shadow: 0 6px 22px #123c3509; }
.home-agenda { padding: 1.5rem; }
.home-agenda__header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.home-agenda h2 { display: flex; align-items: center; gap: .6rem; margin: 0; font-size: clamp(1.5rem, 2.5vw, 1.9rem); font-weight: 700; line-height: 1.25; }
.home-agenda h2 svg { width: 1.75rem; height: 1.75rem; flex-shrink: 0; color: #07513e; }
.home-refresh { display: inline-flex; gap: .4rem; align-items: center; border: 1px solid #dce5dc; background: #f6f8f4; color: #174d3d; border-radius: 7px; padding: .55rem .7rem; font-size: .8rem; font-weight: 700; cursor: pointer; }
.home-refresh svg { width: 1rem; height: 1rem; }
.home-refresh:disabled { opacity: .6; cursor: wait; }
.home-agenda__intro { color: #53645d; margin: .9rem 0 1rem; }
.home-agenda__metadata { display: flex; flex-wrap: wrap; gap: .5rem; margin: 0 0 1.5rem; }
.home-agenda__metadata div { display: flex; gap: .4rem; align-items: baseline; border-radius: 6px; padding: .3rem .6rem; background: #f2f5ef; font-size: .8rem; }
.home-agenda__metadata dt { color: #59675e; }
.home-agenda__metadata dd { font-weight: 700; margin: 0; }
.home-agenda__days { display: grid; gap: .8rem; }
.home-agenda__day { border: 1px solid #dce5dc; border-radius: 9px; overflow: hidden; }
.home-agenda__day summary { list-style: none; display: flex; align-items: center; gap: .6rem; cursor: pointer; background: #f6f8f4; padding: .9rem 1rem; font-weight: 700; line-height: 1.5; }
.home-agenda__day summary::-webkit-details-marker { display: none; }
.home-agenda__day summary > svg { width: 1.2rem; height: 1.2rem; flex-shrink: 0; }
.home-agenda__day[open] summary { background: #07513e; color: white; }
.home-agenda__count { margin-left: auto; font-size: .72rem; font-weight: 400; white-space: nowrap; }
.home-agenda__chevron { transition: transform .2s; }
.home-agenda__day[open] .home-agenda__chevron { transform: rotate(180deg); }
.home-agenda__activity { padding: 1.1rem; }
.home-agenda__activity + .home-agenda__activity { border-top: 1px solid #e8ede6; }
.home-agenda__activity h3 { font-family: 'Open Sans', Arial, sans-serif; font-size: 1rem; font-weight: 700; line-height: 1.55; margin: 0 0 .75rem; white-space: pre-line; overflow-wrap: anywhere; }
.home-agenda__time { display: inline-block; padding: .15rem .6rem; border-radius: 20px; background: #faf0c9; color: #634a12; font-size: .8rem; font-weight: 700; margin-bottom: .5rem; }
.home-agenda__activity dl { margin: 0; display: grid; gap: .4rem; font-size: .85rem; }
.home-agenda__activity dl div { display: grid; grid-template-columns: 7.5rem minmax(0,1fr); gap: .75rem; }
.home-agenda__activity dt { color: #6b766e; }
.home-agenda__activity dd { margin: 0; white-space: pre-line; overflow-wrap: anywhere; }
.home-agenda__error { border-left: 3px solid #a85a29; background: #fff5e9; padding: .75rem; font-size: .9rem; }
.home-agenda__status { color: #5b6d62; padding: 1rem 0; }
/* Visual depth for the planning cards. */
.home-agenda, .home-calendar { transition: box-shadow .3s ease; }
.home-agenda { border-top: 4px solid #07513e; }
.home-calendar { border-top: 4px solid #e5b54b; }
.home-agenda:hover, .home-calendar:hover { box-shadow: 0 18px 40px rgba(18, 60, 53, .12); }
.home-agenda__day { transition: border-color .2s ease, box-shadow .2s ease; }
.home-agenda__day:hover { border-color: #b9cdbb; box-shadow: 0 6px 16px rgba(18, 60, 53, .08); }
.home-agenda__day summary { transition: background .2s ease, color .2s ease; }
.home-agenda__day:not([open]) summary:hover { background: #e7f0e8; }
.home-agenda__activity { border-left: 3px solid transparent; transition: background .2s ease, border-color .2s ease; }
.home-agenda__activity:hover { background: #fbfcf9; border-left-color: #e5b54b; }
.home-refresh { transition: background .2s ease, border-color .2s ease; }
.home-refresh:hover:not(:disabled) { background: #e7f0e8; border-color: #b9cdbb; }
.home-refresh:not(:disabled):hover svg { transform: rotate(180deg); transition: transform .4s ease; }
@media (prefers-reduced-motion: reduce) {
  .home-refresh:not(:disabled):hover svg { transform: none; }
}
.home-preview :is(a,button,summary):focus-visible { outline: 3px solid #b3821c; outline-offset: 4px; }
@media (max-width: 900px) {
  .home-planning { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 520px) {
  .home-planning { padding-left: 1rem; padding-right: 1rem; }
  .home-agenda { padding: 1.15rem; }
  .home-agenda__count { display: none; }
}
</style>
