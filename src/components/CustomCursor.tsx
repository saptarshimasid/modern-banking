'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    const onMouseMove = (e: MouseEvent) => {
      // Animate outer ring with inertia
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power3.out',
      });
      // Immediate position for inner dot
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
      });
    };

    const isClickable = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      return (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'INPUT' ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('hover-trigger') ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        !!target.closest('[role="button"]') ||
        !!target.closest('.cursor-pointer')
      );
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isClickable(target)) {
        gsap.to(cursor, {
          scale: 1.8,
          borderColor: '#00f0ff',
          backgroundColor: 'rgba(0, 240, 255, 0.1)',
          duration: 0.2,
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.1,
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isClickable(target)) {
        gsap.to(cursor, {
          scale: 1,
          borderColor: 'rgba(0, 240, 255, 0.4)',
          backgroundColor: 'transparent',
          duration: 0.2,
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.1,
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-primary-container/40 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{ transform: 'translate3d(0,0,0)' }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-primary-container rounded-full pointer-events-none z-[9999] shadow-[0_0_8px_#00f0ff] hidden md:block"
        style={{ transform: 'translate3d(0,0,0)' }}
      />
    </>
  );
};
export default CustomCursor;
