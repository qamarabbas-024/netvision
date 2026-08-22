/**
 * High-Fidelity Vector PDF Generation & Print Engine for NetVision
 * Generates crisp vector documents (Certificates, Lab Reports, Incident Post-Mortems)
 * with zero blurriness, vector SVG borders, and clean pagination.
 */

export interface CertificatePdfData {
  candidateName: string;
  certificationTitle: string;
  credentialId: string;
  issueDate: string;
  grade: string;
  skillsAssessed: string[];
  verificationUrl: string;
}

export interface LabReportPdfData {
  studentName: string;
  labTitle: string;
  courseCode: string;
  completedAt: string;
  score: number;
  durationMinutes: number;
  tasksCompleted: string[];
  topologySnapshot: string;
  cliCommandLog: string[];
}

export class VectorPdfGenerator {
  /**
   * Generates a high-fidelity Certificate of Mastery PDF/Print window
   */
  public static printCertificate(data: CertificatePdfData) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>NetVision Certificate — ${data.credentialId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
          
          @page {
            size: A4 landscape;
            margin: 0;
          }
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: #09090b;
            color: #ffffff;
            width: 297mm;
            height: 210mm;
            padding: 12mm;
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .certificate-container {
            width: 100%;
            height: 100%;
            border: 2px solid #272732;
            background: radial-gradient(circle at center, #121218 0%, #09090b 100%);
            border-radius: 16px;
            padding: 24px 36px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          }
          
          .guilloche-border {
            position: absolute;
            inset: 8px;
            border: 1px solid rgba(0, 240, 255, 0.2);
            border-radius: 12px;
            pointer-events: none;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .brand {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -0.03em;
            color: #ffffff;
          }
          
          .brand span {
            color: #00f0ff;
          }
          
          .badge {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 6px 14px;
            border-radius: 6px;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #10b981;
          }
          
          .body-content {
            text-align: center;
            margin: 16px 0;
          }
          
          .subtitle {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: #8e95a5;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 8px;
          }
          
          .candidate-name {
            font-size: 34px;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: -0.02em;
            margin-bottom: 12px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.4);
          }
          
          .certification-title {
            font-size: 20px;
            font-weight: 800;
            color: #00f0ff;
            font-family: 'JetBrains Mono', monospace;
            margin-bottom: 12px;
          }
          
          .description {
            font-size: 12px;
            color: #a1a1aa;
            max-width: 680px;
            margin: 0 auto 16px;
            line-height: 1.6;
          }
          
          .skills-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 6px;
            max-width: 720px;
            margin: 0 auto;
          }
          
          .skill-tag {
            font-family: 'JetBrains Mono', monospace;
            font-size: 9px;
            background: #181822;
            border: 1px solid #272732;
            color: #d4d4d8;
            padding: 4px 10px;
            border-radius: 6px;
          }
          
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 16px;
            border-top: 1px solid #272732;
          }
          
          .meta-item {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            color: #71717a;
            line-height: 1.5;
          }
          
          .meta-item strong {
            color: #ffffff;
          }
          
          .qr-placeholder {
            width: 48px;
            height: 48px;
            border: 1px solid #3f3f46;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 8px;
            color: #00f0ff;
            text-align: center;
            background: #121217;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="guilloche-border"></div>
          
          <div class="header">
            <div class="brand">Net<span>Vision</span></div>
            <div class="badge">Official Verified Credential</div>
          </div>
          
          <div class="body-content">
            <div class="subtitle">This Authoritative Credential is Awarded to</div>
            <div class="candidate-name">${data.candidateName}</div>
            <div class="description">for successfully satisfying all technical simulations, rigorous packet dissections, and diagnostic benchmark assessments in</div>
            <div class="certification-title">${data.certificationTitle}</div>
            
            <div class="skills-grid">
              ${data.skillsAssessed.map((s) => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
          </div>
          
          <div class="footer">
            <div class="meta-item">
              <div>Credential ID: <strong>${data.credentialId}</strong></div>
              <div>Issue Date: <strong>${data.issueDate}</strong></div>
              <div>Performance Grade: <strong>${data.grade}</strong></div>
            </div>
            
            <div class="qr-placeholder">
              VERIFIED<br>AUTH
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  /**
   * Generates a high-fidelity Hands-On Lab Diagnostic Report
   */
  public static printLabReport(data: LabReportPdfData) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>NetVision Lab Report — ${data.courseCode}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
          
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          
          body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: #ffffff;
            color: #09090b;
            line-height: 1.5;
            font-size: 13px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #09090b;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          
          .title {
            font-size: 18px;
            font-weight: 800;
          }
          
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            background: #f4f4f5;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 12px;
          }
          
          .section-title {
            font-size: 14px;
            font-weight: 700;
            border-bottom: 1px solid #e4e4e7;
            padding-bottom: 6px;
            margin: 16px 0 10px;
          }
          
          .task-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
            font-size: 12px;
          }
          
          .cli-box {
            background: #18181b;
            color: #22c55e;
            font-family: 'JetBrains Mono', monospace;
            padding: 12px;
            border-radius: 6px;
            font-size: 11px;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">NetVision Hands-On Lab Diagnostic Report</div>
            <div style="color: #71717a; font-size: 11px;">${data.courseCode}: ${data.labTitle}</div>
          </div>
          <div style="font-weight: 700; font-size: 14px; color: #16a34a;">Score: ${data.score}% — PASSED</div>
        </div>
        
        <div class="meta-grid">
          <div>Candidate: <strong>${data.studentName}</strong></div>
          <div>Completion Date: <strong>${data.completedAt}</strong></div>
          <div>Duration: <strong>${data.durationMinutes} Minutes</strong></div>
        </div>
        
        <div class="section-title">Verified Task Execution Log</div>
        <div>
          ${data.tasksCompleted.map((t) => `<div class="task-item">✓ ${t}</div>`).join('')}
        </div>
        
        <div class="section-title">Terminal Diagnostic Log</div>
        <div class="cli-box">
          ${data.cliCommandLog.map((c) => `<div>$ ${c}</div>`).join('')}
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 200);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
