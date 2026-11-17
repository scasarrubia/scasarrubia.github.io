const SPREADSHEET_ID = '1BHBBChjhY6QFS1APWZ0s9Zh2pYi_GOYAl4ehHiVgFjI';
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

  if (isSharingDebugRequest(e)) {
    return ContentService
      .createTextOutput(JSON.stringify({
        spreadsheetName: spreadsheet.getName(),
        sheetName: sheet.getName(),
        diagnostics: readSharingDiagnostics(values)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const news = readNews(values);

  return ContentService
    .createTextOutput(JSON.stringify({ news }))
    .setMimeType(ContentService.MimeType.JSON);
}

function readNews(values) {
  const [headers, ...rows] = values;

  if (!headers || !headers.length) return [];

  const normalizedHeaders = headers.map(normalizeKey);

  return rows
    .map((row, index) => {
      const item = normalizedHeaders.reduce((newsItem, key, columnIndex) => {
        newsItem[key] = row[columnIndex] || '';
        return newsItem;
      }, {});

      const title = getValue(item, ['titulo', 'title', 'titulo_de_la_noticia'], ['titulo']);
      const summary = getValue(
        item,
        [
          'redacte_un_texto_que_explique_que_se_realizo_quienes_participaron_y_cual_fue_su_principal_resultado_las_fotos_se_escogen_de_las_que_se_anexan_a_este_formato'
        ],
        ['redacte_un_texto', 'principal_resultado']
      );
      const body = getValue(
        item,
        [
          'cuerpo',
          'contenido',
          'noticia',
          'descripcion',
          'cuerpo_de_la_noticia',
          'contenido_de_la_noticia',
          'texto_de_la_noticia',
          'explique_de_manera_breve_y_concreta_extension_sugerida_entre_80_y_150_palabras_en_que_consistio_la_actividad_como_se_desarrollo_la_actividad_quienes_participaron_cuales_fueron_sus_momentos_principales',
          'columna_20'
        ],
        ['explique_de_manera_breve', 'como_se_desarrollo', 'momentos_principales', 'columna_20', 'cuerpo', 'contenido', 'descripcion']
      );
      const newsBody = body || summary;
      const imageSource = getValue(item, ['imagen_url', 'imagen', 'foto'], ['imagen_url', 'imagen', 'foto']);
      const evidenceSource = getValue(item, ['evidencias_significativas'], ['evidencias', 'significativas']);
      const gallery = getImageGallery([imageSource, evidenceSource]);

      return {
        id: item.id || `noticia-${index + 1}`,
        slug: item.slug || createSlug(title || `noticia-${index + 1}`),
        title,
        category: getValue(item, ['categoria', 'category', 'periodo'], ['categoria', 'periodo']) || 'Institucional',
        date: getValue(item, ['fecha', 'fecha_de_realizacion', 'marca_temporal', 'timestamp'], ['fecha_de_realizacion', 'fecha', 'marca_temporal']) || '',
        author: getValue(item, ['autor', 'publicado_por'], ['autor', 'publicado']) || 'Comunicaciones IEPRAV',
        image: gallery[0] || '',
        imageAlt: getValue(item, ['imagen_alt'], ['imagen_alt']) || title || 'Imagen de noticia institucional',
        gallery,
        excerpt: getValue(item, ['resumen'], ['resumen']) || createExcerpt(newsBody),
        body: splitBody(newsBody),
        active: normalizeActive(item.activo),
        order: Number(item.orden || index + 1)
      };
    })
    .filter((item) => item.title && item.active)
    .sort((first, second) => first.order - second.order);
}

function isDebugRequest(e) {
  return e?.parameter?.debug === '1';
}

function isSharingDebugRequest(e) {
  return e?.parameter?.debug === 'sharing';
}

function autorizarPublicacionImagenes() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = SHEET_NAME
    ? spreadsheet.getSheetByName(SHEET_NAME)
    : spreadsheet.getSheets()[0];
  const values = sheet.getDataRange().getDisplayValues();
  const diagnostics = readSharingDiagnostics(values);

  Logger.log(JSON.stringify(diagnostics, null, 2));
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

function getImageGallery(values) {
  const imageUrls = values
    .flatMap(getEvidenceUrls)
    .map(getImageUrl)
    .filter(Boolean);

  return [...new Set(imageUrls)];
}

function readSharingDiagnostics(values) {
  const [headers, ...rows] = values;

  if (!headers || !headers.length) return [];

  const normalizedHeaders = headers.map(normalizeKey);

  return rows
    .map((row, index) => {
      const item = normalizedHeaders.reduce((newsItem, key, columnIndex) => {
        newsItem[key] = row[columnIndex] || '';
        return newsItem;
      }, {});

      const title = getValue(item, ['titulo', 'title', 'titulo_de_la_noticia'], ['titulo']) || `Noticia ${index + 1}`;
      const imageSource = getValue(item, ['imagen_url', 'imagen', 'foto'], ['imagen_url', 'imagen', 'foto']);
      const evidenceSource = getValue(item, ['evidencias_significativas'], ['evidencias', 'significativas']);
      const fileIds = [...new Set([imageSource, evidenceSource]
        .flatMap(getEvidenceUrls)
        .map(extractDriveId)
        .filter(Boolean))];

      return {
        title,
        files: fileIds.map(getFileSharingDiagnostic)
      };
    })
    .filter((item) => item.files.length);
}

function getFileSharingDiagnostic(fileId) {
  const diagnostic = {
    fileId,
    name: '',
    mimeType: '',
    accessBefore: '',
    permissionBefore: '',
    accessAfter: '',
    permissionAfter: '',
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
    error: ''
  };

  try {
    const file = DriveApp.getFileById(fileId);
    diagnostic.name = file.getName();
    diagnostic.mimeType = file.getMimeType();
    diagnostic.accessBefore = String(file.getSharingAccess());
    diagnostic.permissionBefore = String(file.getSharingPermission());

    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    diagnostic.accessAfter = String(file.getSharingAccess());
    diagnostic.permissionAfter = String(file.getSharingPermission());
  } catch (error) {
    diagnostic.error = String(error);
  }

  return diagnostic;
}

function getEvidenceUrls(value) {
  const text = String(value || '');
  const matches = text.match(/https?:\/\/[^\s,]+/g);

  return (matches || []).map((url) => url.replace(/[),.;]+$/, ''));
}

function getImageUrl(value) {
  const imageUrl = String(value || '').trim();
  const fileId = extractDriveId(value);

  if (!fileId) {
    return isSupportedExternalImageUrl(imageUrl) ? imageUrl : '';
  }

  if (!isDriveImage(fileId)) return '';

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
}

function isDriveImage(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const mimeType = String(file.getMimeType() || '').toLowerCase();

    if (!mimeType.startsWith('image/')) return false;

    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return true;
  } catch (error) {
    console.warn(`No fue posible validar/publicar la imagen ${fileId}: ${error}`);
    return false;
  }
}

function isSupportedExternalImageUrl(value) {
  const imageUrl = String(value || '').trim().toLowerCase();

  return /\.(avif|webp|png|jpe?g|gif|svg)(\?.*)?$/.test(imageUrl);
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

function createSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createExcerpt(value) {
  const cleanText = String(value || '').replace(/\s+/g, ' ').trim();

  if (cleanText.length <= 180) return cleanText;

  return `${cleanText.slice(0, 177).trim()}...`;
}

function splitBody(value) {
  return String(value || '')
    .split(/\n{2,}|\r\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
