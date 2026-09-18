import { NetworkSimulationEngine } from '../src/topics/network-simulation.engine';
import { TopicsService } from '../src/topics/topics.service';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

console.log('========================================================================');
console.log('NETVISION DROP P: SIMULATION-TO-VISUAL LEARNING INTEGRATION VERIFICATION');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function check(condition: boolean, message: string, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}${detail ? ` -> ${detail}` : ''}`);
  }
}

async function runDropPVerificationGate() {
  const mockPrisma: any = {
    lessonLab: {
      findUnique: async () => null,
      findFirst: async () => null,
    },
    userProgress: {
      findUnique: async () => null,
    },
  };
  const mockAchievements: any = {};
  const service = new TopicsService(mockPrisma, mockAchievements);

  const learnerA = { userId: 'learner-user-alpha-001' };
  const learnerB = { userId: 'learner-user-bravo-002' };

  // ---------------------------------------------------------------------------
  // Test 1: VLAN -> visual state
  // ---------------------------------------------------------------------------
  console.log('--- Test 1: VLAN -> Visual State Synchronization ---');
  {
    const res = await service.executeLabCommand(learnerA, {
      labId: 'vlan-configuration',
      command: 'vlan 20',
    });
    const res2 = await service.executeLabCommand(learnerA, {
      labId: 'vlan-configuration',
      command: 'interface FastEthernet0/2',
      sessionId: res.sessionId,
      clientStateVersion: res.stateVersion,
    });
    const res3 = await service.executeLabCommand(learnerA, {
      labId: 'vlan-configuration',
      command: 'switchport access vlan 20',
      sessionId: res2.sessionId,
      clientStateVersion: res2.stateVersion,
    });

    const vlanList = res3.visualState.vlans || [];
    const hasVlan20 = vlanList.some((v) => v.id === 20);
    const swNode = res3.visualState.topologyNodes.find((n) => n.id === 'SW1' || n.type === 'switch');
    const portFa02 = swNode?.ports.find((p) => p.name === 'FastEthernet0/2');

    check(hasVlan20, 'VLAN 20 registered in authoritative simulation visual state vlans list');
    check(portFa02?.vlan === 20, 'FastEthernet0/2 port visual membership bound to VLAN 20', `Port VLAN: ${portFa02?.vlan}`);
    check(res3.visualState.causalConsequence !== undefined, 'Causal visual explanation generated for VLAN mutation');
  }

  // ---------------------------------------------------------------------------
  // Test 2: Trunk -> visual state
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 2: Trunk -> Visual State Synchronization ---');
  {
    const session = await service.getOrCreateLabSession(learnerA, 'inter-vlan-routing');
    const res1 = await service.executeLabCommand(learnerA, {
      labId: 'inter-vlan-routing',
      command: 'interface GigabitEthernet0/1',
      sessionId: session.sessionId,
      clientStateVersion: session.stateVersion,
    });
    const res2 = await service.executeLabCommand(learnerA, {
      labId: 'inter-vlan-routing',
      command: 'switchport mode trunk',
      sessionId: res1.sessionId,
      clientStateVersion: res1.stateVersion,
    });
    const res3 = await service.executeLabCommand(learnerA, {
      labId: 'inter-vlan-routing',
      command: 'switchport trunk allowed vlan 10,20,30',
      sessionId: res2.sessionId,
      clientStateVersion: res2.stateVersion,
    });

    const swNode = res3.visualState.topologyNodes.find((n) => n.id === 'SW1' || n.type === 'switch');
    const portGi01 = swNode?.ports.find((p) => p.name === 'GigabitEthernet0/1');
    const trunkLink = res3.visualState.topologyLinks.find(
      (l) => l.type === 'trunk' || l.sourcePort === 'GigabitEthernet0/1'
    );

    check(portGi01?.mode === 'trunk', 'Port GigabitEthernet0/1 mode switched to trunk in visual model');
    check(trunkLink?.type === 'trunk', 'Topology link visual type transitioned to trunk');
    check(
      Array.isArray(trunkLink?.allowedVlans) && trunkLink.allowedVlans.includes(10) && trunkLink.allowedVlans.includes(30),
      'Trunk allowed VLANs list [10,20,30] populated in visual state link'
    );
  }

  // ---------------------------------------------------------------------------
  // Test 3: STP -> visual state
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 3: STP -> Visual State & Root Bridge ---');
  {
    const res = await service.executeLabCommand(learnerA, {
      labId: 'spanning-tree-protocol',
      command: 'spanning-tree vlan 1 priority 4096',
    });

    const isRoot = res.visualState.stp.isRootBridge;
    const bridgePriority = res.visualState.stp.bridgePriority;
    const rootNode = res.visualState.topologyNodes.find((n) => n.isRootBridge);

    check(isRoot === true, 'Switch elected as Root Bridge following priority 4096 update');
    check(bridgePriority === 4096, 'STP bridge priority reflected as 4096 in visual model');
    check(rootNode !== undefined && rootNode.isRootBridge === true, 'Root node visually crowned in topologyNodes model');
  }

  // ---------------------------------------------------------------------------
  // Test 4: Route -> packet path
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 4: Route Configuration -> Packet Forwarding Path ---');
  {
    const s = await service.getOrCreateLabSession(learnerA, 'static-routing-lab');
    const r1 = await service.executeLabCommand(learnerA, {
      labId: 'static-routing-lab',
      command: 'ip route 10.20.0.0 255.255.0.0 10.0.0.2',
      sessionId: s.sessionId,
      clientStateVersion: s.stateVersion,
    });
    const r2 = await service.executeLabCommand(learnerA, {
      labId: 'static-routing-lab',
      command: 'ping 10.20.0.15',
      sessionId: r1.sessionId,
      clientStateVersion: r1.stateVersion,
    });

    const packetEvents = r2.visualState.recentPacketEvents;
    check(packetEvents.length > 0, 'Ping execution produced authentic packet traversal events');
    const pingEvent = packetEvents[0];
    const hasForwardHop = pingEvent.hops.some((h) => h.action === 'forward' || h.action === 'route');
    check(hasForwardHop, 'Packet hops contain authentic forward/route transitions matching routing table');
    check(pingEvent.outcome === 'DELIVERED', 'Packet delivered successfully to destination network');
  }

  // ---------------------------------------------------------------------------
  // Test 5: ACL -> packet termination
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 5: ACL Deny -> Packet Termination at Filtering Device ---');
  {
    const s = await service.getOrCreateLabSession(learnerA, 'acl-troubleshooting');
    const r1 = await service.executeLabCommand(learnerA, {
      labId: 'acl-troubleshooting',
      command: 'access-list 101 deny ip any any',
      sessionId: s.sessionId,
      clientStateVersion: s.stateVersion,
    });
    const r2 = await service.executeLabCommand(learnerA, {
      labId: 'acl-troubleshooting',
      command: 'ping 198.51.100.1',
      sessionId: r1.sessionId,
      clientStateVersion: r1.stateVersion,
    });

    const events = r2.visualState.recentPacketEvents;
    check(events.length > 0, 'Packet traversal event recorded under ACL restriction');
    const aclEvent = events[0];
    check(aclEvent.outcome === 'BLOCKED_BY_ACL', 'Packet outcome marked BLOCKED_BY_ACL');
    const dropHop = aclEvent.hops.find((h) => h.action === 'filter_deny' || h.action === 'drop');
    check(dropHop !== undefined, 'Filtering device executed filter_deny action');
    check(
      dropHop?.toNodeId === 'fw-perimeter' || dropHop?.deviceType?.toLowerCase() === 'firewall',
      'Packet terminated at firewall device, prevented from reaching destination'
    );
  }

  // ---------------------------------------------------------------------------
  // Test 6: NAT -> translation
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 6: NAT -> Packet Header Translation ---');
  {
    const s = await service.getOrCreateLabSession(learnerA, 'nat-pat-configuration');
    const r1 = await service.executeLabCommand(learnerA, {
      labId: 'nat-pat-configuration',
      command: 'ip nat inside source list 1 interface GigabitEthernet0/1 overload',
      sessionId: s.sessionId,
      clientStateVersion: s.stateVersion,
    });
    const r2 = await service.executeLabCommand(learnerA, {
      labId: 'nat-pat-configuration',
      command: 'ping 8.8.8.8',
      sessionId: r1.sessionId,
      clientStateVersion: r1.stateVersion,
    });

    const natEvents = r2.visualState.recentPacketEvents;
    check(natEvents.length > 0, 'Packet event recorded through NAT gateway');
    const natHop = natEvents[0]?.hops.find((h) => h.action === 'translate');
    check(natHop !== undefined, 'NAT translation hop present in packet traversal path');
    check(
      natHop?.packetHeader.translatedSrcIp !== undefined,
      `Packet header translated source IP populated: ${natHop?.packetHeader.translatedSrcIp}`
    );
  }

  // ---------------------------------------------------------------------------
  // Test 7: Topology path derivation
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 7: Multi-Hop Topology Path Derivation ---');
  {
    const state = NetworkSimulationEngine.getInitialStateForLab('default-routing');
    const topology = NetworkSimulationEngine.getAuthoritativeTopology('default-routing', state);
    check(topology.nodes.length >= 2, 'Authoritative topology defines connected network nodes');
    check(topology.links.length >= 1, 'Authoritative topology defines physical/logical links');

    const pingEvent = NetworkSimulationEngine.derivePacketPathForPing('default-routing', state, '10.0.0.1', 'ping 10.0.0.1');
    check(pingEvent !== undefined, 'Deterministic packet path derived without animation fabrication');
    check(pingEvent.hops.length >= 2, 'Hop-by-hop traversal models source -> intermediate -> destination');
  }

  // ---------------------------------------------------------------------------
  // Test 8: State version monotonicity
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 8: Monotonically Increasing State Versioning ---');
  {
    const s = await service.getOrCreateLabSession(learnerA, 'version-test-lab');
    const v0 = s.stateVersion; // 1
    const res1 = await service.executeLabCommand(learnerA, {
      labId: 'version-test-lab',
      command: 'hostname R1-Test',
      sessionId: s.sessionId,
      clientStateVersion: v0,
    });
    const v1 = res1.stateVersion;
    const res2 = await service.executeLabCommand(learnerA, {
      labId: 'version-test-lab',
      command: 'interface GigabitEthernet0/0',
      sessionId: res1.sessionId,
      clientStateVersion: v1,
    });
    const v2 = res2.stateVersion;
    const res3 = await service.executeLabCommand(learnerA, {
      labId: 'version-test-lab',
      command: 'ip address 192.168.1.1 255.255.255.0',
      sessionId: res2.sessionId,
      clientStateVersion: v2,
    });
    const v3 = res3.stateVersion;

    check(v1 === v0 + 1, `Version incremented from ${v0} to ${v1}`);
    check(v2 === v1 + 1, `Version incremented from ${v1} to ${v2}`);
    check(v3 === v2 + 1, `Version incremented from ${v2} to ${v3}`);
  }

  // ---------------------------------------------------------------------------
  // Test 9: Concurrent command handling & idempotent duplicate retries
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 9: Idempotent Duplicate Command Retry Handling ---');
  {
    const s = await service.getOrCreateLabSession(learnerA, 'retry-test-lab');
    const originalRes = await service.executeLabCommand(learnerA, {
      labId: 'retry-test-lab',
      command: 'ip routing',
      sessionId: s.sessionId,
      clientStateVersion: s.stateVersion,
    });
    const expectedVer = originalRes.stateVersion;

    // Retry identical command with same client version (e.g. network timeout retry)
    const retryRes = await service.executeLabCommand(learnerA, {
      labId: 'retry-test-lab',
      command: 'ip routing',
      sessionId: originalRes.sessionId,
      clientStateVersion: s.stateVersion, // Retrying with pre-mutation version
    });

    check(retryRes.isDuplicateRetry === true, 'Duplicate command identified as idempotent retry');
    check(retryRes.stateVersion === expectedVer, 'State version preserved without double-mutation increment');
  }

  // ---------------------------------------------------------------------------
  // Test 10: Stale-state rejection
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 10: Stale State Version Conflict Rejection ---');
  {
    const s = await service.getOrCreateLabSession(learnerA, 'stale-test-lab');
    // Advance version twice
    const r1 = await service.executeLabCommand(learnerA, {
      labId: 'stale-test-lab',
      command: 'cmd1',
      sessionId: s.sessionId,
      clientStateVersion: s.stateVersion,
    });
    const r2 = await service.executeLabCommand(learnerA, {
      labId: 'stale-test-lab',
      command: 'cmd2',
      sessionId: r1.sessionId,
      clientStateVersion: r1.stateVersion,
    });

    let conflictCaught = false;
    try {
      // Intentionally send stale client version (version 1 when server is at version 3)
      await service.executeLabCommand(learnerA, {
        labId: 'stale-test-lab',
        command: 'conflicting-cmd',
        sessionId: r2.sessionId,
        clientStateVersion: 1,
      });
    } catch (err: any) {
      if (err instanceof ConflictException) {
        conflictCaught = true;
      }
    }

    check(conflictCaught, 'ConflictException thrown on stale clientStateVersion submission');
  }

  // ---------------------------------------------------------------------------
  // Test 11: Unauthorized state access (IDOR Protection)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 11: Unauthorized Simulation Session IDOR Protection ---');
  {
    const sessionA = await service.getOrCreateLabSession(learnerA, 'idor-test-lab');
    let forbiddenCaught = false;

    try {
      // Learner B attempts to access Learner A's session
      await service.getLabSimulationState(learnerB, 'idor-test-lab', sessionA.sessionId);
    } catch (err: any) {
      if (err instanceof ForbiddenException) {
        forbiddenCaught = true;
      }
    }

    check(forbiddenCaught, 'ForbiddenException thrown when user queries another learner simulation session');

    let executeForbiddenCaught = false;
    try {
      await service.executeLabCommand(learnerB, {
        labId: 'idor-test-lab',
        command: 'malicious-injected-command',
        sessionId: sessionA.sessionId,
        clientStateVersion: sessionA.stateVersion,
      });
    } catch (err: any) {
      if (err instanceof ForbiddenException) {
        executeForbiddenCaught = true;
      }
    }

    check(executeForbiddenCaught, 'ForbiddenException thrown when user executes commands on foreign session');
  }

  // ---------------------------------------------------------------------------
  // Test 12: Hidden-state serialization audit
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 12: Hidden-State Serialization Leak Audit ---');
  {
    const state = NetworkSimulationEngine.getInitialStateForLab('subnetting-practice');
    const visual = NetworkSimulationEngine.toVisualState(
      'subnetting-practice',
      state,
      1,
      'sim-audit-001',
      'lab-001',
      1
    );

    const serialized = JSON.stringify(visual);
    const forbiddenKeys = [
      'injectedFault',
      'targetState',
      'solutionCriteria',
      'answerKey',
      'rubric',
      'expectedAnswers',
    ];

    let leakFound = false;
    for (const key of forbiddenKeys) {
      if (serialized.includes(`"${key}"`)) {
        leakFound = true;
        console.error(`Leak detected for forbidden key: ${key}`);
      }
    }

    check(!leakFound, 'Zero forbidden evaluation / target solution keys leaked in visual state DTO');
  }

  // ---------------------------------------------------------------------------
  // Test 13: Progressive hint locking
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 13: Progressive Diagnostic Hint Locking & Revealing ---');
  {
    const s = await service.getOrCreateLabSession(learnerA, 'hints-test-lab');
    const state0 = await service.getLabSimulationState(learnerA, 'hints-test-lab', s.sessionId);

    check(state0.hints?.currentLevel === 0, 'Initial hint unlocked level is 0');
    check(state0.hints?.unlockedHints.length === 0, 'Zero hints visible at level 0');

    // Unlock Level 1
    const unlock1 = await service.unlockLabHint(learnerA, 'hints-test-lab', s.sessionId);
    check(unlock1.hints.currentLevel === 1, 'Current hint level advanced to 1');
    check(unlock1.hints.unlockedHints.length === 1, 'Only Level 1 hint unlocked');
    check(unlock1.hints.unlockedHints[0].level === 1, 'Unlocked hint is Level 1 (Subsystem identification)');

    // Unlock Level 2
    const unlock2 = await service.unlockLabHint(learnerA, 'hints-test-lab', s.sessionId);
    check(unlock2.hints.currentLevel === 2, 'Current hint level advanced to 2');
    check(unlock2.hints.unlockedHints.length === 2, 'Level 1 and Level 2 hints unlocked');

    // Verify unearned Level 3 & Level 4 hints are NOT present
    const hasLevel3 = unlock2.hints.unlockedHints.some((h) => h.level === 3);
    const hasLevel4 = unlock2.hints.unlockedHints.some((h) => h.level === 4);
    check(!hasLevel3 && !hasLevel4, 'Level 3 and Level 4 hints remain masked and omitted from wire DTO');
  }

  // ---------------------------------------------------------------------------
  // Test 14: Refresh / Session Reconstruction
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 14: Browser Refresh & Session Reconstruction ---');
  {
    const s = await service.getOrCreateLabSession(learnerA, 'reconstruct-test-lab');
    await service.executeLabCommand(learnerA, {
      labId: 'reconstruct-test-lab',
      command: 'interface FastEthernet0/1',
      sessionId: s.sessionId,
      clientStateVersion: s.stateVersion,
    });
    await service.unlockLabHint(learnerA, 'reconstruct-test-lab', s.sessionId);

    // Simulate page reload: Fetch state using existing sessionId
    const reconstructed = await service.getLabSimulationState(learnerA, 'reconstruct-test-lab', s.sessionId);

    check(reconstructed.sessionId === s.sessionId, 'Reconstructed session retains matching sessionId');
    check(reconstructed.stateVersion === 2, 'Reconstructed session retains authoritative stateVersion 2');
    check(reconstructed.hints?.currentLevel === 1, 'Reconstructed session retains unlocked hint level 1');
  }

  // ---------------------------------------------------------------------------
  // Test 15: Multi-Tab State Safety
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 15: Multi-Tab State Isolation Safety ---');
  {
    // Tab 1 running Lab A
    const sessionTab1 = await service.getOrCreateLabSession(learnerA, 'multi-tab-lab-1');
    // Tab 2 running Lab B
    const sessionTab2 = await service.getOrCreateLabSession(learnerA, 'multi-tab-lab-2');

    await service.executeLabCommand(learnerA, {
      labId: 'multi-tab-lab-1',
      command: 'hostname Tab1-Router',
      sessionId: sessionTab1.sessionId,
      clientStateVersion: sessionTab1.stateVersion,
    });

    const state1 = await service.getLabSimulationState(learnerA, 'multi-tab-lab-1', sessionTab1.sessionId);
    const state2 = await service.getLabSimulationState(learnerA, 'multi-tab-lab-2', sessionTab2.sessionId);

    check(state1.device.hostname === 'Tab1-Router', 'Tab 1 state mutated to Tab1-Router');
    check(state2.device.hostname !== 'Tab1-Router', 'Tab 2 state isolated from Tab 1 mutation');
    check(state1.stateVersion === 2, 'Tab 1 version advanced to 2');
    check(state2.stateVersion === 1, 'Tab 2 version remained at baseline 1');
  }

  // ---------------------------------------------------------------------------
  // Test 16: DTO Wire Payload Size & Performance Budget
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 16: DTO Wire Payload Size & Performance Budget ---');
  {
    const state = await service.getLabSimulationState(learnerA, 'vlan-configuration');
    const visualBytes = Buffer.byteLength(JSON.stringify(state), 'utf8');
    const hintsBytes = Buffer.byteLength(JSON.stringify(state.hints || {}), 'utf8');

    console.log(`  📊 VisualSimulationStateDto wire size: ${visualBytes} bytes (${(visualBytes / 1024).toFixed(2)} KB)`);
    console.log(`  📊 SanitizedDiagnosticHintsDto wire size: ${hintsBytes} bytes (${(hintsBytes / 1024).toFixed(2)} KB)`);

    check(visualBytes < 50 * 1024, 'Visual state payload strictly under 50 KB performance budget', `${visualBytes} B`);
    check(hintsBytes < 10 * 1024, 'Sanitized hints payload strictly under 10 KB performance budget', `${hintsBytes} B`);
  }

  // ---------------------------------------------------------------------------
  // Final Results
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runDropPVerificationGate().catch((err) => {
  console.error('Fatal execution failure in Drop P test suite:', err);
  process.exit(1);
});
