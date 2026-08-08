'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processOAuthCallback() {
      const token = searchParams.get('token');
      const errParam = searchParams.get('error');

      if (errParam) {
        setError('Social authentication was cancelled or failed. Please try again.');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      if (!token) {
        setError('No authentication token received from OAuth provider.');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile post-authentication');
        }

        const user = await response.json();
        setAuth(user, token, true);
        router.push('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Error processing authentication session.');
        setTimeout(() => router.push('/login'), 3000);
      }
    }

    processOAuthCallback();
  }, [searchParams, router, setAuth]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 text-center p-8 glass-panel border-rose-500/40 rounded-2xl max-w-md">
        <AlertCircle className="w-10 h-10 text-rose-500 animate-bounce" />
        <h2 className="text-lg font-bold text-white">Authentication Error</h2>
        <p className="text-xs text-zinc-400">{error}</p>
        <span className="text-[11px] text-zinc-500">Redirecting to login page...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center p-8 glass-panel border-[#00f0ff]/30 rounded-2xl max-w-md">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center shadow-glow-cyan animate-pulse">
        <Activity className="w-7 h-7 text-black font-bold" />
      </div>
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-[#00f0ff]" /> Completing Social Login...
      </h2>
      <p className="text-xs text-zinc-400">Verifying session and linking your NetVision security credentials</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] bg-net-grid-pattern flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-xs text-zinc-400">Processing OAuth token...</div>}>
        <OAuthCallbackContent />
      </Suspense>
    </div>
  );
}
