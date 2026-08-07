'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Undergrad @ MIT',
      quote:
        'I spent weeks struggling with TCP 3-way handshakes and ARP resolution until I opened NetVision. Seeing the actual packets move between nodes made everything click in 10 minutes.',
    },
    {
      name: 'Marcus Vance',
      role: 'Junior Network Engineer @ Cisco',
      quote:
        'The interactive sandbox lab feels like a modern web-native Packet Tracer. It is incredibly responsive, lightweight, and perfect for testing static routing topologies.',
    },
    {
      name: 'Elena Rostova',
      role: 'Cybersecurity Analyst',
      quote:
        'NetVision visual packet inspection is the best learning tool out there. Watching firewall rules drop unauthorized packets visually is ten times better than reading a textbook.',
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold mb-2 block">
            Student Feedback
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Loved By Learners Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-[#272732] flex flex-col justify-between hover:border-[#00f0ff]/40 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed italic mb-6">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#272732]/60">
                <Avatar name={t.name} size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
