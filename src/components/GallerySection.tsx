import { motion } from 'framer-motion';
import { useState } from 'react';
import FadeIn from './FadeIn';

const gallery = [
  { id: 1, title: 'Heritage Blend', color: 'from-brand-gold to-brand-copper', icon: '🌾' },
  { id: 2, title: 'Urban Essence', color: 'from-brand-forest to-brand-sage', icon: '🏙️' },
  { id: 3, title: 'Nordic Crafted', color: 'from-brand-charcoal to-brand-stone', icon: '❄️' },
  { id: 4, title: 'Monsoon Spirit', color: 'from-brand-copper to-brand-forest', icon: '🌧️' },
  { id: 5, title: 'Premium Reserve', color: 'from-brand-goldLight to-brand-gold', icon: '👑' },
  { id: 6, title: 'Community Love', color: 'from-brand-sage to-brand-forest', icon: '❤️' },
];

export default function GallerySection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="relative bg-brand-espresso py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(45deg, #B8914A 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-brand-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              Gallery
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-cream leading-tight mb-6">
              Moments & Memories
            </h2>
            <p className="text-brand-taupe text-lg max-w-2xl mx-auto">
              Celebrating the journey, the people, and the passion behind every bottle
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {gallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group cursor-pointer"
            >
              <motion.div
                className={`relative h-64 md:h-72 bg-gradient-to-br ${item.color} rounded-2xl overflow-hidden shadow-2xl`}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <motion.div
                    className="text-6xl"
                    animate={hoveredId === item.id ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.icon}
                  </motion.div>
                  <motion.h3
                    className="font-serif text-2xl text-white text-center px-4"
                    animate={hoveredId === item.id ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.7 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.title}
                  </motion.h3>
                </div>

                <motion.div
                  className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                  animate={hoveredId === item.id ? { boxShadow: '0 0 40px rgba(255,255,255,0.2)' } : { boxShadow: 'none' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
