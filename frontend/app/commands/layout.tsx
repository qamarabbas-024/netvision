import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Network Command Reference & Diagnostics Cheatsheet',
  description:
    'Comprehensive reference guide for Windows, Linux, and Cisco networking commands including ipconfig, ifconfig, ping, traceroute, and netstat.',
  alternates: {
    canonical: '/commands',
  },
  openGraph: {
    title: 'Network Command Reference & Diagnostics | NetVision',
    description:
      'Comprehensive reference guide for networking diagnostic tools and CLI commands.',
    url: 'https://netvision-three.vercel.app/commands',
  },
};

export default function CommandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
