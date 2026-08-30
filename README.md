# El Guayasense — web2

Frontend del segundo diario. Mismo stack que la web hermana — Vite + React 19 +
TypeScript + Tailwind v4 + framer-motion — y las mismas primitivas, pero
compuesto como un **periódico impreso**: papel crema, titulares en serif, tinta
roja, reglas horizontales y cero esquinas redondeadas.

> La web hermana, [`../web`](../web), es lo contrario: blanco, celeste, aireada y
> redondeada. Comparten backend y **se reparten las noticias**: una nota que sale
> aquí no sale allá. Ver el [README raíz](../README.md).

Diferencias estructurales, no solo de color:

| | `web` | `web2` (este) |
|---|---|---|
| Cabecera | Píldora de vidrio flotante | Mancheta con raya doble + barra de secciones pegajosa |
| Apertura | Carrusel con rótulo sobre la imagen | Carrusel con **pie de foto debajo**, filete rojo e indicadores cuadrados |
| Nota | Tarjeta con borde y sombra suave | Sin caja: reglas y filetes verticales |
| Titular | Sans, `tracking-tight` | Serif, 3 columnas + columna de breves |
| Fotos | A color | Casi en escala de grises; recuperan color al pasar el puntero |
| Entrada | `Reveal` con desenfoque al hacer scroll | Ninguna: una plana se lee quieta |

No tiene contenido propio: todo lo pinta desde la API de Django que vive en
[`../web-backend`](../web-backend).

---

## Arrancar

```bash
npm install
npm run dev            # http://localhost:5173
```

`vite.config.ts` proxea `/api` a `http://127.0.0.1:8000`, así que en desarrollo
el backend y el frontend comparten origen y CORS no estorba. Levanta primero el
backend:

```bash
cd ../web-backend && ./venv/bin/python manage.py runserver
```

> Usa `http://localhost:5173`, no `http://127.0.0.1:5173`: Vite solo escucha en
> el primero por defecto.

## Variables de entorno

Mismo mecanismo que el resto de frontends de la casa: `scripts/set-env.js` lee
`.env` (local) o `process.env` (nube) y genera `src/environments/environment.ts`
antes de cada build. **No se usa `import.meta.env`.**

Copia `.env.example` a `.env`:

| Variable | Para qué |
|---|---|
| `API_URL` | Base de la API. **Vacío en desarrollo** (lo cubre el proxy de Vite). En Cloudflare, `https://api.guayashoy.com` (la misma API para las dos webs). |
| `SITE_URL` | Dominio público del sitio. Alimenta canonical, Open Graph y sitemap. |

`src/environments/environment.ts` está en `.gitignore`: se genera, no se
edita. Si tu editor se queja de que no existe, corre `npm run set-env` una vez.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | `set-env` + servidor de desarrollo con HMR |
| `npm run build` | `set-env` + `tsc -b` + `vite build` + `scripts/ssg-meta.mjs` |
| `npm run preview` | Sirve el build de Vite (sin Functions: sin meta por nota ni sitemap) |
| `npm run lint` | ESLint |

---

## Cómo se resuelve el SEO

Un SPA le entrega un `<div id="root">` vacío al rastreador de WhatsApp o
Facebook, que no ejecuta JavaScript. Aquí eso se cubre en tres capas, cada una
para un caso distinto:

| Capa | Cubre | Dónde |
|---|---|---|
| `scripts/ssg-meta.mjs` | Páginas fijas (`/noticias`, `/medios`, `/privacidad`, `/terminos`). Escribe un `index.html` por página. | build |
| `functions/noticia/[slug].js` | **Notas.** Consulta la API y escribe título, descripción, imagen y JSON-LD antes de responder. | Pages Function |
| `functions/sitemap.xml.js` | `sitemap.xml` con todas las notas vigentes. | Pages Function |
| `usePageSeo` | Navegación dentro del SPA, una vez cargada la app. | runtime |

Las notas **no** se pre-generan en el build a propósito: nacen y caducan cada
hora, y un HTML congelado en el despliegue quedaría viejo en minutos. Por el
mismo motivo el `sitemap.xml` se arma al vuelo desde `/api/news/sitemap/`.

En el JSON-LD de cada nota, `author` y `publisher` son **el medio de origen**, no
este sitio, y `isBasedOn` apunta al artículo original. Decir otra cosa sería
atribuirse contenido ajeno en los datos estructurados.

---

## Estructura

```
functions/               Cloudflare Pages Functions (SEO dinámico, ver más abajo)
├── noticia/[slug].js    Meta y JSON-LD por nota
└── sitemap.xml.js       Sitemap al vuelo desde la API

src/
├── environments/        environment.ts — GENERADO por scripts/set-env.js
├── lib/
│   ├── api.ts          Cliente de la API: URL base, tipos y forma del error, en un solo sitio
│   └── format.ts       Fechas en es-EC y antigüedad relativa («hace 20 min»)
├── hooks/
│   ├── useNews.ts      useArticles / useArticle / useCategories / useSources
│   ├── useTheme.ts     Claro ↔ oscuro, persistido en localStorage
│   └── usePageSeo.ts   Meta en tiempo de ejecución
├── components/
│   ├── HeroBanners.tsx  El hero: banners del backend, sin animación
│   ├── news/           El módulo de noticias: tarjeta, rejilla, paginación, crédito, estados
│   ├── sections/       Bloques de la portada
│   ├── hero/           Hero con salida scroll-driven
│   └── ui/             Reveal, Eyebrow, TextScrollReveal
└── pages/              Una por ruta
```

### Rutas

| Ruta | Página |
|---|---|
| `/` | Portada |
| `/noticias` | Archivo completo, con búsqueda (`?q=`) y paginación (`?page=`) |
| `/seccion/:slug` | Una sección |
| `/noticia/:slug` | Una nota |
| `/medios` | Fuentes y reglas de agregación |
| `/privacidad`, `/terminos` | Legales |

El estado de búsqueda y paginación vive en la URL, no en el componente: así la
página se comparte, se recarga igual y el botón atrás hace lo que el lector
espera.

---

## El crédito no es opcional

`SourceCredit` no tiene un modo sin enlace. Cada tarjeta y cada nota muestran el
nombre del medio y llevan a su artículo original, porque es la contraparte de
agregar contenido ajeno. La página de una nota **no tiene cuerpo de artículo**:
el elemento principal es el botón de salida al medio.

Si en algún momento cambias esto, cambia también `/medios` y `/terminos`, que
son donde el sitio declara estas reglas.

---

## Diseño

El sistema completo está en [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md). Lo esencial:

- Tokens en `src/index.css`. Claro por defecto, oscuro con `html.dark`.
- Acento celeste `hsl(200 98% 39%)`, bajado de luminosidad para pasar AA sobre blanco.
- Los neutrales llevan tinte azul (205–213), nunca gris puro.
- Botones `rounded-full`, sin gradiente ni sombra.
- Tarjetas opacas (`bg-surface`); vidrio solo en la barra flotante.
- Todo título `tracking-tight`; toda micro-etiqueta `uppercase tracking-widest`.

---

## Desplegar en Cloudflare Pages

Es un sitio estático (`dist/`) más dos Pages Functions.

**Configuración del proyecto en Cloudflare Pages**

| Campo | Valor |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `web` (si el repo contiene también el backend) |

**Variables de entorno del proyecto**

```
API_URL   = https://api.guayashoy.com
SITE_URL  = https://elguayasense.com
```

Las dos se usan **dos veces** y por eso basta declararlas una vez en el
proyecto: en el build las lee `set-env.js` y quedan dentro del bundle, y en
tiempo de ejecución las leen las Functions (`context.env`) para los meta y el
sitemap.

**El backend tiene que permitir el origen.** En el servicio de Django:

```
CORS_ALLOWED_ORIGINS=https://guayashoy.com,https://elguayasense.com
```

### `public/_redirects`

```
/noticias    /noticias/    200
/medios      /medios/      200
/privacidad  /privacidad/  200
/terminos    /terminos/    200
/*           /index.html   200
```

Dos detalles que cuestan una tarde si no se saben:

1. **Las cuatro primeras líneas no son opcionales.** Cloudflare sigue los
   redirects *aunque exista un asset que coincida con la ruta*, así que el
   comodín se tragaría los `index.html` que genera `ssg-meta` y todas esas
   páginas servirían el HTML genérico.
2. **El destino es la ruta con barra final**, no `/noticias/index.html`.
   Cloudflare no expone el archivo directamente: apuntar ahí devuelve una
   respuesta vacía.

`/noticia/:slug` y `/sitemap.xml` no aparecen en el archivo porque los sirven
las Functions, y Cloudflare **no aplica los redirects a lo que sirve una
Function** — por eso el comodín no las pisa.

### Probar el build de Cloudflare en local

```bash
npm run build
npx wrangler pages dev dist \
  --binding API_URL=http://127.0.0.1:8000 SITE_URL=http://localhost:8788
```

Levanta en `:8788` con las Functions activas. Para que el navegador pueda
llamar a la API, añade `http://localhost:8788` a `CORS_ALLOWED_ORIGINS` del
backend (ya está en `newsroom/environ.env.example`).

> `--binding` solo alimenta a las Functions. `API_URL` se hornea en el bundle
> durante `npm run build`, así que tiene que estar también en `.env` antes de
> compilar.
# gye-notices-web-2
