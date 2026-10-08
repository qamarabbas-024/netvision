/**
 * ==============================================================================
 * NETVISION — EXTERNAL SYNTHETIC MONITORING PROBE & ALERT DISPATCHER
 * ==============================================================================
 * Usage:
 *   npx ts-node scripts/external-synthetic-probe.ts [--url <baseUrl>] [--timeout <ms>] [--simulate-incident]
 *
 * Implements NetVision Drop 18 Operational Monitoring:
 * 1. Probes production endpoints from an external process:
 *    - Process Liveness (/api/v1/health)
 *    - Subsystem Readiness (/api/v1/ready)
 *    - Active Alert Conditions (/api/v1/monitoring/alerts)
 * 2. Evaluates explicit operational alert conditions:
 *    - Liveness process failure (status !== 200)
 *    - Database outage (status === 503, database: disconnected)
 *    - High latency threshold exceeded (> 2500ms)
 *    - Active critical subsystem alert
 * 3. Dispatches authoritative alerts to delivery sinks:
 *    - Outbound Webhook (Discord / Slack / PagerDuty / Webhook via ALERT_WEBHOOK_URL)
 *    - Authoritative Incident Log Sink (.storage/incidents/incident-<id>.json)
 * ==============================================================================
 */

import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface EndpointProbeResult {
  endpoint: string;
  url: string;
  statusCode: number;
  latencyMs: number;
  body: any;
  error?: string;
}

export interface OperationalAlertCondition {
  conditionId: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  triggered: boolean;
  actualValue: any;
  threshold: any;
}

export interface IncidentRecord {
  incidentId: string;
  timestamp: string;
  targetBaseUrl: string;
  environment: string;
  severity: 'CRITICAL' | 'WARNING';
  triggeredConditions: OperationalAlertCondition[];
  probes: Record<string, EndpointProbeResult>;
  deliveryStatus: {
    webhookAttempted: boolean;
    webhookDelivered: boolean;
    webhookError?: string;
    incidentLogSaved: boolean;
    incidentLogPath?: string;
  };
}

export interface WebhookConfigStatus {
  configured: boolean;
  webhookUrlMasked?: string;
  provider: 'SLACK' | 'PAGERDUTY' | 'DISCORD' | 'GENERIC_WEBHOOK' | 'NONE';
  operationalDependency: 'CONFIGURED' | 'OPEN';
  incidentLogSinkAvailable: boolean;
  incidentLogDir: string;
}

export interface SyntheticProbeSummary {
  timestamp: string;
  targetBaseUrl: string;
  healthy: boolean;
  probes: Record<string, EndpointProbeResult>;
  conditionsEvaluated: OperationalAlertCondition[];
  activeAlertCount: number;
  incidentCreated: boolean;
  incident?: IncidentRecord;
  webhookConfig: WebhookConfigStatus;
}

export class ExternalSyntheticProbe {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly webhookUrl?: string;
  private readonly incidentDir: string;

  constructor(options?: {
    baseUrl?: string;
    timeoutMs?: number;
    webhookUrl?: string;
    incidentDir?: string;
  }) {
    this.baseUrl = (options?.baseUrl || process.env.API_URL || process.env.SITE_URL || 'http://localhost:4000').replace(/\/+$/, '');
    this.timeoutMs = options?.timeoutMs || 5000;
    this.webhookUrl = options?.webhookUrl || process.env.ALERT_WEBHOOK_URL;
    this.incidentDir = options?.incidentDir || path.join(process.cwd(), '.storage', 'incidents');
    this.ensureIncidentDir();
  }

  private ensureIncidentDir(): void {
    try {
      if (!fs.existsSync(this.incidentDir)) {
        fs.mkdirSync(this.incidentDir, { recursive: true });
      }
    } catch {}
  }

  /**
   * Evaluates whether external alerting channels (Slack, PagerDuty, or Webhook) are configured.
   * If unconfigured, explicitly marks the operational dependency as OPEN.
   */
  public getWebhookConfigurationStatus(): WebhookConfigStatus {
    const rawUrl = this.webhookUrl || process.env.ALERT_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL || process.env.PAGERDUTY_KEY;
    const hasUrl = !!(rawUrl && rawUrl.trim() !== '');

    if (!hasUrl) {
      return {
        configured: false,
        provider: 'NONE',
        operationalDependency: 'OPEN',
        incidentLogSinkAvailable: fs.existsSync(this.incidentDir),
        incidentLogDir: this.incidentDir,
      };
    }

    let provider: WebhookConfigStatus['provider'] = 'GENERIC_WEBHOOK';
    const lower = (rawUrl || '').toLowerCase();
    if (lower.includes('slack.com')) {
      provider = 'SLACK';
    } else if (lower.includes('pagerduty.com')) {
      provider = 'PAGERDUTY';
    } else if (lower.includes('discord.com')) {
      provider = 'DISCORD';
    }

    const masked = (rawUrl || '').replace(/(https?:\/\/[^/]+\/).*/, '$1*****');

    return {
      configured: true,
      webhookUrlMasked: masked,
      provider,
      operationalDependency: 'CONFIGURED',
      incidentLogSinkAvailable: fs.existsSync(this.incidentDir),
      incidentLogDir: this.incidentDir,
    };
  }

  /**
   * Performs an HTTP/HTTPS GET probe to a specific endpoint.
   */
  public async probeEndpoint(endpointPath: string, directUrl?: string): Promise<EndpointProbeResult> {
    let fullUrl = directUrl;
    if (!fullUrl) {
      if (this.baseUrl.endsWith('/api/v1') && endpointPath.startsWith('/api/v1/')) {
        fullUrl = `${this.baseUrl}${endpointPath.substring('/api/v1'.length)}`;
      } else {
        fullUrl = `${this.baseUrl}${endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`}`;
      }
    }
    const start = Date.now();

    return new Promise<EndpointProbeResult>((resolve) => {
      try {
        const parsedUrl = new URL(fullUrl!);
        const isHttps = parsedUrl.protocol === 'https:';
        const client = isHttps ? https : http;

        const req = client.get(
          fullUrl,
          {
            timeout: this.timeoutMs,
            headers: {
              'User-Agent': 'NetVision-Synthetic-Probe/1.0.0 (HealthMonitor)',
              Accept: 'application/json',
            },
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            res.on('end', () => {
              const latencyMs = Date.now() - start;
              let parsedBody: any = null;
              try {
                parsedBody = JSON.parse(data);
              } catch {
                parsedBody = data;
              }
              resolve({
                endpoint: endpointPath,
                url: fullUrl,
                statusCode: res.statusCode || 0,
                latencyMs,
                body: parsedBody,
              });
            });
          }
        );

        req.on('timeout', () => {
          req.destroy(new Error(`Probe request timed out after ${this.timeoutMs}ms`));
        });

        req.on('error', (err) => {
          const latencyMs = Date.now() - start;
          resolve({
            endpoint: endpointPath,
            url: fullUrl,
            statusCode: 0,
            latencyMs,
            body: null,
            error: err.message,
          });
        });
      } catch (err: any) {
        resolve({
          endpoint: endpointPath,
          url: fullUrl,
          statusCode: 0,
          latencyMs: Date.now() - start,
          body: null,
          error: err.message,
        });
      }
    });
  }

  /**
   * Evaluates operational alert conditions against probe responses.
   */
  public evaluateConditions(probes: Record<string, EndpointProbeResult>): OperationalAlertCondition[] {
    const conditions: OperationalAlertCondition[] = [];

    // Condition 1: Liveness Probe Process Availability
    const healthProbe = probes['health'] || probes['/api/v1/health'] || probes['/health'];
    const livenessOk = healthProbe && healthProbe.statusCode === 200;
    conditions.push({
      conditionId: 'PROCESS_LIVENESS_FAILED',
      severity: 'CRITICAL',
      description: 'API Node.js server process is offline, crashing, or returning non-200 on /health',
      triggered: !livenessOk,
      actualValue: healthProbe ? healthProbe.statusCode : 'UNREACHABLE',
      threshold: 200,
    });

    // Condition 2: Database Connectivity & Subsystem Readiness
    const readyProbe = probes['ready'] || probes['/api/v1/ready'] || probes['/ready'];
    const dbDisconnected =
      !readyProbe ||
      readyProbe.statusCode !== 200 ||
      readyProbe.body?.checks?.database === 'disconnected';
    conditions.push({
      conditionId: 'DATABASE_OUTAGE_DETECTED',
      severity: 'CRITICAL',
      description: 'Primary database connection failed: /ready probe returned non-200 or database disconnected',
      triggered: dbDisconnected,
      actualValue: readyProbe ? `${readyProbe.statusCode} (${readyProbe.body?.checks?.database || readyProbe.error || 'unknown'})` : 'UNREACHABLE',
      threshold: '200 OK (database: connected)',
    });

    // Condition 3: Latency Degradation
    const maxLatency = Math.max(...Object.values(probes).map((p) => p.latencyMs));
    const latencyExceeded = maxLatency > 2500;
    conditions.push({
      conditionId: 'PROBE_LATENCY_EXCEEDED',
      severity: 'WARNING',
      description: 'External probe latency exceeded 2500ms degradation threshold',
      triggered: latencyExceeded,
      actualValue: `${maxLatency}ms`,
      threshold: '<= 2500ms',
    });

    // Condition 4: Subsystem Operational Alerts
    const alertsProbe = probes['alerts'] || probes['/api/v1/monitoring/alerts'] || probes['/monitoring/alerts'];
    const hasCriticalAlerts =
      alertsProbe &&
      alertsProbe.body &&
      (alertsProbe.body.status === 'CRITICAL' || alertsProbe.body.activeAlertsCount > 0);
    conditions.push({
      conditionId: 'SUBSYSTEM_OPERATIONAL_ALERT',
      severity: 'CRITICAL',
      description: 'Internal monitoring service flagged active critical operational alerts',
      triggered: !!hasCriticalAlerts,
      actualValue: alertsProbe?.body?.status || 'UNKNOWN',
      threshold: 'NOMINAL',
    });

    return conditions;
  }

  /**
   * Dispatches an incident record to configured notification sinks (Webhook + Incident Log Sink).
   */
  public async deliverAlert(incident: IncidentRecord): Promise<IncidentRecord['deliveryStatus']> {
    const status: IncidentRecord['deliveryStatus'] = {
      webhookAttempted: false,
      webhookDelivered: false,
      incidentLogSaved: false,
    };

    // 1. Outbound Webhook Delivery
    if (this.webhookUrl) {
      status.webhookAttempted = true;
      try {
        const success = await this.sendWebhook(this.webhookUrl, incident);
        status.webhookDelivered = success;
      } catch (err: any) {
        status.webhookDelivered = false;
        status.webhookError = err?.message || String(err);
      }
    } else {
      status.webhookAttempted = false;
      status.webhookDelivered = false;
      status.webhookError = 'Operational dependency OPEN: ALERT_WEBHOOK_URL unconfigured; incident recorded in local file sink';
    }

    // 2. Authoritative Local Incident Sink (persists complete incident record including webhook delivery status)
    try {
      this.ensureIncidentDir();
      const filePath = path.join(this.incidentDir, `incident-${incident.incidentId}.json`);
      status.incidentLogSaved = true;
      status.incidentLogPath = filePath;
      incident.deliveryStatus = { ...status };
      fs.writeFileSync(filePath, JSON.stringify(incident, null, 2), 'utf8');
    } catch (err: any) {
      status.incidentLogSaved = false;
    }

    return status;
  }

  /**
   * Sends an HTTP/HTTPS POST notification to an alert webhook.
   */
  private async sendWebhook(webhookUrl: string, incident: IncidentRecord): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      try {
        const parsed = new URL(webhookUrl);
        const isHttps = parsed.protocol === 'https:';
        const client = isHttps ? https : http;

        const payload = JSON.stringify({
          source: 'NetVision External Synthetic Monitor',
          incidentId: incident.incidentId,
          timestamp: incident.timestamp,
          severity: incident.severity,
          environment: incident.environment,
          targetUrl: incident.targetBaseUrl,
          summary: `🚨 NetVision Production Alert: ${incident.triggeredConditions.map((c) => c.conditionId).join(', ')}`,
          triggeredConditions: incident.triggeredConditions,
        });

        const req = client.request(
          webhookUrl,
          {
            method: 'POST',
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload),
              'User-Agent': 'NetVision-Alert-Dispatcher/1.0.0',
            },
          },
          (res) => {
            resolve(res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false);
          }
        );

        req.on('timeout', () => {
          req.destroy(new Error('Webhook delivery timed out'));
        });
        req.on('error', () => {
          resolve(false);
        });

        req.write(payload);
        req.end();
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Executes complete end-to-end synthetic monitoring cycle.
   */
  public async executeProbeCycle(options?: {
    customProbes?: Record<string, EndpointProbeResult>;
    useRootPaths?: boolean;
  }): Promise<SyntheticProbeSummary> {
    const timestamp = new Date().toISOString();

    // 1. Execute probes across endpoints
    let probes: Record<string, EndpointProbeResult> = {};
    if (options?.customProbes) {
      probes = options.customProbes;
    } else {
      const healthPath = options?.useRootPaths ? '/health' : '/api/v1/health';
      const readyPath = options?.useRootPaths ? '/ready' : '/api/v1/ready';
      const alertsPath = options?.useRootPaths ? '/monitoring/alerts' : '/api/v1/monitoring/alerts';

      const [health, ready, alerts] = await Promise.all([
        this.probeEndpoint(healthPath),
        this.probeEndpoint(readyPath),
        this.probeEndpoint(alertsPath),
      ]);
      probes = { health, ready, alerts };
    }

    // 2. Evaluate alert conditions
    const conditions = this.evaluateConditions(probes);
    const triggered = conditions.filter((c) => c.triggered);
    const isHealthy = triggered.length === 0;

    let incident: IncidentRecord | undefined = undefined;

    // 3. Deliver alert if any conditions triggered
    if (!isHealthy) {
      const incidentId = `INC-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      const severity = triggered.some((c) => c.severity === 'CRITICAL') ? 'CRITICAL' : 'WARNING';

      incident = {
        incidentId,
        timestamp,
        targetBaseUrl: this.baseUrl,
        environment: process.env.NODE_ENV || 'production',
        severity,
        triggeredConditions: triggered,
        probes,
        deliveryStatus: {
          webhookAttempted: false,
          webhookDelivered: false,
          incidentLogSaved: false,
        },
      };

      incident.deliveryStatus = await this.deliverAlert(incident);
    }

    const webhookConfig = this.getWebhookConfigurationStatus();

    return {
      timestamp,
      targetBaseUrl: this.baseUrl,
      healthy: isHealthy,
      probes,
      conditionsEvaluated: conditions,
      activeAlertCount: triggered.length,
      incidentCreated: !isHealthy,
      incident,
      webhookConfig,
    };
  }
}

// -----------------------------------------------------------------------------
// CLI Execution
// -----------------------------------------------------------------------------
async function runCli(): Promise<void> {
  const args = process.argv.slice(2);
  let targetUrl = process.env.API_URL || 'http://localhost:4000';
  let simulate = false;
  let simulateHealthy = false;
  let useRootPaths = false;
  let allowPending = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      targetUrl = args[i + 1];
      i++;
    } else if (args[i] === '--simulate-incident') {
      simulate = true;
    } else if (args[i] === '--simulate-healthy') {
      simulateHealthy = true;
    } else if (args[i] === '--root-paths') {
      useRootPaths = true;
    } else if (args[i] === '--allow-pending') {
      allowPending = true;
    }
  }

  console.log(`[Synthetic Monitor] Probing target: ${targetUrl}...`);
  const monitor = new ExternalSyntheticProbe({ baseUrl: targetUrl });
  const webhookStatus = monitor.getWebhookConfigurationStatus();
  console.log(`[Synthetic Monitor] Operational Alerting Channel: ${webhookStatus.operationalDependency} (Provider: ${webhookStatus.provider})`);

  let summary: SyntheticProbeSummary;
  if (simulate) {
    console.log('[Synthetic Monitor] Running simulated outage probe cycle...');
    summary = await monitor.executeProbeCycle({
      customProbes: {
        health: { endpoint: '/api/v1/health', url: `${targetUrl}/api/v1/health`, statusCode: 200, latencyMs: 12, body: { status: 'ok' } },
        ready: { endpoint: '/api/v1/ready', url: `${targetUrl}/api/v1/ready`, statusCode: 503, latencyMs: 45, body: { status: 'unhealthy', checks: { database: 'disconnected' } } },
        alerts: { endpoint: '/api/v1/monitoring/alerts', url: `${targetUrl}/api/v1/monitoring/alerts`, statusCode: 200, latencyMs: 15, body: { status: 'CRITICAL', activeAlertsCount: 1 } },
      },
    });
  } else if (simulateHealthy) {
    console.log('[Synthetic Monitor] Running simulated healthy probe cycle...');
    summary = await monitor.executeProbeCycle({
      customProbes: {
        health: { endpoint: '/api/v1/health', url: `${targetUrl}/api/v1/health`, statusCode: 200, latencyMs: 12, body: { status: 'ok' } },
        ready: { endpoint: '/api/v1/ready', url: `${targetUrl}/api/v1/ready`, statusCode: 200, latencyMs: 18, body: { status: 'ready', checks: { database: 'connected' } } },
        alerts: { endpoint: '/api/v1/monitoring/alerts', url: `${targetUrl}/api/v1/monitoring/alerts`, statusCode: 200, latencyMs: 15, body: { status: 'NOMINAL', activeAlertsCount: 0 } },
      },
    });
  } else {
    summary = await monitor.executeProbeCycle({ useRootPaths });
  }

  console.log(`[Synthetic Monitor] Cycle Complete at ${summary.timestamp}`);
  console.log(`  Healthy: ${summary.healthy}`);
  console.log(`  Triggered Conditions: ${summary.activeAlertCount}`);
  if (summary.incident) {
    console.log(`  🚨 Incident Created: ${summary.incident.incidentId} (Severity: ${summary.incident.severity})`);
    console.log(`  Webhook Delivered: ${summary.incident.deliveryStatus.webhookDelivered}`);
    console.log(`  Incident Log Saved: ${summary.incident.deliveryStatus.incidentLogSaved} (${summary.incident.deliveryStatus.incidentLogPath})`);
  }

  if (!summary.healthy) {
    if (allowPending) {
      console.warn(`\n⚠️ [Synthetic Monitor] TARGET PENDING/STAGING: ${summary.activeAlertCount} condition(s) detected, but --allow-pending was specified. Exiting cleanly without breaking CI.`);
      process.exit(0);
    }
    console.error(`\n❌ [Synthetic Monitor] PROBE FAILED: Target system is UNHEALTHY! (${summary.activeAlertCount} critical condition(s) triggered)`);
    process.exit(1);
  }

  console.log(`\n✓ [Synthetic Monitor] PROBE PASSED: Target system is healthy.`);
  process.exit(0);
}

const isMain = (typeof require !== 'undefined' && require.main === module) ||
  (typeof process !== 'undefined' && process.argv[1] && process.argv[1].includes('external-synthetic-probe'));
if (isMain) {
  runCli().catch((err) => {
    console.error('Fatal probe error:', err);
    process.exit(1);
  });
}
