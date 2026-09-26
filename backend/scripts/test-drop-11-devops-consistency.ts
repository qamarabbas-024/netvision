/**
 * NETVISION — DROP 11: DEVOPS, REPOSITORY HYGIENE & ENVIRONMENT CONSISTENCY
 * VERIFICATION TEST SUITE
 *
 * Validates:
 * 1. Node.js runtime alignment (Node 22 LTS across .nvmrc, .node-version, package.json engines, CI, and Docker).
 * 2. Package manager consistency (pnpm 11.20.0 across root, CI, and container definitions).
 * 3. Native dependency verification (argon2 hash & verify passes under target runtime).
 * 4. Docker multi-stage build alignment (node:22-alpine base, healthcheck probes, migration dependencies).
 * 5. CI workflow integrity (GitHub Actions uses Node 22, pnpm, frozen lockfiles, typecheck, lint, test, secret scan).
 * 6. Cloud hosting alignment (render.yaml IaC blueprint and frontend/vercel.json).
 * 7. Environment variable parity (.env.example templates for backend and frontend).
 * 8. Repository hygiene and secrets auditing (zero tracked .project-ai, .env, .pyc, or hardcoded C:\ paths).
 * 9. Explicit 7-stage release procedure documentation (docs/RELEASE_PROCEDURE.md).
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as argon2 from 'argon2';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runDrop11DevOpsTests() {
  console.log('================================================================');
  console.log('🚀 NETVISION — DROP 11: DEVOPS, HYGIENE & ENVIRONMENT AUDIT');
  console.log('================================================================\n');

  let testCount = 0;
  const rootDir = path.resolve(__dirname, '..', '..');

  // ---------------------------------------------------------------------------
  // TEST 1: Node & Package Manager Runtime Alignment
  // ---------------------------------------------------------------------------
  console.log('--- TEST 1: NODE & PACKAGE MANAGER RUNTIME ALIGNMENT ---');
  testCount++;
  {
    // .nvmrc
    const nvmrcPath = path.join(rootDir, '.nvmrc');
    assert(fs.existsSync(nvmrcPath), '.nvmrc exists in repository root');
    const nvmrcContent = fs.readFileSync(nvmrcPath, 'utf-8').trim();
    assert(nvmrcContent === '22', `.nvmrc specifies Node 22 (actual: "${nvmrcContent}")`);

    // .node-version
    const nodeVerPath = path.join(rootDir, '.node-version');
    assert(fs.existsSync(nodeVerPath), '.node-version exists in repository root');
    const nodeVerContent = fs.readFileSync(nodeVerPath, 'utf-8').trim();
    assert(nodeVerContent === '22', `.node-version specifies Node 22 (actual: "${nodeVerContent}")`);

    // Root package.json
    const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    assert(rootPkg.packageManager === 'pnpm@11.20.0', `Root packageManager is pnpm@11.20.0 (actual: "${rootPkg.packageManager}")`);
    assert(rootPkg.engines?.node?.includes('22'), `Root package.json engines.node specifies Node 22 (actual: "${rootPkg.engines?.node}")`);

    // Backend package.json
    const backendPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'backend', 'package.json'), 'utf-8'));
    assert(backendPkg.engines?.node?.includes('22'), `Backend package.json engines.node specifies Node 22 (actual: "${backendPkg.engines?.node}")`);

    // Frontend package.json
    const frontendPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'frontend', 'package.json'), 'utf-8'));
    assert(frontendPkg.engines?.node?.includes('22'), `Frontend package.json engines.node specifies Node 22 (actual: "${frontendPkg.engines?.node}")`);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Native Module Compatibility (argon2)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 2: NATIVE MODULE COMPATIBILITY (argon2) ---');
  testCount++;
  {
    const testSecret = 'NetVision_DevOps_Test_Password_123!';
    const hash = await argon2.hash(testSecret, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
    assert(typeof hash === 'string' && hash.startsWith('$argon2id$'), 'Native argon2id hash created successfully');

    const isValid = await argon2.verify(hash, testSecret);
    assert(isValid === true, 'Native argon2id verification succeeded under Node runtime');

    const isInvalid = await argon2.verify(hash, 'wrong_password');
    assert(isInvalid === false, 'Native argon2id correctly rejected invalid candidate');
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Docker Multi-Stage Container & Compose Alignment
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 3: DOCKER CONTAINER & COMPOSE ALIGNMENT ---');
  testCount++;
  {
    // Dockerfile.backend
    const dockerBackend = fs.readFileSync(path.join(rootDir, 'Dockerfile.backend'), 'utf-8');
    assert(dockerBackend.includes('FROM node:22-alpine AS builder'), 'Dockerfile.backend builder uses node:22-alpine');
    assert(dockerBackend.includes('FROM node:22-alpine AS runner'), 'Dockerfile.backend runner uses node:22-alpine');
    assert(dockerBackend.includes('pnpm@11.20.0'), 'Dockerfile.backend installs pnpm@11.20.0');
    assert(dockerBackend.includes('HEALTHCHECK'), 'Dockerfile.backend defines container HEALTHCHECK');
    assert(dockerBackend.includes('/ready'), 'Dockerfile.backend healthcheck targets /ready readiness probe');

    // Dockerfile.frontend
    const dockerFrontend = fs.readFileSync(path.join(rootDir, 'Dockerfile.frontend'), 'utf-8');
    assert(dockerFrontend.includes('FROM node:22-alpine AS builder'), 'Dockerfile.frontend builder uses node:22-alpine');
    assert(dockerFrontend.includes('FROM node:22-alpine AS runner'), 'Dockerfile.frontend runner uses node:22-alpine');
    assert(dockerFrontend.includes('pnpm@11.20.0'), 'Dockerfile.frontend installs pnpm@11.20.0');
    assert(dockerFrontend.includes('/api/health'), 'Dockerfile.frontend healthcheck targets /api/health probe');

    // docker-compose.yml
    const composeContent = fs.readFileSync(path.join(rootDir, 'docker-compose.yml'), 'utf-8');
    assert(composeContent.includes('service_healthy'), 'docker-compose enforces service_healthy dependency condition');
    assert(composeContent.includes('service_completed_successfully'), 'docker-compose migration dependency condition verified');
    assert(composeContent.includes('redis:7-alpine'), 'docker-compose includes Redis service');
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Continuous Integration Workflow Audit (.github/workflows/ci.yml)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 4: CONTINUOUS INTEGRATION WORKFLOW AUDIT ---');
  testCount++;
  {
    const ciPath = path.join(rootDir, '.github', 'workflows', 'ci.yml');
    assert(fs.existsSync(ciPath), 'CI workflow exists at .github/workflows/ci.yml');
    const ciContent = fs.readFileSync(ciPath, 'utf-8');

    assert(ciContent.includes('node-version: 22'), 'CI workflow uses Node.js 22');
    assert(ciContent.includes('version: 11.20.0'), 'CI workflow uses pnpm 11.20.0');
    assert(ciContent.includes('--frozen-lockfile'), 'CI workflow uses --frozen-lockfile for deterministic installs');
    assert(ciContent.includes('pnpm typecheck'), 'CI workflow enforces TypeScript typechecking across all projects');
    assert(ciContent.includes('pnpm lint'), 'CI workflow enforces ESLint quality gates');
    assert(ciContent.includes('scan-repository-secrets.js'), 'CI workflow enforces automated secrets scanning');
    assert(ciContent.includes('pnpm --filter netvision-frontend test'), 'CI workflow executes frontend test suites');
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Cloud Hosting Alignment (Render & Vercel)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 5: CLOUD HOSTING ALIGNMENT (Render & Vercel) ---');
  testCount++;
  {
    // render.yaml
    const renderPath = path.join(rootDir, 'render.yaml');
    assert(fs.existsSync(renderPath), 'render.yaml exists in repository root');
    const renderContent = fs.readFileSync(renderPath, 'utf-8');
    assert(renderContent.includes('name: netvision-backend'), 'render.yaml defines netvision-backend service');
    assert(renderContent.includes('healthCheckPath: /ready'), 'render.yaml specifies /ready healthcheck path');
    assert(renderContent.includes('name: netvision-redis'), 'render.yaml includes managed Redis instance');

    // frontend/vercel.json
    const vercelPath = path.join(rootDir, 'frontend', 'vercel.json');
    assert(fs.existsSync(vercelPath), 'frontend/vercel.json exists');
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
    assert(vercelConfig.framework === 'nextjs', 'vercel.json specifies Next.js framework');

    // Environment templates
    const backendEnv = fs.readFileSync(path.join(rootDir, 'backend', '.env.example'), 'utf-8');
    assert(backendEnv.includes('DATABASE_URL='), 'backend/.env.example documents DATABASE_URL');
    assert(backendEnv.includes('DIRECT_URL='), 'backend/.env.example documents DIRECT_URL for migrations');
    assert(backendEnv.includes('REDIS_URL='), 'backend/.env.example documents REDIS_URL');
    assert(backendEnv.includes('JWT_SECRET='), 'backend/.env.example documents JWT_SECRET');

    const frontendEnv = fs.readFileSync(path.join(rootDir, 'frontend', '.env.example'), 'utf-8');
    assert(frontendEnv.includes('NEXT_PUBLIC_API_URL='), 'frontend/.env.example documents NEXT_PUBLIC_API_URL');
    assert(frontendEnv.includes('NEXT_PUBLIC_SITE_URL='), 'frontend/.env.example documents NEXT_PUBLIC_SITE_URL');
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Repository Hygiene & Artifact Defense
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 6: REPOSITORY HYGIENE & SECRETS AUDIT ---');
  testCount++;
  {
    // Verify .gitignore rules
    const gitignore = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf-8');
    assert(gitignore.includes('.project-ai/'), '.gitignore blocks .project-ai/');
    assert(gitignore.includes('test-results/'), '.gitignore blocks test-results/');
    assert(gitignore.includes('playwright-report/'), '.gitignore blocks playwright-report/');
    assert(gitignore.includes('__pycache__/'), '.gitignore blocks Python __pycache__/');
    assert(gitignore.includes('.env'), '.gitignore blocks .env files');

    // Run git ls-files to verify no forbidden files are tracked
    let trackedOutput = '';
    try {
      trackedOutput = execSync('git ls-files .project-ai playwright-report test-results .storage .impeccable', {
        cwd: rootDir,
        encoding: 'utf-8',
      }).trim();
    } catch {
      // Ignored if git is not available or clean
    }
    assert(trackedOutput === '', `Zero internal or test artifact files tracked by git (actual: "${trackedOutput}")`);

    // Verify zero tracked .env secret files
    const trackedEnv = execSync('git ls-files "*.env*"', { cwd: rootDir, encoding: 'utf-8' })
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const nonExampleEnv = trackedEnv.filter((f) => !f.endsWith('.example'));
    assert(nonExampleEnv.length === 0, `Zero real .env files tracked in git (found: ${nonExampleEnv.join(', ')})`);

    // Verify zero hardcoded Windows local user paths in tracked files
    let localPathHits: string[] = [];
    try {
      const grepRes = execSync('git grep -i "C:\\\\Users"', { cwd: rootDir, encoding: 'utf-8' });
      localPathHits = grepRes.split('\n').filter(Boolean);
    } catch {
      // Exit code 1 means 0 matches found — perfect!
    }
    assert(localPathHits.length === 0, `Zero hardcoded local user paths (C:\\Users) in tracked files (hits: ${localPathHits.length})`);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Release Procedure Specification (docs/RELEASE_PROCEDURE.md)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 7: RELEASE PROCEDURE SPECIFICATION ---');
  testCount++;
  {
    const releaseDocPath = path.join(rootDir, 'docs', 'RELEASE_PROCEDURE.md');
    assert(fs.existsSync(releaseDocPath), 'docs/RELEASE_PROCEDURE.md exists');
    const docContent = fs.readFileSync(releaseDocPath, 'utf-8');

    assert(docContent.includes('1. INSPECT'), 'Documents INSPECT stage');
    assert(docContent.includes('2. TEST'), 'Documents TEST stage');
    assert(docContent.includes('3. COMMIT'), 'Documents COMMIT stage');
    assert(docContent.includes('4. PUSH'), 'Documents PUSH stage');
    assert(docContent.includes('5. DEPLOY'), 'Documents DEPLOY stage');
    assert(docContent.includes('6. VERIFY'), 'Documents VERIFY stage');
    assert(docContent.includes('7. ACCEPT'), 'Documents ACCEPT stage');
    assert(docContent.includes('NEVER FORCE-PUSH'), 'Explicitly mandates NEVER FORCE-PUSH on main');
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL ${testCount} DEVOPS, HYGIENE & ENVIRONMENT CONSISTENCY TESTS PASSED`);
  console.log('================================================================');
}

runDrop11DevOpsTests().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
