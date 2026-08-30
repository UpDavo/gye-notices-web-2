/* Post-build: escribe un index.html por página fija, con sus meta ya puestos.

   Solo cubre las páginas cuyo contenido no cambia entre despliegues. Las notas
   NO se pre-generan: nacen y caducan cada hora, y un HTML congelado en el
   momento del build quedaría viejo en minutos. De esas se encarga `server.js`,
   que consulta la API al momento de servir.

   Se ejecuta solo tras `vite build`, vía el script `build` de package.json. */

import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const SITE_URL = (process.env.SITE_URL || 'https://elguayasense.com').replace(/\/$/, '');
const OG_IMAGE = `${SITE_URL}/img/og.png`;

const PAGES = [
  {
    outPath: 'noticias/index.html',
    title: 'Todas las noticias — El Guayasense',
    description:
      'La edición completa: todo lo que publican los medios de Guayaquil, con crédito y enlace al artículo original.',
    canonical: `${SITE_URL}/noticias`,
    ogType: 'website',
  },
  {
    outPath: 'medios/index.html',
    title: 'Medios y cómo trabajamos — El Guayasense',
    description:
      'De qué medios sale el contenido de El Guayasense y con qué reglas se agrega: solo titular y extracto, enlace al original y salida inmediata a petición.',
    canonical: `${SITE_URL}/medios`,
    ogType: 'website',
  },
  {
    outPath: 'privacidad/index.html',
    title: 'Política de privacidad — El Guayasense',
    description:
      'Qué datos recoge El Guayasense y cómo los trata, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.',
    canonical: `${SITE_URL}/privacidad`,
    ogType: 'article',
  },
  {
    outPath: 'terminos/index.html',
    title: 'Términos y condiciones — El Guayasense',
    description:
      'Condiciones de uso de El Guayasense, agregador de noticias de la ciudad, y cómo se trata el contenido de los medios.',
    canonical: `${SITE_URL}/terminos`,
    ogType: 'article',
  },
];

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

/* Se sustituye el valor del meta existente en vez de añadir uno nuevo: dos
   `og:title` en la misma página dejan la vista previa a criterio del
   rastreador. */
function replaceMeta(html, attribute, name, value) {
  const pattern = new RegExp(`(<meta ${attribute}="${name}" content=")[^"]*(")`, 'i');
  if (!pattern.test(html)) {
    console.warn(`[ssg-meta] aviso: no se encontró <meta ${attribute}="${name}"> en index.html`);
    return html;
  }
  return html.replace(pattern, `$1${escapeHtml(value)}$2`);
}

const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

for (const page of PAGES) {
  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/i, `$1${page.canonical}$2`);

  html = replaceMeta(html, 'name', 'description', page.description);
  html = replaceMeta(html, 'property', 'og:type', page.ogType);
  html = replaceMeta(html, 'property', 'og:url', page.canonical);
  html = replaceMeta(html, 'property', 'og:title', page.title);
  html = replaceMeta(html, 'property', 'og:description', page.description);
  html = replaceMeta(html, 'property', 'og:image', OG_IMAGE);
  html = replaceMeta(html, 'name', 'twitter:title', page.title);
  html = replaceMeta(html, 'name', 'twitter:description', page.description);
  html = replaceMeta(html, 'name', 'twitter:image', OG_IMAGE);

  const outFile = join(DIST, page.outPath);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html, 'utf-8');
  console.log(`[ssg-meta] ✓ ${page.outPath}`);
}

console.log('[ssg-meta] listo. El sitemap y las notas los sirven las Pages Functions.');
