'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  User,
  Settings,
  HelpCircle,
  Shield,
} from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: TrendingUp },
  { name: 'Transactions', href: '/transactions', icon: Wallet },
  { name: 'Transfer', href: '/transfer', icon: ArrowLeftRight },
  { name: 'Profile', href: '/profile', icon: User },
];

const subItems = [
  { name: 'Settings', href: '#', icon: Settings },
  { name: 'Support', href: '#', icon: HelpCircle },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full flex-col py-8 px-6 bg-surface/30 backdrop-blur-xl border-r border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-40 w-64">
      {/* Brand */}
      <div className="mb-10 px-2">
        <h1 className="font-sora text-3xl font-bold text-primary-container drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          AETHER
        </h1>
        <p className="font-geist text-xs text-on-surface-variant tracking-[0.2em] uppercase mt-1">
          Elite Tier
        </p>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 relative group overflow-hidden ${
                isActive
                  ? 'text-primary-container font-bold border-r-4 border-primary-container bg-primary-container/10'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-primary-fixed'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute right-0 top-0 bottom-0 w-1 bg-primary-container"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-primary-container' : 'text-on-surface-variant'
                }`}
              />
              <span className="font-geist text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Nav & CTA */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <Link href="/advisor">
          <button className="w-full py-3 px-4 mb-4 btn-primary-cyan font-space-grotesk text-xs tracking-wider uppercase rounded-full shadow-[0_0_15px_rgba(42,241,254,0.3)] hover:shadow-[0_0_25px_rgba(42,241,254,0.5)] hover:scale-102 active:scale-98 transition-all duration-200">
            Consult AI Advisor
          </button>
        </Link>

        <nav className="space-y-1">
          {subItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant text-sm font-medium hover:bg-white/5 hover:text-primary-fixed transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
                <span className="font-geist">{item.name}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
export default Sidebar;
