import { ArticleCard } from './ArticleCard';
import { Pagination } from './Pagination';
import { EmptyState, ErrorState, GridSkeleton } from './States';
import type { Article, Paginated } from '../../lib/api';

/* Rejilla paginada de notas.

   La usan por igual /noticias, /seccion/:slug y la búsqueda; los tres tienen
   exactamente la misma lista con distintos filtros, así que la lista vive en
   un solo sitio. */

type Props = {
  data: Paginated<Article> | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  emptyTitle?: string;
  emptyMessage?: string;
};

export function ArticleFeed({
  data,
  loading,
  error,
  onRetry,
  onPageChange,
  emptyTitle,
  emptyMessage,
}: Props) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (loading) return <GridSkeleton count={6} />;

  const articles = data?.results ?? [];
  if (articles.length === 0) return <EmptyState title={emptyTitle} message={emptyMessage} />;

  return (
    <>
      {/* Sin entrada animada: una página compuesta se lee quieta. La rejilla
          va a cuatro columnas con filete vertical, como una plana interior. */}
      <div className="col-rules grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-y-10 md:gap-x-0">
        {articles.map((article, i) => (
          <div key={article.slug} className="md:px-5 lg:[&:nth-child(4n+1)]:pl-0 lg:[&:nth-child(4n)]:pr-0">
            <ArticleCard article={article} eager={i < 4} />
          </div>
        ))}
      </div>

      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.total_pages ?? 1}
        onChange={onPageChange}
      />
    </>
  );
}
