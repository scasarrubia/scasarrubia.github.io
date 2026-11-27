const SPREADSHEET_ID = '1BHBBChjhY6QFS1APWZ0s9Zh2pYi_GOYAl4ehHiVgFjI';
const SHEET_NAME = '';

// Rendimiento: la respuesta completa se guarda en caché unos minutos y cada foto
// se comparte en Drive solo una vez por periodo, no en cada visita al sitio.
const RESPONSE_CACHE_SECONDS = 300; // 5 minutos: tiempo máximo para ver una noticia nueva.
const SHARED_FILE_CACHE_SECONDS = 21600; // 6 horas (máximo permitido por CacheService).
const RESPONSE_CACHE_KEY = 'news-response-v2';

function doGet(e) {
  const forceRefresh = e?.parameter?.nocache === '1' && hasDebugToken(e);

  if (!isDebugRequest(e) && !isSharingDebugRequest(e) && !forceRefresh) {
    const cached = readChunkedCache(RESPONSE_CACHE_KEY);
    if (cached) {
      return ContentService.createTextOutput(cached).setMimeType(ContentService.MimeType.JSON);
    }
  }

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
  const payload = JSON.stringify({ news });
  writeChunkedCache(RESPONSE_CACHE_KEY, payload, RESPONSE_CACHE_SECONDS);

  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

// Ejecutar a mano desde el editor para que una noticia nueva aparezca de inmediato.
function limpiarCache() {
  CacheService.getScriptCache().remove(`${RESPONSE_CACHE_KEY}:count`);
  Logger.log('Caché de noticias limpiada.');
}

// CacheService admite máximo 100 KB por valor: el JSON se guarda en partes.
function writeChunkedCache(key, text, seconds) {
  try {
    const cache = CacheService.getScriptCache();
    const chunkSize = 90000;
    const entries = {};
    let count = 0;

    for (let start = 0; start < text.length; start += chunkSize) {
      entries[`${key}:${count}`] = text.slice(start, start + chunkSize);
      count += 1;
    }

    entries[`${key}:count`] = String(count);
    cache.putAll(entries, seconds);
  } catch (error) {
    console.warn(`No fue posible guardar la caché: ${error}`);
  }
}

function readChunkedCache(key) {
  try {
    const cache = CacheService.getScriptCache();
    const count = Number(cache.get(`${key}:count`) || 0);
    if (!count) return '';

    const keys = Array.from({ length: count }, (_, index) => `${key}:${index}`);
    const parts = cache.getAll(keys);
    if (keys.some((partKey) => parts[partKey] === undefined)) return '';

    return keys.map((partKey) => parts[partKey]).join('');
  } catch (error) {
    return '';
  }
}

function readNews(values) {
  const [headers, ...rows] = values;

  if (!headers || !headers.length) return [];

  const normalizedHeaders = headers.map(normalizeKey);
  const usedSlugs = new Set();

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
      const gallery = getImageGallery(getImageColumnValues(item));

      return {
        id: item.id || `noticia-${index + 1}`,
        slug: uniqueSlug(item.slug || createSlug(title || `noticia-${index + 1}`), usedSlugs),
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

function isSharingDebugRequest(e) {
  return e?.parameter?.debug === 'sharing' && hasDebugToken(e);
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

// Toma todas las columnas de fotos: "Evidencias significativas", "Más fotos", "Imagen", etc.
// Así se pueden agregar varias preguntas de carga al formulario (Forms permite máximo 10 archivos por pregunta).
function getImageColumnValues(item) {
  return Object.keys(item)
    .filter((key) => /evidencia|foto|imagen/.test(key) && !key.includes('alt'))
    .map((key) => item[key])
    .filter(Boolean);
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
      const fileIds = [...new Set(getImageColumnValues(item)
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

// Comprueba que el archivo sea una imagen y lo comparte como "Cualquier persona con el enlace".
// El resultado se recuerda en caché para no consultar Drive en cada visita.
function isDriveImage(fileId) {
  const cache = CacheService.getScriptCache();
  const cacheKey = `drive-image:${fileId}`;
  const cached = cache.get(cacheKey);

  if (cached === '1') return true;
  if (cached === '0') return false;

  try {
    const file = DriveApp.getFileById(fileId);
    const mimeType = String(file.getMimeType() || '').toLowerCase();

    if (!mimeType.startsWith('image/')) {
      cache.put(cacheKey, '0', SHARED_FILE_CACHE_SECONDS);
      return false;
    }

    if (file.getSharingAccess() !== DriveApp.Access.ANYONE_WITH_LINK) {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    cache.put(cacheKey, '1', SHARED_FILE_CACHE_SECONDS);
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

// Dos noticias con el mismo título tendrían la misma dirección: se numeran (-2, -3...)
// en el orden de las filas de la hoja, así la dirección no cambia al agregar noticias nuevas.
function uniqueSlug(slug, usedSlugs) {
  let candidate = slug;
  let counter = 2;

  while (usedSlugs.has(candidate)) {
    candidate = `${slug}-${counter}`;
    counter += 1;
  }

  usedSlugs.add(candidate);
  return candidate;
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
