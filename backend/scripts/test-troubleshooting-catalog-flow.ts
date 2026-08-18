import { TroubleshootingService } from '../src/troubleshooting/troubleshooting.service';
import { PrismaService } from '../src/database/prisma.service';
import { AchievementsService } from '../src/achievements/achievements.service';

const prismaService = new PrismaService();
const achievementsService = new AchievementsService(prismaService);
const troubleshootingService = new TroubleshootingService(prismaService, achievementsService);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTroubleshootingCatalogTests() {
  console.log('================================================================');
  console.log('🔧 NETVISION — TROUBLESHOOTING CATALOG & FILTER FLOW TEST SUITE');
  console.log('================================================================\n');

  let passedTests = 0;

  // 1. All Scenarios Loaded
  console.log('[TEST 1] Testing Scenario Catalog Size & Data Completeness');
  const scenarios = troubleshootingService.getAllScenarios();
  assert(scenarios.length === 12, `1.1 Exactly 12 troubleshooting scenarios available (got: ${scenarios.length})`);
  assert(scenarios.every((s) => !!s.id && !!s.slug && !!s.title), '1.2 All scenarios have valid id, slug, and title');
  assert(scenarios.every((s) => !!s.incidentDescription), '1.3 All scenarios have incidentDescription');
  assert(scenarios.every((s) => s.networkingConcepts.length > 0), '1.4 All scenarios have networkingConcepts');
  assert(scenarios.every((s) => s.nodeCount > 0), '1.5 All scenarios have valid topology nodes');
  console.log(`  ✓ 12/12 scenarios verified.`);
  passedTests++;

  // 2. Difficulty Filter Accuracy
  console.log('\n[TEST 2] Testing Difficulty Level Partitioning');
  const beginnerScenarios = scenarios.filter((s) => s.difficulty === 'BEGINNER');
  const intermediateScenarios = scenarios.filter((s) => s.difficulty === 'INTERMEDIATE');
  const advancedScenarios = scenarios.filter((s) => s.difficulty === 'ADVANCED');

  assert(beginnerScenarios.length === 3, `2.1 Exactly 3 BEGINNER scenarios (got: ${beginnerScenarios.length})`);
  assert(intermediateScenarios.length === 5, `2.2 Exactly 5 INTERMEDIATE scenarios (got: ${intermediateScenarios.length})`);
  assert(advancedScenarios.length === 4, `2.3 Exactly 4 ADVANCED scenarios (got: ${advancedScenarios.length})`);
  assert(
    beginnerScenarios.length + intermediateScenarios.length + advancedScenarios.length === 12,
    '2.4 Difficulty partition sums to 12 total scenarios'
  );
  console.log(`  ✓ Difficulty filtering verified: 3 Beginner, 5 Intermediate, 4 Advanced.`);
  passedTests++;

  // 3. Search Query Filtering
  console.log('\n[TEST 3] Testing Search Queries across Fields');
  {
    // Search by protocol "DNS"
    const dnsResults = scenarios.filter((s) =>
      s.title.toLowerCase().includes('dns') ||
      s.incidentDescription.toLowerCase().includes('dns') ||
      s.networkingConcepts.some((c) => c.toLowerCase().includes('dns'))
    );
    assert(dnsResults.length >= 1, `3.1 Search for "dns" matches DNS scenario (got: ${dnsResults.length})`);

    // Search by protocol "OSPF"
    const ospfResults = scenarios.filter((s) =>
      s.title.toLowerCase().includes('ospf') ||
      s.incidentDescription.toLowerCase().includes('ospf') ||
      s.networkingConcepts.some((c) => c.toLowerCase().includes('ospf'))
    );
    assert(ospfResults.length >= 1, `3.2 Search for "ospf" matches OSPF scenario (got: ${ospfResults.length})`);

    // Search by symptom "APIPA"
    const apipaResults = scenarios.filter((s) =>
      s.title.toLowerCase().includes('apipa') ||
      s.incidentDescription.toLowerCase().includes('apipa') ||
      s.initialSymptoms?.some((sym) => sym.toLowerCase().includes('apipa'))
    );
    assert(apipaResults.length >= 1, `3.3 Search for symptom "apipa" matches DHCP scenario (got: ${apipaResults.length})`);

    // Search for nonexistent term
    const noResults = scenarios.filter((s) =>
      s.title.toLowerCase().includes('nonexistent_gibberish_term_12345') ||
      s.incidentDescription.toLowerCase().includes('nonexistent_gibberish_term_12345')
    );
    assert(noResults.length === 0, '3.4 Nonexistent search term returns 0 results (empty state)');

    console.log('  ✓ Search filtering verified across titles, descriptions, concepts, and symptoms.');
    passedTests++;
  }

  // 4. Safe Public View Anti-Cheat
  console.log('\n[TEST 4] Safe Public View Verification');
  for (const s of scenarios) {
    const detail = troubleshootingService.getScenarioBySlugOrId(s.slug, false);
    assert(detail.hiddenRootCauseId === '', `4.1 hiddenRootCauseId sanitized for ${s.slug}`);
    assert(detail.correctRemediationId === '', `4.2 correctRemediationId sanitized for ${s.slug}`);
  }
  console.log('  ✓ All 12 scenarios sanitize hidden solutions for public view.');
  passedTests++;

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests} TROUBLESHOOTING FLOW TESTS PASSED!`);
  console.log('================================================================\n');
}

runTroubleshootingCatalogTests().catch((err) => {
  console.error('❌ Troubleshooting Catalog Test Failed:', err);
  process.exit(1);
});
