'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Server, Database, Network, Eye } from 'lucide-react';

interface NodeCard {
  id: number;
  label: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  glowColor: string;
  borderClass: string;
}

const NODES: NodeCard[] = [
  {
    id: 0,
    label: 'Risk Node',
    icon: Server,
    colorClass: 'text-secondary-container',
    glowColor: 'rgba(182, 0, 248, 0.25)',
    borderClass: 'border-secondary-container/40',
  },
  {
    id: 1,
    label: 'Execution',
    icon: Network,
    colorClass: 'text-green-500 dark:text-green-400',
    glowColor: 'rgba(34, 197, 94, 0.25)',
    borderClass: 'border-green-500/40',
  },
  {
    id: 2,
    label: 'Central Brain',
    icon: Cpu,
    colorClass: 'text-primary-container',
    glowColor: 'rgba(0, 240, 255, 0.3)',
    borderClass: 'border-primary-container/50',
  },
  {
    id: 3,
    label: 'Compliance',
    icon: Eye,
    colorClass: 'text-pink-500 dark:text-pink-400',
    glowColor: 'rgba(236, 72, 153, 0.25)',
    borderClass: 'border-pink-500/40',
  },
  {
    id: 4,
    label: 'State Store',
    icon: Database,
    colorClass: 'text-purple-500 dark:text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    borderClass: 'border-purple-500/40',
  },
];

export const TopologyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with Central Brain (id 2) in focus
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start automatic sliding
  const startAutoplay = () => {
    stopAutoplay();
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NODES.length);
    }, 3500); // Shift every 3.5 seconds (slow, elegant slide)
  };

  const stopAutoplay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
    // Reset autoplay timer on manual click to give the user time to inspect
    startAutoplay();
  };

  return (
    <div 
      className="relative w-full h-[400px] flex items-center justify-center overflow-visible select-none"
      style={{ perspective: '1200px' }}
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-visible">
        {NODES.map((node, i) => {
          // Calculate circular relative index in range [-2, 2]
          let diff = i - currentIndex;
          if (diff < -2) diff += NODES.length;
          if (diff > 2) diff -= NODES.length;

          const isFocused = diff === 0;
          const absDiff = Math.abs(diff);

          // Custom 3D coordinates based on distance from center
          const xTranslation = diff * 160; // Horizontal offset
          const zTranslation = -absDiff * 80; // Depth scaling
          const rotateY = diff * -15; // Rotation factor
          const scale = 1 - absDiff * 0.12; // Focus scaling
          const opacity = 1 - absDiff * 0.3; // Edge fading

          const IconComponent = node.icon;

          return (
            <motion.div
              key={node.id}
              style={{
                zIndex: 30 - absDiff * 10,
                transformStyle: 'preserve-3d',
                boxShadow: isFocused 
                  ? `0 0 35px ${node.glowColor}` 
                  : 'none',
              }}
              animate={{
                x: xTranslation,
                z: zTranslation,
                rotateY: rotateY,
                scale: scale,
                opacity: opacity,
                filter: isFocused ? 'blur(0px)' : 'blur(4px)',
              }}
              transition={{
                type: 'spring',
                stiffness: 70,
                damping: 15,
                mass: 0.8,
              }}
              onClick={() => handleCardClick(i)}
              className={`absolute w-44 h-44 md:w-48 md:h-48 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isFocused
                  ? `glass-card ${node.borderClass} bg-black/65`
                  : 'border-white/5 bg-black/35 hover:border-white/10'
              }`}
            >
              <div 
                className="flex flex-col items-center justify-center text-center space-y-4"
                style={{ transform: 'translateZ(20px)' }} // Adds extra 3D pop effect
              >
                <IconComponent className={`w-10 h-10 md:w-12 md:h-12 ${node.colorClass} transition-transform duration-300 ${isFocused ? 'scale-105' : 'scale-95'}`} />
                <span className="font-space-grotesk text-[10px] md:text-xs uppercase tracking-widest font-semibold text-white">
                  {node.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
export default TopologyCarousel;
