import { ArrowLeft, ArrowRight } from 'lucide-react';

/* Paginación numérica.

   Con muchas páginas se colapsa a una ventana alrededor de la actual más los
   extremos: una fila de 40 números no la usa nadie y rompe el móvil. */

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

function windowedPages(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const visible = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: (number | 'gap')[] = [];
  let previous = 0;

  for (const current of visible) {
    if (previous && current - previous > 1) result.push('gap');
    result.push(current);
    previous = current;
  }

  return result;
}

const arrowClass =
  'flex h-9 w-9 items-center justify-center border border-border text-foreground bg-transparent ' +
  'cursor-pointer transition-colors hover:border-accent hover:text-accent ' +
  'disabled:opacity-30 disabled:pointer-events-none';

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginación" className="flex justify-center items-center gap-2 mt-12">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className={arrowClass}
      >
        <ArrowLeft size={16} />
      </button>

      {windowedPages(page, totalPages).map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-label={`Página ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={`h-9 min-w-9 px-3 text-sm border cursor-pointer transition-colors ${
              item === page
                ? 'bg-accent text-white border-accent font-bold'
                : 'border-border text-muted-foreground bg-transparent hover:text-accent hover:border-accent'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
        className={arrowClass}
      >
        <ArrowRight size={16} />
      </button>
    </nav>
  );
}
