import { MetadataRoute } from 'next';

const BASE_URL = 'https://netvision-three.vercel.app';

const COURSE_SLUGS = [
  'net-101-digital-foundations',
  'net-102-network-fundamentals',
  'net-103-reference-models',
  'net-201-layer2-ethernet',
  'net-202-ipv4-subnetting',
  'net-203-core-ip-services',
  'net-204-transport-protocols',
  'net-301-switching-vlans',
  'net-302-spanning-tree',
  'net-303-static-routing',
  'net-304-dynamic-routing-ospf',
  'net-305-acls-firewalls',
  'net-401-nat-pat',
  'net-402-vpn-crypto',
  'net-403-network-automation',
  'net-404-packet-analysis',
];

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
