import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface SignInResponse {
  error: Error | null;
  session: Session | null;
  status?: number;
  code?: string;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('viewer');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Extract role from user metadata
  // SECURITY: Prefer app_metadata.role (server-controlled) over user_metadata.role (client-writable)
  const extractRole = (u: User | null): string => {
    if (!u) return 'guest';
    const appMetadata = u.app_metadata || {};
    const metadata = u.user_metadata || {};
    return (
      appMetadata.role ||
      metadata.role ||
      'viewer'
    );
  };

  useEffect(() => {
    let mounted = true;

    // 1. Initialize session using Supabase getSession
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[Auth Error] Failed to get initial session:', error.message);
        }
        if (mounted) {
          const currentSession = data?.session ?? null;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setUserRole(extractRole(currentSession?.user ?? null));
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[Auth Exception] Session initialization error:', err);
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initSession();

    // 2. Listen to active auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      console.log(`[Supabase Auth State Change]: ${event}`, newSession?.user?.email ?? 'no-session');
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setUserRole(extractRole(newSession?.user ?? null));
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    if (!email || !email.trim()) {
      return { error: new Error('Email is required.'), session: null };
    }
    if (!password) {
      return { error: new Error('Password is required.'), session: null };
    }

    try {
      if (import.meta.env.DEV) {
        console.group('[AILMS Auth Diagnostics] signInWithPassword attempt');
        console.log('Target Email:', email.trim());
        console.log('Timestamp:', new Date().toISOString());
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const errorDetails = error as { status?: number; code?: string; message: string; name?: string };
        if (import.meta.env.DEV) {
          console.error('[AILMS Auth Diagnostics] Supabase rejected login:', {
            status: errorDetails.status,
            name: errorDetails.name,
            code: errorDetails.code,
            message: errorDetails.message,
          });
          console.groupEnd();
        }
        return {
          error: new Error(error.message),
          session: null,
          status: errorDetails.status,
          code: errorDetails.code,
        };
      }

      if (!data.session || !data.user) {
        if (import.meta.env.DEV) {
          console.error('[AILMS Auth Diagnostics] No active session or user object established');
          console.groupEnd();
        }
        return { error: new Error('Authentication session was not established'), session: null };
      }

      if (import.meta.env.DEV) {
        console.log('[AILMS Auth Diagnostics] Login successful!', {
          userId: data.user.id,
          email: data.user.email,
          emailConfirmed: Boolean(data.user.email_confirmed_at),
          role: extractRole(data.user),
        });
        console.groupEnd();
      }

      setSession(data.session);
      setUser(data.user);
      setUserRole(extractRole(data.user));

      return { error: null, session: data.session };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      if (import.meta.env.DEV) {
        console.error('[AILMS Auth Diagnostics] Unhandled exception:', message);
        console.groupEnd();
      }
      return { error: new Error(message), session: null };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    if (!email || !email.trim()) {
      return { error: new Error('Email is required.'), user: null };
    }
    if (!password || password.length < 6) {
      return { error: new Error('Password must be at least 6 characters.'), user: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name?.trim() || '',
            role: 'dispatcher',
          },
        },
      });

      if (error) {
        return { error: new Error(error.message), user: null };
      }

      return { error: null, user: data.user };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      return { error: new Error(message), user: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[Auth Error] Error during sign out:', err);
    } finally {
      // Clear all state unconditionally
      setSession(null);
      setUser(null);
      setUserRole('guest');
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    if (!email || !email.trim()) {
      return { error: new Error('Email is required.') };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      return { error: new Error(message) };
    }
  };

  const isAuthenticated = Boolean(session && user);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        isLoading,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        resetPasswordForEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

