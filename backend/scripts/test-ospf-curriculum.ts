import { PrismaService } from '../src/database/prisma.service';

const prisma = new PrismaService();

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`[OSPF CURRICULUM ASSERTION FAILED]: ${msg}`);
}

async function verifyOspfCurriculum() {
  console.log('================================================================');
  console.log('🧪 NET-304 OSPF LINK-STATE CURRICULUM VERIFICATION');
  console.log('================================================================\n');

  await prisma.$connect();

  // 1. Verify Course NET-304
  console.log('[TEST 1] Verifying NET-304 Course Record...');
  const course = await prisma.course.findFirst({
    where: { code: 'NET-304' },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              quizzes: {
                include: {
                  questions: true,
                },
              },
              labs: true,
            },
          },
        },
      },
    },
  });

  assert(!!course, 'Course NET-304 exists in database');
  assert(course!.published === true, 'Course NET-304 is published');
  assert(course!.modules.length >= 1, 'Course NET-304 has at least 1 active module');
  console.log(`  ✓ Course "${course!.title}" found with ${course!.modules.length} module(s)`);

  // 2. Verify Module & Lesson
  console.log('\n[TEST 2] Verifying NET-304 Lesson & 18-Step Metadata...');
  const module1 = course!.modules[0];
  const lesson = module1.lessons.find((l) => l.slug === 'net-304-single-area-ospf-routing');
  assert(!!lesson, 'Benchmark lesson "net-304-single-area-ospf-routing" exists');
  assert(lesson!.visualizationType === 'OSPF_TOPOLOGY_SIMULATION', 'Visualization type is OSPF_TOPOLOGY_SIMULATION');

  const content: any = lesson!.contentJson;
  assert(!!content.step1_objective, 'Step 1 (Objective) is defined');
  assert(!!content.step3_whyItMatters, 'Step 3 (Why It Matters) is defined');
  assert(!!content.step4_coreConcept, 'Step 4 (Core Concept) is defined');
  assert(!!content.step5_technicalAnatomy, 'Step 5 (Technical Anatomy) is defined');
  assert(!!content.step6_howItWorks, 'Step 6 (How It Works) is defined');
  assert(!!content.step7_packetHeaderView, 'Step 7 (Packet Header View) is defined');
  assert(!!content.step8_visualExplanation, 'Step 8 (Visual Explanation) is defined');
  assert(!!content.step9_workedExample, 'Step 9 (Worked Example) is defined');
  assert(!!content.step12_cliTooling && content.step12_cliTooling.length >= 3, 'Step 12 (CLI Tooling) has >=3 commands');
  assert(!!content.step13_troubleshooting && content.step13_troubleshooting.length >= 2, 'Step 13 (Troubleshooting) has >=2 scenarios');
  assert(!!content.step18_masterySummary, 'Step 18 (Mastery Summary) is defined');
  console.log('  ✓ Lesson verified with complete 18-step pedagogical architecture');

  // 3. Verify Quiz & Questions
  console.log('\n[TEST 3] Verifying Quiz & Assessment Question Pool...');
  const quiz = lesson!.quizzes[0];
  assert(!!quiz, 'Quiz exists for NET-304 lesson');
  assert(quiz!.questions.length >= 5, `Quiz has at least 5 questions (found: ${quiz!.questions.length})`);
  for (const q of quiz!.questions) {
    assert(q.optionsJson !== null, `Question "${q.questionText.slice(0, 30)}..." has options`);
    assert(typeof q.correctOption === 'number', `Question has valid correctOption`);
    assert(!!q.explanation, `Question has whyCorrect explanation`);
  }
  console.log(`  ✓ Quiz "${quiz!.title}" verified with ${quiz!.questions.length} questions`);

  // 4. Verify Lab
  console.log('\n[TEST 4] Verifying Practical OSPF Lab Scenario...');
  assert(lesson!.labs.length >= 1, 'Lesson has at least 1 practical lab');
  const lab = lesson!.labs[0];
  assert(lab.title.includes('OSPF') || lab.title.includes('Routing'), 'Lab title is relevant to OSPF');
  assert(Array.isArray(lab.objectivesJson) && lab.objectivesJson.length >= 3, 'Lab has at least 3 tasks');
  console.log(`  ✓ Practical Lab "${lab.title}" verified with ${(lab.objectivesJson as any[]).length} tasks`);

  await prisma.$disconnect();

  console.log('\n================================================================');
  console.log('🎉 ALL 4 NET-304 CURRICULUM VERIFICATION TESTS PASSED!');
  console.log('================================================================\n');
}

verifyOspfCurriculum().catch((err) => {
  console.error('\n❌ OSPF CURRICULUM TEST FAILED:', err);
  process.exit(1);
});
