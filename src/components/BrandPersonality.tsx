import FadeIn from './FadeIn';
import { useContent } from '../content/useContent';

export default function BrandPersonality() {
  const contentData = useContent();
  const brands = contentData.brandPersonality.brands;

  return (
    <section className="relative bg-brand-cream py-28 md:py-36 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-6 md:px-8 text-center">
        <FadeIn>
          <p className="text-brand-copper text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            {contentData.brandPersonality.label}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal mb-12 leading-tight">
            {contentData.brandPersonality.title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-brand-earth text-lg md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
            {contentData.brandPersonality.description}
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-14">
            {brands.map((b) => (
              <span
                key={b}
                className="px-5 py-2 bg-brand-warmBg border border-brand-warmGray/70 rounded-full text-brand-warmText text-sm font-medium tracking-wide"
              >
                {b}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="bg-brand-charcoal rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <p className="font-serif text-xl md:text-2xl text-white leading-relaxed italic">
              {contentData.brandPersonality.personalityDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {contentData.brandPersonality.personalityTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className={`font-medium text-sm md:text-base tracking-wider ${
                    trait.color === 'gold'
                      ? 'text-brand-gold'
                      : trait.color === 'copper'
                      ? 'text-brand-copper'
                      : 'text-brand-sage'
                  }`}
                >
                  {trait.text}
                  {idx < contentData.brandPersonality.personalityTraits.length - 1 && (
                    <span className="text-brand-stone ml-4 mr-4">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
