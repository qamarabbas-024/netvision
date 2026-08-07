import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepIndex,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn('w-full flex items-center justify-between relative', className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;

        return (
          <div
            key={step.id}
            onClick={() => onStepClick && onStepClick(idx)}
            className={cn('flex items-center gap-3 cursor-pointer group', onStepClick && 'hover:opacity-90')}
          >
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all border shrink-0',
                isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : isCurrent
                  ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] shadow-glow-cyan'
                  : 'bg-[#181820] border-[#272732] text-zinc-500'
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
            </div>

            <div className="hidden sm:flex flex-col">
              <span
                className={cn(
                  'text-xs font-bold transition-colors',
                  isCurrent ? 'text-[#00f0ff]' : isCompleted ? 'text-white' : 'text-zinc-500'
                )}
              >
                {step.title}
              </span>
              {step.description ? <span className="text-[10px] text-zinc-500">{step.description}</span> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
