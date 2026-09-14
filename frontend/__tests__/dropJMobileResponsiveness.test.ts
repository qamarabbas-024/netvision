import * as fs from 'fs';
import * as path from 'path';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[RESPONSIVE ASSERTION FAILED]: ${msg}`);
  }
}

export function runDropJMobileResponsivenessTests() {
  console.log('--- Running Drop J: Mobile & Small Viewport (320px–375px) Hardening Tests ---');

  // 1. Mobile Sidebar Drawer Constraints
  console.log('  Testing 1: Mobile sidebar drawer viewport boundary constraints...');
  const sidebarPath = path.resolve(__dirname, '../components/ui/Sidebar.tsx');
  const sidebarSource = fs.readFileSync(sidebarPath, 'utf8');

  assert(
    sidebarSource.includes('max-w-[85vw]'),
    'Mobile sidebar drawer must enforce max-w-[85vw] to prevent 320px overflow'
  );
  assert(
    sidebarSource.includes('overflow-y-auto'),
    'Mobile sidebar drawer navigation must be vertically scrollable'
  );

  // 2. Topbar Action Button Responsive Clamping
  console.log('  Testing 2: Topbar action button responsive clamping for mobile headers...');
  const topbarPath = path.resolve(__dirname, '../components/ui/Topbar.tsx');
  const topbarSource = fs.readFileSync(topbarPath, 'utf8');

  assert(
    topbarSource.includes('className="hidden sm:block"') || topbarSource.includes('hidden sm:block'),
    'Workbench action link must be hidden on extra-small mobile viewports (<640px)'
  );
  assert(
    topbarSource.includes('hidden sm:flex w-8 h-8 rounded-lg bg-[#14151a]'),
    'Auxiliary Theme Studio button must be hidden on extra-small mobile viewports'
  );
  assert(
    topbarSource.includes('hidden sm:flex w-8 h-8 rounded-lg bg-[#14151a] border border-[#2a2e39] hover:border-zinc-500'),
    'Notifications button must be hidden on extra-small mobile viewports'
  );

  // 3. Modal Dialog Viewport Clamping
  console.log('  Testing 3: Modal dialog responsive height and width bounds...');
  const modalPath = path.resolve(__dirname, '../components/ui/Modal.tsx');
  const modalSource = fs.readFileSync(modalPath, 'utf8');

  assert(modalSource.includes('max-h-[90vh]'), 'Modal must clamp maximum height to 90vh');
  assert(modalSource.includes('overflow-y-auto'), 'Modal must allow vertical scrolling when content exceeds height');

  // 4. Code Block & Preformatted Horizontal Scroll Protection
  console.log('  Testing 4: CodeBlock preformatted overflow protection...');
  const codeBlockPath = path.resolve(__dirname, '../components/ui/CodeBlock.tsx');
  const codeBlockSource = fs.readFileSync(codeBlockPath, 'utf8');

  assert(
    codeBlockSource.includes('overflow-x-auto'),
    'CodeBlock must define overflow-x-auto to isolate long CLI lines'
  );

  // 5. Credential Verification Page Word Breaking
  console.log('  Testing 5: Credential verification ID word breaking...');
  const verifyPath = path.resolve(__dirname, '../app/certificates/verify/[credentialId]/page.tsx');
  const verifySource = fs.readFileSync(verifyPath, 'utf8');

  assert(
    verifySource.includes('break-all'),
    'Credential verification IDs must use break-all to prevent 320px viewport overflow'
  );

  console.log('  ✓ Drop J Mobile & Responsive Hardening Tests PASSED!\n');
}
