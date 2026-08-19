import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = 'https://netvision-three.vercel.app';

export const viewport: Viewport = {
  themeColor: '#09090b',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NetVision — Interactive Computer Networking Learning Platform',
    template: '%s | NetVision',
  },
  description:
    'Master computer networking by seeing it. Interactive packet animations, deterministic CLI sandbox simulations, multi-modal lessons, and verifiable certifications.',
  keywords: [
    'computer networking',
    'packet simulation',
    'learn networking',
    'TCP/IP 3-way handshake',
    'OSI 7 layer model',
    'subnetting calculator',
    'CIDR calculation',
    'ARP protocol',
    'DNS hierarchy',
    'BGP routing',
    'Wireshark packet analysis',
    'cybersecurity education',
    'interactive network simulator',
  ],
  authors: [{ name: 'NetVision Education Team', url: SITE_URL }],
  creator: 'NetVision',
  publisher: 'NetVision',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'NetVision',
    title: 'NetVision — Learn Computer Networking by Seeing It',
    description:
      'Free interactive computer networking platform. Visualize packets, explore protocols, practice commands in a simulated CLI sandbox, and earn verifiable certifications.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NetVision — Interactive Computer Networking Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NetVision — Interactive Computer Networking Platform',
    description:
      'Visualize packets in real-time, master subnetting, and practice in an interactive networking sandbox.',
    images: ['/og-image.png'],
    creator: '@netvision_edu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'NetVision',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description:
    'Interactive computer networking learning platform featuring packet animations, deterministic CLI simulations, and verifiable certifications.',
  sameAs: ['https://github.com/qamarabbas-024/netvision'],
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NetVision',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/courses?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-cyan-500 selection:text-black">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
