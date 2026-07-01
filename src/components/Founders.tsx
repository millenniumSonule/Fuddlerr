import FadeIn from './FadeIn';

const founders = [
  {
    role: 'The Visionary',
    title: 'Brand Vision, Marketing & Community',
    description:
      'The dreamer behind the brand. Creative, ambitious, people-first, energetic, entrepreneurial.',
    quote: 'People rarely remember what they drank. They remember who they shared it with.',
    accent: 'gold',
    responsibilities: [
      'Brand Vision',
      'Marketing',
      'Community Building',
      'Investor Relations',
      'Business Strategy',
      'Customer Experience',
    ],
  },
  {
    role: 'The Craftsman',
    title: 'Brewing Innovation & Quality',
    description:
      'The perfectionist behind every brew. Calm, analytical, detail-oriented, disciplined, quietly obsessed with quality.',
    quote: 'Great beer is not rushed. It is crafted with patience, precision, and purpose.',
    accent: 'copper',
    responsibilities: [
      'Brewing Innovation',
      'Product Development',
      'Quality Control',
      'Sustainability',
      'Operations',
      'Brewery Experience',
    ],
  },
];

export default function Founders() {
  return (
    <section className="relative bg-brand-warmBg py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #F5F1EB 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-brand-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              The Founders
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight">
              Three Minds. One Obsession.
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {founders.map((founder, idx) => (
            <FadeIn key={founder.role} delay={0.2 + idx * 0.2}>
              <div className="group relative bg-brand-cream border border-brand-warmGray rounded-lg p-8 md:p-10 hover:border-brand-warmGray/80 transition-all duration-500">
                <div className={`w-12 h-1 rounded-full mb-8 ${founder.accent === 'gold' ? 'bg-brand-gold' : 'bg-brand-copper'}`} />

                <h3 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-2">
                  {founder.role}
                </h3>
                <p className="text-brand-stone text-sm tracking-wider uppercase mb-6">
                  {founder.title}
                </p>

                <p className="text-brand-taupe leading-relaxed mb-8">
                  {founder.description}
                </p>

                <div className="mb-8">
                  <p className="text-brand-stone text-xs tracking-wider uppercase mb-3">Responsibilities</p>
                  <div className="flex flex-wrap gap-2">
                    {founder.responsibilities.map((r) => (
                      <span
                        key={r}
                        className="text-xs px-3 py-1 rounded-full border border-brand-warmGray/60 text-brand-taupe"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <blockquote className="font-serif text-xl md:text-2xl italic text-brand-charcoal/90 leading-relaxed border-l-2 border-brand-warmGray/50 pl-6">
                  {founder.quote}
                </blockquote>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
