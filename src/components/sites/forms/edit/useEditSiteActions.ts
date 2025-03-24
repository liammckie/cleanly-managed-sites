
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { sitesApi } from '@/lib/api/sites';
import { SiteRecord } from '@/lib/types';
import { SiteFormData } from '../siteFormTypes';

export function useEditSiteActions(site: SiteRecord, formData: SiteFormData) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Call API to update site data
      await sitesApi.updateSite(site.id, formData);
      
      // Show success message
      toast.success('Site updated successfully');
      
      // Navigate back to site details page
      navigate(`/sites/${site.id}`);
    } catch (error) {
      console.error('Error updating site:', error);
      toast.error('Failed to update site');
    } finally {
      setIsSaving(false);
    }
  };
  
  return { isSaving, handleSubmit };
}
