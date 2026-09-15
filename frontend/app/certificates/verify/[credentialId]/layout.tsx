import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ credentialId: string }>;
}): Promise<Metadata> {
  const { credentialId } = await params;
  const decodedId = decodeURIComponent(credentialId || '');

  return {
    title: `Verify Credential ${decodedId} | NetVision Public Registry`,
    description: `Authoritative cryptographic verification record for NetVision credential ${decodedId}. Verify status, track, and cryptographic integrity seal.`,
    alternates: {
      canonical: `/certificates/verify/${encodeURIComponent(decodedId)}`,
    },
    openGraph: {
      title: `Verify Credential ${decodedId} | NetVision Registry`,
      description: `Authoritative cryptographic verification record for NetVision credential ${decodedId}.`,
      url: `${SITE_URL}/certificates/verify/${encodeURIComponent(decodedId)}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Verify Credential ${decodedId} | NetVision Registry`,
      description: `Authoritative cryptographic verification record for NetVision credential ${decodedId}.`,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CredentialVerificationDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ credentialId: string }>;
}) {
  const { credentialId } = await params;
  const rawId = decodeURIComponent(credentialId || '');
  // Sanitize credential ID to strict alphanumeric + dash/underscore format
  const sanitizedId = /^[A-Za-z0-9\-_]{1,64}$/.test(rawId) ? rawId : rawId.replace(/[^A-Za-z0-9\-_]/g, '');

  const credentialSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: `NetVision Authoritative Credential ${sanitizedId}`,
    identifier: sanitizedId,
    credentialCategory: 'Certificate',
    recognizedBy: {
      '@type': 'EducationalOrganization',
      name: 'NetVision',
      url: SITE_URL,
    },
    url: `${SITE_URL}/certificates/verify/${encodeURIComponent(sanitizedId)}`,
  };

  // Safely serialize JSON-LD with < escaped to \u003c to prevent script tag breakout
  const safeJsonLd = JSON.stringify(credentialSchema).replace(/</g, '\\u003c');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />
      {children}
    </>
  );
}
