import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ArticleFeed } from '../components/news/ArticleFeed';
import { CategoryTabs } from '../components/news/CategoryTabs';
import { useArticles, useCategories } from '../hooks/useNews';
import { usePageSeo } from '../hooks/usePageSeo';
import { SITE_URL } from '../lib/api';

export function SectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [params, setParams] = useSearchParams();
  const { data: categories } = useCategories();

  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);
  const { data, loading, error, reload } = useArticles({ category: slug, page, page_size: 12 });

  const category = (categories ?? []).find((c) => c.slug === slug);
  const name = category?.name ?? 'Sección';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, slug]);

  const setPage = useCallback(
    (next: number) => {
      const updated = new URLSearchParams(params);
      if (next <= 1) updated.delete('page');
      else updated.set('page', String(next));
      setParams(updated);
    },
    [params, setParams],
  );

  usePageSeo({
    title: `${name} — Guayaco`,
    description:
      category?.description ||
      `Noticias de ${name} publicadas por los medios de Guayaquil, con crédito y enlace al original.`,
    path: `/seccion/${slug}`,
    jsonLd: data?.results?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${name} — Guayaco`,
          url: `${SITE_URL}/seccion/${slug}`,
          inLanguage: 'es-EC',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: data.results.slice(0, 10).map((article, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${SITE_URL}/noticia/${article.slug}`,
              name: article.title,
            })),
          },
        }
      : undefined,
  });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 lg:px-12 pt-8">
        <div className="max-w-[1200px] mx-auto">
          <header className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent m-0 mb-3">Sección</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-[1.06] m-0 mb-3 pb-4 border-b-2 border-[hsl(var(--rule))]">
              {name}
            </h1>
            {category?.description && (
              <p className="text-muted-foreground text-lg m-0 max-w-2xl">{category.description}</p>
            )}
          </header>

          <CategoryTabs categories={categories ?? []} className="mb-10" />

          <ArticleFeed
            data={data}
            loading={loading}
            error={error}
            onRetry={reload}
            onPageChange={setPage}
            emptyTitle={`Nada en ${name} por ahora`}
            emptyMessage="En cuanto los medios publiquen algo de esta sección, aparecerá aquí."
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
