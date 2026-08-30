import { useEffect } from 'react';
import { SITE_URL } from '../lib/api';

/* SEO en tiempo de ejecución, para la navegación dentro de la SPA.

   Las cargas directas ya reciben el <head> completo: las páginas fijas lo
   traen del HTML que genera `scripts/ssg-meta.mjs`, y las notas lo reciben de
   `server.js`, que consulta la API e inyecta los meta antes de responder.
   Esto de aquí cubre el caso restante — el lector que llega navegando — y
   restaura lo anterior al desmontar para no dejar rastros de una página en
   otra. */

type Seo = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  section?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
};

function setMeta(selector: string, attribute: 'content', value: string): string | null {
  const element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) return null;
  const previous = element.getAttribute(attribute);
  element.setAttribute(attribute, value);
  return previous;
}

export function usePageSeo(input: Seo | null) {
  /* El objeto llega recién creado en cada render. Se compara por contenido
     para que el efecto solo vuelva a correr cuando los meta cambian de verdad
     y no en cada repintado. */
  const key = input ? JSON.stringify(input) : null;

  useEffect(() => {
    if (!key) return;
    const seo = JSON.parse(key) as Seo;

    const url = `${SITE_URL}${seo.path}`;
    const image = seo.image || `${SITE_URL}/img/og.png`;

    const previousTitle = document.title;
    document.title = seo.title;

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute('href') ?? null;
    canonical?.setAttribute('href', url);

    const restore: Array<[string, string | null]> = [
      ['meta[name="description"]', setMeta('meta[name="description"]', 'content', seo.description)],
      ['meta[property="og:title"]', setMeta('meta[property="og:title"]', 'content', seo.title)],
      ['meta[property="og:description"]', setMeta('meta[property="og:description"]', 'content', seo.description)],
      ['meta[property="og:url"]', setMeta('meta[property="og:url"]', 'content', url)],
      ['meta[property="og:image"]', setMeta('meta[property="og:image"]', 'content', image)],
      ['meta[property="og:type"]', setMeta('meta[property="og:type"]', 'content', seo.type ?? 'website')],
      ['meta[name="twitter:title"]', setMeta('meta[name="twitter:title"]', 'content', seo.title)],
      ['meta[name="twitter:description"]', setMeta('meta[name="twitter:description"]', 'content', seo.description)],
      ['meta[name="twitter:image"]', setMeta('meta[name="twitter:image"]', 'content', image)],
      ['meta[name="robots"]', setMeta('meta[name="robots"]', 'content', seo.noIndex ? 'noindex, follow' : 'index, follow')],
    ];

    let script: HTMLScriptElement | null = null;
    if (seo.jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.runtime = 'true';
      script.text = JSON.stringify(seo.jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      if (previousCanonical) canonical?.setAttribute('href', previousCanonical);
      for (const [selector, value] of restore) {
        if (value !== null) setMeta(selector, 'content', value);
      }
      script?.remove();
    };
  }, [key]);
}
