
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteRecord } from '@/lib/types';

export function useSiteFormSubmission(
  mode: 'create' | 'edit',
  formData: SiteFormData,
  validateForm: (data: SiteFormData) => boolean,
  initialData?: SiteRecord
) {
  const navigate = useNavigate();
  const { createSite, isCreating } = useSiteCreate();
  const { updateSite, isUpdating } = useSiteUpdate();
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form submission handler
  const handleSubmit = async () => {
    if (!validateForm(formData)) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      if (mode === 'create') {
        await createSite(formData);
        toast.success('Site created successfully!');
        navigate('/sites');
      } else if (mode === 'edit' && initialData) {
        await updateSite({ id: initialData.id, data: formData });
        toast.success('Site updated successfully!');
        navigate(`/sites/${initialData.id}`);
      }
    } catch (error: any) {
      console.error('Error submitting site form:', error);
      
      if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An unknown error occurred' });
      }
      
      toast.error('Failed to save site');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    errors,
    isSubmitting: isSubmitting || isCreating || isUpdating,
    handleSubmit
  };
}
