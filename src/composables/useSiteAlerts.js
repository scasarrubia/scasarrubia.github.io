import { computed, onMounted, ref } from 'vue';

const alertsUrl = import.meta.env.VITE_ALERTS_URL;
const alerts = ref([]);
const error = ref('');
const isLoading = ref(Boolean(alertsUrl));
let hasLoadedAlerts = false;
let pendingAlertsRequest = null;

function normalizeAlertType(value) {
  const type = String(value || '').trim().toLowerCase();

  if (['alerta', 'urgente', 'importante'].includes(type)) return 'alerta';
  if (['evento', 'agenda'].includes(type)) return 'evento';

  return 'novedad';
}

function parseDate(value) {
  const text = String(value || '').trim();
  if (!text) return null;

  const isoMatch = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }

  const localMatch = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (localMatch) {
    return new Date(Number(localMatch[3]), Number(localMatch[2]) - 1, Number(localMatch[1]));
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isWithinDateRange(alert) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = parseDate(alert.startDate);
  const endDate = parseDate(alert.endDate);

  if (startDate && today < startDate) return false;
  if (endDate && today > endDate) return false;

  return true;
}

function normalizeAlert(item, index) {
  return {
    id: item.id || `alerta-${index + 1}`,
    title: item.title || item.titulo || 'Novedad institucional',
    message: item.message || item.mensaje || item.descripcion || '',
    type: normalizeAlertType(item.type || item.tipo),
    startDate: item.startDate || item.fecha_inicio || item.inicio || item.desde || '',
    endDate: item.endDate || item.fecha_final || item.fecha_fin || item.fin || item.hasta || '',
    link: item.link || item.enlace || item.url || '',
    linkLabel: item.linkLabel || item.texto_boton || item.boton || 'Ver más',
    active: item.active ?? true,
    order: Number(item.order || item.orden || index + 1)
  };
}

async function fetchAlerts() {
  if (!alertsUrl) return [];

  const response = await fetch(alertsUrl);
  if (!response.ok) {
    throw new Error('No fue posible cargar las novedades institucionales.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.alerts || data.alertas || data.novedades || [];
}

export function useSiteAlerts() {
  const loadAlerts = async () => {
    if (pendingAlertsRequest) return pendingAlertsRequest;

    isLoading.value = true;
    error.value = '';

    pendingAlertsRequest = (async () => {
      const loadedAlerts = await fetchAlerts();
      alerts.value = loadedAlerts
        .map(normalizeAlert)
        .filter((alert) => alert.title && alert.message && alert.active && isWithinDateRange(alert))
        .sort((first, second) => first.order - second.order);
      hasLoadedAlerts = true;
    })();

    try {
      await pendingAlertsRequest;
    } catch (loadError) {
      error.value = loadError.message;
      alerts.value = [];
    } finally {
      isLoading.value = false;
      pendingAlertsRequest = null;
    }
  };

  const hasActiveAlerts = computed(() => alerts.value.length > 0);

  onMounted(() => {
    if (!hasLoadedAlerts) {
      loadAlerts();
    }
  });

  return {
    alerts,
    error,
    hasActiveAlerts,
    isLoading,
    loadAlerts
  };
}
