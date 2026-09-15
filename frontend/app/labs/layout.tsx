import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Hands-On Guided Network Labs | NetVision',
  description:
    'Practice real network configuration, subnetting, packet analysis, and device setup in step-by-step interactive labs.',
  alternates: {
    canonical: '/labs',
  },
  openGraph: {
    title: 'Hands-On Guided Network Labs | NetVision',
    description:
      'Practice real network configuration, subnetting, packet analysis, and device setup in step-by-step interactive labs.',
    url: `${SITE_URL}/labs`,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetVision Guided Network Labs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hands-On Guided Network Labs | NetVision',
    description:
      'Practice real network configuration, subnetting, and packet analysis in guided interactive labs.',
    images: ['/og-image.png'],
  },
};

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

