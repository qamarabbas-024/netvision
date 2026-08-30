'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/stores/authStore';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().initializeAuth();
  }, []);

  return (
    <ThemeProvider>
      <div suppressHydrationWarning>
        {children}
      </div>
    </ThemeProvider>
  );
};
