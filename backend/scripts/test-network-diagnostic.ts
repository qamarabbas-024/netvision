interface DiagnosticResult {
  action: string;
  method: string;
  url: string;
  status: number;
  backendReceived: boolean;
  authHeader: boolean;
  anonHeader: boolean;
  anonIdValue: string;
  payload: string;
  responseSnippet: string;
  result: string;
}

const ANON_UUID = 'e3b0c442-98fc-1c14-9aff-4c8996fb9242';

async function makeRequest(
  method: string,
  path: string,
  headers: Record<string, string>,
  body?: any
): Promise<{ status: number; body: string }> {
  const url = `http://127.0.0.1:4000/api/v1${path.startsWith('/') ? path : `/${path}`}`;
  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const res = await fetch(url, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.text();
  return { status: res.status, body: data };
}

async function runNetworkDiagnostic() {
  console.log('Running NetVision Phase 3 Network Diagnostic Suite...\n');
  const results: DiagnosticResult[] = [];

  // Action 1: Open Homepage / Health check
  try {
    const res1 = await makeRequest('GET', '/health', {});
    results.push({
      action: '1. Open Homepage',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/health',
      status: res1.status,
      backendReceived: true,
      authHeader: false,
      anonHeader: false,
      anonIdValue: 'None',
      payload: 'None',
      responseSnippet: res1.body.substring(0, 80),
      result: res1.status === 200 ? '200 OK' : 'FAILED',
    });
  } catch (err: any) {
    results.push({
      action: '1. Open Homepage',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/health',
      status: 0,
      backendReceived: false,
      authHeader: false,
      anonHeader: false,
      anonIdValue: 'None',
      payload: 'None',
      responseSnippet: err.message,
      result: 'FAILED (Connection Refused)',
    });
  }

  // Action 2: Open a Course (Guest)
  try {
    const res2 = await makeRequest('GET', '/courses/network-security', {
      'X-Anonymous-ID': ANON_UUID,
    });
    results.push({
      action: '2. Open Course',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/courses/network-security',
      status: res2.status,
      backendReceived: true,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'None',
      responseSnippet: res2.body.substring(0, 80),
      result: res2.status === 200 ? '200 OK' : 'FAILED',
    });
  } catch (err: any) {
    results.push({
      action: '2. Open Course',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/courses/network-security',
      status: 0,
      backendReceived: false,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'None',
      responseSnippet: err.message,
      result: 'FAILED',
    });
  }

  // Action 3: Open a Lesson (Guest)
  try {
    const res3 = await makeRequest('GET', '/lessons/network-security-defense-depth', {
      'X-Anonymous-ID': ANON_UUID,
    });
    results.push({
      action: '3. Open Lesson',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/lessons/network-security-defense-depth',
      status: res3.status,
      backendReceived: true,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'None',
      responseSnippet: res3.body.substring(0, 80),
      result: res3.status === 200 ? '200 OK' : 'FAILED',
    });
  } catch (err: any) {
    results.push({
      action: '3. Open Lesson',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/lessons/network-security-defense-depth',
      status: 0,
      backendReceived: false,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'None',
      responseSnippet: err.message,
      result: 'FAILED',
    });
  }

  // Action 4: Complete a Lesson (Guest)
  try {
    const res4 = await makeRequest(
      'POST',
      '/progress/complete',
      { 'X-Anonymous-ID': ANON_UUID },
      { lessonId: 'acd0bd40-d498-4b8a-b834-1247e53abfc9' }
    );
    results.push({
      action: '4. Complete Lesson',
      method: 'POST',
      url: 'http://localhost:4000/api/v1/progress/complete',
      status: res4.status,
      backendReceived: true,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: JSON.stringify({ lessonId: 'acd0bd40-d498-4b8a-b834-1247e53abfc9' }),
      responseSnippet: res4.body.substring(0, 80),
      result: res4.status === 200 ? '200 OK' : 'FAILED',
    });
  } catch (err: any) {
    results.push({
      action: '4. Complete Lesson',
      method: 'POST',
      url: 'http://localhost:4000/api/v1/progress/complete',
      status: 0,
      backendReceived: false,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'lessonId',
      responseSnippet: err.message,
      result: 'FAILED',
    });
  }

  // Action 5: Submit a Quiz (Guest)
  try {
    const res5 = await makeRequest(
      'POST',
      '/quizzes/13d14ad2-b136-472b-bf30-9aa785e4d291/submit',
      { 'X-Anonymous-ID': ANON_UUID },
      { answers: { '635cfe30-7d9f-4f9d-b6c7-0ba9c031e1c1': 1 } }
    );
    results.push({
      action: '5. Submit Quiz',
      method: 'POST',
      url: 'http://localhost:4000/api/v1/quizzes/13d14ad2-b136-472b-bf30-9aa785e4d291/submit',
      status: res5.status,
      backendReceived: true,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'answers JSON',
      responseSnippet: res5.body.substring(0, 80),
      result: res5.status === 200 ? '200 OK' : 'FAILED',
    });
  } catch (err: any) {
    results.push({
      action: '5. Submit Quiz',
      method: 'POST',
      url: 'http://localhost:4000/api/v1/quizzes/13d14ad2-b136-472b-bf30-9aa785e4d291/submit',
      status: 0,
      backendReceived: false,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'answers JSON',
      responseSnippet: err.message,
      result: 'FAILED',
    });
  }

  // Action 6: Open a Lab (Guest)
  try {
    const res6 = await makeRequest('GET', '/labs/lab-network-security-1', {
      'X-Anonymous-ID': ANON_UUID,
    });
    results.push({
      action: '6. Open Lab',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/labs/lab-network-security-1',
      status: res6.status,
      backendReceived: true,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'None',
      responseSnippet: res6.body.substring(0, 80),
      result: res6.status === 200 || res6.status === 404 ? `${res6.status} OK` : 'FAILED',
    });
  } catch (err: any) {
    results.push({
      action: '6. Open Lab',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/labs/lab-network-security-1',
      status: 0,
      backendReceived: false,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'None',
      responseSnippet: err.message,
      result: 'FAILED',
    });
  }

  // Action 7: Start/Use Sandbox Session (Guest)
  try {
    const res7 = await makeRequest(
      'POST',
      '/sandbox/sessions',
      { 'X-Anonymous-ID': ANON_UUID },
      { providerType: 'SIMULATED', durationMinutes: 30 }
    );
    results.push({
      action: '7. Start Sandbox',
      method: 'POST',
      url: 'http://localhost:4000/api/v1/sandbox/sessions',
      status: res7.status,
      backendReceived: true,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: JSON.stringify({ providerType: 'SIMULATED' }),
      responseSnippet: res7.body.substring(0, 80),
      result: res7.status === 201 || res7.status === 200 ? '201 Created' : 'FAILED',
    });
  } catch (err: any) {
    results.push({
      action: '7. Start Sandbox',
      method: 'POST',
      url: 'http://localhost:4000/api/v1/sandbox/sessions',
      status: 0,
      backendReceived: false,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'providerType',
      responseSnippet: err.message,
      result: 'FAILED',
    });
  }

  // Action 8: Save/Bookmark Lesson (Guest)
  try {
    const res8 = await makeRequest(
      'POST',
      '/progress/save-lesson',
      { 'X-Anonymous-ID': ANON_UUID },
      { lessonId: 'acd0bd40-d498-4b8a-b834-1247e53abfc9' }
    );
    results.push({
      action: '8. Save Lesson',
      method: 'POST',
      url: 'http://localhost:4000/api/v1/progress/save-lesson',
      status: res8.status,
      backendReceived: true,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: JSON.stringify({ lessonId: 'acd0bd40-d498-4b8a-b834-1247e53abfc9' }),
      responseSnippet: res8.body.substring(0, 80),
      result: res8.status === 200 ? '200 OK' : 'FAILED',
    });
  } catch (err: any) {
    results.push({
      action: '8. Save Lesson',
      method: 'POST',
      url: 'http://localhost:4000/api/v1/progress/save-lesson',
      status: 0,
      backendReceived: false,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'lessonId',
      responseSnippet: err.message,
      result: 'FAILED',
    });
  }

  // Action 9: Open Dashboard Progress (Guest)
  try {
    const res9 = await makeRequest('GET', '/progress', {
      'X-Anonymous-ID': ANON_UUID,
    });
    results.push({
      action: '9. Open Dashboard',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/progress',
      status: res9.status,
      backendReceived: true,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'None',
      responseSnippet: res9.body.substring(0, 80),
      result: res9.status === 200 ? '200 OK' : 'FAILED',
    });
  } catch (err: any) {
    results.push({
      action: '9. Open Dashboard',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/progress',
      status: 0,
      backendReceived: false,
      authHeader: false,
      anonHeader: true,
      anonIdValue: ANON_UUID,
      payload: 'None',
      responseSnippet: err.message,
      result: 'FAILED',
    });
  }

  // Action 10: Auth /me Check (No Token) -> Expected 401
  try {
    const res10 = await makeRequest('GET', '/auth/me', {});
    results.push({
      action: '10. Auth Check (/me)',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/auth/me',
      status: res10.status,
      backendReceived: true,
      authHeader: false,
      anonHeader: false,
      anonIdValue: 'None',
      payload: 'None',
      responseSnippet: res10.body.substring(0, 80),
      result: res10.status === 401 ? '401 Unauthorized (EXPECTED GUEST STATE)' : 'UNEXPECTED',
    });
  } catch (err: any) {
    results.push({
      action: '10. Auth Check (/me)',
      method: 'GET',
      url: 'http://localhost:4000/api/v1/auth/me',
      status: 0,
      backendReceived: false,
      authHeader: false,
      anonHeader: false,
      anonIdValue: 'None',
      payload: 'None',
      responseSnippet: err.message,
      result: 'FAILED',
    });
  }

  console.log('RESULTS_JSON_START');
  console.log(JSON.stringify(results, null, 2));
  console.log('RESULTS_JSON_END');
}

runNetworkDiagnostic();
