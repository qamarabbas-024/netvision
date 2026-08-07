'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, BookOpen } from 'lucide-react';

export const CourseCategoriesSection: React.FC = () => {
  const categories = [
    {
      title: 'Networking Fundamentals',
      desc: 'OSI Model 7 Layers, Ethernet frames, MAC addresses, and physical layer basics.',
      level: 'BEGINNER',
      lessonsCount: 12,
      badgeVariant: 'cyan' as const,
    },
    {
      title: 'TCP/IP & Protocol Suite',
      desc: 'Deep dive into IP addressing, TCP 3-way handshake, UDP datagrams, and ICMP Ping.',
      level: 'BEGINNER',
      lessonsCount: 15,
      badgeVariant: 'emerald' as const,
    },
    {
      title: 'IP Subnetting & Routing',
      desc: 'Master IPv4/IPv6 CIDR subnetting, default gateways, and static routing tables.',
      level: 'INTERMEDIATE',
      lessonsCount: 18,
      badgeVariant: 'purple' as const,
    },
    {
      title: 'Core Network Services',
      desc: 'DNS resolution, DHCP lease allocations, NAT translation, and ARP tables.',
      level: 'INTERMEDIATE',
      lessonsCount: 14,
      badgeVariant: 'amber' as const,
    },
    {
      title: 'Cyber Security & Firewalls',
      desc: 'Stateful packet inspection, access control lists (ACLs), VPN tunnels, and DDoS mitigation.',
      level: 'ADVANCED',
      lessonsCount: 20,
      badgeVariant: 'rose' as const,
    },
    {
      title: 'Switching & VLANs',
      desc: 'Broadcast domains, 802.1Q trunking, Spanning Tree Protocol (STP), and Port Security.',
      level: 'ADVANCED',
      lessonsCount: 16,
      badgeVariant: 'cyan' as const,
    },
  ];

  return (
    <section id="courses" className="py-20 bg-net-grid-pattern relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold mb-2 block">
              Curriculum Roadmap
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Explore Learning Pathways
            </h2>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-[#00f0ff] hover:underline flex items-center gap-1">
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((c, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-[#272732] hover:border-[#00f0ff]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={c.badgeVariant}>{c.level}</Badge>
                  <span className="text-xs font-mono text-zinc-500">{c.lessonsCount} Interactive Lessons</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-zinc-400 group-hover:text-[#00f0ff]" />
                  {c.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">{c.desc}</p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#00f0ff] group-hover:translate-x-1 transition-transform"
              >
                <span>Start Learning Pathway</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
