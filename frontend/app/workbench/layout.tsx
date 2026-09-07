import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Packet & Protocol Workbench | NetVision',
  description: 'Inspect live packet dissections, hex bytes, header structures, and simulate real-time packet transit across virtual interfaces.',
  openGraph: {
    title: 'Interactive Packet & Protocol Workbench | NetVision',
    description: 'Inspect live packet dissections, hex bytes, header structures, and simulate real-time packet transit across virtual interfaces.',
  },
};

export default function WorkbenchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
