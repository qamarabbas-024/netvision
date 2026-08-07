import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav className={cn('flex items-center gap-2 text-xs font-mono text-zinc-400', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-[#00f0ff] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && 'text-white font-bold')}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
