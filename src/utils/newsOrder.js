const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function newsTimestamp(value) {
  const text = String(value || '').trim().toLowerCase();
  if (!text) return null;

  const local = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  const spanish = text.match(/^(\d{1,2}) de ([a-z]+) de (\d{4})$/);

  if (local || spanish) {
    const match = local || spanish;
    const month = local ? Number(match[2]) - 1 : months.indexOf(match[2]);
    const day = Number(match[1]);
    const year = Number(match[3]);
    const date = new Date(Date.UTC(year, month, day, Number(match[4] || 0), Number(match[5] || 0), Number(match[6] || 0)));
    if (month < 0 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) return null;
    return date.getTime();
  }

  // ISO dates are unambiguous; avoid interpreting Spanish dates as US dates.
  if (!/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(text)) return null;
  const timestamp = Date.parse(text);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function compareNewsNewestFirst(first, second) {
  const firstDate = newsTimestamp(first.date);
  const secondDate = newsTimestamp(second.date);

  if (firstDate !== null && secondDate !== null && firstDate !== secondDate) return secondDate - firstDate;
  if (firstDate !== null && secondDate === null) return -1;
  if (firstDate === null && secondDate !== null) return 1;

  // Rows appended to Sheets have a higher default order.
  return second.order - first.order;
}
