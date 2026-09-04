import { useState } from 'react';
import { Link } from 'react-router-dom';

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem('cookie_consent') !== null;
    } catch {
      // localStorage bloqueado: no se insiste con el aviso.
      return true;
    }
  });

  if (dismissed) return null;

  function decide(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem('cookie_consent', value);
    } catch {
      // sin almacenamiento el aviso volverá a salir; es preferible a fallar
    }
    setDismissed(true);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border text-foreground px-6 md:px-12 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_-8px_32px_-12px_rgba(15,23,42,0.25)]">
      <p className="text-sm text-foreground/80 max-w-xl m-0">
        Este diario guarda sus preferencias de lectura, como la edición nocturna.{' '}
        <Link to="/privacidad" className="underline hover:text-foreground transition-colors">
          Leer la política
        </Link>
      </p>
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => decide('declined')}
          className="px-4 py-2 text-sm rounded-none border border-border text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors bg-transparent cursor-pointer"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={() => decide('accepted')}
          className="px-4 py-2 text-sm rounded-none bg-accent text-white font-semibold hover:opacity-90 transition-opacity border-0 cursor-pointer"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
