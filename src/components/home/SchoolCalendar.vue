<script setup>
import { useSchoolCalendar } from '../../composables/useSchoolCalendar';
import { CalendarCheck, Clock, MapPin, RefreshCw, Users } from '@lucide/vue';

const { activeCategory, categories, error, events, isExternalSource, isLoading, loadEvents } = useSchoolCalendar();

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
      <div v-reveal="{ direction: 'right', delay: 120 }" class="calendario-escolar__header">
        <div>
          <p class="school-calendar__kicker">Calendario escolar</p>
          <h2>Agenda institucional actualizada</h2>
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

      <div v-reveal="{ direction: 'right', delay: 300 }" class="calendario-escolar__filters" aria-label="Filtrar calendario por categoría">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          :class="{ 'calendario-escolar__filter--active': activeCategory === category }"
          @click="activeCategory = category">
          {{ category }}
        </button>
      </div>

      <p v-if="error" class="calendario-escolar__error">{{ error }} Se muestran eventos locales de respaldo.</p>

      <div class="calendario-escolar__list">
        <article v-for="event in events" :key="event.id" v-reveal="{ direction: 'right', delay: 120 }" class="calendario-evento">
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
</style>
