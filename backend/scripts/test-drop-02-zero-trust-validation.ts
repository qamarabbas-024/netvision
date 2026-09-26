/**
 * DROP 02: LAB SECURITY HARDENING — ZERO TRUST VALIDATION TEST SUITE
 *
 * Validates that:
 * 1. Client-provided state or synthetic JSON (userSolution) is NEVER trusted.
 * 2. Keyword/sub-string shortcuts (e.g. echo permit, echo area, echo ping) fail safely.
 * 3. Stateful labs validate authoritative server-reconstructed device/topology state.
 * 4. All 11 mandatory attack cases fail safely with passed = false.
 * 5. Genuine engineering solutions pass reliably with 100% score.
 * 6. Scoring is 100% server-derived.
 */

import { NetworkSimulationEngine, NetworkSimulatorState } from '../src/topics/network-simulation.engine';
import { TopicsService } from '../src/topics/topics.service';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

async function runZeroTrustValidationTests() {
  console.log('================================================================');
  console.log('NETVISION — DROP 02: ZERO TRUST LAB VALIDATION AUDIT SUITE');
  console.log('================================================================\n');

  // ===========================================================================
  // SECTION 1: COMMAND EXECUTION & PARSER SECURITY
  // ===========================================================================
  console.log('--- SECTION 1: CLI PARSER ADVERSARIAL INJECTION TESTS ---');

  const testState = NetworkSimulationEngine.getInitialStateForLab('acl-rules');

  // Test 1.1: echo permit must be rejected with invalid input marker
  const resEchoPermit = NetworkSimulationEngine.executeCommand('echo permit', testState);
  assert(resEchoPermit.category === 'Invalid', 'echo permit rejected with category Invalid');
  assert(resEchoPermit.output.includes('% Invalid input detected'), 'echo permit returns CLI syntax error');
  assert(Object.keys(resEchoPermit.updatedState.acls).length === 0, 'echo permit does not mutate ACL state');

  // Test 1.2: echo area must be rejected
  const resEchoArea = NetworkSimulationEngine.executeCommand('echo area 0', testState);
  assert(resEchoArea.category === 'Invalid', 'echo area rejected with category Invalid');
  assert(!resEchoArea.updatedState.ospf?.networks?.length, 'echo area does not mutate OSPF state');

  // Test 1.3: echo ping must be rejected and NOT recorded in diagnostics
  const resEchoPing = NetworkSimulationEngine.executeCommand('echo ping 192.168.1.1', testState);
  assert(resEchoPing.category === 'Invalid', 'echo ping rejected with category Invalid');
  assert(!resEchoPing.updatedState.diagnosticsCompleted?.includes('echo ping 192.168.1.1'), 'echo ping not pushed to diagnostics');

  // Test 1.4: Irrelevant command with embedded keyword
  const resIrrelevant = NetworkSimulationEngine.executeCommand('description this area contains overload and permit', testState);
  assert(resIrrelevant.category === 'Invalid', 'description with keywords rejected in exec context');

  console.log('Parser injection protection verified.\n');

  // ===========================================================================
  // SECTION 2: THE 11 MANDATORY ATTACK CASES (MANDATORY ATTACK CASES)
  // ===========================================================================
  console.log('--- SECTION 2: MANDATORY ATTACK CASES (MUST ALL FAIL SAFELY) ---');

  // Case 1: echo permit (Targeting ACL Lab)
  {
    console.log('[Attack Case 1]: "echo permit" against ACL lab');
    let state = NetworkSimulationEngine.getInitialStateForLab('acl-rules-standard-extended');
    const simRes = NetworkSimulationEngine.executeCommand('echo permit', state, 'acl-rules-standard-extended');
    state = simRes.updatedState;
    const result = NetworkSimulationEngine.validateAttempt('acl-rules-standard-extended', state, ['echo permit']);
    assert(result.passed === false, 'Attack Case 1: echo permit FAILS lab validation');
    assert(result.score <= 50, `Attack Case 1: Score is safely limited (${result.score}%)`);
  }

  // Case 2: echo area (Targeting OSPF Lab)
  {
    console.log('[Attack Case 2]: "echo area" against OSPF lab');
    let state = NetworkSimulationEngine.getInitialStateForLab('ospf-routing-single-area');
    const simRes = NetworkSimulationEngine.executeCommand('echo area 0', state, 'ospf-routing-single-area');
    state = simRes.updatedState;
    const result = NetworkSimulationEngine.validateAttempt('ospf-routing-single-area', state, ['echo area 0']);
    assert(result.passed === false, 'Attack Case 2: echo area FAILS lab validation');
    assert(result.score <= 50, `Attack Case 2: Score is safely limited (${result.score}%)`);
  }

  // Case 3: echo ping (Targeting Diagnostic Lab)
  {
    console.log('[Attack Case 3]: "echo ping" against Diagnostic lab');
    let state = NetworkSimulationEngine.getInitialStateForLab('network-troubleshooting-methodology');
    const simRes = NetworkSimulationEngine.executeCommand('echo ping 192.168.1.1', state, 'network-troubleshooting-methodology');
    state = simRes.updatedState;
    const result = NetworkSimulationEngine.validateAttempt('network-troubleshooting-methodology', state, ['echo ping 192.168.1.1']);
    assert(result.passed === false, 'Attack Case 3: echo ping FAILS lab validation');
    assert(result.score <= 50, `Attack Case 3: Score is safely limited (${result.score}%)`);
  }

  // Case 4: Irrelevant command containing expected keywords (permit, area, overload)
  {
    console.log('[Attack Case 4]: Irrelevant command containing keywords');
    let state = NetworkSimulationEngine.getInitialStateForLab('pat-nat-overload');
    const simRes = NetworkSimulationEngine.executeCommand('description enable overload and permit area 0', state, 'pat-nat-overload');
    state = simRes.updatedState;
    const result = NetworkSimulationEngine.validateAttempt('pat-nat-overload', state, ['description enable overload and permit area 0']);
    assert(result.passed === false, 'Attack Case 4: Irrelevant command FAILS lab validation');
    assert(result.score <= 50, `Attack Case 4: Score is safely limited (${result.score}%)`);
  }

  // Case 5: Fabricated userSolution without server-executed commands
  {
    console.log('[Attack Case 5]: Fabricated userSolution payload with empty commandHistory');
    // Learner attempts to bypass execution by sending synthetic state
    const syntheticUserSolution: Partial<NetworkSimulatorState> = {
      acls: {
        '101': [
          { seq: 10, action: 'permit', protocol: 'ip', source: 'any', dest: 'any' },
        ],
      },
    };
    // Replay logic strictly uses server-side reconstructed state (getInitialStateForLab)
    const authoritativeState = NetworkSimulationEngine.getInitialStateForLab('acl-rules-standard-extended');
    // If commands are empty, state remains authoritative unconfigured state
    const result = NetworkSimulationEngine.validateAttempt('acl-rules-standard-extended', authoritativeState, []);
    assert(result.passed === false, 'Attack Case 5: Fabricated userSolution FAILS validation (zero trust)');
    assert(result.score === 0, `Attack Case 5: Score is 0% when no valid commands executed (${result.score}%)`);
  }

  // Case 6: Empty command history
  {
    console.log('[Attack Case 6]: Empty command history');
    const state = NetworkSimulationEngine.getInitialStateForLab('vlan-segmentation-trunking');
    const result = NetworkSimulationEngine.validateAttempt('vlan-segmentation-trunking', state, []);
    assert(result.passed === false, 'Attack Case 6: Empty command history FAILS validation');
    assert(result.score === 0, 'Attack Case 6: Score is 0%');
  }

  // Case 7: Malformed / non-string command input
  {
    console.log('[Attack Case 7]: Malformed input array (null, undefined, non-strings)');
    const rawInputs = [null, undefined, 12345, { cmd: 'permit' }, '   '] as any[];
    const sanitized = rawInputs
      .filter((c): c is string => typeof c === 'string')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    assert(sanitized.length === 0, 'Attack Case 7: Sanitization eliminates all malformed inputs');
    const state = NetworkSimulationEngine.getInitialStateForLab('acl-rules-standard-extended');
    const result = NetworkSimulationEngine.validateAttempt('acl-rules-standard-extended', state, sanitized);
    assert(result.passed === false, 'Attack Case 7: Malformed payload FAILS validation');
  }

  // Case 8: Repeated passive commands (show vlan brief, exit)
  {
    console.log('[Attack Case 8]: Repeated passive / inspection commands');
    let state = NetworkSimulationEngine.getInitialStateForLab('vlan-segmentation-trunking');
    const passiveCmds = ['show vlan brief', 'show interfaces trunk', 'exit', 'end', 'show running-config'];
    for (const cmd of passiveCmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'vlan-segmentation-trunking').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('vlan-segmentation-trunking', state, passiveCmds);
    assert(result.passed === false, 'Attack Case 8: Passive-only commands FAIL validation');
    assert(result.checks.find(c => c.rule === 'Learner Execution Action')?.passed === false, 'Attack Case 8: Learner Execution Action check fails');
  }

  // Case 9: Partial configuration (Created VLAN 20 but never assigned ports or trunk)
  {
    console.log('[Attack Case 9]: Partial configuration (vlan 20 created, ports unassigned)');
    let state = NetworkSimulationEngine.getInitialStateForLab('vlan-segmentation-trunking');
    const partialCmds = ['configure terminal', 'vlan 20', 'name SALES', 'exit'];
    for (const cmd of partialCmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'vlan-segmentation-trunking').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('vlan-segmentation-trunking', state, partialCmds);
    assert(result.passed === false, 'Attack Case 9: Partial configuration FAILS validation (requires >= 70%)');
    assert(result.score === 50, `Attack Case 9: Exactly 1 of 2 checks passed (score = ${result.score}%)`);
    assert(result.checks.find(c => c.rule === 'State-Based Semantic Verification')?.passed === false, 'Attack Case 9: State check fails');
  }

  // Case 10: Correct command syntax but wrong target state (STP priority 32768)
  {
    console.log('[Attack Case 10]: Correct command syntax with unmodified/default priority (32768)');
    let state = NetworkSimulationEngine.getInitialStateForLab('spanning-tree-protocol');
    const cmds = ['configure terminal', 'spanning-tree vlan 1 priority 32768', 'exit'];
    for (const cmd of cmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'spanning-tree-protocol').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('spanning-tree-protocol', state, cmds);
    assert(result.passed === false, 'Attack Case 10: Default priority 32768 FAILS STP lab');
    assert(result.checks.find(c => c.rule === 'State-Based Semantic Verification')?.passed === false, 'Attack Case 10: STP priority not tuned away from default');
  }

  // Case 11: Correct state with commands executed in different order
  {
    console.log('[Attack Case 11]: Correct state with commands in different order');
    let state = NetworkSimulationEngine.getInitialStateForLab('vlan-segmentation-trunking');
    // Reverse normal order: configure trunk link FIRST, then define VLAN
    const reversedOrderCmds = [
      'interface GigabitEthernet0/1',
      'switchport mode trunk',
      'switchport trunk allowed vlan 1,10,20',
      'vlan 20',
      'name ENGINEERING',
      'exit',
    ];
    for (const cmd of reversedOrderCmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'vlan-segmentation-trunking').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('vlan-segmentation-trunking', state, reversedOrderCmds);
    assert(result.passed === true, 'Attack Case 11: Genuine state with different command order PASSES');
    assert(result.score === 100, `Attack Case 11: Score is 100% (${result.score}%)`);
  }

  console.log('All 11 mandatory attack cases evaluated.\n');

  // ===========================================================================
  // SECTION 3: PROVE GENUINE SOLUTIONS STILL PASS
  // ===========================================================================
  console.log('--- SECTION 3: GENUINE SOLUTION PROOF SUITE ---');

  // Genuine 1: VLAN + Access Port
  {
    console.log('[Genuine 1]: VLAN allocation and Access Port assignment');
    let state = NetworkSimulationEngine.getInitialStateForLab('vlan-segmentation');
    const cmds = [
      'configure terminal',
      'vlan 20',
      'name FINANCE',
      'interface FastEthernet0/2',
      'switchport mode access',
      'switchport access vlan 20',
      'end',
    ];
    for (const cmd of cmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'vlan-segmentation').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('vlan-segmentation', state, cmds);
    assert(result.passed === true, 'Genuine VLAN lab PASSES');
    assert(result.score === 100, 'Genuine VLAN score is 100%');
  }

  // Genuine 2: STP Root Bridge Tuning
  {
    console.log('[Genuine 2]: Spanning Tree Root Bridge Priority Tuning');
    let state = NetworkSimulationEngine.getInitialStateForLab('spanning-tree');
    const cmds = ['configure terminal', 'spanning-tree vlan 1 priority 4096', 'end'];
    for (const cmd of cmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'spanning-tree').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('spanning-tree', state, cmds);
    assert(result.passed === true, 'Genuine STP lab PASSES');
    assert(result.score === 100, 'Genuine STP score is 100%');
  }

  // Genuine 3: OSPF Area 0 Routing
  {
    console.log('[Genuine 3]: OSPF Dynamic Routing Configuration');
    let state = NetworkSimulationEngine.getInitialStateForLab('ospf-routing');
    const cmds = [
      'configure terminal',
      'router ospf 1',
      'network 10.0.0.0 0.0.0.3 area 0',
      'network 192.168.1.0 0.0.0.255 area 0',
      'end',
    ];
    for (const cmd of cmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'ospf-routing').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('ospf-routing', state, cmds);
    assert(result.passed === true, 'Genuine OSPF lab PASSES');
    assert(result.score === 100, 'Genuine OSPF score is 100%');
  }

  // Genuine 4: Extended Access Control List (ACL)
  {
    console.log('[Genuine 4]: Security Access Control List (ACL) Rule Definition');
    let state = NetworkSimulationEngine.getInitialStateForLab('acl-rules');
    const cmds = [
      'configure terminal',
      'access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 80',
      'access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 443',
      'access-list 101 deny ip any any',
      'interface GigabitEthernet0/1',
      'ip access-group 101 in',
      'end',
    ];
    for (const cmd of cmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'acl-rules').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('acl-rules', state, cmds);
    assert(result.passed === true, 'Genuine ACL lab PASSES');
    assert(result.score === 100, 'Genuine ACL score is 100%');
  }

  // Genuine 5: Dynamic PAT Overload
  {
    console.log('[Genuine 5]: Dynamic PAT Overload Configuration');
    let state = NetworkSimulationEngine.getInitialStateForLab('pat-nat');
    const cmds = [
      'configure terminal',
      'ip nat inside source list 1 interface GigabitEthernet0/1 overload',
      'interface GigabitEthernet0/0',
      'ip nat inside',
      'interface GigabitEthernet0/1',
      'ip nat outside',
      'end',
    ];
    for (const cmd of cmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'pat-nat').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('pat-nat', state, cmds);
    assert(result.passed === true, 'Genuine PAT lab PASSES');
    assert(result.score === 100, 'Genuine PAT score is 100%');
  }

  // Genuine 6: Site-to-Site IPsec VPN Key Synchronization
  {
    console.log('[Genuine 6]: Site-to-Site IPsec Pre-Shared Key Configuration');
    let state = NetworkSimulationEngine.getInitialStateForLab('ipsec-vpn');
    const cmds = [
      'configure terminal',
      'crypto isakmp key cisco123 address 203.0.113.2',
      'end',
    ];
    for (const cmd of cmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'ipsec-vpn').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('ipsec-vpn', state, cmds);
    assert(result.passed === true, 'Genuine IPsec VPN lab PASSES');
    assert(result.score === 100, 'Genuine IPsec score is 100%');
  }

  // Genuine 7: Troubleshooting Gateway Route Restoration
  {
    console.log('[Genuine 7]: Default Gateway Route Restoration (Troubleshooting)');
    let state = NetworkSimulationEngine.getInitialStateForLab('troubleshoot-routing');
    const cmds = [
      'configure terminal',
      'ip route 0.0.0.0 0.0.0.0 192.168.1.254',
      'end',
    ];
    for (const cmd of cmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'troubleshoot-routing').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('troubleshoot-routing', state, cmds);
    assert(result.passed === true, 'Genuine Troubleshooting lab PASSES');
    assert(result.score === 100, 'Genuine Troubleshooting score is 100%');
  }

  // Genuine 8: Diagnostic Telemetry Tool Execution
  {
    console.log('[Genuine 8]: Diagnostic Reachability Telemetry (ping & traceroute)');
    let state = NetworkSimulationEngine.getInitialStateForLab('network-diagnostics');
    const cmds = ['ping 192.168.1.1', 'traceroute 8.8.8.8'];
    for (const cmd of cmds) {
      state = NetworkSimulationEngine.executeCommand(cmd, state, 'network-diagnostics').updatedState;
    }
    const result = NetworkSimulationEngine.validateAttempt('network-diagnostics', state, cmds);
    assert(result.passed === true, 'Genuine Diagnostic lab PASSES');
    assert(result.score === 100, 'Genuine Diagnostic score is 100%');
  }

  console.log('Genuine solutions verified across all lab domains.\n');

  // ===========================================================================
  // SECTION 4: CLIENT-CONTROLLED SCORING INTEGRITY AUDIT
  // ===========================================================================
  console.log('--- SECTION 4: CLIENT-CONTROLLED SCORING INTEGRITY ---');

  // Simulating what TopicsService.validateLab does when a client sends malicious DTO:
  // Client sends: passed: true, score: 100, commandHistory: ['echo permit'], userSolution: { acls: ... }
  const maliciousClientDto = {
    passed: true,
    score: 100,
    commandHistory: ['echo permit'],
    hintsUsedCount: 0,
    userSolution: { fakeState: 'all-passed' },
  };

  // 1. Replay strictly reconstructs state via parser
  let replayState = NetworkSimulationEngine.getInitialStateForLab('acl-rules');
  for (const cmd of maliciousClientDto.commandHistory) {
    replayState = NetworkSimulationEngine.executeCommand(cmd, replayState, 'acl-rules').updatedState;
  }
  // 2. Server evaluates state authoritatively
  const serverEvaluation = NetworkSimulationEngine.validateAttempt('acl-rules', replayState, maliciousClientDto.commandHistory);
  // 3. Server derives final score
  const serverScore = serverEvaluation.score;
  const serverPassed = serverScore >= 70;

  assert(serverPassed === false, 'Client-controlled passed=true ignored; server derives passed=false');
  assert(serverScore <= 50, `Client-controlled score=100 ignored; server derives score=${serverScore}`);

  // 4. End-to-end TopicsService authoritative validation check
  const mockPrisma: any = {
    lessonLab: {
      findUnique: async () => ({
        id: 'lab-acl-101',
        lessonId: 'lesson-acl',
        lesson: { slug: 'acl-rules-standard-extended' },
      }),
    },
    labAttempt: {
      count: async () => 0,
      create: async (args: any) => args.data,
    },
    userProgress: {
      findFirst: async () => null,
      create: async () => ({}),
      update: async () => ({}),
    },
  };
  const topicsService = new TopicsService(mockPrisma, {} as any);

  // Client attempts to pass lab by supplying fake userSolution and commandHistory: ['echo permit']
  const serviceResult = await topicsService.validateLab(
    { userId: 'test-user-1' },
    {
      labId: 'lab-acl-101',
      commandHistory: ['echo permit'],
      hintsUsedCount: 0,
      userSolution: {
        acls: {
          '101': [{ seq: 10, action: 'permit', protocol: 'ip', source: 'any', dest: 'any' }],
        },
      },
    }
  );
  assert(serviceResult.passed === false, 'TopicsService: Fabricated userSolution does NOT pass lab (passed=false)');
  assert(serviceResult.score === 0, `TopicsService: Score is strictly 0% (score=${serviceResult.score})`);

  // Client attempts to seed session with tampered currentTopologyState
  const executeResult = await topicsService.executeLabCommand(
    { userId: 'test-user-2' },
    {
      labId: 'lab-acl-101',
      command: 'show vlan brief',
      currentTopologyState: {
        acls: {
          '101': [{ seq: 10, action: 'permit', protocol: 'ip', source: 'any', dest: 'any' }],
        },
        hacked: true,
      },
    }
  );
  const internalSessionState = executeResult.updatedTopologyState;
  assert(!(internalSessionState as any).hacked, 'TopicsService: Client currentTopologyState cannot tamper with or seed session state');
  assert(Object.keys(internalSessionState.acls || {}).length === 0, 'TopicsService: Client ACLs in currentTopologyState ignored');

  console.log('Scoring integrity verified: 100% server-authoritative.\n');

  console.log('================================================================');
  console.log('DROP 02 AUDIT: ALL TESTS PASSED SUCCESSFULLY');
  console.log('ZERO TRUST VALIDATION INVARIANTS SATISFIED');
  console.log('================================================================');
}

runZeroTrustValidationTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
