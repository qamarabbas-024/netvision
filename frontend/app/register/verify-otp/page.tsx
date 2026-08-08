'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Activity, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { useAuthStore } from '@/stores/authStore';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const queryEmail = searchParams.get('email');
    if (queryEmail) {
      setEmail(queryEmail.trim().toLowerCase());
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim().replace(/\D/g, '');

    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    if (cleanOtp.length !== 6) {
      setError('Please enter a full 6-digit numeric OTP code.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp: cleanOtp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed.');
      }

      setAuth(data.user, data.accessToken, true);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check your code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your email address to resend OTP.');
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP.');
      }

      if (data.devOtpCode) {
        setInfo(`A new code was generated. [DEV MODE CODE: ${data.devOtpCode}]`);
        setOtp(data.devOtpCode);
      } else {
        setInfo(data.message || 'A new 6-digit code has been dispatched to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'Could not resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
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
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#00f0ff]" /> Verify Email Address
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Please enter the 6-digit OTP verification code sent to <strong className="text-white">{email || 'your email'}</strong>
        </p>
      </div>

      {error ? <Alert variant="error" className="mb-6">{error}</Alert> : null}
      {info ? <Alert variant="info" className="mb-6">{info}</Alert> : null}

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
          placeholder="user@example.com"
          required
        />

        <Input
          label="6-Digit OTP Code"
          type="text"
          placeholder="123456"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="font-mono text-center tracking-widest text-lg"
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
          Verify Account & Continue
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#272732] flex items-center justify-between text-xs">
        <button
          onClick={handleResend}
          disabled={isResending || !email}
          className="text-[#00f0ff] hover:underline font-bold flex items-center gap-1.5 disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Resend OTP Code
        </button>
        <Link href="/login" className="text-zinc-400 hover:text-white">
          Back to Sign In
        </Link>
      </div>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] bg-net-grid-pattern flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#00f0ff]/10 via-[#3b82f6]/5 to-transparent blur-[120px] pointer-events-none" />
      <Suspense fallback={<div className="text-xs text-zinc-400">Loading OTP verification...</div>}>
        <VerifyOtpContent />
      </Suspense>
    </div>
  );
}
