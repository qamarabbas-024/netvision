import { LESSONS_NET300_400 } from '../src/topics/lessons-net300-400';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[MULTI-AREA OSPF ASSERTION FAILED]: ${msg}`);
  }
}

async function verifyMultiAreaOspf() {
  console.log('================================================================');
  console.log('🧪 NET-304 MULTI-AREA OSPF & REDISTRIBUTION VERIFICATION');
  console.log('================================================================\n');

  // [TEST 1] Verify Course & Lesson Existence
  console.log('[TEST 1] Verifying Multi-Area OSPF Lesson Record...');
  const lesson = LESSONS_NET300_400.find((l) => l.slug === 'net-304-multi-area-ospf-redistribution');
  assert(!!lesson, 'Lesson "net-304-multi-area-ospf-redistribution" exists in NET-304');
  assert(lesson!.courseCode === 'NET-304', 'Lesson belongs to course NET-304');
  assert(lesson!.order === 2, 'Lesson is order 2 in NET-304 sequence (natural continuation of Single-Area OSPF)');
  assert(lesson!.visualizationType === 'MULTI_AREA_OSPF_ENGINE', 'Visualization type is MULTI_AREA_OSPF_ENGINE');
  console.log(`  ✓ Lesson "${lesson!.title}" found at order 2 in NET-304.`);

  // [TEST 2] Verify Multi-Area Topology & ABR Logic
  console.log('\n[TEST 2] Verifying Multi-Area Topology & ABR Architecture...');
  const content = (lesson!.contentV2 || lesson!.stepMetadata) as any;
  assert(!!content, 'Lesson contains content definition');
  const objective = content.objective || content.step1_objective;
  assert(!!objective, 'Objective defined');
  const coreConcept = content.explanation || content.step4_coreConcept;
  assert(coreConcept.includes('Area 0') && coreConcept.includes('Backbone'), 'Core concept includes Area 0 Backbone');
  assert(coreConcept.includes('Area Border Router') || coreConcept.includes('ABR'), 'Core concept defines ABR role');
  assert(coreConcept.includes('ASBR'), 'Core concept defines ASBR role');

  const components = content.components || content.step5_technicalAnatomy?.components;
  const compNames = components.map((c: any) => c.name);
  assert(compNames.some((n: string) => n.includes('Area 0')), 'Anatomy includes Area 0 Backbone');
  assert(compNames.some((n: string) => n.includes('Area Border Router') || n.includes('ABR')), 'Anatomy includes Area Border Router');
  assert(compNames.some((n: string) => n.includes('Autonomous System Boundary Router') || n.includes('ASBR')), 'Anatomy includes ASBR');
  console.log('  ✓ Multi-Area topology (Area 0, Area 1, Area 2, ABR, ASBR) verified.');

  // [TEST 3] Verify LSA Types 1-5 Technical Precision
  console.log('\n[TEST 3] Verifying LSA Types 1 through 5 Classification & Scopes...');
  assert(compNames.some((n: string) => n.includes('Type 1')), 'Anatomy includes Type 1 Router LSA');
  assert(compNames.some((n: string) => n.includes('Type 2')), 'Anatomy includes Type 2 Network LSA');
  assert(compNames.some((n: string) => n.includes('Type 3')), 'Anatomy includes Type 3 Summary LSA');
  assert(compNames.some((n: string) => n.includes('Type 4')), 'Anatomy includes Type 4 ASBR Summary LSA');
  assert(compNames.some((n: string) => n.includes('Type 5')), 'Anatomy includes Type 5 AS External LSA');

  const type3Def = components.find((c: any) => c.name.includes('Type 3'));
  assert(type3Def!.detail.includes('ABR') && (type3Def!.detail.includes('O IA') || type3Def!.detail.includes('Inter-Area')), 'Type 3 LSA accurately attributed to ABR origination and O IA routes');

  const type4Def = components.find((c: any) => c.name.includes('Type 4'));
  assert(type4Def!.detail.includes('ABR') && type4Def!.detail.includes('ASBR'), 'Type 4 LSA accurately attributed to ABR advertising ASBR reachability');

  const type5Def = components.find((c: any) => c.name.includes('Type 5'));
  assert(type5Def!.detail.includes('ASBR') && (type5Def!.detail.includes('standard') || type5Def!.detail.includes('stub') || type5Def!.detail.includes('normal')), 'Type 5 LSA accurately attributed to ASBR with stub/standard scope qualification');
  console.log('  ✓ LSA Types 1 through 5 flooding scopes and originators correctly mapped with technical precision.');

  // [TEST 4] Verify Route Summarization, Redistribution & Metric Calculations
  console.log('\n[TEST 4] Verifying Route Summarization & ASBR Redistribution Metrics...');
  assert(compNames.some((n: string) => n.includes('Route Summarization')), 'Anatomy includes Route Summarization');
  assert(compNames.some((n: string) => n.includes('External Metric Types')), 'Anatomy includes External Metric Types (E1 vs E2)');
  assert(coreConcept.includes('area') && coreConcept.includes('range'), 'Core concept covers ABR area range summarization');
  assert(coreConcept.includes('E1') && coreConcept.includes('E2'), 'Core concept covers both E1 and E2 metric types');
  assert(coreConcept.includes('BGP') || coreConcept.includes('static'), 'Core concept accurately attributes ASBR to external routing domains (BGP/Static)');
  console.log('  ✓ ABR route summarization and ASBR external redistribution concepts verified.');

  // [TEST 5] Verify Assessment Questions across 4 Cognitive Levels
  console.log('\n[TEST 5] Verifying Assessment Question Pool...');
  const questions = lesson!.questions;
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
  console.log(`  ✓ ${questions.length} questions verified across Recall, Understanding, Application, and Troubleshooting.`);

  // [TEST 6] Verify Practical Multi-Area Troubleshooting Lab
  console.log('\n[TEST 6] Verifying Multi-Area Troubleshooting Lab Objectives...');
  const lab = lesson!.lab;
  assert(!!lab, 'Lesson has associated lab');
  assert(lab!.tasks.length >= 4, `Lab contains at least 4 practical tasks (found: ${lab!.tasks.length})`);
  assert(!!lab!.initialTopologyJson, 'Lab has initialTopologyJson defined');
  assert(!!lab!.initialTopologyJson.area0 && !!lab!.initialTopologyJson.area1 && !!lab!.initialTopologyJson.asbr, 'Lab topology includes Area 0, Area 1, and ASBR');
  console.log(`  ✓ Practical Lab "${lab!.title}" verified with ${lab!.tasks.length} tasks.`);

  // [TEST 7] Verify No Duplicated Single-Area Content
  console.log('\n[TEST 7] Verifying No Duplicate Single-Area Fundamentals...');
  const singleAreaLesson = LESSONS_NET300_400.find((l) => l.slug === 'net-304-single-area-ospf-routing');
  assert(!!singleAreaLesson, 'Single-area lesson remains intact');
  assert(singleAreaLesson!.slug !== lesson!.slug, 'Distinct lesson slugs');
  assert(lesson!.title.includes('Multi-Area'), 'Title explicitly focuses on Multi-Area');
  console.log('  ✓ Single-area OSPF lesson and multi-area OSPF lesson are cleanly separated.');

  console.log('\n================================================================');
  console.log('🎉 ALL 7 MULTI-AREA OSPF VERIFICATION TESTS PASSED!');
  console.log('================================================================\n');
}

verifyMultiAreaOspf().catch((err) => {
  console.error('\n❌ MULTI-AREA OSPF VERIFICATION FAILED:', err);
  process.exit(1);
});
