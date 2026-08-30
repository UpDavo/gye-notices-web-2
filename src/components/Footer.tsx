import { Link } from 'react-router-dom';

const YEAR = new Date().getFullYear();

/* El pie, compuesto como el colofón de un diario.

   La web hermana cierra con un bloque oscuro. Aquí el papel no cambia de
   color hasta el final: el cierre se hace con reglas, versalitas y columnas,
   que es como cierra un impreso.

   Ya no lista los medios ni repite el aviso de agregador. Eso vive donde el
   lector lo mira: en el crédito de cada nota, junto al enlace al original.
   Tampoco lista las secciones: para eso está la barra de arriba. */

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-foreground m-0 pb-2 mb-4 border-b border-[hsl(var(--rule))]">
      {children}
    </h2>
  );
}

const linkClass =
  'text-sm text-muted-foreground hover:text-accent no-underline transition-colors';

export function Footer() {
  return (
    <footer className="mt-16 border-t-[3px] border-[hsl(var(--rule))] bg-surface">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div>
            <p className="font-display font-bold text-4xl text-foreground leading-none m-0">
              El Guayasense
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent mt-2 m-0">
              El diario de Guayaquil
            </p>
          </div>

          <div>
            <ColumnTitle>El diario</ColumnTitle>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              <li><Link to="/noticias" className={linkClass}>Toda la edición</Link></li>
              <li><Link to="/privacidad" className={linkClass}>Privacidad</Link></li>
              <li><Link to="/terminos" className={linkClass}>Términos</Link></li>
            </ul>
          </div>
        </div>

        <div className="rule-double my-8" aria-hidden="true" />

        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground m-0">
          © {YEAR} El Guayasense
        </p>
      </div>
    </footer>
  );
}
