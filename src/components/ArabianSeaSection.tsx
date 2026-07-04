import FadeIn from './FadeIn';
import lightThemeImage from '../assets/light_theme_middle_section.png';
import { useContent } from '../content/useContent';
import { resolveCmsImage } from '../utils/cmsImages';

export default function ArabianSeaSection() {
  const contentData = useContent();

  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr] items-stretch rounded-[2rem] overflow-hidden bg-brand-warmBg/90 shadow-[0_35px_100px_rgba(198,151,47,0.06)] border border-brand-warmGray/40">
            <div className="p-10 md:p-14 lg:pl-16 lg:pr-10 flex flex-col justify-center">
              <p
                className="text-brand-copper text-sm tracking-[0.4em] uppercase mb-4 font-semibold"
                data-cms-path='["arabianSeaSection","label"]'
              >
                {contentData.arabianSeaSection.label}
              </p>
              <h2
                className="font-serif text-4xl md:text-5xl text-brand-charcoal leading-tight mb-6"
                data-cms-path='["arabianSeaSection","title"]'
              >
                {contentData.arabianSeaSection.title}
              </h2>
              <p
                className="text-brand-stone text-base md:text-lg max-w-xl leading-relaxed"
                data-cms-path='["arabianSeaSection","description"]'
              >
                {contentData.arabianSeaSection.description}
              </p>
              <button
                className="mt-10 inline-flex items-center gap-3 rounded-full border border-brand-copper bg-brand-gold/20 px-6 py-3 text-sm font-semibold text-brand-charcoal transition hover:bg-brand-gold/30"
                data-cms-path='["arabianSeaSection","buttonText"]'
              >
                {contentData.arabianSeaSection.buttonText}
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="relative overflow-hidden bg-brand-warmBg min-h-[420px] lg:min-h-[520px] h-full">
              <img
                data-cms-image-path='["arabianSeaSection","image"]'
                src={resolveCmsImage(contentData.arabianSeaSection.image, lightThemeImage)}
                alt={contentData.arabianSeaSection.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
