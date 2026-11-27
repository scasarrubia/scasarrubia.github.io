// Links typed into the Google Sheets end up in href/src attributes.
// Vue does not filter them, so a value like "javascript:..." would run code when clicked.
// Only web, mail and phone links (and paths inside this site) are allowed.
const ALLOWED_PROTOCOLS = ['https:', 'http:', 'mailto:', 'tel:'];

export function safeUrl(value) {
  const url = String(value || '').trim();
  if (!url) return '';
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  if (url.startsWith('#')) return url;

  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol) ? url : '';
  } catch {
    return '';
  }
}
