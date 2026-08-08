import React from 'react';
import { Badge } from '@/components/ui/Badge';

export interface DifficultyBadgeProps {
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | string;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ level, className }) => {
  const normalized = level?.toUpperCase() || 'BEGINNER';
  const variant =
    normalized === 'BEGINNER'
      ? 'cyan'
      : normalized === 'INTERMEDIATE'
      ? 'purple'
      : 'rose';

  return (
    <Badge variant={variant} className={className}>
      {normalized}
    </Badge>
  );
};
