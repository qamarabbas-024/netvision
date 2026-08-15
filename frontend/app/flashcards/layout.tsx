import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Networking Flashcards & Study Decks',
  description:
    'Test and reinforce your knowledge of OSI layers, port numbers, subnetting masks, and routing protocols with interactive flashcard study decks.',
  alternates: {
    canonical: '/flashcards',
  },
  openGraph: {
    title: 'Networking Flashcards & Study Decks | NetVision',
    description:
      'Test and reinforce your knowledge of networking concepts with interactive study decks.',
    url: 'https://netvision-three.vercel.app/flashcards',
  },
};

export default function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
