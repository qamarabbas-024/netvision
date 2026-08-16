import { PrismaClient } from '@prisma/client';
import { TroubleshootingService } from '../src/troubleshooting/troubleshooting.service';
import { PrismaService } from '../src/database/prisma.service';
import { AchievementsService } from '../src/achievements/achievements.service';
import { TROUBLESHOOTING_SCENARIOS } from '../src/troubleshooting/troubleshooting-scenarios.catalog';

const prisma = new PrismaClient();
const prismaService = new PrismaService();
const achievementsService = new AchievementsService(prismaService);
const troubleshootingService = new TroubleshootingService(prismaService, achievementsService);

const TEST_GUEST_A = '33333333-3333-4333-8333-333333333333';
const TEST_GUEST_B = '44444444-4444-4444-8444-444444444444';

async function runTroubleshootingEngineTestSuite() {
  console.log('🧪 Starting Comprehensive Network Troubleshooting Engine Test Suite...\n');

  let passedAssertions = 0;

  function assert(condition: boolean, message: string) {
    if (!condition) {
      console.error(`❌ ASSERTION FAILED: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
    passedAssertions++;
    console.log(`  ✓ Assertion ${passedAssertions}: ${message}`);
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Scenario Catalog Loading & Integrity
    // ----------------------------------------------------
    console.log('\n--- 1. Testing Scenario Catalog Loading & Integrity ---');
    const allScenarios = troubleshootingService.getAllScenarios();
    assert(allScenarios.length >= 12, `1.1 Exactly 12 or more high-quality scenarios loaded (found: ${allScenarios.length}).`);

    const requiredSlugs = [
      'dns-resolution-failure',
      'dhcp-failure',
      'incorrect-subnet-mask',
      'arp-resolution-failure',
      'vlan-mismatch',
      'stp-loop-blocking-issue',
      'ospf-neighbor-problem',
      'incorrect-routing-table',
      'packet-loss-duplex-mismatch',
      'mtu-mismatch-pmtud-blackhole',
      'high-latency-bufferbloat',
      'tcp-connection-failure',
    ];

    for (const slug of requiredSlugs) {
      const found = allScenarios.find((s) => s.slug === slug);
      assert(!!found, `1.2 Required scenario "${slug}" is present in catalog.`);
    }

    // ----------------------------------------------------
    // TEST 2: Public View Safe Sanitization (Anti-Cheat)
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Safe Public View & Anti-Cheat Sanitization ---');
    const safeView = troubleshootingService.getScenarioBySlugOrId('dns-resolution-failure', false);
    assert(safeView.hiddenRootCauseId === '', '2.1 hiddenRootCauseId is sanitized in public view.');
    assert(safeView.correctRemediationId === '', '2.2 correctRemediationId is sanitized in public view.');
    assert(safeView.rootCauseOptions.every((r) => r.isCorrect === false), '2.3 Root cause isCorrect booleans are masked.');
    assert(safeView.remediationOptions.every((r) => r.isCorrect === false), '2.4 Remediation isCorrect booleans are masked.');

    // ----------------------------------------------------
    // TEST 3: Interactive Session Lifecycle & State Transitions
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Interactive Session Lifecycle & State Transitions ---');
    const startRes = await troubleshootingService.startSession(
      { anonymousId: TEST_GUEST_A },
      'dns-resolution-failure'
    );
    assert(!!startRes.sessionId, '3.1 Session successfully initialized with unique ID.');
    assert(startRes.currentStage === 'INCIDENT', '3.2 Initial workflow stage is INCIDENT.');
    assert(startRes.discoveredEvidenceIds.length === 0, '3.3 Zero evidence items unlocked at start.');

    // ----------------------------------------------------
    // TEST 4: Investigation CLI Execution & Dynamic Evidence Unlock
    // ----------------------------------------------------
    console.log('\n--- 4. Testing CLI Command Execution & Dynamic Evidence Unlock ---');
    // Execute ipconfig /all to discover DNS configuration
    const cmdRes1 = await troubleshootingService.executeCommand(
      { anonymousId: TEST_GUEST_A },
      {
        sessionId: startRes.sessionId,
        scenarioId: 'dns-resolution-failure',
        command: 'ipconfig /all',
      }
    );
    assert(cmdRes1.commandOutput.includes('192.168.1.250'), '4.1 Broken state output returned for ipconfig /all.');
    assert(cmdRes1.session.discoveredEvidenceIds.includes('ev-dns-1'), '4.2 Evidence item "ev-dns-1" successfully unlocked into locker.');
    assert(cmdRes1.session.currentStage === 'INVESTIGATION', '4.3 Workflow stage transitioned to INVESTIGATION.');

    // Execute nslookup
    const cmdRes2 = await troubleshootingService.executeCommand(
      { anonymousId: TEST_GUEST_A },
      {
        sessionId: startRes.sessionId,
        scenarioId: 'dns-resolution-failure',
        command: 'nslookup portal.netvision.io',
      }
    );
    assert(cmdRes2.commandOutput.includes('timed-out'), '4.4 Telemetry output matches DNS timeout.');
    assert(cmdRes2.session.discoveredEvidenceIds.includes('ev-dns-2'), '4.5 Evidence item "ev-dns-2" successfully unlocked.');

    // ----------------------------------------------------
    // TEST 5: Diagnosis Submission & Anti-Guessing Penalties
    // ----------------------------------------------------
    console.log('\n--- 5. Testing Diagnosis Validation & Anti-Guessing Deductions ---');
    // Submit wrong hypothesis
    const wrongDiagnosisRes = await troubleshootingService.submitDiagnosis(
      { anonymousId: TEST_GUEST_A },
      {
        sessionId: startRes.sessionId,
        scenarioId: 'dns-resolution-failure',
        diagnosisId: 'rc-dns-2', // Wrong distractor
      }
    );
    assert(wrongDiagnosisRes.isCorrect === false, '5.1 Incorrect hypothesis properly rejected.');
    assert(wrongDiagnosisRes.session.scoreBreakdown.penaltyDeductions === 10, '5.2 10-point guessing penalty applied for wrong hypothesis.');
    assert(wrongDiagnosisRes.session.currentStage === 'INVESTIGATION', '5.3 Stage remains in INVESTIGATION on wrong diagnosis.');

    // Submit correct hypothesis
    const correctDiagnosisRes = await troubleshootingService.submitDiagnosis(
      { anonymousId: TEST_GUEST_A },
      {
        sessionId: startRes.sessionId,
        scenarioId: 'dns-resolution-failure',
        diagnosisId: 'rc-dns-1', // Correct root cause
      }
    );
    assert(correctDiagnosisRes.isCorrect === true, '5.4 Accurate root cause confirmed.');
    assert(correctDiagnosisRes.session.diagnosisCorrect === true, '5.5 session.diagnosisCorrect flag set.');
    assert(correctDiagnosisRes.session.currentStage === 'REMEDIATION', '5.6 Stage advanced to REMEDIATION.');

    // ----------------------------------------------------
    // TEST 6: Remediation & Virtual Network State Transition
    // ----------------------------------------------------
    console.log('\n--- 6. Testing Remediation Application & Virtual State Transition ---');
    // Apply wrong fix
    const wrongRemRes = await troubleshootingService.applyRemediation(
      { anonymousId: TEST_GUEST_A },
      {
        sessionId: startRes.sessionId,
        scenarioId: 'dns-resolution-failure',
        remediationId: 'rem-dns-2', // Reboot router
      }
    );
    assert(wrongRemRes.isCorrect === false, '6.1 Ineffective remediation rejected.');
    assert(wrongRemRes.session.remediationApplied === false, '6.2 remediationApplied remains false.');

    // Apply correct fix
    const correctRemRes = await troubleshootingService.applyRemediation(
      { anonymousId: TEST_GUEST_A },
      {
        sessionId: startRes.sessionId,
        scenarioId: 'dns-resolution-failure',
        remediationId: 'rem-dns-1', // Reconfigure DNS to 1.1.1.1
      }
    );
    assert(correctRemRes.isCorrect === true, '6.3 Correct remediation applied.');
    assert(correctRemRes.session.remediationApplied === true, '6.4 Virtual network state updated to fixed.');
    assert(correctRemRes.session.currentStage === 'VERIFICATION', '6.5 Stage advanced to VERIFICATION.');

    // ----------------------------------------------------
    // TEST 7: Verification Suite Execution & Scoring Algorithm
    // ----------------------------------------------------
    console.log('\n--- 7. Testing Verification Suite Execution & Scoring ---');
    const verifyRes = await troubleshootingService.runVerification(
      { anonymousId: TEST_GUEST_A },
      {
        sessionId: startRes.sessionId,
        scenarioId: 'dns-resolution-failure',
      }
    );
    assert(verifyRes.passed === true, '7.1 Verification suite passed all tests.');
    assert(verifyRes.testResults.length >= 2, '7.2 Multi-point verification executed.');
    assert(verifyRes.testResults.every((t) => t.passed), '7.3 All test checks passed with success messages.');
    assert(verifyRes.score >= 70, `7.4 Passing score achieved (score: ${verifyRes.score}%).`);
    assert(verifyRes.session.currentStage === 'COMPLETED', '7.5 Workflow stage transitioned to COMPLETED.');

    // ----------------------------------------------------
    // TEST 8: Post-Mortem Deep Dive Retrieval
    // ----------------------------------------------------
    console.log('\n--- 8. Testing Post-Mortem Explanation Retrieval ---');
    const postMortem = troubleshootingService.getScenarioPostMortem('dns-resolution-failure');
    assert(!!postMortem.postMortem.summary, '8.1 Post-mortem summary retrieved.');
    assert(postMortem.postMortem.osiLayer === 'Layer 7 (Application)', '8.2 OSI layer correctly mapped.');
    assert(postMortem.postMortem.preventionBestPractices.length >= 2, '8.3 Prevention best practices documented.');

    // ----------------------------------------------------
    // TEST 9: Learner Identity & Progress Isolation (IDOR Check)
    // ----------------------------------------------------
    console.log('\n--- 9. Testing Identity & Progress Isolation (IDOR Check) ---');
    let guestB_Blocked = false;
    try {
      await troubleshootingService.getSessionStatus(
        { anonymousId: TEST_GUEST_B },
        startRes.sessionId
      );
    } catch (err: any) {
      guestB_Blocked = true;
    }
    assert(guestB_Blocked, '9.1 Guest B blocked from accessing Guest A troubleshooting session.');

    // Authenticated user precedence
    const testUser = await prisma.user.findFirst();
    if (testUser) {
      const userSession = await troubleshootingService.startSession(
        { userId: testUser.id, anonymousId: undefined },
        'ospf-neighbor-problem'
      );
      assert(userSession.scenarioSlug === 'ospf-neighbor-problem', '9.2 Authenticated user session started.');
    }

    console.log(`\n🎉 All ${passedAssertions} Troubleshooting Engine Tests Passed Successfully!`);
  } catch (err: any) {
    console.error('\n❌ Troubleshooting Test Suite Failed:', err.message || err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await prismaService.$disconnect();
  }
}

runTroubleshootingEngineTestSuite();
