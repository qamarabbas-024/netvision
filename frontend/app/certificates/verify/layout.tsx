import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Public Credential Verification Registry | NetVision',
  description:
    'Authoritative public verification portal for NetVision computer networking certifications and credentials. Verify official issuance status and credential records.',
  alternates: {
    canonical: '/certificates/verify',
  },
  openGraph: {
    title: 'Public Credential Verification Registry | NetVision',
    description:
      'Authoritative public verification portal for NetVision computer networking certifications and credentials.',
    url: `${SITE_URL}/certificates/verify`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Public Credential Verification Registry | NetVision',
    description:
      'Authoritative public verification portal for NetVision computer networking certifications and credentials.',
    images: ['/og-image.png'],
  },
};

const verifyPortalSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'NetVision Public Credential Verification Registry',
  description:
    'Authoritative public registry for verifying NetVision computer networking certificates and credential records.',
  url: `${SITE_URL}/certificates/verify`,
  publisher: {
    '@type': 'EducationalOrganization',
    name: 'NetVision',
    url: SITE_URL,
  },
};

export default function CertificateVerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(verifyPortalSchema) }}
      />
      {children}
    </>
  );
}
