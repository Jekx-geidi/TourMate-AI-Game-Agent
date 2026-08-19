import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredToken, getStoredToken, setStoredToken } from '../lib/auth-storage';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User, remember?: boolean) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.me();
      setUser({
        id: response.id,
        name: response.name,
        email: response.email,
        avatarUrl: response.avatarUrl ?? null,
      });
    } catch {
      clearStoredToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: (token, nextUser, remember = true) => {
        setStoredToken(token, remember);
        setUser(nextUser);
      },
      logout: async () => {
        try {
          await authService.logout();
          if (supabase) {
            await supabase.auth.signOut({ scope: 'local' });
          }
        } finally {
          clearStoredToken();
          setUser(null);
        }
      },
      refreshUser,
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
