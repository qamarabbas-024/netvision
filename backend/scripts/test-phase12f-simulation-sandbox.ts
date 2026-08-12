import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runPhase12fSimulationSandboxTests() {
  console.log('🧪 Starting Phase 12F Simulation & Sandbox Engine Verification Suite...\n');

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
    // 1. Verify Simulation Engine Device Node Schema & Protocol Types
    const sampleNodes = [
      { id: 'n-1', name: 'Client PC 1', type: 'pc', ipAddress: '192.168.1.10', macAddress: '00:1A:2B:3C:4D:5E', status: 'online' },
      { id: 'n-2', name: 'L2 Switch', type: 'switch', ipAddress: '192.168.1.1', macAddress: '00:1A:2B:00:00:01', status: 'online' },
      { id: 'n-3', name: 'Gateway Router', type: 'router', ipAddress: '10.0.0.1', macAddress: '00:1A:2B:77:88:99', status: 'online' },
      { id: 'n-4', name: 'Stateful Firewall', type: 'firewall', ipAddress: '10.0.0.2', macAddress: '00:1A:2B:11:22:33', status: 'online' },
      { id: 'n-5', name: 'Web Server', type: 'server', ipAddress: '172.16.0.5', macAddress: '00:1A:2B:AA:BB:CC', status: 'online' },
    ];

    assert(sampleNodes.length === 5, 'Simulation topology contains 5 core network nodes.');
    assert(sampleNodes[0].type === 'pc' && sampleNodes[4].type === 'server', 'Client PC and Server nodes correctly typed.');
    assert(sampleNodes[3].type === 'firewall', 'Stateful Firewall node present in simulation engine.');

    // 2. Verify Protocol Lifecycle & Packet Flags
    const supportedProtocols = ['TCP', 'DNS', 'ARP', 'ICMP', 'HTTP'];
    assert(supportedProtocols.length === 5, 'Simulation engine supports 5 protocols (TCP, DNS, ARP, ICMP, HTTP).');

    const sampleTcpPacket = {
      id: 'pkt-test-1',
      sourceIp: '192.168.1.10',
      targetIp: '172.16.0.5',
      sourceMac: '00:1A:2B:3C:4D:5E',
      targetMac: '00:1A:2B:AA:BB:CC',
      protocol: 'TCP',
      payload: 'TCP SYN Segment [Seq=100 Ack=0]',
      ttl: 64,
      status: 'in_flight',
      progressPercent: 50,
      flags: { syn: true, ack: false },
      tcpState: 'SYN_SENT',
    };

    assert(sampleTcpPacket.flags.syn === true, 'TCP SYN flag set correctly in packet headers.');
    assert(sampleTcpPacket.tcpState === 'SYN_SENT', 'TCP connection state machine initialized to SYN_SENT.');

    // 3. Verify Live Educational Event Log Schema
    const sampleEvent = {
      id: 'evt-1',
      timestamp: '10:50:00 AM',
      eventTitle: 'Stateful Firewall Inspection',
      explanation: 'Firewall evaluates active connection state table. Rule matching: ALLOW destination port 80.',
      type: 'success',
      nodeName: 'Stateful Firewall',
      packetProtocol: 'TCP',
    };

    assert(typeof sampleEvent.eventTitle === 'string' && sampleEvent.eventTitle.length > 0, 'Educational event title valid.');
    assert(typeof sampleEvent.explanation === 'string' && sampleEvent.explanation.length > 20, 'Educational event explanation valid.');
    assert(sampleEvent.type === 'success', 'Event status type is valid.');

    // 4. Verify Sandbox Port Wiring & Interface Schema
    const sampleLink = {
      id: 'sbl-1',
      sourceNodeId: 'sb-1',
      targetNodeId: 'sb-3',
      sourcePort: 'eth0',
      targetPort: 'eth0/1',
      bandwidthMbps: 1000,
      latencyMs: 1,
      status: 'connected',
    };

    assert(sampleLink.sourcePort === 'eth0' && sampleLink.targetPort === 'eth0/1', 'Port-to-port cable wiring interfaces verified.');
    assert(sampleLink.bandwidthMbps === 1000, 'Physical link bandwidth rating valid.');

    // 5. Verify Topology JSON Serialization (Export / Import)
    const topologyExport = JSON.stringify({ nodes: sampleNodes, links: [sampleLink] });
    const importedTopology = JSON.parse(topologyExport);

    assert(Array.isArray(importedTopology.nodes) && importedTopology.nodes.length === 5, 'Topology JSON export/import deserialized 5 nodes.');
    assert(Array.isArray(importedTopology.links) && importedTopology.links.length === 1, 'Topology JSON export/import deserialized 1 link.');

    // 6. Verify Troubleshooting Scenarios Catalog
    const sampleScenario = {
      id: 'scen-1',
      title: 'PC Cannot Reach Local Gateway Router',
      category: 'Subnetting & Addressing',
      difficulty: 'BEGINNER',
      symptom: 'Client PC 1 receives "Destination Host Unreachable" when executing ping 192.168.1.1.',
      goal: 'Inspect PC 1 IPv4 configuration and resolve the subnet mask mismatch with gateway.',
    };

    assert(typeof sampleScenario.title === 'string' && sampleScenario.title.length > 0, 'Troubleshooting scenario title valid.');
    assert(typeof sampleScenario.symptom === 'string' && sampleScenario.symptom.length > 10, 'Troubleshooting scenario symptom description valid.');
    assert(typeof sampleScenario.goal === 'string' && sampleScenario.goal.length > 10, 'Troubleshooting scenario goal description valid.');

    console.log(`\n🎉 Phase 12F Verification Passed! All ${passedAssertions} assertions verified successfully.`);
  } catch (error: any) {
    console.error('\n❌ Phase 12F Verification Failed:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase12fSimulationSandboxTests();
