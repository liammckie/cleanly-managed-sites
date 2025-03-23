
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
  
  // Create new user (modified to use signUp instead of admin.createUser)
  async createUser(email: string, password: string, fullName: string, roleId: string) {
    console.log("Creating user with email:", email);
    
    try {
      // Get current user to check admin status
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error("You must be logged in to create users");
      }
      
      // Check if current user has admin permissions
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
        'get_user_admin_status',
        { user_uuid: currentUser.id }
      );
      
      if (!isAdmin && adminCheckError) {
        console.error("Admin check failed:", adminCheckError);
        throw new Error("You don't have permission to create users");
      }
      
      // Use standard signup method instead of admin.createUser
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`
        },
      });
      
      if (authError) {
        console.error('Error creating user auth:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Failed to create user authentication');
      }

      console.log("Auth user created successfully with ID:", authData.user.id);
      
      // Create the user profile directly
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
        
        // Handle errors, but don't try to delete the auth user since we're using signUp
        if (profileError.message.includes('permission')) {
          throw new Error('Permission denied. You need admin privileges to create users.');
        } else {
          throw profileError;
        }
      }
      
      console.log("User profile created:", profileData);
      return profileData;
    } catch (error) {
      console.error('Error in user creation flow:', error);
      throw error;
    }
  }
};
