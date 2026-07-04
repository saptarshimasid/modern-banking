'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const defaultTheme = savedTheme || 'dark';
    setTheme(defaultTheme);
    
    const timer = setTimeout(() => {
      if (defaultTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  if (!mounted) return <div className="w-14 h-8 rounded-full bg-slate-900 border border-white/5 opacity-50" />;

  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-500 cursor-pointer overflow-hidden border ${
        isDark 
          ? 'bg-gradient-to-r from-slate-950 to-indigo-900 border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]' 
          : 'bg-gradient-to-r from-sky-300 to-amber-200 border-black/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]'
      }`}
      aria-label="Toggle Theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background Star details (Twinkling) */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-1.5 left-8 w-0.5 h-0.5 bg-white rounded-full" 
          />
          <motion.div 
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
            className="absolute top-4 left-6 w-1 h-1 bg-white rounded-full opacity-60" 
          />
          <motion.div 
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            className="absolute top-2 left-10 w-0.5 h-0.5 bg-white rounded-full" 
          />
        </div>
      )}

      {/* Background Cloud details (Floating) */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.svg 
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            className="absolute top-2 left-1 w-4 h-3 text-white/80" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </motion.svg>
          <motion.svg 
            initial={{ x: 20 }}
            animate={{ x: 14 }}
            className="absolute top-3.5 left-2 w-3 h-2 text-white/50" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </motion.svg>
        </div>
      )}

      {/* Sliding Thumb (Sun / Moon) */}
      <motion.div
        className="w-5 h-5 rounded-full flex items-center justify-center relative"
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        animate={{ x: isDark ? 0 : 22 }}
      >
        {isDark ? (
          // Moon Thumb
          <div className="w-5 h-5 rounded-full bg-yellow-100 relative overflow-hidden shadow-[0_0_10px_rgba(253,224,71,0.4)]">
            {/* Crater 1 */}
            <div className="absolute top-1 left-1.5 w-1 h-1 bg-yellow-300/60 rounded-full" />
            {/* Crater 2 */}
            <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 bg-yellow-300/60 rounded-full" />
            {/* Crater 3 */}
            <div className="absolute top-3.5 left-1 w-0.5 h-0.5 bg-yellow-300/60 rounded-full" />
            {/* Shadow Overlay for Eclipse */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/20 to-transparent" />
          </div>
        ) : (
          // Sun Thumb
          <div className="w-5 h-5 rounded-full bg-amber-400 relative flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.6)]">
            {/* Rotating Sun Rays */}
            <motion.div 
              className="absolute inset-[-2px] border-2 border-dashed border-amber-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            />
            {/* Core Glow */}
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-200" />
          </div>
        )}
      </motion.div>
    </motion.button>
  );
};
