# NetVision Master Development Roadmap 🛣️

This document outlines the execution phases for building **NetVision**.

---

## 📌 Phase 1: Architecture & Monorepo Foundation ✅
- [x] Initialize Monorepo structure (`frontend`, `backend`, `packages`).
- [x] Configure Tailwind CSS, TypeScript, ESLint, Prettier, `.gitignore`.
- [x] Set up Docker Compose for local PostgreSQL 16 & Redis 7 services.
- [x] Define core Prisma database schema (User, Role, Course, Module, Lesson, Quiz, Progress, Certificate, SimulationState).
- [x] Define global design tokens & dark-mode-first aesthetic system (Linear + Cisco inspired).

---

## 📌 Phase 2: Landing Page & Reusable UI Design System
- [ ] Build Apple & Linear-inspired Hero Section with dynamic packet flow visualizer.
- [ ] Develop interactive feature overview components & interactive sample demo card.
- [ ] Create responsive navbar, footer, course preview cards, and stats visualizers.

---

## 📌 Phase 3: Authentication & Security Architecture
- [ ] Implement NestJS Auth Module (Argon2 password hashing, JWT access/refresh tokens in HttpOnly cookies).
- [ ] Build Next.js Auth pages (`/login`, `/register`) with interactive state validation.
- [ ] Set up Role-Based Access Control (RBAC) & Rate Limiting protection.

---

## 📌 Phase 4: Learner Dashboard & Course Catalog System
- [ ] Build user welcome header, active progress tracker, recent lessons, and achievements showcase.
- [ ] Develop course catalog filterable by topic (Fundamentals, Protocols, Routing, Security).

---

## 📌 Phase 5: Interactive Lesson Viewer & Quiz Engine
- [ ] Implement multi-stage lesson viewer (Theory -> Interactive Visual -> Practice -> Quiz).
- [ ] Build interactive quiz system with instant visual feedback and score calculation.

---

## 📌 Phase 6: Core Simulation Engine & Packet Animation Engine
- [ ] Build dynamic packet animator for ARP, DNS lookup, TCP 3-way handshake, and ICMP Ping.
- [ ] Create interactive simulation controls (Play, Pause, Step-Forward, Speed Control, Packet Inspector).

---

## 📌 Phase 7: Interactive Networking Sandbox
- [ ] Implement drag-and-drop canvas (`@xyflow/react`) supporting Routers, Switches, Firewalls, PCs, Servers.
- [ ] Allow link creation, IP/subnet configuration, packet dispatching, and break/repair scenarios.

---

## 📌 Phase 8: Certificates, Achievements, and Admin System
- [ ] Generate downloadable SVG/PDF certificates upon course completion.
- [ ] Admin dashboard for course management, user analytics, and system performance monitoring.
