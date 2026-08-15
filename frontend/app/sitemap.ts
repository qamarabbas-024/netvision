import { MetadataRoute } from 'next';

const BASE_URL = 'https://netvision-three.vercel.app';

const COURSE_SLUGS = [
  'net-101-computer-digital-foundations',
  'net-102-network-fundamentals-telecom',
  'net-103-osi-tcpip-reference-models',
  'net-201-layer2-ethernet-switching',
  'net-202-ipv4-addressing-subnetting-mastery',
  'net-203-core-ip-services-arp-dns-dhcp',
  'net-204-transport-layer-tcp-udp',
  'net-301-enterprise-switching-vlans',
  'net-302-spanning-tree-protocol',
  'net-303-ip-routing-static-administration',
  'net-304-dynamic-routing-ospf',
  'net-305-network-security-acls-firewalls',
  'net-401-nat-pat-edge-connectivity',
  'net-402-vpn-technology-cryptography',
  'net-403-bgp-enterprise-wan-architecture',
  'net-404-packet-capture-wireshark-troubleshooting',
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

  return [...staticRoutes, ...courseRoutes];
}
