import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ArticleFeed } from '../components/news/ArticleFeed';
import { CategoryTabs } from '../components/news/CategoryTabs';
import { useArticles, useCategories } from '../hooks/useNews';
import { usePageSeo } from '../hooks/usePageSeo';

/* Todas las notas, con búsqueda y paginación.

   El estado vive en la URL (`?q=`, `?page=`) y no en el componente: así la
   página se puede compartir, se recarga igual y el botón atrás del navegador
   hace lo que el lector espera. */

export function NewsPage() {
  const [params, setParams] = useSearchParams();
  const { data: categories } = useCategories();

  const query = params.get('q') ?? '';
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);

  const { data, loading, error, reload } = useArticles({ q: query, page, page_size: 12 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, query]);

  const setPage = useCallback(
    (next: number) => {
      const updated = new URLSearchParams(params);
      if (next <= 1) updated.delete('page');
      else updated.set('page', String(next));
      setParams(updated);
    },
    [params, setParams],
  );

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = String(new FormData(event.currentTarget).get('q') ?? '').trim();
    const updated = new URLSearchParams();
    if (term) updated.set('q', term);
    setParams(updated);
  }

  const title = query ? `Búsqueda: ${query} — Guayaco` : 'Todas las noticias — Guayaco';

  usePageSeo({
    title,
    description: query
      ? `Resultados de "${query}" en las noticias de Guayaquil.`
      : 'Todas las noticias de Guayaquil publicadas por los medios de la ciudad, con crédito y enlace al original.',
    path: query ? `/noticias?q=${encodeURIComponent(query)}` : '/noticias',
    // Una página de resultados no aporta nada a un buscador y compite con las
    // notas reales por presupuesto de rastreo.
    noIndex: Boolean(query),
  });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 lg:px-12 pt-8">
        <div className="max-w-[1200px] mx-auto">
          <header className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent m-0 mb-3">
              {query ? 'Búsqueda' : 'Archivo'}
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-[1.06] m-0 mb-3 pb-4 border-b-2 border-[hsl(var(--rule))]">
              {query ? `“${query}”` : 'Todas las noticias'}
            </h1>
            <p className="text-muted-foreground m-0">
              {typeof data?.count === 'number'
                ? `${data.count} ${data.count === 1 ? 'nota' : 'notas'}`
                : 'Cargando…'}
            </p>
          </header>

          <form onSubmit={submitSearch} role="search" className="mb-6 flex gap-3">
            <label htmlFor="page-search" className="sr-only">
              Buscar noticias
            </label>
            <div className="flex items-center gap-2 rounded-none border border-[hsl(var(--rule))] bg-surface px-4 py-2.5 flex-1 max-w-md focus-within:border-accent transition-colors">
              <Search size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
              <input
                id="page-search"
                name="q"
                type="search"
                defaultValue={query}
                key={query}
                placeholder="Buscar en las noticias"
                className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              className="rounded-none px-6 py-2.5 text-[13px] uppercase tracking-[0.14em] bg-accent text-white hover:opacity-90 transition-opacity border-0 cursor-pointer"
            >
              Buscar
            </button>
            {query && (
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams())}
                aria-label="Limpiar búsqueda"
                className="flex items-center justify-center h-11 w-11 rounded-none border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors bg-transparent cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </form>

          <CategoryTabs categories={categories ?? []} className="mb-10" />

          <ArticleFeed
            data={data}
            loading={loading}
            error={error}
            onRetry={reload}
            onPageChange={setPage}
            emptyTitle={query ? 'Sin resultados' : undefined}
            emptyMessage={
              query
                ? `No encontramos notas que mencionen “${query}”. Prueba con otra palabra.`
                : undefined
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
