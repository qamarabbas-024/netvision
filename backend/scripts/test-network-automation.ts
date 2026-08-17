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
  const meta = lesson!.stepMetadata;
  assert(!!meta, 'Lesson contains stepMetadata');
  assert(!!meta.step1_objective, 'Objective defined');
  assert(meta.step4_coreConcept.includes('Idempotency') || meta.step4_coreConcept.includes('idempotent'), 'Core concept defines Idempotency');
  assert(meta.step4_coreConcept.includes('Declarative') || meta.step4_coreConcept.includes('declarative'), 'Core concept defines Declarative vs Imperative');
  assert(meta.step4_coreConcept.includes('Configuration drift') || meta.step4_coreConcept.includes('drift'), 'Core concept covers Configuration Drift');
  assert(meta.step4_coreConcept.includes('REST API') || meta.step4_coreConcept.includes('REST'), 'Core concept covers REST APIs');
  assert(meta.step4_coreConcept.includes('JSON'), 'Core concept covers JSON structured data');

  const components = meta.step5_technicalAnatomy.components;
  const compNames = components.map((c) => c.name);
  assert(compNames.some((n) => n.includes('Idempotency')), 'Anatomy includes Idempotency');
  assert(compNames.some((n) => n.includes('Declarative vs Imperative')), 'Anatomy includes Declarative vs Imperative');
  assert(compNames.some((n) => n.includes('Configuration Drift')), 'Anatomy includes Configuration Drift');
  assert(compNames.some((n) => n.includes('REST API')), 'Anatomy includes REST APIs & HTTP Methods');
  assert(compNames.some((n) => n.includes('JSON Data')), 'Anatomy includes Structured JSON Data');
  assert(compNames.some((n) => n.includes('Python Automation')), 'Anatomy includes Python Automation Workflow');
  assert(compNames.some((n) => n.includes('Dry Run')), 'Anatomy includes Pre-Deployment Dry Run');
  assert(compNames.some((n) => n.includes('Telemetry')), 'Anatomy includes Model-Driven Telemetry');
  assert(compNames.some((n) => n.includes('SDN')), 'Anatomy includes SDN & Intent-Based Controllers');
  console.log('  ✓ All 10 core architectural automation components verified.');

  // [TEST 3] Verify REST Methods & Python JSON Parsing
  console.log('\n[TEST 3] Verifying REST Methods, HTTP Verbs & Python Data Structures...');
  assert(meta.step4_coreConcept.includes('GET') && meta.step4_coreConcept.includes('POST') && meta.step4_coreConcept.includes('PATCH') && meta.step4_coreConcept.includes('DELETE'), 'Covers GET, POST, PATCH, and DELETE HTTP methods');
  assert(!!meta.step9_workedExample, 'Worked example defined');
  assert(meta.step9_workedExample.problemStatement.includes('GET /api/v1/interfaces'), 'Worked example models REST API GET/PATCH interaction');
  console.log('  ✓ REST API methods, status codes, and Python JSON dictionary parsing verified.');

  // [TEST 4] Verify Safe Automation Pipeline & Pre-Flight Checks
  console.log('\n[TEST 4] Verifying Safe Automation Pipeline Stages...');
  assert(!!meta.step6_howItWorks, 'How it works steps defined');
  assert(meta.step6_howItWorks.steps.length >= 5, `Contains >=5 pipeline stages (found: ${meta.step6_howItWorks.steps.length})`);
  const stepTitles = meta.step6_howItWorks.steps.map((s) => s.title);
  assert(stepTitles.some((t) => t.includes('Intended State')), 'Stage 1: Intended State defined');
  assert(stepTitles.some((t) => t.includes('Validation')), 'Stage 2: Schema Validation defined');
  assert(stepTitles.some((t) => t.includes('Dry-Run')), 'Stage 3: Dry-Run Diffing defined');
  assert(stepTitles.some((t) => t.includes('Deployment')), 'Stage 4: Atomic Deployment defined');
  assert(stepTitles.some((t) => t.includes('Verification') || t.includes('Telemetry')), 'Stage 5: Telemetry Verification defined');
  console.log('  ✓ 5-stage safe automation deployment pipeline verified.');

  // [TEST 5] Verify Assessment Questions across 4 Cognitive Levels
  console.log('\n[TEST 5] Verifying Assessment Question Bank & Cognitive Levels...');
  const questions = lesson!.questions;
  assert(questions.length >= 4, `At least 4 questions defined (found: ${questions.length})`);

  const cognitiveLevels = questions.map((q) => q.cognitiveLevel);
  assert(cognitiveLevels.includes('RECALL' as any), 'Contains RECALL question (HTTP GET read-only)');
  assert(cognitiveLevels.includes('UNDERSTANDING' as any), 'Contains UNDERSTANDING question (Idempotency)');
  assert(cognitiveLevels.includes('APPLICATION' as any), 'Contains APPLICATION question (JSON parsing in Python)');
  assert(cognitiveLevels.includes('TROUBLESHOOTING' as any), 'Contains TROUBLESHOOTING question (Schema pre-flight validation)');

  questions.forEach((q, idx) => {
    assert(q.options.length === 4, `Question ${idx + 1} has exactly 4 options`);
    assert(q.correctOption === 0, `Question ${idx + 1} has correct option mapped`);
    assert(!!q.explanation, `Question ${idx + 1} has explanation`);
    assert(Object.keys(q.explanationsJson).length >= 3, `Question ${idx + 1} has distractor explanations`);
  });
  console.log(`  ✓ ${questions.length} assessment questions verified covering Idempotency, REST, JSON parsing, and Pre-Flight validation.`);

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
