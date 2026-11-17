<script setup>
import { useSchoolCalendar } from '../../composables/useSchoolCalendar';
import { CalendarCheck, Clock, MapPin, RefreshCw, Users } from '@lucide/vue';

const { activeCategory, categories, error, events, isLoading, loadEvents } = useSchoolCalendar();

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

function formatDate(date) {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}
</script>

<template>
  <section class="calendario-escolar school-calendar" id="calendario">
    <div class="school-calendar__container">
      <div class="calendario-escolar__header">
        <div>
          <p class="school-calendar__kicker">Próximas actividades</p>
          <h2><CalendarCheck aria-hidden="true" /> Calendario escolar</h2>
          <p>
            Consulta actividades académicas, reuniones, jornadas pedagógicas y eventos de interés para la comunidad.
          </p>
        </div>

        <button
          type="button"
          class="school-calendar__refresh"
          :disabled="isLoading"
          @click="loadEvents">
          <RefreshCw aria-hidden="true" />
          {{ isLoading ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>

      <div v-if="categories.length > 1" class="calendario-escolar__filters" aria-label="Filtrar calendario por categoría">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          :class="{ 'calendario-escolar__filter--active': activeCategory === category }"
          :aria-pressed="activeCategory === category"
          @click="activeCategory = category">
          {{ category }}
        </button>
      </div>

      <p v-if="error" class="calendario-escolar__error">{{ error }} Se muestran eventos locales de respaldo.</p>

      <div v-if="isLoading" class="school-calendar__empty" role="status">
        <CalendarCheck aria-hidden="true" />
        <h3>Consultando el calendario</h3>
        <p>Estamos cargando las actividades institucionales.</p>
      </div>
      <div v-else-if="!events.length" class="school-calendar__empty" role="status">
        <CalendarCheck aria-hidden="true" />
        <h3>{{ activeCategory === 'Todos' ? 'No hay eventos programados' : 'No hay eventos en esta categoría' }}</h3>
        <p>Aquí aparecerán las próximas actividades institucionales.</p>
      </div>
      <div v-else class="calendario-escolar__list">
        <article v-for="event in events" :key="event.id" class="calendario-evento">
          <time :datetime="event.date">
            <span>{{ formatDate(event.date).split(' de ')[0] }}</span>
            <small>{{ formatDate(event.date).split(' de ')[1] }}</small>
          </time>

          <div class="calendario-evento__body">
            <span class="calendario-evento__tag">{{ event.category }}</span>
            <h3>{{ event.title }}</h3>
            <p v-if="event.description">{{ event.description }}</p>
            <ul>
              <li v-if="event.time"><Clock aria-hidden="true" /> {{ event.time }}</li>
              <li><Users aria-hidden="true" /> {{ event.audience }}</li>
              <li class="calendario-evento__location">
                <MapPin aria-hidden="true" /> {{ event.location }}
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.school-calendar {
  background: #fff;
  color: #1f2f2b;
  padding: 2rem 0;
}

.school-calendar__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 1rem;
}

.school-calendar__kicker {
  color: #e5b54b;
  font-size: .875rem;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 .5rem;
  text-transform: uppercase;
}

.calendario-escolar__header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 .5rem;
}

.school-calendar__refresh {
  align-items: center;
  background: #e5b54b;
  border: 0;
  border-radius: 6px;
  color: #123c35;
  display: inline-flex;
  font-size: .875rem;
  font-weight: 700;
  gap: .5rem;
  padding: .5rem .75rem;
  transition: background .2s ease, color .2s ease, opacity .2s ease;
}

.school-calendar__refresh:hover,
.school-calendar__refresh:focus {
  background: #b77c17;
  color: #fff;
}

.school-calendar__refresh:disabled {
  opacity: .7;
}

.school-calendar__refresh svg,
.school-calendar__source svg {
  flex: 0 0 auto;
  height: 1rem;
  width: 1rem;
}

.school-calendar__source svg {
  color: #123c35;
  height: 1.25rem;
  width: 1.25rem;
}

.calendario-evento li svg {
  display: inline;
  height: .75rem;
  width: .75rem;
}
/* Full-width Home card, including explicit loading and empty states. */
.school-calendar { border-radius: 14px; padding: 1.5rem; font-family: 'Open Sans', Arial, sans-serif; font-size: 1rem; line-height: 1.65; width: 100%; }
.school-calendar__container { padding: 0; }
.school-calendar__kicker { color: #8b6418; font-size: .75rem; letter-spacing: .08em; }
.school-calendar .calendario-escolar__header { display: flex; align-items: flex-start; flex-direction: column; gap: .8rem; }
.school-calendar .calendario-escolar__header h2 { display: flex; gap: .6rem; align-items: center; color: #123c35; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(1.5rem, 2.5vw, 1.9rem); line-height: 1.25; }
.calendario-escolar__header h2 svg { width: 1.75rem; height: 1.75rem; flex-shrink: 0; }
.school-calendar .calendario-escolar__header p:not(.school-calendar__kicker) { font-size: .95rem; color: #53645d; margin: .9rem 0 0; }
.school-calendar__refresh { background: #f6f8f4; border: 1px solid #dce5dc; border-radius: 7px; font-size: .8rem; }
.school-calendar__empty { text-align: center; padding: 2.25rem .5rem; background: #f8faf6; border: 1px solid #ecf0e8; border-radius: 12px; margin-top: 1.5rem; }
.school-calendar__empty > svg { display: block; width: 4.5rem; height: 4.5rem; margin: 0 auto 1.1rem; color: #6b947f; background: #edf3e9; border-radius: 50%; padding: 1rem; }
.school-calendar__empty h3 { font-family: Georgia, 'Times New Roman', serif; color: #174d3d; font-size: 1.3rem; font-weight: 700; line-height: 1.35; margin: 0 0 .7rem; }
.school-calendar__empty p { margin: 0; font-size: .95rem; color: #596c60; }
.school-calendar .calendario-escolar__list { display: grid; grid-template-columns: minmax(0,1fr); gap: 1rem; margin-top: 1.25rem; overflow: visible; max-height: none; padding: 0; }
.school-calendar .calendario-evento { display: grid; grid-template-columns: 3.5rem minmax(0,1fr); gap: .85rem; padding: 1rem 0; border: 0; border-top: 1px solid #e4eae1; border-radius: 0; box-shadow: none; }
.school-calendar .calendario-evento time { padding: .65rem .2rem; border-radius: 8px; }
.school-calendar .calendario-evento time span { font-size: 1.5rem; }
.school-calendar .calendario-evento time small { font-size: .7rem; }
.school-calendar .calendario-evento h3 { font-size: 1.05rem; line-height: 1.4; margin: .5rem 0; font-weight: 700; }
.school-calendar .calendario-evento__tag { font-size: .75rem; }
.school-calendar .calendario-evento ul { display: grid; gap: .4rem; font-size: .85rem; }
.calendario-evento__body { min-width: 0; overflow-wrap: anywhere; }
.school-calendar button:focus-visible { outline: 3px solid #b3821c; outline-offset: 3px; }
</style>
