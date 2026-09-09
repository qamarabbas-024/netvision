import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Network Engineering Daily Challenges & Scenarios',
  description:
    'Solve real-world networking scenarios, calculate subnets under time limits, and troubleshoot broken network paths in daily interactive challenges.',
  alternates: {
    canonical: '/challenges',
  },
  openGraph: {
    title: 'Networking Challenges & Scenarios | NetVision',
    description:
      'Solve real-world networking scenarios and troubleshoot broken network paths.',
    url: `${SITE_URL}/challenges`,
  },
};

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
