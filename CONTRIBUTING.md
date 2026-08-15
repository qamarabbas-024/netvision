# Contributing to NetVision 🌐

Thank you for your interest in contributing to **NetVision**! We welcome contributions from developers, UI/UX designers, networking engineers, and educators.

---

## 📜 Code of Conduct

Please maintain a polite, respectful, and inclusive environment for all community members.

---

## 🛠 Local Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/qamarabbas-024/netvision.git
   cd netvision
   ```

2. Install workspace dependencies using `pnpm`:
   ```bash
   pnpm install
   ```

3. Spin up the development PostgreSQL database:
   ```bash
   pnpm db:up
   ```

4. Run database migrations and seed curriculum:
   ```bash
   pnpm db:migrate
   pnpm --filter netvision-backend prisma:seed
   ```

5. Start development servers:
   ```bash
   pnpm dev
   ```

---

## 🌿 Git Branching & Commit Conventions

We follow Conventional Commits format:
- `feat: add DNS lookup interactive visualizer`
- `fix: resolve packet dropping bug in firewall node`
- `docs: update master architecture specification`
- `style: refine dark mode contrast ratios`

---

## 🧪 Testing Before Pull Request

Ensure all test suites, typechecks, and builds pass cleanly before submitting your PR:
```bash
# Typecheck all packages
pnpm typecheck

# Run backend test suites
pnpm --filter netvision-backend test:beta:auth
pnpm --filter netvision-backend test:email:suite
pnpm --filter netvision-backend test:deployment

# Build all applications
pnpm build
```
