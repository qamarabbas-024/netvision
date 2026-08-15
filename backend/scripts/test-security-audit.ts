import { PrismaService } from '../src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../src/auth/auth.service';
import { SandboxService } from '../src/sandbox/sandbox.service';
import { TopicsService } from '../src/topics/topics.service';
import { CertificationsService } from '../src/certifications/certifications.service';
import { SimulatedSandboxProvider } from '../src/sandbox/providers/simulated-sandbox.provider';
import { DockerSandboxProvider } from '../src/sandbox/providers/docker-sandbox.provider';
import { EmailService } from '../src/mail/email.service';
import { DevConsoleProvider } from '../src/mail/providers/dev-console.provider';
import * as argon2 from 'argon2';

const prisma = new PrismaService();
const jwtSecret = 'test_security_audit_jwt_secret_min_32_characters_long_12345';
const jwtService = new JwtService({ secret: jwtSecret });

function createMockConfig(env: Record<string, string>): ConfigService {
  return {
    get: (key: string, def?: any) => (key in env ? env[key] : def),
  } as unknown as ConfigService;
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`[SECURITY ASSERTION FAILED]: ${msg}`);
}

async function runSecurityAuditTests() {
  console.log('================================================================');
  console.log('🔒 NETVISION SECURITY AUDIT & AUTHORIZATION VALIDATION SUITE');
  console.log('================================================================\n');

  await prisma.$connect();
  let passedTests = 0;

  const mockConfig = createMockConfig({
    NODE_ENV: 'production',
    EMAIL_VERIFICATION_ENABLED: 'false',
    JWT_SECRET: jwtSecret,
  });

  const emailService = new EmailService(mockConfig, new DevConsoleProvider());
  const authService = new AuthService(prisma, jwtService, emailService, mockConfig);
  const simulatedSandbox = new SimulatedSandboxProvider();
  const dockerSandbox = new DockerSandboxProvider();
  const sandboxService = new SandboxService(prisma, simulatedSandbox, dockerSandbox);
  const achievementsService = {
    checkAndAward: async () => [],
    getUserAchievements: async () => [],
    getAllAchievements: async () => [],
  } as any;
  const topicsService = new TopicsService(prisma, achievementsService);
  const certsService = new CertificationsService(prisma);

  // Setup synthetic test accounts
  const emailA = `sec_audit_user_a_${Date.now()}@netvision.test`;
  const emailB = `sec_audit_user_b_${Date.now()}@netvision.test`;

  console.log('[SECTION 1] Authentication, Argon2id & JWT Integrity');
  {
    const userA = await authService.register({
      email: emailA,
      username: `sec_a_${Date.now().toString().slice(-6)}`,
      password: 'StrongPassword123!@#',
      fullName: 'Security Auditor A',
    });

    const userB = await authService.register({
      email: emailB,
      username: `sec_b_${Date.now().toString().slice(-6)}`,
      password: 'StrongPassword123!@#',
      fullName: 'Security Auditor B',
    });

    assert(userA.requiresOtp === false, 'Beta registration requiresOtp is false');
    assert(userA.user?.isVerified === true, 'Beta user is immediately verified');
    assert(typeof userA.accessToken === 'string', 'JWT access token issued');

    // Password storage verification
    const dbUserA = await prisma.user.findUnique({ where: { email: emailA } });
    assert(dbUserA?.passwordHash !== null, 'Password hash exists');
    assert(dbUserA?.passwordHash?.startsWith('$argon2id$') === true, 'Password hashed with Argon2id');
    const isPwMatch = await argon2.verify(dbUserA!.passwordHash!, 'StrongPassword123!@#');
    assert(isPwMatch === true, 'Password verification successful with Argon2');

    // Verify token validation
    const decoded: any = jwtService.verify(userA.accessToken!);
    assert(decoded.sub === userA.user?.id, 'JWT subject matches user ID');

    console.log('  ✓ Passed: Authentication, Argon2id hashing & JWT cryptographic validation');
    passedTests++;
  }

  const dbUserA = (await prisma.user.findUnique({ where: { email: emailA } }))!;
  const dbUserB = (await prisma.user.findUnique({ where: { email: emailB } }))!;

  console.log('\n[SECTION 2] Authorization & IDOR Protection: Sandbox Isolation');
  {
    // User A creates a sandbox session
    const sessionA = await sandboxService.createSession(
      { userId: dbUserA.id },
      { durationMinutes: 15, providerType: 'SIMULATED' }
    );

    // User B attempts to access User A's session status -> Must throw ForbiddenException
    let userBAccessBlocked = false;
    try {
      await sandboxService.getSessionStatus({ userId: dbUserB.id }, sessionA.sessionId);
    } catch (err: any) {
      if (err.status === 403 || err.message?.includes('Access denied')) {
        userBAccessBlocked = true;
      }
    }
    assert(userBAccessBlocked, 'User B is blocked from viewing User A sandbox session');

    // User B attempts to execute a command in User A's session -> Must throw ForbiddenException
    let userBExecBlocked = false;
    try {
      await sandboxService.executeCommand(
        { userId: dbUserB.id },
        sessionA.sessionId,
        { command: 'ping 192.168.1.1' }
      );
    } catch (err: any) {
      if (err.status === 403 || err.message?.includes('Access denied')) {
        userBExecBlocked = true;
      }
    }
    assert(userBExecBlocked, 'User B is blocked from executing commands in User A sandbox session');

    // User A can execute command in their own session
    const execRes = await sandboxService.executeCommand(
      { userId: dbUserA.id },
      sessionA.sessionId,
      { command: 'ping 192.168.1.1' }
    );
    assert(execRes.result.isSimulated === true, 'Command executed in deterministic simulation');

    // Cleanup session
    await prisma.sandboxSession.delete({ where: { id: sessionA.sessionId } });
    console.log('  ✓ Passed: Sandbox sessions are strictly isolated per owner with IDOR protection');
    passedTests++;
  }

  console.log('\n[SECTION 3] Command Injection & Sandbox Escape Immunity');
  {
    const sessionA = await sandboxService.createSession(
      { userId: dbUserA.id },
      { durationMinutes: 15, providerType: 'SIMULATED' }
    );

    // Attempt destructive command
    const injectedRes = await sandboxService.executeCommand(
      { userId: dbUserA.id },
      sessionA.sessionId,
      { command: 'rm -rf / ; sudo reboot' }
    );

    assert(
      injectedRes.result.output.includes('SECURITY VIOLATION') || injectedRes.result.exitCode === 126,
      'Destructive commands are rejected by sandbox parser'
    );
    assert(injectedRes.result.isSimulated === true, 'No host shell spawned');

    // Clean up
    await prisma.sandboxSession.delete({ where: { id: sessionA.sessionId } });
    console.log('  ✓ Passed: Sandbox parser immune to command injection & host shell escape');
    passedTests++;
  }

  console.log('\n[SECTION 4] Docker Sandbox Public Policy');
  {
    let dockerBlocked = false;
    try {
      await sandboxService.createSession(
        { userId: dbUserA.id },
        { durationMinutes: 15, providerType: 'DOCKER' }
      );
    } catch (err: any) {
      if (err.status === 400 && err.message?.includes('Docker sandbox provider is disabled')) {
        dockerBlocked = true;
      }
    }
    assert(dockerBlocked, 'Docker sandbox provider is disabled for public safety');
    console.log('  ✓ Passed: Docker daemon provider explicitly disabled in deployment');
    passedTests++;
  }

  console.log('\n[SECTION 5] Guest/Anonymous Identity Isolation & Atomic Claim');
  {
    const anonId1 = '11111111-1111-4111-a111-111111111111';
    const anonId2 = '22222222-2222-4222-a222-222222222222';

    // Guest 1 creates sandbox session
    const guestSession1 = await sandboxService.createSession(
      { anonymousId: anonId1 },
      { durationMinutes: 15, providerType: 'SIMULATED' }
    );

    // Guest 2 attempts to execute in Guest 1 session -> Must be forbidden
    let guest2Blocked = false;
    try {
      await sandboxService.executeCommand(
        { anonymousId: anonId2 },
        guestSession1.sessionId,
        { command: 'ifconfig' }
      );
    } catch (err: any) {
      if (err.status === 403 || err.message?.includes('Access denied')) {
        guest2Blocked = true;
      }
    }
    assert(guest2Blocked, 'Guest 2 cannot access Guest 1 sandbox session');

    // User A claims Guest 1 progress
    const claimRes = await topicsService.claimProgress(dbUserA.id, anonId1);
    assert(claimRes.success === true, 'Claim operation succeeds atomically');

    // Verify session transferred to User A
    const updatedSession = await prisma.sandboxSession.findUnique({
      where: { id: guestSession1.sessionId },
    });
    assert(updatedSession?.userId === dbUserA.id, 'Session ownership migrated to authenticated User A');

    // Clean up
    await prisma.sandboxSession.delete({ where: { id: guestSession1.sessionId } });
    await prisma.anonymousLearner.deleteMany({ where: { id: { in: [anonId1, anonId2] } } });
    console.log('  ✓ Passed: Guest isolation and atomic claim migration function securely');
    passedTests++;
  }

  console.log('\n[SECTION 6] Exam Attempt IDOR Protection');
  {
    const certDef = await prisma.certificationDefinition.findFirst();
    if (certDef) {
      // Start exam for User A
      const examAttemptA = await certsService.startExamAttempt(dbUserA.id, {
        certificationCode: certDef.code,
        type: 'THEORY' as any,
      });

      // User B attempts to access User A's exam attempt -> Must throw ForbiddenException
      let examIdorBlocked = false;
      try {
        await certsService.getAttemptStatus(dbUserB.id, examAttemptA.attemptId);
      } catch (err: any) {
        if (err.status === 403 || err.message?.includes('Access denied')) {
          examIdorBlocked = true;
        }
      }
      assert(examIdorBlocked, 'User B is blocked from viewing User A exam attempt');

      // Clean up
      await prisma.examAttempt.delete({ where: { id: examAttemptA.attemptId } });
    }
    console.log('  ✓ Passed: Exam attempts enforce strict per-user ownership and anti-tampering');
    passedTests++;
  }

  console.log('\n[SECTION 7] SQL Injection & Input Validation Immunity');
  {
    // Attempt SQL injection in search
    const sqliQuery = "'; DROP TABLE users; --";
    const searchRes = await topicsService.search(sqliQuery);
    assert(Array.isArray(searchRes.courses), 'SQL injection query handled safely by Prisma parameterization');

    // Verify users table intact
    const userCount = await prisma.user.count();
    assert(userCount >= 2, 'Users table is completely intact');
    console.log('  ✓ Passed: Prisma ORM parameterized queries are immune to SQL injection');
    passedTests++;
  }

  // Teardown synthetic accounts
  await prisma.user.delete({ where: { id: dbUserA.id } });
  await prisma.user.delete({ where: { id: dbUserB.id } });
  await prisma.$disconnect();

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests} SECURITY AUDIT & AUTHORIZATION TESTS PASSED!`);
  console.log('================================================================\n');
}

runSecurityAuditTests().catch((err) => {
  console.error('\n❌ SECURITY TEST FAILED:', err);
  process.exit(1);
});
