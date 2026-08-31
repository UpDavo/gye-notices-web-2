/* sitemap.xml generado al vuelo desde la API.
 *
 * No se genera en el build a propósito: las notas nacen y caducan cada hora, y
 * un sitemap congelado en el momento del despliegue nace viejo.
 *
 * Variables del proyecto en Cloudflare Pages: API_URL, SITE_URL.
 */

const TIMEOUT_MS = 3000;

async function fetchSitemapData(apiUrl, siteSlug) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // Solo las notas de ESTA web: anunciar las de la otra llevaría al
    // buscador a un 404.
    const response = await fetch(
      `${apiUrl}/api/news/sitemap/?site=${encodeURIComponent(siteSlug)}`, {
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

/* Igual que la Function de nota: Cloudflare no cachea sola lo que devuelve una
 * Function, hay que guardarlo en la Cache API. Aquí pesa más todavía, porque
 * cada sitemap lleva cientos de notas y lo piden los rastreadores en ráfaga.
 */
export async function onRequestGet(context) {
  const { request, env } = context;

  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  const apiUrl = (env.API_URL || '').replace(/\/$/, '');
  const siteUrl = (env.SITE_URL || new URL(request.url).origin).replace(/\/$/, '');
  const siteSlug = env.SITE_SLUG || 'guayaco';
  const today = new Date().toISOString().split('T')[0];

  const data = apiUrl ? await fetchSitemapData(apiUrl, siteSlug) : null;

  const urls = [
    { loc: `${siteUrl}/`, lastmod: today, changefreq: 'hourly', priority: '1.0' },
    { loc: `${siteUrl}/noticias`, lastmod: today, changefreq: 'hourly', priority: '0.9' },
    { loc: `${siteUrl}/medios`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    { loc: `${siteUrl}/privacidad`, lastmod: today, changefreq: 'yearly', priority: '0.3' },
    { loc: `${siteUrl}/terminos`, lastmod: today, changefreq: 'yearly', priority: '0.3' },
    ...(data?.categories ?? []).map((slug) => ({
      loc: `${siteUrl}/seccion/${slug}`,
      lastmod: today,
      changefreq: 'hourly',
      priority: '0.8',
    })),
    ...(data?.articles ?? []).map((article) => ({
      loc: `${siteUrl}/noticia/${article.slug}`,
      lastmod: article.lastmod,
      changefreq: 'weekly',
      priority: '0.7',
    })),
  ];

  const body = urls
    .map(
      ({ loc, lastmod, changefreq, priority }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
    )
    .join('\n');

  const response = new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=900',
      },
    },
  );

  // Solo si la API respondió. Un sitemap con las páginas fijas y ninguna nota
  // es válido pero está incompleto, y cachearlo quince minutos se lo daría así
  // a Google.
  if (data) context.waitUntil(cache.put(request, response.clone()));

  return response;
}
