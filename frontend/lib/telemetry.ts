/**
 * NetVision Frontend Telemetry & Observability Layer.
 * Lightweight, production-safe client error monitoring and performance tracking.
 * Extensible for Sentry, OpenTelemetry, or DataDog integration.
 */

export interface TelemetryEvent {
  type: 'ERROR' | 'API_FAILURE' | 'ROUTE_CHANGE' | 'PERFORMANCE';
  message: string;
  timestamp: string;
  requestId?: string;
  endpoint?: string;
  statusCode?: number;
  stack?: string;
  context?: Record<string, any>;
}

export type TelemetrySink = (event: TelemetryEvent) => void;

class FrontendTelemetryManager {
  private sinks: TelemetrySink[] = [];
  private eventBuffer: TelemetryEvent[] = [];
  private readonly maxBufferSize = 50;

  constructor() {
    // Default console sink in development
    if (typeof window !== 'undefined') {
      this.addSink((event) => {
        if (process.env.NODE_ENV !== 'production') {
          if (event.type === 'ERROR' || event.type === 'API_FAILURE') {
            console.warn(`[Telemetry:${event.type}]`, event.message, event);
          }
        }
      });

      // Global window error listener
      window.addEventListener('error', (event) => {
        this.captureException(event.error || event.message, {
          source: 'window.onerror',
          filename: event.filename,
          lineno: event.lineno,
        });
      });

      // Unhandled Promise Rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.captureException(event.reason || 'Unhandled Promise Rejection', {
          source: 'unhandledrejection',
        });
      });
    }
  }

  public addSink(sink: TelemetrySink): void {
    this.sinks.push(sink);
  }

  public captureException(error: Error | string | any, context?: Record<string, any>): void {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    const event: TelemetryEvent = {
      type: 'ERROR',
      message: this.sanitize(message),
      stack: stack ? this.sanitize(stack) : undefined,
      timestamp: new Date().toISOString(),
      context: context ? this.sanitizeObject(context) : undefined,
    };

    this.emit(event);
  }

  public captureApiError(endpoint: string, statusCode: number, message: string, requestId?: string): void {
    const event: TelemetryEvent = {
      type: 'API_FAILURE',
      endpoint: this.sanitize(endpoint),
      statusCode,
      message: this.sanitize(message),
      requestId: requestId ? this.sanitize(requestId) : undefined,
      timestamp: new Date().toISOString(),
    };

    this.emit(event);
  }

  private emit(event: TelemetryEvent): void {
    this.eventBuffer.push(event);
    if (this.eventBuffer.length > this.maxBufferSize) {
      this.eventBuffer.shift();
    }

    for (const sink of this.sinks) {
      try {
        sink(event);
      } catch {
        // Telemetry sinks should never crash the user application
      }
    }
  }

  private sanitize(str: string): string {
    return str
      .replace(/Bearer\s+[A-Za-z0-9\-_.]+/gi, 'Bearer [REDACTED]')
      .replace(/token=[^&\s]+/gi, 'token=[REDACTED]')
      .replace(/password=[^&\s]+/gi, 'password=[REDACTED]')
      .replace(/re_[A-Za-z0-9_-]{20,}/gi, '[REDACTED_API_KEY]');
  }

  private sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (/password|token|secret|auth|cookie|key/i.test(k)) {
        sanitized[k] = '[REDACTED]';
      } else if (typeof v === 'string') {
        sanitized[k] = this.sanitize(v);
      } else {
        sanitized[k] = v;
      }
    }
    return sanitized;
  }
}

export const telemetry = new FrontendTelemetryManager();
