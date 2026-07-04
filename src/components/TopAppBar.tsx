'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, Zap, Search, Home, TrendingUp, Wallet, ArrowLeftRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: TrendingUp },
  { name: 'Transactions', href: '/transactions', icon: Wallet },
  { name: 'Transfer', href: '/transfer', icon: ArrowLeftRight },
  { name: 'Profile', href: '/profile', icon: User },
];

export const TopAppBar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center w-full px-6 md:px-16 py-4 bg-transparent border-b border-white/5 backdrop-blur-sm z-30 sticky top-0">
      {/* Mobile Menu Trigger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-on-surface-variant hover:text-primary-container transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link href="/">
          <h1 className="font-sora text-xl md:hidden font-bold text-primary-container tracking-tighter">
            AETHER
          </h1>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-6 ml-auto">
        <ThemeToggle />
        <button className="text-on-surface-variant hover:text-primary-container transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-container rounded-full shadow-[0_0_8px_#00f0ff]" />
        </button>
        <Link href="/advisor" className="text-on-surface-variant hover:text-primary-container transition-colors">
          <Zap className="w-5 h-5" />
        </Link>
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 glass-card cursor-pointer hover:border-primary-container transition-colors">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3y_TrWy7OK5WtjG21md01_BSQENZ5zAeOiy7EIvGMWFy3Ftoojw09N1WHydbobz3OTwLcerNhoIV4z533vplERXvJJtmToiOKbjvj_ImFGMVWj1xHac5fY5ILpb5i5Rk6QzVL8jio5frYyFNV8Kde1am2I7qs4iidhRIAMIKGbHCvJpsNhJBrRkpTAxp1F0NASaLD4-zPIoHddQoxA4LEFuKWmOhF2Kh9GArveZmGm5H9YziFvFtYIJTkhqzj9v8_LXMjmTLPRFdU"
            />
          </div>
        </Link>
      </div>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
            style={{ top: '64px' }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 bg-[#0c0d12] border-b border-white/10 p-6 flex flex-col gap-4 z-50 md:hidden"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? 'text-primary-container bg-primary-container/10'
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link href="/advisor" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full py-3 px-4 btn-primary-cyan font-space-grotesk text-xs tracking-wider uppercase rounded-lg shadow-[0_0_15px_rgba(42,241,254,0.3)]">
                Consult AI Advisor
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default TopAppBar;
