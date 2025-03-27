
import { supabase } from '@/lib/supabase';

export async function getUserId() {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id || null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}
