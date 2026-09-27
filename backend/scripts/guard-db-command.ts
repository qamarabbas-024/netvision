/**
 * ==============================================================================
 * NETVISION — DATABASE GOVERNANCE & PRODUCTION SAFETY GUARD (DROP 26)
 * ==============================================================================
 * Enforces strict database governance rules to prevent accidental schema drift,
 * table drops, or constraint erasure (such as partial unique indexes and XOR checks).
 *
 * Database Tiers:
 * - DEVELOPMENT: Local Docker / ephemeral Postgres. Permitted: migrate dev, generate, seed.
 * - TEST: CI ephemeral service. Permitted: migrate deploy, generate, seed, test.
 * - STAGING: Pre-release protected cloud DB. Permitted: migrate deploy, migrate status.
 * - PRODUCTION: High-availability live cloud DB. Permitted: migrate deploy ONLY.
 *
 * FORBIDDEN COMMANDS on Protected DBs (Staging & Production):
 * - prisma db push (Drops unmodeled partial indexes & CHECK constraints)
 * - prisma migrate reset / db reset (Destroys database tables and all user records)
 * - prisma db push --accept-data-loss / --force-reset
 * ==============================================================================
 */

import * as fs from 'fs';
import * as path from 'path';

export enum DatabaseTier {
  DEVELOPMENT = 'DEVELOPMENT',
  TEST = 'TEST',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export const DANGEROUS_DB_COMMANDS = [
  'db push',
  'db reset',
  'migrate reset',
  'push',
  'reset',
  'db drop',
  '--accept-data-loss',
  '--force-reset',
] as const;

export const SAFE_PRODUCTION_COMMANDS = [
  'migrate deploy',
  'prisma migrate deploy',
  'migrate status',
  'prisma migrate status',
  'generate',
  'prisma generate',
] as const;

export const PRODUCTION_HOST_PATTERNS = [
  '.neon.tech',
  'amazonaws.com',
  'rds.',
  'railway.app',
  'supabase.co',
  'fly.dev',
  'render.com',
  'azure.com',
  'prod',
  'production',
];

export const STAGING_HOST_PATTERNS = [
  'staging',
  'stage',
  'preprod',
  'testnet',
];

export interface DbSafetyCheckResult {
  allowed: boolean;
  tier: DatabaseTier;
  reason?: string;
  command: string;
  isProtected: boolean;
  isProduction: boolean;
}

export interface WorkflowScanViolation {
  file: string;
  line: number;
  content: string;
  command: string;
}

export interface WorkflowScanResult {
  passed: boolean;
  violations: WorkflowScanViolation[];
  scannedFiles: string[];
}

/**
 * Categorizes a target database URL and environment into an explicit tier.
 */
export function determineDatabaseTier(
  dbUrl = process.env.DATABASE_URL || '',
  nodeEnv = process.env.NODE_ENV || 'development'
): DatabaseTier {
  const normalizedUrl = dbUrl.toLowerCase();
  const normalizedEnv = nodeEnv.toLowerCase();

  // 1. Production evaluation
  if (normalizedEnv === 'production') {
    return DatabaseTier.PRODUCTION;
  }
  for (const pattern of PRODUCTION_HOST_PATTERNS) {
    if (normalizedUrl.includes(pattern)) {
      if (STAGING_HOST_PATTERNS.some((s) => normalizedUrl.includes(s))) {
        return DatabaseTier.STAGING;
      }
      return DatabaseTier.PRODUCTION;
    }
  }

  // 2. Staging evaluation
  if (normalizedEnv === 'staging') {
    return DatabaseTier.STAGING;
  }
  for (const pattern of STAGING_HOST_PATTERNS) {
    if (normalizedUrl.includes(pattern)) {
      return DatabaseTier.STAGING;
    }
  }

  // 3. Test / CI evaluation
  if (normalizedEnv === 'test' || process.env.CI === 'true') {
    return DatabaseTier.TEST;
  }

  // 4. Development default
  return DatabaseTier.DEVELOPMENT;
}

/**
 * Evaluates whether a database command is safe to execute against the target database.
 */
export function evaluateDbCommandSafety(
  command: string,
  dbUrl = process.env.DATABASE_URL || '',
  nodeEnv = process.env.NODE_ENV || 'development'
): DbSafetyCheckResult {
  const normalizedCmd = command.toLowerCase().trim();
  const tier = determineDatabaseTier(dbUrl, nodeEnv);
  const isProduction = tier === DatabaseTier.PRODUCTION;
  const isProtected = tier === DatabaseTier.PRODUCTION || tier === DatabaseTier.STAGING;

  const isDangerous = DANGEROUS_DB_COMMANDS.some(
    (dCmd) => normalizedCmd.includes(dCmd) || normalizedCmd === dCmd
  );

  if (isDangerous && isProtected) {
    const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
    return {
      allowed: false,
      tier,
      command,
      isProtected: true,
      isProduction,
      reason:
        `⛔ DESTRUCTIVE DATABASE COMMAND BLOCKED BY DATABASE GOVERNANCE!\n` +
        `Command "${command}" cannot be executed against protected ${tier} database.\n` +
        `Target Environment: ${nodeEnv}\n` +
        `Target Database URL: ${maskedUrl}\n\n` +
        `REASON: Running "${command}" on ${tier} erases critical PostgreSQL constraints ` +
        `(partial unique indexes and XOR ownership checks) or causes irrecoverable data loss.\n\n` +
        `To deploy migrations safely in ${tier}, use:\n` +
        `  pnpm --filter netvision-backend prisma:migrate:prod (npx prisma migrate deploy)\n`,
    };
  }

  return {
    allowed: true,
    tier,
    command,
    isProtected,
    isProduction,
  };
}

/**
 * Asserts that a command is safe, throwing an error if dangerous.
 */
export function assertSafeDbCommand(
  command: string,
  dbUrl = process.env.DATABASE_URL || '',
  nodeEnv = process.env.NODE_ENV || 'development'
): void {
  const result = evaluateDbCommandSafety(command, dbUrl, nodeEnv);
  if (!result.allowed) {
    console.error(result.reason);
    throw new Error(result.reason);
  }
}

/**
 * Recursively scans directory for release workflow definitions.
 */
function findWorkflowFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.next') {
        findWorkflowFiles(fullPath, fileList);
      }
    } else if (
      entry.name.endsWith('.yml') ||
      entry.name.endsWith('.yaml') ||
      entry.name === 'render.yaml' ||
      entry.name.startsWith('Dockerfile')
    ) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

/**
 * Scans CI/CD workflows and deployment configuration files for dangerous database commands.
 */
export function scanReleaseWorkflowsForDangerousCommands(baseDir?: string): WorkflowScanResult {
  const root = baseDir || path.resolve(process.cwd(), '..');
  const workspaceRoot = fs.existsSync(path.join(root, '.github')) ? root : process.cwd();

  const filesToScan: string[] = [];

  // 1. GitHub Workflows
  const ghDir = path.join(workspaceRoot, '.github', 'workflows');
  if (fs.existsSync(ghDir)) {
    findWorkflowFiles(ghDir, filesToScan);
  }

  // 2. Render blueprint
  const renderYaml = path.join(workspaceRoot, 'render.yaml');
  if (fs.existsSync(renderYaml)) filesToScan.push(renderYaml);

  // 3. Dockerfiles
  findWorkflowFiles(workspaceRoot, filesToScan);

  const violations: WorkflowScanViolation[] = [];
  const scannedFiles = Array.from(new Set(filesToScan));

  const bannedPatterns = [
    /prisma\s+db\s+push/i,
    /db\s+push/i,
    /prisma\s+migrate\s+reset/i,
    /migrate\s+reset/i,
    /--accept-data-loss/i,
    /--force-reset/i,
  ];

  for (const file of scannedFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((lineText, idx) => {
      // Ignore comment lines
      const trimmed = lineText.trim();
      if (trimmed.startsWith('#') || trimmed.startsWith('//')) return;

      for (const pattern of bannedPatterns) {
        if (pattern.test(lineText)) {
          violations.push({
            file: path.relative(workspaceRoot, file),
            line: idx + 1,
            content: trimmed,
            command: pattern.source,
          });
          break;
        }
      }
    });
  }

  return {
    passed: violations.length === 0,
    violations,
    scannedFiles,
  };
}

// CLI Execution Entrypoint
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--scan-workflows')) {
    console.log('🔍 Scanning CI/CD workflows and deployment files for dangerous DB commands...');
    const result = scanReleaseWorkflowsForDangerousCommands();
    console.log(`Scanned ${result.scannedFiles.length} deployment and workflow files.`);

    if (!result.passed) {
      console.error(`\n❌ CI WORKFLOW GOVERNANCE FAILURE! Found ${result.violations.length} dangerous DB commands:`);
      for (const v of result.violations) {
        console.error(`  - [${v.file}:${v.line}] matches "${v.command}": ${v.content}`);
      }
      process.exit(1);
    } else {
      console.log('✓ All release and CI workflows conform to database governance rules (zero dangerous commands).');
      process.exit(0);
    }
  }

  const cmd = args.join(' ');
  if (!cmd) {
    console.log('🛡️ Database Safety Guard active. No command specified.');
    process.exit(0);
  }

  try {
    assertSafeDbCommand(cmd);
    console.log(`✓ Command "${cmd}" is approved for current environment.`);
    process.exit(0);
  } catch {
    process.exit(1);
  }
}
