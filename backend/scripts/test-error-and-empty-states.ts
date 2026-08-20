import { redactSensitiveData } from '../src/monitoring/utils/redaction.util';
import { AllExceptionsFilter } from '../src/monitoring/filters/all-exceptions.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

class MockResponse {
  statusCode: number = 200;
  headers: Record<string, string> = {};
  body: any = null;

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  setHeader(key: string, val: string) {
    this.headers[key] = val;
    return this;
  }

  json(data: any) {
    this.body = data;
    return this;
  }
}

class MockHost {
  private res: MockResponse;
  private req: any;

  constructor(req: any, res: MockResponse) {
    this.req = req;
    this.res = res;
  }

  switchToHttp() {
    return {
      getResponse: () => this.res,
      getRequest: () => this.req,
    };
  }
}

function runErrorAndSecurityAuditTests() {
  console.log('--- NetVision Security & Error State Audit Test Suite ---\n');
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`  [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
      failedCount++;
    }
  }

  // 1. Test Redaction of Secrets & Tokens
  const testObject = {
    password: 'SuperSecretPassword123!',
    token: 'Bearer sensitive_jwt_token_here',
    apiKey: 're_1234567890abcdefghijklmn',
    nested: {
      private_key: '-----BEGIN PRIVATE KEY-----',
      userEmail: 'student@example.com',
      databaseUrl: 'postgresql://postgres:secretPass@localhost:5432/netvision_db',
    },
  };

  const redacted = redactSensitiveData(testObject);
  assert(redacted.password === '[REDACTED]', 'Redact sensitive key "password"');
  assert(redacted.token === '[REDACTED]', 'Redact sensitive key "token"');
  assert(redacted.apiKey === '[REDACTED]', 'Redact sensitive key "apiKey"');
  assert(redacted.nested.private_key === '[REDACTED]', 'Redact nested key "private_key"');
  assert(redacted.nested.userEmail === 'student@example.com', 'Preserve safe non-sensitive fields');

  // 2. Test File Path & Token Redaction in Error Messages
  const rawErrorMessage =
    'Error occurred at C:\\Users\\Administrator\\AppData\\Local\\Temp\\build.js on port 4000 with postgresql://dbuser:mypassword@127.0.0.1:5432/db';
  const sanitizedMsg = redactSensitiveData(rawErrorMessage);
  assert(!sanitizedMsg.includes('C:\\Users'), 'Scrub Windows internal file paths from error messages');
  assert(!sanitizedMsg.includes('mypassword'), 'Scrub database credentials from error strings');

  // 3. Test AllExceptionsFilter with Prisma P2002 Unique Constraint Exception
  const filter = new AllExceptionsFilter();
  const res1 = new MockResponse();
  const req1 = { method: 'POST', url: '/api/v1/courses', headers: {} };
  const mockHost1 = new MockHost(req1, res1) as any;

  const prismaP2002Error: any = new Error(
    'Unique constraint failed on the fields: (`code`) in table `Course`'
  );
  prismaP2002Error.name = 'PrismaClientKnownRequestError';
  prismaP2002Error.code = 'P2002';

  filter.catch(prismaP2002Error, mockHost1);

  assert(res1.statusCode === HttpStatus.CONFLICT, 'Map Prisma P2002 error to 409 Conflict status');
  assert(res1.body?.error === 'Conflict', 'Sanitize error name to "Conflict" without leaking Prisma');
  assert(!res1.body?.message?.includes('`Course`'), 'Scrub database table name from client error response');
  assert(!res1.body?.stack, 'Ensure stack trace is never returned in client response body');

  // 4. Test AllExceptionsFilter with Prisma P2025 Not Found Exception
  const res2 = new MockResponse();
  const req2 = { method: 'GET', url: '/api/v1/courses/unknown', headers: {} };
  const mockHost2 = new MockHost(req2, res2) as any;

  const prismaP2025Error: any = new Error(
    'An operation failed because it depends on one or more records that were required but not found. Record to update not found.'
  );
  prismaP2025Error.name = 'PrismaClientKnownRequestError';
  prismaP2025Error.code = 'P2025';

  filter.catch(prismaP2025Error, mockHost2);

  assert(res2.statusCode === HttpStatus.NOT_FOUND, 'Map Prisma P2025 error to 404 NotFound status');
  assert(res2.body?.error === 'NotFound', 'Sanitize error name to "NotFound"');
  assert(!res2.body?.error?.includes('Prisma'), 'No Prisma class name in error property');

  // 5. Test AllExceptionsFilter with Standard NestJS HttpException
  const res3 = new MockResponse();
  const req3 = { method: 'POST', url: '/api/v1/quizzes/submit', headers: {} };
  const mockHost3 = new MockHost(req3, res3) as any;

  const nestHttpError = new HttpException('Invalid quiz submission payload', HttpStatus.BAD_REQUEST);
  filter.catch(nestHttpError, mockHost3);

  assert(res3.statusCode === HttpStatus.BAD_REQUEST, 'Preserve standard HttpException status code');
  assert(res3.body?.message === 'Invalid quiz submission payload', 'Preserve safe user-facing message');
  assert(res3.body?.requestId !== undefined, 'Attach requestId header and body property');

  console.log(`\n========================================`);
  console.log(`Audit Test Results: ${passedCount} passed, ${failedCount} failed`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runErrorAndSecurityAuditTests();
