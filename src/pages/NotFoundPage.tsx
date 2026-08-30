import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePageSeo } from '../hooks/usePageSeo';

export function NotFoundPage() {
  usePageSeo({
    title: 'Página no encontrada — Guayaco',
    description: 'La página que buscas no existe.',
    path: '/404',
    noIndex: true,
  });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
        <p className="text-muted-foreground text-sm uppercase tracking-widest m-0 mb-4">404</p>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4 tracking-tight">
          Esta página no existe
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Puede que el enlace esté mal escrito o que la página se haya movido.
        </p>
        <Link
          to="/"
          className="rounded-none px-7 py-3 text-sm font-semibold bg-accent text-white hover:opacity-90 transition-opacity no-underline"
        >
          Ir a la portada
        </Link>
      </main>
      <Footer />
    </div>
  );
}
