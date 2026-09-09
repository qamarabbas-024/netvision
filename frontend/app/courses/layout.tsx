import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Networking Courses & Curriculum Catalog',
  description:
    'Explore canonical progressive computer networking courses from digital bitstream foundations to enterprise application networking and security.',
  alternates: {
    canonical: '/courses',
  },
  openGraph: {
    title: 'Computer Networking Courses & Curriculum | NetVision',
    description:
      'Explore canonical progressive computer networking courses from digital foundations to enterprise routing.',
    url: `${SITE_URL}/courses`,
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
