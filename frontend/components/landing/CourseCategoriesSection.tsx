'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, BookOpen } from 'lucide-react';

export const CourseCategoriesSection: React.FC = () => {
  const tiers = [
    {
      title: 'Digital & Info Foundations',
      desc: 'Bits, bytes, binary arithmetic, hex notation, physical media transceivers, network topology, and performance metrics (latency, throughput, loss, jitter).',
      level: 'FOUNDATIONAL',
      badgeVariant: 'cyan' as const,
      code: 'NET-101 — NET-102',
    },
    {
      title: 'Fundamentals & Architecture',
      desc: 'OSI 7-layer reference model, TCP/IP 4-layer architecture, Ethernet framing, MAC address resolution, and IPv4 CIDR subnetting calculations.',
      level: 'BEGINNER',
      badgeVariant: 'emerald' as const,
      code: 'NET-103 — NET-104',
    },
    {
      title: 'Transport & Protocol Mechanics',
      desc: 'TCP 3-way handshake, state transitions, UDP datagrams, ICMP ping/traceroute diagnostics, DNS hierarchy, and DHCP lease allocations.',
      level: 'INTERMEDIATE',
      badgeVariant: 'purple' as const,
      code: 'NET-201 — NET-204',
    },
    {
      title: 'Enterprise Routing & Policy',
      desc: 'Single-area and multi-area OSPF, 802.1Q VLAN trunking, stateful firewall ACL inspection rules, BGP path selection, and network automation.',
      level: 'ADVANCED',
      badgeVariant: 'rose' as const,
      code: 'NET-301 — NET-404',
    },
  ];

  return (
    <section id="courses" className="py-16 sm:py-20 bg-net-grid-pattern relative surface-0 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold mb-2 block">
              STRUCTURED LEARNING PROGRESSION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
              Four-Tier Curriculum Roadmap
            </h2>
          </div>
          <Link href="/courses" className="text-xs font-mono font-semibold text-[#38bdf8] hover:underline flex items-center gap-1.5 shrink-0">
            <span>EXPLORE ALL 16 COURSES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((c, idx) => (
            <div
              key={idx}
              className="surface-2 p-5 rounded-xl border border-[#2a2e39] hover:border-[#38bdf8]/40 hover:bg-[#1f222c] transition-all flex flex-col justify-between shadow-instrument group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <Badge variant={c.badgeVariant} dot={true}>{c.level}</Badge>
                  <span className="text-[11px] font-mono text-[#8e95a5] font-bold">{c.code}</span>
                </div>
                <h3 className="text-base font-bold text-[#f4f5f7] mb-2 group-hover:text-[#38bdf8] transition-colors flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-[#646c7d] group-hover:text-[#38bdf8] shrink-0 mt-0.5" />
                  <span>{c.title}</span>
                </h3>
                <p className="text-xs text-[#8e95a5] leading-relaxed mb-4">{c.desc}</p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#38bdf8] hover:underline pt-3 border-t border-[#2a2e39]"
              >
                <span>ENTER TIER TRACK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
