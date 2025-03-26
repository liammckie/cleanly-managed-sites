
import { supabase } from '@/integrations/supabase/client';
import { OverheadProfile, DbOverheadProfile } from '@/types/models';
import { dbToOverheadProfile } from '@/utils/typeAdapters';

export const fetchOverheadProfiles = async (): Promise<OverheadProfile[]> => {
  const { data, error } = await supabase
    .from('overhead_profiles')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching overhead profiles:', error);
    throw new Error(error.message);
  }
  
  return (data || []).map(profile => dbToOverheadProfile(profile as DbOverheadProfile));
};

export default {
  fetchOverheadProfiles
};
