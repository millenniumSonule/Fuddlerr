import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import FadeIn from './FadeIn';
import { useContent } from '../content/useContent';

export default function EventsSection() {
  const contentData = useContent();
  const events = contentData.events.events;

  return (
    <section className="relative bg-brand-warmBg py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-copper rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-brand-copper text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              {contentData.events.label}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight">
              {contentData.events.title}
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <FadeIn key={event.id} delay={idx * 0.2}>
              <motion.div
                whileHover={{ y: -12 }}
                className="premium-card group bg-brand-cream rounded-2xl overflow-hidden shadow-lg border border-brand-warmGray/40 hover:border-brand-copper/40 transition-all"
                data-magnetic
              >
                <div className="h-40 bg-gradient-to-br from-brand-copper to-brand-forest relative overflow-hidden">
                  <motion.div
                    className="text-6xl absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {event.image}
                  </motion.div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>

                <div className="p-8">
                  <h3 className="font-serif text-2xl text-brand-charcoal mb-4">{event.title}</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-brand-stone">
                      <Calendar size={18} />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-brand-stone">
                      <MapPin size={18} />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-brand-earth mb-6 leading-relaxed">{event.description}</p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-brand-copper to-brand-forest text-white font-medium text-sm uppercase tracking-wide hover:shadow-lg transition-all"
                    data-magnetic
                  >
                    {event.cta}
                  </motion.button>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
