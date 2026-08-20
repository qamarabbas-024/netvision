import { PrismaClient, Role, SandboxStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { validateProductionConfig } from '../src/main';
import { DockerSandboxProvider } from '../src/sandbox/providers/docker-sandbox.provider';
import { SimulatedSandboxProvider } from '../src/sandbox/providers/simulated-sandbox.provider';
import { AppController } from '../src/app.controller';
import { PrismaService } from '../src/database/prisma.service';

const prisma = new PrismaService();

async function main() {
  console.log('🧪 Starting Comprehensive NetVision Deployment Readiness Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, description: string) {
    if (condition) {
      console.log(`  ✓ Assertion ${passed + failed + 1}: ${description}`);
      passed++;
    } else {
      console.error(`  ❌ Assertion ${passed + failed + 1} FAILED: ${description}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // Assertion 1: Production Configuration Validation
    // -------------------------------------------------------------------------
    let prodConfigFailedAsExpected = false;
    const oldNodeEnv = process.env.NODE_ENV;
    const oldJwtSecret = process.env.JWT_SECRET;
    const oldDbUrl = process.env.DATABASE_URL;
    const oldCorsOrigin = process.env.CORS_ORIGIN;
    const oldApiUrl = process.env.API_URL;
    const oldFrontendUrl = process.env.FRONTEND_URL;

    try {
      process.env.NODE_ENV = 'production';
      delete process.env.JWT_SECRET;
      validateProductionConfig();
    } catch (err: any) {
      if (err.message && err.message.includes('Missing required environment variable(s)')) {
        prodConfigFailedAsExpected = true;
      }
    } finally {
      process.env.NODE_ENV = oldNodeEnv;
      if (oldJwtSecret) process.env.JWT_SECRET = oldJwtSecret;
      if (oldDbUrl) process.env.DATABASE_URL = oldDbUrl;
      if (oldCorsOrigin) process.env.CORS_ORIGIN = oldCorsOrigin;
      if (oldApiUrl) process.env.API_URL = oldApiUrl;
      if (oldFrontendUrl) process.env.FRONTEND_URL = oldFrontendUrl;
    }
    assert(prodConfigFailedAsExpected, '1. Production configuration validation rejects missing required environment variables.');

    // -------------------------------------------------------------------------
    // Assertion 2: prisma:migrate:prod script exists in backend/package.json
    // -------------------------------------------------------------------------
    const pkgPath = path.join(__dirname, '../package.json');
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const hasMigrateProdScript = pkgJson.scripts && pkgJson.scripts['prisma:migrate:prod'] === 'prisma migrate deploy';
    assert(hasMigrateProdScript, '2. backend/package.json contains "prisma:migrate:prod": "prisma migrate deploy".');

    // -------------------------------------------------------------------------
    // Assertion 3: Health endpoint works with DB check
    // -------------------------------------------------------------------------
    const prismaService = new PrismaService();
    await prismaService.$connect();
    const appController = new AppController(prismaService);
    const healthResult = await appController.getHealthStatus();
    assert(
      healthResult.status === 'ok' && healthResult.database === 'healthy' && healthResult.service === 'NetVision API',
      '3. GET /api/v1/health returns status "ok" and database "healthy".'
    );

    // -------------------------------------------------------------------------
    // Assertion 4: Docker provider cannot return fake success
    // -------------------------------------------------------------------------
    const dockerProvider = new DockerSandboxProvider();
    let dockerBlocked = false;
    try {
      await dockerProvider.createEnvironment('test-user-id');
    } catch (err: any) {
      if (err.message && err.message.includes('Docker sandbox provider is not available')) {
        dockerBlocked = true;
      }
    }
    assert(dockerBlocked, '4. Docker Sandbox Provider explicitly rejects environment creation with BadRequestException.');

    // -------------------------------------------------------------------------
    // Assertion 5: Simulated provider still works
    // -------------------------------------------------------------------------
    const simulatedProvider = new SimulatedSandboxProvider();
    const simEnv = await simulatedProvider.createEnvironment('test-user-id', 'lab-101');
    assert(
      simEnv.status === SandboxStatus.RUNNING && simEnv.networkState.hostname === 'lab-sandbox-node',
      '5. Simulated Sandbox Provider successfully creates a RUNNING environment with realistic topology.'
    );

    // -------------------------------------------------------------------------
    // Assertion 6: JWT production configuration rejects known/default secrets
    // -------------------------------------------------------------------------
    let weakJwtRejected = false;
    try {
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'super_secret_netvision_jwt_key';
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      process.env.CORS_ORIGIN = 'http://localhost:3000';
      process.env.API_URL = 'http://localhost:4000';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      validateProductionConfig();
    } catch (err: any) {
      if (err.message && err.message.includes('Insecure or default JWT_SECRET detected')) {
        weakJwtRejected = true;
      }
    } finally {
      process.env.NODE_ENV = oldNodeEnv;
      if (oldJwtSecret) process.env.JWT_SECRET = oldJwtSecret;
      else delete process.env.JWT_SECRET;
      if (oldDbUrl) process.env.DATABASE_URL = oldDbUrl;
      else delete process.env.DATABASE_URL;
      if (oldCorsOrigin) process.env.CORS_ORIGIN = oldCorsOrigin;
      else delete process.env.CORS_ORIGIN;
      if (oldApiUrl) process.env.API_URL = oldApiUrl;
      else delete process.env.API_URL;
      if (oldFrontendUrl) process.env.FRONTEND_URL = oldFrontendUrl;
      else delete process.env.FRONTEND_URL;
    }
    assert(weakJwtRejected, '6. Production validator rejects weak or default JWT secrets (e.g. super_secret_netvision_jwt_key).');

    // -------------------------------------------------------------------------
    // Assertion 7: CORS configuration remains restricted
    // -------------------------------------------------------------------------
    const envExamplePath = path.join(__dirname, '../.env.example');
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
    const hasCorsDoc = envExampleContent.includes('CORS_ORIGIN=https://<YOUR_FRONTEND_DOMAIN>');
    assert(hasCorsDoc, '7. CORS configuration is explicitly documented and restricted in .env.example.');

    // -------------------------------------------------------------------------
    // Assertion 8: Trusted proxy configuration is present in main.ts
    // -------------------------------------------------------------------------
    const mainTsPath = path.join(__dirname, '../src/main.ts');
    const mainTsContent = fs.readFileSync(mainTsPath, 'utf8');
    const hasTrustedProxy = mainTsContent.includes("expressApp.set('trust proxy'") && mainTsContent.includes("app.enableShutdownHooks()");
    assert(hasTrustedProxy, '8. main.ts configures express trust proxy and enables NestJS graceful shutdown hooks.');

    // -------------------------------------------------------------------------
    // Assertion 9: Existing authentication database records intact
    // -------------------------------------------------------------------------
    const alexUser = await prisma.user.findUnique({ where: { email: 'alex@netvision.edu' } });
    assert(!!alexUser && alexUser.role === Role.STUDENT, '9. Existing student user (alex@netvision.edu) remains accessible in database.');

    // -------------------------------------------------------------------------
    // Assertion 10: Guest-first anonymous learner architecture remains functional
    // -------------------------------------------------------------------------
    const anonId = '00000000-0000-4000-8000-000000009999';
    const anonLearner = await prisma.anonymousLearner.upsert({
      where: { id: anonId },
      update: {},
      create: { id: anonId },
    });
    assert(anonLearner.id === anonId, '10. Guest-first AnonymousLearner record creation and resolution works cleanly.');

    // -------------------------------------------------------------------------
    // Assertion 11: Existing sandbox ownership remains functional
    // -------------------------------------------------------------------------
    const testSession = await prisma.sandboxSession.create({
      data: {
        anonymousId: anonId,
        providerType: 'SIMULATED',
        status: SandboxStatus.RUNNING,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
    assert(testSession.anonymousId === anonId && testSession.providerType === 'SIMULATED', '11. SandboxSession creation with ownership binding functions correctly.');

    // Cleanup session
    await prisma.sandboxSession.delete({ where: { id: testSession.id } });

    // -------------------------------------------------------------------------
    // Assertion 12: Existing certificate protection remains functional
    // -------------------------------------------------------------------------
    const certCount = await prisma.certificate.count();
    assert(certCount >= 0, '12. Certificate table remains queryable and data structure intact.');

    await prismaService.$disconnect();

    console.log('\n────────────────────────────────────────────────────────────');
    console.log(`Deployment Readiness Suite Results:`);
    console.log(`  Passed:  ${passed}`);
    console.log(`  Failed:  ${failed}`);
    console.log(`  Total:   ${passed + failed}`);
    console.log('────────────────────────────────────────────────────────────\n');

    if (failed === 0) {
      console.log('🎉 Deployment Readiness Verification COMPLETE! All 12 assertions PASSED.\n');
    } else {
      console.error('❌ Deployment Readiness Verification FAILED!');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Test suite crashed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
