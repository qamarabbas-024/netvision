import type { Metadata } from 'next';
import { CANONICAL_CREDENTIALS } from '@netvision/shared';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Official Certification & Credential Catalog | NetVision',
  description:
    'Explore authoritative NetVision computer networking certifications, course specialist credentials, and the pinnacle Master Network Engineer credential.',
  alternates: {
    canonical: '/certificates',
  },
  openGraph: {
    title: 'Official Certification & Credential Catalog | NetVision',
    description:
      'Explore authoritative NetVision computer networking certifications, specialist credentials, and the Master Network Engineer credential.',
    url: `${SITE_URL}/certificates`,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetVision Official Certification & Credential Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Official Certification & Credential Catalog | NetVision',
    description:
      'Explore authoritative NetVision computer networking certifications and credentials.',
    images: ['/og-image.png'],
  },
};

const credentialsCatalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'NetVision Authoritative Credential Catalog',
  description:
    'Official computer networking specialist and pinnacle master credentials awarded by NetVision.',
  itemListElement: CANONICAL_CREDENTIALS.map((cred, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'EducationalOccupationalCredential',
      name: cred.title,
      identifier: cred.code,
      description: cred.description,
      credentialCategory: cred.isMastery ? 'Mastery Certification' : 'Specialist Certification',
      recognizedBy: {
        '@type': 'EducationalOrganization',
        name: 'NetVision',
        url: SITE_URL,
      },
      url: `${SITE_URL}/certificates`,
    },
  })),
};

export default function CertificatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(credentialsCatalogSchema) }}
      />
      {children}
    </>
  );
}

