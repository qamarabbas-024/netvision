import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Platform Architecture Specification | NetVision Docs',
  description:
    'Comprehensive architectural specification of NetVision: monorepo boundaries, NestJS backend, Prisma PostgreSQL schema, JWT session persistence, and security controls.',
  alternates: {
    canonical: '/docs/architecture',
  },
  openGraph: {
    title: 'Platform Architecture Specification | NetVision Docs',
    description:
      'Comprehensive architectural specification of NetVision: monorepo boundaries, NestJS backend, Prisma PostgreSQL schema, and security controls.',
    url: `${SITE_URL}/docs/architecture`,
    type: 'article',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetVision Platform Architecture Specification',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Platform Architecture Specification | NetVision Docs',
    description:
      'Comprehensive architectural specification of NetVision monorepo, NestJS backend, and security boundaries.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const docSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'NetVision Platform Architecture Specification',
  description:
    'Detailed technical architecture specification for the NetVision interactive computer networking platform.',
  url: `${SITE_URL}/docs/architecture`,
  publisher: {
    '@type': 'EducationalOrganization',
    name: 'NetVision',
    url: SITE_URL,
  },
};

export default function ArchitectureDocLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docSchema) }}
      />
      {children}
    </>
  );
}
