import * as fs from 'fs';
import * as path from 'path';

const mappingJsonPath = path.join(__dirname, '..', 'src', 'topics', 'data', 'textbook-curriculum-mapping.json');
const mappingTsPath = path.join(__dirname, '..', 'src', 'topics', 'data', 'textbook-curriculum-mapping.ts');

const jsonContent = fs.readFileSync(mappingJsonPath, 'utf-8');
const parsed = JSON.parse(jsonContent);

const tsContent = `// Auto-generated canonical mapping from Owner's CS-221 Textbook to NetVision Curriculum
export interface LessonTextbookMapping {
  lessonSlug: string;
  lessonTitle: string;
  courseCode: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  textbookChapterNumber: number;
  textbookChapterTitle: string;
  sectionReference: string;
  sourceVersion: string;
  sourceContentHash: string;
  standardsRefs: string[];
  learningObjectives: string[];
  prerequisiteConcepts: string[];
  assessmentLinkage: string;
}

export const CANONICAL_TEXTBOOK_MAPPING: LessonTextbookMapping[] = ${JSON.stringify(parsed, null, 2)};

export const TEXTBOOK_MAPPING_BY_SLUG = new Map<string, LessonTextbookMapping>(
  CANONICAL_TEXTBOOK_MAPPING.map((m) => [m.lessonSlug, m])
);
`;

fs.writeFileSync(mappingTsPath, tsContent, 'utf-8');
console.log(`Wrote TypeScript mapping to ${mappingTsPath}`);
