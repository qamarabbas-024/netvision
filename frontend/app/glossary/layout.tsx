import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Computer Networking Terms & Protocol Glossary',
  description:
    'Searchable dictionary of computer networking terminology, RFC standards, protocol definitions, and acronyms from Layer 1 to Layer 7.',
  alternates: {
    canonical: '/glossary',
  },
  openGraph: {
    title: 'Computer Networking Glossary & Terms | NetVision',
    description:
      'Searchable dictionary of computer networking terminology and protocol definitions.',
    url: `${SITE_URL}/glossary`,
    siteName: 'NetVision',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Computer Networking Glossary & Terms | NetVision',
    description:
      'Searchable dictionary of computer networking terminology and protocol definitions.',
  },
};

const glossaryTerms = [
  { term: 'ARP', name: 'Address Resolution Protocol', desc: 'Resolves IP addresses to physical MAC hardware addresses on local subnets.' },
  { term: 'CIDR', name: 'Classless Inter-Domain Routing', desc: 'Subnet masking notation (e.g., /24) allowing flexible IP address allocation.' },
  { term: 'DNS', name: 'Domain Name System', desc: 'Translates human-friendly domain names (netvision.edu) into IP addresses (172.16.0.5).' },
  { term: 'ICMP', name: 'Internet Control Message Protocol', desc: 'Network diagnostics protocol used by Ping and Traceroute commands.' },
  { term: 'NAT', name: 'Network Address Translation', desc: 'Translates private internal IP addresses to public internet IP addresses.' },
  { term: 'OSPF', name: 'Open Shortest Path First', desc: 'Link-state interior gateway routing protocol for enterprise networks.' },
  { term: 'STP', name: 'Spanning Tree Protocol', desc: '802.1D switch protocol preventing Layer 2 loops in redundant network topologies.' },
  { term: 'TCP', name: 'Transmission Control Protocol', desc: 'Connection-oriented protocol providing reliable, ordered packet delivery.' },
  { term: 'VLAN', name: 'Virtual Local Area Network', desc: 'Logical grouping of network devices isolating broadcast domains on switches.' },
];

const glossaryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'NetVision Networking Protocol Glossary',
  description: 'Definitions of foundational computer networking protocols, terminology, and standards.',
  url: `${SITE_URL}/glossary`,
  hasDefinedTerm: glossaryTerms.map((t) => ({
    '@type': 'DefinedTerm',
    termCode: t.term,
    name: `${t.term} - ${t.name}`,
    description: t.desc,
    inDefinedTermSet: `${SITE_URL}/glossary`,
  })),
};

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossaryJsonLd) }}
      />
      {children}
    </>
  );
}

