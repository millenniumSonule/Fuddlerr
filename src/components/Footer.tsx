import FadeIn from './FadeIn';

export default function Footer() {
  return (
    <footer className="relative bg-brand-warmBg py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #D0D0D0 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal mb-4">
              FUDD<span className="text-brand-gold">L</span>ER
            </h3>
            <p className="text-brand-taupe text-sm tracking-[0.35em] uppercase">
              Crafted Between Two Worlds
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16 text-brand-stone text-sm tracking-wider">
            <span>Mumbai Soul</span>
            <span>·</span>
            <span>Nordic Craft</span>
            <span>·</span>
            <span>Premium Brewing</span>
            <span>·</span>
            <span>Community First</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="border-t border-brand-warmGray/50 pt-8 text-center">
            <p className="text-brand-stone/70 text-xs tracking-wider">
              FUDDLER. All rights reserved. Brewing the future of craft beer in India.
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
