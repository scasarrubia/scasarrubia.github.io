import { computed, onMounted, ref } from 'vue';
import { localWeeklyAgenda } from '../constants/weeklyAgenda';

const weeklyAgendaUrl = import.meta.env.VITE_WEEKLY_AGENDA_URL;
const localWeeklyAgendaMetadata = {
  week: '3',
  period: 'Tercero',
  month: 'Julio'
};

function normalizeActivity(activity, index) {
  return {
    id: activity.id || `${activity.activity || activity.actividad || 'actividad'}-${index}`,
    activity: activity.activity || activity.actividad || 'Actividad institucional',
    responsible: activity.responsible || activity.responsables || activity.responsable || '',
    participants: activity.participants || activity.participantes || '',
    place: activity.place || activity.lugar || ''
  };
}

function normalizeDay(day, index) {
  const activities = day.activities || day.actividades || [];

  return {
    id: day.id || `${day.date || day.fecha || day.dia || day.day || 'dia'}-${index}`,
    date: day.date || day.fecha || day.label || `${day.day || day.dia || ''} ${day.dayNumber || day.numero || ''}`.trim(),
    activities: activities.map(normalizeActivity).filter((activity) => activity.activity)
  };
}

async function fetchWeeklyAgendaData() {
  if (!weeklyAgendaUrl) {
    return {
      agenda: localWeeklyAgenda,
      ...localWeeklyAgendaMetadata
    };
  }

  const response = await fetch(weeklyAgendaUrl);
  if (!response.ok) {
    throw new Error('No fue posible cargar la agenda semanal.');
  }

  const data = await response.json();
  return Array.isArray(data)
    ? { agenda: data }
    : {
      agenda: data.days || data.agenda || [],
      week: data.week || data.semana || '',
      period: data.period || data.periodo || '',
      month: data.month || data.mes || ''
    };
}

export function useWeeklyAgenda() {
  const agenda = ref(localWeeklyAgenda);
  const error = ref('');
  const isLoading = ref(false);
  const metadata = ref(localWeeklyAgendaMetadata);

  const loadAgenda = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const loadedData = await fetchWeeklyAgendaData();
      agenda.value = loadedData.agenda
        .map(normalizeDay)
        .filter((day) => day.date && day.activities.length);
      metadata.value = {
        week: loadedData.week || '',
        period: loadedData.period || '',
        month: loadedData.month || ''
      };
    } catch (loadError) {
      error.value = loadError.message;
      agenda.value = localWeeklyAgenda;
      metadata.value = localWeeklyAgendaMetadata;
    } finally {
      isLoading.value = false;
    }
  };

  const hasExternalSource = computed(() => Boolean(weeklyAgendaUrl));

  onMounted(loadAgenda);

  return {
    agenda,
    error,
    hasExternalSource,
    isLoading,
    loadAgenda,
    metadata
  };
}
