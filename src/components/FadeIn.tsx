import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </motion.div>
  );
}
