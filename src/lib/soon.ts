/* Modo «próximamente».

   `SOON=true` tapa la web entera con una portada de espera. `SOON_KEY` es la
   clave que deja pasar. Las dos se resuelven en el build desde las variables
   del proyecto, así que se cambian sin tocar el backend ni el código.

   Importante: la clave viaja dentro del bundle de JavaScript. Cualquiera que
   abra las devtools puede leerla. Es una cortina para enseñar el sitio a quien
   tú decidas, no un control de acceso. Si hace falta lo segundo, va delante
   Cloudflare Access, no esto. */

import { environment } from '../environments/environment';

export const SOON_ENABLED = environment.soon;

const SOON_KEY = environment.soonKey;
const STORAGE_KEY = 'elguayasense-soon';

/** Parámetro para repartir el acceso por enlace: ?acceso=CLAVE */
export const ACCESS_PARAM = 'acceso';

export function keyMatches(value: string): boolean {
  return SOON_KEY.length > 0 && value.trim() === SOON_KEY;
}

/** Guarda la clave, no un booleano: si cambias SOON_KEY, los accesos viejos caen solos. */
export function remember(): void {
  try {
    localStorage.setItem(STORAGE_KEY, SOON_KEY);
  } catch {
    // Sin almacenamiento el acceso dura lo que la pestaña. Aceptable.
  }
}

export function forget(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nada que limpiar
  }
}

/** ¿Puede ver la web? Mira primero el enlace con clave, luego lo guardado. */
export function isUnlocked(): boolean {
  if (!SOON_ENABLED) return true;

  try {
    const fromLink = new URLSearchParams(window.location.search).get(ACCESS_PARAM);
    if (fromLink && keyMatches(fromLink)) {
      remember();
      return true;
    }
  } catch {
    // URL rara: se cae a la comprobación de abajo
  }

  try {
    return SOON_KEY.length > 0 && localStorage.getItem(STORAGE_KEY) === SOON_KEY;
  } catch {
    return false;
  }
}

/** Quita ?acceso= de la barra de direcciones para que no se comparta sin querer. */
export function cleanAccessParam(): void {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(ACCESS_PARAM)) return;
    url.searchParams.delete(ACCESS_PARAM);
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  } catch {
    // sin History API no pasa nada: el parámetro solo queda a la vista
  }
}
