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

async function main() {
  console.log('================================================================');
  console.log('🚀 NETVISION FRONTEND UNIT TEST RUNNER');
  console.log('================================================================\n');

  try {
    console.log('[TEST 1/9] Running Troubleshooting Fallback Engine Tests...');
    runTroubleshootingFallbackTests();
    console.log('  ✓ Passed: Troubleshooting Fallback Scenarios, local sessions, & command execution verified.\n');

    console.log('[TEST 2/9] Running Epoch XI-XV Next-Gen Engine Tests (FRR, IBN, Maglev, MPQUIC, Gossip)...');
    runEpoch11to15Tests();
    console.log('  ✓ Passed: Epoch XI-XV configurations and simulation logic verified.\n');

    console.log('[TEST 3/9] Running Certification Dashboard Integration Tests...');
    runCertificationDashboardTests();
    console.log('  ✓ Passed: Authoritative credentials, course eligibility, 9-point Mastery, Master Capstone, and E2E Journey Tests (A-J) verified.\n');

    console.log('[TEST 4/9] Running Drop #7 Production DevOps, Security & Alignment Tests...');
    runDrop7ProductionHardeningTests();
    console.log('  ✓ Passed: Flagship fallback, site URL, sitemap, robots, API config, Dockerfiles, and CI workflow verified.\n');

    console.log('[TEST 5/9] Running Drop A CI Stability, Capstone & Navigation Tests...');
    runDropANavigationAndCapstoneTests();
    console.log('  ✓ Passed: 5 Flagship course links, Capstone reconciliation, and 404 navigation verified.\n');

    console.log('[TEST 6/9] Running Drop B Legal, Compliance & Trust Tests...');
    runDropBLegalAndTrustTests();
    console.log('  ✓ Passed: On-chain claim eradication, /terms & /privacy, vendor disclaimers verified.\n');

    console.log('[TEST 7/9] Running Drop C Public Browsing & SEO Architecture Tests...');
    runDropCPublicBrowsingAndSeoTests();
    console.log('  ✓ Passed: Public browsing unlock and Schema.org JSON-LD SEO verified.\n');

    console.log('[TEST 8/9] Running Drop I Accessibility & WCAG 2.1 AA Tests...');
    runDropIAccessibilityAndContrastTests();
    console.log('  ✓ Passed: Modal focus trap, terminal regions, aria-live, and contrast verified.\n');

    console.log('[TEST 9/10] Running Drop J Mobile Viewport & Responsiveness Tests...');
    runDropJMobileResponsivenessTests();
    console.log('  ✓ Passed: Small viewport drawer clamping, topbar action hiding, modal max-h, and word-break verified.\n');

    console.log('[TEST 10/10] Running Drop K Performance & PDF Engine Optimization Tests...');
    await runDropKTests();
    console.log('  ✓ Passed: Lazy 3D canvas, dynamic modal code-splitting, PDF anchor cleanup, and font fallbacks verified.\n');

    console.log('================================================================');
    console.log('🎉 ALL FRONTEND TESTS PASSED SUCCESSFULLY (10/10 suites)');
    console.log('================================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILURE DETECTED:', error);
    process.exit(1);
  }
}

main();
