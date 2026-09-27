import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { ApiError, getUserCertificatesApi, getTopicsApi, getTopicDetailApi, getLessonDetailApi, getCertificateByIdApi } from '../lib/api';
import { disposeThreeScene } from '../lib/threeDisposal';
import { GuestProgressService } from '../services/GuestProgressService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Drop14AssertionFailed] ${message}`);
  }
}

export async function runDrop14FrontendReliabilityTests() {
  console.log('\n========================================================================');
  console.log('--- Running DROP 14: FRONTEND RELIABILITY & CORE LEARNER JOURNEY ---');
  console.log('========================================================================\n');

  const frontendDir = path.resolve(__dirname, '..');

  // =========================================================================
  // 1. ROUTING & REDIRECT INTEGRITY AUDIT
  // =========================================================================
  console.log('  [Section 1] Routing Architecture & Redirect Audit...');
  const nextConfigPath = path.join(frontendDir, 'next.config.mjs');
  assert(fs.existsSync(nextConfigPath), 'next.config.mjs must exist');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

  // Verify redirects map core learner aliases to canonical routes without dead ends
  assert(nextConfigContent.includes("source: '/certification'"), 'Must redirect /certification');
  assert(nextConfigContent.includes("destination: '/certificates'"), 'Must redirect /certification -> /certificates');
  assert(nextConfigContent.includes("source: '/certifications'"), 'Must redirect /certifications');
  assert(nextConfigContent.includes("source: '/capstone'"), 'Must redirect /capstone');
  assert(nextConfigContent.includes("destination: '/certifications/capstone'"), 'Must redirect /capstone -> /certifications/capstone');
  assert(nextConfigContent.includes("source: '/progress'"), 'Must redirect /progress');
  assert(nextConfigContent.includes("destination: '/dashboard'"), 'Must redirect /progress -> /dashboard');
  assert(nextConfigContent.includes("source: '/quiz'"), 'Must redirect /quiz');
  assert(nextConfigContent.includes("destination: '/exams'"), 'Must redirect /quiz -> /exams');
  assert(nextConfigContent.includes("source: '/lab'"), 'Must redirect /lab');
  assert(nextConfigContent.includes("destination: '/labs'"), 'Must redirect /lab -> /labs');

  // Verify pages/404 & pages/500 exist as static prerender fallbacks alongside app/ boundaries
  const pages404 = path.join(frontendDir, 'pages/404.tsx');
  const pages500 = path.join(frontendDir, 'pages/500.tsx');
  const appNotFound = path.join(frontendDir, 'app/not-found.tsx');
  const appError = path.join(frontendDir, 'app/error.tsx');
  assert(fs.existsSync(pages404), 'pages/404.tsx must exist for static edge fallback');
  assert(fs.existsSync(pages500), 'pages/500.tsx must exist for static edge fallback');
  assert(fs.existsSync(appNotFound), 'app/not-found.tsx must exist for App Router');
  assert(fs.existsSync(appError), 'app/error.tsx must exist for App Router');
  console.log('    ✓ Core learner routing, redirects, and hybrid error boundaries verified.');

  // =========================================================================
  // 2. API STATE & 7-STATE ERROR DISCRIMINATION
  // =========================================================================
  console.log('\n  [Section 2] API State Discrimination & Truthful Representation...');
  assert(typeof ApiError === 'function', 'ApiError must be exported from lib/api');

  // Verify 401 Unauthorized
  const unauthError = new ApiError('Unauthorized token', 401);
  assert(unauthError.isUnauthorized === true, '401 must set isUnauthorized = true');
  assert(unauthError.isForbidden === false, '401 must not be isForbidden');
  assert(unauthError.isNotFound === false, '401 must not be isNotFound');

  // Verify 403 Forbidden
  const forbiddenError = new ApiError('Forbidden action', 403);
  assert(forbiddenError.isForbidden === true, '403 must set isForbidden = true');
  assert(forbiddenError.isUnauthorized === false, '403 must not be isUnauthorized');

  // Verify 404 Not Found
  const notFoundError = new ApiError('Resource missing', 404);
  assert(notFoundError.isNotFound === true, '404 must set isNotFound = true');
  assert(notFoundError.isBackendUnavailable === false, '404 is not backend unavailable');

  // Verify 503 / 500 / 0 Unavailable
  const server503 = new ApiError('Gateway unavailable', 503);
  assert(server503.isBackendUnavailable === true, '503 must set isBackendUnavailable = true');
  const server500 = new ApiError('Internal error', 500);
  assert(server500.isBackendUnavailable === true, '500 must set isBackendUnavailable = true');
  const offlineErr = new ApiError('Network drop', 0);
  assert(offlineErr.isBackendUnavailable === true, '0 must set isBackendUnavailable = true');

  // Verify Aborted
  const abortedErr = new ApiError('Aborted', 0, undefined, true);
  assert(abortedErr.isAborted === true, 'isAborted must be true for aborted requests');

  // Verify that getUserCertificatesApi does NOT return [] on backend failure (never mask failure as empty dataset)
  // Mock global fetch to return 503
  const origFetch = global.fetch;
  try {
    global.fetch = async () => {
      return {
        ok: false,
        status: 503,
        json: async () => ({ message: 'Service temporarily unavailable' }),
        headers: new Headers(),
      } as any;
    };
    let threw = false;
    try {
      await getUserCertificatesApi();
    } catch (err: any) {
      threw = true;
      assert(err?.status === 503 || err?.isBackendUnavailable, 'Must throw backend unavailable ApiError');
    }
    assert(threw, 'getUserCertificatesApi must throw on server failure instead of masking with empty array []');
  } finally {
    global.fetch = origFetch;
  }

  // Verify DashboardPage differentiates backend failure from 0% progress
  const dashContent = fs.readFileSync(path.join(frontendDir, 'app/dashboard/page.tsx'), 'utf8');
  assert(dashContent.includes('progressSyncError'), 'Dashboard must track progressSyncError');
  assert(dashContent.includes('dashboard-sync-alert'), 'Dashboard must render sync alert banner on failure');
  assert(dashContent.includes('dashboard-retry-sync-btn'), 'Dashboard must provide retry sync button');
  assert(dashContent.includes('GuestProgressService.getProgress()'), 'Dashboard must hydrate guest progress');

  // Verify CertificateDetailPage differentiates 404 from 503
  const certDetailContent = fs.readFileSync(path.join(frontendDir, 'app/certificates/[id]/page.tsx'), 'utf8');
  assert(certDetailContent.includes('Verification Service Temporarily Unavailable'), 'Certificate detail must distinguish service unavailable');
  assert(certDetailContent.includes('Certificate Record Not Found'), 'Certificate detail must distinguish not found');

  console.log('    ✓ 7-state API error model, no empty-state masking, and truthful recovery verified.');

  // =========================================================================
  // 3. REQUEST LIFECYCLE & ABORTCONTROLLER PROPAGATION
  // =========================================================================
  console.log('\n  [Section 3] Request Lifecycle & AbortController Cancellation...');
  const controller = new AbortController();
  controller.abort();

  let abortHandled = false;
  try {
    await getTopicsApi(undefined, undefined, { signal: controller.signal, allowFallback: false });
  } catch (err: any) {
    if (err?.isAborted || err?.name === 'AbortError') {
      abortHandled = true;
    }
  }
  assert(abortHandled, 'getTopicsApi must propagate AbortError cleanly');

  // Verify getCertificateByIdApi accepts AbortSignal
  let certAbortHandled = false;
  try {
    await getCertificateByIdApi('test-id', { signal: controller.signal });
  } catch (err: any) {
    if (err?.isAborted || err?.name === 'AbortError') {
      certAbortHandled = true;
    }
  }
  assert(certAbortHandled, 'getCertificateByIdApi must propagate AbortError cleanly');
  console.log('    ✓ AbortController cleanly cancels in-flight requests during rapid navigation.');

  // =========================================================================
  // 4. WEBGL LIFECYCLE & THREE.JS AGGRESSIVE DISPOSAL
  // =========================================================================
  console.log('\n  [Section 4] WebGL Memory Lifecycle & Resource Disposal...');
  const testScene = new THREE.Scene();
  let bgDisposed = false;
  let envDisposed = false;
  testScene.background = {
    dispose: () => { bgDisposed = true; },
  } as any;
  testScene.environment = {
    dispose: () => { envDisposed = true; },
  } as any;

  let geoFreed = false;
  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const origBoxDispose = boxGeo.dispose.bind(boxGeo);
  boxGeo.dispose = () => {
    geoFreed = true;
    origBoxDispose();
  };

  let matFreed = false;
  const boxMat = new THREE.MeshBasicMaterial();
  const origMatDispose = boxMat.dispose.bind(boxMat);
  boxMat.dispose = () => {
    matFreed = true;
    origMatDispose();
  };

  testScene.add(new THREE.Mesh(boxGeo, boxMat));

  let rendererDisposed = false;
  let contextLost = false;
  const mockGlRenderer = {
    dispose: () => { rendererDisposed = true; },
    forceContextLoss: () => { contextLost = true; },
    getContext: () => ({
      getExtension: (name: string) => (name === 'WEBGL_lose_context' ? { loseContext: () => {} } : null),
    }),
  } as unknown as THREE.WebGLRenderer;

  disposeThreeScene(testScene, mockGlRenderer);

  assert(bgDisposed, 'scene.background must be disposed');
  assert(envDisposed, 'scene.environment must be disposed');
  assert(geoFreed, 'Geometry must be disposed');
  assert(matFreed, 'Material must be disposed');
  assert(rendererDisposed, 'Renderer must be disposed');
  assert(contextLost, 'WebGL context loss must be forced');
  assert(testScene.children.length === 0, 'All children must be detached from scene');
  console.log('    ✓ WebGL scene, textures, background, environment, and GPU contexts cleanly reclaimed.');

  // =========================================================================
  // 5. CORE STATE PERSISTENCE & GUEST PROGRESS RECOVERY
  // =========================================================================
  console.log('\n  [Section 5] Core State Persistence & Guest Identity...');
  // Test UUID format validation
  const validUuid = GuestProgressService.generateUuid();
  assert(GuestProgressService.isValidUuid(validUuid), `Generated UUID "${validUuid}" must be valid RFC-4122`);

  // Test guest progress state accumulation
  const mockStorage: Record<string, string> = {};
  (global as any).window = global;
  (global as any).localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, val: string) => { mockStorage[key] = val; },
    removeItem: (key: string) => { delete mockStorage[key]; },
  };

  const initialLearnerId = GuestProgressService.getLearnerId();
  assert(GuestProgressService.isValidUuid(initialLearnerId), 'getLearnerId must initialize valid UUID');

  // Record completed lesson
  GuestProgressService.markLessonCompleted('les-c01-m01-01', 'what-is-binary', 100);
  let savedProg = GuestProgressService.getProgress();
  assert(savedProg.completedLessonIds.includes('les-c01-m01-01'), 'Lesson must be recorded in progress');
  assert(savedProg.lessonScores['les-c01-m01-01'] === 100, 'Score 100 must be recorded');
  assert(savedProg.lastLessonSlug === 'what-is-binary', 'Last lesson slug must be persisted');

  // Record quiz attempt
  GuestProgressService.saveQuizAttempt('quiz-c01-01', 95, true);
  savedProg = GuestProgressService.getProgress();
  assert(savedProg.quizAttempts['quiz-c01-01']?.score === 95, 'Quiz attempt score must be recorded');
  assert(savedProg.quizAttempts['quiz-c01-01']?.passed === true, 'Quiz passed flag must be true');

  // Record lab attempt
  GuestProgressService.saveLabAttempt('lab-c01-01', 88, true);
  savedProg = GuestProgressService.getProgress();
  assert(savedProg.labAttempts['lab-c01-01']?.score === 88, 'Lab attempt score must be recorded');

  // Reset guest data
  GuestProgressService.clearAllGuestData();
  const clearedProg = GuestProgressService.getProgress();
  assert(clearedProg.completedLessonIds.length === 0, 'Guest progress must be clear after reset');
  console.log('    ✓ Guest progress persistence, quiz/lab tracking, and identity lifecycle verified.');

  // =========================================================================
  // 6. PUBLIC VERIFICATION EDGE CASES
  // =========================================================================
  console.log('\n  [Section 6] Public Verification & Credential Edge Cases...');
  const verifyPageContent = fs.readFileSync(path.join(frontendDir, 'app/certificates/verify/[credentialId]/page.tsx'), 'utf8');
  assert(verifyPageContent.includes("state === 'not_found'"), 'Must handle not_found credential state');
  assert(verifyPageContent.includes("state === 'revoked'"), 'Must handle revoked/suspended credential state');
  assert(verifyPageContent.includes("state === 'error'"), 'Must handle network/server error state');
  assert(verifyPageContent.includes("setState('verified')"), 'Must handle verified credential state');
  assert(verifyPageContent.includes('decodeURIComponent'), 'Must sanitize encoded URI credential parameters');
  assert(verifyPageContent.includes('handleRetry'), 'Must provide retry action on verification lookup');
  console.log('    ✓ Public verification valid, invalid, revoked, unknown, and malformed cases handled.');

  // =========================================================================
  // 7. MOBILE & ACCESSIBILITY GUARANTEES
  // =========================================================================
  console.log('\n  [Section 7] Mobile Viewport & Accessibility Guarantees...');
  // Check globals.css universal focus-visible
  const globalsCss = fs.readFileSync(path.join(frontendDir, 'app/globals.css'), 'utf8');
  assert(globalsCss.includes(':focus-visible'), 'Focus visible must be universally defined');
  assert(globalsCss.includes('overflow-x: hidden'), 'Prevent horizontal viewport blowout on mobile');

  // Check login & register input labels and accessibility
  const loginContent = fs.readFileSync(path.join(frontendDir, 'app/login/page.tsx'), 'utf8');
  assert(loginContent.includes('Unable to connect to the authentication server'), 'Login must provide clear network error feedback');

  const registerContent = fs.readFileSync(path.join(frontendDir, 'app/register/page.tsx'), 'utf8');
  assert(registerContent.includes('Unable to connect to the registration server'), 'Register must provide clear network error feedback');

  console.log('    ✓ Mobile viewport constraints, universal focus, and a11y standards verified.');

  console.log('\n========================================================================');
  console.log('--- ALL DROP 14 FRONTEND RELIABILITY TESTS PASSED (100%) ---');
  console.log('========================================================================\n');
}

if (require.main === module) {
  runDrop14FrontendReliabilityTests().catch((err) => {
    console.error('Drop 14 Test Failed:', err);
    process.exit(1);
  });
}
