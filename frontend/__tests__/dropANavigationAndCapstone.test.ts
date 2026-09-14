import fs from 'fs';
import path from 'path';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[DropATestAssertionFailed] ${message}`);
  }
}

export function runDropANavigationAndCapstoneTests() {
  console.log('--- Running Drop A: CI Stability, Capstone Reconciliation & Navigation Alignment Tests ---');

  const rootDir = path.resolve(__dirname, '../../');

  // =========================================================================
  // 1. CANONICAL FIVE FLAGSHIP COURSE LINKS
  // =========================================================================
  console.log('  Testing 1: Canonical 5 Flagship Courses & Slugs...');
  assert(FLAGSHIP_5_COURSES.length === 5, `Expected 5 flagship courses, got ${FLAGSHIP_5_COURSES.length}`);

  const expectedSlugs = [
    'foundations-network-architecture',
    'ethernet-switching-ip-networking',
    'transport-routing-network-services',
    'network-security-secure-connectivity',
    'network-engineering-automation-troubleshooting',
  ];

  FLAGSHIP_5_COURSES.forEach((course, idx) => {
    assert(
      course.slug === expectedSlugs[idx],
      `Course ${course.code} slug mismatch: expected ${expectedSlugs[idx]}, got ${course.slug}`
    );
  });

  const curriculumSectionPath = path.join(rootDir, 'frontend/components/landing/CurriculumSection.tsx');
  const curriculumSectionContent = fs.readFileSync(curriculumSectionPath, 'utf-8');

  // Must contain all 5 canonical slugs
  for (const slug of expectedSlugs) {
    assert(
      curriculumSectionContent.includes(slug),
      `CurriculumSection.tsx must contain canonical course slug: ${slug}`
    );
  }

  // Must NOT contain any fabricated legacy slugs
  const fabricatedSlugs = [
    'nv-c01-digital-communication-physical-bitstream',
    'nv-c02-ethernet-frame-encapsulation-switching-dynamics',
    'nv-c03-ip-addressing-vlsm-routing-fundamentals',
    'nv-c04-transport-layer-reliability-sockets',
  ];
  for (const badSlug of fabricatedSlugs) {
    assert(
      !curriculumSectionContent.includes(badSlug),
      `CurriculumSection.tsx must NOT contain fabricated slug: ${badSlug}`
    );
  }
  console.log('    ✓ All five canonical course links verified in CurriculumSection without fabricated slugs.');

  // Check LiveObservatorySection.tsx
  const liveObservatoryPath = path.join(rootDir, 'frontend/components/landing/LiveObservatorySection.tsx');
  const liveObservatoryContent = fs.readFileSync(liveObservatoryPath, 'utf-8');
  assert(
    !liveObservatoryContent.includes('net-101-digital-foundations') &&
    !liveObservatoryContent.includes('net-201-layer2-ethernet') &&
    !liveObservatoryContent.includes('net-301-vlan-switching'),
    'LiveObservatorySection must not reference legacy decommissioned slugs'
  );
  assert(
    liveObservatoryContent.includes('foundations-network-architecture') &&
    liveObservatoryContent.includes('ethernet-switching-ip-networking') &&
    liveObservatoryContent.includes('transport-routing-network-services'),
    'LiveObservatorySection must reference canonical flagship slugs'
  );
  console.log('    ✓ LiveObservatorySection verified with canonical flagship slugs.');

  // Check Navigation.tsx
  const navPath = path.join(rootDir, 'frontend/components/landing/Navigation.tsx');
  const navContent = fs.readFileSync(navPath, 'utf-8');
  assert(
    !navContent.includes('net-101-digital-foundations') &&
    !navContent.includes('net-201-layer2-ethernet'),
    'Navigation.tsx must not reference legacy decommissioned slugs'
  );
  assert(
    navContent.includes('foundations-network-architecture') &&
    navContent.includes('ethernet-switching-ip-networking'),
    'Navigation.tsx must reference canonical flagship slugs'
  );
  console.log('    ✓ Navigation dropdown verified with canonical flagship links.');

  // =========================================================================
  // 2. NO OBSOLETE "SEVEN-STAGE" MARKETING LANGUAGE
  // =========================================================================
  console.log('  Testing 2: Removal of Contradictory "Seven-Stage" Marketing Copy...');

  assert(
    !curriculumSectionContent.includes('Seven-Stage Mastery Pathway') &&
    !curriculumSectionContent.includes('7-STAGE MASTERY TRACK'),
    'CurriculumSection.tsx must not advertise an obsolete Seven-Stage Pathway'
  );

  const heroPath = path.join(rootDir, 'frontend/components/landing/HeroSection.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');
  assert(
    !heroContent.includes('7 Stages'),
    'HeroSection.tsx must not claim "7 Stages"'
  );
  assert(
    heroContent.includes('5 Courses'),
    'HeroSection.tsx must represent "5 Courses"'
  );

  assert(
    !navContent.includes('7 core pathways') && !navContent.includes('38 networking courses'),
    'Navigation.tsx must not claim 38 courses or 7 core pathways'
  );

  const pagePath = path.join(rootDir, 'frontend/app/page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  assert(
    !pageContent.includes('The Seven-Stage Mastery Pathway'),
    'app/page.tsx must not reference The Seven-Stage Mastery Pathway'
  );
  console.log('    ✓ All contradictory Seven-Stage marketing claims removed and aligned to 5 Flagship Courses + Capstone.');

  // =========================================================================
  // 3. CAPSTONE CLIENT/SERVER STATE RECONCILIATION & REFRESH INTEGRITY
  // =========================================================================
  console.log('  Testing 3: Capstone Client/Server State Reconciliation...');
  const capstonePagePath = path.join(rootDir, 'frontend/app/certifications/capstone/page.tsx');
  const capstoneContent = fs.readFileSync(capstonePagePath, 'utf-8');

  // Ensure completed attempts reconcile to RESULT view unless user explicitly clicked PORTAL
  assert(
    capstoneContent.includes("storedLastView !== 'PORTAL'"),
    'capstone/page.tsx must reconcile completed attempt to RESULT view when storedLastView is not PORTAL'
  );

  // Ensure answer preservation effect exists
  assert(
    capstoneContent.includes('nv_capstone_draft_'),
    'capstone/page.tsx must save and restore candidate draft answers across refreshes'
  );

  // Ensure Return to Exam Portal button records PORTAL in sessionStorage
  assert(
    capstoneContent.includes("sessionStorage.setItem('nv_capstone_view', 'PORTAL')"),
    'capstone/page.tsx Return to Exam Portal button must explicitly set PORTAL in sessionStorage'
  );
  console.log('    ✓ Capstone client/server state reconciliation and answer persistence verified.');

  // =========================================================================
  // 4. 404 NAVIGATION INTEGRITY
  // =========================================================================
  console.log('  Testing 4: 404 Not-Found Navigation Routing...');
  const notFoundPath = path.join(rootDir, 'frontend/app/not-found.tsx');
  const notFoundContent = fs.readFileSync(notFoundPath, 'utf-8');

  // Must link Return to Dashboard directly to /dashboard
  assert(
    notFoundContent.includes('href="/dashboard"'),
    'not-found.tsx Return to Dashboard button must link to /dashboard'
  );
  assert(
    notFoundContent.includes('href="/"'),
    'not-found.tsx must provide a Return to Home link to /'
  );
  console.log('    ✓ 404 page correctly routes Return to Dashboard to /dashboard and Return to Home to /.');

  console.log('  ✓ Drop A Regression Tests Passed 100%.\n');
}
