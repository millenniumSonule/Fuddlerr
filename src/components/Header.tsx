import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ['Home', 'About', 'Products', 'Community', 'Contact'];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 bg-brand-espresso/80 backdrop-blur-md border-b border-brand-gold/10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="font-serif text-2xl font-bold bg-gradient-to-r from-brand-gold to-brand-copper bg-clip-text text-transparent cursor-pointer"
        >
          FUDDLER
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, idx) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-brand-cream text-sm uppercase tracking-wider hover:text-brand-gold transition-colors relative group"
            >
              {item}
              <motion.span
                className="absolute -bottom-1 left-0 h-px bg-brand-gold"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </nav>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block px-6 py-2 rounded-full bg-brand-gold text-brand-espresso font-semibold hover:bg-brand-goldLight transition-colors"
        >
          Order Now
        </motion.button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-brand-gold"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-brand-charcoal border-t border-brand-gold/10 px-6 py-6"
        >
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-brand-cream text-sm uppercase tracking-wider hover:text-brand-gold transition-colors"
              >
                {item}
              </a>
            ))}
            <button className="mt-4 px-6 py-2 rounded-full bg-brand-gold text-brand-espresso font-semibold w-full">
              Order Now
            </button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
