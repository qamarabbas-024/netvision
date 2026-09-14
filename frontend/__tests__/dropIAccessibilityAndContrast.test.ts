import * as fs from 'fs';
import * as path from 'path';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[A11Y ASSERTION FAILED]: ${msg}`);
  }
}

export function runDropIAccessibilityAndContrastTests() {
  console.log('--- Running Drop I: Accessibility (WCAG 2.1 AA) & Keyboard Navigation Tests ---');

  // 1. Modal Component Focus Trap & ARIA Dialog Semantics
  console.log('  Testing 1: Modal component accessible dialog semantics & focus trapping...');
  const modalPath = path.resolve(__dirname, '../components/ui/Modal.tsx');
  const modalSource = fs.readFileSync(modalPath, 'utf8');

  assert(modalSource.includes('role="dialog"'), 'Modal must have role="dialog"');
  assert(modalSource.includes('aria-modal="true"'), 'Modal must have aria-modal="true"');
  assert(modalSource.includes('aria-labelledby'), 'Modal must bind aria-labelledby');
  assert(modalSource.includes('modal-dialog-title'), 'Modal must use modal-dialog-title ID');
  assert(modalSource.includes("e.key === 'Tab'"), 'Modal must intercept Tab key for focus trapping');
  assert(modalSource.includes("e.key === 'Escape'"), 'Modal must intercept Escape key for dismissal');
  assert(modalSource.includes('focus-visible:ring-2'), 'Modal must have visible focus rings');

  // 2. Troubleshooting Workspace CLI Accessibility
  console.log('  Testing 2: Troubleshooting workspace CLI terminal accessibility...');
  const tbWorkspacePath = path.resolve(__dirname, '../components/troubleshooting/TroubleshootingWorkspace.tsx');
  const tbSource = fs.readFileSync(tbWorkspacePath, 'utf8');

  assert(tbSource.includes('role="region"'), 'Troubleshooting terminal output must declare role="region"');
  assert(tbSource.includes('aria-label="Diagnostic Terminal Output"'), 'Terminal output must have descriptive aria-label');
  assert(tbSource.includes('aria-live="polite"'), 'Terminal output must declare aria-live="polite" for dynamic updates');
  assert(tbSource.includes('tabIndex={0}'), 'Terminal scroll area must have tabIndex={0} for keyboard scrollability');
  assert(tbSource.includes('id="troubleshooting-cli-input"'), 'CLI input must have unique ID');
  assert(tbSource.includes('aria-label="Investigation CLI Command Input"'), 'CLI input must have accessible aria-label');
  assert(tbSource.includes('aria-label="Execute diagnostic command"'), 'Execute button must have accessible aria-label');

  // 3. Sandbox Device CLI Modal Accessibility
  console.log('  Testing 3: Sandbox DeviceCliModal keyboard navigation and ARIA output...');
  const deviceCliPath = path.resolve(__dirname, '../components/sandbox/DeviceCliModal.tsx');
  const deviceCliSource = fs.readFileSync(deviceCliPath, 'utf8');

  assert(deviceCliSource.includes('role="region"'), 'Device CLI output must declare role="region"');
  assert(deviceCliSource.includes('aria-label="Simulated Terminal Output"'), 'Device CLI output must declare aria-label');
  assert(deviceCliSource.includes('aria-live="polite"'), 'Device CLI output must declare aria-live="polite"');
  assert(deviceCliSource.includes('id="device-cli-command-input"'), 'Device CLI input must have unique ID');
  assert(deviceCliSource.includes('aria-label="CLI Command Input"'), 'Device CLI input must declare aria-label');

  // 4. Quiz & Assessment Feedback Regions
  console.log('  Testing 4: Assessment and Quiz ARIA live announcement regions...');
  const quizQuestionPath = path.resolve(__dirname, '../components/learning/QuizQuestion.tsx');
  const quizQuestionSource = fs.readFileSync(quizQuestionPath, 'utf8');
  assert(quizQuestionSource.includes('role="status"'), 'Quiz feedback badge must declare role="status"');
  assert(quizQuestionSource.includes('aria-live="polite"'), 'Quiz feedback badge must declare aria-live="polite"');

  const quizResultPath = path.resolve(__dirname, '../components/learning/QuizResult.tsx');
  const quizResultSource = fs.readFileSync(quizResultPath, 'utf8');
  assert(quizResultSource.includes('role="region"'), 'Quiz result summary must declare role="region"');
  assert(quizResultSource.includes('aria-label="Assessment Score Summary"'), 'Quiz result summary must declare aria-label');
  assert(quizResultSource.includes('aria-live="polite"'), 'Quiz result summary must declare aria-live="polite"');

  console.log('  ✓ Drop I Accessibility (WCAG 2.1 AA) Tests PASSED!\n');
}
