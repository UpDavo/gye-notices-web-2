import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles, useCategories } from '../../hooks/useNews';
import { ArticleCard } from '../news/ArticleCard';
import { EmptyState, ErrorState, GridSkeleton } from '../news/States';

/* Una sola plana de noticias, con badges para elegir sección.

   Antes esto eran cinco franjas apiladas, una por sección. Leía como cinco
   listas cortas en vez de como un diario, y obligaba a bajar mucho para ver
   poco. Ahora es una rejilla y la sección se elige arriba.

   El filtro NO navega: cambia el estado y vuelve a pedir. Los enlaces de
   sección permanentes siguen en `/seccion/:slug`, que es lo que se comparte y
   lo que indexa un buscador; esto es para hojear.

   Los esqueletos salen solos al cambiar de badge: `useArticles` está cacheado
   por la clave de la consulta, así que al cambiar el filtro la clave deja de
   coincidir y el hook vuelve a `loading`. Sin eso la rejilla se quedaría con
   las notas de la sección anterior mientras carga y parecería que el badge no
   hizo nada. */

const PAGE_SIZE = 8;

export function NewsFeedSection() {
  const [active, setActive] = useState<string | null>(null);
  const { data: categories } = useCategories();
  const { data, loading, error, reload } = useArticles({
    category: active ?? undefined,
    page_size: PAGE_SIZE,
  });

  // Una sección sin notas es un badge que solo puede decepcionar.
  const withContent = (categories ?? []).filter((c) => (c.article_count ?? 0) > 0);
  const articles = data?.results ?? [];

  const badgeClass = (isActive: boolean) =>
    `shrink-0 px-4 py-1.5 text-[12px] uppercase tracking-[0.12em] border cursor-pointer ` +
    `transition-colors duration-150 whitespace-nowrap ${
      isActive
        ? 'bg-accent text-white border-accent font-bold'
        : 'bg-transparent border-border text-muted-foreground hover:text-accent hover:border-accent'
    }`;

  return (
    <section id="secciones" className="px-4 md:px-8 lg:px-12 py-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="rule-double mb-8" aria-hidden="true" />

        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-5">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground m-0">
            Al día
          </h2>
          <Link
            to="/noticias"
            className="text-[11px] uppercase tracking-[0.16em] text-accent no-underline hover:underline shrink-0"
          >
            Toda la edición
          </Link>
        </div>

        {/* Botones reales, no enlaces: esto filtra en la misma plana. */}
        <div
          role="group"
          aria-label="Filtrar por sección"
          className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-8"
        >
          <button type="button" onClick={() => setActive(null)} aria-pressed={active === null}
                  className={badgeClass(active === null)}>
            Todas
          </button>
          {withContent.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActive(category.slug)}
              aria-pressed={active === category.slug}
              className={badgeClass(active === category.slug)}
            >
              {category.name}
              <span className="ml-1.5 opacity-60">{category.article_count}</span>
            </button>
          ))}
        </div>

        {error && <ErrorState message={error} onRetry={reload} />}

        {!error && loading && <GridSkeleton count={PAGE_SIZE} />}

        {!error && !loading && articles.length === 0 && (
          <EmptyState message="En cuanto los medios publiquen algo de esta sección, aparecerá aquí." />
        )}

        {!error && !loading && articles.length > 0 && (
          <div className="col-rules grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-y-10 md:gap-x-0">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="md:px-5 lg:[&:nth-child(4n+1)]:pl-0 lg:[&:nth-child(4n)]:pr-0"
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
