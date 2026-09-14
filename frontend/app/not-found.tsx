import React from 'react';
import Link from 'next/link';
import { Compass, LayoutDashboard, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6 bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">404 — Packet Dropped</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The destination node or network route you are searching for is unreachable or does not exist in the routing table.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            id="notfound-dashboard-btn"
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            id="notfound-home-btn"
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-zinc-200 hover:text-white hover:bg-zinc-700 text-xs font-semibold transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
