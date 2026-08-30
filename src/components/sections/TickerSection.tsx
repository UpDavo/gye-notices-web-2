import { Link } from 'react-router-dom';
import { useLatest } from '../../hooks/useNews';

/* El cintillo de última hora.

   Único sitio del periódico donde algo se mueve. Requisitos de la banda
   deslizante del estándar, que aquí siguen valiendo: lista DUPLICADA (el -50%
   de la animación depende de ello), la copia con `aria-hidden` para que un
   lector de pantalla no la lea dos veces, y máscara de fundido en los bordes. */

export function TickerSection() {
  const { data } = useLatest(12);
  const articles = data?.results ?? [];

  if (articles.length < 4) return null;

  const items = articles.map((article) => (
    <Link
      key={article.slug}
      to={`/noticia/${article.slug}`}
      className="flex items-center gap-2.5 px-5 py-2 text-[13px] text-foreground/85 hover:text-accent no-underline transition-colors whitespace-nowrap"
    >
      <span className="h-1.5 w-1.5 bg-accent shrink-0" aria-hidden="true" />
      <span className="max-w-[26rem] truncate">{article.title}</span>
      <span className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
        {article.source.name}
      </span>
    </Link>
  ));

  return (
    <section aria-label="Última hora" className="border-b border-border bg-surface overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex items-stretch">
        <p className="hidden md:flex items-center shrink-0 bg-accent text-white text-[11px] font-bold uppercase tracking-[0.2em] px-4 m-0">
          Última hora
        </p>
        <div
          className="relative flex-1 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
          }}
        >
          <div className="ticker-track">
            <div className="flex">{items}</div>
            <div className="flex" aria-hidden="true">
              {items}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
