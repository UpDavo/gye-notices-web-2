import { NavLink } from 'react-router-dom';
import type { Category } from '../../lib/api';

/* Barra de secciones.

   Son `NavLink` y no botones: cada sección es una URL propia, que se puede
   compartir, marcar y indexar. En móvil la barra se desplaza de lado. */

type Props = {
  categories: Category[];
  /* `all` es el destino de la pestaña «Todas». */
  allTo?: string;
  className?: string;
};

const baseClass =
  'shrink-0 px-4 py-1.5 text-[12px] uppercase tracking-[0.12em] no-underline border ' +
  'transition-colors duration-150 whitespace-nowrap';

export function CategoryTabs({ categories, allTo = '/noticias', className = '' }: Props) {
  return (
    <nav aria-label="Secciones" className={`w-full ${className}`}>
      <ul className="flex gap-2 list-none m-0 p-0 overflow-x-auto no-scrollbar pb-1">
        <li>
          <NavLink
            to={allTo}
            end
            className={({ isActive }) =>
              `${baseClass} ${
                isActive
                  ? 'bg-accent text-white border-accent font-bold'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-accent'
              }`
            }
          >
            Todas
          </NavLink>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <NavLink
              to={`/seccion/${category.slug}`}
              className={({ isActive }) =>
                `${baseClass} ${
                  isActive
                    ? 'bg-accent text-white border-accent font-bold'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-accent'
                }`
              }
            >
              {category.name}
              {typeof category.article_count === 'number' && category.article_count > 0 && (
                <span className="ml-1.5 opacity-60 text-xs">{category.article_count}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
