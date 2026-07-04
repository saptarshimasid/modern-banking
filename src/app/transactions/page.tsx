'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopAppBar } from '@/components/TopAppBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Filter, ExternalLink, Calendar, Search } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  entity: string;
  category: string;
  amount: number;
  status: string;
  hash: string;
}

const categories = ['All', 'Investments', 'Compliance', 'Deposit', 'Acquisitions', 'Transfer'];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/transactions')
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setFilteredTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching transactions:', err);
        setLoading(false);
      });
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = transactions;

    if (selectedCategory !== 'All') {
      result = result.filter(
        (tx) => tx.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.entity.toLowerCase().includes(q) ||
          tx.id.toLowerCase().includes(q) ||
          tx.hash.toLowerCase().includes(q)
      );
    }

    setFilteredTransactions(result);
  }, [selectedCategory, searchQuery, transactions]);

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative z-10">
        <TopAppBar />

        <main className="flex-1 px-6 md:px-16 py-8 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-sora text-3xl font-bold text-white">Vault Ledger</h2>
                <p className="font-geist text-sm text-on-surface-variant mt-1">
                  Cryptographic transaction records.
                </p>
              </div>
              
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full font-space-grotesk text-xs tracking-wider uppercase border transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'bg-primary-container/10 border-primary-container text-primary-container shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                        : 'border-white/10 text-on-surface-variant hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input
                  type="text"
                  placeholder="Filter by hash, entity name, transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/3 border border-white/10 rounded-lg py-2 pl-12 pr-4 font-geist text-sm text-on-surface focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-space-grotesk uppercase tracking-wider">
                <Filter className="w-4 h-4 text-primary-container" />
                <span>Showing {filteredTransactions.length} items</span>
              </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              <AnimatePresence>
                {loading ? (
                  <div className="glass-card rounded-xl p-8 text-center text-on-surface-variant">
                    Decoding ledger nodes...
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="glass-card rounded-xl p-8 text-center text-on-surface-variant">
                    No matching compliance logs found.
                  </div>
                ) : (
                  filteredTransactions.slice(0, visibleCount).map((tx, idx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                      className="glass-card rounded-xl p-6 relative overflow-hidden group hover:border-primary-container/20 transition-all duration-300"
                    >
                      <div className="noise-overlay" />
                      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary-container">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-sora font-semibold text-white">{tx.entity}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-on-surface-variant font-mono uppercase">
                                {tx.category}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant mt-1 font-mono">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> {tx.date}
                              </span>
                              <span>ID: {tx.id}</span>
                              <span className="flex items-center gap-1 hover:text-primary-container cursor-pointer transition-colors">
                                Hash: {tx.hash} <ExternalLink className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end justify-between sm:justify-start w-full sm:w-auto mt-4 sm:mt-0">
                          <span className={`text-lg font-bold font-mono ${
                            tx.amount > 0 ? 'text-primary-container' : 'text-secondary-fixed'
                          }`}>
                            {tx.amount > 0 ? '+' : ''}
                            {tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                          </span>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono mt-1 ${
                            tx.status === 'Completed'
                              ? 'bg-primary-container/10 border border-primary-container/20 text-primary-container'
                              : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Load More Button */}
            {filteredTransactions.length > visibleCount && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setVisibleCount(prev => prev + 5)}
                  className="py-3 px-8 border border-white/10 rounded-full font-space-grotesk text-xs tracking-wider uppercase text-white bg-white/5 hover:bg-white/10 hover:border-primary-container/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300"
                >
                  Load More Flow
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
