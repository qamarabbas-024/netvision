import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Interactive Packet & Protocol Workbench | NetVision',
  description:
    'Inspect live packet dissections, hex bytes, header structures, and simulate real-time packet transit across virtual interfaces.',
  alternates: {
    canonical: '/workbench',
  },
  openGraph: {
    title: 'Interactive Packet & Protocol Workbench | NetVision',
    description:
      'Inspect live packet dissections, hex bytes, header structures, and simulate real-time packet transit across virtual interfaces.',
    url: `${SITE_URL}/workbench`,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetVision Packet Workbench',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Packet & Protocol Workbench | NetVision',
    description:
      'Inspect live packet dissections, hex bytes, header structures, and simulate real-time packet transit.',
    images: ['/og-image.png'],
  },
};

export default function WorkbenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

