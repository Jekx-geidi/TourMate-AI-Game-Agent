import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('tourmate_token');
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
      });
    } catch {
      localStorage.removeItem('tourmate_token');
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
      login: (token, nextUser) => {
        localStorage.setItem('tourmate_token', token);
        setUser(nextUser);
      },
      logout: async () => {
        try {
          await authService.logout();
          if (supabase) {
            await supabase.auth.signOut({ scope: 'local' });
          }
        } finally {
          localStorage.removeItem('tourmate_token');
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
