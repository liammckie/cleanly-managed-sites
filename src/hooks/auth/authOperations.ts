import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    if (!data.user?.email_confirmed_at && data.user) {
      toast.warning('Please verify your email before logging in.');
      return null;
    }
    
    toast.success('Signed in successfully');
    return data;
  } catch (error: any) {
    console.error('Error in signInWithEmail:', error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  try {
    const origin = window.location.origin;
    const redirectUrl = `${origin}/login?verified=true`;
    
    console.log(`Email redirect set to: ${redirectUrl}`);
    
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: redirectUrl
      },
    });

    if (error) throw error;
    
    // Check if user needs to confirm their email
    if (data.user && !data.user.email_confirmed_at) {
      toast.success('Account created successfully! Please check your email for confirmation.');
    } else {
      toast.success('Account created successfully!');
    }
    
    return data;
  } catch (error: any) {
    console.error('Error in signUpWithEmail:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success('Signed out successfully');
  } catch (error: any) {
    console.error('Error in signOutUser:', error);
    throw error;
  }
};

// Reset password
export const resetPasswordForEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    toast.success('Password reset email sent');
  } catch (error: any) {
    console.error('Error in resetPasswordForEmail:', error);
    throw error;
  }
};

// Verify OTP token (for signup or password reset)
export const verifyOtpToken = async (email: string, token: string, newPassword?: string) => {
  try {
    // If newPassword is provided, this is a password reset
    if (newPassword) {
      // For password reset, we use verifyOtp first then updateUser
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
      });
      
      if (error) throw error;
      
      // After verification, update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      toast.success('Password has been reset successfully!');
    } else {
      // Otherwise it's an email verification
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      });
      
      if (error) throw error;
      
      toast.success('Email verified successfully!');
    }
  } catch (error: any) {
    console.error('Error in verifyOtpToken:', error);
    throw error;
  }
};
