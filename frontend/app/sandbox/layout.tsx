import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deterministic Network CLI Sandbox',
  description:
    'Practice diagnostic networking commands (ping, traceroute, ifconfig, arp, netstat, route) in a safe, deterministic browser sandbox.',
  alternates: {
    canonical: '/sandbox',
  },
  openGraph: {
    title: 'Network CLI Sandbox | NetVision',
    description:
      'Practice real diagnostic networking commands in a deterministic virtual sandbox.',
    url: 'https://netvision-three.vercel.app/sandbox',
  },
};

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
