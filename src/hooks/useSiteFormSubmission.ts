
import { useState } from 'react';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { toast } from 'sonner';

export function useSiteFormSubmission(siteId?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createSite } = useSiteCreate();
  const { updateSite } = useSiteUpdate();

  const handleSubmit = async (formData: SiteFormData, onSuccess?: (data: any) => void) => {
    try {
      setIsSubmitting(true);
      
      let result;
      if (siteId) {
        // Update existing site
        result = await updateSite({ id: siteId, data: formData });
      } else {
        // Create new site
        result = await createSite(formData);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while saving the site');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { 
    handleSubmit, 
    isSubmitting 
  };
}
