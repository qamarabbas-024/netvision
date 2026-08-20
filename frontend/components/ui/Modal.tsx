'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={cn(
              'relative z-10 w-full max-w-lg bg-[#1b1e26] rounded-xl border border-[#2a2e39] p-5 sm:p-6 shadow-elevated max-h-[90vh] overflow-y-auto font-sans',
              className
            )}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2a2e39]">
              <div>
                {title ? <h2 className="text-base sm:text-lg font-bold text-[#f4f5f7] tracking-tight">{title}</h2> : null}
                {description ? <p className="text-xs text-[#949ba8] mt-0.5">{description}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-lg bg-[#14151a] border border-[#2a2e39] hover:border-zinc-500 text-[#8e95a5] hover:text-[#f4f5f7] flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
