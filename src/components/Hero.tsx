import { motion } from 'framer-motion';
import beerGlass from '../assets/beer_glass.png';
import heroVideo from '../assets/hero_banner_video.mp4';
import { useContent } from '../content/useContent';
import { resolveCmsImage } from '../utils/cmsImages';

export default function Hero() {
  const contentData = useContent();
  const titleParts = contentData.hero.mainTitle.split('L');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-espresso">
      <div className="absolute inset-0 overflow-hidden">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 1.3, ease: 'easeOut' }}
        className="absolute left-6 top-1/3 hidden lg:block"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative w-72 h-96 overflow-hidden"
          whileHover={{ rotateY: 8, y: -4 }}
          transition={{ duration: 0.5 }}
        >
          <img
            data-cms-image-path='["hero","accentImage"]'
            src={resolveCmsImage(contentData.hero.accentImage, beerGlass)}
            alt="Fuddlerr beer glass accent"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </motion.div>
      </motion.div>

      <div className="relative z-10 translate-y-28 px-6 text-center sm:translate-y-32 lg:translate-y-36 max-w-5xl mx-auto">
        <motion.p
          data-cms-path='["hero","subtitle"]'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white text-sm md:text-base tracking-[0.35em] uppercase mb-6 font-medium"
        >
          {contentData.hero.subtitle}
        </motion.p>

        <motion.h1
          data-cms-path='["hero","mainTitle"]'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tight mb-8"
        >
          <span className="text-white">{titleParts[0] || contentData.hero.mainTitle}</span>
          {titleParts.length > 1 && (
            <>
              <span className="gradient-text">L</span>
              <span className="text-white">{titleParts.slice(1).join('L')}</span>
            </>
          )}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-16 h-px bg-brand-gold mx-auto mb-8"
        />

        <motion.p
          data-cms-path='["hero","tagline"]'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl text-white italic tracking-wide"
        >
          {contentData.hero.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center text-xs text-white tracking-wider uppercase"
        >
          {contentData.hero.features.map((feature, idx) => (
            <span key={idx} data-cms-path={JSON.stringify(['hero', 'features', idx])}>
              {feature}
              {idx < contentData.hero.features.length - 1 && (
                <span className="hidden sm:inline ml-4">
                  <span className="w-1 h-1 rounded-full bg-brand-stone inline-block" />
                </span>
              )}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-brand-gold to-transparent mx-auto animate-pulse" />
      </motion.div>
    </section>
  );
}
