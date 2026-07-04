'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { TopAppBar } from '@/components/TopAppBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Wallet, CreditCard, Send, History, TrendingUp, X, Check } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  entity: string;
  category: string;
  amount: number;
  status: string;
  hash: string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Card request modal state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<string>('');
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);
  const [cardRequestedSuccess, setCardRequestedSuccess] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5001/api/transactions')
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching transactions:', err);
        setLoading(false);
      });
  }, []);

  const handleRequestCardSubmit = () => {
    setIsSubmittingCard(true);
    setTimeout(() => {
      setIsSubmittingCard(false);
      setCardRequestedSuccess(true);
      setTimeout(() => {
        setIsCardModalOpen(false);
        setCardRequestedSuccess(false);
        setSelectedCardType('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative z-10">
        <TopAppBar />
        
        <main className="flex-1 px-6 md:px-16 py-8 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto space-y-8">
            
            {/* Command Center Title */}
            <div>
              <h2 className="font-sora text-3xl font-bold text-white">Command Center</h2>
              <p className="font-geist text-sm text-on-surface-variant mt-1">Real-time asset telemetry.</p>
            </div>

            {/* Main Responsive Grid: 2 columns on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column (Main Telemetry) - Spans 8 columns on lg screens */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Balance Card */}
                <div className="glass-card rounded-xl p-8 relative overflow-hidden glow-primary group">
                  <div className="noise-overlay" />
                  <div className="scan-lines" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <p className="font-space-grotesk text-xs text-on-surface-variant tracking-widest uppercase">
                        Total Liquidity
                      </p>
                      <h3 className="font-sora text-5xl text-primary-container mt-2 font-bold tracking-tight">
                        <span className="opacity-50 font-normal mr-1">$</span>1,402,890<span className="text-2xl opacity-50">.45</span>
                      </h3>
                    </div>
                    <div className="flex gap-4 mt-6 md:mt-0 w-full md:w-auto">
                      <Link href="/transfer" className="flex-1 md:flex-none">
                        <button className="w-full md:w-auto py-3 px-6 btn-primary-cyan font-space-grotesk text-xs tracking-wider uppercase rounded-full shadow-[0_0_15px_rgba(42,241,254,0.3)] hover:scale-98 transition-transform duration-200 flex items-center justify-center gap-2">
                          <Send className="w-3.5 h-3.5" /> Transfer Funds
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Yield summary widget */}
                <div className="glass-card rounded-xl p-8 relative overflow-hidden flex flex-col justify-between hover:border-secondary-container/30 transition-colors">
                  <div className="noise-overlay" />
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-sora text-lg font-semibold text-white">Carbon Yield Pool</h4>
                      <span className="px-2 py-0.5 rounded bg-primary-container/10 border border-primary-container/20 text-primary-container text-[10px] font-mono">v4 Compliance</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-on-surface-variant">Carbon Offsets</span>
                        <span className="text-sm font-semibold text-white">+8.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-on-surface-variant">Aether Coin (ATH)</span>
                        <span className="text-sm font-semibold text-primary-fixed-dim">+14.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-on-surface-variant">Annual Yield</span>
                        <span className="text-sm font-semibold text-white">$124,580.00</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-white/5 pt-4">
                    <Link href="/advisor" className="text-xs text-primary-container hover:text-primary-fixed transition-colors flex items-center gap-1 font-space-grotesk uppercase tracking-wider">
                      Optimize allocations &rarr;
                    </Link>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="glass-card rounded-xl p-8 relative overflow-hidden">
                  <div className="noise-overlay" />
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-primary-container" />
                      <h4 className="font-sora text-lg font-semibold text-white">Recent Vault Activity</h4>
                    </div>
                    <Link href="/transactions" className="text-xs text-on-surface-variant hover:text-white transition-colors">
                      View Full History
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-on-surface-variant font-space-grotesk text-xs tracking-wider uppercase">
                          <th className="pb-3">Entity</th>
                          <th className="pb-3 hidden sm:table-cell">Category</th>
                          <th className="pb-3 text-right">Amount</th>
                          <th className="pb-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm font-geist">
                        {loading ? (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-on-surface-variant">
                              Syncing telemetry...
                            </td>
                          </tr>
                        ) : transactions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-on-surface-variant">
                              No transactions found.
                            </td>
                          </tr>
                        ) : (
                          transactions.slice(0, 4).map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/2 transition-colors">
                              <td className="py-3.5 font-medium text-white flex flex-col">
                                <span>{tx.entity}</span>
                                <span className="text-[10px] text-on-surface-variant font-mono">{tx.id}</span>
                              </td>
                              <td className="py-3.5 text-on-surface-variant hidden sm:table-cell">{tx.category}</td>
                              <td className={`py-3.5 text-right font-semibold font-mono ${
                                tx.amount > 0 ? 'text-primary-container' : 'text-secondary-fixed'
                              }`}>
                                {tx.amount > 0 ? '+' : ''}
                                {tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                              </td>
                              <td className="py-3.5 text-right">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono ${
                                  tx.status === 'Completed'
                                    ? 'bg-primary-container/10 border border-primary-container/20 text-primary-container'
                                    : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                                }`}>
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column (Sidebar Widgets) - Spans 4 columns on lg screens */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Linked Cards Section */}
                <div className="glass-card rounded-xl p-6 relative overflow-hidden border border-white/10 hover:border-primary-container/30 transition-all duration-300">
                  <div className="noise-overlay" />
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-sora text-lg font-semibold text-white">Linked Cards</h4>
                    <CreditCard className="w-5 h-5 text-primary-container" />
                  </div>
                  
                  <div className="space-y-4">
                    {/* Card 1 */}
                    <div className="bg-gradient-to-br from-surface-container-high to-surface-container-high/50 p-5 rounded-xl border border-white/10 relative overflow-hidden group hover:border-primary-container/50 transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/5 rounded-full filter blur-lg -mr-12 -mt-12 group-hover:bg-primary-container/10 transition-colors" />
                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <p className="text-[9px] font-space-grotesk text-primary-container tracking-widest uppercase">AETHER INFINITE</p>
                          <p className="text-lg font-sora font-semibold text-white mt-2">$849,200.00</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-mono">Active</span>
                      </div>
                      <div className="flex justify-between items-end mt-6 relative z-10">
                        <p className="font-mono text-xs text-on-surface-variant">•••• 9018</p>
                        <p className="text-[10px] font-mono text-on-surface-variant">EXP: 08/29</p>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-gradient-to-br from-surface-container-high to-surface-container-high/50 p-5 rounded-xl border border-white/10 relative overflow-hidden group hover:border-secondary-container/50 transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/5 rounded-full filter blur-lg -mr-12 -mt-12 group-hover:bg-secondary-container/10 transition-colors" />
                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <p className="text-[9px] font-space-grotesk text-secondary-fixed tracking-widest uppercase">AETHER BLACK</p>
                          <p className="text-lg font-sora font-semibold text-white mt-2">$553,690.45</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-mono">Active</span>
                      </div>
                      <div className="flex justify-between items-end mt-6 relative z-10">
                        <p className="font-mono text-xs text-on-surface-variant">•••• 3044</p>
                        <p className="text-[10px] font-mono text-on-surface-variant">EXP: 12/31</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => setIsCardModalOpen(true)}
                      className="w-full py-2.5 px-4 mt-2 border border-white/10 hover:border-primary-container/40 rounded-xl font-space-grotesk text-xs tracking-wider uppercase text-white bg-white/5 hover:bg-white/10 transition-all duration-200"
                    >
                      + Request New Card
                    </button>
                  </div>
                </div>

                {/* Loans Section */}
                <div className="glass-card rounded-xl p-6 relative overflow-hidden border border-white/10 hover:border-secondary-container/30 transition-all duration-300">
                  <div className="noise-overlay" />
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-sora text-lg font-semibold text-white">Active Loans</h4>
                    <TrendingUp className="w-5 h-5 text-secondary-container" />
                  </div>

                  <div className="space-y-4">
                    {/* Loan 1 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-sora text-xs font-semibold text-white">Crypto Liquidity Line</h5>
                          <p className="font-mono text-[9px] text-on-surface-variant mt-0.5">ID: ATH-L-809</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-primary-container/10 border border-primary-container/20 text-primary-container font-mono">4.2% APR</span>
                      </div>
                      
                      {/* Repayment Progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-on-surface-variant">Paid: $40,000</span>
                          <span className="text-white">Target: $100,000</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary-container h-full rounded-full" style={{ width: '40%' }} />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1 text-[10px] font-mono text-on-surface-variant">
                        <span>Next due: July 15</span>
                        <span className="text-white">$1,200.00</span>
                      </div>
                    </div>

                    {/* Loan 2 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-sora text-xs font-semibold text-white">Carbon Credit Line</h5>
                          <p className="font-mono text-[9px] text-on-surface-variant mt-0.5">ID: CRB-L-441</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-secondary-container/10 border border-secondary-container/20 text-secondary-container font-mono">5.8% APR</span>
                      </div>
                      
                      {/* Repayment Progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-on-surface-variant">Paid: $180,000</span>
                          <span className="text-white">Target: $200,000</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-secondary-container h-full rounded-full" style={{ width: '90%' }} />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1 text-[10px] font-mono text-on-surface-variant">
                        <span>Next due: Aug 01</span>
                        <span className="text-white">$5,000.00</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full py-2.5 px-4 mt-2 border border-white/10 hover:border-secondary-container/40 rounded-xl font-space-grotesk text-xs tracking-wider uppercase text-white bg-white/5 hover:bg-white/10 transition-all duration-200">
                      Apply For Credit Line
                    </button>
                  </div>
                </div>

              </div>
              
            </div>

          </div>
        </main>
      </div>

      {/* Request New Card Modal */}
      <AnimatePresence>
        {isCardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmittingCard && !cardRequestedSuccess) setIsCardModalOpen(false);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-md p-6 rounded-2xl border border-white/10 relative z-10 space-y-6 bg-[#0c0d12]/95 shadow-[0_0_50px_rgba(0,240,255,0.15)]"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-sora text-xl font-bold text-white">Request New Card</h3>
                <button 
                  onClick={() => setIsCardModalOpen(false)}
                  disabled={isSubmittingCard || cardRequestedSuccess}
                  className="text-on-surface-variant hover:text-white transition-colors disabled:opacity-30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cardRequestedSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-sora text-lg font-semibold text-white">Request Submitted</h4>
                  <p className="font-geist text-sm text-on-surface-variant max-w-xs">
                    Your request for an Aether Card is undergoing stateful protocol authorization.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {[
                      { id: 'credit', title: 'Aether Credit Card', desc: 'Credit card with global limits and carbon offset rewards.', badge: 'Elite' },
                      { id: 'debit', title: 'Aether Debit Card', desc: 'Direct vault settlement debit card for active liquidity.', badge: 'Standard' },
                      { id: 'forex', title: 'Aether Forex Card', desc: 'Multi-currency travel card with real-time conversion rates.', badge: 'Global' },
                    ].map((option) => (
                      <label 
                        key={option.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                          selectedCardType === option.id 
                            ? 'border-primary-container bg-primary-container/10' 
                            : 'border-white/5 bg-white/2 hover:border-white/20'
                        }`}
                        onClick={() => setSelectedCardType(option.id)}
                      >
                        <input 
                          type="radio" 
                          name="cardType" 
                          checked={selectedCardType === option.id}
                          onChange={() => {}} 
                          className="mt-1 accent-primary-container pointer-events-none"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-sora text-sm font-semibold text-white">{option.title}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-on-surface-variant font-bold">{option.badge}</span>
                          </div>
                          <p className="font-geist text-xs text-on-surface-variant leading-relaxed">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button 
                    onClick={handleRequestCardSubmit}
                    disabled={!selectedCardType || isSubmittingCard}
                    className="w-full py-3 px-6 btn-primary-cyan font-space-grotesk text-xs tracking-wider uppercase rounded-xl shadow-[0_0_15px_rgba(42,241,254,0.3)] hover:scale-98 transition-transform duration-200 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmittingCard ? 'Authorizing Request...' : 'Submit Request'}
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
