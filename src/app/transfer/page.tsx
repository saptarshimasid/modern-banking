'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopAppBar } from '@/components/TopAppBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertTriangle, CheckCircle, HelpCircle, Landmark } from 'lucide-react';

const recipients = [
  { name: 'Alex.J', note: 'Personal Vault', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3y_TrWy7OK5WtjG21md01_BSQENZ5zAeOiy7EIvGMWFy3Ftoojw09N1WHydbobz3OTwLcerNhoIV4z533vplERXvJJtmToiOKbjvj_ImFGMVWj1xHac5fY5ILpb5i5Rk6QzVL8jio5frYyFNV8Kde1am2I7qs4iidhRIAMIKGbHCvJpsNhJBrRkpTAxp1F0NASaLD4-zPIoHddQoxA4LEFuKWmOhF2Kh9GArveZmGm5H9YziFvFtYIJTkhqzj9v8_LXMjmTLPRFdU' },
  { name: 'Vault Core #0', note: 'Primary Deposit', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3y_TrWy7OK5WtjG21md01_BSQENZ5zAeOiy7EIvGMWFy3Ftoojw09N1WHydbobz3OTwLcerNhoIV4z533vplERXvJJtmToiOKbjvj_ImFGMVWj1xHac5fY5ILpb5i5Rk6QzVL8jio5frYyFNV8Kde1am2I7qs4iidhRIAMIKGbHCvJpsNhJBrRkpTAxp1F0NASaLD4-zPIoHddQoxA4LEFuKWmOhF2Kh9GArveZmGm5H9YziFvFtYIJTkhqzj9v8_LXMjmTLPRFdU' },
  { name: 'Horizon compliance pool', note: 'ESG Offset Fund', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3y_TrWy7OK5WtjG21md01_BSQENZ5zAeOiy7EIvGMWFy3Ftoojw09N1WHydbobz3OTwLcerNhoIV4z533vplERXvJJtmToiOKbjvj_ImFGMVWj1xHac5fY5ILpb5i5Rk6QzVL8jio5frYyFNV8Kde1am2I7qs4iidhRIAMIKGbHCvJpsNhJBrRkpTAxp1F0NASaLD4-zPIoHddQoxA4LEFuKWmOhF2Kh9GArveZmGm5H9YziFvFtYIJTkhqzj9v8_LXMjmTLPRFdU' },
];

export default function TransferPage() {
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [amount, setAmount] = useState(250);
  const [category, setCategory] = useState('Transfer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient) {
      alert('Please select a recipient');
      return;
    }

    setLoading(true);
    setResult(null);

    fetch('http://localhost:5001/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: selectedRecipient,
        amount,
        category,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.error) {
          setResult({ success: false, message: data.error });
        } else {
          setResult({ success: true, message: data.message });
        }
      })
      .catch((err) => {
        console.error('Transfer error:', err);
        setLoading(false);
        setResult({ success: false, message: 'Compliance validation offline. Pre-authorized (fallback mode).' });
      });
  };

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative z-10">
        <TopAppBar />

        <main className="flex-1 px-6 md:px-16 py-8 overflow-y-auto">
          <div className="max-w-[800px] mx-auto space-y-8">
            {/* Header */}
            <div>
              <h2 className="font-sora text-3xl font-bold text-white">Transfer Credits</h2>
              <p className="font-geist text-sm text-on-surface-variant mt-1">
                Initiate safe liquidity transactions.
              </p>
            </div>

            {/* Main Transfer Form Card */}
            <div className="glass-card rounded-xl p-8 relative overflow-hidden">
              <div className="noise-overlay" />
              <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                
                {/* 1. Select Recipient */}
                <div className="space-y-4">
                  <label className="block font-space-grotesk text-xs tracking-widest text-on-surface-variant uppercase">
                    1. Recipient Entity
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recipients.map((rec) => (
                      <div
                        key={rec.name}
                        onClick={() => setSelectedRecipient(rec.name)}
                        className={`p-4 rounded-xl border cursor-pointer hover:border-primary-container/40 transition-all duration-300 flex flex-col items-center text-center ${
                          selectedRecipient === rec.name
                            ? 'bg-primary-container/10 border-primary-container shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                            : 'bg-white/3 border-white/10 text-on-surface-variant'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 mb-3">
                          <img src={rec.avatar} alt={rec.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-sora font-semibold text-white text-sm">{rec.name}</span>
                        <span className="text-[10px] text-on-surface-variant mt-1">{rec.note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Amount Input and Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="font-space-grotesk text-xs tracking-widest text-on-surface-variant uppercase">
                      2. Transaction Value
                    </label>
                    <span className="font-mono text-xs text-primary-container uppercase tracking-wider">
                      Tier Limit: $500K
                    </span>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center">
                    <div className="text-3xl font-mono font-bold text-white mb-4">
                      ${amount.toLocaleString()}
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="1000000"
                      step="100"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-container"
                    />
                    <div className="flex justify-between w-full text-[10px] text-on-surface-variant font-mono mt-2">
                      <span>$100</span>
                      <span>$500K</span>
                      <span>$1M</span>
                    </div>
                  </div>
                </div>

                {/* 3. Category Selector */}
                <div className="space-y-4">
                  <label className="block font-space-grotesk text-xs tracking-widest text-on-surface-variant uppercase">
                    3. Purpose Class
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 font-geist text-sm text-on-surface focus:outline-none focus:border-primary-container"
                  >
                    <option className="bg-[#0c0d12]" value="Transfer">Transfer</option>
                    <option className="bg-[#0c0d12]" value="Investments">Investments</option>
                    <option className="bg-[#0c0d12]" value="Compliance">Compliance Offset</option>
                    <option className="bg-[#0c0d12]" value="Acquisitions">Acquisitions</option>
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 btn-primary-cyan font-space-grotesk text-sm font-semibold tracking-wider uppercase rounded-full shadow-[0_0_15px_rgba(42,241,254,0.3)] hover:shadow-[0_0_25px_rgba(42,241,254,0.5)] active:scale-99 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Validating Compliance...' : 'Send Credits'}
                </button>
              </form>
            </div>

            {/* Compliance Feed Response Modal */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`glass-card rounded-xl p-6 border relative overflow-hidden ${
                    result.success
                      ? result.message.includes('WARNING')
                        ? 'border-yellow-500/30'
                        : 'border-primary-container/30'
                      : 'border-red-500/30'
                  }`}
                >
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="mt-1">
                      {result.success ? (
                        result.message.includes('WARNING') ? (
                          <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-primary-container" />
                        )
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-sora font-semibold text-white">
                        {result.success
                          ? result.message.includes('WARNING')
                            ? 'Compliance Clearance Warning'
                            : 'Compliance Clearance Approved'
                          : 'Compliance Clearance Denied'}
                      </h4>
                      <p className="font-geist text-sm text-on-surface-variant mt-2 leading-relaxed">
                        {result.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
}
