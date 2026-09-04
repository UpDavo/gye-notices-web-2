import { Link } from 'react-router-dom';
import { useFeatured } from '../../hooks/useNews';
import { splitByImage, takeBriefs } from '../../lib/articles';
import { ArticleCard } from '../news/ArticleCard';
import { CardSkeleton, EmptyState, ErrorState } from '../news/States';
import { Aviso } from '../avisos/Aviso';

/* La portada, compuesta a tres columnas.

   La nota principal ocupa las dos de la izquierda y la tercera es la columna
   de breves, separada por una línea vertical — la retícula clásica de una
   primera plana. Debajo, una banda de cuatro notas separadas por filetes.

   El reparto lo decide la foto. La plana y la banda son bloques ilustrados:
   una nota sin imagen puesta ahí deja un hueco donde las de al lado tienen
   material. Las que no traen foto bajan a la columna de breves, que es
   exactamente para lo que existe desde que hay periódicos: el titular corto
   sin fotografía. Dentro de cada bloque sigue mandando la fecha.

   No hay `Reveal` en esta sección a propósito. En la web hermana las tarjetas
   entran con desenfoque al hacer scroll; aquí la portada tiene que estar
   compuesta y quieta desde el primer frame, como una plana impresa. El
   movimiento se reserva para el cintillo. */

export function FrontPageSection() {
  /* Una sola petición para toda la plana. El backend ya devuelve lo destacado
     y, si no hay nada destacado, lo más reciente — que es exactamente la caída
     que antes se hacía aquí pidiendo el listado por separado. */
  const { data, loading, error, reload } = useFeatured(12);

  const pool = data?.results ?? [];
  const { withImage, withoutImage } = splitByImage(pool);

  /* La principal y la banda de cuatro salen de las ilustradas, en el orden en
     que llegaron: lo más reciente primero. */
  const lead = withImage[0];
  const rest = withImage.slice(1, 5);

  /* Y los breves, de las que no traen foto. Si esa corrida trajo pocas, se
     completa con las ilustradas que no cupieron arriba. */
  const briefs = takeBriefs(withoutImage, withImage.slice(5), 6);

  return (
    <section id="portada" className="px-4 md:px-8 lg:px-12 py-8">
      <div className="max-w-[1200px] mx-auto">
        {error && <ErrorState message={error} onRetry={reload} />}

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

                {/* Al pie de la columna de breves, como el módulo que cierra
                    una columna en un impreso. */}
                <Aviso espacio="portada-modulo" className="mt-8" />
              </aside>
            </div>

            {rest.length > 0 && (
              <>
                <div className="rule-double my-8" aria-hidden="true" />
                <div className="col-rules grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0">
                  {rest.map((article) => (
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
