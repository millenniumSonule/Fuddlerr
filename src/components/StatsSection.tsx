import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';

const stats = [
  { number: 50, suffix: 'K+', label: 'Happy Customers', delay: 0 },
  { number: 15, suffix: '+', label: 'Awards Won', delay: 0.2 },
  { number: 100, suffix: '%', label: 'Sustainable', delay: 0.4 },
  { number: 8, suffix: 'yr', label: 'Crafting Excellence', delay: 0.6 },
];

const Counter = ({ from, to, suffix, delay }: { from: number; to: number; suffix: string; delay: number }) => {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          const duration = 2000;
          const increment = (to - from) / (duration / 16);
          let current = from;

          const interval = setInterval(() => {
            current += increment;
            if (current >= to) {
              setCount(to);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);

          return () => clearInterval(interval);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [from, to]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
    >
      <p className="text-5xl md:text-6xl font-bold text-brand-gold mb-2">
        {count}{suffix}
      </p>
    </motion.div>
  );
};

export default function StatsSection() {
  return (
    <section className="relative bg-brand-warmBg py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-copper/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-brand-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              By The Numbers
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight">
              Our Impact
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: stat.delay, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 w-24 h-24 bg-brand-gold/10 rounded-full blur-xl group-hover:bg-brand-gold/20 transition-colors" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-brand-gold/8 to-brand-copper/3 rounded-full flex items-center justify-center border border-brand-warmGray/60" />
              </div>
              
              <Counter from={0} to={stat.number} suffix={stat.suffix} delay={stat.delay} />
              
              <p className="text-brand-taupe text-lg font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
