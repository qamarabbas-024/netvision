import type { Metadata } from 'next';
import { FALLBACK_COURSES } from '@/lib/courseCatalogData';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const course = FALLBACK_COURSES.find((c) => c.slug === resolvedParams?.slug);

  if (!course) {
    return {
      title: 'Networking Course | NetVision',
      description: 'Explore interactive computer networking courses with visual protocol instruments and labs.',
    };
  }

  return {
    title: `${course.code}: ${course.title} | NetVision`,
    description: course.tagline || course.description,
    openGraph: {
      title: `${course.code}: ${course.title} | NetVision`,
      description: course.tagline || course.description,
      type: 'website',
    },
  };
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
