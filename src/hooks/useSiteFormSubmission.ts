
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { validateSiteForm } from '@/components/sites/forms/types/validationUtils';

export function useSiteFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const { createSite } = useSiteCreate();
  const { updateSite } = useSiteUpdate();
  
  const submitSiteForm = async (formData: SiteFormData, mode: 'create' | 'edit', siteId?: string) => {
    setIsSubmitting(true);
    setErrors([]);
    
    try {
      const validationResult = validateSiteForm(formData);
      
      if (!validationResult.isValid) {
        setErrors(validationResult.errors || []);
        setIsSubmitting(false);
        return null;
      }
      
      if (mode === 'create') {
        const result = await createSite(formData);
        toast.success(`${formData.name} has been successfully created.`);
        navigate(`/sites/${result.id}`);
        return result;
      } else if (mode === 'edit' && siteId) {
        const result = await updateSite({
          id: siteId,
          data: formData
        });
        toast.success(`${formData.name} has been successfully updated.`);
        return result;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error saving site:', error);
      setErrors([error.message || 'An error occurred while saving the site. Please try again.']);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    submitSiteForm,
    isSubmitting,
    errors
  };
}
