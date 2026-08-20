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
    <nav className={cn('flex items-center gap-1.5 text-xs font-mono text-[#8e95a5]', className)} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-[#38bdf8] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? 'text-[#f4f5f7] font-semibold' : 'text-[#8e95a5]')}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="w-3.5 h-3.5 text-[#646c7d] shrink-0" aria-hidden="true" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
