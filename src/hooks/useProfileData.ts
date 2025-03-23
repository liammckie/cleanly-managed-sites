
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  avatar_url: string;
}

export function useProfileData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    title: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      // Use first_name and last_name from the database if they exist
      const firstName = data.first_name || '';
      const lastName = data.last_name || '';
      
      setProfile(data);
      setFormData({
        first_name: firstName,
        last_name: lastName,
        email: data.email || '',
        phone: data.phone || '',
        title: data.title || '',
        avatar_url: data.avatar_url || ''
      });
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const updates = {
        id: user?.id,
        full_name: `${formData.first_name} ${formData.last_name}`,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        title: formData.title,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user?.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Profile updated successfully');
      await fetchUserProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    // This would be implemented in a future update
    toast.info('Avatar upload functionality coming soon');
  };

  return {
    profile,
    formData,
    loading,
    handleInputChange,
    handleSubmit,
    handleAvatarUpload
  };
}
