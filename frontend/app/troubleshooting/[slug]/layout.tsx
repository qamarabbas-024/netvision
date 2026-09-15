import type { Metadata } from 'next';
import { getFallbackScenarioBySlug } from '@/data/troubleshootingFallbackData';
import { SITE_URL } from '@/lib/siteConfig';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const scenario = getFallbackScenarioBySlug(slug);

  if (!scenario) {
    return {
      title: 'Break-Fix Incident Workbench | NetVision',
      description:
        'Isolate, diagnose, and remediate real-world computer networking anomalies and outages.',
    };
  }

  return {
    title: `${scenario.title} — Network Troubleshooting | NetVision`,
    description: scenario.incidentDescription,
    alternates: {
      canonical: `/troubleshooting/${slug}`,
    },
    openGraph: {
      title: `${scenario.title} — Network Troubleshooting | NetVision`,
      description: scenario.incidentDescription,
      url: `${SITE_URL}/troubleshooting/${slug}`,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${scenario.title} — NetVision Troubleshooting`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${scenario.title} — Network Troubleshooting | NetVision`,
      description: scenario.incidentDescription,
      images: ['/og-image.png'],
    },
  };
}

export default async function TroubleshootingIncidentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const scenario = getFallbackScenarioBySlug(slug);

  const scenarioSchema = scenario
    ? {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: scenario.title,
        description: scenario.incidentDescription,
        proficiencyLevel: scenario.difficulty,
        url: `${SITE_URL}/troubleshooting/${slug}`,
        author: {
          '@type': 'EducationalOrganization',
          name: 'NetVision',
          url: SITE_URL,
        },
        publisher: {
          '@type': 'EducationalOrganization',
          name: 'NetVision',
          url: SITE_URL,
        },
      }
    : null;

  return (
    <>
      {scenarioSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(scenarioSchema) }}
        />
      )}
      {children}
    </>
  );
}

