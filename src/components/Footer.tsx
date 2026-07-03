import { lazy, Suspense } from 'react';
import FadeIn from './FadeIn';
import { useContent } from '../content/useContent';

const FooterExperience = lazy(() =>
  import('./three/ExperienceScenes').then((module) => ({ default: module.FooterExperience })),
);

export default function Footer() {
  const contentData = useContent();

  return (
    <footer className="relative bg-brand-charcoal py-20 md:py-24 overflow-hidden">
      <Suspense fallback={null}>
        <FooterExperience />
      </Suspense>
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #D0D0D0 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h3
              data-cms-path='["footer","brand"]'
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4"
            >
              {contentData.footer.brand.substring(0, 4)}<span className="text-brand-gold">{contentData.footer.brand.substring(4)}</span>
            </h3>
            <p className="text-brand-cream/72 text-sm tracking-[0.35em] uppercase">
              {contentData.footer.tagline}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16 text-brand-cream/70 text-sm tracking-wider">
            {contentData.footer.features.map((feature, idx) => (
              <span key={idx}>
                {feature}
                {idx < contentData.footer.features.length - 1 && <span> · </span>}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-brand-cream/55 text-xs tracking-wider">
              {contentData.footer.copyright}
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
