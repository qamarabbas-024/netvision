import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: '13-Step Visual Pedagogy Blueprint | NetVision Docs',
  description:
    'Core pedagogical learning framework: from hard concepts to simple analogies, interactive 3D visualizers, real CLI packet simulations, and 80% mastery threshold testing.',
  alternates: {
    canonical: '/docs/pedagogy-blueprint',
  },
  openGraph: {
    title: '13-Step Visual Pedagogy Blueprint | NetVision Docs',
    description:
      'Core pedagogical learning framework: from hard concepts to simple analogies, interactive 3D visualizers, and real CLI packet simulations.',
    url: `${SITE_URL}/docs/pedagogy-blueprint`,
    type: 'article',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetVision 13-Step Visual Pedagogy Blueprint',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '13-Step Visual Pedagogy Blueprint | NetVision Docs',
    description:
      'Core pedagogical learning framework for computer networking mastery.',
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
  headline: 'NetVision 13-Step Visual Pedagogy Blueprint',
  description:
    'The 13-step methodology powering computer networking mastery on NetVision.',
  url: `${SITE_URL}/docs/pedagogy-blueprint`,
  publisher: {
    '@type': 'EducationalOrganization',
    name: 'NetVision',
    url: SITE_URL,
  },
};

export default function PedagogyBlueprintDocLayout({
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
