'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
      className="fixed inset-0 bg-[#f9fafb] dark:bg-[#0a0b10] z-[9999] flex flex-col items-center justify-center font-mono-data transition-colors duration-300"
    >
      <div className="relative text-center space-y-md">
        {/* Glowing holographic loader icon using secondary purple brand color */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="w-16 h-16 border-2 border-purple-500/10 dark:border-purple-400/20 border-t-purple-700 dark:border-t-purple-300 rounded-full mx-auto shadow-[0_0_15px_rgba(147,51,234,0.1)] dark:shadow-[0_0_15px_rgba(216,180,254,0.15)]"
        />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-purple-900 dark:text-purple-200 text-label-caps tracking-[0.2em] font-semibold text-lg"
        >
          AETHER CORE INITIALIZING...
        </motion.h1>

        <div className="w-64 h-1 bg-purple-200 dark:bg-purple-950/40 rounded-full overflow-hidden mx-auto border border-purple-300/30 dark:border-purple-800/30">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <motion.p 
          className="text-purple-700/80 dark:text-purple-300/80 text-sm mt-sm"
        >
          {Math.floor(progress)}%
        </motion.p>
      </div>
    </motion.div>
  );
};
export default Preloader;
