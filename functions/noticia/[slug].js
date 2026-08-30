/* Meta por nota, en el borde de Cloudflare.
 *
 * Un SPA le entrega un `<div id="root">` vacío al rastreador de WhatsApp o
 * Facebook, que no ejecuta JavaScript. Para una nota compartida eso significa
 * una vista previa sin título ni foto, que es justo la mitad del valor de
 * compartirla.
 *
 * Esta Function consulta la API, reescribe los meta del HTML base y lo
 * devuelve. Cloudflare NO aplica las reglas de `_redirects` a las rutas que
 * sirve una Function, así que la regla comodín del SPA no la pisa.
 *
 * Si la API no contesta a tiempo se devuelve el HTML base tal cual: la vista
 * previa sale pobre, pero la página abre igual.
 *
 * Variables del proyecto en Cloudflare Pages: API_URL, SITE_URL.
 */

const TIMEOUT_MS = 2500;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Se sustituye el valor del meta que ya existe en vez de añadir uno nuevo: dos
   `og:title` en la misma página dejan la vista previa a criterio del
   rastreador. */
function replaceMeta(html, attribute, name, value) {
  const pattern = new RegExp(`(<meta ${attribute}="${name}" content=")[^"]*(")`, 'i');
  return html.replace(pattern, `$1${escapeHtml(value)}$2`);
}

async function fetchArticle(apiUrl, slug, siteSlug) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // El `site` no es opcional: el backend alimenta varias webs y sin él
    // esta Function podría servir los meta de una nota que le tocó a la otra.
    const url = `${apiUrl}/api/news/articles/${encodeURIComponent(slug)}/`
      + `?site=${encodeURIComponent(siteSlug)}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequestGet(context) {
  const { request, env, params } = context;

  const apiUrl = (env.API_URL || '').replace(/\/$/, '');
  const siteUrl = (env.SITE_URL || new URL(request.url).origin).replace(/\/$/, '');
  const siteSlug = env.SITE_SLUG || 'guayaco';

  // `ASSETS` sirve el build estático. Se pide la ruta "bonita" (`/`), no
  // `/index.html`: es lo que espera el binding.
  const assetResponse = await env.ASSETS.fetch(new URL('/', request.url));
  const baseHtml = await assetResponse.text();

  const article = apiUrl ? await fetchArticle(apiUrl, params.slug, siteSlug) : null;

  if (!article) {
    return new Response(baseHtml, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' },
    });
  }

  const url = `${siteUrl}/noticia/${article.slug}`;
  const title = `${article.title} — El Guayasense`;
  const description = article.excerpt || `Publicado por ${article.source.name}.`;
  const image = article.image_url || `${siteUrl}/img/og.png`;

  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/i, `$1${url}$2`);

  html = replaceMeta(html, 'name', 'description', description);
  html = replaceMeta(html, 'property', 'og:type', 'article');
  html = replaceMeta(html, 'property', 'og:url', url);
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', description);
  html = replaceMeta(html, 'property', 'og:image', image);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', description);
  html = replaceMeta(html, 'name', 'twitter:image', image);

  /* `author` y `publisher` son el MEDIO, no este sitio, e `isBasedOn` apunta al
     artículo original. Decir otra cosa aquí sería atribuirse contenido ajeno
     en los datos estructurados. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description,
    datePublished: article.published_at,
    image,
    articleSection: article.category?.name,
    inLanguage: 'es-EC',
    author: { '@type': 'Organization', name: article.source.name, url: article.source.homepage_url },
    publisher: { '@type': 'Organization', name: article.source.name, url: article.source.homepage_url },
    isBasedOn: article.canonical_url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>\n  </head>`,
  );

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Cinco minutos en el borde: suficiente para absorber una nota que se
      // comparte mucho, corto para que una corrección del titular se vea.
      'Cache-Control': 'public, max-age=0, s-maxage=300',
    },
  });
}
