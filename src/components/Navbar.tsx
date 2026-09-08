import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useCategories } from '../hooks/useNews';

/* El cabezote, compuesto como el de un diario impreso.

   La web hermana usa la píldora de vidrio flotante del estándar. Aquí no: un
   periódico tiene MANCHETA — el nombre grande y centrado, la fecha a un lado,
   la raya doble debajo y la barra de secciones aparte. Un elemento translúcido
   que flota sobre la página rompería la ilusión de papel antes que ninguna
   otra cosa.

   El cabezote no se pega arriba: se va con el scroll, como la primera plana de
   un diario que se pasa de página. */

const FECHA = new Date().toLocaleDateString('es-EC', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { data: categories } = useCategories();

  const menuOpen = menuOpenAt === location.pathname;
  const sections = (categories ?? []).filter((c) => c.show_in_nav);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = search.trim();
    if (!term) return;
    setMenuOpenAt(null);
    setSearch('');
    navigate(`/noticias?q=${encodeURIComponent(term)}`);
  }

  return (
    <header className="bg-background">
      {/* ── Mancheta ── */}
      <div className="px-4 md:px-8 lg:px-12 pt-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between gap-4 pb-4">
            <p className="hidden md:block text-[11px] uppercase tracking-[0.18em] text-muted-foreground m-0 flex-1 first-letter:uppercase">
              {FECHA}
            </p>

            <Link
              to="/"
              className="no-underline text-center shrink-0"
              aria-label="El Guayasense — portada"
            >
              <span className="block font-display font-bold text-foreground leading-[0.85] tracking-tight text-[2rem] sm:text-[2.75rem] md:text-5xl lg:text-6xl">
                El Guayasense
              </span>
              <span className="block text-[10px] md:text-[11px] uppercase tracking-[0.34em] text-accent mt-2">
                El diario de Guayaquil
              </span>
            </Link>

            <div className="flex-1 flex items-center justify-end gap-2">
              <form onSubmit={submitSearch} className="hidden lg:flex" role="search">
                <label htmlFor="nav-search" className="sr-only">
                  Buscar en la edición
                </label>
                <div className="flex items-center gap-2 border border-border bg-surface px-3 py-1.5">
                  <Search size={14} className="text-muted-foreground" aria-hidden="true" />
                  <input
                    id="nav-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar"
                    className="bg-transparent border-0 outline-none text-sm w-28 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </form>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Edición diurna' : 'Edición nocturna'}
                title={theme === 'dark' ? 'Edición diurna' : 'Edición nocturna'}
                className="flex items-center justify-center w-9 h-9 bg-transparent border-0 cursor-pointer text-foreground hover:text-accent transition-colors"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <button
                type="button"
                className="md:hidden flex items-center justify-center w-9 h-9 bg-transparent border-0 cursor-pointer text-foreground"
                onClick={() => setMenuOpenAt(menuOpen ? null : location.pathname)}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* La raya doble: gruesa arriba, fina abajo. La firma más vieja del
              periodismo impreso. */}
          <div className="rule-double" aria-hidden="true" />
        </div>
      </div>

      {/* ── Barra de secciones ── */}
      <nav
        aria-label="Secciones"
        className="bg-background border-b border-[hsl(var(--rule))]"
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-5 h-11 overflow-x-auto no-scrollbar">
            <Link
              to="/noticias"
              className="shrink-0 text-[13px] uppercase tracking-[0.12em] text-foreground no-underline hover:text-accent transition-colors"
            >
              Lo último
            </Link>
            {sections.map((category) => (
              <Link
                key={category.slug}
                to={`/seccion/${category.slug}`}
                className="shrink-0 text-[13px] uppercase tracking-[0.12em] text-muted-foreground no-underline hover:text-accent transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Menú móvil ── */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.65, 0.36, 1] }}
            className="md:hidden overflow-hidden border-b border-border bg-surface"
          >
            <div className="px-4 py-5 flex flex-col gap-4">
              <form onSubmit={submitSearch} role="search">
                <label htmlFor="nav-search-mobile" className="sr-only">
                  Buscar en la edición
                </label>
                <div className="flex items-center gap-2 border border-border bg-background px-3 py-2">
                  <Search size={15} className="text-muted-foreground" aria-hidden="true" />
                  <input
                    id="nav-search-mobile"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar en la edición"
                    className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </form>

              <Link
                to="/noticias"
                className="text-sm uppercase tracking-[0.12em] text-foreground no-underline hover:text-accent transition-colors"
              >
                Lo último
              </Link>

              {(categories ?? []).map((category) => (
                <Link
                  key={category.slug}
                  to={`/seccion/${category.slug}`}
                  className="text-sm uppercase tracking-[0.12em] text-foreground no-underline hover:text-accent transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
