
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { SiteFormData } from '../siteFormTypes';
import { sitesApi } from '@/lib/api';

export function useCreateSiteFormSubmit(formData: SiteFormData) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Use the API to create the site - the API handles all the related operations
      const createdSite = await sitesApi.createSite(formData);
      
      toast.success("Site has been created successfully!");
      navigate('/sites');
    } catch (error) {
      console.error('Error creating site:', error);
      toast.error("Failed to create site. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
}
