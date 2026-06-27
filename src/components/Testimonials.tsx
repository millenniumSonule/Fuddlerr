import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import FadeIn from './FadeIn';

const testimonials = [
  {
    id: 1,
    text: "FUDDLER isn't just beer; it's a statement of identity. The craftsmanship is unparalleled.",
    author: 'Rohan Sharma',
    role: 'Craft Beer Enthusiast',
    image: '👨‍💼',
  },
  {
    id: 2,
    text: 'The design, the story, the taste — everything resonates with who I am. Truly exceptional.',
    author: 'Priya Desai',
    role: 'Brand Curator',
    image: '👩‍💼',
  },
  {
    id: 3,
    text: 'Every bottle tells a story of two worlds coming together beautifully. Remarkable experience.',
    author: 'Aditya Singh',
    role: 'Lifestyle Influencer',
    image: '👨‍🎨',
  },
  {
    id: 4,
    text: 'The commitment to sustainability combined with premium quality is truly inspiring.',
    author: 'Neha Kapoor',
    role: 'Sustainability Advocate',
    image: '👩‍🔬',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative bg-gradient-to-b from-brand-cream to-brand-sand py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-brand-copper text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              Love Stories
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight">
              What Our Community Says
            </h2>
          </div>
        </FadeIn>

        <div className="relative">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl border border-brand-sand/50 max-w-3xl mx-auto"
          >
            <div className="flex items-start gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl">⭐</span>
              ))}
            </div>

            <p className="font-serif text-2xl md:text-3xl text-brand-charcoal mb-8 italic leading-relaxed">
              "{testimonials[current].text}"
            </p>

            <div className="flex items-center gap-4">
              <motion.div
                className="text-4xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {testimonials[current].image}
              </motion.div>
              <div>
                <p className="font-serif text-lg text-brand-charcoal font-medium">
                  {testimonials[current].author}
                </p>
                <p className="text-brand-stone">{testimonials[current].role}</p>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-6 mt-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prev}
              className="p-3 rounded-full bg-brand-gold text-brand-espresso hover:bg-brand-goldLight transition-colors"
            >
              <ChevronLeft size={20} />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === current ? 'bg-brand-gold w-8' : 'bg-brand-stone/40'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className="p-3 rounded-full bg-brand-gold text-brand-espresso hover:bg-brand-goldLight transition-colors"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
