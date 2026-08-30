import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import type { Banner } from '../lib/api';
import { HERO_BANNERS } from '../data/banners';

/* El faldón de portada: carrusel de banners definidos en `news/banners.json`
   del backend. Cuántos hay y a qué web va cada uno lo dice su lista `sites`.

   Es un banner, no una nota: ocupa el ancho completo de la pantalla y va sin
   rótulo —ni encima ni debajo—. El título y el subtítulo del JSON quedan como
   texto alternativo y etiqueta para lectores de pantalla; la pieza gráfica ya
   trae su propio texto y repetirlo en tipografía del diario la duplica.

   Tampoco lleva la grisalla de las fotos de las notas: eso es tratamiento
   editorial, y un banner es material gráfico entregado tal cual.

   La pista es un `overflow-x-auto` con scroll-snap y no un `transform`: así el
   swipe en móvil es el del propio navegador —con su inercia— en vez de una
   imitación a base de eventos táctiles, y el avance automático es un `scrollTo`
   sobre esa misma pista. */

const INTERVAL_MS = 6000;

function BannerImage({ banner, onError }: { banner: Banner; onError: () => void }) {
  return (
    <picture>
      {banner.image_url_mobile && (
        <source media="(max-width: 640px)" srcSet={banner.image_url_mobile} />
      )}
      <img
        src={banner.image_url}
        alt={banner.alt || banner.title}
        onError={onError}
        className="block w-full h-[36vh] min-h-[16rem] md:h-[52vh] object-cover"
      />
    </picture>
  );
}

/* Un banner puede llevar a una ruta del sitio o a otro dominio. `Link` no vale
   para lo segundo y `<a>` recargaría la página entera en lo primero. */
function BannerLink({ banner, className, children }: {
  banner: Banner;
  className: string;
  children: React.ReactNode;
}) {
  if (!banner.link_url) {
    return <div className={className}>{children}</div>;
  }

  if (banner.link_url.startsWith('/')) {
    return <Link to={banner.link_url} className={`${className} no-underline`}>{children}</Link>;
  }

  return (
    <a
      href={banner.link_url}
      className={`${className} no-underline`}
      {...(banner.open_in_new_tab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

export function HeroBanners() {
  const reduced = useReducedMotion() ?? false;

  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  /* Las imágenes vienen de una URL escrita a mano en el JSON del backend, así
     que fallan con facilidad. El banner roto se retira en vez de dejar el icono
     de imagen rota en cabeza de portada. */
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const markFailed = (key: string) => setFailed((prev) => ({ ...prev, [key]: true }));

  const banners = HERO_BANNERS.filter((b) => !failed[b.key]);
  const total = banners.length;

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  }, []);

  /* El indicador activo sale de la posición real del scroll y no de un índice
     propio: así sigue siendo correcto si el usuario arrastra con el dedo. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const sync = () => {
      if (!track.clientWidth) return;
      setActive(Math.round(track.scrollLeft / track.clientWidth));
    };

    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      track.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [total]);

  /* Avance automático. Se detiene si el usuario está encima o dentro con el
     teclado, si pidió menos movimiento, o si la pestaña no está a la vista:
     rotar banners que nadie ve solo gasta batería y descoloca la posición
     cuando vuelve. */
  useEffect(() => {
    if (reduced || paused || total < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const track = trackRef.current;
      if (!track || !track.clientWidth) return;
      const current = Math.round(track.scrollLeft / track.clientWidth);
      goTo((current + 1) % total);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [reduced, paused, total, goTo]);

  // Sin banners no hay faldón: la portada empieza en la nota principal.
  if (total === 0) return null;

  const arrowClass =
    'hidden md:flex absolute top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center ' +
    'border border-[hsl(var(--rule))] bg-background/85 text-foreground cursor-pointer ' +
    'hover:bg-accent hover:text-white hover:border-accent transition-colors';

  return (
    <section
      aria-label="Destacados"
      aria-roledescription="carrusel"
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <ul
        ref={trackRef}
        className="flex list-none m-0 p-0 overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {banners.map((banner, i) => (
          <li
            key={banner.key}
            className="w-full shrink-0 snap-start"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${total}`}
            /* Las diapositivas que no se ven no deben ser alcanzables con el
               tabulador: tabular hacia un enlace invisible desplaza la pista
               sola y el lector se queda sin saber por qué se movió. */
            inert={i !== active}
          >
            <BannerLink banner={banner} className="block">
              <BannerImage banner={banner} onError={() => markFailed(banner.key)} />
            </BannerLink>
          </li>
        ))}
      </ul>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo((active - 1 + total) % total)}
            aria-label="Banner anterior"
            className={`${arrowClass} left-6`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => goTo((active + 1) % total)}
            aria-label="Banner siguiente"
            className={`${arrowClass} right-6`}
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicadores cuadrados: en una interfaz sin una sola curva, un punto
              redondo canta. Van sobre la imagen porque sin rótulo debajo no hay
              donde ponerlos que no sea una banda vacía. */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-5 md:bottom-7 flex items-center gap-2 bg-background/85 border border-[hsl(var(--rule))] px-3 py-2">
            {banners.map((banner, i) => (
              <button
                key={banner.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al banner ${i + 1} de ${total}`}
                aria-current={i === active}
                className={`h-1.5 transition-all duration-300 cursor-pointer border-0 ${
                  i === active ? 'w-8 bg-accent' : 'w-3 bg-border hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
