import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { CookieBanner } from './components/CookieBanner';
import { SoonGate } from './components/SoonGate';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { SectionPage } from './pages/SectionPage';
import { ArticlePage } from './pages/ArticlePage';
import { SourcesPage } from './pages/SourcesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SoonGate>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/noticias" element={<NewsPage />} />
            <Route path="/seccion/:slug" element={<SectionPage />} />
            <Route path="/noticia/:slug" element={<ArticlePage />} />
            <Route path="/medios" element={<SourcesPage />} />
            <Route path="/privacidad" element={<PrivacyPage />} />
            <Route path="/terminos" element={<TermsPage />} />
            {/* Rutas en inglés heredadas del estándar: se redirigen para no
                dejar 404 si alguien copia un enlace del proyecto anterior. */}
            <Route path="/privacy" element={<Navigate to="/privacidad" replace />} />
            <Route path="/terms" element={<Navigate to="/terminos" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <CookieBanner />
        </BrowserRouter>
      </SoonGate>
    </MotionConfig>
  );
}

export default App;
