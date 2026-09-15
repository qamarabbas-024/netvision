import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Network Troubleshooting & Incident Break-Fix | NetVision',
  description:
    'Diagnose and remediate real-world computer networking anomalies: packet loss, duplex mismatches, DHCP exhaustion, DNS failures, and routing loops.',
  alternates: {
    canonical: '/troubleshooting',
  },
  openGraph: {
    title: 'Network Troubleshooting & Incident Break-Fix | NetVision',
    description:
      'Diagnose and remediate real-world computer networking anomalies and enterprise network outages.',
    url: `${SITE_URL}/troubleshooting`,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetVision Network Troubleshooting & Incident Break-Fix',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Network Troubleshooting & Incident Break-Fix | NetVision',
    description:
      'Diagnose and remediate real-world computer networking anomalies and enterprise network outages.',
    images: ['/og-image.png'],
  },
};

const troubleshootingPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'NetVision Network Troubleshooting Incident Catalog',
  description:
    'Interactive incident scenarios for network engineers to diagnose packet-level faults and routing anomalies.',
  url: `${SITE_URL}/troubleshooting`,
  publisher: {
    '@type': 'EducationalOrganization',
    name: 'NetVision',
    url: SITE_URL,
  },
};

export default function TroubleshootingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(troubleshootingPageSchema) }}
      />
      {children}
    </>
  );
}
