import { computed, onMounted, ref } from 'vue';
import { localCalendarEvents } from '../constants/calendarEvents';

const googleCalendarApiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
const googleCalendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
const calendarFeedUrl = import.meta.env.VITE_SCHOOL_CALENDAR_URL;
const hasGoogleCalendarSource = Boolean(googleCalendarApiKey && googleCalendarId);
const hasCalendarSource = hasGoogleCalendarSource || Boolean(calendarFeedUrl);

const timeFormatter = new Intl.DateTimeFormat('es-CO', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

function normalizeEvent(event, index) {
  return {
    id: event.id || `${event.date || event.fecha}-${index}`,
    title: event.title || event.titulo || event.evento || 'Evento institucional',
    date: event.date || event.fecha,
    time: event.time || event.hora || '',
    category: event.category || event.categoria || 'Institucional',
    audience: event.audience || event.publico || event.dirigidoA || 'Comunidad educativa',
    location: event.location || event.lugar || 'Institución educativa',
    description: event.description || event.descripcion || ''
  };
}

function readMetadata(description, key) {
  if (!description) return '';

  const expression = new RegExp(`^${key}\\s*:\\s*(.+)$`, 'im');
  const match = description.match(expression);

  return match?.[1]?.trim() || '';
}

function cleanDescription(description) {
  if (!description) return '';

  return description
    .split(/\r?\n/)
    .filter((line) => !/^(categoria|categoría|publico|público|dirigido a|lugar)\s*:/i.test(line.trim()))
    .join('\n')
    .trim();
}

function formatGoogleEventDateTime(start) {
  if (!start?.dateTime) return '';

  return timeFormatter.format(new Date(start.dateTime));
}

function normalizeGoogleCalendarEvent(event, index) {
  const description = event.description || '';
  const date = event.start?.date || event.start?.dateTime?.slice(0, 10);

  return normalizeEvent({
    id: event.id,
    title: event.summary,
    date,
    time: formatGoogleEventDateTime(event.start),
    category: readMetadata(description, 'Categoría') || readMetadata(description, 'Categoria') || 'Institucional',
    audience: readMetadata(description, 'Público') || readMetadata(description, 'Publico') || readMetadata(description, 'Dirigido a') || 'Comunidad educativa',
    location: readMetadata(description, 'Lugar') || event.location || 'Institución educativa',
    description: cleanDescription(description)
  }, index);
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let isQuoted = false;

  for (const char of line) {
    if (char === '"') {
      isQuoted = !isQuoted;
    } else if (char === ',' && !isQuoted) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  if (!headerLine) return [];

  const headers = parseCsvLine(headerLine).map((header) => header.trim().toLowerCase());

  return lines
    .filter(Boolean)
    .map((line) => {
      const values = parseCsvLine(line);
      return headers.reduce((event, header, index) => {
        event[header] = values[index] || '';
        return event;
      }, {});
    });
}

async function fetchGoogleCalendarEvents() {
  const searchParams = new URLSearchParams({
    key: googleCalendarApiKey,
    maxResults: '20',
    orderBy: 'startTime',
    singleEvents: 'true',
    timeMin: new Date().toISOString()
  });

  const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(googleCalendarId)}/events?${searchParams}`;
  const response = await fetch(calendarUrl);

  if (!response.ok) {
    throw new Error('No fue posible cargar los eventos de Google Calendar.');
  }

  const data = await response.json();
  return (data.items || []).map(normalizeGoogleCalendarEvent);
}

async function fetchCalendarEvents() {
  if (hasGoogleCalendarSource) return fetchGoogleCalendarEvents();
  if (!calendarFeedUrl) return localCalendarEvents;

  const response = await fetch(calendarFeedUrl);
  if (!response.ok) {
    throw new Error('No fue posible cargar el calendario escolar.');
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await response.json();
    return Array.isArray(data) ? data : data.events || [];
  }

  const text = await response.text();
  return parseCsv(text);
}

export function useSchoolCalendar() {
  const events = ref([]);
  const isLoading = ref(false);
  const error = ref('');
  const activeCategory = ref('Todos');

  const loadEvents = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const loadedEvents = await fetchCalendarEvents();
      events.value = loadedEvents
        .map(normalizeEvent)
        .filter((event) => event.date)
        .sort((first, second) => new Date(first.date) - new Date(second.date));
    } catch (loadError) {
      error.value = loadError.message;
      events.value = localCalendarEvents;
    } finally {
      isLoading.value = false;
    }
  };

  const categories = computed(() => ['Todos', ...new Set(events.value.map((event) => event.category))]);

  const filteredEvents = computed(() => {
    if (activeCategory.value === 'Todos') return events.value;
    return events.value.filter((event) => event.category === activeCategory.value);
  });

  onMounted(loadEvents);

  return {
    activeCategory,
    categories,
    error,
    events: filteredEvents,
    isExternalSource: hasCalendarSource,
    isLoading,
    loadEvents
  };
}
