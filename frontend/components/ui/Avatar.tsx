import React from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  className,
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  const statusColors = {
    online: 'bg-emerald-400',
    offline: 'bg-zinc-500',
    busy: 'bg-rose-500',
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white shadow-glow-purple overflow-hidden border border-white/10',
          sizes[size],
          className
        )}
      >
        {src ? (
          <img src={src} alt={name || 'User Avatar'} className="w-full h-full object-cover" />
        ) : name ? (
          name.substring(0, 2).toUpperCase()
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </div>
      {status ? (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#09090b]',
            statusColors[status]
          )}
        />
      ) : null}
    </div>
  );
};
