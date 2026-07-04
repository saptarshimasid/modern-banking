'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Calendar, Leaf } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  date: string;
}

const DATA_SETS = {
  '1W': [
    { label: 'Mon', value: 1200, date: 'June 28' },
    { label: 'Tue', value: 2400, date: 'June 29' },
    { label: 'Wed', value: 1800, date: 'June 30' },
    { label: 'Thu', value: 3200, date: 'July 01' },
    { label: 'Fri', value: 2100, date: 'July 02' },
    { label: 'Sat', value: 4500, date: 'July 03' },
    { label: 'Sun', value: 3800, date: 'July 04' },
  ],
  '1M': [
    { label: 'Jan', value: 12400, date: 'Jan 2026' },
    { label: 'Feb', value: 15800, date: 'Feb 2026' },
    { label: 'Mar', value: 14200, date: 'Mar 2026' },
    { label: 'Apr', value: 18900, date: 'Apr 2026' },
    { label: 'May', value: 22100, date: 'May 2026' },
    { label: 'Jun', value: 19400, date: 'Jun 2026' },
  ],
  '1Y': [
    { label: 'Q1', value: 48000, date: 'Q1 2026' },
    { label: 'Q2', value: 62000, date: 'Q2 2026' },
    { label: 'Q3', value: 55000, date: 'Q3 2026' },
    { label: 'Q4', value: 78000, date: 'Q4 2026' },
  ]
};

export const SpendingTrend = () => {
  const [activeTab, setActiveTab] = useState<'1W' | '1M' | '1Y'>('1W');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentData = DATA_SETS[activeTab];
  const maxVal = Math.max(...currentData.map(d => d.value)) * 1.15; // 15% padding at top

  // SVG parameters
  const width = 600;
  const height = 240;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // Calculate coordinates
  const points = currentData.map((d, i) => {
    const x = paddingLeft + (i / (currentData.length - 1)) * plotWidth;
    const y = height - paddingBottom - (d.value / maxVal) * plotHeight;
    return { x, y, ...d };
  });

  // Bezier curve construction
  const getBezierPath = (pts: typeof points) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const curvePath = getBezierPath(points);
  const areaPath = points.length > 0 
    ? `${curvePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : '';

  // Mouse move handler for interactive tracking
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Scale from client width to SVG viewBox width (600)
    const svgMouseX = (mouseX / rect.width) * width;

    // Find nearest point
    let minDiff = Infinity;
    let nearestIdx = 0;
    points.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - svgMouseX);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIdx = idx;
      }
    });

    setHoveredIndex(nearestIdx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  // Calculate carbon offset simulation based on spending value (1% is green rewards)
  const getCarbonSaved = (val: number) => {
    return (val * 0.0052).toFixed(2);
  };

  return (
    <div className="glass-card rounded-xl p-8 relative overflow-hidden group/chart" ref={containerRef}>
      <div className="noise-overlay" />
      
      {/* Chart Header */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary-container" />
          <div>
            <h4 className="font-sora text-lg font-semibold text-white">Spending Trend</h4>
            <p className="font-geist text-xs text-on-surface-variant mt-0.5">Dynamic liquidity outflux tracking.</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
          {(['1W', '1M', '1Y'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setHoveredIndex(null);
              }}
              className="px-3 py-1 text-xs font-mono font-semibold rounded-md transition-all cursor-pointer text-on-surface-variant hover:text-white"
              style={activeTab === tab ? { backgroundColor: 'var(--color-secondary-container)', color: '#ffffff' } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Plot Wrapper */}
      <div className="relative w-full h-[240px] select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Gradients definitions */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-secondary-container)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-secondary-container)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary-container)" />
              <stop offset="50%" stopColor="var(--color-secondary-container)" />
              <stop offset="100%" stopColor="var(--color-secondary-fixed)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + ratio * plotHeight;
            const gridVal = maxVal * (1 - ratio);
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4,4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="font-mono text-[9px] fill-on-surface-variant font-semibold"
                >
                  ${Math.round(gridVal).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {points.map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={height - paddingBottom + 20}
              textAnchor="middle"
              className="font-mono text-[10px] fill-on-surface-variant font-semibold"
            >
              {pt.label}
            </text>
          ))}

          {/* Area under the curve */}
          {areaPath && (
            <motion.path
              key={`area-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              d={areaPath}
              fill="url(#chartGradient)"
            />
          )}

          {/* Glowing Stroke Curve */}
          {curvePath && (
            <motion.path
              key={`line-${activeTab}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              d={curvePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth={2.5}
            />
          )}

          {/* Interactive Hover Indicators */}
          <AnimatePresence>
            {hoveredPoint && (
              <g>
                {/* Vertical tracking line */}
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  x1={hoveredPoint.x}
                  y1={paddingTop}
                  x2={hoveredPoint.x}
                  y2={height - paddingBottom}
                  stroke="rgba(182, 0, 248, 0.25)"
                  strokeWidth={1.5}
                  strokeDasharray="3,3"
                />

                {/* Outer pulsing beacon ring */}
                <motion.circle
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 12, opacity: 0.4 }}
                  exit={{ r: 0, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  fill="none"
                  stroke="var(--color-secondary-container)"
                  strokeWidth={1}
                />

                {/* Inner glowing dot */}
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r={5}
                  fill="var(--color-secondary-container)"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  className="shadow-lg"
                />
              </g>
            )}
          </AnimatePresence>
        </svg>

        {/* Hover Tooltip Overlay card */}
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 bg-surface-container/95 border border-secondary-container/30 rounded-xl p-4 shadow-xl backdrop-blur-md w-48 pointer-events-none"
              style={{
                left: hoveredPoint.x > width / 2 
                  ? `${(hoveredPoint.x / width) * 100 - 52}%` 
                  : `${(hoveredPoint.x / width) * 100 + 4}%`,
                top: '10%'
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <Calendar className="w-3.5 h-3.5 text-secondary-container" />
                  <span className="font-mono text-[10px] font-semibold tracking-wider uppercase">
                    {hoveredPoint.date}
                  </span>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-sora text-xl font-bold text-on-surface">
                    ${hoveredPoint.value.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-on-surface/5 pt-2 flex items-center gap-1 text-[9px] text-green-500 dark:text-green-400 font-mono">
                  <Leaf className="w-3.5 h-3.5 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <span>+{getCarbonSaved(hoveredPoint.value)} Tons Offset</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default SpendingTrend;
