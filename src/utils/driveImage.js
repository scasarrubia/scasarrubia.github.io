// Google Drive serves thumbnails at any width through the `sz=w<width>` parameter.
// Requesting the right size keeps galleries light: small thumbnails in grids and a
// large version only when a photo is opened.
export function sizedImage(url, width) {
  const imageUrl = String(url || '');

  if (!imageUrl.includes('drive.google.com/thumbnail')) return imageUrl;
  if (/[?&]sz=w\d+/.test(imageUrl)) return imageUrl.replace(/([?&]sz=)w\d+/, `$1w${width}`);

  return `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}sz=w${width}`;
}
