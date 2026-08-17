'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error trace
    console.error('App Router Boundary Caught Error:', error.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 bg-zinc-900/60 border border-red-500/20 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Application Exception</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            An unexpected error occurred during page rendering. Your session state remains secure.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium text-sm hover:from-red-400 hover:to-orange-500 transition-all shadow-lg shadow-red-500/20"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
