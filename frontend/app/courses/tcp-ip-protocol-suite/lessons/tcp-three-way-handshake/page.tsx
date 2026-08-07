'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LessonEngineContainer } from '@/components/learning/LessonEngineContainer';
import { LessonSchema } from '@/types/learning';

const tcpHandshakeLessonData: LessonSchema = {
  id: 'lesson-tcp-handshake-101',
  slug: 'tcp-three-way-handshake',
  courseSlug: 'tcp-ip-protocol-suite',
  title: 'TCP Three-Way Handshake (SYN → SYN-ACK → ACK)',
  blocks: [
    {
      id: 'block-intro',
      type: 'INTRODUCTION',
      tagline: 'Discover how web browsers and servers establish reliable, error-checked connections before transmitting data.',
      level: 'BEGINNER',
      estimatedMinutes: 10,
    },
    {
      id: 'block-objectives',
      type: 'OBJECTIVES',
      objectives: [
        'Understand why TCP requires a 3-way handshake before sending HTTP/HTTPS payload data.',
        'Trace the control flag sequence numbers for SYN, SYN-ACK, and ACK frames.',
        'Inspect Layer 4 TCP headers using the live interactive packet visualizer.',
        'Identify what happens during connection failure cases (SYN floods, refused ports).',
      ],
    },
    {
      id: 'block-theory',
      type: 'THEORY',
      title: 'Why Do We Need a Handshake?',
      contentMarkdown: `Before a web browser can load a website over TCP, both parties must agree to communicate and synchronize sequence numbers.

Think of it like a phone call:
1. **Client**: "Hello, can you hear me?" (SYN)
2. **Server**: "Yes! I can hear you. Can you hear me?" (SYN-ACK)
3. **Client**: "Yes, I hear you loud and clear!" (ACK)

Without this initial handshake, neither side would know if the network wire is working or what starting sequence number to expect for lost packet detection.`,
      codeSnippet: {
        language: 'wireshark-filter',
        code: 'tcp.flags.syn == 1 && tcp.flags.ack == 0  # Filters initial SYN requests',
      },
      keyTakeaway: 'TCP is connection-oriented. Data transfer ONLY begins AFTER the 3-way handshake completes successfully.',
    },
    {
      id: 'block-sim',
      type: 'SIMULATION',
      instruction: 'Click "Dispatch Packet" or "Play" to watch SYN, SYN-ACK, and ACK frames traverse the wire. Click any moving packet to open the Layer 4 Packet Inspector!',
      protocol: 'TCP',
    },
    {
      id: 'block-quiz',
      type: 'QUIZ',
      question: 'Which TCP control flag is sent by the server in response to an initial SYN connection request?',
      options: [
        'ACK (Acknowledgment)',
        'SYN-ACK (Synchronize-Acknowledgment)',
        'FIN (Finish)',
        'RST (Reset Connection)',
      ],
      correctOptionIndex: 1,
      explanation: 'The server responds with SYN-ACK to acknowledge the client SYN request while simultaneously offering its own starting sequence number!',
    },
    {
      id: 'block-summary',
      type: 'SUMMARY',
      xpReward: 150,
      nextLessonSlug: 'tcp-windowing-and-flow-control',
    },
  ],
};

export default function TcpHandshakeLessonPage() {
  return (
    <ProtectedRoute>
      <LessonEngineContainer lesson={tcpHandshakeLessonData} />
    </ProtectedRoute>
  );
}
