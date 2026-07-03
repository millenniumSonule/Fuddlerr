import { motion } from 'framer-motion';
import { useState } from 'react';
import FadeIn from './FadeIn';
import contentData from '../data/content.json';

const gallery = contentData.gallery.items.map((item) => ({
  ...item,
  color: ['from-brand-gold to-brand-copper', 'from-brand-forest to-brand-sage', 'from-brand-charcoal to-brand-stone', 'from-brand-copper to-brand-forest', 'from-brand-goldLight to-brand-gold', 'from-brand-sage to-brand-forest'][item.id - 1]
}));

export default function GallerySection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="relative bg-brand-warmBg py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(45deg, #B8914A 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-brand-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              {contentData.gallery.label}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight mb-6">
              {contentData.gallery.title}
            </h2>
            <p className="text-brand-taupe text-lg max-w-2xl mx-auto">
              {contentData.gallery.description}
            </p>
          </div>
        </FadeIn>

        <div className="gallery-marquee mb-10" aria-hidden="true">
          <div className="gallery-marquee__track">
            {[...gallery, ...gallery].map((item, index) => (
              <span key={`${item.id}-${index}`}>{item.title}</span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 [perspective:1200px]">
          {gallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="premium-card group cursor-pointer"
              data-magnetic
            >
              <motion.div
                className={`gallery-card relative h-64 md:h-72 bg-gradient-to-br ${item.color} rounded-2xl overflow-hidden shadow-2xl`}
                whileHover={{ y: -8, rotateX: 3, rotateY: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                <div 
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.24), transparent 34%)'
                  }}
                />
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
