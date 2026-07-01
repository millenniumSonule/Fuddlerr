import FadeIn from './FadeIn';

const brands = [
  'Apple', 'Aesop', 'BrewDog', 'Bang & Olufsen', 'Soho House', 'Muji'
];

export default function BrandPersonality() {
  return (
    <section className="relative bg-brand-cream py-28 md:py-36 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-6 md:px-8 text-center">
        <FadeIn>
          <p className="text-brand-copper text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Brand Personality
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal mb-12 leading-tight">
            A Craft Beer Company Rooted in Mumbai
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-brand-earth text-lg md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
            Imagine if these brands came together to create a craft beer company. That is the standard for FUDDLER.
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
              Every touchpoint — from the logo and packaging to the taproom, website, investor deck, merchandise, and social media — should reflect
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <span className="text-brand-gold font-medium text-sm md:text-base tracking-wider">Understated Luxury</span>
              <span className="text-brand-stone">·</span>
              <span className="text-brand-copper font-medium text-sm md:text-base tracking-wider">Modern Craftsmanship</span>
              <span className="text-brand-stone">·</span>
              <span className="text-brand-sage font-medium text-sm md:text-base tracking-wider">World-Class Lifestyle</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
