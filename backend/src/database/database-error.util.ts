/**
 * NetVision Database Error Classification & Sanitization Engine
 *
 * Classifies database errors into authoritative operational categories:
 * - PROVIDER_QUOTA: Compute hours, rate limits, or project limits exceeded.
 * - AUTHENTICATION: Credential or access denial errors.
 * - SCHEMA_MIGRATION: Missing tables, columns, or relations.
 * - VALIDATION_CONSTRAINT: Unique, foreign key, null, or data length constraints.
 * - TRANSIENT_CONNECTION: Temporary socket closures, connection resets, deadlocks.
 * - CONNECTION_EXHAUSTED: Pool timeouts, host unreachable, connection refused.
 * - APPLICATION_FAULT: Unexpected database syntax or query execution errors.
 */

import { HttpStatus } from '@nestjs/common';

export enum DatabaseErrorCategory {
  PROVIDER_QUOTA = 'PROVIDER_QUOTA',
  AUTHENTICATION = 'AUTHENTICATION',
  SCHEMA_MIGRATION = 'SCHEMA_MIGRATION',
  VALIDATION_CONSTRAINT = 'VALIDATION_CONSTRAINT',
  TRANSIENT_CONNECTION = 'TRANSIENT_CONNECTION',
  CONNECTION_EXHAUSTED = 'CONNECTION_EXHAUSTED',
  APPLICATION_FAULT = 'APPLICATION_FAULT',
}

export interface ClassifiedDatabaseError {
  category: DatabaseErrorCategory;
  isRetryable: boolean;
  httpStatus: number;
  errorName: string;
  sanitizedMessage: string;
  retryAfterSeconds?: number;
}

/**
 * Determines whether a database error should be classified into a specific category.
 */
export function classifyDatabaseError(error: any): ClassifiedDatabaseError {
  const code: string = error?.code || '';
  const rawMessage: string = (error?.message || '').toLowerCase();

  // 1. PROVIDER QUOTA / RESOURCE LIMITS (Permanent / Administrative - 0 Retries)
  const isQuotaError =
    rawMessage.includes('exceeded the compute time quota') ||
    rawMessage.includes('compute time quota') ||
    rawMessage.includes('quota exceeded') ||
    rawMessage.includes('compute hours limit') ||
    rawMessage.includes('project has exceeded') ||
    rawMessage.includes('account or project has exceeded') ||
    rawMessage.includes('rate limit exceeded') ||
    rawMessage.includes('too many connections for role') ||
    rawMessage.includes('upgrade your plan');

  if (isQuotaError) {
    return {
      category: DatabaseErrorCategory.PROVIDER_QUOTA,
      isRetryable: false,
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE, // 503
      errorName: 'ServiceUnavailable',
      sanitizedMessage: 'Database service has reached its resource quota. Please retry shortly or contact your administrator.',
      retryAfterSeconds: 30,
    };
  }

  // 2. AUTHENTICATION & ACCESS CONTROL (Permanent - 0 Retries)
  const isAuthError =
    code === 'P1000' || // Authentication failed against database server
    code === 'P1010' || // User was denied access on the database
    rawMessage.includes('password authentication failed') ||
    rawMessage.includes('permission denied for database') ||
    rawMessage.includes('no pg_hba.conf entry');

  if (isAuthError) {
    return {
      category: DatabaseErrorCategory.AUTHENTICATION,
      isRetryable: false,
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE, // 503
      errorName: 'ServiceUnavailable',
      sanitizedMessage: 'Database service is temporarily unavailable due to configuration. Please retry shortly.',
      retryAfterSeconds: 15,
    };
  }

  // 3. SCHEMA & MIGRATION DRIFT (Permanent - 0 Retries)
  const isSchemaError =
    code === 'P1003' || // Database does not exist
    code === 'P2021' || // Table does not exist
    code === 'P2022' || // Column does not exist
    rawMessage.includes('does not exist in the current database') ||
    rawMessage.includes('relation') && rawMessage.includes('does not exist');

  if (isSchemaError) {
    return {
      category: DatabaseErrorCategory.SCHEMA_MIGRATION,
      isRetryable: false,
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE, // 503
      errorName: 'ServiceUnavailable',
      sanitizedMessage: 'Database schema synchronization is required. Please retry shortly.',
      retryAfterSeconds: 10,
    };
  }

  // 4. VALIDATION & CONSTRAINT ERRORS (Client / Domain Faults - 0 Retries)
  if (code === 'P2002') {
    return {
      category: DatabaseErrorCategory.VALIDATION_CONSTRAINT,
      isRetryable: false,
      httpStatus: HttpStatus.CONFLICT, // 409
      errorName: 'Conflict',
      sanitizedMessage: 'A record with this unique field already exists.',
    };
  }

  if (code === 'P2025') {
    return {
      category: DatabaseErrorCategory.VALIDATION_CONSTRAINT,
      isRetryable: false,
      httpStatus: HttpStatus.NOT_FOUND, // 404
      errorName: 'NotFound',
      sanitizedMessage: 'The requested database record was not found.',
    };
  }

  if (code === 'P2003') {
    return {
      category: DatabaseErrorCategory.VALIDATION_CONSTRAINT,
      isRetryable: false,
      httpStatus: HttpStatus.BAD_REQUEST, // 400
      errorName: 'BadRequest',
      sanitizedMessage: 'Foreign key constraint failed on the referenced record.',
    };
  }

  const isClientConstraintError =
    code === 'P2000' || // Value too long
    code === 'P2004' || // Constraint failed
    code === 'P2005' || // Invalid value stored in DB
    code === 'P2006' || // Invalid value provided
    code === 'P2007' || // Data validation error
    code === 'P2011' || // Null constraint violation
    code === 'P2012' || // Missing required value
    code === 'P2019' || // Input error
    code === 'P2020';   // Value out of range

  if (isClientConstraintError) {
    return {
      category: DatabaseErrorCategory.VALIDATION_CONSTRAINT,
      isRetryable: false,
      httpStatus: HttpStatus.BAD_REQUEST, // 400
      errorName: 'BadRequest',
      sanitizedMessage: 'Invalid database input data format or constraint violation.',
    };
  }

  // 5. TRANSIENT CONNECTION BLIPS (Retryable with bounded budget)
  const isTransient =
    code === 'P1017' || // Server has closed the connection
    code === 'P2034' || // Transaction failed due to a write conflict or a deadlock
    code === 'P1008' || // Operations timed out
    rawMessage.includes('server has closed the connection') ||
    rawMessage.includes('connection closed unexpectedly') ||
    rawMessage.includes('connection reset by peer') ||
    rawMessage.includes('connection terminated unexpectedly') ||
    rawMessage.includes('econnreset') ||
    rawMessage.includes('deadlock detected');

  if (isTransient) {
    return {
      category: DatabaseErrorCategory.TRANSIENT_CONNECTION,
      isRetryable: true,
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE, // 503
      errorName: 'ServiceUnavailable',
      sanitizedMessage: 'The database service is temporarily unavailable. Please retry shortly.',
      retryAfterSeconds: 2,
    };
  }

  // 6. CONNECTION POOL TIMEOUT & HOST UNREACHABLE (Fail-Fast - 0 or 1 Retry)
  const isConnectionExhausted =
    code === 'P1001' || // Can't reach database server
    code === 'P1002' || // The database server was reached but timed out
    code === 'P2024' || // Timed out fetching a new connection from the connection pool
    rawMessage.includes("can't reach database server") ||
    rawMessage.includes('timed out fetching a new connection') ||
    rawMessage.includes('connection pool') ||
    rawMessage.includes('econnrefused') ||
    rawMessage.includes('etimedout');

  if (isConnectionExhausted) {
    return {
      category: DatabaseErrorCategory.CONNECTION_EXHAUSTED,
      isRetryable: false, // Do NOT perform multi-second retry storms on exhausted pools or unreachable hosts
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE, // 503
      errorName: 'ServiceUnavailable',
      sanitizedMessage: 'The database connection pool is currently saturated or unreachable. Please retry shortly.',
      retryAfterSeconds: 5,
    };
  }

  // 7. DEFAULT / UNKNOWN APPLICATION FAULT
  const looksLikeDatabaseOutage =
    rawMessage.includes('database') ||
    rawMessage.includes('postgres') ||
    rawMessage.includes('prisma');

  return {
    category: DatabaseErrorCategory.APPLICATION_FAULT,
    isRetryable: false,
    httpStatus: looksLikeDatabaseOutage ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.INTERNAL_SERVER_ERROR,
    errorName: looksLikeDatabaseOutage ? 'ServiceUnavailable' : 'InternalServerError',
    sanitizedMessage: looksLikeDatabaseOutage
      ? 'A database service error occurred. Please try again shortly.'
      : 'An unexpected internal error occurred. Please try again.',
  };
}

/**
 * Checks whether an error is transient and safe for bounded retry.
 */
export function isRetryableDatabaseError(error: any): boolean {
  return classifyDatabaseError(error).isRetryable;
}
