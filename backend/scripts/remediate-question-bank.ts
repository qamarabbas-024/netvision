import * as fs from 'fs';
import * as path from 'path';
import { EXPANDED_ASSESSMENT_QUESTION_BANK, AssessmentQuestionDef } from '../src/topics/assessment-question-bank';
import { LESSONS_NET300_400 } from '../src/topics/lessons-net300-400';
import { LESSONS_NET_C04 } from '../src/topics/lessons-net-c04';
import { CourseLevel, CognitiveLevel, QuestionType } from '@prisma/client';

async function remediateBank() {
  console.log('=== NetVision Assessment Question Bank Remediation ===');
  console.log(`Initial Question Bank size: ${EXPANDED_ASSESSMENT_QUESTION_BANK.length}`);

  // 1. Gather all questions, including 27 missing questions for the 6 zero-question quizzes
  const fullBank: AssessmentQuestionDef[] = [...EXPANDED_ASSESSMENT_QUESTION_BANK];

  const missingQuizzes = [
    { lesson: LESSONS_NET300_400.find(l => l.slug === 'net-304-multi-area-ospf-redistribution'), quizId: 'quiz-net-304-multi-area-ospf-redistribution' },
    { lesson: LESSONS_NET300_400.find(l => l.slug === 'net-403-network-automation-programmability-foundations'), quizId: 'quiz-net-403-network-automation-programmability-foundations' },
    { lesson: LESSONS_NET_C04.find(l => l.slug === 'net-305-standard-extended-ipv4-acls'), quizId: 'quiz-net-305-standard-extended-ipv4-acls' },
    { lesson: LESSONS_NET_C04.find(l => l.slug === 'net-305-stateful-firewalls-connection-tracking'), quizId: 'quiz-net-305-stateful-firewalls-connection-tracking' },
    { lesson: LESSONS_NET_C04.find(l => l.slug === 'net-401-ipv4-nat-pat-address-translation'), quizId: 'quiz-net-401-ipv4-nat-pat-address-translation' },
    { lesson: LESSONS_NET_C04.find(l => l.slug === 'net-402-ipsec-vpn-cryptographic-tunnels'), quizId: 'quiz-net-402-ipsec-vpn-cryptographic-tunnels' },
  ];

  let addedCount = 0;
  for (const item of missingQuizzes) {
    if (!item.lesson || !item.lesson.questions) {
      throw new Error(`Missing questions for ${item.quizId}`);
    }
    for (const q of item.lesson.questions) {
      fullBank.push({
        quizId: item.quizId,
        lessonSlug: item.lesson.slug,
        text: q.text,
        options: [...q.options],
        correctOption: q.correctOption ?? 0,
        explanation: q.explanation,
        explanationsJson: q.explanationsJson ? { ...q.explanationsJson } : {},
        difficulty: (q.difficulty as CourseLevel) || CourseLevel.INTERMEDIATE,
        cognitiveLevel: (q.cognitiveLevel as CognitiveLevel) || CognitiveLevel.APPLICATION,
        questionType: (q.questionType as QuestionType) || QuestionType.MULTIPLE_CHOICE,
        concept: q.concept || `${item.lesson.title} Concept`,
        points: (q as any).points || 10,
      });
      addedCount++;
    }
  }

  console.log(`Added ${addedCount} missing questions to question bank.`);
  console.log(`Total questions in combined bank: ${fullBank.length}`);

  // 2. Perform Option A Bias Remediation
  // Target: A=25%, B=25%, C=25%, D=25%
  // Strategy: For question at index i, target position is k = i % 4.
  // Swap options[0] with options[k]. Update correctOption = k.
  // Re-map explanationsJson so distractor explanations follow their respective options.

  const remediatedBank: AssessmentQuestionDef[] = [];
  const counts = [0, 0, 0, 0];

  for (let i = 0; i < fullBank.length; i++) {
    const origQ = fullBank[i];
    const targetK = i % 4;

    const origCorrectText = origQ.options[origQ.correctOption ?? 0];
    const origExplJson = { ...origQ.explanationsJson };

    // Build the 4 options:
    // Original option 0 was the correct answer.
    // Original options 1, 2, 3 were distractors with explanations in origExplJson[1], origExplJson[2], origExplJson[3].
    const newOptions = [...origQ.options];
    
    // Swap index 0 and targetK
    newOptions[0] = origQ.options[targetK];
    newOptions[targetK] = origQ.options[0];

    // Reconstruct explanationsJson
    const newExplJson: Record<number, string> = {};

    if (targetK === 0) {
      newExplJson[1] = origExplJson[1] || 'Incorrect distractor.';
      newExplJson[2] = origExplJson[2] || 'Incorrect distractor.';
      newExplJson[3] = origExplJson[3] || 'Incorrect distractor.';
    } else if (targetK === 1) {
      newExplJson[0] = origExplJson[1] || 'Incorrect distractor.';
      newExplJson[2] = origExplJson[2] || 'Incorrect distractor.';
      newExplJson[3] = origExplJson[3] || 'Incorrect distractor.';
    } else if (targetK === 2) {
      newExplJson[0] = origExplJson[2] || 'Incorrect distractor.';
      newExplJson[1] = origExplJson[1] || 'Incorrect distractor.';
      newExplJson[3] = origExplJson[3] || 'Incorrect distractor.';
    } else if (targetK === 3) {
      newExplJson[0] = origExplJson[3] || 'Incorrect distractor.';
      newExplJson[1] = origExplJson[1] || 'Incorrect distractor.';
      newExplJson[2] = origExplJson[2] || 'Incorrect distractor.';
    }

    // Mathematical integrity check
    if (newOptions[targetK] !== origCorrectText) {
      throw new Error(`Integrity error at question ${i}: target option does not match original correct text!`);
    }
    if (targetK in newExplJson) {
      throw new Error(`Integrity error at question ${i}: correct option is present in distractor explanationsJson!`);
    }

    counts[targetK]++;

    remediatedBank.push({
      ...origQ,
      options: newOptions,
      correctOption: targetK,
      explanationsJson: newExplJson,
    });
  }

  console.log(`\nFinal Option Distribution:`);
  console.log(`  Option A (0): ${counts[0]} (${((counts[0] / fullBank.length) * 100).toFixed(2)}%)`);
  console.log(`  Option B (1): ${counts[1]} (${((counts[1] / fullBank.length) * 100).toFixed(2)}%)`);
  console.log(`  Option C (2): ${counts[2]} (${((counts[2] / fullBank.length) * 100).toFixed(2)}%)`);
  console.log(`  Option D (3): ${counts[3]} (${((counts[3] / fullBank.length) * 100).toFixed(2)}%)`);

  // 3. Write back to backend/src/topics/assessment-question-bank.ts
  const bankFilePath = path.join(__dirname, '..', 'src', 'topics', 'assessment-question-bank.ts');

  // Format the file cleanly
  let fileContent = `import { CourseLevel, CognitiveLevel, QuestionType } from '@prisma/client';

export interface AssessmentQuestionDef {
  quizId: string;
  lessonSlug: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation: string;
  explanationsJson: Record<number, string>;
  difficulty: CourseLevel;
  cognitiveLevel: CognitiveLevel;
  questionType: QuestionType;
  concept: string;
  points?: number;
}

export const EXPANDED_ASSESSMENT_QUESTION_BANK: AssessmentQuestionDef[] = [\n`;

  for (const q of remediatedBank) {
    fileContent += `  {\n`;
    fileContent += `    quizId: ${JSON.stringify(q.quizId)},\n`;
    fileContent += `    lessonSlug: ${JSON.stringify(q.lessonSlug)},\n`;
    fileContent += `    text: ${JSON.stringify(q.text)},\n`;
    fileContent += `    options: ${JSON.stringify(q.options, null, 6).replace(/\]/g, '    ]')},\n`;
    fileContent += `    correctOption: ${q.correctOption},\n`;
    fileContent += `    explanation: ${JSON.stringify(q.explanation)},\n`;
    fileContent += `    explanationsJson: {\n`;
    for (const [k, v] of Object.entries(q.explanationsJson)) {
      fileContent += `      ${k}: ${JSON.stringify(v)},\n`;
    }
    fileContent += `    },\n`;
    fileContent += `    difficulty: CourseLevel.${q.difficulty},\n`;
    fileContent += `    cognitiveLevel: CognitiveLevel.${q.cognitiveLevel},\n`;
    fileContent += `    questionType: QuestionType.${q.questionType},\n`;
    fileContent += `    concept: ${JSON.stringify(q.concept)},\n`;
    fileContent += `    points: ${q.points ?? 10},\n`;
    fileContent += `  },\n`;
  }

  fileContent += `];\n`;

  fs.writeFileSync(bankFilePath, fileContent, 'utf-8');
  console.log(`\nSuccessfully wrote remediated question bank to ${bankFilePath}`);
}

remediateBank().catch(console.error);
