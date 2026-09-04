import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ArticleCard } from '../components/news/ArticleCard';
import { SourceCredit } from '../components/news/SourceCredit';
import { CardSkeleton, ErrorState } from '../components/news/States';
import { Aviso } from '../components/avisos/Aviso';
import { useArticle, useArticles } from '../hooks/useNews';
import { usePageSeo } from '../hooks/usePageSeo';
import { formatDateTime, timeAgo, singleLine } from '../lib/format';
import { SITE_URL } from '../lib/api';

/* La página de una nota.

   Muestra titular, extracto e imagen, y manda al medio. No hay cuerpo del
   artículo aquí, y no es un descuido: el texto completo es del medio que lo
   escribió, así que el enlace de salida es el elemento principal de la
   página, no un pie de foto. */

function NotFound() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
        <p className="text-muted-foreground text-sm uppercase tracking-widest m-0 mb-4">404</p>
        <h1 className="font-display font-bold text-4xl text-foreground mb-4 tracking-tight">
          Esta nota salió de circulación
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Puede que se haya retirado del archivo, o que el enlace esté mal compuesto.
        </p>
        <Link
          to="/noticias"
          className="rounded-none px-7 py-3 text-sm font-semibold bg-accent text-white hover:opacity-90 transition-opacity no-underline"
        >
          Ir a la edición
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  /* La foto la sirve el medio; si su CDN falla, se retira la figura entera en
     vez de dejar el icono de imagen rota sobre el titular. Se guarda el slug
     que falló y no un booleano: así al navegar a otra nota el estado caduca
     solo, sin tener que reiniciarlo desde un efecto. */
  const [imageFailedFor, setImageFailedFor] = useState<string | null>(null);
  const imageFailed = imageFailedFor === slug;
  const { data: article, loading, error, errorCode, reload } = useArticle(slug);

  /* Relacionadas: misma sección, sin repetir la que se está leyendo. Se piden
     seis para llenar la columna lateral aunque la actual esté en el grupo. */
  const related = useArticles(
    article?.category ? { category: article.category.slug, page_size: 6 } : { page_size: 6 },
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  usePageSeo(
    article
      ? {
          title: `${article.title} — El Guayasense`,
          description: singleLine(article.excerpt),
          path: `/noticia/${article.slug}`,
          image: article.image_url || undefined,
          type: 'article',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            description: singleLine(article.excerpt),
            datePublished: article.published_at,
            image: article.image_url || `${SITE_URL}/img/og.png`,
            articleSection: article.category?.name,
            inLanguage: 'es-EC',
            /* El autor y el editor son del medio, no de este sitio. Decir otra
               cosa aquí sería atribuirse contenido ajeno en los datos
               estructurados. */
            author: { '@type': 'Organization', name: article.source.name, url: article.source.homepage_url },
            publisher: { '@type': 'Organization', name: article.source.name, url: article.source.homepage_url },
            isBasedOn: article.canonical_url,
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/noticia/${article.slug}` },
          },
        }
      : null,
  );

  if (!loading && (error || !article)) {
    /* Un 404 es una nota que no existe y merece su propia pantalla; cualquier
       otro fallo es del servidor o de la red, y ahí lo que toca es ofrecer
       reintentar. */
    if (error && errorCode !== 'not_found') {
      return (
        <div className="flex flex-col bg-background min-h-screen">
          <Navbar />
          <main className="flex-1 pt-10 px-4 md:px-8 lg:px-12">
            <div className="max-w-3xl mx-auto">
              <ErrorState message={error} onRetry={reload} />
            </div>
          </main>
          <Footer />
        </div>
      );
    }
    return <NotFound />;
  }

  const relatedArticles = (related.data?.results ?? [])
    .filter((item) => item.slug !== slug)
    .slice(0, 5);

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 lg:px-12 pt-10">
        {/* Dos columnas, como la portada: la nota manda y la columna lateral
            recoge lo demás. A una sola columna centrada esta página quedaba
            con una mancha estrecha y medio ancho vacío, porque aquí no hay
            cuerpo de artículo que lo llene. */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
          <div className="min-w-0">
            <header>
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link
                  to="/noticias"
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors no-underline flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  Noticias
                </Link>
                {article?.category && (
                  <>
                    <span className="text-muted-foreground/50" aria-hidden="true">/</span>
                    <Link
                      to={`/seccion/${article.category.slug}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-accent bg-accent/10 rounded-none px-3 py-1 no-underline hover:bg-accent/20 transition-colors"
                    >
                      {article.category.name}
                    </Link>
                  </>
                )}
              </div>

              {loading || !article ? (
                <div className="animate-pulse flex flex-col gap-4" aria-hidden="true">
                  <div className="h-9 rounded bg-muted w-full" />
                  <div className="h-9 rounded bg-muted w-3/4" />
                  <div className="h-3 rounded bg-muted w-40 mt-2" />
                </div>
              ) : (
                <>
                  <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-[3.2rem] text-foreground leading-[1.06] m-0 mb-5">
                    {article.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                    <SourceCredit article={article} variant="link" />
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.published_at} title={formatDateTime(article.published_at)}>
                      {timeAgo(article.published_at)}
                    </time>
                    {article.author && article.author !== article.source.name && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{article.author}</span>
                      </>
                    )}
                  </div>
                </>
              )}
            </header>

            {article?.image_url && !imageFailed && (
              <figure className="mt-8 mb-10 m-0">
                <img
                  src={article.image_url}
                  alt=""
                  onError={() => setImageFailedFor(slug ?? null)}
                  className="w-full max-h-[520px] object-cover rounded-none"
                />
                <figcaption className="text-xs text-muted-foreground mt-3">
                  {article.image_credit || `Imagen: ${article.source.name}`}
                </figcaption>
              </figure>
            )}

            {article && (
              <article className="pb-4">
                {/* El extracto se queda en medida de lectura aunque la columna
                    sea ancha: una línea de 150 caracteres no se lee.

                    `whitespace-pre-line` es lo que hace que los párrafos que
                    trajo el scraper se vean como párrafos: vienen separados por
                    una línea en blanco y el HTML, por defecto, los colapsaría
                    en un bloque corrido. */}
                <p className="dropcap whitespace-pre-line font-body text-lg text-foreground/85 leading-relaxed m-0 mb-10 max-w-[60ch]">
                  {article.excerpt}
                </p>

                {/* La salida al medio original. Es el elemento principal de la
                    página: aquí no hay más texto que leer. */}
                <SourceCredit article={article} variant="block" className="mb-6" />

                {/* El faldón de cierre: después de la salida al medio, cuando
                    ya no queda nada que leer. */}
                <Aviso espacio="nota-faldon" className="mt-10" />
              </article>
            )}
          </div>

          {/* Columna lateral. Se queda pegada al hacer scroll: la nota es corta,
              pero la lista de al lado sigue siendo útil al llegar al final. */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rule-double mb-6" aria-hidden="true" />
            <h2 className="font-display font-bold text-xl text-foreground m-0 mb-6">
              Más de la ciudad
            </h2>
            {related.loading ? (
              <div className="flex flex-col gap-5">
                {Array.from({ length: 3 }, (_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <ul className="list-none m-0 p-0 flex flex-col gap-5">
                {relatedArticles.map((item) => (
                  <li key={item.slug} className="pb-5 border-b border-border last:border-0 last:pb-0">
                    <ArticleCard article={item} variant="compact" />
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/noticias"
              className="inline-flex items-center gap-2 mt-8 rounded-none px-6 py-2.5 text-[13px] uppercase tracking-[0.14em] border border-border text-foreground no-underline hover:border-accent/50 hover:text-accent transition-colors"
            >
              Toda la edición
              <ArrowRight size={15} aria-hidden="true" />
            </Link>

            <Aviso espacio="nota-columna" className="mt-10" />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
