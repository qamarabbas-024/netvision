import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Networking Courses & Curriculum Catalog',
  description:
    'Explore 16 progressive computer networking courses from digital bit foundations to enterprise BGP routing and Wireshark packet capture analysis.',
  alternates: {
    canonical: '/courses',
  },
  openGraph: {
    title: 'Computer Networking Courses & Curriculum | NetVision',
    description:
      'Explore 16 progressive computer networking courses from digital foundations to enterprise routing.',
    url: 'https://netvision-three.vercel.app/courses',
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
