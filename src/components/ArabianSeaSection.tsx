import FadeIn from './FadeIn';
import lightThemeImage from '../assets/light_theme_middle_section.png';

export default function ArabianSeaSection() {
  return (
    <section className="py-20 bg-[#f7ede0]">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr] items-stretch rounded-[2rem] overflow-hidden bg-white/90 shadow-[0_35px_100px_rgba(15,15,15,0.08)] border border-brand-charcoal/10">
            <div className="p-10 md:p-14 lg:pl-16 lg:pr-10 flex flex-col justify-center">
              <p className="text-[#b27d3d] text-sm tracking-[0.4em] uppercase mb-4 font-semibold">
                Our Story
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1e1a18] leading-tight mb-6">
                Born on the Arabian Sea
              </h2>
              <p className="text-[#5e5349] text-base md:text-lg max-w-xl leading-relaxed">
                Mumbai is our home. The sea is our constant inspiration.
                Fuddlerr is our tribute to this city, its people and its unbreakable spirit.
              </p>
              <button className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#b27d3d] bg-[#f6e4ca] px-6 py-3 text-sm font-semibold text-[#4a392f] transition hover:bg-[#e9d0a2]">
                Our Story
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="relative overflow-hidden bg-[#f5e1c9] min-h-[420px] lg:min-h-[520px] h-full">
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
