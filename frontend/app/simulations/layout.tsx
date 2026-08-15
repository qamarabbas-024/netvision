import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Network Protocol Simulator',
  description:
    'Real-time interactive network protocol visualizer. Simulate TCP 3-way handshakes, ARP resolutions, Subnetting, and DNS queries with step-by-step packet inspection.',
  alternates: {
    canonical: '/simulations',
  },
  openGraph: {
    title: 'Interactive Protocol Simulator | NetVision',
    description:
      'Simulate TCP handshakes, ARP, Subnetting, and DNS queries in real-time.',
    url: 'https://netvision-three.vercel.app/simulations',
  },
};

export default function SimulationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
