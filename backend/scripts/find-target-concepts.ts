import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';

const targetQuizzes = [
  'quiz-routing-fundamentals-overview',
  'quiz-switching-vlans-overview',
  'quiz-network-security-basics-overview',
  'quiz-firewalls-acls-overview',
  'quiz-nat-pat-overview',
  'quiz-vpn-cryptography-overview',
  'quiz-wireless-networking-overview'
];

for (const qz of targetQuizzes) {
  console.log(`=== ${qz} ===`);
  const questions = EXPANDED_ASSESSMENT_QUESTION_BANK.filter(q => q.quizId === qz);
  for (const q of questions) {
    console.log(`  Concept: "${q.concept}" | CorrectOpt: ${q.correctOption} | CorrectText: "${q.options[q.correctOption].substring(0, 50)}..."`);
  }
}
