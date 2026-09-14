# Drop K Engineering Report: Performance & PDF Engine Optimization (PERF-001)

**Drop Identifier:** Drop K  
**Related Audit Finding:** PERF-001  
**Severity:** P2  
**Status:** VERIFIED FIXED  
**Date:** 2026-09-14  

---

## 1. Executive Summary
During initial performance and bundle analysis of the NetVision platform, several code-splitting and asset management bottlenecks were detected:
1. **Three.js Synchronous Inclusion on Homepage**: The landing page `HeroSection` imported `NetworkCanvas` synchronously. As a result, the Three.js 3D rendering engine and shader bundle was compiled into the initial `/` route bundle, inflating initial First Load JS.
2. **Heavy Modal Studios Loaded on Initial Route Evaluation**: Secondary tools and modal studios (`PdfReportStudio`, `MultimodalDiagramParser`, `UniversalChatHistoryImporter`, `NetworkBufferPhysicsVisualizer`, `AiDiagnosticCopilot`, `TopologyTemplatesModal`) were statically imported on `/simulations` and `/sandbox`, forcing users to download visual studios before clicking to open them.
3. **PDF Export Memory & DOM Management**: In `vectorPdfExportEngine.ts`, dynamically created anchor elements were triggered without proper DOM lifecycle mounting/unmounting and immediate URL revocation caused occasional race conditions during asynchronous browser downloads.
4. **Air-Gapped / Offline Font Resilience**: `VectorPdfGenerator` relied on remote Google Fonts `@import` rules without complete native system fallback font stacks.

Drop K resolves all four performance and asset reliability findings.

---

## 2. Root Cause Analysis
- **`HeroSection.tsx`**: Static import `import { NetworkCanvas } from '../3d/NetworkCanvas'` blocked Next.js chunk splitting, coupling Three.js with initial HTML hydration.
- **`app/simulations/page.tsx` & `app/sandbox/page.tsx`**: Statically imported large interactive components (`PdfReportStudio`, `TopologyTemplatesModal`, etc.) that are only rendered when modal boolean states (`showPdfStudio`, `showTemplates`) are toggled.
- **`lib/vectorPdfExportEngine.ts`**: Lacked `document.body.appendChild` / `removeChild` lifecycle hooks and delayed `URL.revokeObjectURL` timing.
- **`lib/pdfGenerator.ts`**: Omitted standard platform system fallback fonts in print CSS rules.

---

## 3. Implementation Details

### A. Dynamic Lazy Loading of 3D WebGL Mesh (`frontend/components/landing/HeroSection.tsx`)
Replaced synchronous import with `next/dynamic` and a lightweight loading skeleton:
```tsx
const NetworkCanvas = dynamic(
  () => import('../3d/NetworkCanvas').then((mod) => mod.NetworkCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/40 text-xs font-mono text-zinc-500 gap-2">
        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
        <span>Initializing 3D WebGL Topology...</span>
      </div>
    ),
  }
);
```

### B. On-Demand Modal Code-Splitting (`frontend/app/simulations/page.tsx` & `frontend/app/sandbox/page.tsx`)
Applied `next/dynamic` to all on-demand modal studios:
- `PdfReportStudio` (both routes)
- `MultimodalDiagramParser` (both routes)
- `UniversalChatHistoryImporter` (both routes)
- `NetworkBufferPhysicsVisualizer` (`/sandbox`)
- `AiDiagnosticCopilot` (`/sandbox`)
- `TopologyTemplatesModal` (`/sandbox`)

### C. Hardened Vector PDF Export Engine (`frontend/lib/vectorPdfExportEngine.ts`)
Updated `downloadSvgAsPdf` to append the hidden anchor to `document.body`, trigger download, and clean up both the DOM node and blob URL with a 1500ms safety window:
```typescript
public static downloadSvgAsPdf(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  a.style.display = 'none';
  if (typeof document !== 'undefined' && document.body) {
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) {
        a.parentNode.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }, 1500);
  } else {
    a.click();
    URL.revokeObjectURL(url);
  }
}
```

### D. Offline & System Font Fallbacks in PDF Generator (`frontend/lib/pdfGenerator.ts`)
Hardened `printCertificate` and `printLabReport` with resilient system fallback font stacks:
`font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;`

---

## 4. Verification & Automated Test Suite

A dedicated automated test suite was implemented in `frontend/__tests__/dropKPerformanceAndPdf.test.ts` and integrated into `frontend/__tests__/runAllTests.ts`:

1. **Test 1: Dynamic import of NetworkCanvas in HeroSection**: Verified `next/dynamic` code splitting with `ssr: false`.
2. **Test 2: Dynamic import of modal studios in Simulations page**: Verified on-demand loading of `PdfReportStudio`, `MultimodalDiagramParser`, and `UniversalChatHistoryImporter`.
3. **Test 3: Dynamic import of heavy visualizers & modals in Sandbox page**: Verified lazy-loading of 4 heavy studio modules.
4. **Test 4: VectorPdfExportEngine DOM lifecycle & memory cleanup**: Verified cross-browser DOM attachment and safe object URL revocation.
5. **Test 5: Resilient font fallbacks in VectorPdfGenerator**: Verified fallback font stacks for offline and print safety.

### Test Execution Results
- `pnpm --filter netvision-frontend test`: **10/10 test suites passed** (100% pass rate).
- `pnpm --filter netvision-frontend typecheck`: **0 errors**.

---

## 5. Ledger Update
Finding **PERF-001** marked as **VERIFIED FIXED** in `docs/audit/post-audit-execution-ledger.md`.
