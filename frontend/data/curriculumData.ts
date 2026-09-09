import { FLAGSHIP_5_COURSES } from '@netvision/shared';

export interface CurriculumStep {
  stepNumber: string;
  code: string;
  title: string;
  summary: string;
  topics: string[];
  duration: string;
  labsCount: number;
  isLocked?: boolean;
}

export const CURRICULUM_STEPS: CurriculumStep[] = [
  ...FLAGSHIP_5_COURSES.map((course, idx) => ({
    stepNumber: `0${idx + 1}`,
    code: course.code,
    title: course.title,
    summary: course.tagline,
    topics: course.modules.map((m) => m.title),
    duration: `${course.estimatedHours} Hours`,
    labsCount: course.modules.length * 3,
    isLocked: false,
  })),
  {
    stepNumber: '06',
    code: 'NV-NET-MASTERY',
    title: 'Master Network Engineering Credential',
    summary: 'Master Capstone Examination & Practical Multi-Layer Verification',
    topics: [
      'Comprehensive 120-minute timed capstone exam',
      'Enterprise multi-layer datacenter incident recovery',
      'Wireshark packet capture stream dissection',
      'Cryptographically verified public credential ledger',
    ],
    duration: '120-Min Exam',
    labsCount: 1,
    isLocked: false,
  },
];

export const FEATURE_HIGHLIGHTS = [
  {
    id: 'packet-vis',
    title: 'Live Packet Visualization',
    description: 'Watch DNS, TCP, ICMP and more in real-time 3D.',
    iconName: 'Box',
    gradient: 'from-cyan-500/20 to-emerald-500/20',
  },
  {
    id: 'sandbox-lab',
    title: 'Interactive Sandbox Lab',
    description: 'Build, break and fix networks in a drag & drop environment.',
    iconName: 'Network',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 'cli-terminal',
    title: 'Real CLI Experience',
    description: 'Run real commands inside the built-in terminal.',
    iconName: 'Terminal',
    gradient: 'from-teal-500/20 to-blue-500/20',
  },
  {
    id: 'troubleshoot',
    title: 'Network Troubleshooting',
    description: 'Diagnose real-world issues with guided scenarios.',
    iconName: 'Wrench',
    gradient: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    id: 'certification',
    title: 'Industry Certifications',
    description: 'Earn verifiable certificates and boost your career.',
    iconName: 'Award',
    gradient: 'from-indigo-500/20 to-cyan-500/20',
  },
];
