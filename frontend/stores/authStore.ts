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

function isJwtExpired(token: string | null): boolean {
  if (!token || token === 'cookie-session') return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    if (typeof decoded.exp === 'number') {
      return Date.now() >= decoded.exp * 1000;
    }
  } catch (e) {
    return false;
  }
  return false;
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
        claimAnonymousProgressApi(anonId)
          .catch(() => {})
          .finally(() => {
            GuestProgressService.clearAllGuestData();
            GuestProgressService.resetLearnerId();
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
      GuestProgressService.clearAllGuestData();
      GuestProgressService.resetLearnerId();
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {});
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),

  initializeAuth: async () => {
    if (typeof window === 'undefined') return;

    // Attach event listener once for 401 session expiry events
    if (!(window as any).__netvision_auth_listener_registered) {
      (window as any).__netvision_auth_listener_registered = true;
      window.addEventListener('netvision:auth-expired', () => {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      });
    }

    const token = localStorage.getItem('netvision_token') || sessionStorage.getItem('netvision_token');
    const storedUserJson = localStorage.getItem('netvision_user') || sessionStorage.getItem('netvision_user');

    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    // Proactive client-side token expiration check
    if (isJwtExpired(token)) {
      localStorage.removeItem('netvision_token');
      localStorage.removeItem('netvision_user');
      sessionStorage.removeItem('netvision_token');
      sessionStorage.removeItem('netvision_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const headers: Record<string, string> = {};
      if (token && token !== 'cookie-session') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${apiBase}/auth/me`, {
        headers,
        credentials: 'include',
      });

      if (res.ok) {
        const userData = await res.json();
        set({ user: userData, token: token || 'cookie-session', isAuthenticated: true, isLoading: false });
      } else {
        localStorage.removeItem('netvision_token');
        localStorage.removeItem('netvision_user');
        sessionStorage.removeItem('netvision_token');
        sessionStorage.removeItem('netvision_user');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      if (token && storedUserJson && !isJwtExpired(token)) {
        try {
          const parsedUser = JSON.parse(storedUserJson);
          set({ user: parsedUser, token, isAuthenticated: true, isLoading: false });
          return;
        } catch (e) {}
      }
      localStorage.removeItem('netvision_token');
      localStorage.removeItem('netvision_user');
      sessionStorage.removeItem('netvision_token');
      sessionStorage.removeItem('netvision_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
