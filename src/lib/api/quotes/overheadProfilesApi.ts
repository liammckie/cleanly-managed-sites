
import { supabase } from '@/lib/supabase';

// Fetch overhead profiles
export const fetchOverheadProfiles = async () => {
  const { data, error } = await supabase
    .from('overhead_profiles')
    .select('*');
  
  if (error) {
    console.error('Error fetching overhead profiles:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};
