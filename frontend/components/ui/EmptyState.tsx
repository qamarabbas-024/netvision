import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { FolderOpen } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center border border-[#272732]',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] mb-4 shadow-glow-cyan">
        {icon || <FolderOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction ? (
        <Button variant="cyan" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
