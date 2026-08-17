import { LESSONS_NET203_204 } from '../src/topics/lessons-net203-204';
import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[IPV6 CURRICULUM ASSERTION FAILED]: ${msg}`);
  }
}

// RFC 5952 Reference Compression Algorithm for validation
function compressIpv6(fullHexAddr: string): string {
  const parts = fullHexAddr.split(':').map((h) => {
    const trimmed = h.replace(/^0+/, '');
    return trimmed === '' ? '0' : trimmed;
  });

  let bestStart = -1;
  let bestLength = 0;
  let currentStart = -1;
  let currentLength = 0;

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '0') {
      if (currentStart === -1) {
        currentStart = i;
        currentLength = 1;
      } else {
        currentLength++;
      }
    } else {
      if (currentLength > bestLength) {
        bestStart = currentStart;
        bestLength = currentLength;
      }
      currentStart = -1;
      currentLength = 0;
    }
  }
  if (currentLength > bestLength) {
    bestStart = currentStart;
    bestLength = currentLength;
  }

  if (bestLength > 1) {
    const left = parts.slice(0, bestStart).join(':');
    const right = parts.slice(bestStart + bestLength).join(':');
    return `${left}::${right}`;
  }

  return parts.join(':');
}

async function verifyIpv6Curriculum() {
  console.log('================================================================');
  console.log('🧪 NET-203 IPV6 FOUNDATIONS & SLAAC CURRICULUM VERIFICATION');
  console.log('================================================================\n');

  // [TEST 1] Find and verify lesson structure
  console.log('[TEST 1] Verifying IPv6 Foundations Lesson Structure...');
  const ipv6Lesson = LESSONS_NET203_204.find((l) => l.slug === 'ipv6-foundations-overview');
  assert(!!ipv6Lesson, 'Lesson "ipv6-foundations-overview" exists in NET-203 curriculum');
  assert(ipv6Lesson!.courseCode === 'NET-203', 'Lesson belongs to course NET-203');
  assert(ipv6Lesson!.order === 5, 'Lesson is order 5 in NET-203 sequence');
  assert(ipv6Lesson!.visualizationType === 'IPV6_COMPRESSOR_ENGINE', 'Visualization type is IPV6_COMPRESSOR_ENGINE');
  console.log(`  ✓ Lesson "${ipv6Lesson!.title}" verified in NET-203.`);

  // [TEST 2] Verify IPv6-specific learning outcomes & domain concepts
  console.log('\n[TEST 2] Verifying IPv6 Core Learning Outcomes & Domain Concepts...');
  const content = (ipv6Lesson!.contentV2 || ipv6Lesson!.stepMetadata) as any;
  assert(!!content, 'Lesson contains content definition');
  const objective = content.objective || content.step1_objective;
  assert(!!objective, 'Objective defined');
  assert(objective.includes('128-bit') && objective.includes('SLAAC'), 'Objective covers 128-bit & SLAAC');
  const prerequisites = content.prerequisites || content.step2_prerequisites;
  assert(!!prerequisites && prerequisites.length > 0, 'Prerequisites defined');
  const whyItMatters = content.whyItMatters || content.step3_whyItMatters;
  assert(!!whyItMatters, 'Why It Matters defined');
  assert(whyItMatters.includes('exhausted') || whyItMatters.includes('IPv4'), 'Why It Matters explains IPv4 exhaustion');
  const coreConcept = content.explanation || content.step4_coreConcept;
  assert(!!coreConcept, 'Core Concept / Explanation defined');
  assert(coreConcept.includes('128 bits') && coreConcept.includes('RFC 5952'), 'Core concept includes 128-bit architecture & RFC 5952');
  assert(coreConcept.includes('SLAAC') && coreConcept.includes('DAD'), 'Core concept covers SLAAC and DAD');

  const components = content.components || content.step5_technicalAnatomy?.components;
  assert(!!components, 'Technical components defined');

  const compNames = components.map((c: any) => c.name);
  assert(compNames.some((n: string) => n.includes('128-Bit')), 'Anatomy includes 128-Bit Structure');
  assert(compNames.some((n: string) => n.includes('RFC 5952')), 'Anatomy includes RFC 5952 Compression Rules');
  assert(compNames.some((n: string) => n.includes('Global Unicast')), 'Anatomy includes Global Unicast Address');
  assert(compNames.some((n: string) => n.includes('Link-Local')), 'Anatomy includes Link-Local Address');
  assert(compNames.some((n: string) => n.includes('SLAAC')), 'Anatomy includes SLAAC');
  assert(compNames.some((n: string) => n.includes('Duplicate Address Detection') || n.includes('DAD')), 'Anatomy includes DAD');
  assert(compNames.some((n: string) => n.includes('Dual-Stack')), 'Anatomy includes Dual-Stack Coexistence');
  console.log('  ✓ IPv6 core concepts, scopes, SLAAC, DAD, and dual-stack verified.');

  // [TEST 3] Verify SLAAC Workflow Steps
  console.log('\n[TEST 3] Verifying SLAAC / NDP Process Steps...');
  const steps = content.howItWorks || content.step6_howItWorks?.steps;
  assert(Array.isArray(steps) && steps.length >= 4, 'How It Works includes SLAAC workflow steps');
  assert(steps.some((s: any) => s.title.includes('Router Solicitation') || s.action.includes('RS') || s.action.includes('Router Solicitation')), 'Workflow includes RS');
  assert(steps.some((s: any) => s.title.includes('Router Advertisement') || s.action.includes('RA') || s.action.includes('Router Advertisement')), 'Workflow includes RA');
  assert(steps.some((s: any) => s.title.includes('DAD') || s.action.includes('DAD') || s.action.includes('Duplicate Address Detection')), 'Workflow includes DAD');
  console.log('  ✓ SLAAC RS/RA/DAD exchange flow verified.');

  // [TEST 4] Verify Visualizer & Worked Example
  console.log('\n[TEST 4] Verifying Visualizer & Worked Example...');
  const visualizer = content.visualizer || content.step8_visualExplanation;
  assert(!!visualizer, 'Visual explanation exists');
  assert(visualizer.type === 'IPV6_COMPRESSOR_ENGINE', 'Visualizer is IPV6_COMPRESSOR_ENGINE');

  const workedEx = content.workedExample || content.step9_workedExample;
  assert(!!workedEx, 'Worked example exists');
  assert(workedEx.problemStatement.includes('2001:0db8:0000:0000:0000:0000:0000:0001'), 'Worked example compresses sample address');
  assert(workedEx.finalResult.includes('2001:db8::1'), 'Worked example produces canonical 2001:db8::1');
  console.log('  ✓ Interactive visualizer and RFC 5952 worked example verified.');

  // [TEST 5] Verify Assessment Questions across 4 Cognitive Levels
  console.log('\n[TEST 5] Verifying Assessment Question Bank & Cognitive Levels...');
  const questions = ipv6Lesson!.questions;
  assert(questions.length >= 4, `At least 4 questions defined (found: ${questions.length})`);

  const cognitiveLevels = questions.map((q) => q.cognitiveLevel);
  assert(cognitiveLevels.includes('RECALL' as any), 'Contains RECALL question');
  assert(cognitiveLevels.includes('UNDERSTANDING' as any), 'Contains UNDERSTANDING question');
  assert(cognitiveLevels.includes('APPLICATION' as any), 'Contains APPLICATION question');
  assert(cognitiveLevels.includes('TROUBLESHOOTING' as any), 'Contains TROUBLESHOOTING question');

  questions.forEach((q, idx) => {
    assert(q.options.length === 4, `Question ${idx + 1} has exactly 4 options`);
    assert(q.correctOption === 0, `Question ${idx + 1} has correct option mapped`);
    assert(!!q.explanation, `Question ${idx + 1} has explanation`);
    assert(Object.keys(q.explanationsJson).length >= 3, `Question ${idx + 1} has distractor explanations`);
  });
  console.log(`  ✓ ${questions.length} questions verified spanning Recall, Understanding, Application, and Troubleshooting.`);

  // [TEST 4] Verify Lab Topology & Tasks
  console.log('\n[TEST 4] Verifying Practical IPv6 SLAAC Lab Objectives...');
  const lab = ipv6Lesson!.lab;
  assert(!!lab, 'Lesson has associated lab');
  assert(lab!.tasks.length >= 4, `Lab contains at least 4 practical tasks (found: ${lab!.tasks.length})`);
  assert(!!lab!.initialTopologyJson, 'Lab has initialTopologyJson defined');
  console.log(`  ✓ Practical Lab "${lab!.title}" verified with ${lab!.tasks.length} tasks.`);

  // [TEST 5] RFC 5952 Canonical Zero Compression Rules Engine
  console.log('\n[TEST 5] Validating RFC 5952 Zero Compression Algorithm...');
  const testCases = [
    { input: '2001:0db8:0000:0000:0000:0000:0000:0001', expected: '2001:db8::1' },
    { input: 'fe80:0000:0000:0000:0200:00ff:fe00:0042', expected: 'fe80::200:ff:fe00:42' },
    { input: '0000:0000:0000:0000:0000:0000:0000:0001', expected: '::1' },
    { input: '2001:0db8:0000:0042:0000:0000:0000:0001', expected: '2001:db8:0:42::1' },
    { input: 'ff02:0000:0000:0000:0000:0000:0000:0002', expected: 'ff02::2' },
  ];

  for (const tc of testCases) {
    const result = compressIpv6(tc.input);
    assert(result === tc.expected, `Compression of "${tc.input}" yielded "${result}" (expected "${tc.expected}")`);
  }
  console.log('  ✓ All RFC 5952 zero compression test vectors matched canonical outputs.');

  console.log('\n================================================================');
  console.log('🎉 ALL 5 IPV6 FOUNDATIONS & SLAAC TESTS PASSED!');
  console.log('================================================================\n');
}

verifyIpv6Curriculum().catch((err) => {
  console.error('\n❌ IPV6 CURRICULUM VERIFICATION FAILED:', err);
  process.exit(1);
});
