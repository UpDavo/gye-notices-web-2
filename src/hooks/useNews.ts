import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { Article, ArticleQuery, Banner, Category, Paginated, Source } from '../lib/api';

type Loaded<T> = {
  /* Qué petición produjo estos datos. Comparar esta clave con la clave pedida
     es lo que dice si hay que cargar, y evita tener que escribir `loading` a
     mano al empezar cada petición. */
  key: string | null;
  data: T | null;
  error: string | null;
  /* El código del error, no su texto: distinguir «no existe» de «la API está
     caída» decide si la pantalla muestra un 404 o un botón de reintentar, y
     comparar mensajes en español para eso se rompe al reescribir una frase. */
  errorCode: string | null;
};

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  errorCode: string | null;
  reload: () => void;
};

/* Primitiva compartida por todos los hooks de abajo.

   El AbortController corta la petición anterior cuando cambian los filtros,
   para que una respuesta lenta no pise a una rápida y deje la lista mostrando
   la sección equivocada. */
function useAsync<T>(key: string, fetcher: (signal: AbortSignal) => Promise<T>): AsyncState<T> {
  const [nonce, setNonce] = useState(0);
  const [loaded, setLoaded] = useState<Loaded<T>>({
    key: null,
    data: null,
    error: null,
    errorCode: null,
  });

  const requestKey = `${key}#${nonce}`;

  useEffect(() => {
    const controller = new AbortController();

    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setLoaded({ key: requestKey, data, error: null, errorCode: null });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoaded({
          key: requestKey,
          data: null,
          error: error instanceof ApiError ? error.message : 'No se pudieron cargar las noticias.',
          errorCode: error instanceof ApiError ? error.code : 'error',
        });
      });

    return () => controller.abort();
  }, [fetcher, requestKey]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const settled = loaded.key === requestKey;

  return {
    data: settled ? loaded.data : null,
    loading: !settled,
    error: settled ? loaded.error : null,
    errorCode: settled ? loaded.errorCode : null,
    reload,
  };
}

export function useArticles(query: ArticleQuery) {
  /* Se serializa el filtro para que el fetcher solo cambie cuando cambia el
     contenido de la consulta, no cuando el objeto se vuelve a crear. */
  const key = JSON.stringify(query);

  const fetcher = useCallback(
    (signal: AbortSignal) => api.articles(JSON.parse(key) as ArticleQuery, signal),
    [key],
  );

  return useAsync<Paginated<Article>>(`articles:${key}`, fetcher);
}

export function useArticle(slug: string | undefined) {
  const fetcher = useCallback(
    (signal: AbortSignal) =>
      slug
        ? api.article(slug, signal)
        : Promise.reject(new ApiError('No encontrado.', 'not_found', 404)),
    [slug],
  );

  return useAsync<Article>(`article:${slug ?? ''}`, fetcher);
}

export function useFeatured() {
  const fetcher = useCallback((signal: AbortSignal) => api.featured(signal), []);
  return useAsync<{ results: Article[] }>('featured', fetcher);
}

export function useLatest(limit = 12) {
  const fetcher = useCallback((signal: AbortSignal) => api.latest(limit, signal), [limit]);
  return useAsync<{ results: Article[] }>(`latest:${limit}`, fetcher);
}

export function useCategories() {
  const fetcher = useCallback((signal: AbortSignal) => api.categories(signal), []);
  return useAsync<Category[]>('categories', fetcher);
}

export function useBanners() {
  const fetcher = useCallback((signal: AbortSignal) => api.banners(signal), []);
  return useAsync<Banner[]>('banners', fetcher);
}

export function useSources() {
  const fetcher = useCallback((signal: AbortSignal) => api.sources(signal), []);
  return useAsync<Source[]>('sources', fetcher);
}
