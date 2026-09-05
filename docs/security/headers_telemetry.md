# Security Headers Specification & Performance Telemetry

## Enforced HTTP Security Headers
- `Content-Security-Policy`: Default strict with authorized script and style nonces.
- `X-Content-Type-Options`: `nosniff`
- `X-Frame-Options`: `DENY`
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Permissions-Policy`: `camera=(), microphone=(), geolocation=()`

## Performance Target
- Lighthouse Performance: 98+
- Core Web Vitals (LCP < 1.2s, INP < 50ms, CLS 0.0)
