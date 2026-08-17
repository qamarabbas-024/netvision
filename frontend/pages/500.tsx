export default function Custom500() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>500 - Server Error</h1>
        <p style={{ color: '#a1a1aa' }}>An unexpected server error occurred.</p>
      </div>
    </div>
  );
}
