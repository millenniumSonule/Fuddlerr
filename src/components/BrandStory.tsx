import FadeIn from './FadeIn';
import { useContent } from '../content/useContent';

export default function BrandStory() {
  const contentData = useContent();

  return (
    <section className="relative bg-brand-cream py-28 md:py-36 overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-copper/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <p className="text-brand-copper text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            {contentData.brandStory.label}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal mb-16 max-w-3xl leading-tight">
            {contentData.brandStory.title}
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <div className="w-12 h-px bg-brand-gold" />
              <p className="text-brand-earth text-lg leading-relaxed">
                {contentData.brandStory.mumbaiFounder}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="space-y-6">
              <div className="w-12 h-px bg-brand-copper" />
              <p className="text-brand-earth text-lg leading-relaxed">
                {contentData.brandStory.nordicFounder}
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.6}>
          <div className="mt-20 pt-12 border-t border-brand-sand">
            <p className="font-serif text-2xl md:text-3xl text-brand-charcoal leading-relaxed max-w-4xl">
              {contentData.brandStory.conclusion}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.8}>
          <div className="mt-16 text-center">
            <p className="font-serif text-xl md:text-2xl text-brand-stone italic">
              {contentData.brandStory.bridgeText}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
