'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';

export const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(audioEngine.getMuted());
  }, []);

  const handleToggle = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioEngine.playClick();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-xl border border-slate-800 bg-[#0c121e]/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer ${className}`}
      title={isMuted ? 'Unmute Audio Sound Effects' : 'Mute Audio Sound Effects'}
    >
      {isMuted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] text-slate-500 hidden sm:inline">MUTED</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">SFX ON</span>
        </>
      )}
    </button>
  );
};
