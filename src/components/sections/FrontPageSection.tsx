import { Link } from 'react-router-dom';
import { useArticles, useFeatured } from '../../hooks/useNews';
import { ArticleCard } from '../news/ArticleCard';
import { CardSkeleton, EmptyState, ErrorState } from '../news/States';

/* La portada, compuesta a tres columnas.

   La nota principal ocupa las dos de la izquierda y la tercera es la columna
   de breves, separada por una línea vertical — la retícula clásica de una
   primera plana. Debajo, una banda de cuatro notas separadas por filetes.

   No hay `Reveal` en esta sección a propósito. En la web hermana las tarjetas
   entran con desenfoque al hacer scroll; aquí la portada tiene que estar
   compuesta y quieta desde el primer frame, como una plana impresa. El
   movimiento se reserva para el cintillo. */

export function FrontPageSection() {
  const featured = useFeatured();
  const latest = useArticles({ page_size: 12 });

  const loading = featured.loading || latest.loading;
  const error = latest.error;

  const pool = featured.data?.results?.length ? featured.data.results : (latest.data?.results ?? []);

  /* La principal ocupa media plana, así que se prefiere una que traiga foto:
     sin ella el bloque queda como un titular suelto en mitad de la página. */
  const leadIndex = Math.max(0, pool.findIndex((article) => article.image_url));
  const lead = pool[leadIndex];
  const rest = pool.filter((_, i) => i !== leadIndex);

  const used = new Set([lead?.slug, ...rest.slice(0, 4).map((a) => a.slug)].filter(Boolean));
  const briefs = (latest.data?.results ?? []).filter((a) => !used.has(a.slug)).slice(0, 6);

  return (
    <section id="portada" className="px-4 md:px-8 lg:px-12 py-8 scroll-mt-14">
      <div className="max-w-[1200px] mx-auto">
        {error && <ErrorState message={error} onRetry={latest.reload} />}

        {!error && loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CardSkeleton variant="lead" />
            </div>
            <div className="flex flex-col gap-6">
              <CardSkeleton variant="compact" />
              <CardSkeleton variant="compact" />
              <CardSkeleton variant="compact" />
            </div>
          </div>
        )}

        {!error && !loading && !lead && (
          <EmptyState
            title="Todavía no hay edición"
            message="No se ha traído ninguna nota. Corre `python manage.py scrape_news` en el backend."
          />
        )}

        {!error && !loading && lead && (
          <>
            <div className="col-rules grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-0">
              <div className="lg:col-span-2 md:pr-8">
                <ArticleCard article={lead} variant="lead" eager />
              </div>

              <aside className="md:pl-8">
                <h2 className="font-display font-bold text-sm uppercase tracking-[0.2em] text-foreground m-0 pb-2 mb-4 border-b-2 border-[hsl(var(--rule))]">
                  En breve
                </h2>
                <div className="flex flex-col">
                  {briefs.map((article, i) => (
                    <div key={article.slug} className={i > 0 ? 'rule-thin pt-4 mt-4' : ''}>
                      <ArticleCard article={article} variant="compact" />
                    </div>
                  ))}
                </div>
              </aside>
            </div>

            {rest.length > 0 && (
              <>
                <div className="rule-double my-8" aria-hidden="true" />
                <div className="col-rules grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0">
                  {rest.slice(0, 4).map((article) => (
                    <div key={article.slug} className="md:px-5 first:md:pl-0 last:md:pr-0">
                      <ArticleCard article={article} />
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-center mt-10">
              <Link
                to="/noticias"
                className="border border-[hsl(var(--rule))] px-8 py-2.5 text-[13px] uppercase tracking-[0.16em] text-foreground no-underline hover:bg-accent hover:text-white hover:border-accent transition-colors"
              >
                Toda la edición
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
