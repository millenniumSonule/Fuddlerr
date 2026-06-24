import FadeIn from './FadeIn';

export default function BrandStory() {
  return (
    <section className="relative bg-brand-cream py-28 md:py-36 overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-copper/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <p className="text-brand-copper text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Our Story
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal mb-16 max-w-3xl leading-tight">
            Born from the meeting of two completely different minds
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <div className="w-12 h-px bg-brand-gold" />
              <p className="text-brand-earth text-lg leading-relaxed">
                One founder grew up inspired by the relentless energy, diversity, and street culture of Mumbai. To them, beer was never just a drink — it was about bringing people together, celebrating stories, and creating unforgettable nights.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="space-y-6">
              <div className="w-12 h-px bg-brand-copper" />
              <p className="text-brand-earth text-lg leading-relaxed">
                The other founder was deeply inspired by Nordic values: simplicity, precision, sustainability, craftsmanship, and thoughtful design. They believed that every product should be intentional, beautifully designed, and built to last.
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.6}>
          <div className="mt-20 pt-12 border-t border-brand-sand">
            <p className="font-serif text-2xl md:text-3xl text-brand-charcoal leading-relaxed max-w-4xl">
              Together, they realized that India's craft beer market lacked a brand that combined <span className="text-brand-copper">premium brewing</span> with <span className="text-brand-gold">meaningful storytelling</span> and <span className="text-brand-forest">world-class design</span>.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.8}>
          <div className="mt-16 text-center">
            <p className="font-serif text-xl md:text-2xl text-brand-stone italic">
              FUDDLER was created to bridge these two worlds
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
