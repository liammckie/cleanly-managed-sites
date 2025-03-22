
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
  industry?: string;
  description?: string;
  business_hours?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

/**
 * Get business details for the current user
 */
export const getBusinessDetails = async (): Promise<BusinessDetails | null> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from('business_details')
      .select('*')
      .eq('user_id', user.user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching business details:', error);
      return null;
    }

    return data as BusinessDetails;
  } catch (error) {
    console.error('Error fetching business details:', error);
    return null;
  }
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
    .maybeSingle();

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
      throw new Error(`Error updating business details: ${error.message}`);
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
      throw new Error(`Error creating business details: ${error.message}`);
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
  const filePath = `${fileName}`;
  
  console.log('Uploading logo:', filePath);
  
  try {
    // Check if the bucket exists and create it if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketName = 'business-assets';
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('Creating bucket:', bucketName);
      const { error: bucketError } = await supabase.storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
        });
      
      if (bucketError) {
        console.error('Error creating storage bucket:', bucketError);
        throw new Error(`Error creating storage bucket: ${bucketError.message}`);
      }
    }
    
    // Upload the file
    console.log('Uploading file to storage');
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      throw new Error(`Error uploading logo: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('File uploaded successfully, public URL:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadBusinessLogo:', error);
    throw error;
  }
};
