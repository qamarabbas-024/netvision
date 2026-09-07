import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hands-On Guided Network Labs | NetVision',
  description: 'Practice real network configuration, subnetting, packet analysis, and device setup in step-by-step interactive labs.',
  openGraph: {
    title: 'Hands-On Guided Network Labs | NetVision',
    description: 'Practice real network configuration, subnetting, packet analysis, and device setup in step-by-step interactive labs.',
  },
};

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
