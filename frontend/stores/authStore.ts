import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { GuestProgressService } from '@/services/GuestProgressService';
import { claimAnonymousProgressApi } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string, rememberMe?: boolean) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token, rememberMe = true) => {
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        localStorage.setItem('netvision_token', token);
        localStorage.setItem('netvision_user', JSON.stringify(user));
        sessionStorage.removeItem('netvision_token');
        sessionStorage.removeItem('netvision_user');
      } else {
        sessionStorage.setItem('netvision_token', token);
        sessionStorage.setItem('netvision_user', JSON.stringify(user));
        localStorage.removeItem('netvision_token');
        localStorage.removeItem('netvision_user');
      }

      // Merge & claim guest progress into authenticated user account
      const anonId = GuestProgressService.getLearnerId();
      if (anonId) {
        claimAnonymousProgressApi(anonId).then(() => {
          GuestProgressService.clearLocalGuestProgress();
        });
      }
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('netvision_token');
      localStorage.removeItem('netvision_user');
      sessionStorage.removeItem('netvision_token');
      sessionStorage.removeItem('netvision_user');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),

  initializeAuth: async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('netvision_token') || sessionStorage.getItem('netvision_token');
    const storedUserJson = localStorage.getItem('netvision_user') || sessionStorage.getItem('netvision_user');

    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiBase}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const userData = await res.json();
        set({ user: userData, token, isAuthenticated: true, isLoading: false });
      } else {
        localStorage.removeItem('netvision_token');
        localStorage.removeItem('netvision_user');
        sessionStorage.removeItem('netvision_token');
        sessionStorage.removeItem('netvision_user');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      if (storedUserJson) {
        try {
          const parsedUser = JSON.parse(storedUserJson);
          set({ user: parsedUser, token, isAuthenticated: true, isLoading: false });
          return;
        } catch (e) {}
      }
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
