# NetVision Backend Multi-Stage Production Dockerfile
FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++ openssl
RUN npm install -g pnpm@11.20.0

WORKDIR /app

# Copy workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui
COPY packages/simulation-engine ./packages/simulation-engine
COPY backend ./backend

# Install dependencies and build shared packages + backend (fail-closed on error)
RUN pnpm install --frozen-lockfile
RUN pnpm --filter netvision-backend prisma:generate
RUN pnpm --filter @netvision/shared build
RUN pnpm --filter @netvision/simulation-engine build
RUN pnpm --filter netvision-backend build

# Production Runner Stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install OpenSSL for Prisma engine compatibility on Alpine Linux
RUN apk add --no-cache openssl

# Copy workspace structure and compiled production artifacts
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/packages/simulation-engine ./packages/simulation-engine
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/dist ./backend/dist

WORKDIR /app/backend

USER node

EXPOSE 4000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/ready || exit 1

CMD ["node", "dist/backend/src/main.js"]
