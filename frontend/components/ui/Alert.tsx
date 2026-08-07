import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  title,
  children,
  ...props
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-[#00f0ff]" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
  };

  const variants = {
    info: 'bg-[#00f0ff]/5 border-[#00f0ff]/30 text-zinc-300',
    success: 'bg-emerald-500/5 border-emerald-500/30 text-zinc-300',
    warning: 'bg-amber-500/5 border-amber-500/30 text-zinc-300',
    error: 'bg-rose-500/5 border-rose-500/30 text-zinc-300',
  };

  return (
    <div
      className={cn(
        'w-full p-4 rounded-xl border flex items-start gap-3 glass-panel text-sm leading-relaxed',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="mt-0.5 shrink-0">{icons[variant]}</div>
      <div className="flex-1">
        {title ? <h4 className="font-bold text-white mb-1">{title}</h4> : null}
        <div>{children}</div>
      </div>
    </div>
  );
};
