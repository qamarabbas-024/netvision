# NetVision 🌐

> **Visual Network Engineering & Verifiable Certification Platform**  
> An interactive learning platform combining packet-flow visualizations, deterministic CLI sandbox labs, multi-modal networking curricula, and server-authoritative certification credentials.

---

## 📖 Overview

Computer networking education has historically been divided between abstract textbook theory and opaque, heavyweight enterprise simulators. NetVision bridges this gap with an intuitive, web-native visual learning experience:

1. **Visual Packet Mechanics**: Inspect frames and packets moving across topologies with step-by-step encapsulation and decapsulation animations.
2. **Multi-Modal Pedagogy**: Every concept integrates an intuitive real-world analogy, simplified explanation, RFC-grounded technical mechanics, and an operational cheatsheet.
3. **Deterministic CLI Practice Labs**: Execute core network diagnostic commands (`ping`, `traceroute`, `ip`, `arp`, `netstat`, `route`, `iptables`, `tcpdump`) in an isolated browser-accessible terminal environment.
4. **Server-Authoritative Certifications**: Earn rigorous digital credentials backed by cryptographically verifiable identifiers and server-side evaluation.

---

## 🏛️ Flagship Curriculum & Certification Architecture

NetVision structures its professional networking curriculum into **5 Flagship Courses**, each leading to an industry-aligned specialist credential, capped by the comprehensive **NetVision Network Engineering Mastery** program.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       5 FLAGSHIP CERTIFICATION COURSES                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  NV-C01: Foundations & Network Architecture                                 │
│  NV-C02: Ethernet, Switching & IP Networking                                │
│  NV-C03: Transport, Routing & Network Services                              │
│  NV-C04: Network Security & Secure Connectivity                             │
│  NV-C05: Network Engineering, Automation & Troubleshooting                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NETVISION MASTER CAPSTONE EXAMINATION                  │
│                     (120 Minutes | 85% Composite Threshold)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  Theory: 40%  │  Incident Remediation: 35%  │  Packet Forensics: 25%        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             NV-NET-MASTERY: NETVISION CERTIFIED NETWORK ENGINEERING MASTER   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. The 5 Flagship Courses

| Course Code | Title | Target Level | Modules | Focus Areas |
|:---|:---|:---:|:---:|:---|
| **NV-C01** | Foundations & Network Architecture | Foundational | 3 Modules | Digital Bits/Bytes, Hardware NIC/CPU, Topologies, Transmission Media, OSI/TCP-IP Models |
| **NV-C02** | Ethernet, Switching & IP Networking | Beginner | 4 Modules | Ethernet Framing, MAC Tables, VLANs & 802.1Q Trunks, Spanning Tree (STP), IPv4 CIDR Subnetting |
| **NV-C03** | Transport, Routing & Network Services | Intermediate | 4 Modules | Core Services (ARP, DNS, DHCP), TCP/UDP Sockets, Static Routing, Single-Area OSPFv2 |
| **NV-C04** | Network Security & Secure Connectivity | Intermediate | 3 Modules | IPv4 ACLs & Firewalls, NAT/PAT Address Translation, Site-to-Site IPsec VPN Cryptography |
| **NV-C05** | Network Engineering, Automation & Troubleshooting | Advanced | 3 Modules | Wireshark PCAP Stream Forensics, Multi-Layer Incident Diagnostics, Python NetDevOps & YANG |

---

### 2. Professional Credentials & Eligibility Rules

NetVision issues six authoritative digital credentials. All evaluations occur server-side; credentials carry a unique cryptographic identifier verifiable through the public registry.

| Credential Code | Credential Designation | Prerequisites & Eligibility Rules |
|:---|:---|:---|
| **NV-NET-C01** | NetVision Certified Network Foundations Specialist | Complete 100% of NV-C01 lessons + Assessment Avg ≥ 80% + Required Labs |
| **NV-NET-C02** | NetVision Certified Switching & IP Networking Specialist | Complete 100% of NV-C02 lessons + Assessment Avg ≥ 80% + Required Labs |
| **NV-NET-C03** | NetVision Certified Routing & Services Specialist | Complete 100% of NV-C03 lessons + Assessment Avg ≥ 80% + Required Labs |
| **NV-NET-C04** | NetVision Certified Network Security Specialist | Complete 100% of NV-C04 lessons + Assessment Avg ≥ 80% + Required Labs |
| **NV-NET-C05** | NetVision Certified Network Engineering Specialist | Complete 100% of NV-C05 lessons + Assessment Avg ≥ 80% + Required Labs |
| **NV-NET-MASTERY** | NetVision Certified Network Engineering Master | All 5 Specialist Credentials + Cumulative Avg ≥ 85% + Pass Master Capstone |

---

### 3. The Master Capstone Examination

The **Master Capstone Examination** is the synoptic evaluation governing issuance of the `NV-NET-MASTERY` credential:

- **Duration**: 120 minutes, single-session timed exam.
- **Passing Threshold**: **≥ 85%** composite score.
- **Scoring Weights**:
  - **Component 1: Architectural Theory & Standards** — **40%**
  - **Component 2: Active Incident Remediation** — **35%**
  - **Component 3: Packet Forensics & Root-Cause Analysis** — **25%**
- **Attempt & Cooldown Policy**:
  - Maximum **3 attempts** within any rolling **90-day window**.
  - **24-hour mandatory cooldown** following a first unsuccessful attempt.
  - **72-hour mandatory cooldown** following any subsequent unsuccessful attempt.

---

## 🛠️ Technology Stack

NetVision is built as a TypeScript monorepo with strict layer separation:

| Layer | Technologies |
|:---|:---|
| **Frontend Application** | **Next.js 15** (App Router), **React 18**, **TypeScript 5**, **Tailwind CSS 3**, **Three.js 0.185**, **GSAP**, **Framer Motion**, **Zustand**, **Lucide Icons** |
| **Backend API Gateway** | **NestJS 11**, **TypeScript 5**, **Prisma 5 ORM**, **Argon2id**, **Passport JWT**, **Throttler Rate-Limiting**, **Swagger OpenAPI** |
| **Persistence** | **PostgreSQL 16** (relational foreign key integrity and ACID transactions), **Redis 7** (token revocation, session security, query cache) |
| **Monorepo Architecture** | **pnpm Workspaces** (v11), **Turborepo** build orchestration |
| **Verification & Testing** | **Jest**, **Playwright** end-to-end testing, custom academic integrity test harnesses |

---

## 📁 Repository Structure

```
netvision/
├── frontend/                     # Next.js 15 web client & learning interface
│   ├── app/                      # App router pages (courses, lessons, capstone, verify)
│   ├── components/               # React components (simulations, terminals, modals)
│   └── lib/                      # Client utilities (state stores, audio, particle engines)
├── backend/                      # NestJS 11 API Gateway
│   ├── prisma/                   # Prisma schema, migrations, and canonical seed scripts
│   ├── src/
│   │   ├── auth/                 # Identity, JWT, Argon2id, and OAuth providers
│   │   ├── certifications/       # Authoritative certification & Master Capstone engines
│   │   ├── topics/               # Curriculum content, quizzes, and simulation state
│   │   └── sandbox/              # Deterministic CLI command execution provider
│   └── scripts/                  # Verification and automated regression suites
├── packages/
│   ├── shared/                   # Shared TypeScript models, DTOs, and curriculum schemas
│   └── simulation-engine/        # Topology state graph & packet animation models
├── docs/                         # Architecture specifications and pedagogy documentation
├── docker-compose.yml            # Local PostgreSQL 16 service container
├── turbo.json                    # Turborepo build pipeline
└── pnpm-workspace.yaml           # pnpm workspace definition
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js**: `v22.x` LTS (`>=22.0.0 <25.0.0`)
- **pnpm**: `v11.x` (`corepack enable pnpm` or `npm install -g pnpm@11.20.0`)
- **Docker**: For containerized PostgreSQL database (optional if running local PostgreSQL)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/qamarabbas-024/netvision.git
cd netvision
pnpm install
```

### 2. Environment Configuration

Copy example environment files to their active locations:

```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env
```

Review `backend/.env` to configure your PostgreSQL connection string and a secure `JWT_SECRET` (minimum 32 characters in production).

### 3. Database Initialization

Start a local PostgreSQL container and run migrations:

```bash
# Start PostgreSQL via Docker Compose
docker compose up -d postgres

# Generate Prisma Client and apply migrations
pnpm --filter netvision-backend prisma:generate
pnpm --filter netvision-backend prisma:migrate

# Seed canonical courses, modules, and lessons
pnpm --filter netvision-backend prisma:seed
```

### 4. Start Development Servers

```bash
# Run both frontend and backend concurrently via Turborepo
pnpm dev
```

- **Frontend Client**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **API Documentation (Swagger)**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 🧪 Verification & Testing

```bash
# Typecheck across all workspace packages
pnpm typecheck

# Lint workspace
pnpm lint

# Production build verification
pnpm build

# Run certification integrity & grading regressions
pnpm --filter netvision-backend test:drop8
pnpm --filter netvision-backend test:drop9
```

---

## 🔒 Security & Verification Model

- **Server-Authoritative Evaluation**: Passing requirements, quiz scoring, and Capstone exams are evaluated strictly server-side. Answer keys and grading rubrics are never embedded in client bundles.
- **Argon2id Password Hashing**: User credentials use memory-hard Argon2id hashing algorithms.
- **Authoritative Credential Registry**: Issued certificates carry unique, tamper-evident identifiers queryable via the public verification portal at `/certificates/verify/:credentialId`, authenticated directly against NetVision's PostgreSQL certification registry.
- **Public Credential Metadata**: Verification pages embed schema.org `EducationalOccupationalCredential` structured data with XSS sanitization for search engine and employer verification.

---

## 📚 Content Development & Roadmap

NetVision is committed to high-integrity curriculum engineering grounded in canonical networking literature. Educational content, packet diagrams, and assessment items are mapped systematically from authoritative reference texts. See [Content Source Architecture](docs/content-source-architecture.md) for our formal ingestion pipeline.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
