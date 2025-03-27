
import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteStatus } from '@/types/common';

export function useSiteFormHandlers(initialFormData: SiteFormData) {
  const [formData, setFormData] = useState<SiteFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle status change
  const handleStatusChange = (status: SiteStatus) => {
    setFormData(prev => ({ ...prev, status }));
  };

  // Handle client change
  const handleClientChange = (clientId: string) => {
    // Update form data when client changes
    setFormData(prev => {
      // Make a copy of the previous state to avoid modifying it directly
      const updatedData: SiteFormData = {
        name: prev.name,
        address: prev.address,
        city: prev.city,
        state: prev.state,
        postalCode: prev.postalCode,
        country: prev.country,
        status: prev.status,
        client_id: clientId,
        client_name: prev.client_name,
        phone: prev.phone,
        email: prev.email,
        representative: prev.representative,
        customId: prev.customId,
        contract_details: prev.contract_details,
        contacts: prev.contacts || [],
        useClientInfo: prev.useClientInfo,
        billingDetails: prev.billingDetails,
        additionalContracts: prev.additionalContracts,
        subcontractors: prev.subcontractors,
        hasSubcontractors: prev.hasSubcontractors,
        monthlyCost: prev.monthlyCost,
        weeklyRevenue: prev.weeklyRevenue,
        monthlyRevenue: prev.monthlyRevenue,
        annualRevenue: prev.annualRevenue,
        replenishables: prev.replenishables,
        periodicals: prev.periodicals,
        adHocWorkAuthorization: prev.adHocWorkAuthorization,
        securityDetails: prev.securityDetails,
        jobSpecifications: prev.jobSpecifications,
        notes: prev.notes,
        // Aliases for backward compatibility
        contractDetails: prev.contractDetails,
        clientId: clientId,
        postcode: prev.postalCode
      };
      
      return updatedData;
    });
  };

  return { formData, setFormData, errors, setErrors, handleInputChange, handleStatusChange, handleClientChange };
}
