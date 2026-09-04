import { ExternalLink } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSources } from '../hooks/useNews';
import { usePageSeo } from '../hooks/usePageSeo';
import { environment } from '../environments/environment';

/* La página donde el proyecto explica su trato con los medios.

   Está enlazada desde el pie y desde la portada a propósito: si el sitio vive
   de contenido ajeno, las reglas con las que lo usa tienen que ser fáciles de
   encontrar, no letra chica. */

const RULES = [
  {
    title: 'Titular y entradilla, nada más',
    body: 'Guardamos el titular, un extracto de unas pocas líneas y la imagen de portada que el propio medio publica en su feed. Nunca el cuerpo del artículo.',
  },
  {
    title: 'El crédito y la salida al medio',
    body: 'Cada nota lleva el nombre del medio y un enlace directo a su página. El lector que quiere leer completo termina en el sitio del medio, que es donde debe estar.',
  },
  {
    title: 'Sindicación antes que lectura de HTML',
    body: 'Preferimos el RSS que cada medio publica para ser sindicado. Solo leemos HTML cuando no hay feed, y siempre respetando lo que diga su robots.txt.',
  },
  {
    title: 'Ritmo de lectura y firma del robot',
    body: 'Espaciamos las peticiones y respetamos el Crawl-delay que declare cada sitio. Nos identificamos con un User-Agent propio y un contacto, nunca disfrazados de navegador.',
  },
  {
    title: 'Salir es inmediato',
    body: 'Si un medio pide no aparecer, lo retiramos el mismo día y sin condiciones. También ajustamos la frecuencia si el ritmo actual le resulta alto.',
  },
];

export function SourcesPage() {
  const { data: sources } = useSources();

  usePageSeo({
    title: 'Medios y cómo trabajamos — El Guayasense',
    description:
      'De qué medios sale el contenido de El Guayasense y con qué reglas se agrega: solo titular y extracto, enlace al original y salida inmediata a petición.',
    path: '/medios',
  });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 lg:px-12 pt-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent m-0 mb-3">Fuentes</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-[1.06] m-0 mb-5 pb-4 border-b-2 border-[hsl(var(--rule))]">
              Quién escribe lo que usted lee.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed m-0">
              El Guayasense no produce noticias. Reúne lo que publican los medios de
              la ciudad y del país, y manda al lector de vuelta a ellos.
            </p>
          </header>

          <section className="mb-16">
            <h2 className="font-display font-bold text-2xl text-foreground tracking-tight m-0 mb-6">
              La redacción de esta edición
            </h2>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {(sources ?? []).map((source) => (
                <li key={source.slug}>
                  <a
                    href={source.homepage_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="group flex items-center justify-between gap-4 rounded-none border border-border bg-surface px-6 py-5 no-underline hover:border-accent/40 transition-colors"
                  >
                    <div>
                      <p className="font-display font-bold text-lg text-foreground m-0 group-hover:text-accent transition-colors">
                        {source.name}
                      </p>
                      <p className="text-sm text-muted-foreground m-0">{source.domain}</p>
                    </div>
                    <ExternalLink
                      size={16}
                      className="text-muted-foreground group-hover:text-accent transition-colors shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-20">
            <h2 className="font-display font-bold text-2xl text-foreground tracking-tight m-0 mb-6">
              Las reglas
            </h2>
            <div className="rounded-none border border-border bg-surface divide-y divide-border">
              {RULES.map((rule) => (
                <div key={rule.title} className="px-6 md:px-8 py-6">
                  <h3 className="font-semibold text-base text-foreground m-0 mb-2">{rule.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed m-0">{rule.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Único canal de contacto del sitio: un `mailto:` y nada más. Sin
              formulario —no hay backend que reciba envíos, y un formulario que
              no llega a ningún sitio es peor que no tenerlo. */}
          <section className="rounded-none border border-border bg-surface p-8 md:p-10 mb-8 text-center">
            <h2 className="font-display font-bold text-2xl text-foreground tracking-tight m-0 mb-3">
              ¿Escribe usted en un medio?
            </h2>
            <p className="text-muted-foreground leading-relaxed m-0 mb-6 max-w-lg mx-auto">
              Escríbanos si prefiere que su material deje de aparecer en esta edición, si
              quiere otra frecuencia de lectura, o si su medio debería estar en esta lista.
            </p>
            <a
              href={`mailto:${environment.contactEmail}`}
              className="inline-block rounded-none px-8 py-2.5 text-[13px] uppercase tracking-[0.14em] bg-accent text-white no-underline hover:opacity-90 transition-opacity"
            >
              {environment.contactEmail}
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
