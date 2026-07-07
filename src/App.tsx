import Header from './components/Header';
import Hero from './components/Hero';
import BrandStory from './components/BrandStory';
import ProductShowcase from './components/ProductShowcase';
import Founders from './components/Founders';
import Philosophy from './components/Philosophy';
import StatsSection from './components/StatsSection';
import BrandValues from './components/BrandValues';
import GallerySection from './components/GallerySection';
import Testimonials from './components/Testimonials';
import EventsSection from './components/EventsSection';
import BrandPersonality from './components/BrandPersonality';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import RedCanSection from './components/RedCanSection';
import ArabianSeaSection from './components/ArabianSeaSection';
import MagneticCursor from './components/MagneticCursor';
import SmoothScroll from './components/SmoothScroll';
import EditModeCMS from './components/EditModeCMS';
import { useContent } from './content/useContent';
import type { CSSProperties } from 'react';

function App() {
  const contentData = useContent();
  const isEditMode = window.location.pathname === '/edit';
  const cmsSections = (contentData.cms?.sections || {}) as Partial<Record<string, boolean>>;
  const cmsTheme = contentData.cms?.theme;
  const appStyle = {
    '--cms-text-color': cmsTheme?.text || '#2A2420',
    '--cms-muted-color': cmsTheme?.muted || '#6D5B50',
    '--cms-accent-color': cmsTheme?.accent || '#C6972F',
  } as CSSProperties;

  const isVisible = (key: keyof typeof cmsSections | string, fallback = true) => {
    const value = cmsSections[key];
    return typeof value === 'boolean' ? value : fallback;
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-brand-espresso" style={appStyle}>
        {!isEditMode && <MagneticCursor />}
        {isEditMode && <EditModeCMS />}
        {isVisible('header') && <Header />}
        <main className="pt-0">
          {isVisible('hero') && (
            <section id="hero">
              <Hero />
            </section>
          )}
          {isVisible('redCan') && <RedCanSection />}
          {isVisible('about') && (
            <section id="about">
              <ArabianSeaSection />
            </section>
          )}
          {isVisible('brandStory') && <BrandStory />}
          {isVisible('products') && (
            <section id="products">
              <ProductShowcase />
            </section>
          )}
          {isVisible('founders') && <Founders />}
          {isVisible('philosophy') && <Philosophy />}
          {isVisible('stats') && <StatsSection />}
          {isVisible('brandValues') && <BrandValues />}
          {isVisible('gallery') && <GallerySection />}
          {isVisible('testimonials') && <Testimonials />}
          {isVisible('community') && (
            <section id="community">
              <EventsSection />
            </section>
          )}
          {isVisible('brandPersonality') && <BrandPersonality />}
          {isVisible('cta') && <CTASection />}
          {isVisible('footer') && (
            <section id="contact">
              <Footer />
            </section>
          )}
        </main>
      </div>
    </SmoothScroll>
  );
}

export default App;
