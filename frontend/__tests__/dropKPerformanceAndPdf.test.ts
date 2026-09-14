/**
 * Drop K: Performance & PDF Engine Optimization Verification Suite
 * Tests PERF-001:
 * - Dynamic lazy-loading of 3D WebGL meshes (NetworkCanvas) on landing hero.
 * - Dynamic code-splitting for heavy modal studios (PdfReportStudio, MultimodalDiagramParser) on /simulations and /sandbox.
 * - Safe DOM lifecycle and object URL revocation in vector PDF export engine.
 * - Resilient offline font fallbacks in Vector PDF generator.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

export async function runDropKTests() {
  console.log('--- Running Drop K: Performance & PDF Engine Optimization Tests ---');

  const frontendDir = path.resolve(__dirname, '..');

  // 1. DYNAMIC LAZY-LOADING OF 3D NETWORK CANVAS ON HERO
  console.log('  Testing 1: Dynamic import of NetworkCanvas in HeroSection...');
  const heroPath = path.join(frontendDir, 'components/landing/HeroSection.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');

  assert(
    heroContent.includes("dynamic("),
    'HeroSection must use next/dynamic for code-splitting heavy modules'
  );
  assert(
    heroContent.includes("import('../3d/NetworkCanvas')"),
    'HeroSection must dynamically import ../3d/NetworkCanvas'
  );
  assert(
    heroContent.includes('ssr: false'),
    'NetworkCanvas dynamic import must disable SSR to avoid server WebGL hydration mismatch'
  );
  assert(
    !heroContent.includes("import { NetworkCanvas } from '../3d/NetworkCanvas'"),
    'HeroSection must not synchronously import NetworkCanvas'
  );

  // 2. DYNAMIC CODE-SPLITTING IN SIMULATIONS PAGE
  console.log('  Testing 2: Dynamic import of modal studios in Simulations page...');
  const simPagePath = path.join(frontendDir, 'app/simulations/page.tsx');
  const simContent = fs.readFileSync(simPagePath, 'utf-8');

  assert(
    simContent.includes("import('@/components/ui/PdfReportStudio')"),
    'Simulations page must dynamically import PdfReportStudio'
  );
  assert(
    simContent.includes("import('@/components/simulation/MultimodalDiagramParser')"),
    'Simulations page must dynamically import MultimodalDiagramParser'
  );
  assert(
    simContent.includes("import('@/components/learning/UniversalChatHistoryImporter')"),
    'Simulations page must dynamically import UniversalChatHistoryImporter'
  );
  assert(
    !simContent.includes("import { PdfReportStudio } from '@/components/ui/PdfReportStudio'"),
    'Simulations page must not synchronously import PdfReportStudio'
  );

  // 3. DYNAMIC CODE-SPLITTING IN SANDBOX PAGE
  console.log('  Testing 3: Dynamic import of heavy visualizers & modals in Sandbox page...');
  const sandboxPagePath = path.join(frontendDir, 'app/sandbox/page.tsx');
  const sandboxContent = fs.readFileSync(sandboxPagePath, 'utf-8');

  assert(
    sandboxContent.includes("import('@/components/ui/PdfReportStudio')"),
    'Sandbox page must dynamically import PdfReportStudio'
  );
  assert(
    sandboxContent.includes("import('@/components/simulation/NetworkBufferPhysicsVisualizer')"),
    'Sandbox page must dynamically import NetworkBufferPhysicsVisualizer'
  );
  assert(
    sandboxContent.includes("import('@/components/learning/AiDiagnosticCopilot')"),
    'Sandbox page must dynamically import AiDiagnosticCopilot'
  );
  assert(
    sandboxContent.includes("import('@/components/sandbox/TopologyTemplatesModal')"),
    'Sandbox page must dynamically import TopologyTemplatesModal'
  );

  // 4. VECTOR PDF EXPORT DOM LIFECYCLE & REVOCATION
  console.log('  Testing 4: VectorPdfExportEngine DOM lifecycle & memory cleanup...');
  const vectorPdfPath = path.join(frontendDir, 'lib/vectorPdfExportEngine.ts');
  const vectorPdfContent = fs.readFileSync(vectorPdfPath, 'utf-8');

  assert(
    vectorPdfContent.includes('document.body.appendChild(a)'),
    'VectorPdfExportEngine must append anchor element to document.body for cross-browser safety'
  );
  assert(
    vectorPdfContent.includes('removeChild(a)'),
    'VectorPdfExportEngine must clean up anchor element from document.body'
  );
  assert(
    vectorPdfContent.includes('URL.revokeObjectURL(url)'),
    'VectorPdfExportEngine must revoke object URL to prevent memory leaks'
  );

  // 5. RESILIENT FONT FALLBACKS IN PDF GENERATOR
  console.log('  Testing 5: Resilient font fallbacks in VectorPdfGenerator...');
  const pdfGenPath = path.join(frontendDir, 'lib/pdfGenerator.ts');
  const pdfGenContent = fs.readFileSync(pdfGenPath, 'utf-8');

  assert(
    pdfGenContent.includes('-apple-system') && pdfGenContent.includes('BlinkMacSystemFont'),
    'VectorPdfGenerator must include comprehensive system font fallbacks for air-gapped/offline printing'
  );

  console.log('  ✓ Drop K Performance & PDF Engine Tests PASSED!\n');
}

if (require.main === module) {
  runDropKTests().catch((err) => {
    console.error('Drop K tests failed:', err);
    process.exit(1);
  });
}
