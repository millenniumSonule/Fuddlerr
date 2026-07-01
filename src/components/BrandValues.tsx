import FadeIn from './FadeIn';

const values = [
  { name: 'Craftsmanship', color: 'gold' },
  { name: 'Curiosity', color: 'copper' },
  { name: 'Authenticity', color: 'forest' },
  { name: 'Sustainability', color: 'charcoal' },
  { name: 'Community', color: 'gold' },
  { name: 'Design Excellence', color: 'copper' },
  { name: 'Innovation', color: 'forest' },
  { name: 'Inclusivity', color: 'charcoal' },
  { name: 'Premium Quality', color: 'gold' },
  { name: 'Memorable Experiences', color: 'copper' },
];

const colorMap: Record<string, string> = {
  gold: 'border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10',
  copper: 'border-brand-copper/40 text-brand-copper hover:bg-brand-copper/10',
  forest: 'border-brand-forest/40 text-brand-forest hover:bg-brand-forest/10',
  charcoal: 'border-brand-charcoal/40 text-brand-charcoal hover:bg-brand-charcoal/10',
};

export default function BrandValues() {
  return (
    <section className="relative bg-brand-warmBg py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #F5F1EB 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-brand-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              What We Stand For
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight">
              Brand Values
            </h2>
          </div>
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {values.map((v, idx) => (
            <FadeIn key={v.name} delay={0.1 + idx * 0.08}>
              <div className={`px-6 py-3 md:px-8 md:py-4 border rounded-full text-sm md:text-base font-medium tracking-wide transition-all duration-300 cursor-default ${colorMap[v.color]}`}>
                {v.name}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
