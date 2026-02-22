import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, API_BASE_URL } from '../lib/supabase';
import { publicAnonKey } from '/utils/supabase/info';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  studentId?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    phone?: string;
    studentId?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has an active session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session && session.access_token) {
          setAccessToken(session.access_token);
          const metadata = session.user.user_metadata;
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: metadata.name,
            role: metadata.role || 'student',
            studentId: metadata.studentId,
            phone: metadata.phone,
          });
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (session) {
        setAccessToken(session.access_token);
        const metadata = session.user.user_metadata;
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: metadata.name,
          role: metadata.role || 'student',
          studentId: metadata.studentId,
          phone: metadata.phone,
        });
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      throw new Error(err.message || 'Failed to sign in');
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    phone?: string;
    studentId?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign up');
      }

      // After signup, sign in automatically
      await signIn(data.email, data.password);
    } catch (err: any) {
      console.error('Sign up error:', err);
      throw new Error(err.message || 'Failed to sign up');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
