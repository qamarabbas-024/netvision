import assert from 'assert';
import {
  FALLBACK_TROUBLESHOOTING_SCENARIOS,
  getFallbackScenarioBySlug,
  createLocalTroubleshootingSession,
  executeLocalCommand,
} from '../data/troubleshootingFallbackData';

export function runTroubleshootingFallbackTests() {
  // Test 1: Fallback scenarios exist and are populated
  assert(FALLBACK_TROUBLESHOOTING_SCENARIOS.length >= 5, 'Should contain at least 5 fallback scenarios');

  // Test 2: Verify DNS scenario integrity
  const dnsScenario = getFallbackScenarioBySlug('dns-resolution-failure');
  assert(dnsScenario !== undefined, 'DNS scenario should be found');
  assert.strictEqual(dnsScenario?.slug, 'dns-resolution-failure');
  assert(dnsScenario.topology.nodes.length > 0, 'Topology should have nodes');
  assert(dnsScenario.allowedCommands.length > 0, 'Should have allowed commands');
  assert(dnsScenario.rootCauseOptions.some((r) => r.isCorrect), 'Should have at least one correct root cause');
  assert(dnsScenario.remediationOptions.some((r) => r.isCorrect), 'Should have at least one correct remediation');

  // Test 3: Local Session initialization
  const session = createLocalTroubleshootingSession(dnsScenario);
  assert(session.sessionId.startsWith('local-session-'));
  assert.strictEqual(session.currentStage, 'INCIDENT');
  assert.strictEqual(session.discoveredEvidenceIds.length, 0);

  // Test 4: Command execution & evidence discovery
  const cmdRes = executeLocalCommand(dnsScenario, session, 'ipconfig /all');
  assert(cmdRes.output.includes('192.168.1.50'), 'Output should match broken state');
  assert.strictEqual(cmdRes.evidenceUnlocked, 'ev-dns-1', 'Should unlock ev-dns-1 evidence');
  assert(cmdRes.updatedSession.discoveredEvidenceIds.includes('ev-dns-1'));

  // Test 5: Unknown command handling
  const unknownRes = executeLocalCommand(dnsScenario, session, 'rm -rf /');
  assert(unknownRes.output.includes('command not found or not permitted'));

  return true;
}

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  runTroubleshootingFallbackTests();
}
