import { motion } from 'framer-motion';
import heroVideo from '../assets/hero_banner_video.mp4';
import { useContent } from '../content/useContent';

export default function Hero() {
  const contentData = useContent();

  return (
    <section className="relative min-h-screen overflow-hidden bg-brand-espresso">
      <div className="absolute inset-0">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto px-6 py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="max-w-3xl"
          >
            <p
              data-cms-path='["hero","subtitle"]'
              className="text-brand-cream text-xs md:text-sm tracking-[0.35em] uppercase mb-4 font-semibold"
            >
              {contentData.hero.subtitle}
            </p>

            <h1
              data-cms-path='["hero","mainTitle"]'
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-tight leading-[0.92] text-brand-cream mb-6 whitespace-pre-line"
            >
              {contentData.hero.mainTitle}
            </h1>

            <p
              data-cms-path='["hero","tagline"]'
              className="font-serif text-4xl sm:text-5xl md:text-6xl text-brand-gold uppercase tracking-[0.22em] mb-8"
            >
              {contentData.hero.tagline}
            </p>

            <p
              data-cms-path='["hero","description"]'
              className="text-brand-cream/90 text-base md:text-lg leading-relaxed max-w-2xl mb-10"
            >
              {contentData.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(198,151,47,0.22)] transition-all hover:-translate-y-0.5"
              >
                Explore Beers
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
              >
                Our Taproom
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
