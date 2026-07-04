import FadeIn from './FadeIn';
import { useContent } from '../content/useContent';

export default function BrandPersonality() {
  const contentData = useContent();
  const brands = contentData.brandPersonality.brands;

  return (
    <section className="relative bg-[#F6F1E8] py-28 md:py-36 overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-6 md:px-8 text-center">
        <FadeIn>
          <p
            className="text-[#A96D3A] text-sm tracking-[0.3em] uppercase mb-4 font-medium"
            data-cms-path='["brandPersonality","label"]'
          >
            {contentData.brandPersonality.label}
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#201A17] mb-12 leading-tight"
            data-cms-path='["brandPersonality","title"]'
          >
            {contentData.brandPersonality.title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p
            className="text-[#6A5B50] text-lg md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto"
            data-cms-path='["brandPersonality","description"]'
          >
            {contentData.brandPersonality.description}
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-14">
            {brands.map((b, idx) => (
              <span
                key={b}
                className="px-5 py-2 bg-[#FFFDF9] border border-[#D8CFC0] rounded-full text-[#4B4138] text-sm font-medium tracking-wide"
                data-cms-path={JSON.stringify(['brandPersonality', 'brands', idx])}
              >
                {b}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="bg-[#FFFDF8] rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-[#D8CFC0] shadow-[0_22px_70px_rgba(32,26,23,0.08)]">
            <p
              className="font-serif text-xl md:text-2xl text-[#251E1A] leading-relaxed italic"
              data-cms-path='["brandPersonality","personalityDesc"]'
            >
              {contentData.brandPersonality.personalityDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              {contentData.brandPersonality.personalityTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-[#D6B778]/45 bg-[#F5E9D4] px-4 py-2 text-sm font-semibold tracking-[0.14em] text-[#5A3B20] md:text-base"
                  data-cms-path={JSON.stringify(['brandPersonality', 'personalityTraits', idx, 'text'])}
                >
                  {trait.text}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
