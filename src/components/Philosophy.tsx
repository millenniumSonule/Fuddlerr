import FadeIn from './FadeIn';

export default function Philosophy() {
  return (
    <section className="relative bg-brand-cream py-28 md:py-36 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-brand-sand/30 opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-brand-sand/20 opacity-50" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-8 text-center">
        <FadeIn>
          <p className="text-brand-copper text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Philosophy
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl text-brand-charcoal mb-16 leading-tight">
            FUDDLER is not selling beer.
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="font-serif text-3xl md:text-4xl text-brand-copper italic mb-20 leading-relaxed">
            It is creating moments.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {[
            { text: 'Every bottle should remind people of a conversation, a friendship, a celebration, or the beginning of a new story.', icon: 'bottle' },
            { text: 'Every taproom should feel like a second home.', icon: 'home' },
            { text: 'Every product should reflect exceptional craftsmanship.', icon: 'craft' },
            { text: 'Every customer should feel part of the FUDDLER community.', icon: 'people' },
          ].map((item, idx) => (
            <FadeIn key={idx} delay={0.3 + idx * 0.15}>
              <div className="bg-brand-sand/40 border border-brand-sand/60 rounded-lg p-6 md:p-8 h-full flex flex-col items-center text-center hover:bg-brand-sand/60 transition-colors duration-300">
                <div className="w-10 h-10 rounded-full border border-brand-stone/30 flex items-center justify-center mb-4">
                  <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-brand-gold' : idx === 1 ? 'bg-brand-copper' : idx === 2 ? 'bg-brand-forest' : 'bg-brand-charcoal'}`} />
                </div>
                <p className="text-brand-earth text-sm md:text-base leading-relaxed">
                  {item.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
