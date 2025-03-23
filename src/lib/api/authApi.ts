
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
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      }
    });
    
    if (authError) {
      console.error('Error creating user with admin API:', authError);
      throw authError;
    }
    
    // Then create the profile
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role_id: roleId,
          status: 'active',
        })
        .select()
        .single();
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw profileError;
      }
      
      return profileData;
    }
    
    throw new Error('Failed to create user');
  }
};
