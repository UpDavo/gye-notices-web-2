import type { Article } from './api';

/* Reparto de la edición por material gráfico.

   Una nota con foto y una sin foto no se componen igual: la primera aguanta
   una plana, una banda de cuatro o una foto a sangre; la segunda es un
   titular, y puesta en esa misma rejilla deja un hueco donde las demás tienen
   imagen. Por eso la portada no mezcla: lo ilustrado va a los bloques
   grandes y lo demás baja a la columna de breves, que es donde un diario ha
   puesto siempre la nota corta sin material.

   Dentro de cada grupo manda la fecha, no la foto: el orden que llega del
   backend es `-published_at` y filtrar no lo altera, así que lo más reciente
   sigue arriba en los dos lados. */
export function splitByImage(articles: Article[]) {
  return {
    withImage: articles.filter((a) => a.image_url),
    withoutImage: articles.filter((a) => !a.image_url),
  };
}

/* Los breves son las notas sin foto, pero la columna no debe quedar coja si
   una corrida trae pocas: se completa con las ilustradas que ningún bloque
   llegó a usar. Con material de sobra, `fill` no aporta nada y la columna es
   solo lo que dice su nombre. */
export function takeBriefs(withoutImage: Article[], fill: Article[], count: number) {
  const used = new Set(withoutImage.map((a) => a.slug));
  const extra = fill.filter((a) => !used.has(a.slug));
  return [...withoutImage, ...extra].slice(0, count);
}
