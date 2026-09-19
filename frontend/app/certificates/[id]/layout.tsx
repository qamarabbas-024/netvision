import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learner Certificate View | NetVision',
  description: 'Learner personal credential dashboard and verification details.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CertificateDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
