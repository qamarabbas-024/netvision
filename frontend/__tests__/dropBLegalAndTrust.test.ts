import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[DropBTestAssertionFailed] ${message}`);
  }
}

export function runDropBLegalAndTrustTests() {
  console.log('--- Running Drop B: Legal, Compliance & Trust Remediation Tests ---');

  const rootDir = path.resolve(__dirname, '../../');
  const frontendDir = path.join(rootDir, 'frontend');

  // =========================================================================
  // 1. ELIMINATION OF "ON-CHAIN" CLAIMS
  // =========================================================================
  console.log('  Testing 1: Full eradication of "on-chain" and "onchain" claims...');
  
  const filesToCheckForOnChain = [
    'components/landing/CertificationSection.tsx',
    'components/landing/FooterSection.tsx',
    'lib/vectorPdfExportEngine.ts',
    'app/workbench/page.tsx',
  ];

  for (const relPath of filesToCheckForOnChain) {
    const fullPath = path.join(frontendDir, relPath);
    assert(fs.existsSync(fullPath), `Target file does not exist: ${relPath}`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(
      !content.toLowerCase().includes('on-chain'),
      `File ${relPath} still contains 'on-chain'`
    );
    assert(
      !content.toLowerCase().includes('onchain'),
      `File ${relPath} still contains 'onchain'`
    );
  }

  // Check CertificationSection does not contain fake Ethereum contract/tx hash
  const certSectionPath = path.join(frontendDir, 'components/landing/CertificationSection.tsx');
  const certSectionContent = fs.readFileSync(certSectionPath, 'utf-8');
  assert(
    !certSectionContent.includes('0x8F9C42A1E7B9045D813F60D29E11C4958A7308D64A5E82B63CD19F02'),
    'CertificationSection still contains fake Ethereum hex string'
  );
  assert(
    certSectionContent.includes('sha256:'),
    'CertificationSection must use standard SHA-256 integrity digest prefix'
  );

  // =========================================================================
  // 2. TERMS OF SERVICE PAGE & EDUCATIONAL DISCLAIMER
  // =========================================================================
  console.log('  Testing 2: Terms of Service page (/terms) & vendor disclaimers...');
  
  const termsPagePath = path.join(frontendDir, 'app/terms/page.tsx');
  assert(fs.existsSync(termsPagePath), 'frontend/app/terms/page.tsx must exist');
  const termsContent = fs.readFileSync(termsPagePath, 'utf-8');

  // Must contain vendor disclaimers
  assert(termsContent.includes('Cisco Systems, Inc.'), 'Terms page must mention Cisco in non-affiliation disclaimer');
  assert(termsContent.includes('CompTIA'), 'Terms page must mention CompTIA in non-affiliation disclaimer');
  assert(termsContent.includes('not affiliated with'), 'Terms page must explicitly state non-affiliation');
  assert(termsContent.includes('80%'), 'Terms page must state 80% passing standard for course certifications');
  assert(termsContent.includes('85%'), 'Terms page must state 85% passing standard for Master Capstone');

  // =========================================================================
  // 3. PRIVACY POLICY PAGE & CREDENTIAL TRANSPARENCY
  // =========================================================================
  console.log('  Testing 3: Privacy Policy page (/privacy) & data protection standards...');
  
  const privacyPagePath = path.join(frontendDir, 'app/privacy/page.tsx');
  assert(fs.existsSync(privacyPagePath), 'frontend/app/privacy/page.tsx must exist');
  const privacyContent = fs.readFileSync(privacyPagePath, 'utf-8');

  // Must contain privacy rights and credential disclosure boundaries
  assert(privacyContent.includes('GDPR'), 'Privacy Policy must cite GDPR compliance');
  assert(privacyContent.includes('CCPA'), 'Privacy Policy must cite CCPA compliance');
  assert(
    privacyContent.includes('Candidate emails') || privacyContent.includes('emails'),
    'Privacy Policy must explain that candidate emails are private and not exposed on public verification endpoints'
  );

  // =========================================================================
  // 4. FOOTER SECTION LEGAL ROUTING & DISCLAIMER
  // =========================================================================
  console.log('  Testing 4: FooterSection legal link routing and disclaimer...');
  
  const footerPath = path.join(frontendDir, 'components/landing/FooterSection.tsx');
  const footerContent = fs.readFileSync(footerPath, 'utf-8');

  assert(
    footerContent.includes('href="/terms"'),
    'FooterSection must link directly to /terms'
  );
  assert(
    footerContent.includes('href="/privacy"'),
    'FooterSection must link directly to /privacy'
  );
  assert(
    !footerContent.includes('href="/docs">Terms of Service'),
    'FooterSection must not route Terms of Service to /docs'
  );
  assert(
    !footerContent.includes('href="/docs">Privacy Policy'),
    'FooterSection must not route Privacy Policy to /docs'
  );
  assert(
    footerContent.includes('Educational Disclaimer:'),
    'FooterSection must feature explicit Educational Disclaimer'
  );
  assert(
    footerContent.includes('Cisco Systems, Inc.'),
    'FooterSection disclaimer must explicitly mention non-affiliation with Cisco'
  );

  // =========================================================================
  // 5. VECTOR PDF EXPORT ENGINE SANITIZATION
  // =========================================================================
  console.log('  Testing 5: Vector PDF export engine copy sanitization...');
  
  const pdfEnginePath = path.join(frontendDir, 'lib/vectorPdfExportEngine.ts');
  const pdfEngineContent = fs.readFileSync(pdfEnginePath, 'utf-8');

  assert(
    pdfEngineContent.includes('SHA-256 Registry Verification Digest'),
    'vectorPdfExportEngine must state SHA-256 Registry Verification Digest'
  );
  assert(
    !pdfEngineContent.includes('On-Chain Hash'),
    'vectorPdfExportEngine must not refer to On-Chain Hash'
  );

  console.log('  ✓ Drop B Legal, Compliance & Trust Remediation Tests PASSED!');
}
