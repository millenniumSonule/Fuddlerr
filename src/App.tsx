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

function App() {
  return (
    <div className="min-h-screen bg-brand-espresso">
      <Header />
      <main className="pt-20">
        <Hero />
        <RedCanSection />
        <ArabianSeaSection />
        <BrandStory />
        <ProductShowcase />
        <Founders />
        <Philosophy />
        <StatsSection />
        <BrandValues />
        <GallerySection />
        <Testimonials />
        <EventsSection />
        <BrandPersonality />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
