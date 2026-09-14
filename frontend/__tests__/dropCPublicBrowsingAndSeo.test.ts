import fs from 'fs';
import path from 'path';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[DropCTestAssertionFailed] ${message}`);
  }
}

export function runDropCPublicBrowsingAndSeoTests() {
  console.log('--- Running Drop C: Public Browsing Unlock & SEO Architecture Tests ---');

  const rootDir = path.resolve(__dirname, '../../');
  const frontendDir = path.join(rootDir, 'frontend');

  // =========================================================================
  // 1. PUBLIC BROWSING UNLOCK (NO PROTECTED ROUTE WRAPPERS)
  // =========================================================================
  console.log('  Testing 1: Public browsing access unlocked for courses & references...');

  const publicPageFiles = [
    'app/courses/page.tsx',
    'app/courses/[slug]/page.tsx',
    'app/glossary/page.tsx',
    'app/commands/page.tsx',
    'app/flashcards/page.tsx',
  ];

  for (const relPath of publicPageFiles) {
    const fullPath = path.join(frontendDir, relPath);
    assert(fs.existsSync(fullPath), `Public page file must exist: ${relPath}`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(
      !content.includes('<ProtectedRoute>'),
      `Page ${relPath} must NOT be wrapped in <ProtectedRoute>`
    );
    assert(
      !content.includes("from '@/components/auth/ProtectedRoute'"),
      `Page ${relPath} should not import ProtectedRoute`
    );
  }

  // =========================================================================
  // 2. SENSITIVE / AUTHENTICATED ROUTES REMAIN PROTECTED
  // =========================================================================
  console.log('  Testing 2: Sensitive and assessment routes remain strictly protected...');

  const protectedPageFiles = [
    'app/dashboard/page.tsx',
    'app/profile/page.tsx',
    'app/settings/page.tsx',
    'app/admin/page.tsx',
    'app/certifications/capstone/page.tsx',
  ];

  for (const relPath of protectedPageFiles) {
    const fullPath = path.join(frontendDir, relPath);
    assert(fs.existsSync(fullPath), `Protected page file must exist: ${relPath}`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(
      content.includes('<ProtectedRoute'),
      `Private page ${relPath} MUST be wrapped in <ProtectedRoute>`
    );
  }

  // =========================================================================
  // 3. SCHEMA.ORG STRUCTURED DATA
  // =========================================================================
  console.log('  Testing 3: Schema.org structured data on catalog and detail pages...');

  const catalogPath = path.join(frontendDir, 'app/courses/page.tsx');
  const catalogContent = fs.readFileSync(catalogPath, 'utf-8');
  assert(
    catalogContent.includes("application/ld+json"),
    'courses/page.tsx must inject JSON-LD script'
  );
  assert(
    catalogContent.includes("'@type': 'ItemList'"),
    'courses/page.tsx must define Schema.org ItemList'
  );

  const detailPath = path.join(frontendDir, 'app/courses/[slug]/page.tsx');
  const detailContent = fs.readFileSync(detailPath, 'utf-8');
  assert(
    detailContent.includes("application/ld+json"),
    'courses/[slug]/page.tsx must inject JSON-LD script'
  );
  assert(
    detailContent.includes("'@type': 'Course'"),
    'courses/[slug]/page.tsx must define Schema.org Course'
  );

  // =========================================================================
  // 4. SERVER-RENDERED COURSE DETAIL METADATA LAYOUT
  // =========================================================================
  console.log('  Testing 4: Server layout with generateMetadata for courses/[slug]...');

  const layoutPath = path.join(frontendDir, 'app/courses/[slug]/layout.tsx');
  assert(fs.existsSync(layoutPath), 'courses/[slug]/layout.tsx must exist');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  assert(
    layoutContent.includes('generateMetadata'),
    'courses/[slug]/layout.tsx must export generateMetadata function'
  );
  assert(
    layoutContent.includes('FLAGSHIP_5_COURSES'),
    'courses/[slug]/layout.tsx must resolve against canonical flagship courses'
  );

  // =========================================================================
  // 5. SITEMAP INCLUSION
  // =========================================================================
  console.log('  Testing 5: Sitemap coverage for public courses and legal pages...');

  const sitemapPath = path.join(frontendDir, 'app/sitemap.ts');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  assert(sitemapContent.includes('/courses'), 'Sitemap must contain /courses');
  assert(sitemapContent.includes('/terms'), 'Sitemap must contain /terms');
  assert(sitemapContent.includes('/privacy'), 'Sitemap must contain /privacy');
  assert(sitemapContent.includes('/glossary'), 'Sitemap must contain /glossary');
  assert(sitemapContent.includes('/commands'), 'Sitemap must contain /commands');
  assert(sitemapContent.includes('/flashcards'), 'Sitemap must contain /flashcards');

  console.log('  ✓ Drop C Public Browsing & SEO Architecture Tests PASSED!');
}
