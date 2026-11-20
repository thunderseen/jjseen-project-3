import React, { useEffect, useState } from 'react';
import { HeroSection } from './sections/HeroSection';
import { MarqueeSection } from './sections/MarqueeSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { CvSection } from './sections/CvSection';
import { ContactModal } from './components/ContactModal';
import { AdminPanel } from './components/AdminPanel';
import { CursorCompanion } from './components/CursorCompanion';
import { PortfolioStore, loadStore, saveStore } from './types/portfolio';

export function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [store, setStore] = useState<PortfolioStore>(() => loadStore());

  const handleUpdateStore = (next: PortfolioStore) => {
    setStore(next);
    saveStore(next);
  };

  // Private Admin Panel triggers: #admin, ?admin=1, or Ctrl+Shift+A
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const checkRoute = () => {
      if (
        window.location.hash === '#admin' ||
        new URLSearchParams(window.location.search).get('admin') === '1'
      ) {
        setAdminOpen(true);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
      }
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const closeAdmin = () => {
    setAdminOpen(false);
    if (import.meta.env.DEV && window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <main
      className="min-h-screen w-full bg-[#0C0C0C] text-[#D7E2EA]"
      style={{ overflowX: 'clip' }}
    >
      <CursorCompanion />
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <HeroSection onOpenContact={() => setContactOpen(true)} />
      <MarqueeSection items={store.showcaseItems} />
      <AboutSection onOpenContact={() => setContactOpen(true)} />
      <ServicesSection />
      <ProjectsSection projects={store.projects} />
      <CvSection
        cvPdfDataUrl={store.cvPdfDataUrl}
        cvPdfName={store.cvPdfName}
        onOpenContact={() => setContactOpen(true)}
      />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      {import.meta.env.DEV && (
        <AdminPanel
          open={adminOpen}
          onClose={closeAdmin}
          store={store}
          onUpdateStore={handleUpdateStore}
        />
      )}
    </main>
  );
}

export default App;
