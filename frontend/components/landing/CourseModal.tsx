'use client';

import React from 'react';
import { CurriculumStep } from '@/data/curriculumData';
import { X, BookOpen, Clock, CheckCircle2, Play } from 'lucide-react';

interface CourseModalProps {
  step: CurriculumStep | null;
  onClose: () => void;
  onStartLab: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ step, onClose, onStartLab }) => {
  if (!step) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#111c30]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 flex items-center justify-center font-mono font-bold">
              {step.stepNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#22d3ee] font-semibold">{step.code}</span>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{step.summary}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close course details"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0b1120] border border-slate-800 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Estimated Duration: {step.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0b1120] border border-slate-800 rounded-lg">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>{step.labsCount} Interactive Labs</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Core Learning Modules &amp; Lab Challenges
            </h4>
            <div className="space-y-2.5">
              {step.topics.map((t, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#0b1120] border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 leading-relaxed">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0b1120] border-t border-[#1e293b] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
          >
            Back to Curriculum
          </button>

          <button
            onClick={() => {
              onStartLab();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Simulation Lab</span>
          </button>
        </div>
      </div>
    </div>
  );
};
