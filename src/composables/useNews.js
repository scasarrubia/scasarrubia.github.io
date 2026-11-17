import { computed, onMounted, ref } from 'vue';
import { localNewsItems } from '../constants/newsItems';
import { compareNewsNewestFirst } from '../utils/newsOrder';

const newsUrl = import.meta.env.VITE_NEWS_URL;
const defaultNewsImage = '/images/img_hero_1.webp';
const sharedNewsItems = ref(newsUrl ? [] : localNewsItems.map(normalizeNewsItem).sort(compareNewsNewestFirst));
const sharedError = ref('');
const sharedIsLoading = ref(Boolean(newsUrl));
let hasLoadedNews = false;
let pendingNewsRequest = null;

function normalizeBody(body) {
  if (Array.isArray(body)) return body.filter(Boolean);

  return String(body || '')
    .split(/\n{2,}|\r\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function normalizeImageUrl(value) {
  const imageUrl = String(value || '').trim();

  if (isSupportedImageUrl(imageUrl)) return imageUrl;

  return defaultNewsImage;
}

function isSupportedImageUrl(value) {
  const imageUrl = String(value || '').trim();

  if (!imageUrl) return false;
  if (imageUrl.startsWith('/')) return true;

  try {
    const url = new URL(imageUrl);
    const pathname = url.pathname.toLowerCase();
    const hostname = url.hostname.toLowerCase();

    return (
      pathname.includes('/thumbnail') ||
      hostname.includes('googleusercontent.com') ||
      /\.(avif|webp|png|jpe?g|gif|svg)$/i.test(pathname)
    );
  } catch {
    return false;
  }
}

function normalizeGallery(value) {
  const gallery = Array.isArray(value) ? value : String(value || '').split(',');

  return gallery
    .map(normalizeImageUrl)
    .filter((imageUrl) => imageUrl !== defaultNewsImage);
}

function createExcerpt(value) {
  const cleanText = String(value || '').replace(/\s+/g, ' ').trim();

  if (cleanText.length <= 180) return cleanText;

  return `${cleanText.slice(0, 177).trim()}...`;
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

function normalizeNewsItem(item, index) {
  const title = item.title || item.titulo || 'Noticia institucional';
  const rawExcerpt = item.excerpt || item.resumen || '';
  let body = normalizeBody(item.body || item.cuerpo || item.contenido || item.noticia || item.descripcion);
  const gallery = normalizeGallery(item.gallery || item.galeria || item.images || item.imagenes);
  const image = normalizeImageUrl(item.image || item.imagen_url || item.imagen || item.foto || gallery[0]);

  if (!body.length && rawExcerpt) {
    body = normalizeBody(rawExcerpt);
  }

  return {
    id: item.id || `noticia-${index + 1}`,
    slug: item.slug || createSlug(title || `noticia-${index + 1}`),
    category: item.category || item.categoria || 'Institucional',
    title,
    date: item.date || item.fecha || item.marca_temporal || '',
    author: item.author || item.autor || item.publicado_por || 'Comunicaciones IEPRAV',
    image,
    imageAlt: item.imageAlt || item.imagen_alt || title,
    gallery: gallery.length ? gallery : [image].filter((imageUrl) => imageUrl !== defaultNewsImage),
    excerpt: createExcerpt(body[0] || rawExcerpt),
    body,
    active: item.active ?? true,
    order: Number(item.order || item.orden || index + 1)
  };
}

async function fetchNews() {
  if (!newsUrl) return localNewsItems;

  const response = await fetch(newsUrl);
  if (!response.ok) {
    throw new Error('No fue posible cargar las noticias institucionales.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.news || data.noticias || [];
}

export function useNews() {
  const loadNews = async () => {
    if (pendingNewsRequest) return pendingNewsRequest;

    sharedIsLoading.value = true;
    sharedError.value = '';

    pendingNewsRequest = (async () => {
      const loadedNews = await fetchNews();
      const normalizedNews = loadedNews
        .map(normalizeNewsItem)
        .filter((item) => item.title && item.active)
        .sort(compareNewsNewestFirst);

      sharedNewsItems.value = normalizedNews.length || newsUrl ? normalizedNews : localNewsItems.map(normalizeNewsItem).sort(compareNewsNewestFirst);
      hasLoadedNews = true;
    })();

    try {
      await pendingNewsRequest;
    } catch (loadError) {
      sharedError.value = loadError.message;
      sharedNewsItems.value = newsUrl ? [] : localNewsItems.map(normalizeNewsItem).sort(compareNewsNewestFirst);
    } finally {
      sharedIsLoading.value = false;
      pendingNewsRequest = null;
    }
  };

  const hasExternalSource = computed(() => Boolean(newsUrl));

  onMounted(() => {
    if (!hasLoadedNews) {
      loadNews();
    }
  });

  return {
    error: sharedError,
    hasExternalSource,
    isLoading: sharedIsLoading,
    loadNews,
    newsItems: sharedNewsItems
  };
}
