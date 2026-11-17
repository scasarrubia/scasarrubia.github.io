const SPREADSHEET_ID = '1BsD2LJGP7NAVccCRt5pxoq9AynoG9T1PTXqAFtPyTSg';
const SHEET_NAME = '';

function doGet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = SHEET_NAME
    ? spreadsheet.getSheetByName(SHEET_NAME)
    : spreadsheet.getSheets()[0];

  const values = sheet.getDataRange().getDisplayValues();
  const projects = readProjects(values);

  return ContentService
    .createTextOutput(JSON.stringify({ projects }))
    .setMimeType(ContentService.MimeType.JSON);
}

function readProjects(values) {
  const [headers, ...rows] = values;

  if (!headers || !headers.length) return [];

  const normalizedHeaders = headers.map(normalizeKey);

  return rows
    .map((row, index) => {
      const project = normalizedHeaders.reduce((item, key, columnIndex) => {
        item[key] = row[columnIndex] || '';
        return item;
      }, {});

      const imageSource = getValue(project, ['imagen_url', 'image_url', 'imagen', 'foto'], ['imagen', 'foto']);

      return {
        id: project.id || `proyecto-${index + 1}`,
        title: project.titulo || project.title || '',
        category: project.categoria || project.category || 'Institucional',
        description: project.descripcion || project.description || '',
        fileUrl: project.archivo_url || project.file_url || project.url || '',
        imageUrl: getImageUrl(imageSource),
        active: normalizeActive(project.activo),
        order: Number(project.orden || index + 1)
      };
    })
    .filter((project) => project.title && project.fileUrl && project.active)
    .sort((first, second) => first.order - second.order);
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

function getImageUrl(value) {
  const imageUrl = getFirstUrl(value);
  const fileId = extractDriveId(imageUrl);

  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;

  return imageUrl;
}

function getFirstUrl(value) {
  const text = String(value || '');
  const match = text.match(/https?:\/\/[^\s,]+/);

  return match?.[0] || '';
}

function extractDriveId(value) {
  const text = String(value || '');
  const patterns = [
    /\/d\/([^/]+)/,
    /[?&]id=([^&]+)/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }

  return '';
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
