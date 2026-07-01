import { motion } from 'framer-motion';
import redCan from '../assets/red_beer_can.png';
import taxi from '../assets/mumbai_taxi.png';

export default function RedCanSection() {
  return (
    <section className="relative overflow-hidden bg-brand-warmBg py-00">
      {/* <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_rgba(216,169,73,0.2),_transparent_35%)]" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-goldWarm/30 bg-brand-goldWarm/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-brand-copper shadow-[0_12px_36px_rgba(216,169,73,0.06)]">
              New Release
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight mt-8 mb-6">
              The Red Can Experience
            </h2>
            <p className="text-brand-stone text-lg md:text-xl max-w-2xl leading-relaxed">
              Meet the limited-edition red beer can from FUDDLER — bold, curated, and crafted for nights that demand a statement. This edition blends smoky spice, ripe malt, and premium artisanal depth for a tasting experience that feels both fearless and refined.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-brand-goldWarm px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-goldWarm/20 transition-transform duration-300 hover:-translate-y-1"
              >
                Reserve Yours
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-brand-gold/30 bg-brand-cream/70 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-charcoal transition-colors duration-300 hover:bg-brand-cream"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateY: 12 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative z-10 flex justify-center"
          >
            <div className="hero-3d-container w-full max-w-md perspective-1500">
              <div className="hero-3d-card relative overflow-hidden rounded-[2.5rem] border border-brand-gold/10 bg-brand-espresso/40 shadow-[0_45px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-3 hover:rotate-1">
                <div className="absolute inset-0 hero-3d-gradient" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-40 h-20 rounded-full bg-brand-red-500/10 blur-2xl opacity-80" />
                <div className="relative mx-auto mt-10 h-[420px] w-64 overflow-hidden rounded-[2rem] bg-brand-espresso/10 border border-brand-gold/15">
                  <img
                    src={redCan}
                    alt="Limited edition red beer can"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <img
                    src={taxi}
                    alt="Mumbai taxi accent"
                    className="absolute -bottom-8 right-6 h-20 w-20 rounded-full border-2 border-brand-cream/50 bg-brand-espresso/20 object-contain shadow-[0_25px_55px_rgba(0,0,0,0.28)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div> */}
    </section>
  );
}
