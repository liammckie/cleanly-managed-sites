
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { mapToDb } from '@/lib/mappers';
import type { Json } from '@/types/common';

export interface SiteFormData {
  name: string;
  address?: string;
  email?: string;
  customId?: string;
  contractDetails?: Json;
  billingDetails?: Json;
  // Add other fields as required
}

export function useSiteCreate(user: { id: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSite = async (formData: SiteFormData) => {
    try {
      setIsSubmitting(true);
      const payload = { ...formData, userId: user.id };
      const { data, error } = await supabase
        .from('sites')
        .insert(mapToDb(payload))
        .select()
        .single();
      if (error) throw new Error(error.message);
      toast.success('Site created successfully');
      return data;
    } catch (error: any) {
      toast.error(`Failed to create site: ${error.message}`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createSite, isSubmitting };
}
