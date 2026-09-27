/**
 * Canonical site configuration derived from environment variables.
 * Falls back safely to http://localhost:3000 in local development,
 * and strictly prevents localhost canonical leakage in production environments.
 */
export function resolveCanonicalSiteUrl(overrideUrl?: string, overrideEnv?: string): string {
  const envUrl = (overrideUrl !== undefined ? overrideUrl : process.env.NEXT_PUBLIC_SITE_URL)?.trim();
  const isExplicitDev = overrideEnv === 'development';
  const isProduction = overrideEnv !== undefined ? overrideEnv === 'production' : process.env.NODE_ENV === 'production';

  if (envUrl) {
    const isLocalhost = envUrl.includes('localhost') || envUrl.includes('127.0.0.1');
    if ((isProduction || !isExplicitDev) && isLocalhost) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(
          '[SEO WARNING]: Production environment detected with localhost NEXT_PUBLIC_SITE_URL. Resolving to authoritative https://netvision.edu to prevent localhost canonical leakage.'
        );
      }
      return 'https://netvision.edu';
    }
    return envUrl.replace(/\/+$/, '');
  }

  if (isExplicitDev) {
    return 'http://localhost:3000';
  }

  return 'https://netvision.edu';
}

export const SITE_URL: string = resolveCanonicalSiteUrl();
