import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';
import * as fs from 'fs';
import * as path from 'path';

function exportHighRatioQuestions() {
  const highRatio = [];

  for (let idx = 0; idx < EXPANDED_ASSESSMENT_QUESTION_BANK.length; idx++) {
    const q = EXPANDED_ASSESSMENT_QUESTION_BANK[idx];
    const correctText = q.options[q.correctOption] || '';
    const distractors = q.options.filter((_, i) => i !== q.correctOption);
    const avgDist = distractors.reduce((sum, d) => sum + d.length, 0) / distractors.length;
    const ratio = correctText.length / (avgDist || 1);

    if (ratio > 1.5 || (correctText.length > 100 && avgDist < 60)) {
      highRatio.push({
        index: idx,
        quizId: q.quizId,
        lessonSlug: q.lessonSlug,
        concept: q.concept,
        question: q.text,
        correctOption: q.correctOption,
        options: q.options,
        ratio: Number(ratio.toFixed(2)),
        correctLen: correctText.length,
        avgDist: Number(avgDist.toFixed(1)),
        explanationsJson: q.explanationsJson,
      });
    }
  }

  const outPath = path.resolve(__dirname, '../../docs/high-ratio-questions.json');
  fs.writeFileSync(outPath, JSON.stringify(highRatio, null, 2));
  console.log(`Found ${highRatio.length} questions needing distractor length/quality rebalancing.`);
  console.log(`Saved to ${outPath}`);
}

exportHighRatioQuestions();
