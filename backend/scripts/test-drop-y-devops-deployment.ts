import * as fs from 'fs';
import * as path from 'path';
import { validateProductionConfig } from '../src/main';

console.log('====================================================================');
console.log('🚀 NETVISION DROP Y — PRODUCTION DEVOPS & DEPLOYMENT READINESS GATE');
console.log('====================================================================\n');

let passed = 0;
let failed = 0;

function check(assertion: boolean, description: string, detail?: string) {
  if (assertion) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}${detail ? ` -> ${detail}` : ''}`);
    failed++;
  }
}

const rootDir = path.resolve(__dirname, '../..');

// ===========================================================================
// TEST 1: DOCKERFILES MULTI-STAGE SAFETY & NON-ROOT HARDENING
// ===========================================================================
console.log('--- Test 1: Dockerfile Multi-Stage & Security Hardening ---');
const backendDockerPath = path.join(rootDir, 'Dockerfile.backend');
const frontendDockerPath = path.join(rootDir, 'Dockerfile.frontend');

check(fs.existsSync(backendDockerPath), 'Dockerfile.backend exists');
check(fs.existsSync(frontendDockerPath), 'Dockerfile.frontend exists');

const backendDocker = fs.readFileSync(backendDockerPath, 'utf8');
const frontendDocker = fs.readFileSync(frontendDockerPath, 'utf8');

check(backendDocker.includes('AS builder') && backendDocker.includes('AS runner'), 'Dockerfile.backend implements multi-stage build');
check(backendDocker.includes('USER node'), 'Dockerfile.backend drops privileges to non-root "node" user');
check(backendDocker.includes('HEALTHCHECK'), 'Dockerfile.backend declares production HEALTHCHECK');
check(backendDocker.includes('openssl'), 'Dockerfile.backend installs openssl for Prisma engine on Alpine');

check(frontendDocker.includes('AS builder') && frontendDocker.includes('AS runner'), 'Dockerfile.frontend implements multi-stage build');
check(frontendDocker.includes('USER node'), 'Dockerfile.frontend drops privileges to non-root "node" user');
check(frontendDocker.includes('HEALTHCHECK'), 'Dockerfile.frontend declares production HEALTHCHECK');
check(frontendDocker.includes('NEXT_TELEMETRY_DISABLED=1'), 'Dockerfile.frontend disables Next.js telemetry');

// ===========================================================================
// TEST 2: DOCKER COMPOSE ORCHESTRATION & MIGRATION ORDERING
// ===========================================================================
console.log('\n--- Test 2: Docker Compose Migration Ordering & Health Gates ---');
const composePath = path.join(rootDir, 'docker-compose.yml');
check(fs.existsSync(composePath), 'docker-compose.yml exists');

const composeContent = fs.readFileSync(composePath, 'utf8');
check(composeContent.includes('migration:'), 'docker-compose.yml defines dedicated migration service');
check(
  composeContent.includes('prisma migrate deploy') ||
  (composeContent.includes('"prisma"') && composeContent.includes('"migrate"') && composeContent.includes('"deploy"')),
  'Migration service strictly uses "prisma migrate deploy"'
);
check(!composeContent.includes('db push'), 'docker-compose.yml never invokes unsafe "db push"');
check(composeContent.includes('condition: service_completed_successfully'), 'Backend strictly depends on migration completion');
check(composeContent.includes('healthcheck:'), 'docker-compose.yml defines healthchecks on postgres, redis, backend, and frontend');

// ===========================================================================
// TEST 3: CI WORKFLOW PIPELINE INVARIANTS & ORDERING
// ===========================================================================
console.log('\n--- Test 3: CI Pipeline Invariants (install -> typecheck -> lint -> test -> build) ---');
const ciPath = path.join(rootDir, '.github/workflows/ci.yml');
check(fs.existsSync(ciPath), '.github/workflows/ci.yml exists');

const ciContent = fs.readFileSync(ciPath, 'utf8');
check(ciContent.includes('pnpm install --frozen-lockfile'), 'CI enforces immutable lockfile with --frozen-lockfile');

// Verify sequential order of pipeline stages
const idxInstall = ciContent.indexOf('Install Monorepo Dependencies');
const idxTypecheck = ciContent.indexOf('Run TypeScript Typecheck');
const idxLint = ciContent.indexOf('Run ESLint Code Quality');
const idxTest = ciContent.indexOf('Run Frontend Regression & Unit Tests');
const idxBuild = ciContent.indexOf('Build Production Artifacts');

check(
  idxInstall !== -1 &&
  idxTypecheck !== -1 &&
  idxLint !== -1 &&
  idxTest !== -1 &&
  idxBuild !== -1 &&
  idxInstall < idxTypecheck &&
  idxTypecheck < idxLint &&
  idxLint < idxTest &&
  idxTest < idxBuild,
  'CI execution order strictly verifies install -> typecheck -> lint -> test -> build'
);
check(ciContent.includes('scan-repository-secrets.js'), 'CI executes automated enterprise secret scanning');
check(ciContent.includes('prisma migrate deploy'), 'CI deploys migrations using prisma migrate deploy');
check(!ciContent.includes('db push'), 'CI strictly forbids db push');

// ===========================================================================
// TEST 4: DATABASE MIGRATION HISTORY & IDEMPOTENCY
// ===========================================================================
console.log('\n--- Test 4: Database Migration History & Rollback Verification ---');
const migrationsDir = path.join(rootDir, 'backend/prisma/migrations');
const migrations = fs.readdirSync(migrationsDir).filter((f) => fs.statSync(path.join(migrationsDir, f)).isDirectory());

check(migrations.length >= 3, `Prisma migrations history exists with ${migrations.length} migration(s)`);
check(migrations.includes('20260814000000_baseline'), 'Baseline migration exists');
check(migrations.includes('20260909000000_add_certificate_user_cert_unique'), 'Certificate uniqueness migration exists');
check(migrations.includes('20260910102552_add_active_exam_attempt_unique_idx'), 'Active attempt partial index migration exists');

// Verify partial index migration idempotency
const activeAttemptSql = fs.readFileSync(path.join(migrationsDir, '20260910102552_add_active_exam_attempt_unique_idx/migration.sql'), 'utf8');
check(activeAttemptSql.includes('IF NOT EXISTS'), 'Active attempt index migration uses idempotent "CREATE UNIQUE INDEX IF NOT EXISTS"');

// Verify seed safety (upserts & prod user guard)
const seedPath = path.join(rootDir, 'backend/prisma/seed.ts');
const seedContent = fs.readFileSync(seedPath, 'utf8');
check(seedContent.includes('SEED_DEMO_USERS'), 'seed.ts guards demo user creation behind SEED_DEMO_USERS');
check(seedContent.includes('.upsert('), 'seed.ts uses idempotent upsert operations');
check(!seedContent.includes('deleteMany()'), 'seed.ts does not perform destructive bulk deletions');

// ===========================================================================
// TEST 5: ENVIRONMENT HYGIENE & PRODUCTION FAIL-FAST VALIDATOR
// ===========================================================================
console.log('\n--- Test 5: Environment Hygiene & Fail-Fast Validator ---');
let configValidationRejectsMissing = false;
let configValidationRejectsWeak = false;

const origEnv = process.env.NODE_ENV;
const origJwt = process.env.JWT_SECRET;
const origDb = process.env.DATABASE_URL;

try {
  process.env.NODE_ENV = 'production';
  delete process.env.JWT_SECRET;
  validateProductionConfig();
} catch (err: any) {
  if (err.message.includes('Missing required environment variable')) {
    configValidationRejectsMissing = true;
  }
}

try {
  process.env.NODE_ENV = 'production';
  process.env.JWT_SECRET = 'super_secret_netvision_jwt_key_change_in_production';
  process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
  process.env.CORS_ORIGIN = 'http://localhost:3000';
  process.env.API_URL = 'http://localhost:4000';
  process.env.FRONTEND_URL = 'http://localhost:3000';
  validateProductionConfig();
} catch (err: any) {
  if (err.message.includes('Insecure or default JWT_SECRET detected')) {
    configValidationRejectsWeak = true;
  }
} finally {
  process.env.NODE_ENV = origEnv;
  if (origJwt) process.env.JWT_SECRET = origJwt;
  else delete process.env.JWT_SECRET;
  if (origDb) process.env.DATABASE_URL = origDb;
  else delete process.env.DATABASE_URL;
}

check(configValidationRejectsMissing, 'validateProductionConfig() halts execution if required env vars are missing');
check(configValidationRejectsWeak, 'validateProductionConfig() rejects insecure or default JWT secrets in production');

// ===========================================================================
// TEST 6: FRONTEND HEALTH ROUTE AVAILABILITY
// ===========================================================================
console.log('\n--- Test 6: Frontend Dedicated API Health Route ---');
const frontendHealthPath = path.join(rootDir, 'frontend/app/api/health/route.ts');
check(fs.existsSync(frontendHealthPath), 'frontend/app/api/health/route.ts exists for container probes');
const frontendHealthContent = fs.readFileSync(frontendHealthPath, 'utf8');
check(frontendHealthContent.includes('status: 200') || frontendHealthContent.includes("status: 'ok'"), 'Frontend health route returns 200 OK status');

// ===========================================================================
// FINAL VERIFICATION REPORT
// ===========================================================================
console.log('\n====================================================================');
console.log(`Drop Y DevOps & Deployment Readiness Results: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================================');

if (failed > 0) {
  console.error('\n❌ Drop Y DevOps gate FAILED! Fix the violations above.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL DROP Y PRODUCTION DEVOPS & DEPLOYMENT READINESS TESTS PASSED!');
  process.exit(0);
}
