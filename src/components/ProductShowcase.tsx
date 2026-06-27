import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import FadeIn from './FadeIn';
import productCan from '../assets/genric_beer_can.png';
import productArt from '../assets/Gemini_Generated_Image_tduvgytduvgytduv.png';
import taxiAsset from '../assets/mumbai_taxi.png';

const products = [
  {
    id: 1,
    name: 'Original Blend',
    description: 'Our flagship craft beer crafted with precision',
    color: 'from-brand-gold to-brand-goldLight',
    icon: '🍺',
    image: productCan,
    alt: 'Original Blend beer can',
  },
  {
    id: 2,
    name: 'Nordic Reserve',
    description: 'Limited edition, inspired by Nordic traditions',
    color: 'from-brand-copper to-brand-forest',
    icon: '✨',
    image: productArt,
    alt: 'Nordic Reserve premium design',
  },
  {
    id: 3,
    name: 'Mumbai Monsoon',
    description: 'Bold flavors celebrating the spirit of the city',
    color: 'from-brand-forest to-brand-sage',
    icon: '⚡',
    image: productCan,
    alt: 'Mumbai Monsoon beer can',
  },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const taxiRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const taxi = taxiRef.current;
    if (!section || !taxi) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
        const x = Math.sin(progress * Math.PI * 2) * 48;
        const y = Math.sin(progress * Math.PI * 4) * 14;
        const rotate = x * 0.12;

        taxi.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;
        taxi.style.opacity = `${0.85 + progress * 0.15}`;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-b from-brand-espresso to-brand-charcoal py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #B8914A 1px, transparent 0)',
        backgroundSize: '50px 50px',
      }} />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-brand-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              Our Collection
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-cream leading-tight mb-6">
              Crafted Excellence
            </h2>
            <p className="text-brand-taupe text-lg max-w-2xl mx-auto">
              Each bottle is a celebration of our dual heritage and commitment to quality
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          <motion.img
            ref={taxiRef}
            src={taxiAsset}
            alt="Mumbai taxi accent"
            className="hidden lg:block absolute left-0 top-1/2 h-24 w-24 rounded-full border-2 border-brand-cream/50 bg-brand-espresso/20 object-contain shadow-[0_25px_55px_rgba(0,0,0,0.28)] transition-transform duration-200"
          />
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
              <div className={`absolute inset-0 bg-gradient-to-br ${product.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              <div className="relative bg-brand-charcoal border border-brand-stone/20 rounded-2xl p-8 overflow-hidden transition-all duration-500 hover:border-brand-stone/40">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-500" />
                
                <motion.div 
                  className="text-5xl mb-6 relative z-10"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {product.icon}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ rotate: 2, y: -4 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="relative z-10 mx-auto mb-6 overflow-hidden rounded-[2rem] border border-brand-gold/10 bg-brand-espresso/10 shadow-[0_30px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl w-full max-w-sm"
                >
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="product-card-image w-full object-cover object-center aspect-[4/5]"
                  />
                </motion.div>

                <h3 className="font-serif text-2xl md:text-3xl text-brand-cream mb-3 relative z-10">
                  {product.name}
                </h3>
                <p className="text-brand-taupe leading-relaxed relative z-10 mb-6">
                  {product.description}
                </p>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-brand-gold text-sm uppercase tracking-widest font-medium flex items-center gap-2 relative z-10"
                >
                  Discover More →
                </motion.button>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
}
