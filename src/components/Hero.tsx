import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import productCan from '../assets/genric_beer_can.png';
import beerGlass from '../assets/beer_glass.png';
import heroVideo from '../assets/hero_banner_video.mp4';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];
    let animId = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      particles = [];
      const count = Math.min(60, Math.floor(w / 25));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 145, 74, ${p.alpha})`;
        ctx.fill();
      }
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(184, 145, 74, ${0.08 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-espresso">
      <div className="absolute inset-0 overflow-hidden">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover video-zoom"
          style={{ filter: 'brightness(0.85) contrast(1.1)' }}
        />
        <div className="absolute inset-0 bg-brand-charcoal/50 lg:bg-brand-charcoal/45 pointer-events-none" />
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-overlay opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/70 via-brand-charcoal/30 to-brand-charcoal/80 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 1.3, ease: 'easeOut' }}
        className="absolute left-6 top-1/3 hidden lg:block"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative w-72 h-96 overflow-hidden"
          whileHover={{ rotateY: 8, y: -4 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={beerGlass}
            alt="Fuddlerr beer glass accent"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </motion.div>
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white text-sm md:text-base tracking-[0.35em] uppercase mb-6 font-medium"
        >
          India's Most Distinctive Craft Beer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tight mb-8"
        >
          <span className="text-white">FUDD</span>
          <span className="gradient-text">L</span>
          <span className="text-white">ER</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-16 h-px bg-brand-gold mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl text-white italic tracking-wide"
        >
          Crafted Between Two Worlds
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center text-xs text-white tracking-wider uppercase"
        >
          <span>Mumbai Soul</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-brand-stone" />
          <span>Nordic Craft</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-brand-stone" />
          <span>Premium Brewing</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-brand-gold to-transparent mx-auto animate-pulse" />
      </motion.div>
    </section>
  );
}
