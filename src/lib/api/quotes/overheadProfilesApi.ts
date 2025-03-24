
import { supabase } from '@/lib/supabase';
import { dbToOverheadProfile, DbOverheadProfile } from './adapters';

// Fetch overhead profiles
export const fetchOverheadProfiles = async () => {
  const { data, error } = await supabase
    .from('overhead_profiles')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching overhead profiles:', error);
    throw new Error(error.message);
  }
  
  return (data || []).map(dbToOverheadProfile);
};

// Create overhead profile
export const createOverheadProfile = async (name: string, laborPercentage: number, description?: string) => {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  const profileData = {
    name,
    labor_percentage: laborPercentage,
    description,
    user_id: userId
  };
  
  // Insert as a single object, not an array
  const { data, error } = await supabase
    .from('overhead_profiles')
    .insert(profileData) 
    .select()
    .single();
  
  if (error) {
    console.error('Error creating overhead profile:', error);
    throw new Error(error.message);
  }
  
  return dbToOverheadProfile(data as DbOverheadProfile);
};

// Update overhead profile
export const updateOverheadProfile = async (id: string, name: string, laborPercentage: number, description?: string) => {
  const profileData = {
    name,
    labor_percentage: laborPercentage,
    description
  };
  
  const { data, error } = await supabase
    .from('overhead_profiles')
    .update(profileData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating overhead profile:', error);
    throw new Error(error.message);
  }
  
  return dbToOverheadProfile(data as DbOverheadProfile);
};

// Delete overhead profile
export const deleteOverheadProfile = async (id: string) => {
  const { error } = await supabase
    .from('overhead_profiles')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting overhead profile:', error);
    throw new Error(error.message);
  }
  
  return { success: true, id };
};
