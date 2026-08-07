'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      q: 'Is NetVision really 100% free?',
      a: 'Yes! NetVision is dedicated to democratizing networking education worldwide. All core courses, interactive simulations, and sandbox labs are 100% free with zero paywalls.',
    },
    {
      q: 'Do I need prior computer networking experience?',
      a: 'Not at all. NetVision starts with absolute fundamentals (Ethernet cables, MAC addresses, IP basics) and progressively guides you up to advanced routing, switching, and firewall security.',
    },
    {
      q: 'How does NetVision compare to Cisco Packet Tracer?',
      a: 'While Cisco Packet Tracer is a desktop software tool, NetVision is 100% web-native, instant-loading, and designed for intuitive learning with step-by-step visual packet animations and guided lessons.',
    },
    {
      q: 'Can I earn verifiable certificates?',
      a: 'Yes! Upon completing course pathways and passing end-of-module interactive quizzes, you receive a digital certificate complete with a cryptographic verification code for your resume and LinkedIn.',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 bg-net-grid-pattern relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold mb-2 block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-[#272732] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-bold text-white text-base hover:text-[#00f0ff] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#00f0ff]' : ''
                    }`}
                  />
                </button>
                {isOpen ? (
                  <div className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed border-t border-[#272732]/60 pt-4">
                    {faq.a}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
