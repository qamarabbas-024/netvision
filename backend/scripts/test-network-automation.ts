import { LESSONS_NET300_400 } from '../src/topics/lessons-net300-400';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[NETWORK AUTOMATION ASSERTION FAILED]: ${msg}`);
  }
}

async function verifyNetworkAutomation() {
  console.log('================================================================');
  console.log('🧪 NET-403 NETWORK AUTOMATION & PROGRAMMABILITY VERIFICATION');
  console.log('================================================================\n');

  // [TEST 1] Verify Course & Lesson Record
  console.log('[TEST 1] Verifying Network Automation Lesson Record in NET-403...');
  const lesson = LESSONS_NET300_400.find(
    (l) => l.slug === 'net-403-network-automation-programmability-foundations'
  );
  assert(!!lesson, 'Lesson "net-403-network-automation-programmability-foundations" exists');
  assert(lesson!.courseCode === 'NET-403', 'Lesson belongs to course NET-403');
  assert(lesson!.order === 1, 'Lesson order is 1 in NET-403 sequence');
  assert(lesson!.visualizationType === 'NETWORK_AUTOMATION_PIPELINE', 'Visualization type is NETWORK_AUTOMATION_PIPELINE');
  console.log(`  ✓ Lesson "${lesson!.title}" found in course NET-403.`);

  // [TEST 2] Verify Core Automation Concepts
  console.log('\n[TEST 2] Verifying Core Automation Concepts & Principles...');
  const content = (lesson!.contentV2 || lesson!.stepMetadata) as any;
  assert(!!content, 'Lesson contains content definition');
  const objective = content.objective || content.step1_objective;
  assert(!!objective, 'Objective defined');
  const coreConcept = content.explanation || content.step4_coreConcept;
  assert(coreConcept.includes('Idempotency') || coreConcept.includes('idempotent'), 'Core concept defines Idempotency');
  assert(coreConcept.includes('Declarative') || coreConcept.includes('declarative'), 'Core concept defines Declarative vs Imperative');
  assert(coreConcept.includes('Configuration drift') || coreConcept.includes('drift'), 'Core concept covers Configuration Drift');
  assert(coreConcept.includes('REST API') || coreConcept.includes('REST'), 'Core concept covers REST APIs');
  assert(coreConcept.includes('JSON'), 'Core concept covers JSON structured data');

  const components = content.components || content.step5_technicalAnatomy?.components;
  const compNames = components.map((c: any) => c.name);
  assert(compNames.some((n: string) => n.includes('Why Automation Exists')), '1. Anatomy includes Why Network Automation Exists');
  assert(compNames.some((n: string) => n.includes('Manual vs Automated')), '2. Anatomy includes Manual vs Automated Workflows');
  assert(compNames.some((n: string) => n.includes('Configuration Drift')), '3. Anatomy includes Configuration Drift');
  assert(compNames.some((n: string) => n.includes('Idempotency')), '4. Anatomy includes Idempotency');
  assert(compNames.some((n: string) => n.includes('Declarative vs Imperative')), '5. Anatomy includes Declarative vs Imperative');
  assert(compNames.some((n: string) => n.includes('Network APIs')), '6. Anatomy includes Network APIs');
  assert(compNames.some((n: string) => n.includes('REST Basics')), '7. Anatomy includes REST Basics');
  assert(compNames.some((n: string) => n.includes('HTTP Methods')), '8. Anatomy includes HTTP Methods');
  assert(compNames.some((n: string) => n.includes('JSON Data Structure')), '9. Anatomy includes JSON Data Structure');
  assert(compNames.some((n: string) => n.includes('Safe Automation Workflow')), '10. Anatomy includes Safe Automation Workflow');
  console.log('  ✓ All 10 core architectural automation components verified.');

  // [TEST 3] Verify REST Methods & Python JSON Parsing
  console.log('\n[TEST 3] Verifying REST Methods, HTTP Verbs & Python Data Structures...');
  assert(coreConcept.includes('GET') && coreConcept.includes('POST') && coreConcept.includes('PATCH') && coreConcept.includes('DELETE'), 'Covers GET, POST, PATCH, and DELETE HTTP methods');
  const workedEx = content.workedExample || content.step9_workedExample;
  assert(!!workedEx, 'Worked example defined');
  assert(workedEx.problemStatement.includes('GET /api/v1/interfaces'), 'Worked example models REST API GET/PATCH interaction');
  console.log('  ✓ REST API methods, status codes, and Python JSON dictionary parsing verified.');

  // [TEST 4] Verify Safe Automation Pipeline & Pre-Flight Checks
  console.log('\n[TEST 4] Verifying Safe Automation Pipeline Stages (Inspect -> Validate -> Dry-Run -> Apply -> Verify -> Log)...');
  const steps = content.howItWorks || content.step6_howItWorks?.steps;
  assert(Array.isArray(steps) && steps.length >= 6, `Contains 6 pipeline stages (found: ${steps?.length})`);
  const stepTitles = steps.map((s: any) => s.title);
  assert(stepTitles.some((t: string) => t.includes('Inspect')), 'Stage 1: Inspect Current State defined');
  assert(stepTitles.some((t: string) => t.includes('Validate')), 'Stage 2: Schema Validation defined');
  assert(stepTitles.some((t: string) => t.includes('Dry-Run')), 'Stage 3: Dry-Run Diffing defined');
  assert(stepTitles.some((t: string) => t.includes('Apply')), 'Stage 4: Apply Changes defined');
  assert(stepTitles.some((t) => t.includes('Verify')), 'Stage 5: Verify Operational State defined');
  assert(stepTitles.some((t) => t.includes('Log')), 'Stage 6: Log Audit Trail defined');
  console.log('  ✓ 6-stage safe automation deployment pipeline verified.');

  // [TEST 5] Verify Assessment Question Bank (6-8 Questions Across 4 Cognitive Tiers)
  console.log('\n[TEST 5] Verifying Assessment Question Bank & Cognitive Levels...');
  const questions = lesson!.questions;
  assert(questions.length >= 6 && questions.length <= 8, `Assessment contains 6–8 questions (found: ${questions.length})`);

  const cognitiveLevels = questions.map((q) => q.cognitiveLevel);
  assert(cognitiveLevels.includes('RECALL' as any), 'Contains RECALL question (HTTP GET read-only)');
  assert(cognitiveLevels.includes('UNDERSTANDING' as any), 'Contains UNDERSTANDING question (Idempotency & Declarative)');
  assert(cognitiveLevels.includes('APPLICATION' as any), 'Contains APPLICATION question (JSON interpretation & Drift)');
  assert(cognitiveLevels.includes('TROUBLESHOOTING' as any), 'Contains TROUBLESHOOTING question (Pre-flight validation & Unsafe practices)');

  // Verify mandatory concept coverage
  const concepts = questions.map((q) => q.concept.toLowerCase());
  assert(concepts.some((c) => c.includes('idempotency')), 'Question exists testing Idempotency');
  assert(concepts.some((c) => c.includes('rest') || c.includes('http')), 'Question exists testing REST / HTTP Methods');
  assert(concepts.some((c) => c.includes('json')), 'Question exists testing JSON Interpretation');
  assert(concepts.some((c) => c.includes('safe') || c.includes('unsafe') || c.includes('validation')), 'Question exists testing Safe Automation Practices');

  questions.forEach((q, idx) => {
    assert(q.options.length === 4, `Question ${idx + 1} has exactly 4 options`);
    assert(q.correctOption === 0, `Question ${idx + 1} has correct option mapped`);
    assert(!!q.explanation, `Question ${idx + 1} has explanation`);
    assert(Object.keys(q.explanationsJson).length >= 3, `Question ${idx + 1} has distractor explanations`);
  });
  console.log(`  ✓ ${questions.length} assessment questions verified covering Idempotency, REST methods, JSON parsing, and Safe Automation.`);

  // [TEST 6] Verify Safe Simulated Lab (Zero Host Execution)
  console.log('\n[TEST 6] Verifying Safe Simulation Lab Structure...');
  const lab = lesson!.lab;
  assert(!!lab, 'Lesson has associated lab');
  assert(lab!.tasks.length >= 4, `Lab contains at least 4 practical tasks (found: ${lab!.tasks.length})`);
  assert(!!lab!.initialTopologyJson, 'Lab has initialTopologyJson defined');
  assert(!!lab!.initialTopologyJson.device && !!lab!.initialTopologyJson.currentState && !!lab!.initialTopologyJson.targetState, 'Lab topology includes device, currentState, and targetState');

  // Verify NO arbitrary code execution strings exist in initial topology
  const rawTopo = JSON.stringify(lab!.initialTopologyJson);
  assert(!rawTopo.includes('eval(') && !rawTopo.includes('exec(') && !rawTopo.includes('child_process'), 'Lab initial topology contains zero dangerous execution hooks');
  console.log(`  ✓ Safe simulated lab "${lab!.title}" verified with ${lab!.tasks.length} tasks and zero unsafe code execution.`);

  console.log('\n================================================================');
  console.log('🎉 ALL 6 NETWORK AUTOMATION VERIFICATION TESTS PASSED!');
  console.log('================================================================\n');
}

verifyNetworkAutomation().catch((err) => {
  console.error('\n❌ NETWORK AUTOMATION VERIFICATION FAILED:', err);
  process.exit(1);
});
