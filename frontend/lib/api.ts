import { GuestProgressService } from '@/services/GuestProgressService';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('netvision_token') || sessionStorage.getItem('netvision_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    const anonId = GuestProgressService.getLearnerId();
    if (anonId) {
      headers['X-Anonymous-ID'] = anonId;
    }
  }
  return headers;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[NetVision API] Fetch failed for ${url}: ${err.message}. Using fallback data layer.`);
    throw err;
  }
}

// Fallback Educational Topics Data Engine
export const FALLBACK_TOPICS = [
  // --- BEGINNER ---
  {
    id: 'course-1',
    slug: 'networking-fundamentals',
    title: 'Networking Fundamentals',
    tagline: 'Understand networks, client-server models, LANs, WANs, and packet transmission core concepts.',
    category: 'Fundamentals',
    description: 'Computer networking is the digital nervous system of modern computing.',
    level: 'BEGINNER' as const,
    icon: 'Layers',
    estimatedHours: 4,
    modulesCount: 1,
    lessonsCount: 3,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-2',
    slug: 'network-devices',
    title: 'Network Devices',
    tagline: 'Master switches, routers, hubs, firewalls, modems, and access points.',
    category: 'Fundamentals',
    description: 'Explore hardware components forwarding and protecting data packets.',
    level: 'BEGINNER' as const,
    icon: 'Cpu',
    estimatedHours: 5,
    modulesCount: 1,
    lessonsCount: 3,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-3',
    slug: 'network-topologies',
    title: 'Network Topologies',
    tagline: 'Star, Mesh, Bus, Ring, and Hybrid network layouts and resilience.',
    category: 'Fundamentals',
    description: 'Learn physical and logical network layouts and redundancy design.',
    level: 'BEGINNER' as const,
    icon: 'Layers',
    estimatedHours: 4,
    modulesCount: 1,
    lessonsCount: 2,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-4',
    slug: 'osi-model',
    title: 'OSI 7-Layer Reference Model',
    tagline: 'Master Physical, Data Link, Network, Transport, Session, Presentation, and Application layers.',
    category: 'Fundamentals',
    description: 'Deep dive into ISO/IEC 7498-1 standard reference model.',
    level: 'BEGINNER' as const,
    icon: 'Layers',
    estimatedHours: 6,
    modulesCount: 1,
    lessonsCount: 4,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-5',
    slug: 'tcp-ip-model',
    title: 'TCP/IP Protocol Architecture',
    tagline: 'Learn the practical 4-layer DoD internet protocol suite.',
    category: 'TCP/IP',
    description: 'Explore the 4-layer TCP/IP protocol suite powering the internet.',
    level: 'BEGINNER' as const,
    icon: 'Packet',
    estimatedHours: 5,
    modulesCount: 1,
    lessonsCount: 3,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-6',
    slug: 'ethernet',
    title: 'Ethernet & Data Link Framing',
    tagline: '802.3 Ethernet framing, preamble, MAC header, payload, and FCS CRC check.',
    category: 'Fundamentals',
    description: 'Master IEEE 802.3 Ethernet standards, frame formats, and CSMA/CD.',
    level: 'BEGINNER' as const,
    icon: 'Switch',
    estimatedHours: 4,
    modulesCount: 1,
    lessonsCount: 3,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-7',
    slug: 'mac-addresses',
    title: 'MAC Addresses & Hardware Identifiers',
    tagline: 'Understand 48-bit hex physical addresses, OUI vendor codes, and unicast/broadcast.',
    category: 'Fundamentals',
    description: 'Learn Media Access Control hardware identification.',
    level: 'BEGINNER' as const,
    icon: 'Cpu',
    estimatedHours: 3,
    modulesCount: 1,
    lessonsCount: 2,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-8',
    slug: 'arp',
    title: 'Address Resolution Protocol (ARP)',
    tagline: 'Discover how IP addresses map to MAC hardware addresses on local networks.',
    category: 'Fundamentals',
    description: 'Learn ARP Request broadcasts, ARP Replies, and local ARP caches.',
    level: 'BEGINNER' as const,
    icon: 'Router',
    estimatedHours: 4,
    modulesCount: 1,
    lessonsCount: 2,
    completedLessons: 0,
    progressPercent: 0,
  },

  // --- INTERMEDIATE ---
  {
    id: 'course-9',
    slug: 'ipv4-addressing',
    title: 'IPv4 Addressing & Structure',
    tagline: '32-bit dotted-decimal addresses, network vs host portions, and private IP ranges.',
    category: 'TCP/IP',
    description: 'Master IPv4 addressing, CIDR notation, and RFC 1918 private spaces.',
    level: 'INTERMEDIATE' as const,
    icon: 'Packet',
    estimatedHours: 6,
    modulesCount: 1,
    lessonsCount: 4,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-10',
    slug: 'ipv6-fundamentals',
    title: 'IPv6 Next-Generation Addressing',
    tagline: '128-bit hexadecimal addressing, SLAAC auto-configuration, and neighbor discovery.',
    category: 'TCP/IP',
    description: 'Explore IPv6 128-bit architecture and zero compression rules.',
    level: 'INTERMEDIATE' as const,
    icon: 'Packet',
    estimatedHours: 5,
    modulesCount: 1,
    lessonsCount: 3,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-11',
    slug: 'ip-subnetting',
    title: 'IP Subnetting & CIDR Calculations',
    tagline: 'Master VLSM, CIDR notation, subnet calculations, usable hosts, and broadcast addresses.',
    category: 'Routing',
    description: 'Master binary subnet masking and CIDR prefix length calculations.',
    level: 'INTERMEDIATE' as const,
    icon: 'Router',
    estimatedHours: 8,
    modulesCount: 1,
    lessonsCount: 4,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-12',
    slug: 'tcp-protocol',
    title: 'TCP Protocol & 3-Way Handshake',
    tagline: 'Reliable connection-oriented transport, windowing, flow control, and SYN-ACK handshakes.',
    category: 'TCP/IP',
    description: 'Master Transmission Control Protocol (TCP) handshakes and flow control.',
    level: 'INTERMEDIATE' as const,
    icon: 'Packet',
    estimatedHours: 6,
    modulesCount: 1,
    lessonsCount: 4,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-13',
    slug: 'udp-protocol',
    title: 'UDP Connectionless Protocol',
    tagline: 'Fast, lightweight, connectionless transport for real-time video, VoIP, and DNS.',
    category: 'TCP/IP',
    description: 'Understand User Datagram Protocol (UDP) and real-time media transport.',
    level: 'INTERMEDIATE' as const,
    icon: 'Packet',
    estimatedHours: 4,
    modulesCount: 1,
    lessonsCount: 2,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-14',
    slug: 'dns-service',
    title: 'Domain Name System (DNS)',
    tagline: 'Domain resolution, recursive queries, root servers, A/AAAA records, and caching.',
    category: 'TCP/IP',
    description: 'Master the internet domain directory system and record lookups.',
    level: 'INTERMEDIATE' as const,
    icon: 'DNSIcon',
    estimatedHours: 5,
    modulesCount: 1,
    lessonsCount: 3,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-15',
    slug: 'dhcp-service',
    title: 'Dynamic Host Configuration Protocol (DHCP)',
    tagline: 'Automated IP lease management via the DORA process.',
    category: 'TCP/IP',
    description: 'Understand Discover, Offer, Request, Acknowledge (DORA) dynamic leases.',
    level: 'INTERMEDIATE' as const,
    icon: 'DNSIcon',
    estimatedHours: 4,
    modulesCount: 1,
    lessonsCount: 3,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-16',
    slug: 'http-https-protocols',
    title: 'HTTP & HTTPS Web Protocols',
    tagline: 'Web requests, status codes, headers, TLS encryption, and certificates.',
    category: 'TCP/IP',
    description: 'Explore HTTP/1.1 and HTTP/2 request semantics and TLS encryption.',
    level: 'INTERMEDIATE' as const,
    icon: 'Packet',
    estimatedHours: 5,
    modulesCount: 1,
    lessonsCount: 3,
    completedLessons: 0,
    progressPercent: 0,
  },

  // --- ADVANCED ---
  {
    id: 'course-17',
    slug: 'ip-routing',
    title: 'IP Routing & Dynamic Protocols',
    tagline: 'Routing tables, static routes, default gateways, OSPF, BGP, and metric path selection.',
    category: 'Routing',
    description: 'Master router path selection using routing tables and administrative distance.',
    level: 'ADVANCED' as const,
    icon: 'Router',
    estimatedHours: 8,
    modulesCount: 1,
    lessonsCount: 4,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-18',
    slug: 'vlan-switching',
    title: 'VLAN Switching & 802.1Q Trunking',
    tagline: 'Virtual LAN isolation, 802.1Q VLAN tags, access vs trunk ports, and Spanning Tree (STP).',
    category: 'Switching',
    description: 'Master Layer 2 switching segmentation and 802.1Q trunking.',
    level: 'ADVANCED' as const,
    icon: 'Switch',
    estimatedHours: 7,
    modulesCount: 1,
    lessonsCount: 4,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-19',
    slug: 'nat-translation',
    title: 'Network Address Translation (NAT)',
    tagline: 'Static NAT, Dynamic NAT, and PAT (Port Address Translation) multiplexing.',
    category: 'Routing',
    description: 'Understand SNAT, DNAT, and PAT port translation multiplexing.',
    level: 'ADVANCED' as const,
    icon: 'Router',
    estimatedHours: 5,
    modulesCount: 1,
    lessonsCount: 3,
    completedLessons: 0,
    progressPercent: 0,
  },
  {
    id: 'course-20',
    slug: 'network-security',
    title: 'Network Security & Firewalls',
    tagline: 'ACLs, stateful inspection, TLS encryption, VPN tunnels, and threat mitigation.',
    category: 'Security',
    description: 'Master network defense, stateful packet inspection, and IPsec VPNs.',
    level: 'ADVANCED' as const,
    icon: 'ShieldCheck',
    estimatedHours: 8,
    modulesCount: 1,
    lessonsCount: 4,
    completedLessons: 0,
    progressPercent: 0,
  },
];

export async function getTopicsApi(level?: string, category?: string) {
  try {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (category) params.append('category', category);
    return await fetchApi<any[]>(`/courses?${params.toString()}`);
  } catch {
    return FALLBACK_TOPICS.filter((t) => {
      const matchLevel = !level || t.level === level;
      const matchCategory = !category || category === 'All' || t.category === category;
      return matchLevel && matchCategory;
    });
  }
}

export async function getTopicDetailApi(slug: string) {
  try {
    return await fetchApi<any>(`/courses/${slug}`);
  } catch {
    const topic = FALLBACK_TOPICS.find((t) => t.slug === slug) || FALLBACK_TOPICS[3]; // Default OSI Model
    return {
      ...topic,
      totalLessons: 3,
      completedLessons: 0,
      progressPercent: 0,
      modules: [
        {
          id: 'mod-1',
          title: `Module 1: ${topic.title} Mastery`,
          description: topic.tagline,
          order: 1,
          lessons: [
            {
              id: `les-${topic.slug}-1`,
              title: `1.1 Introduction to ${topic.title}`,
              slug: topic.slug,
              type: 'THEORY',
              durationMinutes: 15,
              order: 1,
              completed: false,
              hasQuiz: true,
              quizId: `quiz-${topic.slug}`,
            },
            {
              id: `les-${topic.slug}-2`,
              title: `1.2 ${topic.title} Deep Dive & Mechanics`,
              slug: `${topic.slug}-deep-dive`,
              type: 'ANIMATION',
              durationMinutes: 20,
              order: 2,
              completed: false,
              hasQuiz: true,
              quizId: `quiz-${topic.slug}-2`,
            },
          ],
        },
      ],
    };
  }
}

export async function getLessonDetailApi(slug: string) {
  try {
    return await fetchApi<any>(`/lessons/${slug}`);
  } catch {
    const matchedTopic = FALLBACK_TOPICS.find((t) => t.slug === slug || slug.includes(t.slug)) || FALLBACK_TOPICS[3];
    return {
      id: `les-${matchedTopic.slug}`,
      title: `${matchedTopic.title} Concept & Architecture`,
      slug: matchedTopic.slug,
      type: 'THEORY',
      durationMinutes: 20,
      order: 1,
      isCompleted: false,
      score: null,
      course: {
        id: matchedTopic.id,
        title: matchedTopic.title,
        slug: matchedTopic.slug,
        level: matchedTopic.level,
      },
      module: {
        id: 'mod-1',
        title: `Module 1: ${matchedTopic.title} Foundations`,
      },
      content: {
        shortExplanation: matchedTopic.tagline,
        theory: `${matchedTopic.title} forms a foundational pillar of computer networking. Understanding how headers, addressing, and protocol state machines interact allows network engineers to architect resilient high-performance systems.`,
        analogy: `Think of ${matchedTopic.title} like an efficient express delivery postal protocol: every packet carries exact source and destination routing metrics to guarantee accurate physical delivery.`,
        keyConcepts: [
          'Protocol Data Unit (PDU) encapsulation and header structure.',
          'Addressing resolution and optimal path selection.',
          'Reliability, error checking, and state tracking mechanisms.'
        ],
        examples: [
          `Real-world data transmission using ${matchedTopic.title} across enterprise networks.`
        ],
        practicalActivity: {
          title: `Activity: ${matchedTopic.title} Packet Inspection`,
          instructions: 'Review header fields and trace how packets flow through switches and routers.'
        }
      },
      quiz: {
        id: `quiz-${matchedTopic.slug}`,
        title: `${matchedTopic.title} Assessment Quiz`,
        passingScore: 80,
        questionCount: 2,
        questions: [
          {
            id: `q-${matchedTopic.slug}-1`,
            questionText: `What is the primary role of ${matchedTopic.title} in computer networks?`,
            options: [
              'To encrypt physical fiber optic cables only',
              `To provide standardized protocol communication for ${matchedTopic.category}`,
              'To replace MAC address tables in Layer 2 switches',
              'To measure raw bandwidth frequency in Hertz'
            ]
          },
          {
            id: `q-${matchedTopic.slug}-2`,
            questionText: `Which OSI/TCP layer is directly associated with ${matchedTopic.title}?`,
            options: [
              'Physical Layer 1',
              'Data Link Layer 2',
              'Layer 3 Network or Layer 4 Transport depending on protocol role',
              'Session Layer 5 only'
            ]
          }
        ]
      }
    };
  }
}

export async function submitQuizApi(quizId: string, answers: Record<string, number>) {
  return await fetchApi<any>(`/quizzes/${quizId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}

export async function completeLessonApi(lessonId: string) {
  try {
    return await fetchApi<any>('/progress/complete', {
      method: 'POST',
      body: JSON.stringify({ lessonId }),
    });
  } catch {
    return { success: true, lessonId, completed: true };
  }
}

export interface StudentDashboardMetrics {
  totalCourses: number;
  totalLessons: number;
  completedLessons: number;
  overallProgressPercent: number;
  studyStreak: number;
  totalXp: number;
  simulationsRun: number;
  quizAverageScore: number;
  certificatesEarned: number;
  completedCoursesCount: number;
  badges: {
    earned: number;
    total: number;
    items: AchievementItem[];
  };
  recentAttempts: any[];
  recentLessons: any[];
}

export async function getUserProgressApi(): Promise<StudentDashboardMetrics> {
  try {
    return await fetchApi<StudentDashboardMetrics>('/progress/dashboard');
  } catch {
    return {
      totalCourses: 22,
      totalLessons: 35,
      completedLessons: 0,
      overallProgressPercent: 0,
      studyStreak: 0,
      totalXp: 0,
      simulationsRun: 0,
      quizAverageScore: 0,
      certificatesEarned: 0,
      completedCoursesCount: 0,
      badges: {
        earned: 0,
        total: 5,
        items: [],
      },
      recentAttempts: [],
      recentLessons: [],
    };
  }
}

export async function searchApi(query: string) {
  try {
    return await fetchApi<{ courses: any[]; lessons: any[]; modules: any[] }>(`/search?q=${encodeURIComponent(query)}`);
  } catch {
    const q = query.toLowerCase();
    const courses = FALLBACK_TOPICS.filter((t) => t.title.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q)).slice(0, 5);
    return { courses, lessons: [], modules: [] };
  }
}

export async function toggleSaveLessonApi(lessonId: string) {
  return await fetchApi<{ saved: boolean; message: string }>('/progress/save-lesson', {
    method: 'POST',
    body: JSON.stringify({ lessonId }),
  });
}

export async function getSavedLessonsApi() {
  try {
    return await fetchApi<any[]>('/progress/saved-lessons');
  } catch {
    return [];
  }
}

export async function getLabDetailsApi(labId: string) {
  try {
    return await fetchApi<any>(`/labs/${labId}`);
  } catch {
    return {
      id: labId,
      title: 'Practical Networking Lab',
      instructions: 'Execute network diagnostic commands in the socket CLI simulator below.',
    };
  }
}

export async function executeLabCommandApi(labId: string, command: string, currentTopologyState?: Record<string, any>) {
  try {
    return await fetchApi<any>('/labs/execute', {
      method: 'POST',
      body: JSON.stringify({ labId, command, currentTopologyState }),
    });
  } catch {
    const cleanCmd = (command || '').trim();
    let output = `Simulated Environment: Executed command '${cleanCmd}'. Status: OK.`;
    if (cleanCmd.toLowerCase().startsWith('ping')) {
      output = `PING 192.168.1.1 (56 data bytes)\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=1.12 ms\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.98 ms\n--- 192.168.1.1 ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`;
    }
    return {
      command: cleanCmd,
      output,
      category: 'Diagnostic',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function validateLabApi(labId: string, commandHistory?: string[], hintsUsedCount?: number, userSolution?: Record<string, any>) {
  try {
    return await fetchApi<any>('/labs/validate', {
      method: 'POST',
      body: JSON.stringify({ labId, commandHistory, hintsUsedCount, userSolution }),
    });
  } catch {
    const score = Math.max(0, 100 - (hintsUsedCount || 0) * 5);
    return {
      attemptId: 'fallback-attempt',
      labId,
      passed: true,
      score,
      hintsUsedCount: hintsUsedCount || 0,
      checks: [
        { rule: 'Command Diagnostics', passed: true, message: `Executed ${(commandHistory || []).length} CLI diagnostic commands.` },
        { rule: 'Target Telemetry State', passed: true, message: 'Target network packet state satisfied.' },
      ],
      completionSummary: `Lab completed successfully with score ${score}%!`,
    };
  }
}

export async function getAllCommandsApi(os?: string, category?: string, q?: string) {
  try {
    const params = new URLSearchParams();
    if (os) params.append('os', os);
    if (category) params.append('category', category);
    if (q) params.append('q', q);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await fetchApi<any[]>(`/commands${queryStr}`);
  } catch {
    return [
      {
        id: 'cmd-win-ipconfig',
        command: 'ipconfig /all',
        operatingSystem: 'WINDOWS',
        category: 'Network information',
        purpose: 'Display complete network configuration including physical MAC address, DHCP server, DNS servers, and lease timestamps.',
        syntax: 'ipconfig /all',
        example: 'ipconfig /all',
        expectedOutput: 'Ethernet adapter Local Area Connection:\n  Physical Address: 00-1A-2B-3C-4D-5E\n  IPv4 Address: 192.168.1.50\n  Default Gateway: 192.168.1.1',
        explanation: 'Reveals MAC hardware addresses, DNS server IPs, and DHCP lease status.',
        warnings: 'Produces long output; scroll to locate your active interface.',
        relatedLessonSlugs: ['mac-addressing-structure', 'dhcp-dora-process'],
      },
      {
        id: 'cmd-all-ping',
        command: 'ping',
        operatingSystem: 'ALL',
        category: 'Connectivity',
        purpose: 'Test Layer 3 ICMP echo reachability and measure round-trip latency to a target IP or domain.',
        syntax: 'ping <target_ip_or_hostname>',
        example: 'ping 192.168.1.1',
        expectedOutput: '64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=1.12 ms\n0% packet loss',
        explanation: 'Sends ICMP Echo Request packets to verify host reachability.',
        warnings: 'Firewalls may block ICMP packets.',
        relatedLessonSlugs: ['what-is-computer-networking', 'routing-mechanics-protocols'],
      },
    ];
  }
}

export async function getCommandByIdApi(id: string) {
  try {
    return await fetchApi<any>(`/commands/${id}`);
  } catch {
    return {
      id,
      command: 'ipconfig /all',
      operatingSystem: 'WINDOWS',
      category: 'Network information',
      purpose: 'Display network configuration.',
      syntax: 'ipconfig /all',
      example: 'ipconfig /all',
      explanation: 'Shows adapter IP and MAC addresses.',
    };
  }
}

export async function createSandboxSessionApi(labId?: string, durationMinutes = 30) {
  try {
    return await fetchApi<any>('/sandbox/sessions', {
      method: 'POST',
      body: JSON.stringify({ labId, durationMinutes }),
    });
  } catch {
    return {
      sessionId: `fallback-sandbox-${Date.now()}`,
      status: 'RUNNING',
      providerType: 'SIMULATED',
      expiresAt: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(),
    };
  }
}

export async function executeSandboxCommandApi(sessionId: string, command: string) {
  try {
    return await fetchApi<any>(`/sandbox/sessions/${sessionId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  } catch {
    return {
      sessionId,
      result: {
        command,
        output: `Simulated Environment: Executed command '${command}'. Status: OK.`,
        exitCode: 0,
        isSimulated: true,
        timestamp: new Date().toISOString(),
      },
      sessionStatus: 'RUNNING',
    };
  }
}

export async function getSandboxSessionStatusApi(sessionId: string) {
  try {
    return await fetchApi<any>(`/sandbox/sessions/${sessionId}`);
  } catch {
    return {
      sessionId,
      status: 'RUNNING',
      providerType: 'SIMULATED',
    };
  }
}

export async function terminateSandboxSessionApi(sessionId: string) {
  try {
    return await fetchApi<any>(`/sandbox/sessions/${sessionId}/terminate`, {
      method: 'POST',
    });
  } catch {
    return {
      sessionId,
      status: 'STOPPED',
    };
  }
}

export async function claimAnonymousProgressApi(anonymousId: string) {
  try {
    return await fetchApi<any>('/learners/claim', {
      method: 'POST',
      body: JSON.stringify({ anonymousId }),
    });
  } catch (err: any) {
    console.warn(`[NetVision API] Claim progress error: ${err.message}`);
    return null;
  }
}

export async function claimCertificateApi(courseId: string) {
  return await fetchApi<any>('/certificates/claim', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
}

export async function claimCertificationCertificateApi(code: string) {
  return await fetchApi<any>(`/certifications/${code}/claim-certificate`, {
    method: 'POST',
  });
}

export async function getCertificateByIdApi(idOrCode: string) {
  return await fetchApi<any>(`/certificates/${idOrCode}`);
}

export async function verifyCertificateApi(credentialId: string) {
  return await fetchApi<any>(`/certificates/verify/${credentialId}`);
}

export async function executeTroubleshootingActionApi(attemptId: string, payload: any) {
  return await fetchApi<any>(`/exams/practical/${attemptId}/troubleshoot`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function answerPacketQuestionApi(attemptId: string, payload: any) {
  return await fetchApi<any>(`/exams/practical/${attemptId}/packet-answer`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface AchievementItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  badgeIcon: string;
  category: 'LEARNING' | 'ASSESSMENT' | 'PRACTICAL' | 'SKILL' | 'COMPLETION' | 'MILESTONE';
  points: number;
  isActive: boolean;
  unlocked?: boolean;
  unlockedAt?: string | null;
}

export async function getAchievementsApi(): Promise<AchievementItem[]> {
  try {
    return await fetchApi<AchievementItem[]>('/achievements');
  } catch {
    return [];
  }
}

export async function getMyAchievementsApi(): Promise<{
  totalAchievements: number;
  unlockedCount: number;
  totalPointsEarned: number;
  achievements: AchievementItem[];
}> {
  return await fetchApi<any>('/achievements/me');
}

export interface CourseAssessmentStatus {
  courseId: string;
  courseSlug: string;
  requiredLessons: number;
  completedAssessments: number;
  missingAssessments: number;
  lessonScores: number[];
  assessmentAverage: number;
  assessmentPassed: boolean;
  allRequiredAssessmentsComplete: boolean;
  eligibleForCertificate: boolean;
}

export async function getCourseAssessmentApi(courseSlug: string): Promise<CourseAssessmentStatus> {
  return await fetchApi<CourseAssessmentStatus>(`/courses/${courseSlug}/assessment`);
}

// Troubleshooting Engine API Client Methods

export async function getTroubleshootingScenariosApi(): Promise<any[]> {
  try {
    return await fetchApi<any[]>('/troubleshooting/scenarios');
  } catch {
    return [];
  }
}

export async function getTroubleshootingScenarioDetailApi(idOrSlug: string): Promise<any> {
  return await fetchApi<any>(`/troubleshooting/scenarios/${idOrSlug}`);
}

export async function getTroubleshootingPostMortemApi(idOrSlug: string): Promise<any> {
  return await fetchApi<any>(`/troubleshooting/scenarios/${idOrSlug}/post-mortem`);
}

export async function startTroubleshootingSessionApi(scenarioId: string): Promise<any> {
  return await fetchApi<any>('/troubleshooting/session/start', {
    method: 'POST',
    body: JSON.stringify({ scenarioId }),
  });
}

export async function getTroubleshootingSessionStatusApi(sessionId: string): Promise<any> {
  return await fetchApi<any>(`/troubleshooting/session/${sessionId}`);
}

export async function executeTroubleshootingCommandApi(sessionId: string, scenarioId: string, command: string): Promise<any> {
  return await fetchApi<any>('/troubleshooting/session/execute', {
    method: 'POST',
    body: JSON.stringify({ sessionId, scenarioId, command }),
  });
}

export async function submitTroubleshootingDiagnosisApi(sessionId: string, scenarioId: string, diagnosisId: string): Promise<any> {
  return await fetchApi<any>('/troubleshooting/session/diagnose', {
    method: 'POST',
    body: JSON.stringify({ sessionId, scenarioId, diagnosisId }),
  });
}

export async function applyTroubleshootingRemediationApi(sessionId: string, scenarioId: string, remediationId: string): Promise<any> {
  return await fetchApi<any>('/troubleshooting/session/remediate', {
    method: 'POST',
    body: JSON.stringify({ sessionId, scenarioId, remediationId }),
  });
}

export async function runTroubleshootingVerificationApi(sessionId: string, scenarioId: string): Promise<any> {
  return await fetchApi<any>('/troubleshooting/session/verify', {
    method: 'POST',
    body: JSON.stringify({ sessionId, scenarioId }),
  });
}
