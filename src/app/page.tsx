'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Preloader } from '@/components/Preloader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Shield, Zap, TrendingUp, Sparkles, HelpCircle, ChevronDown, ArrowRight, Activity, Network, Lock, Server, Cpu, Database, Eye, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Zap,
    title: 'Stateful AI Wealth Advisor',
    desc: 'Powered by LangGraph, our intelligent wealth coordinator tracks financial requests statefully, validating operations against elite protocol specifications.',
  },
  {
    icon: TrendingUp,
    title: 'Holographic Simulations',
    desc: 'Run multi-asset yield scenarios for Aether Coin (ATH), Carbon Futures (CRB), and digital carbon offsets with instant visual risk metrics.',
  },
  {
    icon: Shield,
    title: 'Secondary Key Security',
    desc: 'Every transaction exceeding compliance thresholds prompts multi-factor cryptographic signatures to guarantee vault-level asset protection.',
  },
];

const faqs = [
  {
    q: 'How does Aether Bank use artificial intelligence for wealth management?',
    a: 'Aether Bank deploys stateful multi-agent systems via LangGraph. Unlike traditional chatbots, our agent tracks context across conversations, accesses live simulated markets, performs portfolio stress tests, and triggers transaction safety checks dynamically.',
  },
  {
    q: 'What is the Elite Tier, and what are its compliance limits?',
    a: 'The Elite Tier represents Aether Bank\'s premier account class. It features self-service transfer limits up to $500,000. Transactions exceeding $10,000 trigger automated security warning signatures, and amounts beyond limits require compliance validation.',
  },
  {
    q: 'Are digital assets like Aether Coin (ATH) secure?',
    a: 'Yes, ATH is secured via the Aether Protocol v4 auditing standards. All yields and simulated liquidity pools integrate strict carbon offsets and risk telemetries for secure wealth expansion.',
  },
];

export default function HomeLanding() {
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const featureSectionRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const architectureRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;

    // Parallax effect on the Hero title and subtitle
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (title && subtitle) {
      gsap.to(title, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to(subtitle, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Scroll-triggered entry animations for feature cards
    const cards = document.querySelectorAll('.feature-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featureSectionRef.current,
          start: 'top 80%',
        },
      }
    );

    // Telemetry Parallax
    if (telemetryRef.current) {
      const metrics = telemetryRef.current.querySelectorAll('.metric-card');
      gsap.fromTo(metrics, 
        { y: 80, opacity: 0 },
        { 
          y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: telemetryRef.current, start: 'top 85%' }
        }
      );
    }

    // Architecture Floating
    if (architectureRef.current) {
      const nodes = architectureRef.current.querySelectorAll('.arch-node');
      gsap.fromTo(nodes,
        { scale: 0.5, opacity: 0, rotationY: -45, y: 50 },
        {
          scale: 1, opacity: 1, rotationY: 0, y: 0, stagger: 0.2, duration: 1.5, ease: 'elastic.out(1, 0.7)',
          scrollTrigger: { trigger: architectureRef.current, start: 'top 75%' }
        }
      );
    }

    // Security Reverse scroll
    if (securityRef.current) {
      const securityBox = securityRef.current.querySelector('.security-box');
      gsap.fromTo(securityBox,
        { x: -100, opacity: 0, rotation: -5 },
        {
          x: 0, opacity: 1, rotation: 0, duration: 1,
          scrollTrigger: { trigger: securityRef.current, start: 'top 85%', scrub: 1 }
        }
      );
      const securityBox2 = securityRef.current.querySelector('.security-box-reverse');
      gsap.fromTo(securityBox2,
        { x: 100, opacity: 0, rotation: 5 },
        {
          x: 0, opacity: 1, rotation: 0, duration: 1,
          scrollTrigger: { trigger: securityRef.current, start: 'top 85%', scrub: 1 }
        }
      );
    }
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className="flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="flex justify-between items-center px-6 md:px-16 py-6 border-b border-white/5 backdrop-blur-sm z-30">
            <h1 className="font-sora text-2xl font-bold text-primary-container tracking-wider drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              AETHER
            </h1>
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <Link href="/dashboard" className="text-on-surface-variant hover:text-white transition-colors text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/advisor">
                <button className="py-2.5 px-6 btn-primary-cyan font-space-grotesk text-xs tracking-wider uppercase rounded-full shadow-[0_0_15px_rgba(42,241,254,0.3)] hover:shadow-[0_0_25px_rgba(42,241,254,0.5)] transition-all">
                  Access Terminal
                </button>
              </Link>
            </div>
          </header>

          {/* Hero Section */}
          <section
            ref={heroRef}
            className="flex-grow flex flex-col justify-center px-6 md:px-16 py-24 relative min-h-[90vh] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
              
              {/* Left Column (Content) */}
              <div className="lg:col-span-7 space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-container text-xs font-mono tracking-widest uppercase mb-2 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Holographic AI Banking
                </motion.div>

                <h2
                  ref={titleRef}
                  className="font-sora text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight"
                >
                  Orchestrate Wealth with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary-fixed-dim to-secondary-container drop-shadow-[0_0_25px_rgba(0,240,255,0.25)]">
                    Stateful Intelligence
                  </span>
                </h2>

                <p
                  ref={subtitleRef}
                  className="font-geist text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed"
                >
                  Empowering the elite tier with LangGraph multi-agent financial advisory, asset simulations, and compliant transfer telemetry.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Link href="/dashboard">
                    <button className="py-4 px-8 btn-primary-cyan font-space-grotesk text-sm font-semibold tracking-wider uppercase rounded-full shadow-[0_0_20px_rgba(42,241,254,0.4)] hover:shadow-[0_0_30px_rgba(42,241,254,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                      Enter Command Center <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/advisor">
                    <button className="py-4 px-8 border border-white/10 rounded-full font-space-grotesk text-sm tracking-wider uppercase text-white bg-white/5 hover:bg-white/10 hover:border-primary-container/40 hover:scale-105 transition-all duration-300 glass-card">
                      Consult AI Advisor
                    </button>
                  </Link>
                </motion.div>
              </div>

              {/* Right Column (Creative Spinning HUD & Live Logs) */}
              <div className="lg:col-span-5 flex justify-center items-center relative">
                <div className="relative w-80 h-80 flex items-center justify-center">
                  
                  {/* Holographic Ring 1 */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-container/20 animate-[spin_25s_linear_infinite] shadow-[0_0_20px_rgba(0,240,255,0.05)]" />
                  
                  {/* Holographic Ring 2 */}
                  <div className="absolute inset-6 rounded-full border border-double border-secondary-container/30 animate-[spin_15s_linear_infinite_reverse]" />
                  
                  {/* Holographic Ring 3 */}
                  <div className="absolute inset-12 rounded-full border border-dotted border-primary-fixed/20 animate-[spin_10s_linear_infinite]" />
                  
                  {/* Core Telemetry Display */}
                  <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-primary-container/5 to-secondary-container/10 blur-xl animate-pulse" />
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="absolute text-center z-10 flex flex-col items-center justify-center p-6 rounded-full glass-card border border-white/10 w-44 h-44 shadow-[0_0_25px_rgba(0,240,255,0.1)] cursor-pointer"
                  >
                    <span className="font-space-grotesk text-[8px] tracking-[0.2em] text-primary-container uppercase">CORE NODE STATUS</span>
                    <span className="font-mono text-2xl text-white font-extrabold mt-1 tracking-tight">ACTIVE</span>
                    <div className="w-16 h-[1px] bg-white/20 my-2" />
                    <span className="font-mono text-[9px] text-on-surface-variant">PORT: 8000</span>
                    <span className="font-mono text-[9px] text-[#2af1fe] mt-0.5">TLS v1.3</span>
                  </motion.div>
                  
                  {/* Floating Mini Metrics */}
                  <motion.div 
                    whileHover={{ scale: 1.1, x: 10, y: -10 }}
                    className="absolute -top-4 -right-4 glass-card rounded-lg px-3 py-1.5 border border-white/10 font-mono text-[10px] text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    <span>SECURE NODE</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.1, x: -10, y: 10 }}
                    className="absolute -bottom-4 -left-4 glass-card rounded-lg px-3 py-1.5 border border-white/10 font-mono text-[10px] text-white flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
                  >
                    <span className="text-on-surface-variant text-[8px] uppercase tracking-wider">Yield Ratio</span>
                    <span className="text-primary-container font-bold">+14.20% ATH</span>
                  </motion.div>
                  
                </div>
              </div>

            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-6 h-6 text-on-surface-variant" />
            </div>
          </section>

          {/* Features Section */}
          <section
            ref={featureSectionRef}
            className="py-24 px-6 md:px-16 border-t border-white/5 relative features-section"
          >
            <div className="max-w-[1440px] mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h3 className="font-sora text-3xl md:text-4xl font-bold text-white">
                  Stateful Agentic Features
                </h3>
                <p className="font-geist text-on-surface-variant max-w-xl mx-auto">
                  Architected to deliver conversational financial consulting, smart simulations, and safe capital movements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <motion.div
                      whileHover={{ y: -10 }}
                      key={idx}
                      className="feature-card glass-card rounded-xl p-8 relative overflow-hidden group hover:border-primary-container/40 transition-all duration-300 cursor-pointer"
                    >
                      <div className="noise-overlay" />
                      <div className="scan-lines" />
                      <div className="relative z-10 space-y-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center border border-primary-container/20 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-primary-container" />
                        </div>
                        <h4 className="font-sora text-xl font-semibold text-white group-hover:text-primary-container transition-colors duration-300">
                          {feat.title}
                        </h4>
                        <p className="font-geist text-sm text-on-surface-variant leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 1: Live Telemetry Feed */}
          <section
            ref={telemetryRef}
            className="py-24 px-6 md:px-16 border-t border-white/5 relative telemetry-section overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="max-w-[1440px] mx-auto space-y-16 relative z-10">
              <div className="text-center space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-xs font-mono tracking-widest uppercase mb-2 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Live Network Telemetry
                </motion.div>
                <h3 className="font-sora text-3xl md:text-5xl font-bold text-white">
                  Global Asset Metrics
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "24H Volume", value: "$12.4B", change: "+5.2%", trend: "up" },
                  { label: "Active Agents", value: "8,432", change: "+12.1%", trend: "up" },
                  { label: "Avg Execution", value: "42ms", change: "-8.4%", trend: "down" },
                  { label: "Carbon Offset", value: "1.2M Tons", change: "+2.4%", trend: "up" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="metric-card glass-card rounded-2xl p-6 border border-white/10 hover:border-primary-container/50 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-all duration-500 group-hover:scale-150" />
                    <p className="font-space-grotesk text-xs tracking-widest text-on-surface-variant uppercase mb-2 relative z-10">{stat.label}</p>
                    <p className="font-sora text-4xl font-bold text-white mb-2 tracking-tighter relative z-10">{stat.value}</p>
                    <div className={`relative z-10 font-mono text-xs font-bold px-2 py-1 rounded inline-block bg-green-500/20 text-green-400`}>
                      {stat.change}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 2: Architecture Layout */}
          <section
            ref={architectureRef}
            className="py-32 px-6 md:px-16 border-t border-white/5 relative consensus-section overflow-hidden"
          >
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/20 text-secondary-container text-xs font-mono tracking-widest uppercase cursor-pointer"
                >
                  <Network className="w-3.5 h-3.5" />
                  Agentic Topology
                </motion.div>
                <h3 className="font-sora text-4xl md:text-5xl font-bold text-white leading-tight">
                  Stateful Intelligence <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-container to-primary-container">Distributed.</span>
                </h3>
                <p className="font-geist text-on-surface-variant text-lg leading-relaxed max-w-lg">
                  Our infrastructure relies on a mesh of specialized AI agents. From risk assessment to predictive routing, every computation is statefully synchronized using LangGraph.
                </p>
                <ul className="space-y-4">
                  {[
                    "Distributed Multi-Agent Consensus",
                    "Real-time Contextual Memory",
                    "Predictive Yield Routing"
                  ].map((item, i) => (
                    <motion.li whileHover={{ x: 10 }} key={i} className="flex items-center gap-3 font-mono text-sm text-white/80 cursor-pointer">
                      <CheckCircle className="w-5 h-5 text-primary-container" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="relative h-[500px] w-full" style={{ perspective: '1000px' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="arch-node absolute z-30 glass-card w-48 h-48 rounded-2xl border border-primary-container/40 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(42,241,254,0.2)] bg-black/60 backdrop-blur-xl hover:scale-110 hover:border-primary-container transition-all cursor-pointer">
                    <Cpu className="w-10 h-10 text-primary-container mb-3" />
                    <span className="font-space-grotesk text-xs uppercase tracking-widest text-white">Central Brain</span>
                  </div>
                  <div className="arch-node absolute z-20 -translate-x-40 -translate-y-32 glass-card w-36 h-36 rounded-xl border border-secondary-container/30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md hover:scale-110 hover:border-secondary-container transition-all cursor-pointer">
                    <Server className="w-8 h-8 text-secondary-container mb-2" />
                    <span className="font-space-grotesk text-[10px] uppercase tracking-widest text-white">Risk Node</span>
                  </div>
                  <div className="arch-node absolute z-20 translate-x-40 -translate-y-24 glass-card w-36 h-36 rounded-xl border border-purple-500/30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md hover:scale-110 hover:border-purple-400 transition-all cursor-pointer">
                    <Database className="w-8 h-8 text-purple-400 mb-2" />
                    <span className="font-space-grotesk text-[10px] uppercase tracking-widest text-white">State Store</span>
                  </div>
                  <div className="arch-node absolute z-20 -translate-x-24 translate-y-36 glass-card w-36 h-36 rounded-xl border border-green-500/30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md hover:scale-110 hover:border-green-400 transition-all cursor-pointer">
                    <Network className="w-8 h-8 text-green-400 mb-2" />
                    <span className="font-space-grotesk text-[10px] uppercase tracking-widest text-white">Execution</span>
                  </div>
                  <div className="arch-node absolute z-20 translate-x-32 translate-y-28 glass-card w-36 h-36 rounded-xl border border-pink-500/30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md hover:scale-110 hover:border-pink-400 transition-all cursor-pointer">
                    <Eye className="w-8 h-8 text-pink-400 mb-2" />
                    <span className="font-space-grotesk text-[10px] uppercase tracking-widest text-white">Compliance</span>
                  </div>
                  
                  {/* Connecting lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{ zIndex: 10 }}>
                    <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#2af1fe" strokeWidth="1" strokeDasharray="4" className="animate-pulse" />
                    <line x1="50%" y1="50%" x2="75%" y2="30%" stroke="#2af1fe" strokeWidth="1" strokeDasharray="4" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <line x1="50%" y1="50%" x2="40%" y2="70%" stroke="#2af1fe" strokeWidth="1" strokeDasharray="4" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <line x1="50%" y1="50%" x2="65%" y2="65%" stroke="#2af1fe" strokeWidth="1" strokeDasharray="4" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Elite Security Protocols */}
          <section
            ref={securityRef}
            className="py-32 px-6 md:px-16 border-t border-white/5 relative overflow-hidden security-section"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/5 to-secondary-container/5 opacity-50 pointer-events-none" />
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="security-box flex flex-col justify-center glass-card p-12 rounded-3xl border-l-4 border-l-primary-container relative overflow-hidden cursor-pointer group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 group-hover:opacity-20 transition-all duration-500"><Lock className="w-48 h-48 text-primary-container" /></div>
                <h3 className="font-sora text-3xl font-bold text-white mb-6 z-10">Cryptographic<br/>Vault Security</h3>
                <p className="font-geist text-on-surface-variant mb-8 z-10 max-w-sm">
                  Every transaction passes through a 7-layer cryptographic mesh. We employ multi-party computation (MPC) to ensure no single point of failure exists in the asset custody chain.
                </p>
                <div className="z-10 flex gap-4 flex-wrap">
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-white hover:bg-primary-container/20 hover:border-primary-container transition-colors">SHA-256</div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-white hover:bg-primary-container/20 hover:border-primary-container transition-colors">MPC</div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-white hover:bg-primary-container/20 hover:border-primary-container transition-colors">Zero-Knowledge</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="security-box-reverse flex flex-col justify-center glass-card p-12 rounded-3xl border-r-4 border-r-secondary-container relative overflow-hidden cursor-pointer group"
              >
                <div className="absolute top-0 left-0 p-8 opacity-10 group-hover:scale-125 group-hover:opacity-20 transition-all duration-500"><Shield className="w-48 h-48 text-secondary-container" /></div>
                <h3 className="font-sora text-3xl font-bold text-white mb-6 z-10 text-right">Continuous<br/>Compliance Auditing</h3>
                <p className="font-geist text-on-surface-variant mb-8 z-10 max-w-sm ml-auto text-right">
                  Smart contracts and regulatory constraints are baked into the protocol layer. Real-time auditing ensures all asset transfers are compliant across 40+ global jurisdictions.
                </p>
                <div className="z-10 flex gap-4 justify-end flex-wrap">
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-white hover:bg-secondary-container/20 hover:border-secondary-container transition-colors">ISO-27001</div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-white hover:bg-secondary-container/20 hover:border-secondary-container transition-colors">SOC 2 Type II</div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQ / AEO-friendly Section */}
          <section className="py-24 px-6 md:px-16 border-t border-white/5 faq-section relative">
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h3 className="font-sora text-3xl md:text-4xl font-bold text-white">
                  Frequently Asked Questions
                </h3>
                <p className="font-geist text-on-surface-variant">
                  Detailed transparency for Generative and Answer Engines (GEO/AEO).
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    key={idx}
                    className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-primary-container/40 transition-all duration-300 cursor-pointer"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full px-6 py-5 flex justify-between items-center text-left font-sora font-semibold text-white focus:outline-none cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-on-surface-variant transition-transform duration-300 ${
                          activeFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {activeFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6 cursor-text"
                        >
                          <p className="font-geist text-sm text-on-surface-variant leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-20 px-6 md:px-16 border-t border-white/5 relative overflow-hidden bg-black/40">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 text-left">
              <div className="md:col-span-2 space-y-6">
                {/* Massive AETHER Logo */}
                <h2 className="font-sora text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/50 to-white/5 drop-shadow-[0_0_35px_rgba(0,240,255,0.1)] hover:scale-105 transition-transform duration-500 cursor-pointer origin-left">
                  AETHER
                </h2>
                <p className="font-geist text-sm text-on-surface-variant max-w-sm">
                  Next-generation stateful liquidity management and multi-agent wealth advice for high-velocity portfolios.
                </p>
              </div>
              
              <div>
                <h4 className="font-space-grotesk text-xs tracking-widest text-primary-container uppercase mb-4">SYSTEM NODE STATUS</h4>
                <ul className="space-y-2 text-xs font-mono text-on-surface-variant cursor-pointer">
                  <li className="flex items-center gap-2 hover:text-white transition-colors"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" /> Connection: Secure TLS v1.3</li>
                  <li className="hover:text-white transition-colors">Active Protocols: Aether v4.12</li>
                  <li className="hover:text-white transition-colors">Compliance Engine: STATEFUL</li>
                  <li className="hover:text-white transition-colors">Telemetry Port: SECURE_8000</li>
                </ul>
              </div>

              <div>
                <h4 className="font-space-grotesk text-xs tracking-widest text-primary-container uppercase mb-4">LEGAL & REGULATORY</h4>
                <p className="font-geist text-[10px] text-on-surface-variant leading-relaxed">
                  &copy; 2026 Aether Bank Corp. All simulations, yield projections, and compliance audits are hypothetical estimates under elite-tier sandbox conditions. Protocol-audits conducted under cryptographic ledger specifications.
                </p>
              </div>
            </div>
            
            {/* Floating Background Glow */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />
          </footer>
        </div>
      )}
    </>
  );
}
