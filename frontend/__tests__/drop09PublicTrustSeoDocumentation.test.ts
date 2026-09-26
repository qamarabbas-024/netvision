import fs from 'fs';
import path from 'path';
import { resolveCanonicalSiteUrl } from '../lib/siteConfig';
import sitemap from '../app/sitemap';
import robots from '../app/robots';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Drop09TestAssertionFailed] ${message}`);
  }
}

export function runDrop09PublicTrustSeoDocumentationTests() {
  console.log('--- Running Drop 09 Public Trust, SEO & Documentation Truth Tests ---');

  // =========================================================================
  // 1. SITE URL & CANONICAL SAFETY (NO LOCALHOST IN PRODUCTION)
  // =========================================================================
  console.log('  Testing 1: Canonical Site URL resolution safeguards...');
  {
    // Test production fallback when NEXT_PUBLIC_SITE_URL is omitted
    const prodNoEnv = resolveCanonicalSiteUrl(undefined, 'production');
    assert(prodNoEnv === 'https://netvision.edu', `Expected https://netvision.edu in production without env, got ${prodNoEnv}`);

    // Test production override when NEXT_PUBLIC_SITE_URL is localhost
    const prodLocalhost = resolveCanonicalSiteUrl('http://localhost:3000', 'production');
    assert(prodLocalhost === 'https://netvision.edu', `Expected https://netvision.edu in production when localhost provided, got ${prodLocalhost}`);

    // Test production valid custom domain
    const prodCustom = resolveCanonicalSiteUrl('https://custom-domain.org', 'production');
    assert(prodCustom === 'https://custom-domain.org', `Expected custom domain to be preserved, got ${prodCustom}`);

    // Test development fallback to localhost
    const devNoEnv = resolveCanonicalSiteUrl(undefined, 'development');
    assert(devNoEnv === 'http://localhost:3000', `Expected http://localhost:3000 in dev without env, got ${devNoEnv}`);

    console.log('    ✓ Canonical URL resolver strictly prevents localhost leakage in production.');
  }

  // =========================================================================
  // 2. PUBLIC CLAIMS & METRICS INTEGRITY (NO UNSUPPORTED METRICS)
  // =========================================================================
  console.log('  Testing 2: Public claims, metrics, and registration copy...');
  {
    const credMetricsPath = path.resolve(__dirname, '../components/landing/CredentialAndMetricsSection.tsx');
    const credMetricsContent = fs.readFileSync(credMetricsPath, 'utf8');

    assert(!credMetricsContent.includes('10K+'), 'Unsupported 10K+ metric found in CredentialAndMetricsSection');
    assert(!credMetricsContent.includes('99.9%'), 'Unsupported 99.9% uptime metric found in CredentialAndMetricsSection');
    assert(!credMetricsContent.includes('100+ Labs'), 'Unsupported 100+ Labs claim found in CredentialAndMetricsSection');
    assert(!credMetricsContent.includes('50+ Simulations'), 'Unsupported 50+ Simulations claim found in CredentialAndMetricsSection');
    assert(credMetricsContent.includes('>5</strong>') && credMetricsContent.includes('>Courses</span>'), 'Accurate 5 Courses metric missing in CredentialAndMetricsSection');

    const registerPath = path.resolve(__dirname, '../app/register/page.tsx');
    const registerContent = fs.readFileSync(registerPath, 'utf8');
    assert(!registerContent.includes('100,000+'), 'Unsupported 100,000+ users claim found in register page');

    console.log('    ✓ Unsupported metrics (100,000+, 10K+, 99.9%, fake outcomes) eliminated.');
  }

  // =========================================================================
  // 3. CREDENTIAL TRUTH (NO MISLEADING BLOCKCHAIN / CRYPTO MARKETING EXAGGERATION)
  // =========================================================================
  console.log('  Testing 3: Credential verification terminology...');
  {
    const faqPath = path.resolve(__dirname, '../components/landing/FaqSection.tsx');
    const faqContent = fs.readFileSync(faqPath, 'utf8');
    assert(!faqContent.includes('public key signature that employers can authenticate directly on LinkedIn'), 'Deceptive public key signature claim found in FAQ');

    const certSectionPath = path.resolve(__dirname, '../components/landing/CertificationSection.tsx');
    const certSectionContent = fs.readFileSync(certSectionPath, 'utf8');
    assert(!certSectionContent.includes('Cryptographic Verification'), 'Deceptive Cryptographic Verification heading found in CertificationSection');
    assert(certSectionContent.includes('Verified Digital Credentials'), 'Expected Verified Digital Credentials heading');

    const masteryModalPath = path.resolve(__dirname, '../components/certification/MasteryCelebrationModal.tsx');
    const masteryModalContent = fs.readFileSync(masteryModalPath, 'utf8');
    assert(!masteryModalContent.includes('Cryptographic Seal &amp; Master ID'), 'Deceptive Cryptographic Seal found in MasteryCelebrationModal');

    const commandPalettePath = path.resolve(__dirname, '../components/ui/CommandPalette.tsx');
    const commandPaletteContent = fs.readFileSync(commandPalettePath, 'utf8');
    assert(!commandPaletteContent.includes('Certifications & Cryptographic Credentials'), 'Deceptive title found in CommandPalette');

    console.log('    ✓ Credential verification accurately described as authoritative registry validation.');
  }

  // =========================================================================
  // 4. BRAND ASSETS, FAVICON & STRUCTURED DATA LOGO
  // =========================================================================
  console.log('  Testing 4: Brand assets and structured data schema...');
  {
    const iconSvgPath = path.resolve(__dirname, '../public/icon.svg');
    assert(fs.existsSync(iconSvgPath), 'public/icon.svg must exist');
    const iconContent = fs.readFileSync(iconSvgPath, 'utf8');
    assert(iconContent.includes('<svg'), 'public/icon.svg must be a valid SVG document');

    const faviconPath = path.resolve(__dirname, '../public/favicon.ico');
    assert(fs.existsSync(faviconPath), 'public/favicon.ico must exist');

    const layoutPath = path.resolve(__dirname, '../app/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    assert(layoutContent.includes("logo: `${SITE_URL}/icon.svg`"), 'Schema.org EducationalOrganization logo should point to valid SVG brand asset');

    console.log('    ✓ Brand assets (icon.svg, favicon.ico) verified and Schema.org logo properly configured.');
  }

  // =========================================================================
  // 5. ROBOTS & SITEMAP DIRECTIVES (INDEXABLE PUBLIC / NO-INDEX PRIVATE)
  // =========================================================================
  console.log('  Testing 5: Robots.txt & Sitemap crawl directives...');
  {
    const robotsObj = robots();
    const rules = Array.isArray(robotsObj.rules) ? robotsObj.rules[0] : robotsObj.rules;
    assert(!!rules, 'Robots rules must be defined');

    const allowList = Array.isArray(rules.allow) ? rules.allow : [rules.allow];
    const disallowList = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];

    // Verify public pages allowed
    assert(allowList.includes('/'), 'Root must be allowed');
    assert(allowList.includes('/courses'), '/courses must be allowed');
    assert(allowList.includes('/certificates'), '/certificates must be allowed');
    assert(allowList.includes('/certificates/verify'), '/certificates/verify must be allowed');
    assert(allowList.includes('/certificates/verify/*'), '/certificates/verify/* must be allowed');

    // Verify private pages disallowed
    assert(disallowList.includes('/dashboard') || disallowList.includes('/dashboard/*'), '/dashboard must be disallowed');
    assert(disallowList.includes('/admin') || disallowList.includes('/admin/*'), '/admin must be disallowed');
    assert(disallowList.includes('/profile') || disallowList.includes('/profile/*'), '/profile must be disallowed');
    assert(disallowList.includes('/settings') || disallowList.includes('/settings/*'), '/settings must be disallowed');

    // Verify sitemap contains public entries and no private entries
    const sitemapEntries = sitemap();
    assert(sitemapEntries.length > 20, `Expected at least 20 sitemap entries, got ${sitemapEntries.length}`);

    for (const entry of sitemapEntries) {
      assert(!entry.url.includes('/dashboard'), `Sitemap should not leak private route /dashboard: ${entry.url}`);
      assert(!entry.url.includes('/admin'), `Sitemap should not leak private route /admin: ${entry.url}`);
      assert(!entry.url.includes('/profile'), `Sitemap should not leak private route /profile: ${entry.url}`);
      assert(!entry.url.includes('/settings'), `Sitemap should not leak private route /settings: ${entry.url}`);
    }

    // Verify docs/SITEMAP.md does not leak old staging domain
    const docSitemapPath = path.resolve(__dirname, '../../docs/SITEMAP.md');
    const docSitemapContent = fs.readFileSync(docSitemapPath, 'utf8');
    assert(!docSitemapContent.includes('https://netvision-three.vercel.app'), 'Staging domain netvision-three.vercel.app leaked in docs/SITEMAP.md');

    console.log('    ✓ Robots, sitemap, and crawl boundaries verified.');
  }

  // =========================================================================
  // 6. README & DOCUMENTATION TRUTH
  // =========================================================================
  console.log('  Testing 6: README and architecture documentation truth...');
  {
    const readmePath = path.resolve(__dirname, '../../README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');

    assert(readmeContent.includes('Next.js 15'), 'README.md must document Next.js 15');
    assert(readmeContent.includes('pnpm: `v11.x`') || readmeContent.includes('pnpm Workspaces** (v11)'), 'README.md must document pnpm v11');
    assert(!readmeContent.includes('@xyflow/react'), 'README.md must not reference uninstalled @xyflow/react');
    assert(readmeContent.includes('Redis 7'), 'README.md must document Redis persistence layer');
    assert(readmeContent.includes('Three.js 0.185'), 'README.md must document Three.js');

    const archDocPath = path.resolve(__dirname, '../app/docs/architecture/page.tsx');
    const archDocContent = fs.readFileSync(archDocPath, 'utf8');
    assert(!archDocContent.includes('Passowrd Security'), 'Typo Passowrd Security must be resolved in architecture doc');
    assert(archDocContent.includes('Password Security'), 'Password Security must be present in architecture doc');

    console.log('    ✓ README and public documentation truth verified.');
  }

  console.log('--- ALL DROP 09 TESTS PASSED SUCCESSFULLY! ---');
}
