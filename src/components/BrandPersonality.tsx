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
          <div className="bg-[#241F1B] rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-[#3A302A]">
            <p
              className="font-serif text-xl md:text-2xl text-[#FFF6EB] leading-relaxed italic"
              data-cms-path='["brandPersonality","personalityDesc"]'
            >
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
                  data-cms-path={JSON.stringify(['brandPersonality', 'personalityTraits', idx, 'text'])}
                >
                  {trait.text}
                  {idx < contentData.brandPersonality.personalityTraits.length - 1 && (
                    <span className="text-[#95897C] ml-4 mr-4">·</span>
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
