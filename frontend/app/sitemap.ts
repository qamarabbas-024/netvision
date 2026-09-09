import { MetadataRoute } from 'next';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';
import { SITE_URL } from '../lib/siteConfig';

const BASE_URL = SITE_URL;

const COURSE_SLUGS = FLAGSHIP_5_COURSES.map((c) => c.slug);

const TROUBLESHOOTING_SLUGS = [
  'dns-resolution-failure',
  'dhcp-failure',
  'incorrect-subnet-mask',
  'arp-resolution-failure',
  'vlan-mismatch',
  'stp-loop-blocking-issue',
  'ospf-neighbor-problem',
  'incorrect-routing-table',
  'packet-loss-duplex-mismatch',
  'mtu-mismatch-pmtud-blackhole',
  'high-latency-bufferbloat',
  'tcp-connection-failure',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/courses`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/troubleshooting`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/simulations`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sandbox`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/labs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/workbench`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/exams`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/certificates`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/commands`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/glossary`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/flashcards`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/challenges`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs/architecture`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/docs/design-system`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/docs/pedagogy-blueprint`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const courseRoutes: MetadataRoute.Sitemap = COURSE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/courses/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const troubleshootingRoutes: MetadataRoute.Sitemap = TROUBLESHOOTING_SLUGS.map((slug) => ({
    url: `${BASE_URL}/troubleshooting/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...courseRoutes, ...troubleshootingRoutes];
}
