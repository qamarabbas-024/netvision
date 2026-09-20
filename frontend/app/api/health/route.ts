import { NextResponse } from 'next/server';

/**
 * NetVision Frontend Liveness & Readiness Health Endpoint.
 * Lightweight 200 OK JSON probe for Docker, Kubernetes, and reverse proxies (ALB/Ingress).
 * Avoids triggering full homepage React SSR on continuous health checks.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'NetVision Frontend',
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
