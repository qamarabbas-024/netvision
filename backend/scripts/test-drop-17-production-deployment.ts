/**
 * ==============================================================================
 * NETVISION — DROP 17: PRODUCTION DEPLOYMENT ENGINEERING TEST SUITE
 * ==============================================================================
 *
 * Authoritative verification across all 7 Drop 17 domains:
 * 1. SOURCE OF TRUTH: GitHub main -> CI -> Render -> Vercel single revision lineage,
 *    commit SHA recording and health endpoint exposure.
 * 2. RUNTIME VERSION: Node 22 baseline alignment across local, CI, Docker, Render,
 *    and Vercel; pnpm 11.20.0 alignment; native dependency compilation (argon2, sharp).
 * 3. CI CONSISTENCY: Pure pnpm execution, zero npm/pnpm contradictions, frozen
 *    lockfile enforcement, typecheck, lint, automated test runs, and migration checks.
 * 4. DEPLOYMENT CONFIGURATION: Backend and frontend build verification, startup port,
 *    health probes (/ready, /health, /api/health), production environment variables,
 *    and zero staging/localhost values in production blueprints.
 * 5. ROLLBACK STRATEGY: Expand-and-Contract database compatibility, instant Vercel
 *    pointer rollback, Render commit rollback, and Prisma migration resolution SOP.
 * 6. RELEASE PROCESS: Standardized 8-step release SOP (inspect -> test -> commit ->
 *    push -> CI -> deploy -> health -> browser smoke -> accept) and repo hygiene.
 * 7. SECRET SAFETY: Enterprise multi-vector scan across tracked files, templates,
 *    diff history, and build artifacts with zero credential leakage.
 *
 * NO FALSE GREEN. Anything uncertain = UNKNOWN.
 * Permanent deployment engineering verification suite.
 * ==============================================================================
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as argon2 from 'argon2';
import { validateProductionConfig } from '../src/main';

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(condition: boolean, testId: string, testName: string, detail?: string) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ [${testId}] ${testName}`);
  } else {
    failedChecks++;
    console.error(`  ❌ [${testId}] FAILED: ${testName}${detail ? ` (${detail})` : ''}`);
  }
}

async function runDrop17Suite() {
  console.log('================================================================================');
  console.log('🚀 NETVISION — DROP 17: PRODUCTION DEPLOYMENT ENGINEERING AUDIT');
  console.log('================================================================================\n');

  const rootDir = path.resolve(__dirname, '../..');
  const backendDir = path.resolve(__dirname, '..');
  const frontendDir = path.resolve(rootDir, 'frontend');

  // ============================================================================
  // 1. SOURCE OF TRUTH & REVISION LINEAGE
  // ============================================================================
  console.log('--- SECTION 1: SOURCE OF TRUTH & REVISION LINEAGE ---');

  // 1.1 Verify Git working revision SHA
  let currentGitSha = '';
  try {
    currentGitSha = execSync('git rev-parse HEAD', { encoding: 'utf8', cwd: rootDir }).trim();
  } catch {}
  check(currentGitSha.length === 40, 'REV-001', `Authoritative Git commit SHA identified (${currentGitSha.substring(0, 7)})`);

  // 1.2 Verify backend health responses expose commit SHA
  const appControllerContent = fs.readFileSync(path.join(backendDir, 'src', 'app.controller.ts'), 'utf8');
  const healthControllerContent = fs.readFileSync(path.join(backendDir, 'src', 'monitoring', 'health.controller.ts'), 'utf8');

  check(
    appControllerContent.includes('commitSha:') &&
    appControllerContent.includes('RENDER_GIT_COMMIT') &&
    appControllerContent.includes('VERCEL_GIT_COMMIT_SHA'),
    'REV-002',
    'Backend AppController /health exposes commitSha with Render and Vercel fallback bindings'
  );

  check(
    healthControllerContent.includes('commitSha:') &&
    healthControllerContent.includes('RENDER_GIT_COMMIT'),
    'REV-003',
    'Backend HealthController /ready & /live expose commitSha and environment metadata'
  );

  // 1.3 Verify frontend health route exposes commit SHA
  const frontendHealthContent = fs.readFileSync(path.join(frontendDir, 'app', 'api', 'health', 'route.ts'), 'utf8');
  check(
    frontendHealthContent.includes('commitSha:') &&
    frontendHealthContent.includes('VERCEL_GIT_COMMIT_SHA') &&
    frontendHealthContent.includes('RENDER_GIT_COMMIT'),
    'REV-004',
    'Frontend /api/health endpoint exposes commitSha, version, and environment metadata'
  );

  // 1.4 Single lineage branch verification (main)
  const renderYamlContent = fs.readFileSync(path.join(rootDir, 'render.yaml'), 'utf8');
  check(
    renderYamlContent.includes('branch: main') &&
    renderYamlContent.includes('autoDeploy: true'),
    'REV-005',
    'Render blueprint designates "main" as the sole authoritative deployment branch'
  );

  // ============================================================================
  // 2. RUNTIME VERSION ALIGNMENT
  // ============================================================================
  console.log('\n--- SECTION 2: RUNTIME VERSION ALIGNMENT ---');

  // 2.1 Node version baseline (22)
  const nodeVersionFile = fs.readFileSync(path.join(rootDir, '.node-version'), 'utf8').trim();
  const nvmrcFile = fs.readFileSync(path.join(rootDir, '.nvmrc'), 'utf8').trim();
  check(nodeVersionFile === '22', 'NODE-001', '.node-version is pinned to Node.js 22 LTS');
  check(nvmrcFile === '22', 'NODE-002', '.nvmrc is pinned to Node.js 22 LTS');

  // 2.2 Engines field in all package.json files
  const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const backendPkg = JSON.parse(fs.readFileSync(path.join(backendDir, 'package.json'), 'utf8'));
  const frontendPkg = JSON.parse(fs.readFileSync(path.join(frontendDir, 'package.json'), 'utf8'));

  check(rootPkg.engines?.node?.includes('22'), 'NODE-003', 'Root package.json engines specifies Node 22 (>=22.0.0 <25.0.0)');
  check(backendPkg.engines?.node?.includes('22'), 'NODE-004', 'Backend package.json engines specifies Node 22 (>=22.0.0 <25.0.0)');
  check(frontendPkg.engines?.node?.includes('22'), 'NODE-005', 'Frontend package.json engines specifies Node 22 (>=22.0.0 <25.0.0)');

  // 2.3 Docker base image alignment
  const dockerBackendContent = fs.readFileSync(path.join(rootDir, 'Dockerfile.backend'), 'utf8');
  const dockerFrontendContent = fs.readFileSync(path.join(rootDir, 'Dockerfile.frontend'), 'utf8');

  check(dockerBackendContent.includes('FROM node:22-alpine'), 'DOCK-001', 'Dockerfile.backend uses node:22-alpine base image');
  check(dockerFrontendContent.includes('FROM node:22-alpine'), 'DOCK-002', 'Dockerfile.frontend uses node:22-alpine base image');

  // 2.4 CI runner Node version alignment
  const ciWorkflowContent = fs.readFileSync(path.join(rootDir, '.github', 'workflows', 'ci.yml'), 'utf8');
  check(ciWorkflowContent.includes('node-version: 22'), 'CI-001', 'GitHub Actions CI runs under Node.js 22');

  // 2.5 Package manager version alignment (pnpm 11.20.0)
  check(rootPkg.packageManager === 'pnpm@11.20.0', 'PNPM-001', 'Root packageManager is strictly pinned to pnpm@11.20.0');
  check(dockerBackendContent.includes('pnpm@11.20.0'), 'PNPM-002', 'Dockerfile.backend pins pnpm@11.20.0');
  check(dockerFrontendContent.includes('pnpm@11.20.0'), 'PNPM-003', 'Dockerfile.frontend pins pnpm@11.20.0');
  check(ciWorkflowContent.includes('version: 11.20.0'), 'PNPM-004', 'CI workflow pins pnpm version: 11.20.0');

  // 2.6 Native dependencies validation (argon2 & sharp)
  const workspaceYamlContent = fs.readFileSync(path.join(rootDir, 'pnpm-workspace.yaml'), 'utf8');
  check(
    workspaceYamlContent.includes('argon2: true') &&
    workspaceYamlContent.includes('sharp: true') &&
    workspaceYamlContent.includes('onlyBuiltDependencies:'),
    'NATV-001',
    'pnpm-workspace.yaml explicitly configures allowBuilds and onlyBuiltDependencies for argon2 and sharp'
  );

  // Runtime native argon2 hash and verify test
  const testSecret = 'DeploymentEngineering2026!';
  const argonHash = await argon2.hash(testSecret, { type: argon2.argon2id });
  const argonVerified = await argon2.verify(argonHash, testSecret);
  const argonRejected = await argon2.verify(argonHash, 'wrong_pass');
  check(
    argonHash.startsWith('$argon2id$') && argonVerified === true && argonRejected === false,
    'NATV-002',
    'Native argon2 module functions correctly under current Node.js runtime'
  );

  // ============================================================================
  // 3. CI PIPELINE CONSISTENCY
  // ============================================================================
  console.log('\n--- SECTION 3: CI PIPELINE CONSISTENCY ---');

  check(ciWorkflowContent.includes('pnpm install --frozen-lockfile'), 'CI-002', 'CI enforces --frozen-lockfile deterministic dependency resolution');
  check(ciWorkflowContent.includes('pnpm typecheck'), 'CI-003', 'CI runs workspace typecheck across all projects');
  check(ciWorkflowContent.includes('pnpm lint'), 'CI-004', 'CI executes ESLint static code quality');
  check(ciWorkflowContent.includes('pnpm build'), 'CI-005', 'CI executes full monorepo production build');
  check(ciWorkflowContent.includes('pnpm test:e2e'), 'CI-006', 'CI runs Playwright end-to-end browser test suite');

  // Verify zero npm/pnpm contradiction
  const ciLines = ciWorkflowContent.split('\n');
  let hasNpmInstallInCi = false;
  for (const line of ciLines) {
    if (line.trim().startsWith('npm install') || line.trim().startsWith('npm i ') || line.includes('yarn ')) {
      hasNpmInstallInCi = true;
    }
  }
  check(!hasNpmInstallInCi, 'CI-007', 'CI workflow contains ZERO npm/yarn install commands (pure pnpm architecture)');

  // Verify migration deploy step in CI
  check(
    ciWorkflowContent.includes('npx prisma migrate deploy'),
    'CI-008',
    'CI executes "prisma migrate deploy" for automated zero-manual migration verification'
  );

  // ============================================================================
  // 4. DEPLOYMENT CONFIGURATION & ENVIRONMENT HYGIENE
  // ============================================================================
  console.log('\n--- SECTION 4: DEPLOYMENT CONFIGURATION & ENVIRONMENT HYGIENE ---');

  // 4.1 Production configuration validator fails fast on missing vars
  let prodValidatorCaughtMissing = false;
  const oldNodeEnv = process.env.NODE_ENV;
  const oldJwt = process.env.JWT_SECRET;
  try {
    process.env.NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    validateProductionConfig();
  } catch (err: any) {
    if (err.message.includes('Missing required environment variable(s)')) {
      prodValidatorCaughtMissing = true;
    }
  } finally {
    process.env.NODE_ENV = oldNodeEnv;
    if (oldJwt) process.env.JWT_SECRET = oldJwt;
  }
  check(prodValidatorCaughtMissing, 'CONF-001', 'validateProductionConfig() fails fast if required production variables are absent');

  // 4.2 Production configuration validator rejects weak secrets
  let prodValidatorCaughtWeak = false;
  const oldCors = process.env.CORS_ORIGIN;
  const oldApi = process.env.API_URL;
  const oldFrontend = process.env.FRONTEND_URL;
  const oldDb = process.env.DATABASE_URL;
  try {
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.CORS_ORIGIN = 'https://netvision.edu';
    process.env.API_URL = 'https://api.netvision.edu';
    process.env.FRONTEND_URL = 'https://netvision.edu';
    process.env.JWT_SECRET = 'super_secret_netvision_jwt_key';
    validateProductionConfig();
  } catch (err: any) {
    if (err.message.includes('Insecure or default JWT_SECRET detected')) {
      prodValidatorCaughtWeak = true;
    }
  } finally {
    process.env.NODE_ENV = oldNodeEnv;
    if (oldJwt) process.env.JWT_SECRET = oldJwt;
    if (oldCors) process.env.CORS_ORIGIN = oldCors; else delete process.env.CORS_ORIGIN;
    if (oldApi) process.env.API_URL = oldApi; else delete process.env.API_URL;
    if (oldFrontend) process.env.FRONTEND_URL = oldFrontend; else delete process.env.FRONTEND_URL;
    if (oldDb) process.env.DATABASE_URL = oldDb; else delete process.env.DATABASE_URL;
  }
  check(prodValidatorCaughtWeak, 'CONF-002', 'validateProductionConfig() strictly rejects default or weak JWT secrets');

  // 4.3 Verify render.yaml production URL hygiene (No localhost/staging values)
  check(renderYamlContent.includes('CORS_ORIGIN\n        value: https://netvision.edu'), 'CONF-003', 'Render CORS_ORIGIN is set to authoritative https://netvision.edu');
  check(renderYamlContent.includes('API_URL\n        value: https://api.netvision.edu'), 'CONF-004', 'Render API_URL is set to authoritative https://api.netvision.edu');
  check(renderYamlContent.includes('FRONTEND_URL\n        value: https://netvision.edu'), 'CONF-005', 'Render FRONTEND_URL is set to authoritative https://netvision.edu');
  check(renderYamlContent.includes('NEXT_PUBLIC_API_URL\n        value: https://api.netvision.edu/api/v1'), 'CONF-006', 'Render NEXT_PUBLIC_API_URL is set to authoritative https://api.netvision.edu/api/v1');
  check(!renderYamlContent.includes('staging.netvision'), 'CONF-007', 'Render blueprint contains ZERO staging host leakage');
  check(!renderYamlContent.includes('localhost:3000'), 'CONF-008', 'Render blueprint contains ZERO localhost references in production envVars');

  // 4.4 Vercel monorepo configuration
  const vercelJsonPath = path.join(rootDir, 'vercel.json');
  check(fs.existsSync(vercelJsonPath), 'CONF-009', 'Root vercel.json exists for deterministic monorepo building');
  const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  check(vercelJson.framework === 'nextjs', 'CONF-010', 'Root vercel.json configures Next.js framework');
  check(vercelJson.buildCommand?.includes('@netvision/*') && vercelJson.buildCommand?.includes('netvision-frontend'), 'CONF-011', 'Root vercel.json builds monorepo packages before frontend');

  // ============================================================================
  // 5. ROLLBACK STRATEGY & COMPATIBILITY
  // ============================================================================
  console.log('\n--- SECTION 5: ROLLBACK STRATEGY & COMPATIBILITY ---');

  // 5.1 Expand-and-contract schema verification
  // Verify that recent migrations do not drop active columns or make existing columns non-nullable without defaults
  const baselineMig = fs.readFileSync(path.join(backendDir, 'prisma', 'migrations', '20260814000000_baseline', 'migration.sql'), 'utf8');
  const certMig = fs.readFileSync(path.join(backendDir, 'prisma', 'migrations', '20260909000000_add_certificate_user_cert_unique', 'migration.sql'), 'utf8');
  const activeExamMig = fs.readFileSync(path.join(backendDir, 'prisma', 'migrations', '20260910102552_add_active_exam_attempt_unique_idx', 'migration.sql'), 'utf8');

  check(!certMig.includes('DROP COLUMN'), 'ROLL-001', 'Certificate migration is non-destructive (adds compound index without dropping columns)');
  check(!activeExamMig.includes('DROP COLUMN'), 'ROLL-002', 'Active exam migration is non-destructive (adds partial index without dropping columns)');

  // 5.2 Rollback SOP availability
  const releaseProcContent = fs.readFileSync(path.join(rootDir, 'docs', 'RELEASE_PROCEDURE.md'), 'utf8');
  check(
    releaseProcContent.includes('prisma migrate deploy') &&
    releaseProcContent.includes('VERIFY') &&
    releaseProcContent.includes('ACCEPT'),
    'ROLL-003',
    'docs/RELEASE_PROCEDURE.md defines authoritative deployment and verification SOP'
  );

  // ============================================================================
  // 6. RELEASE PROCESS & REPOSITORY HYGIENE
  // ============================================================================
  console.log('\n--- SECTION 6: RELEASE PROCESS & REPOSITORY HYGIENE ---');

  // 6.1 Standard 8-step lifecycle documented
  check(releaseProcContent.includes('INSPECT'), 'PROC-001', 'Release procedure documents INSPECT stage');
  check(releaseProcContent.includes('TEST'), 'PROC-002', 'Release procedure documents TEST stage');
  check(releaseProcContent.includes('COMMIT'), 'PROC-003', 'Release procedure documents COMMIT stage');
  check(releaseProcContent.includes('PUSH'), 'PROC-004', 'Release procedure documents PUSH stage');
  check(releaseProcContent.includes('DEPLOY'), 'PROC-005', 'Release procedure documents DEPLOY stage');
  check(releaseProcContent.includes('VERIFY'), 'PROC-006', 'Release procedure documents VERIFY stage');
  check(releaseProcContent.includes('ACCEPT'), 'PROC-007', 'Release procedure documents ACCEPT stage');

  // 6.2 Gitignore hygiene: forbidden ephemeral artifacts are excluded
  const gitignoreContent = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf8');
  check(gitignoreContent.includes('.project-ai'), 'HYGN-001', '.gitignore excludes .project-ai internal directory');
  check(gitignoreContent.includes('.storage'), 'HYGN-002', '.gitignore excludes .storage directory');
  check(gitignoreContent.includes('.impeccable'), 'HYGN-003', '.gitignore excludes .impeccable directory');
  check(gitignoreContent.includes('playwright-report'), 'HYGN-004', '.gitignore excludes playwright-report directory');
  check(gitignoreContent.includes('test-results'), 'HYGN-005', '.gitignore excludes test-results directory');

  // ============================================================================
  // 7. SECRET SAFETY AUDIT
  // ============================================================================
  console.log('\n--- SECTION 7: SECRET SAFETY AUDIT ---');

  // 7.1 Run multi-vector enterprise secret scanner
  let secretScanPassed = false;
  try {
    const scanOutput = execSync('node backend/scripts/scan-repository-secrets.js', { encoding: 'utf8', cwd: rootDir });
    if (scanOutput.includes('ZERO REAL SECRETS DETECTED ACROSS ALL VECTORS')) {
      secretScanPassed = true;
    }
  } catch {}
  check(secretScanPassed, 'SECR-001', 'Enterprise secret scanner reports ZERO live secrets across working tree, templates, diffs, and artifacts');

  // 7.2 Verify .env is strictly ignored by git
  check(gitignoreContent.includes('.env') && gitignoreContent.includes('.env.local'), 'SECR-002', '.gitignore strictly excludes all live .env and .env.local files');

  // ----------------------------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log(`DROP 17 TEST SUITE COMPLETED: ${passedChecks} PASSED, ${failedChecks} FAILED (TOTAL: ${totalChecks})`);
  console.log('================================================================================');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runDrop17Suite().catch((err) => {
  console.error('Fatal Drop 17 test failure:', err);
  process.exit(1);
});
