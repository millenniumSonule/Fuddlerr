import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import FadeIn from './FadeIn';

export default function CTASection() {
  return (
    <section className="relative bg-gradient-to-r from-brand-gold via-brand-copper to-brand-forest py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 md:px-8">
        <FadeIn>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 mb-8 backdrop-blur-sm"
            >
              <Sparkles size={16} className="text-white" />
              <span className="text-white text-sm font-medium">Join the Movement</span>
            </motion.div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Ready to Experience
              <motion.span
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="block mt-2"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(245,241,235,0.9))',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Something Different?
              </motion.span>
            </h2>

            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-12">
              Discover the craft, celebrate the culture, and join a community that values excellence in every sip.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-white text-brand-gold font-semibold flex items-center gap-3 group hover:gap-4 transition-all"
              >
                <span>Shop Now</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </FadeIn>

        <motion.div
          className="mt-20 text-center text-white/70 text-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p>📧 Sign up for exclusive updates and early access to new launches</p>
        </motion.div>
      </div>
    </section>
  );
}
