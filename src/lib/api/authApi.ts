
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
  
  // Check if a user with the given email already exists
  async checkUserExists(email: string) {
    try {
      // This uses a simple auth check which doesn't require special permissions
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });
      
      // If we get here without an error saying user doesn't exist, the user exists
      const userExists = !error || !error.message.includes("user does not exist");
      return userExists;
    } catch (error) {
      // In case of network errors or other issues, assume user might exist to avoid duplicates
      console.error('Error checking if user exists:', error);
      return false;
    }
  },
  
  // Create new user with fixed RLS policies
  async createUser(email: string, password: string, firstName: string, lastName: string, phone: string, title: string, roleId: string) {
    console.log("Creating user with email:", email);
    
    try {
      // First check if the user already exists
      const userExists = await this.checkUserExists(email);
      
      if (userExists) {
        throw new Error(`A user with email ${email} already exists`);
      }
      
      // Get current user to verify admin status
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error("You must be logged in to create users");
      }
      
      // Check if current user has admin permissions using our security definer function
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
        'check_if_user_is_admin',
        { user_uuid: currentUser.id }
      );
      
      if (adminCheckError) {
        console.error("Admin check error:", adminCheckError);
        throw new Error("Error checking admin permissions");
      }
      
      if (!isAdmin) {
        console.error("Admin check result:", isAdmin);
        throw new Error("You don't have permission to create users");
      }
      
      // Use standard signup method
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            phone: phone,
            title: title
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
      
      // Create the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: `${firstName} ${lastName}`,
          first_name: firstName, 
          last_name: lastName,
          phone: phone,
          title: title,
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
