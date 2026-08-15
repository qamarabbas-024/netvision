import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Documentation & Learning Guides',
  description:
    'Documentation, visual guides, and architecture specifications for the NetVision interactive networking learning platform.',
  alternates: {
    canonical: '/docs',
  },
  openGraph: {
    title: 'Documentation & Guides | NetVision',
    description:
      'Platform documentation, visual guides, and specifications for NetVision.',
    url: 'https://netvision-three.vercel.app/docs',
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
