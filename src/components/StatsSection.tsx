import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import FadeIn from './FadeIn';
import { useContent } from '../content/useContent';
import { resolveCmsImage } from '../utils/cmsImages';

const transparentPixel =
  'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

type StatItem = {
  number: number;
  suffix: string;
  label: string;
  image: string;
};

const Counter = ({
  from,
  to,
  suffix,
  delay,
  cmsPath,
}: {
  from: number;
  to: number;
  suffix: string;
  delay: number;
  cmsPath: Array<string | number>;
}) => {
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
        <span data-cms-path={JSON.stringify(cmsPath)} data-cms-original-value={String(to)}>
          {count}
        </span>
        {suffix}
      </p>
    </motion.div>
  );
};

export default function StatsSection() {
  const contentData = useContent();
  const stats = contentData.stats.data;

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
              {contentData.stats.label}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight">
              {contentData.stats.title}
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, idx) => (
            <StatCard stat={stat} idx={idx} key={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, idx }: { stat: StatItem; idx: number }) {
  const statImage = resolveCmsImage(stat.image, transparentPixel);
  const delay = idx * 0.12;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 w-24 h-24 bg-brand-gold/10 rounded-full blur-xl group-hover:bg-brand-gold/20 transition-colors" />
        <div
          className="cms-image-target relative w-24 h-24 rounded-full flex items-center justify-center border border-brand-warmGray/60 overflow-hidden bg-gradient-to-br from-brand-gold/8 to-brand-copper/3 bg-center bg-cover"
          data-cms-image-path={JSON.stringify(['stats', 'data', idx, 'image'])}
          style={{ backgroundImage: `url("${statImage}")` }}
        >
          <button
            type="button"
            className="cms-stat-upload absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/15 text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-white backdrop-blur-[1px]"
            data-cms-image-path={JSON.stringify(['stats', 'data', idx, 'image'])}
            aria-label={`Change image for ${stat.label}`}
          >
            {stat.image ? 'Change image' : 'Add image'}
          </button>
        </div>
      </div>

      <Counter
        from={0}
        to={stat.number}
        suffix={stat.suffix}
        delay={delay}
        cmsPath={['stats', 'data', idx, 'number']}
      />

      <p className="text-brand-taupe text-lg font-medium">{stat.label}</p>
    </motion.div>
  );
}
