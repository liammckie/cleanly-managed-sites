
import { supabase } from '@/lib/supabase';

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserId() {
  const user = await getCurrentUser();
  return user?.id;
}

export async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return data;
}

export async function isUserAdmin() {
  const { data } = await supabase.rpc('check_if_user_is_admin', {
    user_uuid: (await getCurrentUser())?.id
  });
  
  return !!data;
}
