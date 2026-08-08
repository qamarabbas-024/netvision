'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, ArrowLeft, Server, Database, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function ArchitectureDocPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-8 bg-net-grid-pattern">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-[#272732] pb-6">
          <Link href="/docs" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Documentation
          </Link>
          <span className="text-xs font-mono text-[#00f0ff] uppercase font-semibold">Technical Architecture</span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Cpu className="w-8 h-8 text-[#00f0ff]" /> NetVision Platform Architecture Specification
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            Detailed overview of NetVision's monorepo structure, NestJS backend, Prisma ORM PostgreSQL database layer, secure authentication, and RBAC authorization boundary.
          </p>
        </div>

        <Card className="p-8 glass-panel border-[#272732] flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-[#00f0ff]" /> 1. Monorepo Architecture & Tech Stack
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              NetVision is built as a TurboRepo PNPM monorepo with strict package boundaries:
            </p>
            <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 font-mono">
              <li>Frontend: Next.js App Router, Tailwind CSS, Lucide icons, Zustand state management.</li>
              <li>Backend: NestJS framework, Prisma ORM, Argon2 password hashing, Passport JWT authentication.</li>
              <li>Database: PostgreSQL with ACID persistence for user progress, quiz attempts, and saved lessons.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3 pt-6 border-t border-[#272732]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" /> 2. Authentication & Verification
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Security is enforced at the backend boundary:
            </p>
            <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
              <li><strong>Passowrd Security:</strong> All user passwords are hashed using Argon2id prior to database storage.</li>
              <li><strong>Email OTP:</strong> 6-digit numeric OTP is generated, hashed, and dispatched via EmailService with a 10-minute expiration.</li>
              <li><strong>Password Reset:</strong> Cryptographically generated single-use tokens hashed with SHA-256 and bound to a 15-minute window.</li>
              <li><strong>Role-Based Access Control (RBAC):</strong> Admin routes are secured with NestJS Guards (`JwtAuthGuard`, `RolesGuard`) checking DB roles directly.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3 pt-6 border-t border-[#272732]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" /> 3. Data Schema & Persistence Models
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              User progress, completed lessons, quiz scores, and saved bookmarks are persisted in PostgreSQL tables (`user_progress`, `quiz_attempts`, `saved_lessons`) and synchronized dynamically upon authentication.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
