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
  const decodedId = decodeURIComponent(credentialId || '');

  const credentialSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: `NetVision Authoritative Credential ${decodedId}`,
    identifier: decodedId,
    credentialCategory: 'Certificate',
    recognizedBy: {
      '@type': 'EducationalOrganization',
      name: 'NetVision',
      url: SITE_URL,
    },
    url: `${SITE_URL}/certificates/verify/${encodeURIComponent(decodedId)}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(credentialSchema) }}
      />
      {children}
    </>
  );
}
