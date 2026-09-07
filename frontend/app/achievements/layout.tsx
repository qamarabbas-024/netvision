import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learner Milestones & Achievement Badges | NetVision',
  description: 'Track your networking learning progress, streaks, hands-on lab accomplishments, and unlocked achievement trophies.',
  openGraph: {
    title: 'Learner Milestones & Achievement Badges | NetVision',
    description: 'Track your networking learning progress, streaks, hands-on lab accomplishments, and unlocked achievement trophies.',
  },
};

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
