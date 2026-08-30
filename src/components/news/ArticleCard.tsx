import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../../lib/api';
import { timeAgo } from '../../lib/format';
import { SourceCredit } from './SourceCredit';

/* La nota compuesta como en una página impresa.

   Diferencias de fondo con la web hermana, no de color:
   - El titular va en serif y pesa más que la foto. Ahí manda el texto.
   - No hay caja. Cada nota se separa de la siguiente con una raya fina, no
     con un borde que la rodee: en un periódico las notas comparten página, no
     flotan como tarjetas.
   - El antetítulo va arriba, en versalitas rojas, como el ladillo de sección.
   - Cero sombras, cero esquinas redondeadas, cero relleno de hover. El único
     hover es el titular volviéndose rojo, que es lo que hace un enlace. */

type Variant = 'lead' | 'standard' | 'compact';

type Props = {
  article: Article;
  variant?: Variant;
  eager?: boolean;
};

function Kicker({ article }: { article: Article }) {
  if (!article.category) return null;
  return (
    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
      {article.category.name}
    </span>
  );
}

function Byline({ article }: { article: Article }) {
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
      <SourceCredit article={article} />
      <span aria-hidden="true">·</span>
      <time dateTime={article.published_at}>{timeAgo(article.published_at)}</time>
    </div>
  );
}

/* Un medio puede no traer foto: los feeds de WordPress casi nunca la traen, y
   las fotos de terceros fallan por motivos que este sitio no controla. En vez
   de un hueco gris se pinta una trama de líneas diagonales — el gris de
   imprenta con el que un diario rellena un espacio sin material. */
function Fallback({ article, label = true }: { article: Article; label?: boolean }) {
  return (
    <div
      className="relative h-full w-full flex items-end p-2 bg-muted"
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, hsl(var(--rule) / 0.13) 0 1px, transparent 1px 7px)',
      }}
    >
      {label && (
        <span className="font-display font-bold text-[11px] uppercase tracking-[0.14em] text-muted-foreground bg-background px-1.5 py-0.5">
          {article.source.name}
        </span>
      )}
    </div>
  );
}

function Cover({
  article,
  className,
  eager,
  label = true,
}: {
  article: Article;
  className: string;
  eager?: boolean;
  label?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`overflow-hidden ${className}`}>
      {article.image_url && !failed ? (
        <img
          src={article.image_url}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          /* Las fotos van casi en escala de grises y recuperan color al pasar
             el puntero. Es el truco que unifica material de ocho medios
             distintos en una sola página: sin él, ocho tratamientos de color
             pelean entre sí y la portada se ve como un collage.

             Va como `filter` explícito y no con `grayscale-[0.75]`: con el
             valor arbitrario, Tailwind v4 define la variable pero no llega a
             emitir la propiedad `filter`, y el efecto no se aplica. */
          className="h-full w-full object-cover [filter:grayscale(0.8)_contrast(1.06)] group-hover:[filter:none] transition-[filter] duration-500"
        />
      ) : (
        <Fallback article={article} label={label} />
      )}
    </div>
  );
}

export function ArticleCard({ article, variant = 'standard', eager = false }: Props) {
  const to = `/noticia/${article.slug}`;

  if (variant === 'compact') {
    return (
      <Link to={to} className="group flex gap-3 items-start no-underline">
        <span
          className="font-display font-bold text-lg text-accent leading-none pt-0.5 shrink-0 w-5"
          aria-hidden="true"
        >
          ▪
        </span>
        <div className="flex flex-col gap-1.5 min-w-0">
          <h3 className="font-display font-bold text-[15px] text-foreground leading-[1.25] m-0 line-clamp-3 group-hover:text-accent transition-colors duration-150">
            {article.title}
          </h3>
          <Byline article={article} />
        </div>
      </Link>
    );
  }

  if (variant === 'lead') {
    return (
      <article>
        <Link to={to} className="group block no-underline">
          <div className="mb-3">
            <Kicker article={article} />
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-[3.4rem] text-foreground leading-[1.04] m-0 mb-4 group-hover:text-accent transition-colors duration-150">
            {article.title}
          </h2>

          <Cover article={article} className="h-64 md:h-[24rem] mb-4" eager={eager} />

          <p className="dropcap font-body text-base md:text-lg text-foreground/85 leading-relaxed m-0 mb-4 max-w-3xl">
            {article.excerpt}
          </p>
          <Byline article={article} />
        </Link>
      </article>
    );
  }

  return (
    <article className="group">
      <Link to={to} className="block no-underline">
        <Cover article={article} className="h-40 mb-3" eager={eager} />
        <div className="mb-1.5">
          <Kicker article={article} />
        </div>
        <h3 className="font-display font-bold text-lg md:text-xl text-foreground leading-[1.2] m-0 mb-2 line-clamp-3 group-hover:text-accent transition-colors duration-150">
          {article.title}
        </h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed m-0 mb-3 line-clamp-3">
          {article.excerpt}
        </p>
        <Byline article={article} />
      </Link>
    </article>
  );
}
