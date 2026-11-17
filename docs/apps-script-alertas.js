const SPREADSHEET_ID = '1fbwV1EjkxSF9kXRzqrtM67LOqcIw5ItdKTUrgBCy_C4';
const SHEET_NAME = '';
const TIMEZONE = 'America/Bogota';

function doGet(e) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = SHEET_NAME
    ? spreadsheet.getSheetByName(SHEET_NAME)
    : spreadsheet.getSheets()[0];

  const values = sheet.getDataRange().getDisplayValues();

  if (isDebugRequest(e)) {
    return ContentService
      .createTextOutput(JSON.stringify({
        spreadsheetName: spreadsheet.getName(),
        sheetName: sheet.getName(),
        sheetNames: spreadsheet.getSheets().map((item) => item.getName()),
        rowCount: Math.max(values.length - 1, 0),
        headers: values[0] || [],
        firstRows: values.slice(1, 4)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const alerts = readAlerts(values);

  return ContentService
    .createTextOutput(JSON.stringify({ alerts }))
    .setMimeType(ContentService.MimeType.JSON);
}

function readAlerts(values) {
  const [headers, ...rows] = values;

  if (!headers || !headers.length) return [];

  const normalizedHeaders = headers.map(normalizeKey);
  const today = getToday();

  return rows
    .map((row, index) => {
      const item = normalizedHeaders.reduce((alertItem, key, columnIndex) => {
        alertItem[key] = row[columnIndex] || '';
        return alertItem;
      }, {});

      const title = getValue(item, ['titulo', 'title'], ['titulo']);
      const message = getValue(item, ['mensaje', 'message', 'descripcion', 'description'], ['mensaje', 'descripcion', 'contenido']);
      const startDate = getValue(item, ['fecha_inicio', 'inicio', 'desde'], ['fecha_inicio', 'inicio', 'desde']);
      const endDate = getValue(item, ['fecha_final', 'fecha_fin', 'fin', 'hasta'], ['fecha_final', 'fecha_fin', 'fin', 'hasta']);

      return {
        id: item.id || `alerta-${index + 1}`,
        title,
        message,
        type: normalizeAlertType(getValue(item, ['tipo', 'type'], ['tipo']) || 'novedad'),
        startDate,
        endDate,
        link: getFirstUrl(getValue(item, ['enlace', 'link', 'url'], ['enlace', 'link', 'url'])),
        linkLabel: getValue(item, ['texto_boton', 'texto_del_boton', 'boton'], ['texto_boton', 'boton']) || 'Ver más',
        active: normalizeActive(item.activo),
        order: Number(item.orden || index + 1)
      };
    })
    .filter((alert) => alert.title && alert.message && alert.active && isWithinDateRange(alert, today))
    .sort((first, second) => first.order - second.order);
}

function isDebugRequest(e) {
  return e?.parameter?.debug === '1';
}

function getToday() {
  const date = new Date();
  const formattedDate = Utilities.formatDate(date, TIMEZONE, 'yyyy-MM-dd');

  return new Date(`${formattedDate}T00:00:00`);
}

function isWithinDateRange(alert, today) {
  const startDate = parseDate(alert.startDate);
  const endDate = parseDate(alert.endDate);

  if (startDate && today < startDate) return false;
  if (endDate && today > endDate) return false;

  return true;
}

function parseDate(value) {
  const text = String(value || '').trim();
  if (!text) return null;

  const isoMatch = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return new Date(`${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}T00:00:00`);
  }

  const localMatch = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (localMatch) {
    return new Date(`${localMatch[3]}-${localMatch[2].padStart(2, '0')}-${localMatch[1].padStart(2, '0')}T00:00:00`);
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getValue(item, exactKeys, partialKeys) {
  for (const key of exactKeys) {
    if (item[key]) return item[key];
  }

  for (const partialKey of partialKeys) {
    const foundKey = Object.keys(item).find((key) => key.includes(partialKey));
    if (foundKey && item[foundKey]) return item[foundKey];
  }

  return '';
}

function getFirstUrl(value) {
  const text = String(value || '');
  const match = text.match(/https?:\/\/[^\s<>"']+/);

  return match?.[0]?.replace(/[),.;]+$/, '') || '';
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:()[\]{}]/g, '')
    .replace(/\s+/g, '_');
}

function normalizeActive(value) {
  const normalized = String(value || 'si').trim().toLowerCase();

  return !['no', 'false', '0', 'inactivo'].includes(normalized);
}

function normalizeAlertType(value) {
  const normalized = String(value || '').trim().toLowerCase();

  if (['alerta', 'urgente', 'importante'].includes(normalized)) return 'alerta';
  if (['evento', 'agenda'].includes(normalized)) return 'evento';

  return 'novedad';
}
