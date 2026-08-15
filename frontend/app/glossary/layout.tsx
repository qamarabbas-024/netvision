import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Computer Networking Terms & Protocol Glossary',
  description:
    'Searchable dictionary of computer networking terminology, RFC standards, protocol definitions, and acronyms from Layer 1 to Layer 7.',
  alternates: {
    canonical: '/glossary',
  },
  openGraph: {
    title: 'Computer Networking Glossary & Terms | NetVision',
    description:
      'Searchable dictionary of computer networking terminology and protocol definitions.',
    url: 'https://netvision-three.vercel.app/glossary',
  },
};

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
