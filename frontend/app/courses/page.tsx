'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { SearchInput } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { RouterIcon, SwitchIcon, DNSIcon, PacketIcon } from '@/components/ui/Icons';
import { BookOpen, Clock, Users, ArrowRight, Bookmark, ShieldCheck, Layers } from 'lucide-react';

export default function CourseCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['course-2']);

  const categories = ['All', 'Fundamentals', 'TCP/IP', 'Routing', 'Security', 'Switching'];

  const courses = [
    {
      id: 'course-1',
      slug: 'networking-fundamentals',
      title: 'Computer Networking Fundamentals',
      category: 'Fundamentals',
      level: 'BEGINNER' as const,
      description: 'Master OSI 7 Layers, Ethernet framing, MAC address tables, and physical transmission media.',
      estimatedHours: 6,
      lessonsCount: 14,
      studentsCount: 24500,
      progress: 100,
      icon: <Layers className="w-6 h-6 text-[#00f0ff]" />,
    },
    {
      id: 'course-2',
      slug: 'tcp-ip-protocol-suite',
      title: 'TCP/IP Protocol Suite & Handshakes',
      category: 'TCP/IP',
      level: 'BEGINNER' as const,
      description: 'Deep dive into IPv4/IPv6 packet headers, TCP 3-way handshakes, UDP datagrams, and ICMP Ping.',
      estimatedHours: 8,
      lessonsCount: 16,
      studentsCount: 31200,
      progress: 65,
      icon: <PacketIcon size={24} />,
    },
    {
      id: 'course-3',
      slug: 'ip-subnetting-routing',
      title: 'IP Subnetting & Static Routing',
      category: 'Routing',
      level: 'INTERMEDIATE' as const,
      description: 'Master CIDR subnet calculations, default gateway configurations, and router static routing tables.',
      estimatedHours: 10,
      lessonsCount: 18,
      studentsCount: 19800,
      progress: 0,
      icon: <RouterIcon size={24} />,
    },
    {
      id: 'course-4',
      slug: 'dns-dhcp-core-services',
      title: 'DNS, DHCP & Core Network Services',
      category: 'TCP/IP',
      level: 'INTERMEDIATE' as const,
      description: 'Understand recursive DNS resolution, DHCP IP lease allocations, ARP resolving, and NAT translation.',
      estimatedHours: 7,
      lessonsCount: 15,
      studentsCount: 15400,
      progress: 0,
      icon: <DNSIcon size={24} />,
    },
    {
      id: 'course-5',
      slug: 'cybersecurity-firewalls',
      title: 'Cybersecurity & Stateful Firewalls',
      category: 'Security',
      level: 'ADVANCED' as const,
      description: 'Learn access control lists (ACLs), stateful packet inspection, VPN encrypted tunnels, and DDoS defense.',
      estimatedHours: 12,
      lessonsCount: 20,
      studentsCount: 22100,
      progress: 0,
      icon: <ShieldCheck className="w-6 h-6 text-rose-400" />,
    },
    {
      id: 'course-6',
      slug: 'vlan-switching-stp',
      title: 'VLAN Switching & Spanning Tree',
      category: 'Switching',
      level: 'ADVANCED' as const,
      description: 'Configure 802.1Q VLAN trunks, broadcast domain isolation, STP loop prevention, and Port Security.',
      estimatedHours: 9,
      lessonsCount: 16,
      studentsCount: 12900,
      progress: 0,
      icon: <SwitchIcon size={24} />,
    },
  ];

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarkedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              {/* Catalog Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
                    Interactive Curriculum
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Course Catalog
                  </h1>
                  <p className="text-sm text-zinc-400 mt-1">
                    Select a learning track to master computer networking visually through simulations.
                  </p>
                </div>

                <div className="w-full md:w-80">
                  <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-3 border-b border-[#272732] pb-4 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#00f0ff] text-black shadow-glow-cyan font-bold'
                        : 'bg-[#181820] text-zinc-400 hover:text-white border border-[#272732]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => {
                  const isBookmarked = bookmarkedIds.includes(course.id);
                  return (
                    <Link key={course.id} href={`/courses/${course.slug}`}>
                      <div className="glass-panel p-6 rounded-3xl border border-[#272732] hover:border-[#00f0ff]/40 transition-all flex flex-col justify-between h-full group relative overflow-hidden">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <Badge
                              variant={
                                course.level === 'BEGINNER'
                                  ? 'cyan'
                                  : course.level === 'INTERMEDIATE'
                                  ? 'purple'
                                  : 'rose'
                              }
                            >
                              {course.level}
                            </Badge>

                            <button
                              onClick={(e) => toggleBookmark(course.id, e)}
                              className="text-zinc-500 hover:text-[#00f0ff] transition-colors p-1"
                            >
                              <Bookmark
                                className={`w-5 h-5 ${isBookmarked ? 'text-[#00f0ff] fill-[#00f0ff]' : ''}`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              {course.icon}
                            </div>
                            <h2 className="text-lg font-bold text-white group-hover:text-[#00f0ff] transition-colors leading-snug">
                              {course.title}
                            </h2>
                          </div>

                          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                            {course.description}
                          </p>
                        </div>

                        <div>
                          {course.progress > 0 ? (
                            <Progress value={course.progress} label="Course Progress" className="mb-4" />
                          ) : null}

                          <div className="flex items-center justify-between pt-4 border-t border-[#272732]/60 text-xs text-zinc-500 font-mono mb-4">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{course.lessonsCount} Lessons</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{course.estimatedHours} hrs</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{(course.studentsCount / 1000).toFixed(1)}k</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs font-bold text-[#00f0ff] group-hover:translate-x-1 transition-transform">
                            <span>{course.progress > 0 ? 'Continue Course' : 'Start Course'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
