import type { Metadata } from 'next';
import { getFallbackScenarioBySlug } from '@/data/troubleshootingFallbackData';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const scenario = getFallbackScenarioBySlug(resolvedParams?.slug);

  if (!scenario) {
    return {
      title: 'Break-Fix Incident Workbench | NetVision',
      description: 'Isolate, diagnose, and remediate real-world computer networking anomalies and outages.',
    };
  }

  return {
    title: `${scenario.title} — Network Troubleshooting | NetVision`,
    description: scenario.incidentDescription,
    openGraph: {
      title: `${scenario.title} — Network Troubleshooting | NetVision`,
      description: scenario.incidentDescription,
      type: 'website',
    },
  };
}

export default function TroubleshootingIncidentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
