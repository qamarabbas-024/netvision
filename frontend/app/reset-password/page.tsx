'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Reset password failed. Invalid or expired token.');
      }

      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] bg-net-grid-pattern flex items-center justify-center p-6 relative overflow-hidden">
      <Card className="w-full max-w-md p-8 glass-panel-glow border-[#00f0ff]/30 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00f0ff] to-[#3b82f6] flex items-center justify-center shadow-glow-cyan">
              <Activity className="w-6 h-6 text-black font-bold" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Net<span className="text-[#00f0ff]">Vision</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Set New Password</h1>
          <p className="text-xs text-zinc-400 mt-1">Paste your reset token and enter a strong new password</p>
        </div>

        {error ? <Alert variant="error" className="mb-6">{error}</Alert> : null}
        {message ? (
          <Alert variant="success" className="mb-6 flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Reset Token"
            type="text"
            placeholder="Paste reset token here..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            Update Password
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6 pt-6 border-t border-[#272732]">
          Back to{' '}
          <Link href="/login" className="text-[#00f0ff] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}
