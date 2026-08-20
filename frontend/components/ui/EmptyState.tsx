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
  statusTag?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  statusTag = 'STATUS: NO_DATA',
  className,
}) => {
  return (
    <div
      className={cn(
        'surface-2 rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center border border-[#2a2e39] font-sans shadow-subtle',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[#14151a] border border-[#2a2e39] flex items-center justify-center text-[#38bdf8] mb-4">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <span className="text-[10px] font-mono text-[#646c7d] uppercase tracking-wider mb-1 font-bold">
        {statusTag}
      </span>
      <h3 className="text-base sm:text-lg font-bold text-[#f4f5f7] tracking-tight mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-[#8e95a5] max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction ? (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
