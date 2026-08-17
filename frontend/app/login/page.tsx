'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Activity, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { useAuthStore } from '@/stores/authStore';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam === 'GoogleOAuthNotConfigured') {
      setError('Google OAuth is not configured on this server yet. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env.');
    } else if (errorParam === 'OAuthAuthenticationFailed') {
      setError('Google authentication failed or was cancelled by the user.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message && data.message.includes('not verified')) {
          router.push(`/register/verify-otp?email=${encodeURIComponent(cleanEmail)}`);
          return;
        }
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      setAuth(data.user, data.accessToken, rememberMe);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-5 sm:p-8 glass-panel-glow border-[#00f0ff]/30 shadow-2xl relative z-10">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <Link href="/" className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center shadow-glow-cyan">
            <Activity className="w-6 h-6 text-black font-bold" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Net<span className="text-[#00f0ff]">Vision</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
        <p className="text-xs text-zinc-400 mt-1">Sign in to resume your visual networking learning path</p>
      </div>

      {error ? (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex items-center justify-between text-xs my-1">
          <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-[#121217] border-[#272732] text-[#00f0ff]"
            />
            <span>Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-[#00f0ff] hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="cyan"
          size="lg"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="w-full mt-2"
        >
          Sign In to Platform
        </Button>
      </form>

      {/* Social Auth Divider */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#272732]" />
        </div>
        <span className="relative px-3 bg-[#09090b] text-[11px] font-mono text-zinc-500 uppercase">
          Or continue with
        </span>
      </div>

      {/* Social OAuth Buttons */}
      <div className="flex flex-col gap-3">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/google`}
          className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#272732] hover:border-[#00f0ff]/40 text-xs font-bold text-white transition-all shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
            <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9z"/>
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"/>
          </svg>
          <span>Continue with Google</span>
        </a>
      </div>

      <div className="mt-6 pt-6 border-t border-[#272732] text-center">
        <p className="text-xs text-zinc-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#00f0ff] font-bold hover:underline">
            Create Free Account
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] bg-net-grid-pattern flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#00f0ff]/10 via-[#3b82f6]/5 to-transparent blur-[120px] pointer-events-none" />
      <Suspense fallback={<div className="text-xs text-zinc-400">Loading sign in...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
