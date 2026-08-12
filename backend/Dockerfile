# Backend NestJS Production Dockerfile
# Node version must match CI (.github/workflows/ci.yml uses node: 24)
FROM node:24-alpine AS base

# ── deps stage: install dependencies using pnpm (project package manager) ────
FROM base AS deps
WORKDIR /app

# Enable corepack so pnpm is available at the pinned version
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate

# Copy workspace manifests and lockfile first (layer cache)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY backend/package.json ./backend/

# Install ALL workspace dependencies with frozen lockfile (no silent updates)
RUN pnpm install --frozen-lockfile

# ── builder stage: generate Prisma client and compile NestJS ──────────────────
FROM base AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.20.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

WORKDIR /app/backend

# Generate Prisma client using backend's installed prisma package
RUN pnpm prisma generate

# Compile TypeScript → dist/
RUN pnpm build

# ── runner stage: minimal production image ────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy only what is needed at runtime
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./package.json

# Copy Prisma schema so `prisma migrate deploy` can run at startup
COPY --from=builder /app/backend/prisma ./prisma

USER nestjs
EXPOSE 4000
ENV PORT=4000

CMD ["node", "dist/main.js"]
