'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';

export default function FlashcardsPage() {
  const cards = [
    { question: 'Port 80', answer: 'HTTP (Hypertext Transfer Protocol)' },
    { question: 'Port 443', answer: 'HTTPS (Encrypted HTTP over SSL/TLS)' },
    { question: 'Port 53', answer: 'DNS (Domain Name System)' },
    { question: 'Port 22', answer: 'SSH (Secure Shell)' },
    { question: 'Port 67/68', answer: 'DHCP (Dynamic Host Configuration Protocol)' },
    { question: 'Port 20 / 21', answer: 'FTP (File Transfer Protocol — Data & Control)' },
    { question: 'Port 25', answer: 'SMTP (Simple Mail Transfer Protocol)' },
    { question: 'Port 110', answer: 'POP3 (Post Office Protocol v3)' },
    { question: 'Port 143', answer: 'IMAP (Internet Message Access Protocol)' },
    { question: 'Port 123', answer: 'NTP (Network Time Protocol)' },
    { question: 'Port 161 / 162', answer: 'SNMP (Simple Network Management Protocol)' },
    { question: 'Port 3389', answer: 'RDP (Remote Desktop Protocol)' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = cards[currentIndex];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern flex flex-col items-center justify-center">
            <div className="max-w-xl w-full flex flex-col items-center gap-6">
              <div className="text-center">
                <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest block mb-1">
                  Port & Protocol Memory Deck
                </span>
                <h1 className="text-3xl font-extrabold text-white">Interactive Flashcards</h1>
              </div>

              <Card
                onClick={() => setFlipped(!flipped)}
                className="w-full h-64 p-8 glass-panel-glow border-[#00f0ff]/40 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform duration-300 hover:scale-102"
              >
                <span className="text-xs text-zinc-500 font-mono uppercase mb-4">
                  {flipped ? 'ANSWER (CLICK TO FLIP)' : 'QUESTION (CLICK TO FLIP)'}
                </span>

                <h2 className="text-3xl font-extrabold text-white font-mono">
                  {flipped ? current.answer : current.question}
                </h2>
              </Card>

              <div className="flex items-center justify-between w-full">
                <Button
                  variant="ghost"
                  disabled={currentIndex === 0}
                  onClick={() => { setFlipped(false); setCurrentIndex((i) => i - 1); }}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>

                <span className="text-xs font-mono text-zinc-400">
                  {currentIndex + 1} of {cards.length}
                </span>

                <Button
                  variant="cyan"
                  disabled={currentIndex === cards.length - 1}
                  onClick={() => { setFlipped(false); setCurrentIndex((i) => i + 1); }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next Card
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
