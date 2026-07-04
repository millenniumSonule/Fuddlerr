import FadeIn from './FadeIn';
import { useContent } from '../content/useContent';

export default function Founders() {
  const contentData = useContent();
  const founders = contentData.founders.founders;

  return (
    <section className="relative bg-brand-warmBg py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #F5F1EB 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <p
              className="text-brand-gold text-sm tracking-[0.3em] uppercase mb-4 font-medium"
              data-cms-path='["founders","label"]'
            >
              {contentData.founders.label}
            </p>
            <h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight"
              data-cms-path='["founders","title"]'
            >
              {contentData.founders.title}
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {founders.map((founder, idx) => (
            <FadeIn key={founder.role} delay={0.2 + idx * 0.2}>
              <div className="group relative bg-brand-cream border border-brand-warmGray rounded-lg p-8 md:p-10 hover:border-brand-warmGray/80 transition-all duration-500">
                <div className={`w-12 h-1 rounded-full mb-8 ${founder.accent === 'gold' ? 'bg-brand-gold' : 'bg-brand-copper'}`} />

                <h3
                  className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-2"
                  data-cms-path={JSON.stringify(['founders', 'founders', idx, 'role'])}
                >
                  {founder.role}
                </h3>
                <p
                  className="text-brand-stone text-sm tracking-wider uppercase mb-6"
                  data-cms-path={JSON.stringify(['founders', 'founders', idx, 'title'])}
                >
                  {founder.title}
                </p>

                <p
                  className="text-brand-taupe leading-relaxed mb-8"
                  data-cms-path={JSON.stringify(['founders', 'founders', idx, 'description'])}
                >
                  {founder.description}
                </p>

                <div className="mb-8">
                  <p
                    className="text-brand-stone text-xs tracking-wider uppercase mb-3"
                    data-cms-path='["founders","responsibilitiesLabel"]'
                  >
                    {contentData.founders.responsibilitiesLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {founder.responsibilities.map((r, responsibilityIdx) => (
                      <span
                        key={r}
                        className="text-xs px-3 py-1 rounded-full border border-brand-warmGray/60 text-brand-taupe"
                        data-cms-path={JSON.stringify([
                          'founders',
                          'founders',
                          idx,
                          'responsibilities',
                          responsibilityIdx,
                        ])}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <blockquote
                  className="font-serif text-xl md:text-2xl italic text-brand-charcoal/90 leading-relaxed border-l-2 border-brand-warmGray/50 pl-6"
                  data-cms-path={JSON.stringify(['founders', 'founders', idx, 'quote'])}
                >
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
