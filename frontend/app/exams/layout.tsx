import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Benchmark & Certification Exams | NetVision',
  description:
    'Evaluate your computer networking mastery through level benchmark assessments and timed NV-CERT capstone certification exams.',
  alternates: {
    canonical: '/exams',
  },
  openGraph: {
    title: 'Benchmark & Certification Exams | NetVision',
    description:
      'Evaluate your computer networking mastery through level benchmark assessments and timed NV-CERT capstone certification exams.',
    url: `${SITE_URL}/exams`,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetVision Benchmark & Certification Exams',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benchmark & Certification Exams | NetVision',
    description:
      'Evaluate your computer networking mastery through level benchmark assessments and timed NV-CERT capstone certification exams.',
    images: ['/og-image.png'],
  },
};

export default function ExamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

