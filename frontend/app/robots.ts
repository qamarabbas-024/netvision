import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://netvision-three.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/courses',
          '/courses/*',
          '/troubleshooting',
          '/troubleshooting/*',
          '/simulations',
          '/sandbox',
          '/workbench',
          '/labs',
          '/challenges',
          '/exams',
          '/commands',
          '/glossary',
          '/flashcards',
          '/certificates',
          '/certificates/*',
          '/docs',
          '/docs/*',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/admin',
          '/admin/*',
          '/profile',
          '/profile/*',
          '/settings',
          '/settings/*',
          '/auth/*',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
