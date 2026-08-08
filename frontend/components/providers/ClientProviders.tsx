'use client';

import React, { useEffect } from 'react';
import { ThemeProvider } from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/stores/authStore';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  return <ThemeProvider>{children}</ThemeProvider>;
};
