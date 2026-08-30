'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onContinueAsGuest }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden p-6 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 border border-[#10b981]/40 flex items-center justify-center mx-auto mb-3 text-[#34d399]">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Access NetVision</h3>
          <p className="text-xs text-slate-400 mt-1">Start learning interactive networking immediately.</p>
        </div>

        {isSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-emerald-300">Magic Link Dispatched</div>
            <div className="text-xs text-slate-400">Check your inbox to resume your lab session.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 100% Open Guest Access Button */}
            <button
              onClick={() => {
                onContinueAsGuest();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#10b981] hover:bg-[#059669] text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Continue as Guest (100% Open)
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0f172a] px-3 text-[11px] font-mono text-slate-500 uppercase">or connect with</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Work or Student Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@domain.com"
                  className="w-full px-3.5 py-2.5 bg-[#0b1120] border border-slate-800 rounded-xl text-slate-100 text-sm focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-colors"
              >
                Send Passwordless Sign-In Link
              </button>
            </form>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
          No credit card required. Free &amp; open-access computer networking labs.
        </div>
      </div>
    </div>
  );
};
