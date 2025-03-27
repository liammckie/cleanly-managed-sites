
import { supabase } from '@/lib/supabase';
import { OverheadProfile } from '@/lib/utils/typeAdapters';
import { dbToOverheadProfile } from '@/lib/utils/typeAdapters';

export const fetchOverheadProfiles = async (): Promise<OverheadProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('overhead_profiles')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching overhead profiles:', error);
      throw new Error(error.message);
    }
    
    return (data || []).map(profile => dbToOverheadProfile(profile));
  } catch (error) {
    console.error('Error in fetchOverheadProfiles:', error);
    throw error;
  }
};
