import { computed, onMounted, ref } from 'vue';
import { localInstitutionalProjects } from '../constants/institutionalProjects';

const projectsUrl = import.meta.env.VITE_PROJECTS_URL;

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

function getDriveImageUrl(imageUrl) {
  const normalizedImageUrl = String(imageUrl || '').trim();
  if (!normalizedImageUrl) return '';

  const fileId = extractDriveId(normalizedImageUrl);
  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;

  return normalizedImageUrl;
}

function normalizeProject(project, index) {
  const fileUrl = project.fileUrl || project.archivo_url || project.url || '';
  const imageUrl = project.imageUrl || project.imagen_url || project.imagen || project.foto || '';

  return {
    id: project.id || `proyecto-${index + 1}`,
    title: project.title || project.titulo || 'Proyecto institucional',
    category: project.category || project.categoria || 'Institucional',
    description: project.description || project.descripcion || 'Documento institucional disponible para consulta y descarga.',
    fileUrl,
    previewUrl: project.previewUrl || project.preview_url || getDrivePreviewUrl(fileUrl),
    downloadUrl: project.downloadUrl || project.download_url || getDriveDownloadUrl(fileUrl),
    imageUrl: getDriveImageUrl(imageUrl),
    active: project.active ?? true,
    order: Number(project.order || project.orden || index + 1)
  };
}

async function fetchProjects() {
  if (!projectsUrl) return localInstitutionalProjects;

  const response = await fetch(projectsUrl);
  if (!response.ok) {
    throw new Error('No fue posible cargar los proyectos institucionales.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.projects || data.proyectos || [];
}

export function useInstitutionalProjects() {
  const projects = ref(localInstitutionalProjects.map(normalizeProject));
  const error = ref('');
  const isLoading = ref(false);

  const loadProjects = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const loadedProjects = await fetchProjects();
      projects.value = loadedProjects
        .map(normalizeProject)
        .filter((project) => project.title && project.active)
        .sort((first, second) => first.order - second.order);
    } catch (loadError) {
      error.value = loadError.message;
      projects.value = localInstitutionalProjects.map(normalizeProject);
    } finally {
      isLoading.value = false;
    }
  };

  const categories = computed(() => ['Todos', ...new Set(projects.value.map((project) => project.category))]);
  const hasExternalSource = computed(() => Boolean(projectsUrl));

  onMounted(loadProjects);

  return {
    categories,
    error,
    hasExternalSource,
    isLoading,
    loadProjects,
    projects
  };
}
