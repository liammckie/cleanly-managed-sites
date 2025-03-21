
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthContextType } from './types';
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  resetPasswordForEmail,
  verifyOtpToken
} from './authOperations';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize authentication state
  useEffect(() => {
    // Process any verification tokens in the URL
    const handleVerification = async () => {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');
      const type = url.searchParams.get('type');
      
      if (token && type === 'signup') {
        try {
          setIsLoading(true);
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });
          
          if (error) {
            toast.error('Verification failed: ' + error.message);
          } else {
            toast.success('Email verified successfully! You can now log in.');
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/login?verified=true');
          }
        } catch (error: any) {
          console.error('Error during verification:', error);
          toast.error('Verification failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleVerification();

    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        } else if (event === 'USER_UPDATED') {
          // Handle user updates, including email confirmation
          if (newSession?.user?.email_confirmed_at) {
            toast.success('Email confirmed successfully!');
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Sign in wrapper
  const signIn = async (email: string, password: string) => {
    try {
      const data = await signInWithEmail(email, password);
      if (data) navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  // Sign up wrapper
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      await signUpWithEmail(email, password, fullName);
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  // Sign out wrapper
  const signOut = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  // Reset password wrapper
  const resetPassword = async (email: string) => {
    try {
      await resetPasswordForEmail(email);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  // Verify OTP wrapper
  const verifyOtp = async (email: string, token: string, newPassword?: string) => {
    try {
      await verifyOtpToken(email, token, newPassword);
      navigate('/login');
    } catch (error: any) {
      console.error('Error verifying token:', error);
      toast.error(error.message || 'Verification failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        verifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
