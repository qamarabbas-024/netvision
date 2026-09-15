import fs from 'fs';
import path from 'path';
import { FLAGSHIP_5_COURSES, CANONICAL_CREDENTIALS } from '@netvision/shared';
import sitemap from '../app/sitemap';
import robots from '../app/robots';
import { SITE_URL } from '../lib/siteConfig';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[DropHTestAssertionFailed] ${message}`);
  }
}

export function runDropHSeoAndDiscoverabilityTests() {
  console.log('--- Running Drop H: SEO & Public Discoverability Tests ---');

  const rootDir = path.resolve(__dirname, '../../');
  const frontendDir = path.join(rootDir, 'frontend');

  // =========================================================================
  // 1. PUBLIC ROUTES & ANONYMOUS ACCESS
  // =========================================================================
  console.log('  Testing 1: Public routes crawlable without authentication redirects...');

  const strictlyPublicPages = [
    'app/page.tsx',
    'app/courses/page.tsx',
    'app/courses/[slug]/page.tsx',
    'app/certificates/page.tsx',
    'app/certificates/verify/page.tsx',
    'app/certificates/verify/[credentialId]/page.tsx',
    'app/troubleshooting/page.tsx',
    'app/simulations/page.tsx',
    'app/sandbox/page.tsx',
    'app/workbench/page.tsx',
    'app/labs/page.tsx',
    'app/commands/page.tsx',
    'app/glossary/page.tsx',
    'app/flashcards/page.tsx',
    'app/challenges/page.tsx',
    'app/docs/page.tsx',
  ];

  for (const relPath of strictlyPublicPages) {
    const fullPath = path.join(frontendDir, relPath);
    assert(fs.existsSync(fullPath), `Public page file must exist: ${relPath}`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    // Ensure no page forces redirect on unauthenticated guests with allowGuest={false}
    assert(
      !content.includes('allowGuest={false}'),
      `Public route ${relPath} must NOT restrict guests with allowGuest={false}`
    );
  }
  console.log('    ✓ All public routes accessible to anonymous visitors and search engines.');

  // =========================================================================
  // 2. CANONICAL DOMAIN CONFIGURATION & CANONICAL URLS
  // =========================================================================
  console.log('  Testing 2: Canonical URLs use real configured domain without hardcoded staging...');

  assert(typeof SITE_URL === 'string' && SITE_URL.length > 0, 'SITE_URL must be configured');
  assert(!SITE_URL.endsWith('/'), 'SITE_URL must not have trailing slash');

  const canonicalLayouts = [
    { relPath: 'app/courses/layout.tsx', expectedCanonical: '/courses' },
    { relPath: 'app/certificates/layout.tsx', expectedCanonical: '/certificates' },
    { relPath: 'app/certificates/verify/layout.tsx', expectedCanonical: '/certificates/verify' },
    { relPath: 'app/troubleshooting/layout.tsx', expectedCanonical: '/troubleshooting' },
    { relPath: 'app/simulations/layout.tsx', expectedCanonical: '/simulations' },
    { relPath: 'app/sandbox/layout.tsx', expectedCanonical: '/sandbox' },
    { relPath: 'app/workbench/layout.tsx', expectedCanonical: '/workbench' },
    { relPath: 'app/labs/layout.tsx', expectedCanonical: '/labs' },
    { relPath: 'app/commands/layout.tsx', expectedCanonical: '/commands' },
    { relPath: 'app/glossary/layout.tsx', expectedCanonical: '/glossary' },
    { relPath: 'app/flashcards/layout.tsx', expectedCanonical: '/flashcards' },
    { relPath: 'app/challenges/layout.tsx', expectedCanonical: '/challenges' },
    { relPath: 'app/docs/layout.tsx', expectedCanonical: '/docs' },
  ];

  for (const item of canonicalLayouts) {
    const fullPath = path.join(frontendDir, item.relPath);
    assert(fs.existsSync(fullPath), `Layout must exist: ${item.relPath}`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(
      content.includes(`canonical: '${item.expectedCanonical}'`),
      `Layout ${item.relPath} must declare canonical URL '${item.expectedCanonical}'`
    );
  }

  // Check course dynamic layout canonical
  const courseDetailLayout = fs.readFileSync(path.join(frontendDir, 'app/courses/[slug]/layout.tsx'), 'utf-8');
  assert(
    courseDetailLayout.includes('canonical: `/courses/${course.slug}`'),
    'Course detail layout must dynamically define canonical URL'
  );

  // Check verification dynamic layout canonical
  const verifyDetailLayout = fs.readFileSync(path.join(frontendDir, 'app/certificates/verify/[credentialId]/layout.tsx'), 'utf-8');
  assert(
    verifyDetailLayout.includes('canonical: `/certificates/verify/'),
    'Verification detail layout must dynamically define canonical URL'
  );

  console.log('    ✓ All public routes declare accurate canonical URLs.');

  // =========================================================================
  // 3. NO ACCIDENTAL NOINDEX & PRIVATE ISOLATION
  // =========================================================================
  console.log('  Testing 3: No accidental noindex on public routes; private routes safeguarded...');

  const publicLayoutPaths = [
    'app/layout.tsx',
    'app/courses/layout.tsx',
    'app/courses/[slug]/layout.tsx',
    'app/troubleshooting/layout.tsx',
    'app/simulations/layout.tsx',
    'app/sandbox/layout.tsx',
    'app/workbench/layout.tsx',
    'app/labs/layout.tsx',
    'app/certificates/layout.tsx',
    'app/certificates/verify/layout.tsx',
    'app/certificates/verify/[credentialId]/layout.tsx',
  ];

  for (const relPath of publicLayoutPaths) {
    const content = fs.readFileSync(path.join(frontendDir, relPath), 'utf-8');
    assert(
      !content.includes('index: false') && !content.includes('follow: false'),
      `Public layout ${relPath} must NOT specify index: false or follow: false`
    );
  }

  // Private route layout check
  const privateCertLayout = fs.readFileSync(path.join(frontendDir, 'app/certificates/[id]/layout.tsx'), 'utf-8');
  assert(
    privateCertLayout.includes('index: false') && privateCertLayout.includes('follow: false'),
    'Private certificate detail route must have noindex to protect learner document privacy'
  );
  console.log('    ✓ Public routes indexable; private certificate document view protected with noindex.');

  // =========================================================================
  // 4. ROBOTS.TS & SITEMAP.TS COMPLETENESS
  // =========================================================================
  console.log('  Testing 4: Robots and Sitemap crawl configurations...');

  const robotsOutput = robots();
  assert(Array.isArray(robotsOutput.rules), 'Robots rules must be an array');
  const wildcardRule = (robotsOutput.rules as any[]).find((r) => r.userAgent === '*');
  assert(!!wildcardRule, 'Robots must contain wildcard rule');

  const allows: string[] = Array.isArray(wildcardRule.allow) ? wildcardRule.allow : [wildcardRule.allow];
  assert(allows.includes('/certificates/verify'), 'Robots must allow /certificates/verify');
  assert(allows.includes('/certificates/verify/*'), 'Robots must allow /certificates/verify/*');
  assert(allows.includes('/courses'), 'Robots must allow /courses');
  assert(allows.includes('/courses/*'), 'Robots must allow /courses/*');

  const sitemapEntries = sitemap();
  assert(Array.isArray(sitemapEntries) && sitemapEntries.length >= 20, 'Sitemap must contain comprehensive entries');
  const urls = sitemapEntries.map((e) => e.url);

  assert(urls.includes(`${SITE_URL}`), 'Sitemap must include root domain');
  assert(urls.includes(`${SITE_URL}/courses`), 'Sitemap must include /courses');
  assert(urls.includes(`${SITE_URL}/certificates`), 'Sitemap must include /certificates');
  assert(urls.includes(`${SITE_URL}/certificates/verify`), 'Sitemap must include /certificates/verify');

  for (const course of FLAGSHIP_5_COURSES) {
    assert(urls.includes(`${SITE_URL}/courses/${course.slug}`), `Sitemap must include course: ${course.slug}`);
  }
  console.log('    ✓ Robots rules and Sitemap verified with full public coverage.');

  // =========================================================================
  // 5. SCHEMA.ORG STRUCTURED DATA INTEGRITY
  // =========================================================================
  console.log('  Testing 5: Schema.org Course & EducationalOccupationalCredential schemas...');

  // Root Layout: EducationalOrganization & WebSite
  const rootLayoutContent = fs.readFileSync(path.join(frontendDir, 'app/layout.tsx'), 'utf-8');
  assert(rootLayoutContent.includes("'@type': 'EducationalOrganization'"), 'Root layout must declare EducationalOrganization');
  assert(rootLayoutContent.includes("'@type': 'WebSite'"), 'Root layout must declare WebSite with SearchAction');

  // Courses Catalog: ItemList of Courses
  const coursesLayoutContent = fs.readFileSync(path.join(frontendDir, 'app/courses/layout.tsx'), 'utf-8');
  assert(coursesLayoutContent.includes("'@type': 'ItemList'"), 'courses/layout.tsx must declare ItemList');
  assert(coursesLayoutContent.includes("'@type': 'Course'"), 'courses/layout.tsx ItemList must contain Course items');

  // Course Detail: Course + EducationalOccupationalCredential
  assert(courseDetailLayout.includes("'@type': 'Course'"), 'Course detail layout must declare Course schema');
  assert(
    courseDetailLayout.includes("'@type': 'EducationalOccupationalCredential'"),
    'Course detail layout must declare EducationalOccupationalCredential for awarded certificate'
  );
  assert(courseDetailLayout.includes('courseCode: course.code'), 'Course schema must bind authentic course code');
  assert(courseDetailLayout.includes('educationalLevel: course.level'), 'Course schema must bind authentic course level');

  // Certificates Catalog: ItemList of EducationalOccupationalCredential
  const certCatalogContent = fs.readFileSync(path.join(frontendDir, 'app/certificates/layout.tsx'), 'utf-8');
  assert(
    certCatalogContent.includes("'@type': 'EducationalOccupationalCredential'"),
    'certificates/layout.tsx must declare EducationalOccupationalCredential items'
  );

  // Verification Layout: EducationalOccupationalCredential
  assert(
    verifyDetailLayout.includes("'@type': 'EducationalOccupationalCredential'"),
    'Verification layout must declare EducationalOccupationalCredential schema'
  );

  // Ensure no private PII in structured data
  assert(!verifyDetailLayout.includes('email'), 'Verification schema must never expose learner email');
  assert(!verifyDetailLayout.includes('studentId'), 'Verification schema must never expose internal student ID');
  assert(!verifyDetailLayout.includes('user.id'), 'Verification schema must never expose user.id');

  console.log('    ✓ Schema.org Course and Credential structured data strictly grounded with zero private PII.');

  // =========================================================================
  // 6. SOCIAL METADATA & OG IMAGES
  // =========================================================================
  console.log('  Testing 6: Social metadata cards and OpenGraph image assets...');

  const ogImagePath = path.join(frontendDir, 'public/og-image.png');
  assert(fs.existsSync(ogImagePath), 'OG image asset must exist at frontend/public/og-image.png');
  const stat = fs.statSync(ogImagePath);
  assert(stat.size > 10000, `OG image must be a valid non-empty asset (current size: ${stat.size} bytes)`);

  const twitterCardLayouts = [
    'app/layout.tsx',
    'app/courses/layout.tsx',
    'app/courses/[slug]/layout.tsx',
    'app/certificates/layout.tsx',
    'app/certificates/verify/layout.tsx',
    'app/certificates/verify/[credentialId]/layout.tsx',
    'app/troubleshooting/layout.tsx',
    'app/troubleshooting/[slug]/layout.tsx',
  ];

  for (const relPath of twitterCardLayouts) {
    const content = fs.readFileSync(path.join(frontendDir, relPath), 'utf-8');
    assert(
      content.includes("card: 'summary_large_image'"),
      `Layout ${relPath} must specify twitter summary_large_image card`
    );
    assert(
      content.includes('/og-image.png'),
      `Layout ${relPath} must link valid /og-image.png`
    );
  }
  console.log('    ✓ Social metadata cards and OpenGraph images verified.');

  // =========================================================================
  // 7. INTERNAL LINKING & 404 RESILIENCE
  // =========================================================================
  console.log('  Testing 7: Internal navigation discoverability & 404 handling...');

  const footerContent = fs.readFileSync(path.join(frontendDir, 'components/landing/FooterSection.tsx'), 'utf-8');
  assert(
    footerContent.includes('href="/certificates/verify"'),
    'Footer navigation must include direct link to /certificates/verify'
  );
  assert(
    footerContent.includes('href="/courses"'),
    'Footer navigation must include link to /courses'
  );

  const notFoundContent = fs.readFileSync(path.join(frontendDir, 'app/not-found.tsx'), 'utf-8');
  assert(
    notFoundContent.includes('404 — Packet Dropped'),
    '404 page must provide authoritative not found messaging'
  );
  assert(
    notFoundContent.includes('href="/dashboard"'),
    '404 page must offer Return to Dashboard'
  );
  assert(
    notFoundContent.includes('href="/"'),
    '404 page must offer Return to Home'
  );

  console.log('    ✓ Internal linking and 404 recovery verified.');
  console.log('--- All Drop H SEO & Public Discoverability Tests Passed Successfully ---');
}
