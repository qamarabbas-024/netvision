/**
 * ==============================================================================
 * NETVISION — DROP W: LEGAL, COPYRIGHT, IP & THIRD-PARTY ASSET AUDIT TEST
 * ==============================================================================
 *
 * Verifies:
 * 1. Root NOTICE and LICENSE files exist and have required copyright notices.
 * 2. docs/TEXTBOOK_COPYRIGHT_AND_IP.md exists and properly attributes Qamar Abbas.
 * 3. docs/THIRD_PARTY_LICENSES.md exists and contains dependency & font inventories.
 * 4. frontend/app/terms/page.tsx has non-affiliation disclaimers and IP ownership.
 * 5. frontend/app/privacy/page.tsx has cookie disclosures and retention schedules.
 * 6. Codebase contains ZERO unsupported claims:
 *    - No "accredited university degree"
 *    - No "official partner of Cisco" / CompTIA
 *    - No "guaranteed employment" / hiring promise
 *    - No "blockchain certificate" / on-chain claim
 * ==============================================================================
 */

import * as fs from 'fs';
import * as path from 'path';

function check(condition: boolean, description: string): void {
  if (!condition) {
    console.error(`  ❌ FAILED: ${description}`);
    process.exit(1);
  }
  console.log(`  ✅ PASS: ${description}`);
}

async function runLegalComplianceAudit(): Promise<void> {
  console.log('\n====================================================================');
  console.log('⚖️  NETVISION DROP W — LEGAL, COPYRIGHT & THIRD-PARTY ASSET AUDIT');
  console.log('====================================================================\n');

  const rootDir = path.resolve(__dirname, '../..');

  // --- Test 1: Root NOTICE and LICENSE Files ---
  console.log('--- Test 1: Root NOTICE and LICENSE Files ---');
  const licensePath = path.join(rootDir, 'LICENSE');
  const noticePath = path.join(rootDir, 'NOTICE');

  check(fs.existsSync(licensePath), 'LICENSE file exists in repository root');
  const licenseContent = fs.readFileSync(licensePath, 'utf8');
  check(licenseContent.includes('MIT License') && licenseContent.includes('NetVision Team'), 'LICENSE contains MIT license declaration');

  check(fs.existsSync(noticePath), 'NOTICE file exists in repository root');
  const noticeContent = fs.readFileSync(noticePath, 'utf8');
  check(noticeContent.includes('Qamar Abbas'), 'NOTICE file attributes textbook copyright to Qamar Abbas');
  check(noticeContent.includes('Next.js') && noticeContent.includes('NestJS') && noticeContent.includes('Lucide React'), 'NOTICE file includes third-party open-source libraries');
  check(noticeContent.includes('Inter') && noticeContent.includes('SIL Open Font License'), 'NOTICE file documents font licensing');
  check(noticeContent.includes('fair use') && noticeContent.includes('nominative'), 'NOTICE file includes nominative trademark fair use disclaimer');

  // --- Test 2: Textbook Copyright & IP Governance ---
  console.log('\n--- Test 2: Textbook Copyright & IP Governance ---');
  const textbookIpPath = path.join(rootDir, 'docs/TEXTBOOK_COPYRIGHT_AND_IP.md');
  check(fs.existsSync(textbookIpPath), 'docs/TEXTBOOK_COPYRIGHT_AND_IP.md exists');
  const textbookIpContent = fs.readFileSync(textbookIpPath, 'utf8');
  check(textbookIpContent.includes('CS-221 Computer Networking: Complete Mastery Textbook'), 'Documents full textbook title');
  check(textbookIpContent.includes('Qamar Abbas'), 'Identifies Qamar Abbas as author and copyright holder');
  check(textbookIpContent.includes('perpetual, worldwide, irrevocable, royalty-free, exclusive license'), 'Documents express platform license grant');
  check(textbookIpContent.includes('RFC 791') && textbookIpContent.includes('RFC 8200'), 'Lists standard IETF RFC citations');

  // --- Test 3: Third-Party Licenses & Dependency Inventory ---
  console.log('\n--- Test 3: Third-Party Licenses & Dependency Inventory ---');
  const thirdPartyPath = path.join(rootDir, 'docs/THIRD_PARTY_LICENSES.md');
  check(fs.existsSync(thirdPartyPath), 'docs/THIRD_PARTY_LICENSES.md exists');
  const thirdPartyContent = fs.readFileSync(thirdPartyPath, 'utf8');
  check(thirdPartyContent.includes('Next.js') && thirdPartyContent.includes('NestJS'), 'Inventories core web dependencies');
  check(thirdPartyContent.includes('Inter Font Family') && thirdPartyContent.includes('Outfit Font Family'), 'Inventories typography licenses');
  check(thirdPartyContent.includes('The MIT License') && thirdPartyContent.includes('The ISC License') && thirdPartyContent.includes('Apache License, Version 2.0'), 'Includes full open-source license texts');

  // --- Test 4: Terms of Service Disclaimers & IP Protection ---
  console.log('\n--- Test 4: Terms of Service Disclaimers & IP Protection ---');
  const termsPath = path.join(rootDir, 'frontend/app/terms/page.tsx');
  check(fs.existsSync(termsPath), 'frontend/app/terms/page.tsx exists');
  const termsContent = fs.readFileSync(termsPath, 'utf8');
  check(termsContent.includes('not affiliated with, sponsored by, authorized by, or endorsed by Cisco'), 'Includes vendor non-affiliation disclaimer');
  check(termsContent.includes('CS-221 Computer Networking') && termsContent.includes('Qamar Abbas'), 'Terms attribute textbook copyright to Qamar Abbas');
  check(termsContent.includes('free and open educational platform during its public beta'), 'Terms clearly define free access policy');
  check(termsContent.includes('14-day full refund'), 'Terms define refund policy framework');
  check(termsContent.includes('DO NOT CONSTITUTE ACCREDITED UNIVERSITY DEGREES'), 'Terms disclaim university accreditation');
  check(termsContent.includes('DOES NOT GUARANTEE EMPLOYMENT'), 'Terms disclaim employment guarantee');

  // --- Test 5: Privacy Policy Cookies & Retention Disclosures ---
  console.log('\n--- Test 5: Privacy Policy Cookies & Retention Disclosures ---');
  const privacyPath = path.join(rootDir, 'frontend/app/privacy/page.tsx');
  check(fs.existsSync(privacyPath), 'frontend/app/privacy/page.tsx exists');
  const privacyContent = fs.readFileSync(privacyPath, 'utf8');
  check(privacyContent.includes('Cookies, Local Storage & Tracking Disclosures'), 'Privacy Policy contains dedicated cookie disclosure section');
  check(privacyContent.includes('Zero Third-Party Advertising Trackers'), 'Confirms zero third-party advertising tracking');
  check(privacyContent.includes('Strictly Essential Authentication Cookies'), 'Discloses essential session cookie use');
  check(privacyContent.includes('Authoritative Data Retention Schedule'), 'Privacy Policy documents authoritative retention schedule');
  check(privacyContent.includes('GDPR') && privacyContent.includes('Right to Erasure'), 'Documents GDPR / CCPA learner rights');

  // --- Test 6: Audit Against Unsupported Marketing Claims ---
  console.log('\n--- Test 6: Audit Against Unsupported Marketing Claims ---');
  const publicFilesToCheck = [
    'frontend/app/page.tsx',
    'frontend/components/landing/HeroSection.tsx',
    'frontend/components/landing/CurriculumSection.tsx',
    'frontend/components/landing/FooterSection.tsx',
    'frontend/app/courses/page.tsx',
    'frontend/app/certifications/verify/[code]/page.tsx',
  ];

  for (const relFile of publicFilesToCheck) {
    const fullPath = path.join(rootDir, relFile);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
      check(!content.includes('accredited degree'), `File ${relFile} has 0 "accredited degree" claims`);
      check(!content.includes('official partner of cisco'), `File ${relFile} has 0 "official partner of Cisco" claims`);
      check(!content.includes('guaranteed job') && !content.includes('guaranteed hiring'), `File ${relFile} has 0 "guaranteed job" claims`);
      check(!content.includes('blockchain verified') && !content.includes('on-chain certificate'), `File ${relFile} has 0 deceptive blockchain claims`);
    }
  }

  console.log('\n====================================================================');
  console.log('⚖️  ALL DROP W LEGAL & COPYRIGHT COMPLIANCE TESTS PASSED!');
  console.log('====================================================================\n');
}

runLegalComplianceAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
