# NetVision 🌐

> **Learn Computer Networking by Seeing It.**  
> The world's premier interactive, visual networking learning platform.

---

## 🚀 Overview

NetVision bridges the gap between abstract computer networking theory and deep intuitive understanding. Instead of memorizing static diagrams or reading complex textbooks, learners interactively build network topologies, observe real-time packet animations, simulate core protocols (DNS, ARP, TCP/UDP, DHCP, Routing), and troubleshoot broken networks in a visual sandbox environment.

Designed for scalable enterprise growth, NetVision supports student learning paths, interactive quizzes, automated progress tracking, verifiable certificates, teacher dashboards, and hands-on simulation labs.

---

## 🏗 Architecture & Workspace Layout

NetVision is architected as a modern, scalable **pnpm monorepo** powered by **Turborepo**:

```
NetVision Monorepo Layout
├── apps/
│   ├── frontend/             # Next.js 14 App Router, React 18, React Flow, Framer Motion, Tailwind CSS
│   └── backend/              # NestJS 10, REST API, Swagger OpenAPI, Prisma ORM, Argon2, Throttler
├── packages/
│   ├── shared/               # Universal TypeScript models, DTOs, & Knowledge Model schemas (@netvision/shared)
│   ├── simulation-engine/    # Modular, object-oriented packet simulation engine (@netvision/simulation-engine)
│   └── ui/                   # Reusable UI component design system & utilities (@netvision/ui)
├── docker-compose.yml        # Containerized PostgreSQL 16 & Redis 7 development stack
├── turbo.json                # Turborepo task pipeline configuration
├── pnpm-workspace.yaml       # pnpm workspace definition
└── README.md                 # Project documentation
```

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, `@xyflow/react`, Zustand, `@tanstack/react-query`.
- **Backend**: NestJS 10, TypeScript, Prisma ORM, PostgreSQL 16, Redis 7, Argon2, `@nestjs/jwt`, `@nestjs/swagger`, `@nestjs/throttler`, Helmet.
- **Infrastructure & CI/CD**: pnpm v9 Workspaces, Turborepo, Docker Compose, GitHub Actions.

---

## ⚡ Quick Start & Development Setup

### Prerequisites

- **Node.js**: `>= 20.x`
- **pnpm**: `>= 9.x` (`npm i -g pnpm`)
- **Docker**: Docker Desktop or Docker Engine

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/netvision/netvision.git
cd netvision
pnpm install
```

### 2. Start Infrastructure Containers

Launch local PostgreSQL 16 and Redis 7 database services:

```bash
pnpm db:up
```

### 3. Generate Prisma Database Client

```bash
pnpm db:generate
```

### 4. Run Development Servers

Start both Frontend and Backend concurrently with Turborepo:

```bash
pnpm dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000/api/v1`
- **Swagger Documentation**: `http://localhost:4000/api/docs`

---

## 🔒 Security & Performance Features

- **Argon2 Password Hashing**: Enterprise-grade password hashing via `argon2`.
- **JWT Authentication & Guards**: Stateless JWT verification with strict expiration and strategy validation.
- **Rate Limiting**: Protection against brute-force and DDoS attacks using `@nestjs/throttler`.
- **Security Headers**: Production HTTP security headers via `helmet`.
- **Input Validation**: Strict request payload validation using `class-validator` and `ValidationPipe`.
- **Indexed Database Schema**: Foreign key and slug indexing in Prisma schema for sub-millisecond query execution.
- **Monorepo Caching**: Turborepo build caching for high-speed local and CI builds.

---

## 📜 Workspace Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts frontend & backend dev servers concurrently |
| `pnpm build` | Builds all apps and packages in the monorepo via Turborepo |
| `pnpm lint` | Runs ESLint across all apps and packages |
| `pnpm typecheck` | Executes `tsc --noEmit` across all workspace projects |
| `pnpm db:up` | Boots PostgreSQL 16 & Redis 7 via Docker Compose |
| `pnpm db:down` | Stops infrastructure containers |
| `pnpm db:migrate` | Runs Prisma database migrations |
| `pnpm db:generate` | Generates Prisma Client types |

---

## 🛣 Roadmap

- [x] Pure pnpm monorepo workspace migration & Turborepo build pipeline
- [x] NestJS backend hardening with Swagger OpenAPI & Throttler rate-limiting
- [x] Database indexing & Prisma Client optimization
- [x] Next.js App Router frontend integration with workspace packages
- [ ] Multi-node interactive simulation engine canvas expansion
- [ ] Teacher & Student Dashboard analytics
- [ ] Automated lab grading & verifiable certificate issuance
- [ ] Community network scenario library

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
