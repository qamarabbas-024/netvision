import React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, icon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
    return (
      <div className="w-full flex flex-col gap-1.5 font-sans">
        {label ? (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#949ba8] uppercase tracking-wider font-mono">
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center">
          {icon ? <div className="absolute left-3.5 text-[#646c7d] pointer-events-none">{icon}</div> : null}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full bg-[#14151a] text-[#f4f5f7] border border-[#2a2e39] rounded-lg px-3.5 py-2 text-sm transition-all focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] placeholder:text-[#646c7d]',
              icon && 'pl-10',
              error && 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]',
              className
            )}
            {...props}
          />
        </div>
        {error ? <p className="text-xs text-[#f87171] font-mono">{error}</p> : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
    return (
      <div className="w-full flex flex-col gap-1.5 font-sans">
        {label ? (
          <label htmlFor={selectId} className="text-xs font-semibold text-[#949ba8] uppercase tracking-wider font-mono">
            {label}
          </label>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full bg-[#14151a] text-[#f4f5f7] border border-[#2a2e39] rounded-lg px-3.5 py-2 text-sm transition-all focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]',
            error && 'border-[#ef4444]',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#14151a] text-[#f4f5f7]">
              {opt.label}
            </option>
          ))}
        </select>
        {error ? <p className="text-xs text-[#f87171] font-mono">{error}</p> : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export const SearchInput: React.FC<Omit<InputProps, 'icon'>> = (props) => (
  <Input
    icon={<Search className="w-4 h-4 text-[#646c7d]" />}
    placeholder="Search courses, lessons, diagnostics..."
    aria-label="Search curriculum courses and topics"
    {...props}
  />
);
