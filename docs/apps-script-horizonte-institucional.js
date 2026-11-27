const SPREADSHEET_ID = '1sUlD23sXtc_ftNncdaqPSBVdwHZO4LoVRzmKQvYSmMY';
const SHEET_NAME = '';

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

  const documents = readDocuments(values);

  return ContentService
    .createTextOutput(JSON.stringify({ documents }))
    .setMimeType(ContentService.MimeType.JSON);
}

function readDocuments(values) {
  const [headers, ...rows] = values;

  if (!headers || !headers.length) return [];

  const normalizedHeaders = headers.map(normalizeKey);

  return rows
    .map((row, index) => {
      const item = normalizedHeaders.reduce((documentItem, key, columnIndex) => {
        documentItem[key] = row[columnIndex] || '';
        return documentItem;
      }, {});

      const title = getValue(item, ['titulo', 'title', 'nombre'], ['titulo', 'nombre']);
      const sourceUrl = getFirstUrl(getValue(
        item,
        ['url', 'url_del_archivo_compartido', 'archivo_url', 'file_url'],
        ['url', 'archivo', 'compartido']
      ));
      const fileId = extractDriveId(sourceUrl);

      return {
        id: item.id || fileId || `documento-${index + 1}`,
        title,
        fileId,
        url: sourceUrl,
        previewUrl: getPreviewUrl(sourceUrl),
        viewUrl: getViewUrl(sourceUrl),
        downloadUrl: getDownloadUrl(sourceUrl),
        active: normalizeActive(item.activo),
        order: Number(item.orden || index + 1)
      };
    })
    .filter((documentItem) => documentItem.title && documentItem.url && documentItem.active)
    .sort((first, second) => first.order - second.order);
}

// Diagnostics (?debug=...) and ?nocache=1 only work with the secret token saved in
// Project settings > Script properties as DEBUG_TOKEN, for example ?debug=1&token=YOUR_TOKEN.
// Without the property, nobody can use them, so strangers cannot read the sheet or force heavy work.
function hasDebugToken(e) {
  const expected = PropertiesService.getScriptProperties().getProperty('DEBUG_TOKEN');
  return Boolean(expected) && e?.parameter?.token === expected;
}

function isDebugRequest(e) {
  return e?.parameter?.debug === '1' && hasDebugToken(e);
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
  const match = text.match(/https?:\/\/[^\s,]+/);

  return match?.[0] || '';
}

function getGoogleDocumentType(fileUrl) {
  if (fileUrl.includes('docs.google.com/document')) return 'document';
  if (fileUrl.includes('docs.google.com/spreadsheets')) return 'spreadsheets';
  if (fileUrl.includes('docs.google.com/presentation')) return 'presentation';
  return '';
}

function getPreviewUrl(fileUrl) {
  const fileId = extractDriveId(fileUrl);
  if (!fileId) return fileUrl || '';

  const documentType = getGoogleDocumentType(fileUrl);
  if (documentType) return `https://docs.google.com/${documentType}/d/${fileId}/preview`;

  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function getViewUrl(fileUrl) {
  const fileId = extractDriveId(fileUrl);
  if (!fileId) return fileUrl || '';

  const documentType = getGoogleDocumentType(fileUrl);
  if (documentType) return `https://docs.google.com/${documentType}/d/${fileId}/edit?usp=sharing`;

  return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
}

function getDownloadUrl(fileUrl) {
  const fileId = extractDriveId(fileUrl);
  if (!fileId) return fileUrl || '';

  const documentType = getGoogleDocumentType(fileUrl);
  if (documentType === 'document') return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
  if (documentType === 'spreadsheets') return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=pdf`;
  if (documentType === 'presentation') return `https://docs.google.com/presentation/d/${fileId}/export/pdf`;

  return `https://drive.google.com/uc?export=download&id=${fileId}`;
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
