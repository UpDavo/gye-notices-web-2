import { useEffect, useState } from 'react';
import { keyMatches, remember } from '../lib/soon';

/* Portada de espera. Ocupa la web entera mientras SOON=true y sustituye a
   cualquier ruta: no hay navegación posible sin la clave.

   Se compone como la cabecera de un diario que aún no salió a la calle:
   cabecera, filete rojo, antetítulo y una nota al pie. */

export function SoonPage({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  /* Mientras la edición no exista, que no se indexe: lo que vería el buscador
     es esta pantalla, no el diario. */
  useEffect(() => {
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previous = robots?.getAttribute('content') ?? null;
    robots?.setAttribute('content', 'noindex, nofollow');

    const previousTitle = document.title;
    document.title = 'Próxima edición — El Guayasense';

    return () => {
      if (previous) robots?.setAttribute('content', previous);
      document.title = previousTitle;
    };
  }, []);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!keyMatches(value)) {
      setError(true);
      return;
    }
    remember();
    onUnlock();
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.34em] text-accent m-0 text-center">
          Próxima edición
        </p>

        <h1 className="font-display font-bold text-foreground text-center leading-[0.9] tracking-tight text-[2.5rem] sm:text-6xl md:text-7xl mt-4 mb-0">
          El Guayasense
        </h1>

        <div className="h-[3px] bg-accent mt-7" aria-hidden="true" />
        <div className="h-px bg-foreground/60 mt-[6px]" aria-hidden="true" />

        <p className="text-[10px] uppercase tracking-[0.3em] text-accent text-center mt-4 mb-0">
          El diario de Guayaquil
        </p>

        <p className="text-center text-muted-foreground leading-relaxed mt-8 mb-0 max-w-lg mx-auto">
          Estamos cerrando la primera edición. Las noticias de la ciudad, de los medios que
          las publican, en un solo lugar.
        </p>

        <form onSubmit={submit} className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <label htmlFor="soon-key" className="sr-only">
            Clave de acceso anticipado
          </label>
          <input
            id="soon-key"
            type="password"
            autoComplete="off"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError(false);
            }}
            placeholder="Clave de acceso"
            aria-invalid={error}
            aria-describedby={error ? 'soon-error' : undefined}
            className="flex-1 max-w-xs mx-auto sm:mx-0 rounded-none border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            className="rounded-none px-8 py-2.5 text-[13px] uppercase tracking-[0.14em] bg-accent text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>

        <p
          id="soon-error"
          role="status"
          className={`text-sm text-center mt-4 mb-0 transition-opacity ${
            error ? 'text-accent opacity-100' : 'opacity-0'
          }`}
        >
          Esa clave no es. Revisa que no sobre un espacio.
        </p>
      </div>
    </main>
  );
}
