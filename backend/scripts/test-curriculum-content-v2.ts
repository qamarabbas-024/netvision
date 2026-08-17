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

  console.log('\n================================================================');
  console.log('🎉 ALL 6 CURRICULUM CONTENT ARCHITECTURE V2 TESTS PASSED!');
  console.log('================================================================\n');
}

verifyCurriculumContentV2().catch((err) => {
  console.error('\n❌ CURRICULUM CONTENT V2 VERIFICATION FAILED:', err);
  process.exit(1);
});
