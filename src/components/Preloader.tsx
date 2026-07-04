'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds total loading
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300); // Trigger complete after reaching 100%
          return 100;
        }
        return Math.min(100, prev + step);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center font-mono-data preloader-overlay"
      style={{ backgroundColor: '#0a0b10' }}
    >
      <div className="relative text-center space-y-md">
        {/* Glowing holographic loader icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="w-16 h-16 border-2 border-primary-container/20 border-t-primary-container rounded-full mx-auto shadow-[0_0_15px_rgba(0,240,255,0.2)]"
        />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-label-caps tracking-[0.2em] font-semibold text-lg"
          style={{ color: '#00f0ff' }}
        >
          AETHER CORE INITIALIZING...
        </motion.h1>

        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mx-auto border border-white/10">
          <motion.div
            className="h-full"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right, #7df4ff, #00f0ff)' }}
          />
        </div>

        <motion.p 
          className="text-sm mt-sm"
          style={{ color: '#b9cacb' }}
        >
          {Math.floor(progress)}%
        </motion.p>
      </div>
    </motion.div>
  );
};
export default Preloader;
