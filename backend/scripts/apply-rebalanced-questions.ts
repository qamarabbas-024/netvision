import * as fs from 'fs';
import * as path from 'path';
import { ELEVATED_PART1_NET100, ElevatedQuestionDef } from './data/elevated-part1-net100';
import { ELEVATED_PART2_NET200 } from './data/elevated-part2-net200';
import { ELEVATED_PART3_NET300 } from './data/elevated-part3-net300';
import { ELEVATED_PART4_NET400 } from './data/elevated-part4-net400';
import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';

const ALL_UPGRADES: ElevatedQuestionDef[] = [
  ...ELEVATED_PART1_NET100,
  ...ELEVATED_PART2_NET200,
  ...ELEVATED_PART3_NET300,
  ...ELEVATED_PART4_NET400,
];

function applyUpgrades() {
  const targetFile = path.resolve(__dirname, '../src/topics/assessment-question-bank.ts');
  let content = fs.readFileSync(targetFile, 'utf8');

  console.log(`Loaded ${ALL_UPGRADES.length} elevated questions.`);

  const upgradeMap = new Map<string, ElevatedQuestionDef>();
  for (const up of ALL_UPGRADES) {
    const key = `${up.quizId}:::${up.concept}`;
    upgradeMap.set(key, up);
  }

  let appliedCount = 0;
  const unappliedList: string[] = [];

  for (const upgrade of ALL_UPGRADES) {
    const key = `${upgrade.quizId}:::${upgrade.concept}`;
    
    // Find concept in file
    let conceptIdx = content.indexOf(`concept: "${upgrade.concept}"`);
    if (conceptIdx === -1) {
      conceptIdx = content.indexOf(`concept: '${upgrade.concept}'`);
    }

    if (conceptIdx === -1) {
      unappliedList.push(key);
      continue;
    }

    // Find the enclosing question block start: search backward for \n  {
    const blockStartIdx = content.lastIndexOf('\n  {', conceptIdx);
    if (blockStartIdx === -1) {
      unappliedList.push(key);
      continue;
    }

    // Find options inside this block
    const optionsStartIdx = content.indexOf('options: [', blockStartIdx);
    if (optionsStartIdx === -1 || optionsStartIdx > conceptIdx) {
      unappliedList.push(key);
      continue;
    }

    const optionsEndIdx = content.indexOf('],', optionsStartIdx);
    if (optionsEndIdx === -1 || optionsEndIdx > conceptIdx) {
      unappliedList.push(key);
      continue;
    }

    // Find explanationsJson inside this block
    const explStartIdx = content.indexOf('explanationsJson: {', optionsEndIdx);
    if (explStartIdx === -1 || explStartIdx > conceptIdx) {
      unappliedList.push(key);
      continue;
    }

    const explEndIdx = content.indexOf('},', explStartIdx);
    if (explEndIdx === -1 || explEndIdx > conceptIdx) {
      unappliedList.push(key);
      continue;
    }

    // Format new options
    const formattedOptions = 'options: [\n' + upgrade.options.map(opt => `      ${JSON.stringify(opt)}`).join(',\n') + '\n    ]';

    // Format new explanationsJson with trailing comma!
    const formattedExpl = 'explanationsJson: {\n' + Object.entries(upgrade.explanationsJson)
      .map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`)
      .join('\n') + '\n    },';

    // Replace explanationsJson first (since it appears later in text)
    content = content.substring(0, explStartIdx) + formattedExpl + content.substring(explEndIdx + 2);

    // Now find new options range in this block
    const newOptionsStart = content.indexOf('options: [', blockStartIdx);
    const newOptionsEnd = content.indexOf('],', newOptionsStart);
    content = content.substring(0, newOptionsStart) + formattedOptions + content.substring(newOptionsEnd + 1);

    appliedCount++;
  }

  console.log(`Successfully applied ${appliedCount} / ${ALL_UPGRADES.length} elevated question upgrades.`);
  if (unappliedList.length > 0) {
    console.warn('Unapplied keys:', unappliedList);
  }

  fs.writeFileSync(targetFile, content, 'utf8');
}

applyUpgrades();
