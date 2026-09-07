import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Benchmark & Certification Exams | NetVision',
  description: 'Evaluate your computer networking mastery through level benchmark assessments and timed NV-CERT capstone certification exams.',
  openGraph: {
    title: 'Benchmark & Certification Exams | NetVision',
    description: 'Evaluate your computer networking mastery through level benchmark assessments and timed NV-CERT capstone certification exams.',
  },
};

export default function ExamsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
