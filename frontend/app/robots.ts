import { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

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
          '/certificates/verify',
          '/certificates/verify/*',
          '/docs',
          '/docs/*',
        ],
        disallow: [
          '/certifications',
          '/certifications/*',
          '/certificates/*',
          '/dashboard',
          '/dashboard/*',
          '/admin',
          '/admin/*',
          '/profile',
          '/profile/*',
          '/settings',
          '/settings/*',
          '/auth',
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
