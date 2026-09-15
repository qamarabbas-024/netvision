import type { Metadata } from 'next';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';
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
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetVision Computer Networking Curriculum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Computer Networking Courses & Curriculum | NetVision',
    description:
      'Explore canonical progressive computer networking courses from digital foundations to enterprise routing.',
    images: ['/og-image.png'],
  },
};

const coursesListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'NetVision Computer Networking Curriculum',
  description:
    'Progressive networking courses from physical foundations to advanced network engineering.',
  itemListElement: FLAGSHIP_5_COURSES.map((course, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'Course',
      name: course.title,
      courseCode: course.code,
      description: course.description,
      educationalLevel: course.level,
      url: `${SITE_URL}/courses/${course.slug}`,
      provider: {
        '@type': 'EducationalOrganization',
        name: 'NetVision',
        url: SITE_URL,
      },
    },
  })),
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesListSchema) }}
      />
      {children}
    </>
  );
}

