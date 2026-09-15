import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Certificate Document | NetVision',
  description: 'Learner certificate document and credential viewer.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivateCertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
