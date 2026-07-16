'use client';

// =====================================================
// JADEL CLINIC - Authentication Context
// =====================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthUser } from '@/types';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, full_name: string, role?: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
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
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async function login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserData(data.user.id);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    }
  }

  async function register(email: string, password: string, full_name: string, role: string = 'patient') {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            full_name,
            role,
          });

        if (userError) throw userError;

        if (role === 'patient') {
          const { error: patientError } = await supabase
            .from('patients')
            .insert({
              user_id: data.user.id,
            });

          if (patientError) throw patientError;
        }

        await fetchUserData(data.user.id);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register');
    }
  }

  async function logout() {
    try {
      await supabase.auth.signOut();
      setUser(null);
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
