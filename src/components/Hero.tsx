import { motion } from 'framer-motion';
import { Anchor, Beer, Menu as Lines, Waves } from 'lucide-react';
import heroVideo from '../assets/hero_banner_video.mp4';
import { useContent } from '../content/useContent';

export default function Hero() {
  const contentData = useContent();
  const featureItems = [
    { label: 'Locally Brewed', icon: Beer },
    { label: 'Quality Ingredients', icon: Waves },
    { label: 'Nordic Influence', icon: Lines },
    { label: 'Mumbai Soul', icon: Anchor },
  ];

  return (
    <section className="relative h-[760px] min-h-[680px] overflow-hidden bg-brand-charcoal md:h-[78svh] md:min-h-[720px] md:max-h-[840px]">
      <div className="absolute inset-0">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,19,20,0.72)_0%,rgba(12,19,20,0.42)_35%,rgba(12,19,20,0.08)_65%,rgba(12,19,20,0.34)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,16,0.36)_0%,rgba(8,14,16,0.04)_48%,rgba(8,14,16,0.58)_100%)]" />
      </div>

      <div className="relative z-10 h-full">
        <div className="w-full px-6 pt-[9.5rem] md:px-10 md:pt-[9.75rem] lg:px-12 lg:pt-[8.75rem]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="max-w-[54rem]"
          >
            <div className="mb-5 flex items-start gap-4 md:mb-6">
              <Lines className="mt-1 h-5 w-5 shrink-0 text-brand-cream/80" strokeWidth={1.5} />
              <p
                data-cms-path='["hero","subtitle"]'
                className="max-w-xs text-xs font-semibold uppercase leading-6 tracking-[0.18em] text-brand-gold md:text-sm"
              >
                {contentData.hero.subtitle}
              </p>
            </div>

            <h1
              data-cms-path='["hero","mainTitle"]'
              className="whitespace-pre-line font-serif text-[2.5rem] font-black uppercase leading-[0.9] text-brand-cream drop-shadow-[0_8px_26px_rgba(0,0,0,0.35)] sm:text-[3.75rem] md:text-[4.45rem] lg:text-[4.6rem] xl:text-[5rem]"
            >
              {contentData.hero.mainTitle}
            </h1>

            <p
              data-cms-path='["hero","tagline"]'
              className="mt-2.5 max-w-[48rem] font-serif text-[1.85rem] font-black uppercase leading-[0.92] text-brand-gold drop-shadow-[0_8px_24px_rgba(0,0,0,0.26)] sm:text-[2.55rem] md:text-[3rem] lg:text-[3.35rem] xl:text-[3.75rem]"
            >
              {contentData.hero.tagline}
            </p>

            <p
              data-cms-path='["hero","description"]'
              className="mt-5 max-w-[27rem] text-sm font-medium leading-7 text-white md:text-base md:leading-8"
            >
              {contentData.hero.description}
            </p>

            <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                href="#products"
                className="inline-flex min-w-44 items-center justify-between gap-6 bg-brand-gold px-6 py-3 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white shadow-[0_20px_52px_rgba(0,0,0,0.26)] transition-all hover:-translate-y-0.5 hover:bg-brand-goldLight"
              >
                <span>Explore Beers</span>
                <span className="text-lg leading-none">→</span>
              </a>
              <a
                href="#about"
                className="inline-flex min-w-44 items-center justify-between gap-6 border border-brand-cream/70 bg-black/5 px-6 py-3 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-brand-cream backdrop-blur-[2px] transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <span>Our Taproom</span>
                <span className="text-lg leading-none">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <aside className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 border-l border-brand-cream/30 pr-2 lg:block xl:right-12">
        {featureItems.map(({ label, icon: Icon }, index) => (
          <div key={label} className="relative flex w-32 flex-col items-center py-6 text-center">
            {index > 0 && <span className="absolute top-0 h-px w-24 bg-brand-cream/18" />}
            <Icon className="mb-3 h-7 w-7 text-brand-gold" strokeWidth={1.5} />
            <span className="max-w-24 text-[0.65rem] font-bold uppercase leading-5 tracking-[0.18em] text-brand-cream">
              {label}
            </span>
          </div>
        ))}
      </aside>
    </section>
  );
}
