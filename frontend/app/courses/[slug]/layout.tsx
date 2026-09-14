import type { Metadata } from 'next';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';
import { SITE_URL } from '@/lib/siteConfig';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = FLAGSHIP_5_COURSES.find((c) => c.slug === slug);
  if (!course) {
    return {
      title: 'Course Not Found | NetVision Curriculum',
      description: 'The requested networking course could not be found.',
    };
  }

  return {
    title: `${course.title} (${course.code}) | NetVision Curriculum`,
    description: course.description,
    alternates: {
      canonical: `/courses/${course.slug}`,
    },
    openGraph: {
      title: `${course.title} (${course.code}) | NetVision`,
      description: course.description,
      url: `${SITE_URL}/courses/${course.slug}`,
      type: 'website',
    },
  };
}

export default function CourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
