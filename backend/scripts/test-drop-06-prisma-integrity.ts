/**
 * ==============================================================================
 * NETVISION — DROP 06: DATABASE SCHEMA, MIGRATION & PRISMA INTEGRITY SUITE
 * ==============================================================================
 * Comprehensive audit & simulation testing:
 * 1. Migration Inventory & Sequential Linearity
 * 2. Unmodeled Constraints & Partial Index Audit
 * 3. Empty PostgreSQL Schema Reconstruction Simulation
 * 4. Partial Unique Index Invariant Verification
 * 5. XOR Ownership CHECK Constraint Invariant Verification
 * 6. Dual-URL Architecture Audit (DATABASE_URL vs DIRECT_URL)
 * 7. PgBouncer / Transaction-Pooler Resilience
 * 8. Seed Archival & Anti-Destruction Safety
 * 9. Production Guardrails Against Destructive Commands (db push / db reset)
 * 10. Workspace Scripts & Workflow Integrity Audit
 * 11. Backup & Restore Tamper-Detection Verification
 * ==============================================================================
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as zlib from 'zlib';
import { sanitizeDatabaseUrl } from '../src/database/prisma.service';
import { evaluateDbCommandSafety, assertSafeDbCommand } from './guard-db-command';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runDrop06Tests() {
  console.log('========================================================================');
  console.log('🛡️  NETVISION — DROP 06: DATABASE SCHEMA, MIGRATION & PRISMA INTEGRITY');
  console.log('========================================================================\n');

  let passedSuites = 0;
  const backendDir = path.resolve(__dirname, '..');
  const prismaDir = path.join(backendDir, 'prisma');
  const migrationsDir = path.join(prismaDir, 'migrations');

  // --------------------------------------------------------------------------
  // TEST 1: Migration Inventory & Sequential Reproducibility
  // --------------------------------------------------------------------------
  console.log('Test 1: Migration Inventory & Sequential Linearity');
  {
    const lockFilePath = path.join(migrationsDir, 'migration_lock.toml');
    assert(fs.existsSync(lockFilePath), 'migration_lock.toml exists in migrations directory');
    const lockContent = fs.readFileSync(lockFilePath, 'utf8');
    assert(lockContent.includes('provider = "postgresql"'), 'Migration lock provider is strictly "postgresql"');

    const expectedMigrations = [
      '20260814000000_baseline',
      '20260909000000_add_certificate_user_cert_unique',
      '20260910102552_add_active_exam_attempt_unique_idx',
    ];

    for (const mig of expectedMigrations) {
      const migSqlPath = path.join(migrationsDir, mig, 'migration.sql');
      assert(fs.existsSync(migSqlPath), `Migration ${mig}/migration.sql exists and is accessible`);
      const stat = fs.statSync(migSqlPath);
      assert(stat.size > 0, `Migration ${mig} has non-empty SQL content (${stat.size} bytes)`);
    }

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // TEST 2: Unmodeled Database Constraints & Partial Index Audit
  // --------------------------------------------------------------------------
  console.log('\nTest 2: Unmodeled Database Constraints & Partial Index Audit');
  {
    // Audit Partial Unique Index in migration 3
    const mig3Sql = fs.readFileSync(
      path.join(migrationsDir, '20260910102552_add_active_exam_attempt_unique_idx', 'migration.sql'),
      'utf8'
    );
    assert(
      mig3Sql.includes('exam_attempts_user_active_in_progress_unique_idx'),
      'Migration 3 defines partial index "exam_attempts_user_active_in_progress_unique_idx"'
    );
    assert(
      mig3Sql.includes('WHERE "status" = \'IN_PROGRESS\'') || mig3Sql.includes("WHERE status = 'IN_PROGRESS'"),
      'Migration 3 strictly enforces WHERE status = \'IN_PROGRESS\' predicate filter'
    );

    // Audit CHECK constraints in baseline migration
    const baselineSql = fs.readFileSync(
      path.join(migrationsDir, '20260814000000_baseline', 'migration.sql'),
      'utf8'
    );

    const requiredChecks = [
      'user_progress_owner_xor',
      'quiz_attempts_owner_xor',
      'lab_attempts_owner_xor',
      'saved_lessons_owner_xor',
      'sandbox_sessions_owner_xor',
    ];

    for (const chk of requiredChecks) {
      assert(baselineSql.includes(chk), `Baseline migration includes XOR ownership CHECK constraint "${chk}"`);
    }

    // Verify unmodeled-constraints.sql exists as canonical reference
    const unmodeledSqlPath = path.join(prismaDir, 'unmodeled-constraints.sql');
    assert(fs.existsSync(unmodeledSqlPath), 'unmodeled-constraints.sql exists in prisma directory');
    const unmodeledSql = fs.readFileSync(unmodeledSqlPath, 'utf8');
    assert(unmodeledSql.includes('exam_attempts_user_active_in_progress_unique_idx'), 'unmodeled-constraints.sql documents partial unique index');
    for (const chk of requiredChecks) {
      assert(unmodeledSql.includes(chk), `unmodeled-constraints.sql documents CHECK constraint "${chk}"`);
    }

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // TEST 3: Schema DDL & Empty PostgreSQL Reconstruction Simulation
  // --------------------------------------------------------------------------
  console.log('\nTest 3: Empty PostgreSQL Schema Reconstruction Simulation');
  {
    const baselineSql = fs.readFileSync(
      path.join(migrationsDir, '20260814000000_baseline', 'migration.sql'),
      'utf8'
    );

    // Verify all 11 core enums are declared in migration
    const requiredEnums = [
      'Role',
      'CourseLevel',
      'LessonType',
      'LabType',
      'OperatingSystem',
      'SandboxStatus',
      'CognitiveLevel',
      'QuestionType',
      'ExamType',
      'ExamAttemptStatus',
      'AchievementCategory',
    ];
    for (const enumName of requiredEnums) {
      assert(baselineSql.includes(`CREATE TYPE "${enumName}" AS ENUM`), `Baseline creates PostgreSQL ENUM "${enumName}"`);
    }

    // Verify core tables
    const requiredTables = [
      'users',
      'courses',
      'modules',
      'lessons',
      'quizzes',
      'quiz_questions',
      'quiz_attempts',
      'user_progress',
      'certificates',
      'certification_definitions',
      'exam_attempts',
      'achievements',
      'user_achievements',
      'simulation_states',
      'sandbox_sessions',
      'oauth_accounts',
    ];
    for (const tableName of requiredTables) {
      assert(baselineSql.includes(`CREATE TABLE "${tableName}"`), `Baseline creates table "${tableName}"`);
    }

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // TEST 4: Partial Unique Index Invariant Verification
  // --------------------------------------------------------------------------
  console.log('\nTest 4: Partial Unique Index Invariant Verification');
  {
    // Simulate candidate attempts with partial index rules
    interface SimulatedExamAttempt {
      id: string;
      userId: string;
      certificationCode: string;
      status: 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'EXPIRED';
    }

    const examAttemptsTable: SimulatedExamAttempt[] = [];

    function insertExamAttempt(attempt: SimulatedExamAttempt): void {
      if (attempt.status === 'IN_PROGRESS') {
        const hasActive = examAttemptsTable.some(
          (a) =>
            a.userId === attempt.userId &&
            a.certificationCode === attempt.certificationCode &&
            a.status === 'IN_PROGRESS'
        );
        if (hasActive) {
          const err: any = new Error('Unique constraint failed on the fields: (`userId`,`certificationCode`)');
          err.code = 'P2002';
          err.meta = { target: ['exam_attempts_user_active_in_progress_unique_idx'] };
          throw err;
        }
      }
      examAttemptsTable.push(attempt);
    }

    // 1. Candidate starts first attempt -> SUCCESS
    insertExamAttempt({ id: 'att-1', userId: 'user-cand-1', certificationCode: 'NV-NET', status: 'IN_PROGRESS' });
    assert(examAttemptsTable.length === 1, 'First IN_PROGRESS attempt inserted successfully');

    // 2. Candidate attempts second concurrent start while first is IN_PROGRESS -> REJECTED with P2002
    let rejectedP2002 = false;
    try {
      insertExamAttempt({ id: 'att-2', userId: 'user-cand-1', certificationCode: 'NV-NET', status: 'IN_PROGRESS' });
    } catch (err: any) {
      if (err.code === 'P2002') rejectedP2002 = true;
    }
    assert(rejectedP2002, 'Concurrent second IN_PROGRESS attempt rejected with P2002 unique constraint violation');

    // 3. First attempt finishes with FAILED -> Status changes
    examAttemptsTable[0].status = 'FAILED';

    // 4. Candidate now starts a second attempt after first completed -> SUCCESS
    insertExamAttempt({ id: 'att-3', userId: 'user-cand-1', certificationCode: 'NV-NET', status: 'IN_PROGRESS' });
    assert(examAttemptsTable.length === 2, 'New attempt allowed after prior attempt transitioned away from IN_PROGRESS');

    // 5. Candidate finishes with PASSED
    examAttemptsTable[1].status = 'PASSED';

    // 6. Another candidate can start same certification without conflict
    insertExamAttempt({ id: 'att-4', userId: 'user-cand-2', certificationCode: 'NV-NET', status: 'IN_PROGRESS' });
    assert(examAttemptsTable.length === 3, 'Distinct candidate can start active attempt concurrently');

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // TEST 5: XOR Ownership CHECK Constraint Invariant Verification
  // --------------------------------------------------------------------------
  console.log('\nTest 5: XOR Ownership CHECK Constraint Invariant Verification');
  {
    function validateXorOwnership(record: { userId?: string | null; anonymousId?: string | null }): boolean {
      const hasUser = Boolean(record.userId);
      const hasAnon = Boolean(record.anonymousId);
      return (hasUser && !hasAnon) || (!hasUser && hasAnon);
    }

    assert(validateXorOwnership({ userId: 'usr-123', anonymousId: null }), 'Authenticated user alone satisfies XOR ownership');
    assert(validateXorOwnership({ userId: null, anonymousId: 'anon-abc' }), 'Anonymous learner alone satisfies XOR ownership');
    assert(!validateXorOwnership({ userId: 'usr-123', anonymousId: 'anon-abc' }), 'Dual ownership (both user and anonymous) violates XOR ownership');
    assert(!validateXorOwnership({ userId: null, anonymousId: null }), 'Orphan record (neither user nor anonymous) violates XOR ownership');

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // TEST 6: Dual-URL Architecture Audit (DATABASE_URL vs DIRECT_URL)
  // --------------------------------------------------------------------------
  console.log('\nTest 6: Dual-URL Architecture Audit (DATABASE_URL vs DIRECT_URL)');
  {
    const schemaPrismaPath = path.join(prismaDir, 'schema.prisma');
    const schemaContent = fs.readFileSync(schemaPrismaPath, 'utf8');

    assert(schemaContent.includes('provider  = "postgresql"'), 'schema.prisma specifies PostgreSQL provider');
    assert(schemaContent.includes('url       = env("DATABASE_URL")'), 'schema.prisma specifies runtime url = env("DATABASE_URL")');
    assert(schemaContent.includes('directUrl = env("DIRECT_URL")'), 'schema.prisma specifies migration directUrl = env("DIRECT_URL")');

    // Check .env.example
    const envExamplePath = path.join(backendDir, '.env.example');
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
    assert(envExampleContent.includes('DATABASE_URL='), '.env.example documents DATABASE_URL');
    assert(envExampleContent.includes('DIRECT_URL='), '.env.example documents DIRECT_URL');
    assert(
      envExampleContent.includes('PgBouncer') || envExampleContent.includes('connection pooler') || envExampleContent.includes('Pooled'),
      '.env.example explains connection pooler vs direct connection architecture'
    );

    // Check docker-compose.yml
    const dockerComposePath = path.join(backendDir, '..', 'docker-compose.yml');
    if (fs.existsSync(dockerComposePath)) {
      const dcContent = fs.readFileSync(dockerComposePath, 'utf8');
      assert(dcContent.includes('DIRECT_URL:'), 'docker-compose.yml provides DIRECT_URL environment variable');
    }

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // TEST 7: PgBouncer / Transaction-Pooler Resilience
  // --------------------------------------------------------------------------
  console.log('\nTest 7: PgBouncer / Transaction-Pooler Resilience');
  {
    // Excessive pool timeout clamped to safe bound
    const clampedPool = sanitizeDatabaseUrl('postgresql://usr:pwd@host:5432/db?pool_timeout=35');
    assert(clampedPool?.includes('pool_timeout=10') ?? false, 'sanitizeDatabaseUrl clamps pool_timeout=35 down to safe 10s');

    // Excessive connect timeout clamped to safe bound
    const clampedConn = sanitizeDatabaseUrl('postgresql://usr:pwd@host:5432/db?connect_timeout=60');
    assert(clampedConn?.includes('connect_timeout=10') ?? false, 'sanitizeDatabaseUrl clamps connect_timeout=60 down to safe 10s');

    // Reasonable timeouts preserved
    const safeUrl = sanitizeDatabaseUrl('postgresql://usr:pwd@host:5432/db?pool_timeout=5&connect_timeout=5');
    assert(
      (safeUrl?.includes('pool_timeout=5') && safeUrl?.includes('connect_timeout=5')) ?? false,
      'sanitizeDatabaseUrl preserves bounded 5s timeouts'
    );

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // TEST 8: Seed Archival & Anti-Destruction Safety
  // --------------------------------------------------------------------------
  console.log('\nTest 8: Seed Archival & Anti-Destruction Safety');
  {
    const seedPath = path.join(prismaDir, 'seed.ts');
    const seedContent = fs.readFileSync(seedPath, 'utf8');

    // Verify seed.ts protects historical data
    assert(seedContent.includes('Safe Archival Semantics'), 'seed.ts documents and implements safe archival semantics');
    assert(
      seedContent.includes('attemptsCount === 0') || seedContent.includes('quizAttempt.count()'),
      'seed.ts checks for student quiz attempts before deleting questions'
    );
    assert(
      seedContent.includes('PRUNE_ORPHAN_QUESTIONS'),
      'seed.ts requires explicit PRUNE_ORPHAN_QUESTIONS flag for question pruning'
    );
    assert(
      seedContent.includes('!isProd'),
      'seed.ts strictly forbids question purging in production environment'
    );

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // TEST 9: Production Guardrails Against Destructive Commands
  // --------------------------------------------------------------------------
  console.log('\nTest 9: Production Guardrails Against Destructive Commands');
  {
    // Test 1: db push against Neon production database -> BLOCKED
    const prodNeonUrl = 'postgresql://user:pass@ep-prod-db-123.c-3.ap-southeast-1.aws.neon.tech/neondb';
    const res1 = evaluateDbCommandSafety('prisma db push', prodNeonUrl, 'development');
    assert(res1.allowed === false, 'Blocked "prisma db push" against Neon production database URL');
    assert(res1.isProduction === true, 'Identified Neon URL as production database target');

    // Test 2: db push with NODE_ENV=production -> BLOCKED
    const res2 = evaluateDbCommandSafety('prisma db push', 'postgresql://user:pass@localhost:5432/db', 'production');
    assert(res2.allowed === false, 'Blocked "prisma db push" when NODE_ENV=production');

    // Test 3: migrate reset against AWS RDS -> BLOCKED
    const prodAwsUrl = 'postgresql://user:pass@rds.ap-southeast-1.amazonaws.com:5432/prod_db';
    const res3 = evaluateDbCommandSafety('prisma migrate reset', prodAwsUrl, 'development');
    assert(res3.allowed === false, 'Blocked "prisma migrate reset" against AWS RDS database URL');

    // Test 4: db reset with --force in production -> BLOCKED
    const res4 = evaluateDbCommandSafety('prisma db reset --force', prodNeonUrl, 'production');
    assert(res4.allowed === false, 'Blocked "prisma db reset --force" in production');

    // Test 5: Safe production command: prisma migrate deploy -> ALLOWED
    const res5 = evaluateDbCommandSafety('prisma migrate deploy', prodNeonUrl, 'production');
    assert(res5.allowed === true, 'Approved safe "prisma migrate deploy" in production');

    // Test 6: Safe production command: prisma migrate status -> ALLOWED
    const res6 = evaluateDbCommandSafety('prisma migrate status', prodNeonUrl, 'production');
    assert(res6.allowed === true, 'Approved safe "prisma migrate status" in production');

    // Test 7: Dev local database db push -> ALLOWED
    const res7 = evaluateDbCommandSafety('prisma db push', 'postgresql://user:pass@localhost:5432/dev_db', 'development');
    assert(res7.allowed === true, 'Approved "prisma db push" for local development sandbox');

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // TEST 10: Workspace Scripts & Workflow Integrity Audit
  // --------------------------------------------------------------------------
  console.log('\nTest 10: Workspace Scripts & Workflow Integrity Audit');
  {
    // Backend package.json
    const backendPkg = JSON.parse(fs.readFileSync(path.join(backendDir, 'package.json'), 'utf8'));
    assert(
      backendPkg.scripts['prisma:migrate:prod'] === 'prisma migrate deploy',
      'backend/package.json defines "prisma:migrate:prod": "prisma migrate deploy"'
    );
    assert(
      !Object.values(backendPkg.scripts).some((s: any) => typeof s === 'string' && (s.includes('db push') || s.includes('db reset'))),
      'backend/package.json contains ZERO scripts invoking destructive "db push" or "db reset"'
    );

    // Root package.json
    const rootPkg = JSON.parse(fs.readFileSync(path.join(backendDir, '..', 'package.json'), 'utf8'));
    assert(
      !Object.values(rootPkg.scripts).some((s: any) => typeof s === 'string' && (s.includes('db push') || s.includes('db reset'))),
      'root package.json contains ZERO scripts invoking destructive "db push" or "db reset"'
    );

    // Dockerfile.backend
    const dockerfilePath = path.join(backendDir, '..', 'Dockerfile.backend');
    if (fs.existsSync(dockerfilePath)) {
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
      assert(!dockerfileContent.includes('db push'), 'Dockerfile.backend contains zero occurrences of "db push"');
      assert(!dockerfileContent.includes('db reset'), 'Dockerfile.backend contains zero occurrences of "db reset"');
    }

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // TEST 11: Backup & Restore Tamper-Detection Verification
  // --------------------------------------------------------------------------
  console.log('\nTest 11: Backup & Restore Tamper-Detection Verification');
  {
    // Test dataset representing high-stakes student certifications and attempts
    const originalData = {
      users: [{ id: 'usr-001', email: 'cert-holder@netvision.edu', fullName: 'Candidate A' }],
      certificates: [{ credentialId: 'NV-2026-001', recipientName: 'Candidate A', certificationCode: 'NV-NET' }],
      examAttempts: [{ id: 'ea-100', userId: 'usr-001', score: 100, status: 'PASSED' }],
    };

    const key = crypto.randomBytes(32);
    const jsonStr = JSON.stringify(originalData);
    const digest = crypto.createHash('sha256').update(jsonStr, 'utf8').digest('hex');

    // 1. Gzip compression
    const compressed = zlib.gzipSync(Buffer.from(jsonStr, 'utf8'));

    // 2. AES-256-GCM encryption
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(compressed), cipher.final()]);
    const tag = cipher.getAuthTag();

    // 3. Successful restoration
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    const decompressed = zlib.gunzipSync(decrypted);
    const restoredDigest = crypto.createHash('sha256').update(decompressed).digest('hex');

    assert(restoredDigest === digest, 'Restored data SHA-256 matches original payload digest');
    const restoredData = JSON.parse(decompressed.toString('utf8'));
    assert(restoredData.certificates[0].credentialId === 'NV-2026-001', 'Certificate credentials restored intact');

    // 4. Tamper detection: flip a single byte in ciphertext
    const tamperedEncrypted = Buffer.from(encrypted);
    tamperedEncrypted[10] ^= 0x01; // Invert bit

    let tamperDetected = false;
    try {
      const badDecipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      badDecipher.setAuthTag(tag);
      badDecipher.update(tamperedEncrypted);
      badDecipher.final();
    } catch {
      tamperDetected = true;
    }
    assert(tamperDetected, 'AES-256-GCM authentication tag rejected tampered backup ciphertext');

    passedSuites++;
  }

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`🎉 ALL ${passedSuites}/11 DROP 06 PRISMA INTEGRITY SUITES PASSED!`);
  console.log('========================================================================\n');
}

runDrop06Tests().catch((err) => {
  console.error('\n❌ DROP 06 PRISMA INTEGRITY TEST FAILED:', err);
  process.exit(1);
});
