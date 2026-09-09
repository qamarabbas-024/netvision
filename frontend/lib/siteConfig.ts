/**
 * Canonical site configuration derived from environment variables.
 * Falls back safely to http://localhost:3000 in local development.
 */
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/+$/, '');
