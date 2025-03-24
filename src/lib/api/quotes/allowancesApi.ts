
import { supabase } from '@/lib/supabase';

// Fetch allowances
export const fetchAllowances = async () => {
  const { data, error } = await supabase
    .from('allowances')
    .select('*');
  
  if (error) {
    console.error('Error fetching allowances:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};
