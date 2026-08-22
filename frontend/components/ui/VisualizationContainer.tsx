import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface VisualizationContainerProps {
  title: string;
  moduleId?: string;
  statusLabel?: string;
  onReset?: () => void;
  headerActions?: React.ReactNode;
  footerTelemetry?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const VisualizationContainer: React.FC<VisualizationContainerProps> = ({
  title,
  moduleId,
  statusLabel = 'LIVE TELEMETRY',
  onReset,
  headerActions,
  footerTelemetry,
  children,
  className,
}) => {
  return (
    <div className={cn('surface-2 rounded-xl border border-[#2a2e39] shadow-instrument overflow-hidden font-sans', className)}>
      {/* Workbench Instrument Bezel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-[#14151a] border-b border-[#2a2e39]">
        <div>
          <div className="flex items-center gap-2 mb-0.5 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#38bdf8] font-bold uppercase">
              {moduleId || 'SIMULATION_ENGINE_V1'}
            </span>
            <span className="text-[#646c7d]">•</span>
            <span className="text-[#8e95a5]">{statusLabel}</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-[#f4f5f7] tracking-tight">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {headerActions}
          {onReset && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onReset}
              leftIcon={<RefreshCw className="w-3 h-3" />}
              className="text-[11px] font-mono px-2.5 py-1"
            >
              RESET
            </Button>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas / Tool Well */}
      <div className="p-4 sm:p-6 bg-[#121316]">
        {children}
      </div>

      {/* Optional Telemetry Footer Bar */}
      {footerTelemetry && (
        <div className="px-4 py-2.5 bg-[#14151a] border-t border-[#2a2e39] font-mono text-xs text-[#8e95a5]">
          {footerTelemetry}
        </div>
      )}
    </div>
  );
};
