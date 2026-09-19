import type { Metadata } from 'next';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';
import { SITE_URL } from '@/lib/siteConfig';

function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const course = FLAGSHIP_5_COURSES.find((c) => c.slug === slug);
  const formattedLessonTitle = formatSlugToTitle(lessonSlug);
  const courseCode = course ? ` (${course.code})` : '';
  const courseTitle = course ? course.title : 'NetVision Curriculum';

  const title = `${formattedLessonTitle}${courseCode} | ${courseTitle}`;
  const description = `Interactive lesson on ${formattedLessonTitle} as part of the ${courseTitle} curriculum. Includes step-by-step theory, interactive visual simulation, and terminal verification.`;
  const canonicalUrl = `/courses/${slug}/lessons/${lessonSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalUrl}`,
      type: 'article',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${formattedLessonTitle} — NetVision Interactive Lesson`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LessonDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const course = FLAGSHIP_5_COURSES.find((c) => c.slug === slug);
  const formattedLessonTitle = formatSlugToTitle(lessonSlug);
  const canonicalUrl = `${SITE_URL}/courses/${slug}/lessons/${lessonSlug}`;

  const learningResourceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: formattedLessonTitle,
    description: `Interactive computer networking lesson covering ${formattedLessonTitle}.`,
    educationalLevel: course?.level || 'Beginner',
    learningResourceType: 'Interactive Lesson',
    url: canonicalUrl,
    isAccessibleForFree: true,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'NetVision',
      url: SITE_URL,
    },
    ...(course
      ? {
          isPartOf: {
            '@type': 'Course',
            name: course.title,
            courseCode: course.code,
            url: `${SITE_URL}/courses/${course.slug}`,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceSchema) }}
      />
      {children}
    </>
  );
}
