import type { Metadata } from 'next';
import { FLAGSHIP_5_COURSES, CANONICAL_CREDENTIALS } from '@netvision/shared';
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
      title: `${course.title} (${course.code}) | NetVision Curriculum`,
      description: course.description,
      url: `${SITE_URL}/courses/${course.slug}`,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${course.title} — NetVision Curriculum`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.title} (${course.code}) | NetVision Curriculum`,
      description: course.description,
      images: ['/og-image.png'],
    },
  };
}

export default async function CourseDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = FLAGSHIP_5_COURSES.find((c) => c.slug === slug);
  const credential = course
    ? CANONICAL_CREDENTIALS.find((c) => c.code === course.credentialCode)
    : undefined;

  const courseJsonLd = course
    ? {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        courseCode: course.code,
        description: course.description,
        educationalLevel: course.level,
        timeRequired: `PT${course.estimatedHours}H`,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'NetVision',
          url: SITE_URL,
        },
        url: `${SITE_URL}/courses/${course.slug}`,
        isAccessibleForFree: true,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'Online',
          courseWorkload: `PT${course.estimatedHours}H`,
        },
        ...(credential
          ? {
              educationalCredentialAwarded: {
                '@type': 'EducationalOccupationalCredential',
                name: credential.title,
                credentialCategory: 'Certificate',
                description: credential.description,
                recognizedBy: {
                  '@type': 'EducationalOrganization',
                  name: 'NetVision',
                  url: SITE_URL,
                },
              },
            }
          : {}),
      }
    : null;

  return (
    <>
      {courseJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />
      )}
      {children}
    </>
  );
}

