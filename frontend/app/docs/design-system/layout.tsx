import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Design System & Visual Tokens | NetVision Docs',
  description:
    'Visual tokens, dark mode design principles, typography hierarchies, glassmorphism standards, and micro-interaction specifications powering NetVision.',
  alternates: {
    canonical: '/docs/design-system',
  },
  openGraph: {
    title: 'Design System & Visual Tokens | NetVision Docs',
    description:
      'Visual tokens, dark mode design principles, typography hierarchies, and glassmorphism standards powering NetVision.',
    url: `${SITE_URL}/docs/design-system`,
    type: 'article',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetVision Design System Specification',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design System & Visual Tokens | NetVision Docs',
    description:
      'Visual tokens, dark mode design principles, and glassmorphism standards powering NetVision.',
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
  headline: 'NetVision Design System & Visual Tokens Specification',
  description:
    'Visual tokens, dark theme standards, and UI guidelines for the NetVision interactive platform.',
  url: `${SITE_URL}/docs/design-system`,
  publisher: {
    '@type': 'EducationalOrganization',
    name: 'NetVision',
    url: SITE_URL,
  },
};

export default function DesignSystemDocLayout({
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
