import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verified Networking Credentials & Badges | NetVision',
  description: 'View, download, and cryptographically verify earned NetVision networking credentials, capstone certificates, and skill badges.',
  openGraph: {
    title: 'Verified Networking Credentials & Badges | NetVision',
    description: 'View, download, and cryptographically verify earned NetVision networking credentials, capstone certificates, and skill badges.',
  },
};

export default function CertificatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
