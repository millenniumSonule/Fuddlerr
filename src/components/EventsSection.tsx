import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import FadeIn from './FadeIn';

const events = [
  {
    id: 1,
    title: 'Grand Launch Event',
    date: 'July 15, 2024',
    location: 'Mumbai, India',
    description: 'Join us for an unforgettable evening celebrating FUDDLER with exclusive tastings and stories.',
    image: '🎉',
  },
  {
    id: 2,
    title: 'Nordic Craft Workshop',
    date: 'August 2, 2024',
    location: 'Bangalore, India',
    description: 'Learn the art of craft beer making from experts who bridge Nordic and Indian traditions.',
    image: '🍺',
  },
  {
    id: 3,
    title: 'Community Gathering',
    date: 'August 20, 2024',
    location: 'Delhi, India',
    description: 'Connect with fellow FUDDLER enthusiasts and celebrate the spirit of our community.',
    image: '🤝',
  },
];

export default function EventsSection() {
  return (
    <section className="relative bg-brand-warmBg py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-copper rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <p className="text-brand-copper text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              Coming Soon
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal leading-tight">
              Live Events & Experiences
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <FadeIn key={event.id} delay={idx * 0.2}>
              <motion.div
                whileHover={{ y: -12 }}
                className="group bg-brand-cream rounded-2xl overflow-hidden shadow-lg border border-brand-warmGray/40 hover:border-brand-copper/40 transition-all"
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
                  >
                    Learn More
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
