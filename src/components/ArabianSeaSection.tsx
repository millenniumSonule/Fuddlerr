import FadeIn from './FadeIn';
import lightThemeImage from '../assets/light_theme_middle_section.png';

export default function ArabianSeaSection() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr] items-stretch rounded-[2rem] overflow-hidden bg-brand-warmBg/90 shadow-[0_35px_100px_rgba(198,151,47,0.06)] border border-brand-warmGray/40">
            <div className="p-10 md:p-14 lg:pl-16 lg:pr-10 flex flex-col justify-center">
              <p className="text-brand-copper text-sm tracking-[0.4em] uppercase mb-4 font-semibold">
                Our Story
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-brand-charcoal leading-tight mb-6">
                Born on the Arabian Sea
              </h2>
              <p className="text-brand-stone text-base md:text-lg max-w-xl leading-relaxed">
                Mumbai is our home. The sea is our constant inspiration.
                Fuddlerr is our tribute to this city, its people and its unbreakable spirit.
              </p>
              <button className="mt-10 inline-flex items-center gap-3 rounded-full border border-brand-copper bg-brand-gold/20 px-6 py-3 text-sm font-semibold text-brand-charcoal transition hover:bg-brand-gold/30">
                Our Story
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="relative overflow-hidden bg-brand-warmBg min-h-[420px] lg:min-h-[520px] h-full">
              <img
                src={lightThemeImage}
                alt="Born on the Arabian Sea"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
