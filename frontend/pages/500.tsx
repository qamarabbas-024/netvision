export default function Custom500() {
  return (
    <div style={{ minHeight: '100vh', background: '#07090e', color: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '1.5rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center', backgroundColor: 'rgba(24, 24, 27, 0.7)', border: '1px solid rgba(39, 39, 42, 0.9)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ width: '4rem', height: '4rem', borderRadius: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#f87171', fontSize: '1.75rem' }}>
          ⚠
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.5rem', color: '#ffffff' }}>500 — System Fault</h1>
        <p style={{ fontSize: '0.875rem', color: '#a1a1aa', lineHeight: '1.5', marginBottom: '1.75rem' }}>
          An unexpected server error occurred during request execution. The anomaly has been isolated.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
          <a
            id="pages-500-dashboard-btn"
            href="/dashboard"
            style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', background: 'linear-gradient(to right, #06b6d4, #2563eb)', color: '#030712', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', boxShadow: '0 4px 14px 0 rgba(6, 182, 212, 0.3)' }}
          >
            Return to Dashboard
          </a>
          <a
            id="pages-500-home-btn"
            href="/"
            style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', backgroundColor: 'rgba(39, 39, 42, 0.8)', border: '1px solid rgba(63, 63, 70, 0.8)', color: '#e4e4e7', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
}
