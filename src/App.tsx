import Hero from './components/Hero';
import BrandStory from './components/BrandStory';
import Founders from './components/Founders';
import Philosophy from './components/Philosophy';
import BrandValues from './components/BrandValues';
import BrandPersonality from './components/BrandPersonality';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-brand-espresso">
      <Hero />
      <BrandStory />
      <Founders />
      <Philosophy />
      <BrandValues />
      <BrandPersonality />
      <Footer />
    </div>
  );
}

export default App;
