
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { SiteFormData } from '../siteFormTypes';
import { useSiteOperations } from '@/hooks/useSiteOperations';

export function useCreateSiteFormSubmit(formData: SiteFormData) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createSite } = useSiteOperations();

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await createSite(formData);
      navigate('/sites');
    } catch (error) {
      // Error handling is done in useSiteOperations
      console.error('Site creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [createSite, formData, navigate, isSubmitting]);

  return {
    handleSubmit,
    isSubmitting
  };
}
