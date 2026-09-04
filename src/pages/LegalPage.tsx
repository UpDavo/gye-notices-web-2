import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePageSeo } from '../hooks/usePageSeo';

/* Marco compartido por las dos páginas legales: mismo ritmo tipográfico, un
   solo sitio donde tocarlo.

   Se compone como el resto del diario: los apartados no van numerados ni
   separados por aire, sino por la raya fina que separa dos notas de una misma
   columna, y cada titular lleva su filete rojo debajo. Un documento legal
   impreso se lee así —seguido y ordenado por reglas—, no como una lista de
   cláusulas de una aplicación. */

type Section = { title: string; body: ReactNode };

type Props = {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
  path: string;
  seoTitle: string;
  seoDescription: string;
};

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
  path,
  seoTitle,
  seoDescription,
}: Props) {
  usePageSeo({ title: seoTitle, description: seoDescription, path });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 lg:px-12 pt-8">
        <div className="max-w-3xl mx-auto pb-8">
          <header className="mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent m-0 mb-3">{eyebrow}</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-[1.06] m-0 mb-4 pb-4 border-b-2 border-[hsl(var(--rule))]">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground m-0 mb-6">Última actualización: {updated}</p>
            <p className="text-lg text-foreground/85 leading-relaxed dropcap m-0">
              {intro}
            </p>
          </header>

          <div className="flex flex-col">
            {sections.map((section, i) => (
              <section key={section.title} className={i > 0 ? 'rule-thin pt-8 mt-8' : ''}>
                <h2 className="rule-kicker font-display font-bold text-xl md:text-2xl text-foreground m-0 mb-4">
                  {section.title}
                </h2>
                <div className="text-base text-muted-foreground leading-relaxed flex flex-col gap-3">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
