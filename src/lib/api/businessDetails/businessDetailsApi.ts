
import { supabase } from '@/lib/supabase';
import { Json } from '@/integrations/supabase/types';

export interface BusinessDetails {
  id: string;
  name: string;
  logo_url?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  phone?: string;
  email?: string;
  website?: string;
  tax_id?: string;
  user_id: string;
  updated_at: string;
  created_at: string;
}

/**
 * Get business details for the current user
 */
export const getBusinessDetails = async (): Promise<BusinessDetails | null> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  const { data, error } = await supabase
    .from('business_details')
    .select('*')
    .eq('user_id', user.user.id)
    .single();

  if (error) {
    console.error('Error fetching business details:', error);
    return null;
  }

  return data as BusinessDetails;
};

/**
 * Update business details for the current user
 */
export const updateBusinessDetails = async (details: Partial<BusinessDetails>): Promise<BusinessDetails | null> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  // First check if details exist
  const { data: existingData } = await supabase
    .from('business_details')
    .select('*')
    .eq('user_id', user.user.id)
    .single();

  let result;
  
  if (existingData) {
    // Update existing record
    const { data, error } = await supabase
      .from('business_details')
      .update({
        ...details,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating business details:', error);
      return null;
    }
    
    result = data;
  } else {
    // Create new record
    const { data, error } = await supabase
      .from('business_details')
      .insert({
        ...details,
        user_id: user.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating business details:', error);
      return null;
    }
    
    result = data;
  }

  return result as BusinessDetails;
};

/**
 * Upload a logo image to Supabase storage
 */
export const uploadBusinessLogo = async (file: File): Promise<string | null> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `logo-${user.user.id}-${Date.now()}.${fileExt}`;
  const filePath = `business-logos/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('business-assets')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading logo:', uploadError);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('business-assets')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};
