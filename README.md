# NetVision 🌐

> **Learn Computer Networking by Seeing It.**  
> An interactive, visual computer networking learning platform featuring dynamic packet animations, deterministic CLI sandbox simulations, multi-modal lessons, mastery-based assessments, and verifiable certifications.

---

## 🚀 Live Public Beta

- **Web Application (Production Frontend)**: [https://netvision-three.vercel.app/](https://netvision-three.vercel.app/)
- **API Gateway (Staging Backend)**: [https://netvision-backend-staging.onrender.com](https://netvision-backend-staging.onrender.com)
- **Service Health Check**: [https://netvision-backend-staging.onrender.com/api/v1/health](https://netvision-backend-staging.onrender.com/api/v1/health)
- **Interactive API Documentation (Swagger OpenAPI)**: [https://netvision-backend-staging.onrender.com/api/docs](https://netvision-backend-staging.onrender.com/api/docs)
- **Official GitHub Repository**: [https://github.com/qamarabbas-024/netvision](https://github.com/qamarabbas-024/netvision)

> **Public Beta Status**: NetVision is currently running in public beta. Email OTP verification is temporarily deactivated (`EMAIL_VERIFICATION_ENABLED=false`) to enable immediate, zero-friction registration and exploration for learners worldwide. The backend is deployed on staging infrastructure connected to serverless PostgreSQL on Neon.

---

## 📖 What NetVision Is

Computer networking education is often polarized between abstract textbook theory (memorizing RFCs and static OSI diagrams) and complex enterprise simulators (Cisco Packet Tracer, GNS3).

NetVision bridges this divide with an intuitive, web-native visual learning experience:
1. **Visual Packet Mechanics**: Watch frames and packets move across topologies with step-by-step header encapsulation and decapsulation animations.
2. **Multi-Modal Pedagogy**: Every lesson presents an intuitive real-world analogy, simplified explanation, RFC-level technical details, and a quick-reference cheatsheet.
3. **Simulated CLI Labs**: Practice standard network diagnostics (`ping`, `traceroute`, `ifconfig`, `ip`, `arp`, `netstat`, `nslookup`, `route`) in a safe, deterministic browser sandbox.
4. **Mastery-Based Progression**: Enforce real comprehension with multi-tiered quizzes requiring an 80% passing threshold before unlocking certifications.

---

## 🏗️ Repository Layout

NetVision is organized as a clean **pnpm monorepo** managed with **Turborepo**:

```
netvision/
├── frontend/                 # Next.js 14 App Router, React 18, Tailwind CSS, Framer Motion, @xyflow/react
├── backend/                  # NestJS 10 REST API, Prisma 5 ORM, Argon2, Passport JWT, Swagger OpenAPI
├── packages/
│   ├── shared/               # Shared TypeScript interfaces, DTOs, and curriculum models (@netvision/shared)
│   ├── simulation-engine/    # Pure TypeScript packet simulation engine (@netvision/simulation-engine)
│   └── ui/                   # Reusable UI component library and design system tokens (@netvision/ui)
├── docs/                     # Architectural specifications, security audits, and curriculum reports
├── docker-compose.yml        # Containerized PostgreSQL 16 development database
├── turbo.json                # Turborepo build pipeline configuration
├── pnpm-workspace.yaml       # pnpm workspace definition
└── README.md                 # Project documentation
```

---

## 🛠️ Technology Stack

| Component | Technologies & Tools |
|---|---|
| **Frontend Client** | **Next.js 14** (App Router), **React 18**, **TypeScript 5**, **Tailwind CSS 3**, **Framer Motion**, **@xyflow/react**, **Zustand**, **@tanstack/react-query**, **Lucide React** |
| **Backend API Gateway** | **NestJS 11**, **TypeScript 5**, **Prisma 5 ORM**, **Argon2**, **Passport JWT**, **Passport Google & GitHub**, **@nestjs/throttler**, **@nestjs/swagger**, **Helmet**, **Resend SDK** |
| **Database** | **PostgreSQL 16** (Neon Serverless in Staging; Docker Compose in Local Development) |
| **Monorepo & Build Tools** | **pnpm v11 Workspaces**, **Turborepo** |

---

## ✨ Current Implemented Features

### 1. Authentication & Identity
- **Instant Beta Registration**: Create an account and receive immediate JWT tokens without mandatory OTP gates during public beta.
- **Argon2id Password Security**: Passwords are securely hashed with memory-hard Argon2id (`$argon2id$`).
- **OAuth 2.0 Integration**: Sign in with Google or GitHub OAuth.
- **Guest-First Anonymous Mode**: Learn, run simulations, and take quizzes without an account via `X-Anonymous-ID` tracking.
- **Atomic Progress Claiming**: Automatically merge anonymous guest progress into an account upon registration.
- **Email Architecture**: Complete Resend HTTPS REST API and SMTP provider abstraction ready for future production activation.

### 2. Interactive Learning System
- **16-Course Progressive Curriculum**: Structured learning from digital bit fundamentals (NET-101) through BGP routing and PCAP packet forensics (NET-404).
- **Multi-Modal Lessons**: 38 lessons featuring real-world analogies, simplified explanations, technical deep dives, and cheatsheets.
- **Interactive Simulation Engines**:
  - TCP 3-Way Handshake & 4-Way Teardown State Machine
  - IPv4 Subnetting & CIDR Calculation Visualizer
  - ARP Cache Resolution & Local Broadcast Framing
  - DNS Hierarchical Resolution & DHCP 4-Step DORA State Machine
  - Layer 3 Routing Table Forwarding & Longest Prefix Match
- **Interactive Practice Labs**: 38 guided CLI labs with automated validation.
- **Mastery Assessments**: 38 quizzes with 50 questions across Recall, Understanding, Application, and Troubleshooting cognitive tiers.
- **Gamification & Achievements**: 10 automated achievement badge unlocks across 6 categories.
- **Learner Dashboard**: Real-time course completion percentages, mastery scores, and recent lab activity.
- **Verifiable Digital Certificates**: Cryptographic certificate generation (`NETVISION-CERT-FOUNDATIONS`) with public validation pages (`/certificates/[id]`).

### 3. Sandbox Execution State
- **Simulated Sandbox (ACTIVE)**: `SimulatedSandboxProvider` executes in pure TypeScript memory with deterministic telemetry for `ping`, `traceroute`, `ifconfig`, `ip`, `arp`, `netstat`, `nslookup`, `dig`, `route`, `iptables`, and `tcpdump`.
- **Docker Sandbox (DISABLED)**: `DockerSandboxProvider` is intentionally disabled in public beta to eliminate host container security risks on shared cloud deployments.

---

## 🗺️ Networking Curriculum (NET-101 to NET-404)

```
Level 1: Foundations (Foundational)
├── NET-101: Computer & Digital Information Foundations (Binary, Hex, Octets, Bits & Bytes)
├── NET-102: Network Fundamentals & Topologies (Nodes, Links, Topologies, LAN vs WAN)
└── NET-103: The OSI & TCP/IP Reference Models (7-Layer OSI, 4-Layer TCP/IP, PDU Encapsulation)

Level 2: Core Protocols & Addressing (Beginner)
├── NET-201: Layer 2 Ethernet & Physical Media (Frames, 48-bit MAC Addresses, CSMA/CD)
├── NET-202: IPv4 Addressing & CIDR Subnetting Mastery (VLSM, Network & Broadcast Calculation)
├── NET-203: Core IP Services (ARP Resolution, ICMP Echo, DNS Tree, DHCP DORA)
└── NET-204: Transport Layer Protocols (TCP Reliability, UDP Datagrams, Sockets & Ports)

Level 3: Enterprise Infrastructure & Routing (Intermediate)
├── NET-301: Enterprise Switching, VLANs & Trunking (802.1Q, Broadcast Domains, Access vs Trunk)
├── NET-302: Spanning Tree Protocol & Switch Redundancy (Loop Prevention & BPDU Mechanics)
├── NET-303: IP Routing & Static Route Administration (Longest Prefix Match, Routing Tables)
├── NET-304: Dynamic Routing Protocols (Single-Area OSPF Adjacencies & Path Selection)
└── NET-305: Network Security, ACLs & Stateful Firewalls (Packet Filtering, Port Restrictions)

Level 4: Advanced Edge & Forensics (Advanced)
├── NET-401: NAT, PAT & Edge WAN Connectivity (Network Address Translation, NAT Overload)
├── NET-402: VPN Technology & Cryptography (IPsec Architecture, IKE Tunnels, AES/RSA)
├── NET-403: BGP & Enterprise WAN Architecture (Autonomous Systems, Path Vector Routing)
└── NET-404: Packet Capture Analysis & Troubleshooting (Wireshark PCAP Stream Forensics)
```

---

## ⚡ Quick Start & Local Development

### Prerequisites
- **Node.js**: `>= 20.x`
- **pnpm**: `11.20.0` (Install via `npm install -g pnpm@11.20.0`)
- **Docker**: Docker Desktop or Docker Engine (for local PostgreSQL)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/qamarabbas-024/netvision.git
cd netvision
pnpm install
```

### 2. Configure Environment Variables
```bash
# Backend environment configuration
cp backend/.env.example backend/.env

# Frontend environment configuration
cp frontend/.env.example frontend/.env.local
```

### 3. Start Local Database & Run Migrations
```bash
# Start local PostgreSQL database container
pnpm db:up

# Apply Prisma database migrations
pnpm db:migrate

# Seed curriculum, lessons, labs, achievements, and certifications
pnpm --filter netvision-backend prisma:seed
```

### 4. Start Development Servers
```bash
pnpm dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:4000/api/v1`
- **Swagger Documentation**: `http://localhost:4000/api/docs`

---

## 🧪 Test Suites

```bash
# Run P0 product correctness & canonical state suite
pnpm --filter netvision-backend test:product:correctness

# Run anonymous claim security & session isolation tests
pnpm --filter netvision-backend test:claim:security

# Run security, OAuth cookies & OTP entropy hardening tests
pnpm --filter netvision-backend test:security

# Run Content V2 curriculum validation suite
pnpm --filter netvision-backend test:curriculum:content-v2

# Run error, empty state & resilience audit
pnpm --filter netvision-backend test:audit:errors

# Run network troubleshooting engine test suite
pnpm --filter netvision-backend test:troubleshooting

# Execute typecheck across all workspace packages
pnpm typecheck

# Build both applications
pnpm build
```

---

## 🗄️ Database Migration Policy

Database schema integrity is managed strictly through **Prisma Migrations**:

- **Staging & Production Deployments**: Must execute `pnpm prisma:migrate:prod` (`prisma migrate deploy`).
- **Forbidden in Shared Environments**: `prisma db push` is strictly prohibited in staging and production to prevent unintended data loss or schema drifts.
- **Local Development**: Create reproducible SQL migrations via `pnpm --filter netvision-backend prisma:migrate`.

---

## 🔒 Security Controls

- **Password Hashing**: Memory-hard **Argon2id** (`$argon2id$`) with cryptographically secure salts.
- **JWT Authorization**: Stateless HMAC-SHA256 tokens with short lifetimes.
- **Startup Protection**: `validateProductionConfig()` halts server boot if default or insecure JWT secrets are detected.
- **IDOR Protection**: Strict per-user ownership verification on all sandbox sessions, exam attempts, and certificates.
- **HTTP Hardening**: Helmet configured with strict Content Security Policy, HSTS, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: SAMEORIGIN`.
- **CORS Restriction**: Staging API allows origins strictly matching `https://netvision-three.vercel.app`.
- **Rate Limiting**: Multi-tier request throttling via `@nestjs/throttler` (100 req/min global, 20 req/min auth, 5 req/min password reset) with `loopback` trust proxy configuration.
- **Input Sanitization**: Global `ValidationPipe` with whitelist enforcement rejects unexpected request parameters.
- **Sandbox Isolation**: Deterministic in-memory simulation; command injection patterns (`sudo`, `rm -rf`, `chmod`, `dd`, `mkfs`) are intercepted without spawning host processes.

---

## 🔍 Search Engine Optimization (SEO)

Search Engine Optimization is an active project priority as NetVision prepares for wider organic reach:
- Semantic HTML5 structure and dynamic metadata titles across all learning routes.
- Next.js Server Components (RSC) provide fast, search-engine-readable static renderings of course catalogs and curriculum outlines.
- Structured data schemas (JSON-LD Course/EducationalOrganization), dynamic XML sitemaps, and automated OpenGraph preview cards are currently in development as part of the Phase 2 SEO milestone.

---

## 📜 Workspace Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Starts frontend and backend development servers concurrently |
| `pnpm build` | Builds all applications and packages in the workspace |
| `pnpm typecheck` | Executes `tsc --noEmit` across all workspace projects |
| `pnpm lint` | Runs ESLint across all projects |
| `pnpm db:up` | Boots local PostgreSQL database via Docker Compose |
| `pnpm db:down` | Stops local database container |
| `pnpm db:migrate` | Applies Prisma migrations locally |

---

## 🛣️ Project Roadmap

The NetVision roadmap is prioritized across the following development tracks:

1. **Security Audit & Hardening**: Comprehensive continuous security testing, dependency auditing, and sandbox isolation verification.
2. **SEO Foundation**: Dynamic XML sitemap, meta tags, OpenGraph preview cards, and JSON-LD educational schema markup.
3. **Spanning Tree Protocol (STP)**: Interactive loop prevention visualizer and lesson content for course NET-302.
4. **OSPF Dynamic Routing**: Single-Area OSPF neighbor adjacencies and route distribution mechanics for course NET-304.
5. **Assessment & Question Expansion**: Scaling the mastery question bank from 50 to 150+ scenario-based questions.
6. **Troubleshooting Engine**: Interactive multi-hop network break-and-repair incident scenarios with packet loss diagnostics.
7. **Certification Improvements**: Multi-course comprehensive examination blueprints and anti-tampering verification badges.
8. **Production Email & Domain Setup**: Custom DNS domain verification and live transactional email activation via Resend HTTPS API.
9. **Teacher & Classroom Features**: Cohort management, assignment dispatch, and student analytics dashboard (`Role.TEACHER`).
10. **Advanced Networking Specializations**: Cloud VPC Peering, Kubernetes CNI networking, and Snort/Suricata IDS lab modules.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository: [https://github.com/qamarabbas-024/netvision](https://github.com/qamarabbas-024/netvision).
2. Create a feature branch (`git checkout -b feature/interactive-ospf-lab`).
3. Ensure all tests and typechecks pass (`pnpm typecheck` and `pnpm build`).
4. Submit a detailed Pull Request describing your changes.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
