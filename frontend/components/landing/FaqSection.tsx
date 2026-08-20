'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      q: 'Do I need an account to start learning?',
      a: 'No. NetVision provides 100% open guest access. You can jump directly into foundational lessons, launch visualizers, and execute labs immediately without any signup friction. Progress is automatically synced locally until you decide to create an account.',
    },
    {
      q: 'Do I need prior computer networking experience?',
      a: 'Not at all. NetVision begins at Tier 0 (bits, bytes, physical cables, and digital representation) and progressively builds up to advanced OSPF routing, VLAN segmentation, and firewall security policies.',
    },
    {
      q: 'How does NetVision compare to Cisco Packet Tracer?',
      a: 'NetVision is 100% web-native, requires zero desktop installation, and is built around pedagogical packet inspection: you can step through protocol framing, observe live ARP and DNS handshakes, and run deterministic CLI diagnostics in real time.',
    },
    {
      q: 'Are certificates cryptographically verifiable?',
      a: 'Yes. Upon completing course pathways and passing the final assessments, you receive a digital certificate containing a unique server-authoritative hash code that can be verified publicly by employers or academic institutions.',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 bg-net-grid-pattern relative surface-0 font-sans border-b border-[#2a2e39]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold mb-2 block">
            QUESTIONS & ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="surface-2 rounded-xl border border-[#2a2e39] overflow-hidden transition-all shadow-instrument"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-[#f4f5f7] text-sm sm:text-base hover:text-[#38bdf8] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8e95a5] transition-transform duration-200 shrink-0 ml-3 ${
                      isOpen ? 'rotate-180 text-[#38bdf8]' : ''
                    }`}
                  />
                </button>
                {isOpen ? (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#8e95a5] leading-relaxed border-t border-[#2a2e39] pt-4">
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
