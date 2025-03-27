
import { supabase } from '@/lib/supabase';

export interface Allowance {
  id: string;
  name: string;
  amount: number;
  unit: string;
  description?: string;
}

export const fetchAllowances = async (): Promise<Allowance[]> => {
  try {
    const { data, error } = await supabase
      .from('allowances')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching allowances:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAllowances:', error);
    throw error;
  }
};
