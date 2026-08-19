'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, BookOpen } from 'lucide-react';

export const CourseCategoriesSection: React.FC = () => {
  const categories = [
    {
      title: 'Level 0: Digital & Info Foundations',
      desc: 'Bits, bytes, binary arithmetic, hex notation, physical media transceivers, network topology, and performance metrics (latency, throughput, loss, jitter).',
      level: 'FOUNDATIONAL',
      lessonsCount: 5,
      badgeVariant: 'cyan' as const,
      code: 'NET-101 & NET-102',
    },
    {
      title: 'Level 1: Fundamentals & LAN Architecture',
      desc: 'OSI 7-layer reference model, TCP/IP 4-layer architecture, Ethernet framing, MAC address resolution, and IPv4 CIDR subnetting calculations.',
      level: 'BEGINNER',
      lessonsCount: 8,
      badgeVariant: 'emerald' as const,
      code: 'NET-103 & NET-104',
    },
    {
      title: 'Level 2: Transport & Network Protocol Mechanics',
      desc: 'TCP 3-way handshake, state transitions, UDP datagrams, ICMP ping/traceroute diagnostics, DNS hierarchy, and DHCP lease allocations.',
      level: 'INTERMEDIATE',
      lessonsCount: 9,
      badgeVariant: 'purple' as const,
      code: 'NET-201 — NET-204',
    },
    {
      title: 'Level 3: Enterprise Routing & Security Policy',
      desc: 'Single-area and multi-area OSPF, 802.1Q VLAN trunking, stateful firewall ACL inspection rules, BGP path selection, and network automation.',
      level: 'ADVANCED',
      lessonsCount: 8,
      badgeVariant: 'rose' as const,
      code: 'NET-301 — NET-404',
    },
  ];

  return (
    <section id="courses" className="py-16 sm:py-20 bg-net-grid-pattern relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div>
            <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold mb-2 block">
              Curriculum Roadmap
            </span>
            <h2 className="text-2xl sm:text-5xl font-extrabold text-white tracking-tight">
              Explore Learning Pathways
            </h2>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-[#00f0ff] hover:underline flex items-center gap-1">
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
          {categories.map((c, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-xl border border-[#272732] hover:border-[#00f0ff]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <Badge variant={c.badgeVariant}>{c.level}</Badge>
                  <span className="text-xs font-mono text-[#00f0ff] font-semibold">{c.code}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors flex items-start gap-2 font-sans">
                  <BookOpen className="w-4 h-4 text-zinc-400 group-hover:text-[#00f0ff] shrink-0 mt-1" />
                  <span>{c.title}</span>
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed mb-4 font-sans">{c.desc}</p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00f0ff] hover:underline pt-3 border-t border-[#272732]"
              >
                <span>Start Pathway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
