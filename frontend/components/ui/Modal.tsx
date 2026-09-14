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
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Auto-focus first interactive element inside modal for keyboard accessibility
      const timer = setTimeout(() => {
        if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
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
            aria-hidden="true"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-dialog-title' : undefined}
            aria-describedby={description ? 'modal-dialog-desc' : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={cn(
              'relative z-10 w-full max-w-lg bg-[#1b1e26] rounded-xl border border-[#2a2e39] p-5 sm:p-6 shadow-elevated max-h-[90vh] overflow-y-auto font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]/50',
              className
            )}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2a2e39]">
              <div>
                {title ? <h2 id="modal-dialog-title" className="text-base sm:text-lg font-bold text-[#f4f5f7] tracking-tight">{title}</h2> : null}
                {description ? <p id="modal-dialog-desc" className="text-xs text-[#949ba8] mt-0.5">{description}</p> : null}
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
