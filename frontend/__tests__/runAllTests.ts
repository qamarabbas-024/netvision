import { runTroubleshootingFallbackTests } from './troubleshootingFallback.test';
import { runEpoch11to15Tests } from './epoch11to15.test';
import { runCertificationDashboardTests } from './certificationDashboard.test';
import { runDrop7ProductionHardeningTests } from './drop7ProductionHardening.test';

async function main() {
  console.log('================================================================');
  console.log('🚀 NETVISION FRONTEND UNIT TEST RUNNER');
  console.log('================================================================\n');

  try {
    console.log('[TEST 1/4] Running Troubleshooting Fallback Engine Tests...');
    runTroubleshootingFallbackTests();
    console.log('  ✓ Passed: Troubleshooting Fallback Scenarios, local sessions, & command execution verified.\n');

    console.log('[TEST 2/4] Running Epoch XI-XV Next-Gen Engine Tests (FRR, IBN, Maglev, MPQUIC, Gossip)...');
    runEpoch11to15Tests();
    console.log('  ✓ Passed: Epoch XI-XV configurations and simulation logic verified.\n');

    console.log('[TEST 3/4] Running Certification Dashboard Integration Tests...');
    runCertificationDashboardTests();
    console.log('  ✓ Passed: Authoritative credentials, course eligibility, 9-point Mastery, Master Capstone, and E2E Journey Tests (A-J) verified.\n');

    console.log('[TEST 4/4] Running Drop #7 Production DevOps, Security & Alignment Tests...');
    runDrop7ProductionHardeningTests();
    console.log('  ✓ Passed: Flagship fallback, site URL, sitemap, robots, API config, Dockerfiles, and CI workflow verified.\n');

    console.log('================================================================');
    console.log('🎉 ALL FRONTEND TESTS PASSED SUCCESSFULLY (4/4 suites)');
    console.log('================================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILURE DETECTED:', error);
    process.exit(1);
  }
}

main();
