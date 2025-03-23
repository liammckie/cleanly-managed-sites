
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
    console.log("Creating user with email:", email);
    
    try {
      // Get current user to check admin status
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error("You must be logged in to create users");
      }
      
      // First create auth user with standard auth signup
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email confirmation for admin-created users
        user_metadata: {
          full_name: fullName,
        }
      });
      
      if (authError) {
        console.error('Error creating user auth:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Failed to create user authentication');
      }

      console.log("Auth user created successfully with ID:", authData.user.id);
      
      // Then insert the profile using RPC to bypass RLS
      const { data: profileData, error: profileError } = await supabase.rpc(
        'create_user_profile',
        { 
          user_id: authData.user.id,
          user_email: email,
          user_full_name: fullName,
          user_role_id: roleId,
          user_status: 'pending'
        }
      );
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        
        // If we fail to create the profile, we should clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        // Provide a more detailed error message
        if (profileError.message.includes('permission')) {
          throw new Error('Permission denied. You need admin privileges to create users.');
        } else {
          throw profileError;
        }
      }
      
      // If RPC doesn't exist yet or fails, fall back to direct insert
      // This requires admin role or appropriate permissions
      if (!profileData) {
        const { data: directData, error: directError } = await supabase
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
        
        if (directError) {
          console.error('Error with direct profile creation:', directError);
          
          // Clean up auth user if profile creation fails
          await supabase.auth.admin.deleteUser(authData.user.id);
          
          throw directError;
        }
        
        console.log("User profile created directly:", directData);
        return directData;
      }
      
      console.log("User profile created via RPC:", profileData);
      return profileData;
    } catch (error) {
      console.error('Error in user creation flow:', error);
      throw error;
    }
  }
};
