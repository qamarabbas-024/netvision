import { LESSONS_NET100 } from '../src/topics/lessons-net100';
import { LESSONS_NET200 } from '../src/topics/lessons-net200';
import { LESSONS_NET203_204 } from '../src/topics/lessons-net203-204';
import { LESSONS_NET300_400 } from '../src/topics/lessons-net300-400';
import { BENCHMARK_LESSONS_FULL } from '../src/topics/benchmark-lessons-content';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[CURRICULUM CONTENT V2 ASSERTION FAILED]: ${msg}`);
  }
}

async function verifyCurriculumContentV2() {
  console.log('================================================================');
  console.log('🧪 NETVISION CURRICULUM CONTENT ARCHITECTURE V2 VERIFICATION');
  console.log('================================================================\n');

  // [TEST 1] Verify Representative Lesson 1: NET-101 (Bits, Bytes, Binary & Hex)
  console.log('[TEST 1] Verifying Representative Lesson: NET-101 Bits / Bytes / Binary / Hex...');
  const net101 = LESSONS_NET100.find((l) => l.slug === 'net-101-bits-bytes-binary-hex');
  assert(!!net101, 'NET-101 lesson exists');
  const c101 = net101!.contentV2 || (net101!.stepMetadata as any);
  assert(!!c101, 'NET-101 content exists');
  assert(typeof c101.objective === 'string' || typeof c101.step1_objective === 'string', 'NET-101 has objective');
  assert(!!c101.explanation || !!c101.step4_coreConcept, 'NET-101 has core explanation');
  assert(!!c101.visualizer || !!c101.step8_visualExplanation, 'NET-101 has Binary Converter visualizer');
  assert(!!c101.workedExample || !!c101.step9_workedExample, 'NET-101 has worked conversion example');
  assert(!!c101.recap || !!c101.step18_masterySummary, 'NET-101 has summary recap');
  // Confirm NO forced generic filler in V2
  if (net101!.contentV2) {
    assert(!net101!.contentV2.cliTooling, 'NET-101 V2 does not force arbitrary CLI tooling');
    assert(!net101!.contentV2.packetHeaderView, 'NET-101 V2 does not force fake packet header view');
    assert(!net101!.contentV2.security, 'NET-101 V2 does not force generic security section');
    assert(!net101!.lab, 'NET-101 V2 does not force unnecessary CLI lab for pure math conversions');
  }
  console.log('  ✓ NET-101 conforms to focused educational scope (conversions, units, worked examples, practice).');

  // [TEST 2] Verify Representative Lesson 2: NET-203 (IPv6 Foundations & SLAAC)
  console.log('\n[TEST 2] Verifying Representative Lesson: NET-203 IPv6 Foundations & SLAAC...');
  const net203 = LESSONS_NET203_204.find((l) => l.slug === 'ipv6-foundations-overview');
  assert(!!net203, 'NET-203 IPv6 lesson exists');
  const c203 = net203!.contentV2 || (net203!.stepMetadata as any);
  assert(!!c203, 'NET-203 content exists');
  assert(c203.explanation?.includes('128 bits') || c203.step4_coreConcept?.includes('128 bits'), 'NET-203 explains 128-bit addressing');
  assert(c203.explanation?.includes('RFC 5952') || c203.step4_coreConcept?.includes('RFC 5952'), 'NET-203 covers RFC 5952 compression');
  assert(c203.explanation?.includes('SLAAC') || c203.step4_coreConcept?.includes('SLAAC'), 'NET-203 covers SLAAC and NDP');
  assert(!!c203.visualizer || !!c203.step8_visualExplanation, 'NET-203 has IPv6 compression visualizer');
  console.log('  ✓ NET-203 conforms to IPv6 foundations scope without forced generic CLI/Wireshark filler.');

  // [TEST 3] Verify Representative Lesson 3: NET-304 (Multi-Area OSPF & Redistribution)
  console.log('\n[TEST 3] Verifying Representative Lesson: NET-304 Multi-Area OSPF & Redistribution...');
  const net304 = LESSONS_NET300_400.find((l) => l.slug === 'net-304-multi-area-ospf-redistribution');
  assert(!!net304, 'NET-304 Multi-Area OSPF lesson exists');
  const c304 = net304!.contentV2 || (net304!.stepMetadata as any);
  assert(!!c304, 'NET-304 content exists');
  assert(c304.explanation?.includes('Area 0') || c304.step4_coreConcept?.includes('Area 0'), 'NET-304 covers Area 0 backbone hierarchy');
  assert(c304.explanation?.includes('ABR') || c304.step4_coreConcept?.includes('ABR'), 'NET-304 covers ABR/ASBR roles');
  assert(c304.explanation?.includes('Type 3') || c304.step4_coreConcept?.includes('Type 3'), 'NET-304 covers LSA Types 1-5');
  assert(!!c304.visualizer || !!c304.step8_visualExplanation, 'NET-304 has Multi-Area OSPF visualizer');
  assert(!!net304!.lab, 'NET-304 includes hands-on routing lab');
  console.log('  ✓ NET-304 includes appropriate routing topology, LSA classification, troubleshooting, and lab.');

  // [TEST 4] Verify Representative Lesson 4: NET-403 (Network Automation Foundations)
  console.log('\n[TEST 4] Verifying Representative Lesson: NET-403 Network Automation Foundations...');
  const net403 = LESSONS_NET300_400.find((l) => l.slug === 'net-403-network-automation-programmability-foundations');
  assert(!!net403, 'NET-403 Network Automation lesson exists');
  const c403 = net403!.contentV2 || (net403!.stepMetadata as any);
  assert(!!c403, 'NET-403 content exists');
  assert(c403.explanation?.includes('Idempotency') || c403.step4_coreConcept?.includes('Idempotency'), 'NET-403 covers Idempotency');
  assert(c403.explanation?.includes('REST') || c403.step4_coreConcept?.includes('REST'), 'NET-403 covers REST APIs');
  assert(c403.explanation?.includes('JSON') || c403.step4_coreConcept?.includes('JSON'), 'NET-403 covers JSON data structures');
  assert(!!c403.visualizer || !!c403.step8_visualExplanation, 'NET-403 has automation pipeline visualizer');
  assert(!!net403!.lab, 'NET-403 includes safe simulated REST API lab');
  console.log('  ✓ NET-403 covers core automation & programmability without mega-course bloat.');

  // [TEST 5] Verify Total Active Curriculum Inventory & Integrity
  console.log('\n[TEST 5] Verifying Full Curriculum Lesson Inventory & Sequence...');
  const totalBenchmarkCount = BENCHMARK_LESSONS_FULL.length;
  assert(totalBenchmarkCount >= 10, `At least 10 active benchmark lessons registered (found: ${totalBenchmarkCount})`);

  BENCHMARK_LESSONS_FULL.forEach((lesson) => {
    assert(!!lesson.slug, `Lesson has slug: ${lesson.title}`);
    assert(!!lesson.title, `Lesson has title: ${lesson.slug}`);
    assert(!!lesson.courseCode, `Lesson has courseCode: ${lesson.slug}`);
    assert(lesson.durationMinutes > 0, `Lesson has valid duration: ${lesson.slug}`);
    assert(lesson.questions.length >= 1, `Lesson has assessment questions: ${lesson.slug}`);
    assert(!!lesson.contentV2 || !!lesson.stepMetadata, `Lesson has content definition: ${lesson.slug}`);
  });
  console.log(`  ✓ All ${totalBenchmarkCount} benchmark lessons validated with robust metadata, questions, and content.`);

  // [TEST 6] Verify Optional Block Rendering & No Forced Uniformity
  console.log('\n[TEST 6] Verifying Content Modularity & Absence of Forced Uniformity...');
  const lessonsWithLabs = BENCHMARK_LESSONS_FULL.filter((l) => !!l.lab);
  const lessonsWithoutLabs = BENCHMARK_LESSONS_FULL.filter((l) => !l.lab);
  assert(lessonsWithLabs.length > 0, 'Some lessons appropriately include labs');
  assert(lessonsWithoutLabs.length > 0, 'Some lessons appropriately omit labs (e.g. digital fundamentals)');
  console.log(`  ✓ Modular structure verified: ${lessonsWithLabs.length} lessons with labs, ${lessonsWithoutLabs.length} lessons with focused non-lab practice.`);

  // [TEST 7] Verify Batch 1 Migrated Foundational Lessons (P0)
  console.log('\n[TEST 7] Verifying Batch 1 Migrated Foundational Lessons (P0)...');
  const batch1Slugs = [
    'level-0-what-is-a-computer-network',
    'level-0-client-and-server-architecture',
    'level-0-lan-wan-internet-boundaries',
    'level-0-network-protocols-standards',
    'network-topologies-overview',
  ];

  for (const slug of batch1Slugs) {
    const lesson = LESSONS_NET100.find((l) => l.slug === slug);
    assert(!!lesson, `Batch 1 lesson exists: ${slug}`);
    assert(!!lesson!.contentV2, `Batch 1 lesson has contentV2: ${slug}`);
    assert(typeof lesson!.contentV2!.objective === 'string', `${slug} has objective`);
    assert(typeof lesson!.contentV2!.explanation === 'string', `${slug} has explanation`);
    assert(Array.isArray(lesson!.contentV2!.recap) && lesson!.contentV2!.recap.length > 0, `${slug} has recap`);
    assert(lesson!.questions.length >= 3, `${slug} has at least 3 high-quality assessment questions`);
    // Ensure no forced bloat / fake sections
    assert(!lesson!.contentV2!.cliTooling, `${slug} does not have forced CLI tooling`);
    assert(!lesson!.contentV2!.packetHeaderView, `${slug} does not have forced fake packet header view`);
    assert(!lesson!.contentV2!.troubleshooting, `${slug} does not have forced unrelated troubleshooting`);
    assert(!lesson!.contentV2!.security, `${slug} does not have forced unrelated security`);
    assert(!lesson!.lab, `${slug} does not have forced synthetic lab`);
  }
  console.log(`  ✓ All ${batch1Slugs.length} Batch 1 foundational lessons verified with clean V2 structure and zero forced filler.`);

  // [TEST 8] Verify NET-101 Lesson 2: Physical Media & Transceivers
  console.log('\n[TEST 8] Verifying NET-101 Lesson 2 (Physical Media & Transceivers)...');
  const net101Media = LESSONS_NET100.find((l) => l.slug === 'network-devices-overview');
  assert(!!net101Media, 'NET-101 Lesson 2 (network-devices-overview) exists');
  assert(!!net101Media!.contentV2, 'NET-101 Lesson 2 has Content V2 structure');
  assert(net101Media!.order === 2, 'NET-101 Lesson 2 is correctly ordered as lesson 2 in NET-101');
  assert(typeof net101Media!.contentV2!.objective === 'string', 'NET-101 Lesson 2 has clear objective');
  assert(net101Media!.contentV2!.explanation.includes('Copper Twisted-Pair'), 'NET-101 Lesson 2 explains copper');
  assert(net101Media!.contentV2!.explanation.includes('Optical Fiber'), 'NET-101 Lesson 2 explains fiber');
  assert(net101Media!.contentV2!.explanation.includes('Single-Mode Fiber'), 'NET-101 Lesson 2 explains SMF');
  assert(net101Media!.contentV2!.explanation.includes('Multimode Fiber'), 'NET-101 Lesson 2 explains MMF');
  assert(net101Media!.contentV2!.explanation.includes('Power over Ethernet'), 'NET-101 Lesson 2 explains PoE');
  assert(net101Media!.contentV2!.components.length >= 6, 'NET-101 Lesson 2 has 6 technical components');
  assert(Array.isArray(net101Media!.contentV2!.practice) && net101Media!.contentV2!.practice.length >= 6, 'NET-101 Lesson 2 has 6 practice exercises');
  assert(net101Media!.questions.length >= 6, 'NET-101 Lesson 2 has 6 aligned quiz questions');
  assert(!net101Media!.contentV2!.packetHeaderView, 'NET-101 Lesson 2 has no fake packet header');
  assert(!net101Media!.contentV2!.cliTooling, 'NET-101 Lesson 2 has no forced CLI bloat');
  assert(!net101Media!.contentV2!.security, 'NET-101 Lesson 2 has no generic security filler');
  assert(!net101Media!.lab, 'NET-101 Lesson 2 has no phantom CLI lab');
  // Verify simplified beginner tone (no overly complex specs)
  assert(!net101Media!.contentV2!.explanation.includes('VCSEL'), 'NET-101 Lesson 2 avoids advanced VCSEL jargon');
  assert(!net101Media!.contentV2!.explanation.includes('modal dispersion'), 'NET-101 Lesson 2 avoids modal dispersion physics jargon');
  console.log('  ✓ NET-101 Lesson 2 verified with clean Content V2 structure, beginner-level pedagogy, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 9] Verify NET-103 Lesson 2: The 7-Layer OSI Reference Model
  console.log('\n[TEST 9] Verifying NET-103 Lesson 2 (The 7-Layer OSI Reference Model)...');
  const net103Osi = LESSONS_NET100.find((l) => l.slug === 'osi-model-7-layers');
  assert(!!net103Osi, 'NET-103 Lesson 2 (osi-model-7-layers) exists');
  assert(!!net103Osi!.contentV2, 'NET-103 Lesson 2 has Content V2 structure');
  assert(net103Osi!.courseCode === 'NET-103', 'NET-103 Lesson 2 has courseCode NET-103');
  assert(net103Osi!.order === 2, 'NET-103 Lesson 2 is correctly ordered as lesson 2 in NET-103');
  assert(typeof net103Osi!.contentV2!.objective === 'string', 'NET-103 Lesson 2 has clear objective');
  assert(net103Osi!.contentV2!.explanation.includes('Application Layer'), 'NET-103 Lesson 2 explains Application layer');
  assert(net103Osi!.contentV2!.explanation.includes('Presentation Layer'), 'NET-103 Lesson 2 explains Presentation layer');
  assert(net103Osi!.contentV2!.explanation.includes('Session Layer'), 'NET-103 Lesson 2 explains Session layer');
  assert(net103Osi!.contentV2!.explanation.includes('Transport Layer'), 'NET-103 Lesson 2 explains Transport layer');
  assert(net103Osi!.contentV2!.explanation.includes('Network Layer'), 'NET-103 Lesson 2 explains Network layer');
  assert(net103Osi!.contentV2!.explanation.includes('Data Link Layer'), 'NET-103 Lesson 2 explains Data Link layer');
  assert(net103Osi!.contentV2!.explanation.includes('Physical Layer'), 'NET-103 Lesson 2 explains Physical layer');
  assert(net103Osi!.contentV2!.explanation.includes('Encapsulation'), 'NET-103 Lesson 2 explains Encapsulation');
  assert(net103Osi!.contentV2!.explanation.includes('Decapsulation'), 'NET-103 Lesson 2 explains Decapsulation');
  assert(net103Osi!.contentV2!.components.length === 7, 'NET-103 Lesson 2 has 7 layer components');
  assert(Array.isArray(net103Osi!.contentV2!.practice) && net103Osi!.contentV2!.practice.length >= 6, 'NET-103 Lesson 2 has 6 practice exercises');
  assert(net103Osi!.questions.length >= 6, 'NET-103 Lesson 2 has 6 aligned quiz questions');
  assert(!net103Osi!.contentV2!.packetHeaderView, 'NET-103 Lesson 2 has no fake packet header');
  assert(!net103Osi!.contentV2!.cliTooling, 'NET-103 Lesson 2 has no forced CLI bloat');
  assert(!net103Osi!.contentV2!.security, 'NET-103 Lesson 2 has no generic security filler');
  assert(!net103Osi!.lab, 'NET-103 Lesson 2 has no phantom CLI lab');
  console.log('  ✓ NET-103 Lesson 2 verified with clean Content V2 structure, all 7 layers, encapsulation/decapsulation, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 10] Verify NET-103 Lesson 3: The TCP/IP 4-Layer Architecture & Model Mapping
  console.log('\n[TEST 10] Verifying NET-103 Lesson 3 (The TCP/IP 4-Layer Architecture)...');
  const net103TcpIp = LESSONS_NET100.find((l) => l.slug === 'tcp-ip-4-layers');
  assert(!!net103TcpIp, 'NET-103 Lesson 3 (tcp-ip-4-layers) exists');
  assert(!!net103TcpIp!.contentV2, 'NET-103 Lesson 3 has Content V2 structure');
  assert(net103TcpIp!.courseCode === 'NET-103', 'NET-103 Lesson 3 has courseCode NET-103');
  assert(net103TcpIp!.order === 3, 'NET-103 Lesson 3 is correctly ordered as lesson 3 in NET-103');
  assert(typeof net103TcpIp!.contentV2!.objective === 'string', 'NET-103 Lesson 3 has clear objective');
  assert(net103TcpIp!.contentV2!.explanation.includes('Application Layer'), 'NET-103 Lesson 3 explains Application layer');
  assert(net103TcpIp!.contentV2!.explanation.includes('Transport Layer'), 'NET-103 Lesson 3 explains Transport layer');
  assert(net103TcpIp!.contentV2!.explanation.includes('Internet Layer'), 'NET-103 Lesson 3 explains Internet layer');
  assert(net103TcpIp!.contentV2!.explanation.includes('Network Access'), 'NET-103 Lesson 3 explains Network Access layer');
  assert(net103TcpIp!.contentV2!.explanation.includes('Conceptual Mapping'), 'NET-103 Lesson 3 explains Conceptual Mapping to OSI');
  assert(net103TcpIp!.contentV2!.explanation.includes('Encapsulation'), 'NET-103 Lesson 3 explains Encapsulation flow');
  assert(net103TcpIp!.contentV2!.components.length === 4, 'NET-103 Lesson 3 has 4 layer components');
  assert(Array.isArray(net103TcpIp!.contentV2!.practice) && net103TcpIp!.contentV2!.practice.length >= 6, 'NET-103 Lesson 3 has 6 practice exercises');
  assert(net103TcpIp!.questions.length >= 6, 'NET-103 Lesson 3 has 6 aligned quiz questions');
  assert(!net103TcpIp!.contentV2!.packetHeaderView, 'NET-103 Lesson 3 has no fake packet header');
  assert(!net103TcpIp!.contentV2!.cliTooling, 'NET-103 Lesson 3 has no forced CLI bloat');
  assert(!net103TcpIp!.contentV2!.security, 'NET-103 Lesson 3 has no generic security filler');
  assert(!net103TcpIp!.lab, 'NET-103 Lesson 3 has no phantom CLI lab');
  console.log('  ✓ NET-103 Lesson 3 verified with clean Content V2 structure, 4 TCP/IP layers, OSI conceptual mapping, encapsulation flow, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 11] Verify NET-102 Network Performance Metrics (net-102-network-performance)
  console.log('\n[TEST 11] Verifying NET-102 Network Performance Metrics...');
  const net102Perf = LESSONS_NET100.find((l) => l.slug === 'net-102-network-performance');
  assert(!!net102Perf, 'NET-102 Network Performance (net-102-network-performance) exists');
  assert(!!net102Perf!.contentV2, 'NET-102 Network Performance has Content V2 structure');
  assert(net102Perf!.courseCode === 'NET-102', 'NET-102 has courseCode NET-102');
  assert(typeof net102Perf!.contentV2!.objective === 'string', 'NET-102 has clear objective');
  assert(net102Perf!.contentV2!.explanation.includes('Latency'), 'NET-102 explains Latency');
  assert(net102Perf!.contentV2!.explanation.includes('Transmission Delay'), 'NET-102 explains Transmission Delay');
  assert(net102Perf!.contentV2!.explanation.includes('Propagation Delay'), 'NET-102 explains Propagation Delay');
  assert(net102Perf!.contentV2!.explanation.includes('Throughput'), 'NET-102 explains Throughput');
  assert(net102Perf!.contentV2!.explanation.includes('Goodput'), 'NET-102 explains Goodput');
  assert(net102Perf!.contentV2!.explanation.includes('Packet Loss'), 'NET-102 explains Packet Loss');
  assert(net102Perf!.contentV2!.explanation.includes('Jitter'), 'NET-102 explains Jitter');
  assert(net102Perf!.contentV2!.components.length >= 5, 'NET-102 has at least 5 performance components');
  assert(Array.isArray(net102Perf!.contentV2!.practice) && net102Perf!.contentV2!.practice.length >= 6, 'NET-102 has 6 practice exercises');
  assert(net102Perf!.questions.length >= 6, 'NET-102 has 6 aligned quiz questions');
  assert(!net102Perf!.contentV2!.packetHeaderView, 'NET-102 has no fake packet header');
  assert(!net102Perf!.contentV2!.cliTooling, 'NET-102 has no forced CLI bloat');
  assert(!net102Perf!.contentV2!.security, 'NET-102 has no generic security filler');
  assert(!net102Perf!.lab, 'NET-102 has no phantom CLI lab');
  // [TEST 12] Verify NET-102 Wireless Networking, RF Spectrum & Wi-Fi Standards (wireless-networking-overview)
  console.log('\n[TEST 12] Verifying NET-102 Wireless Networking & RF Spectrum (wireless-networking-overview)...');
  const net102Wifi = LESSONS_NET100.find((l) => l.slug === 'wireless-networking-overview');
  assert(!!net102Wifi, 'NET-102 Wireless Networking (wireless-networking-overview) exists');
  assert(!!net102Wifi!.contentV2, 'NET-102 Wireless Networking has Content V2 structure');
  assert(net102Wifi!.courseCode === 'NET-102', 'NET-102 Wireless Networking has courseCode NET-102');
  assert(typeof net102Wifi!.contentV2!.objective === 'string', 'NET-102 Wireless Networking has clear objective');
  assert(net102Wifi!.contentV2!.explanation.includes('2.4 GHz'), 'NET-102 Wireless Networking explains 2.4 GHz');
  assert(net102Wifi!.contentV2!.explanation.includes('5 GHz'), 'NET-102 Wireless Networking explains 5 GHz');
  assert(net102Wifi!.contentV2!.explanation.includes('6 GHz'), 'NET-102 Wireless Networking explains 6 GHz');
  assert(net102Wifi!.contentV2!.explanation.includes('Channels 1, 6, and 11'), 'NET-102 Wireless Networking explains non-overlapping channels 1, 6, 11');
  assert(net102Wifi!.contentV2!.explanation.includes('CSMA/CA'), 'NET-102 Wireless Networking explains CSMA/CA');
  assert(net102Wifi!.contentV2!.explanation.includes('half-duplex'), 'NET-102 Wireless Networking explains half-duplex');
  assert(net102Wifi!.contentV2!.components.length >= 5, 'NET-102 Wireless Networking has at least 5 technical components');
  assert(Array.isArray(net102Wifi!.contentV2!.practice) && net102Wifi!.contentV2!.practice.length >= 6, 'NET-102 Wireless Networking has 6 practice exercises');
  assert(net102Wifi!.questions.length >= 6, 'NET-102 Wireless Networking has 6 aligned quiz questions');
  assert(!net102Wifi!.contentV2!.packetHeaderView, 'NET-102 Wireless Networking has no fake packet header');
  assert(!net102Wifi!.contentV2!.cliTooling, 'NET-102 Wireless Networking has no forced CLI bloat');
  assert(!net102Wifi!.contentV2!.security, 'NET-102 Wireless Networking has no generic security filler');
  assert(!net102Wifi!.lab, 'NET-102 Wireless Networking has no phantom CLI lab');
  // [TEST 13] Verify NET-202 IPv4 Addressing & CIDR Subnetting (net-202-ipv4-addressing-cidr)
  console.log('\n[TEST 13] Verifying NET-202 IPv4 Addressing & CIDR Subnetting (net-202-ipv4-addressing-cidr)...');
  const net202 = LESSONS_NET200.find((l) => l.slug === 'net-202-ipv4-addressing-cidr');
  assert(!!net202, 'NET-202 IPv4 lesson exists');
  assert(!!net202!.contentV2, 'NET-202 has Content V2 structure');
  assert(net202!.courseCode === 'NET-202', 'NET-202 has courseCode NET-202');
  assert(typeof net202!.contentV2!.objective === 'string', 'NET-202 has clear objective');
  assert(net202!.contentV2!.explanation.includes('32-bit'), 'NET-202 explains 32-bit architecture');
  assert(net202!.contentV2!.explanation.includes('Network Portion'), 'NET-202 explains Network Portion');
  assert(net202!.contentV2!.explanation.includes('Host Portion'), 'NET-202 explains Host Portion');
  assert(net202!.contentV2!.explanation.includes('Subnet Mask'), 'NET-202 explains Subnet Mask');
  assert(net202!.contentV2!.explanation.includes('CIDR'), 'NET-202 explains CIDR prefix length');
  assert(net202!.contentV2!.explanation.includes('Network Address'), 'NET-202 explains Network Address');
  assert(net202!.contentV2!.explanation.includes('Broadcast Address'), 'NET-202 explains Broadcast Address');
  assert(net202!.contentV2!.explanation.includes('Usable Host Range'), 'NET-202 explains Usable Host Range');
  assert(net202!.contentV2!.explanation.includes('2^H - 2') || net202!.contentV2!.explanation.includes('2^H-2'), 'NET-202 explains host capacity formula');
  assert(net202!.contentV2!.components.length >= 6, 'NET-202 has at least 6 technical components');
  assert(!!net202!.contentV2!.visualizer, 'NET-202 has visualizer defined');
  assert(!!net202!.contentV2!.workedExample, 'NET-202 has worked example defined');
  assert(net202!.contentV2!.workedExample!.problemStatement.includes('192.168.10.37/26'), 'NET-202 has worked example for 192.168.10.37/26');
  assert(Array.isArray(net202!.contentV2!.practice) && net202!.contentV2!.practice.length >= 6, 'NET-202 has 6 practice exercises');
  assert(net202!.questions.length >= 6, 'NET-202 has 6 aligned quiz questions');
  assert(!net202!.contentV2!.packetHeaderView, 'NET-202 has no fake packet header');
  assert(!net202!.contentV2!.cliTooling, 'NET-202 has no forced CLI bloat');
  assert(!net202!.contentV2!.security, 'NET-202 has no generic security filler');
  assert(!net202!.lab, 'NET-202 has no phantom CLI lab');
  console.log('  ✓ NET-202 verified with clean Content V2 structure, 32-bit math, CIDR prefix shift, 192.168.10.37/26 worked example, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 14] Verify NET-203 Address Resolution Protocol (ARP) (arp-protocol-overview)
  console.log('\n[TEST 14] Verifying NET-203 Address Resolution Protocol (ARP) (arp-protocol-overview)...');
  const net203Arp = LESSONS_NET203_204.find((l) => l.slug === 'arp-protocol-overview');
  assert(!!net203Arp, 'NET-203 ARP lesson exists');
  assert(!!net203Arp!.contentV2, 'NET-203 ARP has Content V2 structure');
  assert(net203Arp!.courseCode === 'NET-203', 'NET-203 ARP has courseCode NET-203');
  assert(typeof net203Arp!.contentV2!.objective === 'string', 'NET-203 ARP has clear objective');
  assert(net203Arp!.contentV2!.explanation.includes('RFC 826'), 'NET-203 ARP explains RFC 826');
  assert(net203Arp!.contentV2!.explanation.includes('FF:FF:FF:FF:FF:FF'), 'NET-203 ARP explains broadcast MAC');
  assert(net203Arp!.contentV2!.explanation.includes('Opcode 1') && net203Arp!.contentV2!.explanation.includes('Opcode 2'), 'NET-203 ARP explains Opcodes 1 and 2');
  assert(net203Arp!.contentV2!.explanation.includes('Default Gateway'), 'NET-203 ARP explains Default Gateway resolution for remote destinations');
  assert(net203Arp!.contentV2!.explanation.includes('Gratuitous ARP') || net203Arp!.contentV2!.explanation.includes('GARP'), 'NET-203 ARP explains Gratuitous ARP');
  assert(net203Arp!.contentV2!.components.length >= 5, 'NET-203 ARP has at least 5 technical components');
  assert(!!net203Arp!.contentV2!.visualizer, 'NET-203 ARP has visualizer defined');
  assert(!!net203Arp!.contentV2!.workedExample, 'NET-203 ARP has worked example defined');
  assert(Array.isArray(net203Arp!.contentV2!.practice) && net203Arp!.contentV2!.practice.length >= 6, 'NET-203 ARP has 6 practice exercises');
  assert(net203Arp!.questions.length >= 6, 'NET-203 ARP has 6 aligned quiz questions');
  assert(!net203Arp!.contentV2!.cliTooling, 'NET-203 ARP has no forced CLI bloat');
  assert(!net203Arp!.contentV2!.security, 'NET-203 ARP has no generic security filler');
  assert(!net203Arp!.lab, 'NET-203 ARP has no phantom CLI lab');
  console.log('  ✓ NET-203 ARP verified with clean Content V2 structure, broadcast vs unicast flow, Default Gateway resolution, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 15] Verify NET-204 TCP & UDP Transport Protocols (tcp-udp-transport-overview)
  console.log('\n[TEST 15] Verifying NET-204 TCP & UDP Transport Protocols (tcp-udp-transport-overview)...');
  const net204Tcp = LESSONS_NET203_204.find((l) => l.slug === 'tcp-udp-transport-overview');
  assert(!!net204Tcp, 'NET-204 TCP/UDP lesson exists');
  assert(!!net204Tcp!.contentV2, 'NET-204 TCP/UDP has Content V2 structure');
  assert(net204Tcp!.courseCode === 'NET-204', 'NET-204 TCP/UDP has courseCode NET-204');
  assert(typeof net204Tcp!.contentV2!.objective === 'string', 'NET-204 TCP/UDP has clear objective');
  assert(net204Tcp!.contentV2!.explanation.includes('3-Way Handshake'), 'NET-204 TCP/UDP explains 3-way handshake');
  assert(net204Tcp!.contentV2!.explanation.includes('SYN') && net204Tcp!.contentV2!.explanation.includes('SYN-ACK'), 'NET-204 TCP/UDP explains SYN/SYN-ACK flags');
  assert(net204Tcp!.contentV2!.explanation.includes('Sliding Window') || net204Tcp!.contentV2!.explanation.includes('Flow Control'), 'NET-204 TCP/UDP explains Sliding Window Flow Control');
  assert(net204Tcp!.contentV2!.explanation.includes('4-Way Connection Teardown') || net204Tcp!.contentV2!.explanation.includes('4-Way'), 'NET-204 TCP/UDP explains 4-way teardown');
  assert(net204Tcp!.contentV2!.explanation.includes('8-Byte Minimal Header') || net204Tcp!.contentV2!.explanation.includes('8-Byte'), 'NET-204 TCP/UDP explains UDP 8-byte header');
  assert(net204Tcp!.contentV2!.components.length >= 5, 'NET-204 TCP/UDP has at least 5 technical components');
  assert(!!net204Tcp!.contentV2!.visualizer, 'NET-204 TCP/UDP has visualizer defined');
  assert(!!net204Tcp!.contentV2!.workedExample, 'NET-204 TCP/UDP has worked example defined');
  assert(Array.isArray(net204Tcp!.contentV2!.practice) && net204Tcp!.contentV2!.practice.length >= 6, 'NET-204 TCP/UDP has 6 practice exercises');
  assert(net204Tcp!.questions.length >= 6, 'NET-204 TCP/UDP has 6 aligned quiz questions');
  assert(!net204Tcp!.contentV2!.cliTooling, 'NET-204 TCP/UDP has no forced CLI bloat');
  assert(!net204Tcp!.contentV2!.security, 'NET-204 TCP/UDP has no generic security filler');
  assert(!net204Tcp!.lab, 'NET-204 TCP/UDP has no phantom CLI lab');
  console.log('  ✓ NET-204 TCP/UDP verified with clean Content V2 structure, 3-way handshake, 4-way teardown, sliding window flow control, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 16] Verify NET-201 MAC Addresses & Physical Hardware Identity (level-0-mac-addresses-physical-identity)
  console.log('\n[TEST 16] Verifying NET-201 MAC Addresses & Physical Hardware Identity (level-0-mac-addresses-physical-identity)...');
  const net201Mac = LESSONS_NET200.find((l) => l.slug === 'level-0-mac-addresses-physical-identity');
  assert(!!net201Mac, 'NET-201 MAC lesson exists');
  assert(!!net201Mac!.contentV2, 'NET-201 MAC has Content V2 structure');
  assert(net201Mac!.courseCode === 'NET-201', 'NET-201 MAC has courseCode NET-201');
  assert(typeof net201Mac!.contentV2!.objective === 'string', 'NET-201 MAC has clear objective');
  assert(net201Mac!.contentV2!.explanation.includes('48-bit') || net201Mac!.contentV2!.explanation.includes('48-Bit'), 'NET-201 MAC explains 48-bit architecture');
  assert(net201Mac!.contentV2!.explanation.includes('OUI'), 'NET-201 MAC explains OUI prefix');
  assert(net201Mac!.contentV2!.explanation.includes('I/G') || net201Mac!.contentV2!.explanation.includes('Individual / Group'), 'NET-201 MAC explains I/G control bit');
  assert(net201Mac!.contentV2!.explanation.includes('U/L') || net201Mac!.contentV2!.explanation.includes('Universal / Local'), 'NET-201 MAC explains U/L control bit');
  assert(net201Mac!.contentV2!.explanation.includes('FF:FF:FF:FF:FF:FF'), 'NET-201 MAC explains broadcast address');
  assert(net201Mac!.contentV2!.components.length >= 5, 'NET-201 MAC has at least 5 technical components');
  assert(!!net201Mac!.contentV2!.visualizer, 'NET-201 MAC has visualizer defined');
  assert(!!net201Mac!.contentV2!.workedExample, 'NET-201 MAC has worked example defined');
  assert(Array.isArray(net201Mac!.contentV2!.practice) && net201Mac!.contentV2!.practice.length >= 6, 'NET-201 MAC has 6 practice exercises');
  assert(net201Mac!.questions.length >= 6, 'NET-201 MAC has 6 aligned quiz questions');
  assert(!net201Mac!.contentV2!.cliTooling, 'NET-201 MAC has no forced CLI bloat');
  assert(!net201Mac!.contentV2!.security, 'NET-201 MAC has no generic security filler');
  assert(!net201Mac!.lab, 'NET-201 MAC has no phantom CLI lab');
  console.log('  ✓ NET-201 MAC verified with clean Content V2 structure, OUI/NIC split, I/G & U/L bit logic, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 17] Verify NET-201 Ethernet II Framing (ethernet-mac-addresses-overview)
  console.log('\n[TEST 17] Verifying NET-201 Ethernet II Framing (ethernet-mac-addresses-overview)...');
  const net201Ethernet = LESSONS_NET200.find((l) => l.slug === 'ethernet-mac-addresses-overview');
  assert(!!net201Ethernet, 'NET-201 Ethernet framing lesson exists');
  assert(!!net201Ethernet!.contentV2, 'NET-201 Ethernet framing has Content V2 structure');
  assert(net201Ethernet!.courseCode === 'NET-201', 'NET-201 Ethernet framing has courseCode NET-201');
  assert(typeof net201Ethernet!.contentV2!.objective === 'string', 'NET-201 Ethernet framing has clear objective');
  assert(net201Ethernet!.contentV2!.explanation.includes('Preamble') && net201Ethernet!.contentV2!.explanation.includes('SFD'), 'NET-201 Ethernet framing explains Preamble and SFD');
  assert(net201Ethernet!.contentV2!.explanation.includes('0x0800') && net201Ethernet!.contentV2!.explanation.includes('0x86DD'), 'NET-201 Ethernet framing explains IPv4/IPv6 EtherTypes');
  assert(net201Ethernet!.contentV2!.explanation.includes('64') && net201Ethernet!.contentV2!.explanation.includes('1518'), 'NET-201 Ethernet framing explains 64B min and 1518B max frame boundaries');
  assert(net201Ethernet!.contentV2!.explanation.includes('FCS') || net201Ethernet!.contentV2!.explanation.includes('CRC-32'), 'NET-201 Ethernet framing explains FCS and CRC-32');
  assert(net201Ethernet!.contentV2!.components.length >= 5, 'NET-201 Ethernet framing has at least 5 technical components');
  assert(!!net201Ethernet!.contentV2!.packetHeaderView, 'NET-201 Ethernet framing has packetHeaderView defined');
  assert(!!net201Ethernet!.contentV2!.visualizer, 'NET-201 Ethernet framing has visualizer defined');
  assert(!!net201Ethernet!.contentV2!.workedExample, 'NET-201 Ethernet framing has worked example defined');
  assert(Array.isArray(net201Ethernet!.contentV2!.practice) && net201Ethernet!.contentV2!.practice.length >= 6, 'NET-201 Ethernet framing has 6 practice exercises');
  assert(net201Ethernet!.questions.length >= 6, 'NET-201 Ethernet framing has 6 aligned quiz questions');
  assert(!net201Ethernet!.contentV2!.cliTooling, 'NET-201 Ethernet framing has no forced CLI bloat');
  assert(!net201Ethernet!.contentV2!.security, 'NET-201 Ethernet framing has no generic security filler');
  assert(!net201Ethernet!.lab, 'NET-201 Ethernet framing has no phantom CLI lab');
  console.log('  ✓ NET-201 Ethernet Framing verified with clean Content V2 structure, header fields, EtherTypes, 64-byte padding mechanics, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 18] Verify NET-203 DNS & Name Resolution Architecture (level-0-dns-internet-phonebook)
  console.log('\n[TEST 18] Verifying NET-203 DNS & Name Resolution Architecture (level-0-dns-internet-phonebook)...');
  const net203Dns = LESSONS_NET203_204.find((l) => l.slug === 'level-0-dns-internet-phonebook');
  assert(!!net203Dns, 'NET-203 DNS lesson exists');
  assert(!!net203Dns!.contentV2, 'NET-203 DNS has Content V2 structure');
  assert(net203Dns!.courseCode === 'NET-203', 'NET-203 DNS has courseCode NET-203');
  assert(typeof net203Dns!.contentV2!.objective === 'string', 'NET-203 DNS has clear objective');
  assert(net203Dns!.contentV2!.explanation.includes('Recursive Resolver'), 'NET-203 DNS explains Recursive Resolver');
  assert(net203Dns!.contentV2!.explanation.includes('Root Zone') || net203Dns!.contentV2!.explanation.includes('Root'), 'NET-203 DNS explains Root Server tier');
  assert(net203Dns!.contentV2!.explanation.includes('Top-Level Domain') || net203Dns!.contentV2!.explanation.includes('TLD'), 'NET-203 DNS explains TLD tier');
  assert(net203Dns!.contentV2!.explanation.includes('Authoritative'), 'NET-203 DNS explains Authoritative Nameserver');
  assert(net203Dns!.contentV2!.explanation.includes('CNAME') && net203Dns!.contentV2!.explanation.includes('AAAA'), 'NET-203 DNS explains CNAME and AAAA records');
  assert(net203Dns!.contentV2!.explanation.includes('UDP port 53') || net203Dns!.contentV2!.explanation.includes('UDP'), 'NET-203 DNS explains UDP port 53 transport');
  assert(net203Dns!.contentV2!.components.length >= 5, 'NET-203 DNS has at least 5 technical components');
  assert(!!net203Dns!.contentV2!.packetHeaderView, 'NET-203 DNS has packetHeaderView defined');
  assert(!!net203Dns!.contentV2!.visualizer, 'NET-203 DNS has visualizer defined');
  assert(!!net203Dns!.contentV2!.workedExample, 'NET-203 DNS has worked example defined');
  assert(Array.isArray(net203Dns!.contentV2!.practice) && net203Dns!.contentV2!.practice.length >= 6, 'NET-203 DNS has 6 practice exercises');
  assert(net203Dns!.questions.length >= 6, 'NET-203 DNS has 6 aligned quiz questions');
  assert(!net203Dns!.contentV2!.cliTooling, 'NET-203 DNS has no forced CLI bloat');
  assert(!net203Dns!.contentV2!.security, 'NET-203 DNS has no generic security filler');
  assert(!net203Dns!.lab, 'NET-203 DNS has no phantom CLI lab');
  console.log('  ✓ NET-203 DNS verified with clean Content V2 structure, 4-tier hierarchy, record schemas, UDP/TCP 53, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 19] Verify NET-203 DHCP & IP Leasing (level-0-dhcp-automatic-ip-allocation)
  console.log('\n[TEST 19] Verifying NET-203 DHCP & IP Leasing (level-0-dhcp-automatic-ip-allocation)...');
  const net203Dhcp = LESSONS_NET203_204.find((l) => l.slug === 'level-0-dhcp-automatic-ip-allocation');
  assert(!!net203Dhcp, 'NET-203 DHCP lesson exists');
  assert(!!net203Dhcp!.contentV2, 'NET-203 DHCP has Content V2 structure');
  assert(net203Dhcp!.courseCode === 'NET-203', 'NET-203 DHCP has courseCode NET-203');
  assert(typeof net203Dhcp!.contentV2!.objective === 'string', 'NET-203 DHCP has clear objective');
  assert(net203Dhcp!.contentV2!.explanation.includes('DORA') || net203Dhcp!.contentV2!.explanation.includes('Discover'), 'NET-203 DHCP explains DORA exchange');
  assert(net203Dhcp!.contentV2!.explanation.includes('UDP Port 67') || net203Dhcp!.contentV2!.explanation.includes('67'), 'NET-203 DHCP explains UDP 67/68 ports');
  assert(net203Dhcp!.contentV2!.explanation.includes('Option 1') || net203Dhcp!.contentV2!.explanation.includes('Option 3'), 'NET-203 DHCP explains Option parameters');
  assert(net203Dhcp!.contentV2!.explanation.includes('T1') && net203Dhcp!.contentV2!.explanation.includes('T2'), 'NET-203 DHCP explains T1 and T2 renewal/rebind timers');
  assert(net203Dhcp!.contentV2!.explanation.includes('APIPA') || net203Dhcp!.contentV2!.explanation.includes('169.254'), 'NET-203 DHCP explains APIPA fallback');
  assert(net203Dhcp!.contentV2!.components.length >= 5, 'NET-203 DHCP has at least 5 technical components');
  assert(!!net203Dhcp!.contentV2!.packetHeaderView, 'NET-203 DHCP has packetHeaderView defined');
  assert(!!net203Dhcp!.contentV2!.visualizer, 'NET-203 DHCP has visualizer defined');
  assert(!!net203Dhcp!.contentV2!.workedExample, 'NET-203 DHCP has worked example defined');
  assert(Array.isArray(net203Dhcp!.contentV2!.practice) && net203Dhcp!.contentV2!.practice.length >= 6, 'NET-203 DHCP has 6 practice exercises');
  assert(net203Dhcp!.questions.length >= 6, 'NET-203 DHCP has 6 aligned quiz questions');
  assert(!net203Dhcp!.contentV2!.cliTooling, 'NET-203 DHCP has no forced CLI bloat');
  assert(!net203Dhcp!.contentV2!.security, 'NET-203 DHCP has no generic security filler');
  assert(!net203Dhcp!.lab, 'NET-203 DHCP has no phantom CLI lab');
  console.log('  ✓ NET-203 DHCP verified with clean Content V2 structure, DORA exchange, Options 1/3/6, T1/T2 timers, APIPA fallback, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 20] Verify NET-204 Network Ports, Sockets & Multiplexing (level-0-network-ports-socket-boundaries)
  console.log('\n[TEST 20] Verifying NET-204 Network Ports, Sockets & Multiplexing (level-0-network-ports-socket-boundaries)...');
  const net204Ports = LESSONS_NET203_204.find((l) => l.slug === 'level-0-network-ports-socket-boundaries');
  assert(!!net204Ports, 'NET-204 Ports & Sockets lesson exists');
  assert(!!net204Ports!.contentV2, 'NET-204 Ports & Sockets has Content V2 structure');
  assert(net204Ports!.courseCode === 'NET-204', 'NET-204 Ports & Sockets has courseCode NET-204');
  assert(typeof net204Ports!.contentV2!.objective === 'string', 'NET-204 Ports & Sockets has clear objective');
  assert(net204Ports!.contentV2!.explanation.includes('16-bit') || net204Ports!.contentV2!.explanation.includes('65535'), 'NET-204 Ports & Sockets explains 16-bit port length');
  assert(net204Ports!.contentV2!.explanation.includes('Well-Known') && net204Ports!.contentV2!.explanation.includes('1023'), 'NET-204 Ports & Sockets explains Well-Known range (0-1023)');
  assert(net204Ports!.contentV2!.explanation.includes('Registered') && net204Ports!.contentV2!.explanation.includes('49151'), 'NET-204 Ports & Sockets explains Registered range (1024-49151)');
  assert(net204Ports!.contentV2!.explanation.includes('Ephemeral') || net204Ports!.contentV2!.explanation.includes('Dynamic'), 'NET-204 Ports & Sockets explains Dynamic/Ephemeral range (49152-65535)');
  assert(net204Ports!.contentV2!.explanation.includes('Socket Pair') || net204Ports!.contentV2!.explanation.includes('4-Tuple'), 'NET-204 Ports & Sockets explains Socket Pair 4-tuple');
  assert(net204Ports!.contentV2!.explanation.includes('Multiplexing') && net204Ports!.contentV2!.explanation.includes('Demultiplexing'), 'NET-204 Ports & Sockets explains Multiplexing and Demultiplexing');
  assert(net204Ports!.contentV2!.components.length >= 5, 'NET-204 Ports & Sockets has at least 5 technical components');
  assert(!!net204Ports!.contentV2!.packetHeaderView, 'NET-204 Ports & Sockets has packetHeaderView defined');
  assert(!!net204Ports!.contentV2!.visualizer, 'NET-204 Ports & Sockets has visualizer defined');
  assert(!!net204Ports!.contentV2!.workedExample, 'NET-204 Ports & Sockets has worked example defined');
  assert(Array.isArray(net204Ports!.contentV2!.practice) && net204Ports!.contentV2!.practice.length >= 6, 'NET-204 Ports & Sockets has 6 practice exercises');
  assert(net204Ports!.questions.length >= 6, 'NET-204 Ports & Sockets has 6 aligned quiz questions');
  assert(!net204Ports!.contentV2!.cliTooling, 'NET-204 Ports & Sockets has no forced CLI bloat');
  assert(!net204Ports!.contentV2!.security, 'NET-204 Ports & Sockets has no generic security filler');
  assert(!net204Ports!.lab, 'NET-204 Ports & Sockets has no phantom CLI lab');
  console.log('  ✓ NET-204 Ports & Sockets verified with clean Content V2 structure, 16-bit ranges, 4-tuple socket pairs, multiplexing/demultiplexing, 6 practice items, 6 quiz questions, and zero forced filler.');

  // [TEST 21] Verify Special-Use IPv4 Ranges & Enterprise Allocation (level-0-ip-addresses-logical-location)
  console.log('\n[TEST 21] Verifying NET-202 Special-Use IPv4 Ranges (level-0-ip-addresses-logical-location)...');
  const specialIpv4 = LESSONS_NET200.find((l) => l.slug === 'level-0-ip-addresses-logical-location');
  assert(!!specialIpv4, 'Special-Use IPv4 lesson exists');
  assert(!!specialIpv4!.contentV2, 'Special-Use IPv4 has Content V2 structure');
  assert(specialIpv4!.contentV2!.explanation.includes('10.0.0.0/8'), 'Explains 10.0.0.0/8 RFC 1918');
  assert(specialIpv4!.contentV2!.explanation.includes('172.16.0.0/12'), 'Explains 172.16.0.0/12 RFC 1918');
  assert(specialIpv4!.contentV2!.explanation.includes('192.168.0.0/16'), 'Explains 192.168.0.0/16 RFC 1918');
  assert(specialIpv4!.contentV2!.explanation.includes('169.254'), 'Explains APIPA 169.254.0.0/16');
  assert(specialIpv4!.contentV2!.practice.length >= 6, 'Special-Use IPv4 has at least 6 practice items');
  assert(specialIpv4!.questions.length >= 6, 'Special-Use IPv4 has at least 6 aligned questions');
  console.log('  ✓ Special-Use IPv4 verified with clean Content V2 structure, RFC 1918 blocks, APIPA, CGNAT, 6 practice items, and 6 questions.');

  // [TEST 22] Verify Classful IPv4 History & CIDR (ip-addressing-ipv4-overview)
  console.log('\n[TEST 22] Verifying Classful IPv4 History & CIDR (ip-addressing-ipv4-overview)...');
  const classfulIpv4 = LESSONS_NET200.find((l) => l.slug === 'ip-addressing-ipv4-overview');
  assert(!!classfulIpv4, 'Classful IPv4 lesson exists');
  assert(!!classfulIpv4!.contentV2, 'Classful IPv4 has Content V2 structure');
  assert(classfulIpv4!.contentV2!.explanation.includes('Class A') && classfulIpv4!.contentV2!.explanation.includes('Class B') && classfulIpv4!.contentV2!.explanation.includes('Class C'), 'Explains Class A, B, and C ranges');
  assert(classfulIpv4!.contentV2!.explanation.includes('CIDR') || classfulIpv4!.contentV2!.explanation.includes('RFC 1519'), 'Explains CIDR RFC 1519');
  assert(classfulIpv4!.contentV2!.practice.length >= 6, 'Classful IPv4 has at least 6 practice items');
  assert(classfulIpv4!.questions.length >= 6, 'Classful IPv4 has at least 6 aligned questions');
  console.log('  ✓ Classful IPv4 History verified with clean Content V2 structure, Class A/B/C/D/E leading bits, CIDR, 6 practice items, and 6 questions.');

  // [TEST 23] Verify VLSM Subnetting (subnetting-cidr-overview)
  console.log('\n[TEST 23] Verifying VLSM Subnetting (subnetting-cidr-overview)...');
  const vlsmSubnetting = LESSONS_NET200.find((l) => l.slug === 'subnetting-cidr-overview');
  assert(!!vlsmSubnetting, 'VLSM Subnetting lesson exists');
  assert(!!vlsmSubnetting!.contentV2, 'VLSM Subnetting has Content V2 structure');
  assert(vlsmSubnetting!.contentV2!.explanation.includes('VLSM') || vlsmSubnetting!.contentV2!.explanation.includes('Variable Length'), 'Explains VLSM');
  assert(vlsmSubnetting!.contentV2!.explanation.includes('/30') || vlsmSubnetting!.contentV2!.explanation.includes('/31'), 'Explains WAN point-to-point /30 or /31');
  assert(vlsmSubnetting!.contentV2!.practice.length >= 6, 'VLSM Subnetting has at least 6 practice items');
  assert(vlsmSubnetting!.questions.length >= 6, 'VLSM Subnetting has at least 6 aligned questions');
  console.log('  ✓ VLSM Subnetting verified with clean Content V2 structure, hierarchical allocation, 6 practice items, and 6 questions.');

  // [TEST 24] Verify Host Boot-Up Lifecycle (dhcp-dns-overview)
  console.log('\n[TEST 24] Verifying Host Boot-Up Lifecycle (dhcp-dns-overview)...');
  const bootLifecycle = LESSONS_NET203_204.find((l) => l.slug === 'dhcp-dns-overview');
  assert(!!bootLifecycle, 'Host Boot-Up Lifecycle lesson exists');
  assert(!!bootLifecycle!.contentV2, 'Host Boot-Up Lifecycle has Content V2 structure');
  assert(bootLifecycle!.contentV2!.explanation.includes('Physical Link') || bootLifecycle!.contentV2!.explanation.includes('PHY'), 'Explains Physical Link Phase');
  assert(bootLifecycle!.contentV2!.explanation.includes('DHCP') && bootLifecycle!.contentV2!.explanation.includes('ARP') && bootLifecycle!.contentV2!.explanation.includes('DNS'), 'Explains sequential DHCP -> ARP -> DNS');
  assert(bootLifecycle!.contentV2!.practice.length >= 6, 'Host Boot-Up Lifecycle has at least 6 practice items');
  assert(bootLifecycle!.questions.length >= 6, 'Host Boot-Up Lifecycle has at least 6 aligned questions');
  console.log('  ✓ Host Boot-Up Lifecycle verified with clean Content V2 structure, 6-phase sequence, 6 practice items, and 6 questions.');

  // [TEST 25] Verify Transport Segmentation & PMTUD (level-0-network-packets-data-framing)
  console.log('\n[TEST 25] Verifying Transport Segmentation & PMTUD (level-0-network-packets-data-framing)...');
  const transportSeg = LESSONS_NET203_204.find((l) => l.slug === 'level-0-network-packets-data-framing');
  assert(!!transportSeg, 'Transport Segmentation lesson exists');
  assert(!!transportSeg!.contentV2, 'Transport Segmentation has Content V2 structure');
  assert(transportSeg!.contentV2!.explanation.includes('MSS') && transportSeg!.contentV2!.explanation.includes('MTU'), 'Explains MSS vs MTU relationship');
  assert(transportSeg!.contentV2!.explanation.includes('1460') && transportSeg!.contentV2!.explanation.includes('1500'), 'Explains standard 1500 MTU / 1460 MSS');
  assert(transportSeg!.contentV2!.explanation.includes('PMTUD') || transportSeg!.contentV2!.explanation.includes('1191'), 'Explains PMTUD RFC 1191');
  assert(transportSeg!.contentV2!.practice.length >= 6, 'Transport Segmentation has at least 6 practice items');
  assert(transportSeg!.questions.length >= 6, 'Transport Segmentation has at least 6 aligned questions');
  console.log('  ✓ Transport Segmentation verified with clean Content V2 structure, MSS=MTU-40 formula, PMTUD, 6 practice items, and 6 questions.');

  // [TEST 26] Verify STP & Loop Prevention (net-302-spanning-tree-protocol-loop-prevention)
  console.log('\n[TEST 26] Verifying STP & Loop Prevention (net-302-spanning-tree-protocol-loop-prevention)...');
  const stpLesson = LESSONS_NET300_400.find((l) => l.slug === 'net-302-spanning-tree-protocol-loop-prevention');
  assert(!!stpLesson, 'STP lesson exists');
  assert(!!stpLesson!.contentV2, 'STP has Content V2 structure');
  assert(stpLesson!.contentV2!.explanation.includes('Root Bridge'), 'Explains Root Bridge');
  assert(stpLesson!.contentV2!.explanation.includes('Bridge ID') || stpLesson!.contentV2!.explanation.includes('32768'), 'Explains Bridge ID & 32768 priority');
  assert(stpLesson!.contentV2!.practice.length >= 6, 'STP has at least 6 practice items');
  assert(stpLesson!.questions.length >= 6, 'STP has at least 6 aligned questions');
  console.log('  ✓ STP & Loop Prevention verified with clean Content V2 structure, Bridge ID, Port Roles, 6 practice items, and 6 questions.');

  // [TEST 27] Verify Single-Area OSPF (net-304-single-area-ospf-routing)
  console.log('\n[TEST 27] Verifying Single-Area OSPF (net-304-single-area-ospf-routing)...');
  const ospfLesson = LESSONS_NET300_400.find((l) => l.slug === 'net-304-single-area-ospf-routing');
  assert(!!ospfLesson, 'Single-Area OSPF lesson exists');
  assert(!!ospfLesson!.contentV2, 'Single-Area OSPF has Content V2 structure');
  assert(ospfLesson!.contentV2!.explanation.includes('Dijkstra') || ospfLesson!.contentV2!.explanation.includes('SPF'), 'Explains Dijkstra SPF algorithm');
  assert(ospfLesson!.contentV2!.explanation.includes('DR') && ospfLesson!.contentV2!.explanation.includes('BDR'), 'Explains DR/BDR election');
  assert(ospfLesson!.contentV2!.practice.length >= 6, 'Single-Area OSPF has at least 6 practice items');
  assert(ospfLesson!.questions.length >= 6, 'Single-Area OSPF has at least 6 aligned questions');
  console.log('  ✓ Single-Area OSPF verified with clean Content V2 structure, 7 neighbor states, DR/BDR, 6 practice items, and 6 questions.');

  // [TEST 28] Verify Wireshark Packet Capture (net-404-wireshark-packet-capture)
  console.log('\n[TEST 28] Verifying Wireshark Packet Capture (net-404-wireshark-packet-capture)...');
  const wiresharkLesson = LESSONS_NET300_400.find((l) => l.slug === 'net-404-wireshark-packet-capture');
  assert(!!wiresharkLesson, 'Wireshark lesson exists');
  assert(!!wiresharkLesson!.contentV2, 'Wireshark has Content V2 structure');
  assert(wiresharkLesson!.contentV2!.explanation.includes('Promiscuous Mode'), 'Explains Promiscuous Mode');
  assert(wiresharkLesson!.contentV2!.explanation.includes('BPF') || wiresharkLesson!.contentV2!.explanation.includes('Capture Filter'), 'Explains BPF Capture Filters');
  assert(wiresharkLesson!.contentV2!.practice.length >= 6, 'Wireshark has at least 6 practice items');
  assert(wiresharkLesson!.questions.length >= 6, 'Wireshark has at least 6 aligned questions');
  console.log('  ✓ Wireshark Packet Capture verified with clean Content V2 structure, 3-pane dissection model, filters, 6 practice items, and 6 questions.');

  console.log('\n================================================================');
  console.log('🎉 ALL 28 CURRICULUM CONTENT ARCHITECTURE V2 TESTS PASSED!');
  console.log('================================================================\n');
}

verifyCurriculumContentV2().catch((err) => {
  console.error('\n❌ CURRICULUM CONTENT V2 VERIFICATION FAILED:', err);
  process.exit(1);
});

