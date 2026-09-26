/**
 * ==============================================================================
 * NETVISION — DATABASE OPERATION PRODUCTION SAFETY GUARD
 * ==============================================================================
 * Intercepts and blocks destructive database commands against production databases:
 * - prisma db push (drops partial indexes & unmodeled constraints)
 * - prisma db reset / migrate reset (drops database tables and all user records)
 *
 * Safe production commands:
 * - prisma migrate deploy
 * - prisma migrate status
 * ==============================================================================
 */

export const DANGEROUS_DB_COMMANDS = [
  'db push',
  'db reset',
  'migrate reset',
  'push',
  'reset',
] as const;

export const PRODUCTION_HOST_PATTERNS = [
  '.neon.tech',
  'amazonaws.com',
  'rds.',
  'railway.app',
  'supabase.co',
  'fly.dev',
  'render.com',
  'prod',
  'production',
];

export interface DbSafetyCheckResult {
  allowed: boolean;
  reason?: string;
  command: string;
  isProduction: boolean;
}

export function evaluateDbCommandSafety(
  command: string,
  dbUrl = process.env.DATABASE_URL || '',
  nodeEnv = process.env.NODE_ENV || 'development'
): DbSafetyCheckResult {
  const normalizedCmd = command.toLowerCase().trim();
  const normalizedUrl = dbUrl.toLowerCase();
  const normalizedEnv = nodeEnv.toLowerCase();

  const isDangerous = DANGEROUS_DB_COMMANDS.some(
    (dCmd) => normalizedCmd.includes(dCmd) || normalizedCmd === dCmd
  );

  const isProdEnv = normalizedEnv === 'production';
  const hasProdUrlPattern = PRODUCTION_HOST_PATTERNS.some((pattern) =>
    normalizedUrl.includes(pattern)
  );
  const isProductionTarget = isProdEnv || hasProdUrlPattern;

  if (isDangerous && isProductionTarget) {
    return {
      allowed: false,
      command,
      isProduction: true,
      reason:
        `⛔ DESTRUCTIVE DATABASE COMMAND BLOCKED!\n` +
        `Command "${command}" cannot be executed against a production database.\n` +
        `Target Environment: ${nodeEnv}\n` +
        `Target Database URL: ${dbUrl.replace(/:[^:@]+@/, ':****@')}\n\n` +
        `To deploy migrations safely in production, use:\n` +
        `  pnpm --filter netvision-backend prisma:migrate:prod (prisma migrate deploy)\n`,
    };
  }

  return {
    allowed: true,
    command,
    isProduction: isProductionTarget,
  };
}

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

// CLI Execution Entrypoint
if (require.main === module) {
  const args = process.argv.slice(2);
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
