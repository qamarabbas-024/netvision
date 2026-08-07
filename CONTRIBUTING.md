# Contributing to NetVision 🌐

Thank you for your interest in contributing to **NetVision**! We welcome contributions from developers, UI/UX designers, networking engineers, and educators.

---

## 📜 Code of Conduct

Please maintain a polite, respectful, and inclusive environment for all community members.

---

## 🛠 Local Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/netvision.git
   cd netvision
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Spin up development PostgreSQL and Redis containers:
   ```bash
   npm run db:up
   ```

4. Start development servers:
   ```bash
   npm run dev
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

Ensure linting and typechecking pass cleanly before submitting your PR:
```bash
npm run lint
```
