// =====================================================
// ALTERNATIVE AUTHENTICATION CONTEXT (API-based)
// =====================================================
// This file shows how to use the API route for registration
// instead of the database trigger approach.
//
// To use this:
// 1. Rename this file to AuthContext.tsx
// 2. Rename the current AuthContext.tsx to AuthContext.old.tsx
// 3. Make sure the API route exists at src/app/api/auth/register/route.ts
//
// NOTE: The database trigger approach is recommended as it's simpler
// and doesn't require changes to the client code.

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthUser } from '@/types';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  register: (email: string, password: string, full_name: string, role?: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('🔔 Auth Event:', event);
        console.log('🔔 Session:', session);

        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);

        // Refresh the page to update server components
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          router.refresh();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log('🔍 checkUser session:', session);

      if (session?.user) {
        await fetchUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserData(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      console.log('✅ User Loaded:', data);

      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async function login(email: string, password: string): Promise<AuthUser> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserData(data.user.id);

        // Fetch and return the user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        // Force router refresh to update server components
        router.refresh();

        return userData;
      }

      throw new Error('No user data found');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    }
  }

  // API-based registration (uses server-side service role)
  async function register(email: string, password: string, full_name: string, role: string = 'patient') {
    try {
      // Call the registration API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register');
      }

      // Now sign in the user
      await login(email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register');
    }
  }

  async function logout() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.refresh();
      router.push('/');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to logout');
    }
  }

  async function updateProfile(data: Partial<User>) {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserData(user.id);
      router.refresh();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
