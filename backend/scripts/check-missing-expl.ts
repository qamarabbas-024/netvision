import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';

for (const q of EXPANDED_ASSESSMENT_QUESTION_BANK) {
  for (let i = 0; i < q.options.length; i++) {
    if (i !== q.correctOption) {
      if (!q.explanationsJson || !q.explanationsJson[i] || q.explanationsJson[i].length < 5) {
        console.log(`Missing explanation in: ${q.quizId} | Concept: "${q.concept}" | Opt index: ${i}`);
      }
    }
  }
}
