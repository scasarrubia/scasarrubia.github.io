import { computed, onMounted, ref } from 'vue';
import { BookOpenCheck, Scale, ShieldCheck } from '@lucide/vue';
import { safeUrl } from '../utils/safeUrl';

const documentsUrl = import.meta.env.VITE_INSTITUTIONAL_DOCUMENTS_URL;

const documentMetadata = [
  {
    match: ['proyecto educativo institucional', 'pei'],
    shortTitle: 'PEI',
    label: 'Documento rector',
    description: 'Define la identidad institucional, los principios formativos, el enfoque pedagógico y la ruta educativa de la comunidad escolar.',
    icon: BookOpenCheck,
    featured: true,
    reveal: { direction: 'left', delay: 80 }
  },
  {
    match: ['manual de convivencia', 'manual'],
    shortTitle: 'Manual',
    label: 'Vida escolar',
    description: 'Orienta derechos, deberes, acuerdos, procedimientos y rutas de atención para una convivencia respetuosa.',
    icon: ShieldCheck,
    reveal: { direction: 'right', delay: 180 }
  },
  {
    match: ['sistema institucional de evaluacion', 'sistema institucional de evaluación', 'siee'],
    shortTitle: 'SIEE',
    label: 'Evaluación',
    description: 'Presenta criterios, procesos y acuerdos para valorar aprendizajes y acompañar trayectorias académicas.',
    icon: Scale,
    reveal: { direction: 'right', delay: 280 }
  }
];

const localInstitutionalDocuments = [
  {
    title: 'Proyecto Educativo Institucional',
    url: '',
    order: 1
  },
  {
    title: 'Manual de convivencia',
    url: 'https://drive.google.com/file/d/1KEspv_kmyY-J6s5y0MvqOmktedcxE7yz/view?usp=sharing',
    order: 2
  },
  {
    title: 'Sistema Institucional de Evaluación',
    url: '',
    order: 3
  }
];

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function extractDriveId(url) {
  if (!url) return '';

  const patterns = [
    /\/d\/([^/]+)/,
    /[?&]id=([^&]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return '';
}

function getGoogleDocumentType(fileUrl) {
  if (fileUrl.includes('docs.google.com/document')) return 'document';
  if (fileUrl.includes('docs.google.com/spreadsheets')) return 'spreadsheets';
  if (fileUrl.includes('docs.google.com/presentation')) return 'presentation';
  return '';
}

function getDrivePreviewUrl(fileUrl) {
  const fileId = extractDriveId(fileUrl);
  if (!fileId) return fileUrl || '';

  const documentType = getGoogleDocumentType(fileUrl);
  if (documentType) return `https://docs.google.com/${documentType}/d/${fileId}/preview`;

  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function getDriveDownloadUrl(fileUrl) {
  const fileId = extractDriveId(fileUrl);
  if (!fileId) return fileUrl || '';

  const documentType = getGoogleDocumentType(fileUrl);
  if (documentType === 'document') return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
  if (documentType === 'spreadsheets') return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=pdf`;
  if (documentType === 'presentation') return `https://docs.google.com/presentation/d/${fileId}/export/pdf`;

  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

function getMetadata(title) {
  const normalizedTitle = normalizeText(title);

  return documentMetadata.find((metadata) => (
    metadata.match.some((keyword) => normalizedTitle.includes(normalizeText(keyword)))
  )) || {
    shortTitle: 'Doc',
    label: 'Documento',
    description: 'Documento institucional disponible para consulta y descarga.',
    icon: BookOpenCheck,
    reveal: { direction: 'right', delay: 220 }
  };
}

function normalizeDocument(documentItem, index) {
  const title = documentItem.title || documentItem.titulo || 'Documento institucional';
  const sourceUrl = documentItem.url || documentItem.fileUrl || documentItem.archivo_url || '';
  const metadata = getMetadata(title);

  return {
    ...metadata,
    id: documentItem.id || extractDriveId(sourceUrl) || `documento-${index + 1}`,
    title,
    fileId: documentItem.fileId || documentItem.file_id || extractDriveId(sourceUrl),
    previewUrl: safeUrl(getDrivePreviewUrl(sourceUrl || documentItem.previewUrl || documentItem.preview_url)),
    viewUrl: safeUrl(documentItem.viewUrl || documentItem.view_url || sourceUrl),
    downloadUrl: safeUrl(getDriveDownloadUrl(sourceUrl || documentItem.downloadUrl || documentItem.download_url)),
    active: documentItem.active ?? true,
    order: Number(documentItem.order || documentItem.orden || index + 1)
  };
}

async function fetchInstitutionalDocuments() {
  if (!documentsUrl) return localInstitutionalDocuments;

  const response = await fetch(documentsUrl);
  if (!response.ok) {
    throw new Error('No fue posible cargar los documentos institucionales.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.documents || data.documentos || [];
}

export function useInstitutionalDocuments() {
  const documents = ref(localInstitutionalDocuments.map(normalizeDocument));
  const error = ref('');
  const isLoading = ref(false);

  const loadDocuments = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const loadedDocuments = await fetchInstitutionalDocuments();
      documents.value = loadedDocuments
        .map(normalizeDocument)
        .filter((documentItem) => documentItem.title && documentItem.active)
        .sort((first, second) => first.order - second.order);
    } catch (loadError) {
      error.value = loadError.message;
      documents.value = localInstitutionalDocuments.map(normalizeDocument);
    } finally {
      isLoading.value = false;
    }
  };

  const featuredDocument = computed(() => documents.value.find((documentItem) => documentItem.featured) || documents.value[0]);
  const secondaryDocuments = computed(() => documents.value.filter((documentItem) => documentItem.id !== featuredDocument.value?.id));
  const hasExternalSource = computed(() => Boolean(documentsUrl));

  onMounted(loadDocuments);

  return {
    documents,
    error,
    featuredDocument,
    hasExternalSource,
    isLoading,
    loadDocuments,
    secondaryDocuments
  };
}
