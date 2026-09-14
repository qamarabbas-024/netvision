/**
 * NETVISION — DROP G
 * APPLICATION SECURITY, SENSITIVE DATA SANITIZATION & VERIFICATION RATE LIMITING (SEC-002, SEC-003)
 *
 * Mandatory Verification Gates:
 * 1. Public Verification Sensitive Data Sanitization (SEC-002):
 *    - CertificationsService.verifyCertificate() NEVER leaks internal database UUID (id), userId, email, passwordHash, or verificationCode.
 *    - TopicsService.getCertificateById() NEVER leaks internal database UUID (id), userId, email, passwordHash, or verificationCode.
 * 2. Rate Limiting Protection (SEC-003):
 *    - AppRateLimitGuard maps certificate verification paths (/certificates/verify, /certificates/:id) to AUTH tier (10 req/min).
 *    - Exhausting the 10 req/min quota safely triggers 429 Too Many Requests with retry-after headers, preventing credential enumeration.
 * 3. Copy Trust & Credibility:
 *    - Verification frontend page contains zero deceptive cryptographic or blockchain claims.
 */

import { PrismaService } from '../src/database/prisma.service';
import { CertificationsService } from '../src/certifications/certifications.service';
import { CertificationEligibilityService } from '../src/certifications/certification-eligibility.service';
import { TopicsService } from '../src/topics/topics.service';
import { RateLimiterService } from '../src/security/rate-limiter/rate-limiter.service';
import { AppRateLimitGuard } from '../src/security/rate-limiter/app-rate-limit.guard';
import { Reflector } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaService();
const eligibilityService = new CertificationEligibilityService(prisma as any);
const certsService = new CertificationsService(prisma as any, eligibilityService);
const topicsService = new TopicsService(prisma as any, {} as any);

let passCount = 0;
let failCount = 0;

function check(assertion: boolean, description: string) {
  if (assertion) {
    console.log(`  ✅ PASS: ${description}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failCount++;
  }
}

async function waitForDatabase(retries = 10, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return;
    } catch (err) {
      if (i === retries) throw err;
      console.log(`⏳ Neon connection warmup... retrying in ${delayMs}ms (attempt ${i}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function runDropGTestSuite() {
  console.log('🧪 Starting NetVision Drop G Test Suite: Security Sanitization & Rate Limiting (SEC-002, SEC-003)...\n');

  await waitForDatabase();

  const testSuffix = Date.now().toString(36);
  const testEmail = `drop-g-sec-${testSuffix}@netvision-audit.internal`;

  // Create test user and certificate for rigorous verification
  const testUser = await prisma.user.create({
    data: {
      email: testEmail,
      username: `sec_candidate_${testSuffix}`,
      fullName: 'Sec Candidate Test',
      passwordHash: '$2b$10$dummyhashedpasswordfordropgverificationonly',
      isVerified: true,
    },
  });

  const testCert = await prisma.certificate.create({
    data: {
      userId: testUser.id,
      certificationCode: 'NV-NET-C01',
      credentialId: `NV-NET-C01-${testSuffix.toUpperCase()}`,
      verificationCode: `NV-VERIFY-SECRET-${testSuffix.toUpperCase()}`,
      status: 'ACTIVE',
      recipientName: 'Sec Candidate Test',
      certificationTitle: 'Foundations & Network Architecture',
      metadataJson: {
        overallScore: 96,
        grade: 'Pass with Distinction',
        skillsAssessed: ['Network Architecture', 'IPv4/IPv6 Addressing'],
      },
    },
  });

  try {
    // =========================================================================
    // SUITE 1: SENSITIVE DATA SANITIZATION IN PUBLIC VERIFICATION (SEC-002)
    // =========================================================================
    console.log('\n--- Suite 1: Sensitive Data Sanitization in CertificationsService (SEC-002) ---');

    const certResult = await certsService.verifyCertificate(testCert.credentialId);

    check(certResult.isVerified === true, 'CertificationsService: Verification succeeds for active certificate');
    check(certResult.credentialId === testCert.credentialId, 'CertificationsService: Exposes public credentialId');
    check(certResult.recipientName === 'Sec Candidate Test', 'CertificationsService: Exposes recipientName');
    check(certResult.certificationCode === 'NV-NET-C01', 'CertificationsService: Exposes certificationCode');

    // Negative leak assertions: Zero private attributes permitted
    check((certResult as any).id === undefined, 'SEC-002: CertificationsService NEVER leaks internal DB UUID (id)');
    check((certResult as any).userId === undefined, 'SEC-002: CertificationsService NEVER leaks user database ID (userId)');
    check((certResult as any).verificationCode === undefined, 'SEC-002: CertificationsService NEVER leaks internal secret verificationCode');
    check((certResult as any).email === undefined, 'SEC-002: CertificationsService NEVER leaks candidate email address');
    check((certResult as any).passwordHash === undefined, 'SEC-002: CertificationsService NEVER leaks passwordHash');

    console.log('\n--- Suite 2: Sensitive Data Sanitization in TopicsService (SEC-002) ---');

    const topicCertResult = await topicsService.getCertificateById(testCert.credentialId);

    check(topicCertResult.isVerified === true, 'TopicsService: Verification succeeds for active certificate');
    check(topicCertResult.credentialId === testCert.credentialId, 'TopicsService: Exposes public credentialId');
    check(topicCertResult.recipientName === 'Sec Candidate Test', 'TopicsService: Exposes recipientName');
    check(topicCertResult.certificationCode === 'NV-NET-C01', 'TopicsService: Exposes certificationCode');

    // Negative leak assertions for TopicsService
    check((topicCertResult as any).id === undefined, 'SEC-002: TopicsService NEVER leaks internal DB UUID (id)');
    check((topicCertResult as any).userId === undefined, 'SEC-002: TopicsService NEVER leaks user database ID (userId)');
    check((topicCertResult as any).verificationCode === undefined, 'SEC-002: TopicsService NEVER leaks internal secret verificationCode');
    check((topicCertResult as any).email === undefined, 'SEC-002: TopicsService NEVER leaks candidate email address');
    check((topicCertResult as any).passwordHash === undefined, 'SEC-002: TopicsService NEVER leaks passwordHash');

    // =========================================================================
    // SUITE 3: VERIFICATION ENDPOINT RATE LIMITING & TIER MAPPING (SEC-003)
    // =========================================================================
    console.log('\n--- Suite 3: Rate Limiting & Tier Enforcement (SEC-003) ---');

    const rateLimiterService = new RateLimiterService({ get: () => undefined } as any);
    const reflector = new Reflector();
    const guard = new AppRateLimitGuard(reflector, rateLimiterService);

    // Test tier resolution on verification paths
    const mockContextFor = (url: string) => ({
      switchToHttp: () => ({
        getRequest: () => ({ originalUrl: url, headers: {}, ip: '198.51.100.1' }),
        getResponse: () => ({ headersSent: false, setHeader: () => {} }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any);

    const tier1 = (guard as any).resolveTier(
      mockContextFor('/api/v1/certificates/verify/NV-NET-C01-12345'),
      { originalUrl: '/api/v1/certificates/verify/NV-NET-C01-12345' } as any
    );
    check(tier1 === 'AUTH', 'AppRateLimitGuard resolves AUTH tier for /certificates/verify/:credentialId');

    const tier2 = (guard as any).resolveTier(
      mockContextFor('/api/v1/certificates/NV-NET-C01-12345'),
      { originalUrl: '/api/v1/certificates/NV-NET-C01-12345' } as any
    );
    check(tier2 === 'AUTH', 'AppRateLimitGuard resolves AUTH tier for /certificates/:id');

    // Test RateLimiterService AUTH tier quota enforcement (10 req/min)
    const testIp = `203.0.113.${Math.floor(Math.random() * 200 + 10)}`;
    console.log(`  Simulating IP enumeration burst from: ${testIp}`);

    let allAllowed = true;
    for (let reqNum = 1; reqNum <= 10; reqNum++) {
      const res = rateLimiterService.checkAuthLimit(testIp);
      if (!res.allowed) {
        allAllowed = false;
      }
    }
    check(allAllowed, 'RateLimiterService: Allows exactly 10 requests within AUTH tier window');

    // 11th request MUST be rejected
    const blockedRes = rateLimiterService.checkAuthLimit(testIp);
    check(!blockedRes.allowed, 'RateLimiterService: Blocks 11th request exceeding AUTH tier limit (SEC-003)');
    check(blockedRes.remaining === 0, 'RateLimiterService: Remaining tokens equals 0 on limit breach');
    check(blockedRes.retryAfterSeconds > 0, `RateLimiterService: Provides non-zero retryAfterSeconds (${blockedRes.retryAfterSeconds}s)`);

    // =========================================================================
    // SUITE 4: FRONTEND VERIFICATION COPY AUDIT
    // =========================================================================
    console.log('\n--- Suite 4: Verification UI Copy & Truthfulness Audit ---');

    const verifyPagePath = path.resolve(__dirname, '../../frontend/app/certificates/verify/[credentialId]/page.tsx');
    const verifyPageSource = fs.readFileSync(verifyPagePath, 'utf8');

    check(!verifyPageSource.toLowerCase().includes('cryptographic signature'), 'Frontend verify page has 0 "cryptographic signature" claims');
    check(!verifyPageSource.toLowerCase().includes('blockchain'), 'Frontend verify page has 0 "blockchain" claims');
    check(!verifyPageSource.toLowerCase().includes('on-chain'), 'Frontend verify page has 0 "on-chain" claims');
    check(verifyPageSource.includes('Official NetVision registry record'), 'Frontend verify page uses truthful official registry copy');

  } finally {
    // Clean up test fixtures
    await prisma.certificate.deleteMany({ where: { userId: testUser.id } });
    await prisma.user.deleteMany({ where: { id: testUser.id } });
    await prisma.$disconnect();
  }

  console.log(`\n======================================================`);
  console.log(`Drop G Verification Complete: ${passCount} Passed, ${failCount} Failed`);
  console.log(`======================================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runDropGTestSuite().catch((err) => {
  console.error('Fatal Drop G Test Suite Exception:', err);
  process.exit(1);
});
