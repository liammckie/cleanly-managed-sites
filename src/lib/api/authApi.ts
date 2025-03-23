
import { supabase } from '@/integrations/supabase/client';

// Auth API functions
export const authApi = {
  // Get the current authenticated user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
    
    return user;
  },
  
  // Check if a user is authenticated
  async isAuthenticated() {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  },
  
  // Sign out the current user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  
  // Create new user (admin only function)
  async createUser(email: string, password: string, fullName: string, roleId: string) {
    console.log("AuthAPI: Creating user", email);
    
    try {
      // First create auth user with standard auth signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`
        }
      });
      
      if (authError) {
        console.error('Error creating user auth:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Failed to create user authentication');
      }

      console.log("Auth user created:", authData.user.id);
      
      // Then create the profile directly with a separate API call
      // Insert into user_profiles with ID matching the auth user
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role_id: roleId,
          status: 'pending',
        })
        .select()
        .single();
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw profileError;
      }
      
      console.log("User profile created:", profileData);
      return profileData;
    } catch (error) {
      console.error('Error in createUser flow:', error);
      throw error;
    }
  }
};
