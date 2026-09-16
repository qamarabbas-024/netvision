import { LESSONS_NET100 } from './lessons-net100';
import { LESSONS_NET200 } from './lessons-net200';
import { LESSONS_NET203_204 } from './lessons-net203-204';
import { LESSONS_NET300_400, BenchmarkLessonFullDefinition } from './lessons-net300-400';
import { LESSONS_NET_C04 } from './lessons-net-c04';
import { REMEDIATED_12_LESSONS } from './lessons-remediated';

export { BenchmarkQuestionDef, BenchmarkLabDef, BenchmarkLessonFullDefinition } from './lessons-net300-400';
export { LESSONS_NET_C04 } from './lessons-net-c04';
export { REMEDIATED_12_LESSONS } from './lessons-remediated';

export const BENCHMARK_LESSONS_FULL: BenchmarkLessonFullDefinition[] = [
  ...LESSONS_NET100,
  ...LESSONS_NET200,
  ...LESSONS_NET203_204,
  ...LESSONS_NET300_400,
  ...LESSONS_NET_C04,
  ...REMEDIATED_12_LESSONS,
];
