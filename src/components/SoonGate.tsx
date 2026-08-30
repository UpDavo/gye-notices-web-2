import { useEffect, useState, type ReactNode } from 'react';
import { SoonPage } from '../pages/SoonPage';
import { SOON_ENABLED, cleanAccessParam, isUnlocked } from '../lib/soon';

/* Corta la web entera cuando SOON=true y no hay clave.

   Va por fuera del router a propósito: mientras la cortina esté echada no
   existe ninguna ruta, ni siquiera las legales. Con SOON=false el componente
   se limita a devolver sus hijos. */

export function SoonGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => isUnlocked());

  /* Si entró por ?acceso=CLAVE, el parámetro ya cumplió: se borra de la barra
     para que no acabe compartido en una captura o en un enlace pegado. */
  useEffect(() => {
    if (unlocked) cleanAccessParam();
  }, [unlocked]);

  if (!SOON_ENABLED || unlocked) return <>{children}</>;

  return <SoonPage onUnlock={() => setUnlocked(true)} />;
}
