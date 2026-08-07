'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please check input values.');
      }

      setAuth(data.user, data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Free Account</h1>
          <p className="text-xs text-zinc-400 mt-1">Join 100,000+ computer science & IT learners worldwide</p>
        </div>

        {error ? (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        ) : null}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username"
            type="text"
            placeholder="alex_netrunner"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Full Name (Optional)"
            type="text"
            placeholder="Alex Rivers"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="alex@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="cyan"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full mt-2"
          >
            Create NetVision Account
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6 pt-6 border-t border-[#272732]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00f0ff] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}
