'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopAppBar } from '@/components/TopAppBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, AlertCircle, TrendingUp, Key } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts = [
  { text: 'Get market trends', icon: TrendingUp },
  { text: 'Simulate portfolio: 50% ATH, 30% NXS, 20% CRB', icon: Sparkles },
  { text: 'Validate transfer to Alex.J of $25,000', icon: Key },
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Aether core online. Welcome Elite Node, I am Aether Intelligence. How can I assist you with your digital wealth strategies today?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInputValue('');
    setLoading(true);

    try {
      // Call Express API endpoint
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          user_profile: { tier: 'ELITE', balance: 1402890.45 },
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `ERROR: ${data.error}. Please ensure the Python FastAPI and Express servers are running.`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.content },
        ]);
      }
    } catch (err) {
      console.error('Advisor chat error:', err);
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error: Connection refused. Ensure that the Express backend on port 5001 and FastAPI service on port 8000 are started.',
        },
      ]);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative z-10">
        <TopAppBar />

        <main className="flex-grow flex flex-col px-6 md:px-16 py-8 overflow-hidden h-[calc(100vh-70px)]">
          <div className="max-w-[1000px] mx-auto w-full flex-grow flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-sora text-3xl font-bold text-white flex items-center gap-2">
                  Aether Advisor <Sparkles className="w-6 h-6 text-primary-container animate-pulse" />
                </h2>
                <p className="font-geist text-sm text-on-surface-variant mt-1">
                  Stateful financial planning & validation powered by LangGraph.
                </p>
              </div>
            </div>

            {/* Chat Container */}
            <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden min-h-0 mb-6">
              
              {/* Messages Column */}
              <div className="flex-1 glass-card rounded-xl p-6 flex flex-col overflow-hidden relative">
                <div className="noise-overlay" />
                
                {/* Scroll Area */}
                <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 max-w-[85%] ${
                        msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                        msg.role === 'user'
                          ? 'bg-secondary-container/10 border-secondary-container/30 text-secondary-fixed'
                          : 'bg-primary-container/10 border-primary-container/30 text-primary-container'
                      }`}>
                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      
                      <div className={`rounded-xl p-4 text-sm font-geist leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-secondary-container/10 border border-secondary-container/20 text-white'
                          : 'bg-white/3 border border-white/10 text-on-surface'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-primary-container/10 border-primary-container/30 text-primary-container">
                        <Bot className="w-4 h-4 animate-bounce" />
                      </div>
                      <div className="bg-white/3 border border-white/10 rounded-xl px-4 py-3 text-xs text-on-surface-variant flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span>State telemetry resolving...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input box */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="mt-4 flex gap-3 relative z-10"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about ATH yield, portfolio simulation or transfer safety..."
                    className="flex-grow bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm text-white focus:outline-none focus:border-primary-container transition-all"
                  />
                  <button
                    type="submit"
                    className="w-11 h-11 btn-primary-cyan rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(42,241,254,0.3)] hover:scale-95 transition-transform duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Suggestions Sidebar */}
              <div className="w-full md:w-64 flex flex-col gap-4">
                <div className="glass-card rounded-xl p-6 relative overflow-hidden flex-1">
                  <div className="noise-overlay" />
                  <h4 className="font-sora text-sm font-semibold text-white mb-4">Interactive Triggers</h4>
                  <div className="space-y-3">
                    {suggestedPrompts.map((p, idx) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(p.text)}
                          className="w-full p-3 bg-white/3 border border-white/10 rounded-lg text-left text-xs text-on-surface-variant hover:border-primary-container/40 hover:text-white transition-all flex items-start gap-2.5"
                        >
                          <Icon className="w-4 h-4 text-primary-container mt-0.5 shrink-0" />
                          <span>{p.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
