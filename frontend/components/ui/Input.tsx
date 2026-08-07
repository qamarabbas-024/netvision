import React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">{label}</label> : null}
        <div className="relative flex items-center">
          {icon ? <div className="absolute left-3.5 text-zinc-400">{icon}</div> : null}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-[#121217] text-white border border-[#272732] rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] placeholder:text-zinc-500',
              icon && 'pl-10',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              className
            )}
            {...props}
          />
        </div>
        {error ? <p className="text-xs text-rose-400 font-medium">{error}</p> : null}
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
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">{label}</label> : null}
        <select
          ref={ref}
          className={cn(
            'w-full bg-[#121217] text-white border border-[#272732] rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]',
            error && 'border-rose-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#121217] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {error ? <p className="text-xs text-rose-400 font-medium">{error}</p> : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export const SearchInput: React.FC<Omit<InputProps, 'icon'>> = (props) => (
  <Input icon={<Search className="w-4 h-4 text-zinc-400" />} placeholder="Search courses, lessons, topics..." {...props} />
);
