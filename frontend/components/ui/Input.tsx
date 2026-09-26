import React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, icon, id, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `input-${generatedId}`);
    const errorId = error ? `${inputId}-error` : undefined;
    const combinedDescribedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full flex flex-col gap-1.5 font-sans">
        {label ? (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center">
          {icon ? <div className="absolute left-3.5 text-slate-400 pointer-events-none" aria-hidden="true">{icon}</div> : null}
          <input
            ref={ref}
            id={inputId}
            type={type}
            aria-invalid={!!error}
            aria-describedby={combinedDescribedBy}
            className={cn(
              'w-full bg-[#14151a] text-[#f4f5f7] border border-[#2a2e39] rounded-lg px-3.5 py-2 text-sm transition-all focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] placeholder:text-slate-400',
              icon && 'pl-10',
              error && 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p id={errorId} role="alert" aria-live="polite" className="text-xs text-rose-400 font-mono">
            {error}
          </p>
        ) : null}
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
  ({ className, label, error, options, id, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `select-${generatedId}`);
    const errorId = error ? `${selectId}-error` : undefined;
    const combinedDescribedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full flex flex-col gap-1.5 font-sans">
        {label ? (
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            {label}
          </label>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={combinedDescribedBy}
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
        {error ? (
          <p id={errorId} role="alert" aria-live="polite" className="text-xs text-rose-400 font-mono">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export const SearchInput: React.FC<Omit<InputProps, 'icon'>> = (props) => (
  <Input
    icon={<Search className="w-4 h-4 text-slate-400" />}
    placeholder="Search courses, lessons, diagnostics..."
    aria-label="Search curriculum courses and topics"
    {...props}
  />
);
