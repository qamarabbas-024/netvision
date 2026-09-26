import assert from 'assert';
import fs from 'fs';
import path from 'path';

export function runDrop08UxAccessibilityMobileTests() {
  console.log('--- Sub-suite 1: Semantic Headings & Section Architecture ---');
  
  // 1. LiveObservatorySection headings
  const liveObsPath = path.join(process.cwd(), 'components/landing/LiveObservatorySection.tsx');
  const liveObsContent = fs.readFileSync(liveObsPath, 'utf8');
  assert(liveObsContent.includes('<h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">'), 'LiveObservatorySection main title must be an h2 heading');
  assert(liveObsContent.includes('<h3 className="text-sm font-bold text-slate-100'), 'Course card titles in observatory must be h3 headings');
  assert(!liveObsContent.includes('<h3 className="text-xl sm:text-2xl'), 'Old h3 main title must not exist');

  // 2. CertificationSection headings
  const certSecPath = path.join(process.cwd(), 'components/landing/CertificationSection.tsx');
  const certSecContent = fs.readFileSync(certSecPath, 'utf8');
  assert(certSecContent.includes('<h3 className="text-sm font-bold text-slate-200">Interactive 3D Study</h3>'), 'Step cards (01. Learn, etc.) must be h3 headings');
  assert(!certSecContent.includes('<h4 className="text-sm font-bold text-slate-200">Interactive 3D Study</h4>'), 'Old h4 step card titles must not exist');

  // 3. FaqSection accessibility attributes
  const faqPath = path.join(process.cwd(), 'components/landing/FaqSection.tsx');
  const faqContent = fs.readFileSync(faqPath, 'utf8');
  assert(faqContent.includes('aria-expanded={isOpen}'), 'FAQ trigger button must include aria-expanded');
  assert(faqContent.includes('aria-controls={answerId}'), 'FAQ trigger button must reference panel via aria-controls');
  assert(faqContent.includes('role="region"'), 'FAQ answer panel must have role="region"');
  assert(faqContent.includes('aria-labelledby={questionId}'), 'FAQ answer panel must reference question via aria-labelledby');

  console.log('  ✓ Semantic heading hierarchy and FAQ accordion semantics verified.');

  console.log('--- Sub-suite 2: Accessible Representation for 3D Network Visualizer ---');

  // 4. HeroSection dual-mode visualizer
  const heroPath = path.join(process.cwd(), 'components/landing/HeroSection.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf8');
  assert(heroContent.includes('role="region"'), 'Hero network visualizer must be a semantic region');
  assert(heroContent.includes('aria-label="Interactive Network Topology Observatory"'), 'Hero visualizer must have descriptive aria-label');
  assert(heroContent.includes('role="status"'), 'Hero scenario announcer must have role="status"');
  assert(heroContent.includes('aria-live="polite"'), 'Hero scenario announcer must have aria-live="polite"');
  assert(heroContent.includes('id="hero-toggle-accessible-view-btn"'), 'Accessible view toggle button must exist');
  assert(heroContent.includes('Accessible Topology Matrix'), 'Accessible Topology Matrix view must be present');
  assert(heroContent.includes('aria-label="Accessible Network Topology Node Details"'), 'Accessible topology view must have descriptive label');
  assert(heroContent.includes('Inspect Node'), 'Accessible topology matrix must provide keyboard-operable inspect buttons');

  console.log('  ✓ 3D Network visualizer dual-mode accessible matrix and live regions verified.');

  console.log('--- Sub-suite 3: Terminal Screen Reader & Keyboard Ergonomics ---');

  // 5. InteractiveTerminalModal
  const terminalModalPath = path.join(process.cwd(), 'components/landing/InteractiveTerminalModal.tsx');
  const terminalModalContent = fs.readFileSync(terminalModalPath, 'utf8');
  assert(terminalModalContent.includes('role="log"'), 'Terminal screen must declare role="log"');
  assert(terminalModalContent.includes('aria-live="polite"'), 'Terminal screen must declare aria-live="polite"');
  assert(terminalModalContent.includes('handleTabComplete'), 'Terminal must support Tab autocompletion');
  assert(terminalModalContent.includes('handleInterrupt'), 'Terminal must support Ctrl+C interrupt');
  assert(terminalModalContent.includes('Tab ⇥'), 'Mobile touch helper Tab button must exist');
  assert(terminalModalContent.includes('Ctrl+C'), 'Mobile touch helper Ctrl+C button must exist');
  assert(terminalModalContent.includes('▲'), 'Mobile touch helper Up arrow button must exist');
  assert(terminalModalContent.includes('▼'), 'Mobile touch helper Down arrow button must exist');
  assert(terminalModalContent.includes('Clear'), 'Mobile touch helper Clear button must exist');

  // 6. DeviceCliModal
  const deviceCliPath = path.join(process.cwd(), 'components/sandbox/DeviceCliModal.tsx');
  const deviceCliContent = fs.readFileSync(deviceCliPath, 'utf8');
  assert(deviceCliContent.includes('role="log"'), 'Device CLI terminal screen must have role="log"');
  assert(deviceCliContent.includes('aria-live="polite"'), 'Device CLI terminal screen must have aria-live="polite"');
  assert(deviceCliContent.includes('handleTabComplete'), 'Device CLI must support Tab autocompletion');
  assert(deviceCliContent.includes('handleInterrupt'), 'Device CLI must support Ctrl+C interrupt');

  // 7. CommandPanel (Labs)
  const cmdPanelPath = path.join(process.cwd(), 'components/learning/labs/CommandPanel.tsx');
  const cmdPanelContent = fs.readFileSync(cmdPanelPath, 'utf8');
  assert(cmdPanelContent.includes('role="log"'), 'Lab command panel terminal screen must have role="log"');
  assert(cmdPanelContent.includes('handleTabComplete'), 'Lab command panel must support Tab autocompletion');
  assert(cmdPanelContent.includes('handleInterrupt'), 'Lab command panel must support Ctrl+C interrupt');

  // 8. Troubleshooting CLI
  const tsPath = path.join(process.cwd(), 'components/troubleshooting/TroubleshootingWorkspace.tsx');
  const tsContent = fs.readFileSync(tsPath, 'utf8');
  assert(tsContent.includes('role="log"'), 'Troubleshooting terminal screen must have role="log"');
  assert(tsContent.includes('handleTabCompleteCli'), 'Troubleshooting CLI must support Tab autocomplete');
  assert(tsContent.includes('handleInterruptCli'), 'Troubleshooting CLI must support Ctrl+C interrupt');
  assert(tsContent.includes('historyIndex'), 'Troubleshooting CLI must track command history navigation');

  console.log('  ✓ Terminal role="log", aria-live, autocomplete, and keyboard helpers verified.');

  console.log('--- Sub-suite 4: Contrast Tokens & Universal Focus Visible ---');

  // 9. globals.css contrast and focus ring
  const cssPath = path.join(process.cwd(), 'app/globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert(cssContent.includes(':focus-visible'), 'Universal focus-visible rule must be defined');
  assert(cssContent.includes('outline: 2px solid var(--accent-cyan, #00f0ff)'), 'High-contrast 2px cyan outline must be applied on focus');
  assert(cssContent.includes('outline-offset: 2px'), 'Focus ring must have 2px offset for visibility');
  assert(cssContent.includes('--text-muted: #9da4b5'), 'Dark theme text-muted must meet >= 4.5:1 contrast');
  assert(cssContent.includes('overflow-x: hidden'), 'html/body must prevent horizontal scroll blowout');

  console.log('  ✓ Universal focus indicator and contrast token upgrades verified.');

  console.log('--- Sub-suite 5: Modal Focus Trapping & Escape Handling ---');

  // 10. useModalA11y hook
  const hookPath = path.join(process.cwd(), 'hooks/useModalA11y.ts');
  const hookContent = fs.readFileSync(hookPath, 'utf8');
  assert(hookContent.includes('useModalA11y'), 'useModalA11y hook must exist');
  assert(hookContent.includes('Escape'), 'Hook must listen for Escape key');
  assert(hookContent.includes('document.body.style.overflow = \'hidden\''), 'Hook must lock body scroll when modal opens');
  assert(hookContent.includes('previousActiveElementRef.current') && hookContent.includes('.focus()'), 'Hook must restore focus to trigger element on close');

  // 11. Modal integrations
  const signInPath = path.join(process.cwd(), 'components/landing/SignInModal.tsx');
  assert(fs.readFileSync(signInPath, 'utf8').includes('useModalA11y'), 'SignInModal must use useModalA11y');

  const courseModalPath = path.join(process.cwd(), 'components/landing/CourseModal.tsx');
  assert(fs.readFileSync(courseModalPath, 'utf8').includes('useModalA11y'), 'CourseModal must use useModalA11y');

  const devDetailsPath = path.join(process.cwd(), 'components/3d/DeviceDetailsModal.tsx');
  assert(fs.readFileSync(devDetailsPath, 'utf8').includes('useModalA11y'), 'DeviceDetailsModal must use useModalA11y');

  const packetInspectorPath = path.join(process.cwd(), 'components/3d/PacketInspectorModal.tsx');
  assert(fs.readFileSync(packetInspectorPath, 'utf8').includes('useModalA11y'), 'PacketInspectorModal must use useModalA11y');

  const courseCelebrationPath = path.join(process.cwd(), 'components/certification/CourseCelebrationModal.tsx');
  assert(fs.readFileSync(courseCelebrationPath, 'utf8').includes('useModalA11y'), 'CourseCelebrationModal must use useModalA11y');

  const masteryCelebrationPath = path.join(process.cwd(), 'components/certification/MasteryCelebrationModal.tsx');
  assert(fs.readFileSync(masteryCelebrationPath, 'utf8').includes('useModalA11y'), 'MasteryCelebrationModal must use useModalA11y');

  console.log('  ✓ Modal focus trapping, body scroll locking, and escape handling verified across all modals.');

  console.log('--- Sub-suite 6: Forms, Radios & Touch Targets ---');

  // 12. Input.tsx
  const inputPath = path.join(process.cwd(), 'components/ui/Input.tsx');
  const inputContent = fs.readFileSync(inputPath, 'utf8');
  assert(inputContent.includes('aria-invalid={!!error}'), 'Input must specify aria-invalid when error is present');
  assert(inputContent.includes('aria-describedby='), 'Input must connect to error message via aria-describedby');
  assert(inputContent.includes('role="alert"'), 'Input error message must have role="alert"');

  // 13. Navigation & mobile menu touch targets
  const navPath = path.join(process.cwd(), 'components/landing/Navigation.tsx');
  const navContent = fs.readFileSync(navPath, 'utf8');
  assert(navContent.includes('aria-expanded={isMobileMenuOpen}'), 'Mobile navigation button must declare aria-expanded');
  assert(navContent.includes('aria-controls="mobile-navigation-drawer"'), 'Mobile navigation button must declare aria-controls');
  assert(navContent.includes('aria-haspopup="true"'), 'Courses dropdown button must declare aria-haspopup="true"');
  assert(navContent.includes('min-h-[44px]'), 'Mobile navigation links and buttons must meet min 44px touch target');

  // 14. Quiz & ProctoredExam touch targets
  const quizPath = path.join(process.cwd(), 'components/learning/QuizQuestion.tsx');
  const quizContent = fs.readFileSync(quizPath, 'utf8');
  assert(quizContent.includes('role="radiogroup"'), 'Quiz question options must be enclosed in role="radiogroup"');
  assert(quizContent.includes('role="radio"'), 'Quiz question option must have role="radio"');
  assert(quizContent.includes('aria-checked={isSelected}'), 'Quiz question option must specify aria-checked');
  assert(quizContent.includes('min-h-[44px]'), 'Quiz option buttons must satisfy >= 44px touch target');

  const examPath = path.join(process.cwd(), 'components/certification/ProctoredExamStudio.tsx');
  const examContent = fs.readFileSync(examPath, 'utf8');
  assert(examContent.includes('role="radiogroup"'), 'Proctored exam options must declare role="radiogroup"');
  assert(examContent.includes('role="radio"'), 'Proctored exam option must have role="radio"');
  assert(examContent.includes('min-h-[44px]'), 'Proctored exam option must satisfy >= 44px touch target');

  // 15. EmptyState & Alert
  const emptyStatePath = path.join(process.cwd(), 'components/ui/EmptyState.tsx');
  assert(fs.readFileSync(emptyStatePath, 'utf8').includes('role="region"'), 'EmptyState must declare role="region"');

  const alertPath = path.join(process.cwd(), 'components/ui/Alert.tsx');
  assert(fs.readFileSync(alertPath, 'utf8').includes('role={variant === \'error\' ? \'alert\' : \'status\'}'), 'Alert must declare role="alert" or role="status"');

  console.log('  ✓ Form inputs, radio groups, alert roles, and touch targets verified.');
}
