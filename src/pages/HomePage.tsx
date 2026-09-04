import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroBanners } from '../components/HeroBanners';
import { TickerSection } from '../components/sections/TickerSection';
import { FrontPageSection } from '../components/sections/FrontPageSection';
import { NewsFeedSection } from '../components/sections/NewsFeedSection';
import { BandaAviso, Clasificados } from '../components/avisos/Aviso';
import { usePageSeo } from '../hooks/usePageSeo';
import { SITE_URL } from '../lib/api';

const TITLE = 'El Guayasense | El diario de Guayaquil';
const DESCRIPTION =
  'Las noticias de Guayaquil de los principales medios de la ciudad, reunidas en una sola edición. Titulares, extracto y enlace directo al medio que las publicó.';

/* La portada arranca en la nota principal, sin hero.

   La web hermana abre con una pantalla completa de presentación. Un periódico
   no hace eso: la mancheta y, debajo, la noticia. */
export function HomePage() {
  usePageSeo({
    title: TITLE,
    description: DESCRIPTION,
    path: '/',
    type: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'El Guayasense',
      url: SITE_URL,
      description: DESCRIPTION,
      inLanguage: 'es-EC',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/noticias?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroBanners />
        <TickerSection />
        {/* El faldón de primera plana. Los huecos se definen en
            `src/data/avisos.ts` y se componen contratados o libres, con la
            misma medida, para que la plana no se recomponga al entrar uno. */}
        <BandaAviso espacio="portada-faldon" />
        <FrontPageSection />
        <NewsFeedSection />
        <Clasificados />
      </main>
      <Footer />
    </div>
  );
}
