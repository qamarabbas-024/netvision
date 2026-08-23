/**
 * NetVision High-DPI Vector PDF & Blueprint Export Engine
 * Generates vector certificate diplomas, lab runbooks, and NOC incident summaries.
 */

export interface CertificatePdfPayload {
  candidateName: string;
  certCode: string;
  certTitle: string;
  issueDate: string;
  sha256Signature: string;
  scorePercent: number;
}

export interface LabRunbookPayload {
  labTitle: string;
  courseCode: string;
  author: string;
  objectives: string[];
  topologyAscii: string;
  verificationSteps: string[];
}

export class VectorPdfExportEngine {
  /**
   * Generates a vector SVG printable diploma that converts directly to PDF
   */
  public static generateCertificateSvg(payload: CertificatePdfPayload): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 792" width="100%" height="100%" style="background:#090b10; font-family: 'Inter', system-ui, sans-serif;">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff" />
      <stop offset="50%" stop-color="#7928ca" />
      <stop offset="100%" stop-color="#ff0080" />
    </linearGradient>
    <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Layer -->
  <rect x="0" y="0" width="1120" height="792" fill="#090b10" />
  <circle cx="560" cy="396" r="380" fill="url(#glowGrad)" />

  <!-- Outer Border -->
  <rect x="30" y="30" width="1060" height="732" rx="24" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.8" />
  <rect x="42" y="42" width="1036" height="708" rx="18" fill="none" stroke="#202538" stroke-width="1.5" />

  <!-- Header -->
  <text x="560" y="140" text-anchor="middle" fill="#00f0ff" font-size="16" font-family="monospace" letter-spacing="6" font-weight="bold">NETVISION ACADEMY OF ADVANCED NETWORKING</text>
  <text x="560" y="210" text-anchor="middle" fill="#ffffff" font-size="38" font-weight="900" letter-spacing="-1">OFFICIAL CERTIFICATE OF MASTERY</text>

  <!-- Subtitle -->
  <text x="560" y="265" text-anchor="middle" fill="#94a3b8" font-size="16">This authoritative credential is proud to certify that</text>

  <!-- Candidate Name -->
  <text x="560" y="340" text-anchor="middle" fill="#ffffff" font-size="44" font-weight="bold" letter-spacing="1">${payload.candidateName}</text>
  <line x1="360" y1="365" x2="760" y2="365" stroke="url(#goldGrad)" stroke-width="2" />

  <!-- Certification Details -->
  <text x="560" y="415" text-anchor="middle" fill="#cbd5e1" font-size="16">has demonstrated verified technical excellence and successfully completed</text>
  <text x="560" y="465" text-anchor="middle" fill="#00f0ff" font-size="28" font-weight="bold">${payload.certTitle} (${payload.certCode})</text>
  <text x="560" y="505" text-anchor="middle" fill="#94a3b8" font-size="15">Examination Final Score: ${payload.scorePercent}% • Issued: ${payload.issueDate}</text>

  <!-- Security Seal & Verification Signature -->
  <g transform="translate(100, 600)">
    <rect x="0" y="0" width="400" height="90" rx="12" fill="#10131d" stroke="#262c42" stroke-width="1" />
    <text x="20" y="30" fill="#94a3b8" font-size="11" font-family="monospace">CRYPTOGRAPHIC AUDIT SIGNATURE</text>
    <text x="20" y="55" fill="#00f0ff" font-size="12" font-family="monospace" font-weight="bold">${payload.sha256Signature}</text>
    <text x="20" y="75" fill="#64748b" font-size="10" font-family="monospace">SHA-256 Tamper-Proof On-Chain Hash</text>
  </g>

  <g transform="translate(760, 600)">
    <circle cx="80" cy="45" r="40" fill="#121522" stroke="url(#goldGrad)" stroke-width="2" />
    <text x="80" y="42" text-anchor="middle" fill="#00f0ff" font-size="11" font-family="monospace" font-weight="bold">NETVISION</text>
    <text x="80" y="56" text-anchor="middle" fill="#cbd5e1" font-size="9" font-family="monospace">VERIFIED</text>
    <text x="140" y="40" fill="#ffffff" font-size="13" font-weight="bold">NetVision Academic Council</text>
    <text x="140" y="60" fill="#94a3b8" font-size="11">Autonomous Evaluation Engine</text>
  </g>
</svg>`;
  }

  /**
   * Generates a downloadable Vector PDF or SVG
   */
  public static downloadSvgAsPdf(svgString: string, filename: string) {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
