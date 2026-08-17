export default function Custom404() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>404 - Page Not Found</h1>
        <p style={{ color: '#a1a1aa' }}>The requested resource could not be found.</p>
      </div>
    </div>
  );
}
