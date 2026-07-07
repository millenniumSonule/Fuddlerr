import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useContent } from '../content/useContent';

export default function Header() {
  const contentData = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = contentData.header.navItems;

  const sectionMap: Record<string, string> = {
    'Home': 'hero',
    'BEER': 'products',
    'Beer': 'products',
    'TAPROOM': 'about',
    'Taproom': 'about',
    'EVENTS': 'community',
    'Events': 'community',
    'OUR STORY': 'about',
    'Our Story': 'about',
    'SHOP': 'products',
    'Shop': 'products',
    'About': 'about',
    'Products': 'products',
    'Community': 'community',
    'Contact': 'contact',
    'CONTACT': 'contact',
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
      className="fixed top-0 z-50 w-full text-brand-cream"
    >
      <div className="mx-auto flex max-w-[92rem] items-start justify-between px-6 py-6 md:px-10 lg:px-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => scrollToSection('Home')}
          className="cursor-pointer select-none leading-none"
          data-magnetic
        >
          <span className="block font-serif text-4xl font-black uppercase tracking-[0.03em] text-brand-cream drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-[3.7rem]">
            {contentData.header.brand}
          </span>
          <span className="mt-2 block text-center text-xs font-semibold uppercase tracking-[0.28em] text-brand-cream/90 sm:text-sm">
            Craft Beer
          </span>
          <span className="mt-1 block text-center text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-brand-gold sm:text-xs">
            Mumbai · India
          </span>
        </motion.div>

        <nav className="hidden items-center gap-7 pt-5 lg:flex xl:gap-10">
          {navItems.map((item, idx) => (
            <motion.button
              key={item}
              onClick={() => scrollToSection(item)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative cursor-pointer border-none bg-transparent p-0 text-xs font-semibold uppercase tracking-[0.28em] text-brand-cream/88 transition-colors hover:text-brand-gold"
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
          className="hidden border border-brand-gold/70 px-7 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold transition-colors hover:bg-brand-gold hover:text-white xl:block"
          data-magnetic
        >
          {contentData.header.cta}
        </motion.button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pt-3 text-brand-cream lg:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mx-6 border border-white/15 bg-black/55 px-6 py-6 backdrop-blur-md lg:hidden"
        >
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="cursor-pointer border-none bg-transparent p-0 text-left text-sm font-semibold uppercase tracking-[0.26em] text-brand-cream transition-colors hover:text-brand-gold"
              >
                {item}
              </button>
            ))}
            <button className="mt-4 w-full border border-brand-gold/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
              {contentData.header.cta}
            </button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
