import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';

function analyze() {
  const highRatioQuestions = [];
  let totalCorrectLen = 0;
  let totalDistractorLen = 0;
  let totalDistractors = 0;

  for (const q of EXPANDED_ASSESSMENT_QUESTION_BANK) {
    const correctText = q.options[q.correctOption] || '';
    const correctLen = correctText.length;
    totalCorrectLen += correctLen;

    const distractors = q.options.filter((_, idx) => idx !== q.correctOption);
    const distractorSum = distractors.reduce((sum, d) => sum + d.length, 0);
    totalDistractorLen += distractorSum;
    totalDistractors += distractors.length;

    const avgDist = distractorSum / distractors.length;
    const ratio = correctLen / (avgDist || 1);

    if (ratio > 1.8) {
      highRatioQuestions.push({
        concept: q.concept,
        text: q.text,
        quizId: q.quizId,
        ratio,
        correctLen,
        avgDist,
        correctText,
        distractors,
      });
    }
  }

  console.log(`Total questions: ${EXPANDED_ASSESSMENT_QUESTION_BANK.length}`);
  console.log(`Average Correct Length: ${(totalCorrectLen / EXPANDED_ASSESSMENT_QUESTION_BANK.length).toFixed(1)}`);
  console.log(`Average Distractor Length: ${(totalDistractorLen / totalDistractors).toFixed(1)}`);
  console.log(`Overall Ratio: ${(totalCorrectLen / EXPANDED_ASSESSMENT_QUESTION_BANK.length / (totalDistractorLen / totalDistractors)).toFixed(2)}`);
  console.log(`Questions with ratio > 1.8: ${highRatioQuestions.length}`);

  console.log('\nTop 5 highest ratio questions:');
  highRatioQuestions.sort((a, b) => b.ratio - a.ratio);
  for (const item of highRatioQuestions.slice(0, 5)) {
    console.log(`\n[${item.quizId} - ${item.concept}] Ratio: ${item.ratio.toFixed(2)}`);
    console.log(`Correct (${item.correctLen} chars): "${item.correctText}"`);
    console.log(`Distractors (${item.avgDist.toFixed(1)} avg):`);
    item.distractors.forEach((d, i) => console.log(`   ${i + 1}. (${d.length} chars) "${d}"`));
  }
}

analyze();
