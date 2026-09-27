import { runTroubleshootingFallbackTests } from './troubleshootingFallback.test';
import { runEpoch11to15Tests } from './epoch11to15.test';
import { runCertificationDashboardTests } from './certificationDashboard.test';
import { runDrop7ProductionHardeningTests } from './drop7ProductionHardening.test';
import { runDropANavigationAndCapstoneTests } from './dropANavigationAndCapstone.test';
import { runDropBLegalAndTrustTests } from './dropBLegalAndTrust.test';
import { runDropCPublicBrowsingAndSeoTests } from './dropCPublicBrowsingAndSeo.test';
import { runDropIAccessibilityAndContrastTests } from './dropIAccessibilityAndContrast.test';
import { runDropJMobileResponsivenessTests } from './dropJMobileResponsiveness.test';
import { runDropKTests } from './dropKPerformanceAndPdf.test';
import { runDropHSeoAndDiscoverabilityTests } from './dropHSeoAndDiscoverability.test';
import { runDrop07FrontendRuntimeReliabilityTests } from './drop07FrontendRuntimeReliability.test';
import { runDrop08UxAccessibilityMobileTests } from './drop08UxAccessibilityMobile.test';
import { runDrop09PublicTrustSeoDocumentationTests } from './drop09PublicTrustSeoDocumentation.test';
import { runDrop14FrontendReliabilityTests } from './drop14FrontendReliability.test';

async function main() {
  console.log('================================================================');
  console.log('🚀 NETVISION FRONTEND UNIT TEST RUNNER');
  console.log('================================================================\n');

  try {
    console.log('[TEST 1/15] Running Troubleshooting Fallback Engine Tests...');
    runTroubleshootingFallbackTests();
    console.log('  ✓ Passed: Troubleshooting Fallback Scenarios, local sessions, & command execution verified.\n');

    console.log('[TEST 2/15] Running Epoch XI-XV Next-Gen Engine Tests (FRR, IBN, Maglev, MPQUIC, Gossip)...');
    runEpoch11to15Tests();
    console.log('  ✓ Passed: Epoch XI-XV configurations and simulation logic verified.\n');

    console.log('[TEST 3/15] Running Certification Dashboard Integration Tests...');
    runCertificationDashboardTests();
    console.log('  ✓ Passed: Authoritative credentials, course eligibility, 9-point Mastery, Master Capstone, and E2E Journey Tests (A-J) verified.\n');

    console.log('[TEST 4/15] Running Drop #7 Production DevOps, Security & Alignment Tests...');
    runDrop7ProductionHardeningTests();
    console.log('  ✓ Passed: Flagship fallback, site URL, sitemap, robots, API config, Dockerfiles, and CI workflow verified.\n');

    console.log('[TEST 5/15] Running Drop A CI Stability, Capstone & Navigation Tests...');
    runDropANavigationAndCapstoneTests();
    console.log('  ✓ Passed: 5 Flagship course links, Capstone reconciliation, and 404 navigation verified.\n');

    console.log('[TEST 6/15] Running Drop B Legal, Compliance & Trust Tests...');
    runDropBLegalAndTrustTests();
    console.log('  ✓ Passed: On-chain claim eradication, /terms & /privacy, vendor disclaimers verified.\n');

    console.log('[TEST 7/15] Running Drop C Public Browsing & SEO Architecture Tests...');
    runDropCPublicBrowsingAndSeoTests();
    console.log('  ✓ Passed: Public browsing unlock and Schema.org JSON-LD SEO verified.\n');

    console.log('[TEST 8/15] Running Drop I Accessibility & WCAG 2.1 AA Tests...');
    runDropIAccessibilityAndContrastTests();
    console.log('  ✓ Passed: Modal focus trap, terminal regions, aria-live, and contrast verified.\n');

    console.log('[TEST 9/15] Running Drop J Mobile Viewport & Responsiveness Tests...');
    runDropJMobileResponsivenessTests();
    console.log('  ✓ Passed: Small viewport drawer clamping, topbar action hiding, modal max-h, and word-break verified.\n');

    console.log('[TEST 10/15] Running Drop K Performance & PDF Engine Optimization Tests...');
    await runDropKTests();
    console.log('  ✓ Passed: Lazy 3D canvas, dynamic modal code-splitting, PDF anchor cleanup, and font fallbacks verified.\n');

    console.log('[TEST 11/15] Running Drop H SEO & Public Discoverability Tests...');
    runDropHSeoAndDiscoverabilityTests();
    console.log('  ✓ Passed: Titles, meta descriptions, canonical URLs, robots, sitemap, Schema.org Course/Credential, and public verification verified.\n');

    console.log('[TEST 12/15] Running Drop 07 Frontend Runtime Reliability & WebGL Tests...');
    await runDrop07FrontendRuntimeReliabilityTests();
    console.log('  ✓ Passed: WebGL zero-leak disposal, 25x navigation cycles, request aborts, and error model verified.\n');

    console.log('[TEST 13/15] Running Drop 08 Industry UX, Accessibility & Mobile Hardening Tests...');
    runDrop08UxAccessibilityMobileTests();
    console.log('  ✓ Passed: Semantic headings, 3D accessible matrix, terminal a11y, mobile helpers, focus visible, and touch targets verified.\n');

    console.log('[TEST 14/15] Running Drop 09 Public Trust, SEO & Documentation Truth Tests...');
    runDrop09PublicTrustSeoDocumentationTests();
    console.log('  ✓ Passed: Canonical safeguards, unsupported claims removal, robots, sitemap, brand assets, and README truth verified.\n');

    console.log('[TEST 15/15] Running Drop 14 Frontend Reliability & Core Learner Journey Tests...');
    await runDrop14FrontendReliabilityTests();
    console.log('  ✓ Passed: Core learner journey routing, 7-state API errors, no-empty masking, WebGL disposal, and state persistence verified.\n');

    console.log('================================================================');
    console.log('🎉 ALL FRONTEND TESTS PASSED SUCCESSFULLY (15/15 suites)');
    console.log('================================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILURE DETECTED:', error);
    process.exit(1);
  }
}

main();
