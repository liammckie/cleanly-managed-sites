
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { SiteFormData } from '../siteFormTypes';
import { sitesApi } from '@/lib/api';
import { ContactRecord } from '@/lib/types';
import { handleSiteAdditionalContracts } from '@/lib/api/sites/additionalContractsApi';
import { handleSiteBillingLines } from '@/lib/api/sites/billingLinesApi';
import { handleSiteContacts } from '@/lib/api/sites/siteContactsApi';

export function useCreateSiteFormSubmit(formData: SiteFormData) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Use the actual API to create the site
      const createdSite = await sitesApi.createSite(formData);
      
      // Handle contacts if they exist
      if (formData.contacts && formData.contacts.length > 0) {
        try {
          await handleSiteContacts(
            createdSite.id,
            formData.contacts as ContactRecord[],
            createdSite.user_id
          );
        } catch (error) {
          console.error('Error handling site contacts:', error);
          // Continue with other operations
        }
      }
      
      // Handle additional contracts if they exist
      if (formData.additionalContracts && 
          formData.additionalContracts.length > 0) {
        try {
          await handleSiteAdditionalContracts(
            createdSite.id, 
            formData.additionalContracts,
            createdSite.user_id
          );
        } catch (error) {
          console.error('Error handling additional contracts:', error);
          // Continue with other operations
        }
      }
      
      // Handle billing lines if they exist
      if (formData.billingDetails && 
          formData.billingDetails.billingLines && 
          formData.billingDetails.billingLines.length > 0) {
        try {
          await handleSiteBillingLines(
            createdSite.id, 
            formData.billingDetails.billingLines
          );
        } catch (error) {
          console.error('Error handling billing lines:', error);
          // Continue with other operations
        }
      }
      
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
