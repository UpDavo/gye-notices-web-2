/* Cliente de la API de noticias (Django REST).

   Un solo lugar decide la URL base, la forma del error y los tipos. Si el
   backend cambia el envelope, se cambia aquí y no en cada pantalla. */

import { environment } from '../environments/environment';

/* `environment.ts` lo genera `scripts/set-env.js` en cada build a partir de
   `.env` (local) o de `process.env` (Cloudflare Pages). Es el mismo mecanismo
   que usan los demás frontends de la casa. */
export const API_URL = environment.apiUrl;
export const SITE_URL = environment.siteUrl;

/* El slug de ESTA web. Va en cada petición: el backend reparte las notas entre
   varios sitios y sin él la API devolvería también las de la otra. */
export const SITE_SLUG = environment.siteSlug;

export type Site = {
  slug: string;
  name: string;
  domain: string;
  description: string;
};

export type Banner = {
  key: string;
  title: string;
  subtitle: string;
  alt: string;
  image_url: string;
  image_url_mobile: string;
  link_url: string;
  open_in_new_tab: boolean;
  order: number;
};

export type Source = {
  slug: string;
  name: string;
  homepage_url: string;
  logo_url: string;
  domain: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  color: string;
  order: number;
  show_in_nav: boolean;
  article_count?: number;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  image_url: string;
  image_credit: string;
  /* El enlace al medio original. Es obligatorio en cada tarjeta: es la
     contraparte de agregar la nota. */
  canonical_url: string;
  credit: string;
  published_at: string;
  is_featured: boolean;
  tags: string[];
  source: Source;
  category: Category | null;
  view_count?: number;
  language?: string;
  fetched_at?: string;
};

export type Paginated<T> = {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ArticleQuery = {
  category?: string;
  source?: string;
  q?: string;
  featured?: boolean;
  page?: number;
  page_size?: number;
};

/* El backend responde los errores siempre con la misma forma:
   { success: false, error: { code, message } }. */
export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'error', status = 0) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, params?: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '' && value !== false) {
      query.set(key, String(value));
    }
  }

  /* Se fija al final para que ninguna pantalla pueda pedir por error las notas
     de la otra web: el `site` no es un filtro más, es el alcance de la API. */
  query.set('site', SITE_SLUG);

  const suffix = `?${query}`;
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api${path}${suffix}`, {
      signal,
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    // Un AbortError es una navegación, no un fallo: se deja pasar para que el
    // hook lo ignore en vez de pintar un mensaje de error.
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError('No se pudo conectar con el servidor de noticias.', 'network_error');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const error = body?.error;
    throw new ApiError(
      error?.message ?? 'Ocurrió un error al cargar las noticias.',
      error?.code ?? 'error',
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  articles: (query: ArticleQuery = {}, signal?: AbortSignal) =>
    request<Paginated<Article>>('/news/articles/', query, signal),

  article: (slug: string, signal?: AbortSignal) =>
    request<Article>(`/news/articles/${slug}/`, undefined, signal),

  featured: (signal?: AbortSignal) =>
    request<{ results: Article[] }>('/news/articles/featured/', undefined, signal),

  latest: (limit = 12, signal?: AbortSignal) =>
    request<{ results: Article[] }>('/news/articles/latest/', { limit }, signal),

  categories: (signal?: AbortSignal) =>
    request<Category[]>('/news/categories/', undefined, signal),

  sources: (signal?: AbortSignal) =>
    request<Source[]>('/news/sources/', undefined, signal),

  banners: (signal?: AbortSignal) =>
    request<Banner[]>('/news/banners/', undefined, signal),
};
