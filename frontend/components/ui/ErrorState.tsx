import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Telemetry Acquisition Error',
  message = 'An unexpected issue occurred while retrieving data. No raw internals were exposed.',
  errorCode = 'ERR_NET_UNAVAILABLE',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'surface-2 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center border border-[#ef4444]/30 font-sans shadow-subtle',
        className
      )}
      role="alert"
    >
      <div className="w-11 h-11 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] mb-3.5">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-mono text-[#f87171] uppercase tracking-wider mb-1 font-bold">
        FAULT_CODE: {errorCode}
      </span>
      <h3 className="text-base font-bold text-[#f4f5f7] tracking-tight mb-1.5">{title}</h3>
      <p className="text-xs text-[#8e95a5] max-w-md mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Retry Request
        </Button>
      )}
    </div>
  );
};
