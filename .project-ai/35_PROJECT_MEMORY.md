# NetVision — Project Memory & Architecture Matrix

## 1. Project Identity & Vision
- **Product Name**: NetVision
- **Tagline**: Learn Networking by Seeing It.
- **Positioning**: Interactive Computer Networking Learning Platform with visual protocol simulation, interactive CLI labs, scenario-based troubleshooting, and cryptographically verifiable certification.
- **Key Guarantee**: 100% Deterministic, server-authoritative learning state with real-time protocol simulation engines and atomic guest-to-account progression claiming.

## 2. Monorepo Architecture & Tech Stack
- **Monorepo Management**: pnpm workspaces with Turborepo task pipeline (`packages/shared`, `packages/simulation-engine`, `packages/ui`, `frontend`, `backend`).
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Zustand state management.
- **Backend**: NestJS, Prisma ORM, PostgreSQL database, Argon2id password hashing, Stateless JWT + Refresh tokens.
- **Simulation Packages**: In-memory deterministic sandbox (`@netvision/simulation-engine`) implementing TCP 3-Way Handshake, CIDR Subnetting, ARP Resolution, DNS Lookup, DHCP Lease, L3 Routing, STP, OSPF, and Firewall packet inspection.

## 3. Curriculum & Learning Engines
- **Progressive Courses**: NET-101 through NET-404 spanning Levels 0 to 4 (Digital Foundations to Advanced Edge & Forensics).
- **Multi-Modal Lessons**: Concepts explained via Analogy, Simple Mental Model, In-Depth Technical Specification, and Practical Cheatsheet.
- **Interactive Instruments**: 20+ Protocol simulation engines, live packet flow visualizers, CIDR sliders, and bitwise calculators.
- **Guided CLI Labs & Scenarios**: 38+ Guided terminal practice labs and 12+ real-world break-fix network troubleshooting scenarios.
- **Certification Authority**: Verifiable credentials (`NETVISION-CERT-FOUNDATIONS`, `NV-SEC`, `NV-CLOUD`, `NV-AIOPS`) with public SHA-256 verification and anti-tamper validation.

## 4. Quality & Compliance Baseline
- **100% Passing Verification**: Comprehensive test suites across Auth, Progress Synchronization, Troubleshooting Engine, Certificate Security, and Identity Isolation.
- **Zero-Friction Guest Mode**: Stateless guest sessions via `X-Anonymous-ID` with replay-proof atomic migration on registration/login.
- **Production-Ready Security**: Strict input sanitization, error redaction, credential protection, and defense against IDOR / unauthorized state mutation.


