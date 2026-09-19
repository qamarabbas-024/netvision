/**
 * Redaction utility for structured logging and telemetry.
 * Strips sensitive credentials, tokens, passwords, OTPs, and secrets from logs and error messages.
 */

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /jwt/i,
  /otp/i,
  /auth(orization)?/i,
  /cookie/i,
  /apikey/i,
  /api_key/i,
  /access_token/i,
  /refresh_token/i,
  /verification_code/i,
  /private_key/i,
  /cert/i,
  /correct_?answer/i,
  /answer_?key/i,
  /rubric/i,
  /grading_?key/i,
  /target_?state/i,
  /solution/i,
  /seed/i,
  /email/i,
];

const SENSITIVE_STRING_PATTERNS = [
  /Bearer\s+[A-Za-z0-9\-_.]+/gi,
  /postgres(ql)?:\/\/[^@\s]+:[^@\s]+@[^\s]+/gi,
  /redis:\/\/[^@\s]+:[^@\s]+@[^\s]+/gi,
  /mongodb(\+srv)?:\/\/[^@\s]+:[^@\s]+@[^\s]+/gi,
  /mysql:\/\/[^@\s]+:[^@\s]+@[^\s]+/gi,
  /sqlite:[^\s]+/gi,
  /re_[A-Za-z0-9_-]{20,}/gi, // Resend API keys
  /ey[A-Za-z0-9-_=]+\.ey[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+/gi, // JWT tokens
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, // Email addresses
  /[A-Za-z]:\\[^"'\n\r<>]+/gi, // Windows absolute file paths
  /\/(?:Users|home|var|tmp|etc|app|node_modules)\/[^"'\n\r<>]+/gi, // Unix file paths
  /Invalid\s+`prisma\.[^`]+`\s+invocation/gi, // Prisma invocation leakage
];

/**
 * Checks if an object key name is considered sensitive
 */
export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

/**
 * Recursively redacts sensitive keys and string patterns from an object or array.
 */
export function redactSensitiveData<T = any>(input: T, depth = 0): T {
  if (depth > 8 || input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    let sanitized: string = input;
    for (const pattern of SENSITIVE_STRING_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }
    return sanitized as any;
  }

  if (Array.isArray(input)) {
    return input.map((item) => redactSensitiveData(item, depth + 1)) as any;
  }

  if (typeof input === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(input as Record<string, any>)) {
      if (isSensitiveKey(key)) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = redactSensitiveData(value, depth + 1);
      }
    }
    return result as any;
  }

  return input;
}

/**
 * Formats a structured log payload with redaction applied
 */
export interface StructuredLogPayload {
  timestamp: string;
  level: 'LOG' | 'WARN' | 'ERROR' | 'DEBUG';
  context: string;
  message: string;
  requestId?: string;
  event?: string;
  durationMs?: number;
  metadata?: Record<string, any>;
}

export function createStructuredLog(
  level: StructuredLogPayload['level'],
  context: string,
  message: string,
  details?: {
    requestId?: string;
    event?: string;
    durationMs?: number;
    metadata?: Record<string, any>;
  }
): StructuredLogPayload {
  return {
    timestamp: new Date().toISOString(),
    level,
    context,
    message: redactSensitiveData(message),
    requestId: details?.requestId ? sanitizeRequestId(details.requestId) || details.requestId : undefined,
    event: details?.event,
    durationMs: details?.durationMs,
    metadata: details?.metadata ? redactSensitiveData(details.metadata) : undefined,
  };
}

/**
 * Validates and sanitizes a Request ID from incoming headers.
 * Must be alphanumeric with hyphens/underscores, between 4 and 64 characters.
 */
export function sanitizeRequestId(idCandidate?: string | null): string | null {
  if (!idCandidate || typeof idCandidate !== 'string') {
    return null;
  }
  const trimmed = idCandidate.trim();
  if (/^[A-Za-z0-9\-_]{4,64}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

