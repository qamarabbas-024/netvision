import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NetVision - Learn Networking by Seeing It',
  description:
    'The world premier free interactive networking learning platform. Visualize packets, build network topologies, simulate protocols, and master networking concepts.',
  keywords: ['networking', 'education', 'packet tracer', 'visual learning', 'cybersecurity', 'TCP/IP', 'DNS', 'OSI model'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
