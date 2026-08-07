'use client';

import React from 'react';
import { SearchInput } from './Input';
import { Badge } from './Badge';
import { Bell, Flame, User } from 'lucide-react';

export const AppTopbar: React.FC = () => {
  return (
    <header className="w-full glass-panel border-b border-[#272732]/60 px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="max-w-md w-full">
        <SearchInput />
      </div>

      {/* User Progress Stats & Profile */}
      <div className="flex items-center gap-4">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span>7 Day Streak</span>
        </div>

        {/* Level Badge */}
        <Badge variant="cyan">Level 4 Learner</Badge>

        {/* Notifications */}
        <button className="w-9 h-9 rounded-xl bg-[#181820] border border-[#272732] hover:border-zinc-500 flex items-center justify-center text-zinc-400 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00f0ff]" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs cursor-pointer shadow-glow-purple">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
