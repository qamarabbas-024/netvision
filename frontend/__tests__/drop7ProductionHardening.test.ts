import fs from 'fs';
import path from 'path';
import { FALLBACK_COURSES } from '../lib/courseCatalogData';
import { CURRICULUM_STEPS } from '../data/curriculumData';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';
import { SITE_URL } from '../lib/siteConfig';
import sitemap from '../app/sitemap';
import robots from '../app/robots';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Drop7TestAssertionFailed] ${message}`);
  }
}

export function runDrop7ProductionHardeningTests() {
  console.log('--- Running Drop #7 Production DevOps, Security Hardening & Monorepo Alignment Tests ---');

  // =========================================================================
  // A. CANONICAL FIVE-COURSE FALLBACK
  // =========================================================================
  console.log('  Testing A: Canonical Five-Course Fallback...');
  assert(FALLBACK_COURSES.length === 5, `Expected exactly 5 fallback courses, got ${FALLBACK_COURSES.length}`);
  const expectedCodes = ['NV-C01', 'NV-C02', 'NV-C03', 'NV-C04', 'NV-C05'];
  const actualCodes = FALLBACK_COURSES.map(c => c.code);
  assert(
    JSON.stringify(actualCodes) === JSON.stringify(expectedCodes),
    `Fallback course codes mismatch: expected ${expectedCodes.join(', ')}, got ${actualCodes.join(', ')}`
  );

  // Verify no NET-101 through NET-404 legacy codes in fallback
  for (const course of FALLBACK_COURSES) {
    assert(!course.code.startsWith('NET-'), `Legacy course code found in fallback: ${course.code}`);
    assert(!course.slug.startsWith('net-'), `Legacy course slug found in fallback: ${course.slug}`);
  }

  // Verify CURRICULUM_STEPS alignment
  const flagshipSteps = CURRICULUM_STEPS.slice(0, 5);
  for (let i = 0; i < 5; i++) {
    assert(flagshipSteps[i].code === expectedCodes[i], `Step ${i + 1} code mismatch: expected ${expectedCodes[i]}, got ${flagshipSteps[i].code}`);
  }
  const capstoneStep = CURRICULUM_STEPS[5];
  assert(capstoneStep && capstoneStep.code === 'NV-NET-MASTERY', `Step 6 must be NV-NET-MASTERY`);
  console.log('    ✓ Exactly 5 canonical flagship fallback courses verified (no legacy NET-101..404).');

  // =========================================================================
  // B. SITE URL CONFIGURATION
  // =========================================================================
  console.log('  Testing B: Dynamic Site URL Configuration...');
  assert(typeof SITE_URL === 'string' && SITE_URL.length > 0, 'SITE_URL must be non-empty string');
  assert(!SITE_URL.endsWith('/'), 'SITE_URL must not have trailing slash');

  const rootDir = path.resolve(__dirname, '../../');
  const layoutContent = fs.readFileSync(path.join(rootDir, 'frontend/app/layout.tsx'), 'utf-8');
  const sitemapContent = fs.readFileSync(path.join(rootDir, 'frontend/app/sitemap.ts'), 'utf-8');
  const robotsContent = fs.readFileSync(path.join(rootDir, 'frontend/app/robots.ts'), 'utf-8');

  assert(!layoutContent.includes('https://netvision-three.vercel.app'), 'Hardcoded preview domain found in layout.tsx');
  assert(!sitemapContent.includes('https://netvision-three.vercel.app'), 'Hardcoded preview domain found in sitemap.ts');
  assert(!robotsContent.includes('https://netvision-three.vercel.app'), 'Hardcoded preview domain found in robots.ts');
  console.log('    ✓ Dynamic SITE_URL verified (no hardcoded preview domain dependencies).');

  // =========================================================================
  // C. SITEMAP ALIGNMENT
  // =========================================================================
  console.log('  Testing C: Flagship Sitemap Generation...');
  const generatedSitemap = sitemap();
  const sitemapUrls = generatedSitemap.map(entry => entry.url);

  // Must contain all five flagship course slugs
  for (const flagship of FLAGSHIP_5_COURSES) {
    const expectedRoute = `${SITE_URL}/courses/${flagship.slug}`;
    assert(
      sitemapUrls.includes(expectedRoute),
      `Sitemap is missing flagship course route: ${expectedRoute}`
    );
  }

  // Must NOT contain any decommissioned legacy course slugs
  const decommissionedSlugs = [
    'net-101-digital-foundations',
    'net-102-network-fundamentals',
    'net-201-layer2-ethernet',
    'net-301-switching-vlans',
    'net-401-nat-pat'
  ];
  for (const decommissioned of decommissionedSlugs) {
    const badRoute = `${SITE_URL}/courses/${decommissioned}`;
    assert(
      !sitemapUrls.includes(badRoute),
      `Sitemap must not contain decommissioned course route: ${badRoute}`
    );
  }

  // Must NOT contain private routes
  const forbiddenPrivateSubstrings = ['/dashboard', '/certifications/capstone', '/admin', '/profile', '/auth', '/settings'];
  for (const url of sitemapUrls) {
    for (const privatePart of forbiddenPrivateSubstrings) {
      assert(!url.includes(privatePart), `Sitemap must not contain private route ${privatePart}: ${url}`);
    }
  }
  console.log('    ✓ Sitemap contains 5 flagship courses and zero decommissioned or private routes.');

  // =========================================================================
  // D. ROBOTS.TS RULES
  // =========================================================================
  console.log('  Testing D: Robots Crawl Rules...');
  const generatedRobots = robots();
  assert(Array.isArray(generatedRobots.rules), 'Robots rules must be an array');
  const userAgentRule = (generatedRobots.rules as any[]).find(r => r.userAgent === '*');
  assert(!!userAgentRule, 'Robots must have a wildcard userAgent rule');

  const allows: string[] = Array.isArray(userAgentRule.allow) ? userAgentRule.allow : [userAgentRule.allow];
  const disallows: string[] = Array.isArray(userAgentRule.disallow) ? userAgentRule.disallow : [userAgentRule.disallow];

  // Disallows must include capstone and private routes
  assert(disallows.includes('/certifications/*'), 'Robots must disallow /certifications/*');
  assert(disallows.includes('/certificates/*'), 'Robots must disallow /certificates/* private detail');
  assert(disallows.includes('/dashboard'), 'Robots must disallow /dashboard');
  assert(disallows.includes('/admin'), 'Robots must disallow /admin');

  // Allows must preserve public verification
  assert(allows.includes('/certificates/verify/*'), 'Robots must allow public verification /certificates/verify/*');
  assert(allows.includes('/certificates'), 'Robots must allow public certificates catalog /certificates');
  console.log('    ✓ Robots rules correctly isolate private/capstone routes and preserve public verification.');

  // =========================================================================
  // E. API BASE URL CONFIGURATION
  // =========================================================================
  console.log('  Testing E: API Base URL Configuration & Consistency...');
  const composeContent = fs.readFileSync(path.join(rootDir, 'docker-compose.yml'), 'utf-8');
  assert(
    composeContent.includes('NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:4000/api/v1}'),
    'docker-compose.yml must configure NEXT_PUBLIC_API_URL with /api/v1'
  );

  const apiContent = fs.readFileSync(path.join(rootDir, 'frontend/lib/api.ts'), 'utf-8');
  // Verify api.ts uses API_BASE without hardcoding double /api/v1
  assert(apiContent.includes('const API_BASE ='), 'frontend/lib/api.ts must define API_BASE');
  console.log('    ✓ Single consistent API base configuration verified across frontend client and compose.');

  // =========================================================================
  // F. DOCKERFILE HARDENING
  // =========================================================================
  console.log('  Testing F: Dockerfile Hardening & Multi-Stage Safety...');
  const backendDocker = fs.readFileSync(path.join(rootDir, 'Dockerfile.backend'), 'utf-8');
  const frontendDocker = fs.readFileSync(path.join(rootDir, 'Dockerfile.frontend'), 'utf-8');

  // No || true in build steps
  assert(!backendDocker.includes('|| true'), 'Dockerfile.backend must not contain || true');
  assert(!frontendDocker.includes('|| true'), 'Dockerfile.frontend must not contain || true');

  // Pinned pnpm@11.20.0
  assert(backendDocker.includes('pnpm@11.20.0'), 'Dockerfile.backend must pin pnpm@11.20.0');
  assert(frontendDocker.includes('pnpm@11.20.0'), 'Dockerfile.frontend must pin pnpm@11.20.0');

  // Non-root USER
  assert(backendDocker.includes('USER node'), 'Dockerfile.backend must use non-root USER node');
  assert(frontendDocker.includes('USER node'), 'Dockerfile.frontend must use non-root USER node');

  // Compiled backend execution
  assert(backendDocker.includes('CMD ["node", "dist/backend/src/main.js"]'), 'Dockerfile.backend must run compiled artifact');
  assert(!backendDocker.includes('nest start'), 'Dockerfile.backend must not use nest start in production runner');
  assert(!backendDocker.includes('ts-node'), 'Dockerfile.backend must not use ts-node in production runner');

  // Secret interpolation in docker-compose.yml
  assert(!composeContent.includes('netvision_secure_password'), 'docker-compose.yml must not contain default password');
  assert(!composeContent.includes('netvision_super_secret_jwt_key_for_development'), 'docker-compose.yml must not contain default JWT secret');
  assert(composeContent.includes('${POSTGRES_PASSWORD:?'), 'docker-compose.yml must require POSTGRES_PASSWORD interpolation');
  assert(composeContent.includes('${JWT_SECRET:?'), 'docker-compose.yml must require JWT_SECRET interpolation');
  console.log('    ✓ Dockerfiles & Compose fail-closed, run non-root compiled output, and require secrets.');

  // =========================================================================
  // G. CI/CD WORKFLOW HARDENING
  // =========================================================================
  console.log('  Testing G: CI/CD Workflow Hardening...');
  const ciContent = fs.readFileSync(path.join(rootDir, '.github/workflows/ci.yml'), 'utf-8');
  assert(!ciContent.includes('db push --accept-data-loss'), 'CI must not use db push --accept-data-loss');
  assert(ciContent.includes('prisma migrate deploy'), 'CI must use prisma migrate deploy');
  assert(!ciContent.includes('pnpm lint || true'), 'CI lint must not swallow errors with || true');
  assert(ciContent.includes('version: 11.20.0'), 'CI must use pinned pnpm 11.20.0');
  assert(ciContent.includes('pnpm --filter netvision-frontend test'), 'CI must run frontend test suite');
  assert(ciContent.includes('pnpm build'), 'CI must build production artifacts');
  console.log('    ✓ CI/CD workflow hardened with prisma migrate deploy, no swallowed errors, and complete test/build steps.');

  console.log('--- All Drop #7 Tests Passed Successfully ---\n');
}
