
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SiteFormData } from '../siteFormTypes';
import { sitesApi } from '@/lib/api';

export const useCreateSiteFormSubmit = (formData: SiteFormData) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isSubmitting) {
        console.log('Already submitting - preventing duplicate submission');
        return;
      }
      
      setIsSubmitting(true);
      
      // Show initial toast
      const toastId = toast.loading("Creating site...");
      
      // Process form data here
      console.log('Submitting form data:', formData);
      
      // Validate critical fields before submission
      if (!formData.name || !formData.address || !formData.clientId) {
        toast.error("Missing required information. Please check the form.", { id: toastId });
        setIsSubmitting(false);
        return;
      }
      
      // Also check for at least one contact
      if (!formData.contacts || formData.contacts.length === 0) {
        toast.error("At least one contact is required. Please add contacts in step 2.", { id: toastId });
        setIsSubmitting(false);
        return;
      }
      
      // Submit to API
      const result = await sitesApi.createSite(formData);
      
      // Update toast to success
      toast.success("Site created successfully!", { id: toastId });
      
      // Redirect to the site detail page
      setTimeout(() => {
        navigate(`/sites/${result.id}`);
      }, 1000);
      
    } catch (error: any) {
      console.error('Error creating site:', error);
      
      // Show specific error message if available
      if (error.message) {
        toast.error(`Failed to create site: ${error.message}`);
      } else {
        toast.error("Failed to create site. Please try again.");
      }
      
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
