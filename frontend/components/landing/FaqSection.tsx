'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Do I need an account to start learning?',
      answer:
        'No. You can jump directly into guest sandbox mode and interact with live 3D topologies, packet visualizers, and interactive CLI labs immediately without entering credentials or billing information.',
    },
    {
      question: 'Do I need prior computer networking experience?',
      answer:
        'No prior experience is required. The curriculum begins at NET-101 (Digital & Physical Foundations), breaking down binary signals, frame encoding, and OSI layers with interactive 3D physics.',
    },
    {
      question: 'How does NetVision compare to Cisco Packet Tracer?',
      answer:
        'NetVision runs entirely in modern web browsers without installation, featuring real-time packet inspection, interactive 3D topology visualization, live protocol state convergence, and verifiable practical competency certification.',
    },
    {
      question: 'How are certificates verified?',
      answer:
        'Every awarded credential features a unique verification code backed by NetVision\'s official PostgreSQL verification registry. Employers, recruiters, and institutions can authenticate credential validity, issuance timestamp, and candidate identity in real time at /certificates/verify.',
    },
  ];

  return (
    <section id="faq-section" className="relative w-full bg-[#0b0f17] border-b border-[#1e293b]/70 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="text-xs font-bold font-mono text-[#38bdf8] uppercase tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-3 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const questionId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;

            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0f172a]/80 border border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-sans font-semibold text-sm sm:text-base text-slate-200 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span>{faq.question}</span>
                  <span className="p-1 rounded-lg bg-[#0b101c] text-slate-400">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#38bdf8]" aria-hidden="true" /> : <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans border-t border-slate-800/60 animate-fadeIn"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
