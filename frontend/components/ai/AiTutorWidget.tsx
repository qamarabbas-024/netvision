'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiTutorWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Hi! I am your NetVision AI Tutor. Ask me anything about IP Subnetting, TCP Handshakes, DNS, or Firewall ACLs!',
      timestamp: 'Just now',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: inputQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputQuery;
    setInputQuery('');

    // AI Response Simulation
    setTimeout(() => {
      let reply = `Great question about networking! In simple terms: ${query} operates at the Network Layer (Layer 3) to ensure packets reach their intended destination efficiently.`;

      if (query.toLowerCase().includes('ip') || query.toLowerCase().includes('mac')) {
        reply = 'Think of a MAC address as your device physical fingerprint (burned into the NIC card), while an IP address is your virtual mailing address on the network!';
      } else if (query.toLowerCase().includes('tcp') || query.toLowerCase().includes('udp')) {
        reply = 'TCP is like a registered mail service with return receipts (3-way handshake). UDP is like dropping a postcard in the mailbox—faster, but without delivery confirmation!';
      } else if (query.toLowerCase().includes('subnet')) {
        reply = 'Subnetting breaks a large IP block into smaller broadcast domains. A /24 subnet mask (255.255.255.0) provides 254 usable host addresses!';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-96 h-[460px] glass-panel-glow rounded-3xl border border-[#00f0ff]/30 shadow-2xl flex flex-col justify-between overflow-hidden mb-4"
          >
            {/* AI Widget Header */}
            <div className="p-4 border-b border-[#272732] bg-[#121217] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center text-black shadow-glow-cyan">
                  <Bot className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    NetVision AI Tutor <Sparkles className="w-3 h-3 text-[#00f0ff] animate-pulse" />
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">Online • Level 1-3 Support</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat History Messages */}
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      m.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-[#00f0ff]/20 text-[#00f0ff]'
                    }`}
                  >
                    {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#3b82f6] text-white rounded-tr-none'
                        : 'bg-[#181820] text-zinc-300 border border-[#272732] rounded-tl-none'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className="text-[9px] text-zinc-400 block mt-1 text-right font-mono">{m.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#272732] bg-[#121217] flex items-center gap-2">
              <Input
                placeholder="Ask AI about networking..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="py-2 text-xs"
              />
              <Button type="submit" variant="cyan" size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] text-black shadow-glow-cyan flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Bot className="w-7 h-7 font-bold" />
        </button>
      )}
    </div>
  );
};
