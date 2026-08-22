'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { SearchInput } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function GlossaryPage() {
  const [search, setSearch] = useState('');

  const terms = [
    { term: 'ARP', full: 'Address Resolution Protocol', layer: 'Layer 2', desc: 'Resolves IP addresses to physical MAC hardware addresses on local subnets.' },
    { term: 'CIDR', full: 'Classless Inter-Domain Routing', layer: 'Layer 3', desc: 'Subnet masking notation (e.g., /24) allowing flexible IP address allocation.' },
    { term: 'DNS', full: 'Domain Name System', layer: 'Layer 7', desc: 'Translates human-friendly domain names (netvision.edu) into IP addresses (172.16.0.5).' },
    { term: 'ICMP', full: 'Internet Control Message Protocol', layer: 'Layer 3', desc: 'Network diagnostics protocol used by Ping and Traceroute commands.' },
    { term: 'NAT', full: 'Network Address Translation', layer: 'Layer 3', desc: 'Translates private internal IP addresses to public internet IP addresses.' },
    { term: 'OSPF', full: 'Open Shortest Path First', layer: 'Layer 3', desc: 'Link-state interior gateway routing protocol for enterprise networks.' },
    { term: 'STP', full: 'Spanning Tree Protocol', layer: 'Layer 2', desc: '802.1D switch protocol preventing Layer 2 loops in redundant network topologies.' },
    { term: 'TCP', full: 'Transmission Control Protocol', layer: 'Layer 4', desc: 'Connection-oriented protocol providing reliable, ordered packet delivery.' },
    { term: 'VLAN', full: 'Virtual Local Area Network', layer: 'Layer 2', desc: 'Logical grouping of network devices isolating broadcast domains on switches.' },
  ];

  const filtered = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.full.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                    Networking Dictionary
                  </span>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">
                    Interactive Networking Glossary
                  </h1>
                </div>

                <div className="w-full md:w-80">
                  <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-extrabold text-[#00f0ff] font-mono">{item.term}</span>
                      <Badge variant="cyan">{item.layer}</Badge>
                    </div>
                    <h3 className="text-xs font-bold text-white mb-2">{item.full}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
