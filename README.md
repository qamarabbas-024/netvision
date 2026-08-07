# NetVision 🌐

> **Learn Networking by Seeing It.**  
> The world's premier interactive, visual networking learning platform.

---

## 🚀 Overview

NetVision is designed to bridge the gap between abstract computer networking theory and practical intuitive understanding. Instead of memorizing static diagrams or complex command-line prompts, learners interactively build topologies, observe real-time packet animations, simulate protocols (DNS, ARP, TCP/UDP, DHCP, Routing), and repair broken networks in a visual sandbox environment.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, React Flow (`@xyflow/react`), Zustand.
- **Backend**: NestJS, Prisma ORM, PostgreSQL, Redis, Argon2, JWT Authentication.
- **Infrastructure**: Docker, GitHub Actions, Cloudflare, Vercel, Railway.

---

## 🎯 Primary Features

- **Interactive Simulation Engine**: Real-time packet movement across Routers, Switches, Firewalls, DNS, ARP, and TCP/UDP streams.
- **Visual Networking Sandbox**: Drag-and-drop network topology builder with node breakdown & repair scenarios.
- **Course & Lesson Viewer**: Structured path covering TCP/IP, OSI model, IP Addressing, Subnetting, Routing, Switching, and Cyber Security basics.
- **Interactive Quizzes & Achievements**: Gamified milestone tracking with verifiable certificates.

---

## 📁 Repository Structure

```
NetVision/
├── frontend/             # Next.js App Router frontend application
├── backend/              # NestJS REST/WebSocket backend server
├── packages/             # Shared packages & schema utilities
├── docker-compose.yml    # PostgreSQL 16 & Redis dev services
├── README.md             # Project documentation
├── ROADMAP.md            # Multi-phase development roadmap
└── LICENSE               # MIT License
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 20.x
- Docker Desktop / Docker Engine

### Installation

1. Clone the repository and install root dependencies:
```bash
git clone https://github.com/netvision/netvision.git
cd netvision
npm install
```

2. Start local databases:
```bash
npm run db:up
```

3. Run development servers:
```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api/v1`
