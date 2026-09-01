/* Formato de fechas en español de Ecuador. */

const LOCALE = 'es-EC';

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(LOCALE, {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* En un periódico la antigüedad relativa dice más que la fecha: «hace 20 min»
   es la señal de que la portada está viva. Pasada la semana ya no aporta y se
   vuelve a la fecha. */
export function timeAgo(value: string): string {
  const then = new Date(value).getTime();
  const minutes = Math.round((Date.now() - then) / 60000);

  if (Number.isNaN(minutes)) return '';
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `hace ${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;

  const days = Math.round(hours / 24);
  if (days === 1) return 'ayer';
  if (days < 7) return `hace ${days} días`;

  return formatDate(value);
}

export function isoDate(value: string): string {
  return new Date(value).toISOString().split('T')[0];
}

/* El extracto viene con los párrafos separados por una línea en blanco. La
   página de la nota los respeta, pero una meta description o un JSON-LD con
   saltos dentro es texto sucio para el buscador: ahí se aplana a una línea. */
export function singleLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
