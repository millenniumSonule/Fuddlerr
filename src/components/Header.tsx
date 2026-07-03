import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import contentData from '../data/content.json';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = contentData.header.navItems;

  const sectionMap: Record<string, string> = {
    'Home': 'hero',
    'About': 'about',
    'Products': 'products',
    'Community': 'community',
    'Contact': 'contact',
  };

  const scrollToSection = (sectionName: string) => {
    const sectionId = sectionMap[sectionName] || sectionName.toLowerCase();
    const element = document.getElementById(sectionId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 bg-brand-cream/95 backdrop-blur-md border-b border-brand-warmGray/30"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="font-serif text-2xl font-bold bg-gradient-to-r from-brand-gold to-brand-copper bg-clip-text text-transparent cursor-pointer"
          data-magnetic
        >
          {contentData.header.brand}
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, idx) => (
            <motion.button
              key={item}
              onClick={() => scrollToSection(item)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-brand-charcoal text-sm uppercase tracking-wider hover:text-brand-gold transition-colors relative group cursor-pointer bg-transparent border-none p-0"
              data-magnetic
            >
              {item}
              <motion.span
                className="absolute -bottom-1 left-0 h-px bg-brand-gold"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </nav>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block px-6 py-2 rounded-full bg-brand-gold text-white font-semibold hover:bg-brand-goldLight transition-colors"
          data-magnetic
        >
          {contentData.header.cta}
        </motion.button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-brand-gold"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-brand-cream border-t border-brand-warmGray px-6 py-6"
        >
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-brand-charcoal text-sm uppercase tracking-wider hover:text-brand-gold transition-colors cursor-pointer bg-transparent border-none text-left p-0"
              >
                {item}
              </button>
            ))}
            <button className="mt-4 px-6 py-2 rounded-full bg-brand-gold text-white font-semibold w-full">
              {contentData.header.cta}
            </button>
          </nav>
        </motion.div>
    </motion.header>
  );
}
