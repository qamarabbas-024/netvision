async function runLiveStagingSmokeTest() {
  console.log('================================================================');
  console.log('🌐 LIVE STAGING SECURITY SMOKE TEST');
  console.log('================================================================\n');

  const STAGING_API = 'https://netvision-backend-staging.onrender.com';

  // 1. Health Endpoint Test
  console.log('[TEST 1] Querying Staging Health Endpoint...');
  try {
    const healthRes = await fetch(`${STAGING_API}/api/v1/health`);
    console.log(`  Health Status Code: ${healthRes.status}`);
    const healthJson = await healthRes.json();
    console.log('  Health Body:', healthJson);
    console.log('  Security Headers:');
    for (const [header, val] of healthRes.headers.entries()) {
      if (['x-frame-options', 'x-content-type-options', 'strict-transport-security', 'content-security-policy', 'access-control-allow-origin'].includes(header.toLowerCase())) {
        console.log(`    ${header}: ${val}`);
      }
    }
  } catch (err: any) {
    console.warn('  ⚠️ Staging health check error (cold start or unreachable):', err.message);
  }

  // 2. Safe Validation Error Response Inspection (Verifying No Stack Trace Leak)
  console.log('\n[TEST 2] Testing Staging Input Validation & Error Leakage...');
  try {
    const badReqRes = await fetch(`${STAGING_API}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid_email_format', password: '' }),
    });
    console.log(`  Bad Request Status: ${badReqRes.status}`);
    const errJson = await badReqRes.json();
    console.log('  Error Response Payload:', errJson);
    const hasStack = JSON.stringify(errJson).toLowerCase().includes('stack') || JSON.stringify(errJson).toLowerCase().includes('prisma');
    console.log(`  Leaks Internal Stack / ORM Trace: ${hasStack ? 'YES ❌' : 'NO ✓'}`);
  } catch (err: any) {
    console.warn('  ⚠️ Bad request test error:', err.message);
  }

  // 3. CORS Preflight Check on Staging
  console.log('\n[TEST 3] Testing Staging CORS Preflight Options...');
  try {
    const corsRes = await fetch(`${STAGING_API}/api/v1/courses`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://netvision-three.vercel.app',
        'Access-Control-Request-Method': 'GET',
      },
    });
    console.log(`  CORS Preflight Status: ${corsRes.status}`);
    console.log(`  Allow Origin Header: ${corsRes.headers.get('access-control-allow-origin')}`);
    console.log(`  Allow Credentials: ${corsRes.headers.get('access-control-allow-credentials')}`);
  } catch (err: any) {
    console.warn('  ⚠️ CORS test error:', err.message);
  }
}

runLiveStagingSmokeTest();
