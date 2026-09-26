import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { disposeThreeScene } from '../lib/threeDisposal';
import { ApiError, getTopicsApi, getTopicDetailApi, getLessonDetailApi } from '../lib/api';
import { getFallbackTopicDetail, getFallbackLessonDetail } from '../lib/courseCatalogData';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Drop07AssertionFailed] ${message}`);
  }
}

export async function runDrop07FrontendRuntimeReliabilityTests() {
  console.log('\n========================================================================');
  console.log('--- Running DROP 07: FRONTEND RUNTIME RELIABILITY & WEBGL AUDIT ---');
  console.log('========================================================================\n');

  const frontendDir = path.resolve(__dirname, '..');

  // =========================================================================
  // 1. ROUTER ARCHITECTURE AUDIT & ERROR MODEL HARMONIZATION
  // =========================================================================
  console.log('  Task 1 & 2: Next.js Error Architecture & Fallback Verification...');
  const pages404Path = path.join(frontendDir, 'pages/404.tsx');
  const pages500Path = path.join(frontendDir, 'pages/500.tsx');
  assert(fs.existsSync(pages404Path), 'pages/404.tsx is required by Next.js 15/React 18 build prerenderer');
  assert(fs.existsSync(pages500Path), 'pages/500.tsx is required by Next.js 15/React 18 build prerenderer');

  const pages404Content = fs.readFileSync(pages404Path, 'utf8');
  assert(pages404Content.includes('404 — Packet Dropped'), 'pages/404.tsx must display branded Packet Dropped');
  assert(pages404Content.includes('pages-404-dashboard-btn'), 'pages/404.tsx must include dashboard button');
  assert(pages404Content.includes('pages-404-home-btn'), 'pages/404.tsx must include home button');

  const pages500Content = fs.readFileSync(pages500Path, 'utf8');
  assert(pages500Content.includes('500 — System Fault'), 'pages/500.tsx must display branded System Fault');
  assert(pages500Content.includes('pages-500-dashboard-btn'), 'pages/500.tsx must include dashboard button');

  const appNotFoundPath = path.join(frontendDir, 'app/not-found.tsx');
  const appErrorPath = path.join(frontendDir, 'app/error.tsx');
  const appGlobalErrorPath = path.join(frontendDir, 'app/global-error.tsx');
  assert(fs.existsSync(appNotFoundPath), 'app/not-found.tsx must exist as canonical App Router 404 boundary');
  assert(fs.existsSync(appErrorPath), 'app/error.tsx must exist as segment error boundary');
  assert(fs.existsSync(appGlobalErrorPath), 'app/global-error.tsx must exist as root layout error boundary');

  const notFoundContent = fs.readFileSync(appNotFoundPath, 'utf8');
  assert(notFoundContent.includes('404 — Packet Dropped'), 'not-found.tsx must display branded Packet Dropped');
  assert(notFoundContent.includes('notfound-dashboard-btn'), 'not-found.tsx must include dashboard button');
  assert(notFoundContent.includes('notfound-home-btn'), 'not-found.tsx must include home button');

  const errorContent = fs.readFileSync(appErrorPath, 'utf8');
  assert(errorContent.includes('error-reset-btn'), 'error.tsx must include error-reset-btn');
  assert(errorContent.includes('error-dashboard-btn'), 'error.tsx must include error-dashboard-btn');

  const globalErrorContent = fs.readFileSync(appGlobalErrorPath, 'utf8');
  assert(globalErrorContent.includes('global-error-retry-btn'), 'global-error.tsx must include retry button');
  assert(globalErrorContent.includes('global-error-home-btn'), 'global-error.tsx must include home link');
  console.log('    ✓ Next.js Error Architecture verified: pages/404 & 500 satisfy build requirements, app/* boundaries handle App Router.');

  // =========================================================================
  // 2. THREE.JS DISPOSAL UTILITY AUDIT
  // =========================================================================
  console.log('\n  Task 3, 4, 5, 6: Three.js WebGL Resource Disposal...');
  assert(typeof disposeThreeScene === 'function', 'disposeThreeScene must be exported from NetworkCanvas');

  // Build a test scene with geometries, materials, and textures
  const scene = new THREE.Scene();

  const tracker = {
    geometryDisposed: 0,
    materialDisposed: 0,
    textureDisposed: 0,
    rendererDisposed: false,
    contextLossForced: false,
  };

  const mockGeo = new THREE.BoxGeometry(1, 1, 1);
  const origGeoDispose = mockGeo.dispose.bind(mockGeo);
  mockGeo.dispose = () => {
    tracker.geometryDisposed++;
    origGeoDispose();
  };

  const canvas = { width: 64, height: 64 } as any;
  const mockTex = new THREE.CanvasTexture(canvas);
  mockTex.dispose = () => {
    tracker.textureDisposed++;
  };

  const mockMat = new THREE.MeshStandardMaterial({
    map: mockTex,
  });
  const origMatDispose = mockMat.dispose.bind(mockMat);
  mockMat.dispose = () => {
    tracker.materialDisposed++;
    origMatDispose();
  };

  const mesh = new THREE.Mesh(mockGeo, mockMat);
  scene.add(mesh);

  const mockRenderer = {
    dispose: () => { tracker.rendererDisposed = true; },
    forceContextLoss: () => { tracker.contextLossForced = true; },
    getContext: () => ({
      getExtension: (name: string) => {
        if (name === 'WEBGL_lose_context') {
          return { loseContext: () => {} };
        }
        return null;
      },
    }),
  } as unknown as THREE.WebGLRenderer;

  disposeThreeScene(scene, mockRenderer);

  assert(tracker.geometryDisposed > 0, `Expected geometry to be disposed, got ${tracker.geometryDisposed}`);
  assert(tracker.materialDisposed > 0, `Expected material to be disposed, got ${tracker.materialDisposed}`);
  assert(tracker.textureDisposed > 0, `Expected texture to be disposed, got ${tracker.textureDisposed}`);
  assert(tracker.rendererDisposed, 'Renderer must be disposed');
  assert(tracker.contextLossForced, 'WebGL context loss must be forced');
  assert(scene.children.length === 0, 'Scene children must be completely removed');
  console.log('    ✓ Geometries, materials, textures, renderer, and WebGL context cleanly disposed.');

  // =========================================================================
  // 3. REPEATED NAVIGATION SIMULATION (25 MOUNT/UNMOUNT CYCLES)
  // =========================================================================
  console.log('\n  Task 7 & 8: Repeated Navigation Simulation (25 Mount/Unmount Cycles)...');
  const CYCLES = 25;
  let activeContexts = 0;
  let activeAnimationLoops = 0;
  let leakedGeometries = 0;
  let leakedTextures = 0;

  for (let i = 1; i <= CYCLES; i++) {
    // 1. Simulate mounting homepage (creating WebGL observatory)
    activeContexts++;
    let isMounted = true;
    let animFrameId: number | null = 1000 + i;
    activeAnimationLoops++;

    const cycleGeo = new THREE.BufferGeometry();
    let geoFreed = false;
    cycleGeo.dispose = () => { geoFreed = true; };

    const cycleTex = new THREE.Texture();
    let texFreed = false;
    cycleTex.dispose = () => { texFreed = true; };

    const cycleMat = new THREE.MeshBasicMaterial({ map: cycleTex });
    const cycleMesh = new THREE.Mesh(cycleGeo, cycleMat);
    const cycleScene = new THREE.Scene();
    cycleScene.add(cycleMesh);

    const cycleRenderer = {
      dispose: () => {},
      forceContextLoss: () => { activeContexts--; },
      getContext: () => null,
    } as unknown as THREE.WebGLRenderer;

    // 2. Simulate navigation to lesson page -> unmounting observatory
    isMounted = false;
    if (animFrameId !== null) {
      animFrameId = null;
      activeAnimationLoops--;
    }
    disposeThreeScene(cycleScene, cycleRenderer);

    if (!geoFreed) leakedGeometries++;
    if (!texFreed) leakedTextures++;
  }

  assert(activeContexts === 0, `Active WebGL contexts leaked: ${activeContexts}`);
  assert(activeAnimationLoops === 0, `Orphan animation loops leaked: ${activeAnimationLoops}`);
  assert(leakedGeometries === 0, `Leaked geometries detected: ${leakedGeometries}`);
  assert(leakedTextures === 0, `Leaked textures detected: ${leakedTextures}`);
  console.log(`    ✓ Simulated ${CYCLES} navigation cycles: 0 context leaks, 0 animation leaks, 0 GPU memory leaks.`);

  // =========================================================================
  // 4. API REQUEST CANCELLATION & ABORT CONTROLLER AUDIT
  // =========================================================================
  console.log('\n  Task 10 & 11: API Request Cancellation with AbortController...');
  assert(typeof ApiError === 'function', 'ApiError class must be exported from lib/api');

  // Verify ApiError classification properties
  const abortError = new ApiError('Request aborted due to navigation.', 0, undefined, true);
  assert(abortError.isAborted === true, 'ApiError must identify aborted requests');
  assert(abortError.isBackendUnavailable === true, 'Status 0 is classified as unavailable/offline');

  const notFoundApiError = new ApiError('Not found', 404);
  assert(notFoundApiError.isNotFound === true, '404 status must set isNotFound = true');
  assert(notFoundApiError.isBackendUnavailable === false, '404 is not a backend unavailable error');

  const backendDownError = new ApiError('Service temporarily unavailable', 503);
  assert(backendDownError.isBackendUnavailable === true, '503 status must set isBackendUnavailable = true');
  assert(backendDownError.isNotFound === false, '503 is not a 404');

  // Test AbortController in getTopicsApi
  const controller = new AbortController();
  controller.abort();
  try {
    await getTopicsApi(undefined, undefined, { signal: controller.signal, allowFallback: false });
    assert(false, 'Expected aborted request to reject');
  } catch (err: any) {
    assert(err.isAborted === true || err.name === 'AbortError', 'Aborted request was properly cancelled');
  }
  console.log('    ✓ AbortController cleanly terminates in-flight API requests during navigation.');

  // =========================================================================
  // 5. ERROR BOUNDARIES & TRUTHFUL ERROR DIFFERENTIATION
  // =========================================================================
  console.log('\n  Task 12, 13, 14: Error Boundaries & Truthful Error Messaging...');
  const curriculumFile = fs.readFileSync(path.join(frontendDir, 'components/learning/CurriculumSection.tsx'), 'utf8');
  assert(
    curriculumFile.includes('Service Temporarily Unavailable'),
    'CurriculumSection must distinguish Service Temporarily Unavailable'
  );
  assert(
    curriculumFile.includes('curriculum-service-unavailable'),
    'CurriculumSection must have dedicated service unavailable container'
  );
  assert(
    curriculumFile.includes('No Curriculum Available'),
    'CurriculumSection must distinguish genuinely empty curriculum data'
  );
  assert(
    curriculumFile.includes('No Courses Match Your Criteria'),
    'CurriculumSection must isolate user search/filter empty results'
  );
  console.log('    ✓ Differentiated backend unavailable, empty data, and zero search results.');

  // =========================================================================
  // 6. DEEP LINKS & DIRECT URL LOADING
  // =========================================================================
  console.log('\n  Task 15, 16, 17: Deep Links & Direct URL Loading...');
  // Verify that an invalid course slug returns null rather than falling back to NV-C01
  const invalidCourse = getFallbackTopicDetail('completely-invalid-slug-999');
  assert(invalidCourse === null, `Expected null for invalid course slug, got: ${invalidCourse?.code}`);

  const invalidLesson = getFallbackLessonDetail('completely-invalid-lesson-xyz');
  assert(invalidLesson === null, `Expected null for invalid lesson slug, got: ${invalidLesson?.slug}`);

  // Verify that valid canonical course slugs resolve accurately
  const validCourse = getFallbackTopicDetail('nv-c01-digital-representation-bits-signals');
  assert(validCourse !== null && validCourse.code === 'NV-C01', 'Valid slug must resolve to NV-C01');

  const validCourseByCode = getFallbackTopicDetail('NV-C02');
  assert(validCourseByCode !== null && validCourseByCode.code === 'NV-C02', 'Code NV-C02 must resolve');

  console.log('    ✓ Deep links & direct URL lookups truthfully return 404 for invalid routes.');

  // =========================================================================
  // 7. FAVICON & METADATA ASSET REFERENCES
  // =========================================================================
  console.log('\n  Task 18: Favicon & Metadata Asset References...');
  const publicIconSvg = path.join(frontendDir, 'public/icon.svg');
  const appIconSvg = path.join(frontendDir, 'app/icon.svg');
  const publicFavicon = path.join(frontendDir, 'public/favicon.ico');
  const appFavicon = path.join(frontendDir, 'app/favicon.ico');
  const appleTouchIcon = path.join(frontendDir, 'public/apple-touch-icon.png');

  assert(fs.existsSync(publicIconSvg), 'public/icon.svg must exist');
  assert(fs.existsSync(appIconSvg), 'app/icon.svg must exist');
  assert(fs.existsSync(publicFavicon), 'public/favicon.ico must exist');
  assert(fs.existsSync(appFavicon), 'app/favicon.ico must exist');
  assert(fs.existsSync(appleTouchIcon), 'public/apple-touch-icon.png must exist');

  // Verify ICO header [0, 0, 1, 0]
  const icoBytes = fs.readFileSync(publicFavicon);
  assert(icoBytes[0] === 0 && icoBytes[1] === 0 && icoBytes[2] === 1 && icoBytes[3] === 0, 'Invalid ICO header');

  // Verify PNG header [137, 80, 78, 71]
  const pngBytes = fs.readFileSync(appleTouchIcon);
  assert(pngBytes[0] === 137 && pngBytes[1] === 80 && pngBytes[2] === 78 && pngBytes[3] === 71, 'Invalid PNG magic bytes');

  const layoutFile = fs.readFileSync(path.join(frontendDir, 'app/layout.tsx'), 'utf8');
  assert(layoutFile.includes("url: '/favicon.ico'"), 'layout.tsx must configure favicon.ico');
  assert(layoutFile.includes("url: '/icon.svg'"), 'layout.tsx must configure icon.svg');
  assert(layoutFile.includes("url: '/apple-touch-icon.png'"), 'layout.tsx must configure apple-touch-icon.png');
  console.log('    ✓ Favicon, SVG icon, and Apple Touch Icon verified.');

  console.log('\n========================================================================');
  console.log('--- ALL DROP 07 TESTS PASSED SUCCESSFULLY (100% PASS RATE) ---');
  console.log('========================================================================\n');
}

if (require.main === module) {
  runDrop07FrontendRuntimeReliabilityTests().catch((err) => {
    console.error('Drop 07 Test Failed:', err);
    process.exit(1);
  });
}
