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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="error-reset-btn"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold text-xs hover:from-red-400 hover:to-orange-500 transition-all shadow-lg shadow-red-500/20 cursor-pointer"
          >
            Try Again
          </button>
          <a
            id="error-dashboard-btn"
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-zinc-200 hover:text-white hover:bg-zinc-700 text-xs font-semibold transition-all"
          >
            Dashboard
          </a>
          <a
            id="error-home-btn"
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-zinc-200 hover:text-white hover:bg-zinc-700 text-xs font-semibold transition-all"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}
