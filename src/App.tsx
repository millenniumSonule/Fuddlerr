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

function App() {
  const isEditMode = window.location.pathname === '/edit';

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-brand-espresso">
        <MagneticCursor />
        {isEditMode && <EditModeCMS />}
        <Header />
        <main className="pt-20">
          <section id="hero">
            <Hero />
          </section>
          <RedCanSection />
          <section id="about">
            <ArabianSeaSection />
          </section>
          <BrandStory />
          <section id="products">
            <ProductShowcase />
          </section>
          <Founders />
          <Philosophy />
          <StatsSection />
          <BrandValues />
          <GallerySection />
          <Testimonials />
          <section id="community">
            <EventsSection />
          </section>
          <BrandPersonality />
          <CTASection />
          <section id="contact">
            <Footer />
          </section>
        </main>
      </div>
    </SmoothScroll>
  );
}

export default App;
