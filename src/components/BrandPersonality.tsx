import FadeIn from './FadeIn';
import { useContent } from '../content/useContent';

export default function BrandPersonality() {
  const contentData = useContent();
  const brands = contentData.brandPersonality.brands;

  return (
    <section className="relative overflow-hidden bg-brand-cream py-28 md:py-36">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-gold/10 to-transparent" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6 md:px-8">
        <FadeIn>
          <div className="max-w-3xl">
            <p
              className="text-brand-copper text-sm font-semibold uppercase tracking-[0.28em]"
              data-cms-path='["brandPersonality","label"]'
            >
              {contentData.brandPersonality.label}
            </p>
            <h2
              className="mt-4 font-serif text-4xl leading-tight text-brand-charcoal md:text-5xl lg:text-6xl"
              data-cms-path='["brandPersonality","title"]'
            >
              {contentData.brandPersonality.title}
            </h2>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <FadeIn delay={0.2}>
            <div className="rounded-[1.5rem] border border-brand-warmGray/50 bg-white/80 p-8 shadow-[0_24px_70px_rgba(42,36,32,0.06)] backdrop-blur-sm md:p-10">
              <p
                className="max-w-2xl text-lg leading-relaxed text-brand-earth md:text-xl"
                data-cms-path='["brandPersonality","description"]'
              >
                {contentData.brandPersonality.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {brands.map((brand, idx) => (
                  <span
                    key={brand}
                    className="inline-flex items-center gap-3 rounded-2xl border border-brand-warmGray/60 bg-brand-cream/80 px-4 py-3 text-sm font-medium text-brand-warmText"
                    data-cms-path={JSON.stringify(['brandPersonality', 'brands', idx])}
                  >
                    <span className="h-2 w-2 rounded-full bg-brand-copper" aria-hidden="true" />
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="rounded-[1.5rem] border border-brand-charcoal/10 bg-brand-charcoal p-8 text-white shadow-[0_30px_80px_rgba(42,36,32,0.18)] md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold/80">Personality guide</p>
              <p
                className="mt-4 font-serif text-2xl leading-relaxed italic text-white md:text-3xl"
                data-cms-path='["brandPersonality","personalityDesc"]'
              >
                {contentData.brandPersonality.personalityDesc}
              </p>

              <div className="mt-8 space-y-3">
                {contentData.brandPersonality.personalityTraits.map((trait, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    data-cms-path={JSON.stringify(['brandPersonality', 'personalityTraits', idx, 'text'])}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        trait.color === 'gold' ? 'bg-brand-gold' : trait.color === 'copper' ? 'bg-brand-copper' : 'bg-brand-sage'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold tracking-[0.16em] text-white/92 md:text-base">
                      {trait.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
