import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ESPACIOS,
  MODULOS,
  avisoDe,
  correoContratacion,
  type Aviso as AvisoContratado,
  type Espacio,
} from '../../data/avisos';

/* El recuadro de publicidad de El Guayasense.

   Es un módulo de imprenta, no un banner: rectángulo con filete, rótulo en
   versalitas encima, y —mientras nadie lo contrate— la trama diagonal con la
   que un diario rellena un hueco sin material y el clásico «CONTRATE ESTE
   ESPACIO». No lleva sombra, ni esquina redondeada, ni entrada animada: aquí
   nada de eso existe.

   El hueco se pinta siempre, contratado o libre, y con la misma medida. Es lo
   que permite enseñárselo a un anunciante y, de paso, lo que evita que la
   plana se recomponga cuando el aviso entra.

   La pieza entregada NO lleva la grisalla de las fotos de las notas: ese es
   tratamiento editorial y un aviso va como lo entregó quien lo paga. */

type Props = {
  espacio: Espacio;
  className?: string;
};

function EnlaceAviso({ aviso, className, children }: {
  aviso: AvisoContratado;
  className: string;
  children: React.ReactNode;
}) {
  if (!aviso.enlace) return <div className={className}>{children}</div>;
  if (aviso.enlace.startsWith('/')) {
    return <Link to={aviso.enlace} className={`${className} no-underline`}>{children}</Link>;
  }
  return (
    <a
      href={aviso.enlace}
      className={`${className} no-underline`}
      rel={aviso.nueva_pestana ? 'sponsored noopener noreferrer' : 'sponsored'}
      {...(aviso.nueva_pestana ? { target: '_blank' } : {})}
    >
      {children}
    </a>
  );
}

/* La trama de imprenta del hueco libre: las mismas rayas a 45° con las que se
   rellena una foto que no llegó. */
const TRAMA = {
  backgroundImage:
    'repeating-linear-gradient(45deg, hsl(var(--rule) / 0.13) 0 1px, transparent 1px 7px)',
};

export function Aviso({ espacio, className = '' }: Props) {
  const [fallo, setFallo] = useState(false);

  const definicion = ESPACIOS[espacio];
  const modulo = MODULOS[definicion.modulo];
  const contratado = avisoDe(espacio);
  const aviso = contratado && !fallo ? contratado : null;
  const fila = modulo.disposicion === 'fila';
  const compacto = Boolean(modulo.compacto);

  return (
    <figure className={`m-0 ${className}`}>
      {/* Rótulo sobre filete, como el ladillo de una sección. */}
      <figcaption className="flex items-baseline justify-between gap-3 border-b border-[hsl(var(--rule))] pb-1.5 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
          {definicion.rotulo}
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70 shrink-0">
          {aviso ? aviso.anunciante : modulo.medida}
        </span>
      </figcaption>

      {aviso ? (
        <EnlaceAviso
          aviso={aviso}
          className={`block border border-[hsl(var(--rule))] overflow-hidden bg-surface ${modulo.proporcion}`}
        >
          <picture>
            {aviso.imagen_movil && (
              <source media="(max-width: 640px)" srcSet={aviso.imagen_movil} />
            )}
            <img
              src={aviso.imagen}
              alt={aviso.alt}
              loading="lazy"
              decoding="async"
              onError={() => setFallo(true)}
              className="h-full w-full object-cover"
            />
          </picture>
        </EnlaceAviso>
      ) : (
        /* El recuadro libre va con `min-h` y NO con la proporción del módulo:
           un `aspect-ratio` fija la altura y recorta el titular que no quepa.
           El aviso contratado sí conserva la medida exacta. */
        <a
          href={correoContratacion(definicion, modulo)}
          className={`group flex border border-[hsl(var(--rule))] bg-muted/40 no-underline text-foreground ${modulo.minimoLibre} ${
            fila
              ? 'flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4 sm:px-6'
              : 'flex-col items-center justify-center text-center gap-2 px-5 py-6'
          }`}
          style={TRAMA}
        >
          <span className={fila ? 'min-w-0' : 'contents'}>
            <span
              className={`block font-display font-bold leading-[1.15] text-foreground ${
                compacto ? 'text-[15px]' : fila ? 'text-lg md:text-xl' : 'text-lg md:text-2xl'
              }`}
            >
              {definicion.libre.titular}
            </span>
            {!compacto && (
              <span className="block text-[12px] md:text-[13px] text-muted-foreground max-w-sm leading-snug mt-1.5">
                {definicion.libre.texto}
              </span>
            )}
          </span>

          <span className={`flex flex-col gap-1.5 shrink-0 ${fila ? 'items-start sm:items-end' : 'items-center mt-2'}`}>
            <span className="border border-[hsl(var(--rule))] bg-background px-4 py-1.5 text-[10px] uppercase tracking-[0.16em] group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors">
              {compacto ? 'Contrátelo' : 'Contrate este espacio'}
            </span>
            {/* La medida de imprenta y el archivo que hay que entregar: es lo
                primero que pregunta quien va a pautar. */}
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">
              {modulo.nombre} · {modulo.medida}{compacto ? '' : ` · ${modulo.archivo}`}
            </span>
          </span>
        </a>
      )}
    </figure>
  );
}

/* Banda a todo el ancho de la plana, separada con la raya doble. Es como
   entra un faldón entre dos bloques de la portada. */
export function BandaAviso({ espacio, className = '' }: Props) {
  return (
    <section aria-label="Publicidad" className={`px-4 md:px-8 lg:px-12 py-4 ${className}`}>
      <div className="max-w-[1200px] mx-auto">
        <div className="rule-double mb-6" aria-hidden="true" />
        <Aviso espacio={espacio} />
      </div>
    </section>
  );
}

/* Los clasificados: tres módulos pequeños en fila, con filete entre columnas,
   como la última plana de un diario. */
export function Clasificados({ className = '' }: { className?: string }) {
  return (
    <section aria-label="Clasificados" className={`px-4 md:px-8 lg:px-12 py-4 ${className}`}>
      <div className="max-w-[1200px] mx-auto">
        <div className="rule-double mb-6" aria-hidden="true" />
        <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground m-0 mb-5">
          Clasificados
        </h2>
        <div className="col-rules grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-0">
          {[0, 1, 2].map((i) => (
            <div key={i} className="md:px-5 first:md:pl-0 last:md:pr-0">
              <Aviso espacio="clasificados" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
