
import React from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { FormValidationErrors } from '@/components/sites/forms/types/validationUtils';

export const useSiteFormStepper = (
  formData: SiteFormData,
  errors: FormValidationErrors
) => {
  const steps = [
    {
      id: 'basic-info',
      title: 'Basic Info',
      description: 'Site details and location',
      isComplete: () => isBasicInfoComplete(formData, errors),
    },
    {
      id: 'contacts',
      title: 'Contacts',
      description: 'Site contacts and roles',
      isComplete: () => isContactsComplete(formData, errors),
    },
    {
      id: 'contract',
      title: 'Contract',
      description: 'Contract details and terms',
      isComplete: () => isContractComplete(formData, errors),
    },
    {
      id: 'billing',
      title: 'Billing',
      description: 'Billing details and methods',
      isComplete: () => isBillingComplete(formData, errors),
    },
    {
      id: 'subcontractors',
      title: 'Subcontractors',
      description: 'Subcontractor information',
      isComplete: () => isSubcontractorsComplete(formData, errors),
    },
    {
      id: 'replenishables',
      title: 'Replenishables',
      description: 'Stock and supplies',
      isComplete: () => isReplenishablesComplete(formData, errors),
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Review and submit',
      isComplete: () => true,
    },
  ];
  
  return { steps };
};

// Helper functions to check completion status for each step
function isBasicInfoComplete(formData: SiteFormData, errors: FormValidationErrors): boolean {
  const requiredFields = ['name', 'client_id', 'address', 'city', 'state', 'postalCode', 'country'];
  const hasAllRequiredFields = requiredFields.every(field => 
    formData[field as keyof SiteFormData] !== undefined && 
    formData[field as keyof SiteFormData] !== ''
  );
  
  // Check if there are any errors related to basic info
  const hasBasicInfoErrors = Object.keys(errors).some(key => 
    requiredFields.includes(key)
  );
  
  return hasAllRequiredFields && !hasBasicInfoErrors;
}

function isContactsComplete(formData: SiteFormData, errors: FormValidationErrors): boolean {
  const hasContacts = formData.contacts && formData.contacts.length > 0;
  
  // Check if there are any errors related to contacts
  const hasContactErrors = Object.keys(errors).some(key => 
    key.startsWith('contacts')
  );
  
  return hasContacts && !hasContactErrors;
}

function isContractComplete(formData: SiteFormData, errors: FormValidationErrors): boolean {
  const hasContract = formData.contract_details && 
    formData.contract_details.startDate && 
    formData.contract_details.endDate;
  
  // Check if there are any errors related to contract
  const hasContractErrors = Object.keys(errors).some(key => 
    key.startsWith('contract_details')
  );
  
  return hasContract && !hasContractErrors;
}

function isBillingComplete(formData: SiteFormData, errors: FormValidationErrors): boolean {
  // Simplified check - just making sure we have some billing details
  const hasBillingDetails = formData.billingDetails !== undefined;
  
  // Check if there are any errors related to billing
  const hasBillingErrors = Object.keys(errors).some(key => 
    key.startsWith('billingDetails')
  );
  
  return hasBillingDetails && !hasBillingErrors;
}

function isSubcontractorsComplete(formData: SiteFormData, errors: FormValidationErrors): boolean {
  // No required subcontractors, so always consider complete if no errors
  const hasSubcontractorErrors = Object.keys(errors).some(key => 
    key.startsWith('subcontractors')
  );
  
  return !hasSubcontractorErrors;
}

function isReplenishablesComplete(formData: SiteFormData, errors: FormValidationErrors): boolean {
  // No required replenishables, so always consider complete if no errors
  const hasReplenishableErrors = Object.keys(errors).some(key => 
    key.startsWith('replenishables')
  );
  
  return !hasReplenishableErrors;
}
