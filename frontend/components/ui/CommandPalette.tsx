'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  Terminal,
  Activity,
  Award,
  ShieldCheck,
  Zap,
  Layers,
  FileText,
  Bookmark,
  Compass,
  ArrowRight,
  X,
  Command,
} from 'lucide-react';
import { Badge } from './Badge';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Course' | 'Lesson' | 'Tool' | 'Command' | 'Docs';
  url: string;
  icon: React.ReactNode;
  tags?: string[];
}

const STATIC_REGISTRY: SearchItem[] = [
  // Core Tools
  {
    id: 'tool-sim',
    title: 'Protocol Simulation Studio',
    subtitle: 'Interactive TCP, DNS, ARP, and packet visualizer',
    category: 'Tool',
    url: '/simulations',
    icon: <Activity className="w-4 h-4 text-[#00f0ff]" />,
    tags: ['simulator', 'packet', 'visualizer', 'tcp', 'dns'],
  },
  {
    id: 'tool-sandbox',
    title: 'Deterministic CLI Sandbox',
    subtitle: 'Safe Linux and virtual network command environment',
    category: 'Tool',
    url: '/sandbox',
    icon: <Terminal className="w-4 h-4 text-emerald-400" />,
    tags: ['terminal', 'cli', 'bash', 'ping', 'sandbox'],
  },
  {
    id: 'tool-troubleshoot',
    title: 'Incident Troubleshooting Scenarios',
    subtitle: 'Real-world network outage diagnosis and post-mortems',
    category: 'Tool',
    url: '/troubleshooting',
    icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
    tags: ['incident', 'outage', 'sre', 'postmortem', 'fix'],
  },
  {
    id: 'tool-certs',
    title: 'Certifications & Cryptographic Credentials',
    subtitle: 'Official NetVision professional certifications & exams',
    category: 'Tool',
    url: '/certificates',
    icon: <Award className="w-4 h-4 text-purple-400" />,
    tags: ['cert', 'exam', 'nv-net', 'credential', 'pdf'],
  },
  {
    id: 'tool-commands',
    title: 'Networking Command Cheatsheet',
    subtitle: 'Syntax, examples, and expected output for Win/Linux/macOS',
    category: 'Tool',
    url: '/commands',
    icon: <Terminal className="w-4 h-4 text-cyan-400" />,
    tags: ['cheatsheet', 'ipconfig', 'ifconfig', 'ping', 'tracert', 'tcpdump'],
  },
  {
    id: 'tool-flashcards',
    title: 'Spaced Repetition Flashcards',
    subtitle: 'Port numbers, protocol definitions, and acronym drills',
    category: 'Tool',
    url: '/flashcards',
    icon: <Bookmark className="w-4 h-4 text-blue-400" />,
    tags: ['flashcard', 'drill', 'ports', 'protocols'],
  },
  {
    id: 'tool-glossary',
    title: 'Networking Terminology Glossary',
    subtitle: 'Definitions and layer classifications for all network terms',
    category: 'Tool',
    url: '/glossary',
    icon: <Compass className="w-4 h-4 text-indigo-400" />,
    tags: ['dictionary', 'terms', 'definitions', 'glossary'],
  },

  // Canonical Courses
  {
    id: 'course-net-101',
    title: 'NET-101: Computer & Digital Information Foundations',
    subtitle: 'Bits, bytes, binary arithmetic, and physical signals',
    category: 'Course',
    url: '/courses/net-101-digital-foundations',
    icon: <BookOpen className="w-4 h-4 text-[#00f0ff]" />,
    tags: ['net101', 'foundations', 'binary', 'hex', 'signals'],
  },
  {
    id: 'course-net-201',
    title: 'NET-201: Layer 2 Ethernet, Switching & Architecture',
    subtitle: 'Ethernet framing, MAC learning, CAM tables, and VLANs',
    category: 'Course',
    url: '/courses/net-201-layer2-ethernet',
    icon: <Layers className="w-4 h-4 text-emerald-400" />,
    tags: ['net201', 'ethernet', 'mac', 'switch', 'vlan', 'cam'],
  },
  {
    id: 'course-net-202',
    title: 'NET-202: IPv4 Addressing, VLSM & Subnetting Mechanics',
    subtitle: 'Classful, CIDR prefix mathematics, and subnets',
    category: 'Course',
    url: '/courses/net-202-ipv4-subnetting',
    icon: <Zap className="w-4 h-4 text-cyan-400" />,
    tags: ['net202', 'ipv4', 'subnetting', 'cidr', 'vlsm'],
  },
  {
    id: 'course-net-204',
    title: 'NET-204: Transport Layer TCP, UDP & Stateful Handshakes',
    subtitle: 'TCP 3-way handshake, sequence numbers, and sockets',
    category: 'Course',
    url: '/courses/net-204-tcp-udp-transport',
    icon: <Activity className="w-4 h-4 text-amber-400" />,
    tags: ['net204', 'tcp', 'udp', 'handshake', 'syn', 'ack'],
  },
  {
    id: 'course-net-303',
    title: 'NET-303: Routing Fundamentals & OSPF Operations',
    subtitle: 'Interior gateway protocols, LSA types, and routing tables',
    category: 'Course',
    url: '/courses/net-303-routing-fundamentals',
    icon: <Compass className="w-4 h-4 text-purple-400" />,
    tags: ['net303', 'routing', 'ospf', 'lsa', 'router'],
  },
  {
    id: 'course-net-404',
    title: 'NET-404: Enterprise Network Troubleshooting & Post-Mortems',
    subtitle: 'Systematic diagnosis, MTU bugs, and incident remediation',
    category: 'Course',
    url: '/courses/net-404-network-troubleshooting',
    icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
    tags: ['net404', 'troubleshooting', 'diagnostics', 'wireshark'],
  },

  // Documentation
  {
    id: 'doc-arch',
    title: 'Platform Architecture & Protocol Specifications',
    subtitle: 'System blueprints, deterministic models, and data structures',
    category: 'Docs',
    url: '/docs/architecture',
    icon: <FileText className="w-4 h-4 text-zinc-400" />,
    tags: ['architecture', 'docs', 'spec', 'design'],
  },
  {
    id: 'doc-pedagogy',
    title: 'Seven-Stage Pedagogy Blueprint',
    subtitle: 'The cognitive learning methodology behind NetVision',
    category: 'Docs',
    url: '/docs/pedagogy-blueprint',
    icon: <FileText className="w-4 h-4 text-zinc-400" />,
    tags: ['pedagogy', 'methodology', 'learning', 'blueprint'],
  },
];

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Filter items
  const filteredItems = query.trim()
    ? STATIC_REGISTRY.filter((item) => {
        const q = query.toLowerCase().trim();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
    : STATIC_REGISTRY.slice(0, 10);

  // Keyboard navigation inside list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? (filteredItems.length || 1) - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].url);
      }
    }
  };

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Course':
        return 'cyan';
      case 'Lesson':
        return 'emerald';
      case 'Tool':
        return 'purple';
      case 'Command':
        return 'amber';
      default:
        return 'secondary';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      {/* Overlay backdrop */}
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#0e1117] border border-[#272732] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col font-sans">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#272732] bg-[#121620]">
          <Search className="w-5 h-5 text-[#00f0ff] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search courses, lessons, CLI commands, tools, or docs... (e.g. OSPF, subnet, ping)"
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-medium"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 flex flex-col items-center gap-2">
              <Search className="w-8 h-8 text-zinc-600" />
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-zinc-600">Try searching for &ldquo;subnet&rdquo;, &ldquo;ping&rdquo;, or &ldquo;NET-101&rdquo;</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1b2234] border border-[#00f0ff]/40 shadow-sm'
                      : 'hover:bg-zinc-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          {item.title}
                        </span>
                        <Badge
                          variant={getCategoryBadgeVariant(item.category) as any}
                          className="text-[10px] uppercase font-mono px-1.5 py-0.2 shrink-0"
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-opacity ${
                      isSelected ? 'text-[#00f0ff] opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2 bg-[#090b10] border-t border-[#272732] flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">↵</kbd> Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
};
