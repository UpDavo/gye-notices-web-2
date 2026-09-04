import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePageSeo } from '../hooks/usePageSeo';

export function NotFoundPage() {
  usePageSeo({
    title: 'Página no encontrada — El Guayasense',
    description: 'No hay ninguna plana en esa dirección.',
    path: '/404',
    noIndex: true,
  });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
        <p className="text-muted-foreground text-sm uppercase tracking-widest m-0 mb-4">404</p>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4 tracking-tight">
          Esta plana no existe
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          El enlace puede estar mal compuesto, o la plana pudo haberse movido de sitio.
        </p>
        <Link
          to="/"
          className="rounded-none px-7 py-3 text-sm font-semibold bg-accent text-white hover:opacity-90 transition-opacity no-underline"
        >
          Volver a primera plana
        </Link>
      </main>
      <Footer />
    </div>
  );
}
