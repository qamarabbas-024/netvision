'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      setAuth(data.user, data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoStudent = () => {
    setEmail('student@netvision.edu');
    setPassword('student1234');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] bg-net-grid-pattern flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#00f0ff]/10 via-[#3b82f6]/5 to-transparent blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md p-8 glass-panel-glow border-[#00f0ff]/30 shadow-2xl relative z-10">
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
            placeholder="student@netvision.edu"
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
              <input type="checkbox" className="rounded bg-[#121217] border-[#272732] text-[#00f0ff]" />
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
            Sign In to NetVision
          </Button>
        </form>

        {/* Quick Demo Fill Button */}
        <div className="mt-6 pt-6 border-t border-[#272732] flex flex-col gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fillDemoStudent}
            leftIcon={<ShieldCheck className="w-4 h-4 text-[#00f0ff]" />}
            className="w-full"
          >
            Auto-Fill Student Credentials
          </Button>

          <p className="text-center text-xs text-zinc-400 mt-2">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#00f0ff] font-bold hover:underline">
              Create Account Free
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
