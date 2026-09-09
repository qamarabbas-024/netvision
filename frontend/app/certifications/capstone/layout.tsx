import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Master Capstone Examination (NV-NET-MASTERY) | NetVision',
  description: 'Timed 120-minute server-authoritative certification examination for NetVision Network Engineering Mastery.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CapstoneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
